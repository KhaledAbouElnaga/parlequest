const enc=new TextEncoder();
const COOKIE='__Host-pq_session';
const hours=12*60*60;
export const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');
export const digest=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s))),n=>n.toString(16).padStart(2,'0')).join('');
export function normalizeUsername(s){return typeof s==='string'?s.trim().toLowerCase():'';}
export function validUsername(s){return /^[a-z0-9][a-z0-9._+@-]{2,119}$/.test(s);}
const validPassword=p=>typeof p==='string'&&p.length>=12&&p.length<=128;
function equal(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}
export async function hashPassword(password,pepper,salt=token()){
 const key=await crypto.subtle.importKey('raw',enc.encode(pepper),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const secret=await crypto.subtle.sign('HMAC',key,enc.encode(password));
 const material=await crypto.subtle.importKey('raw',secret,'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},material,256);
 return `pq1$${salt}$${Array.from(new Uint8Array(bits),n=>n.toString(16).padStart(2,'0')).join('')}`;
}
export async function verifyPassword(p,hash,pepper){if(!hash?.startsWith('pq1$'))return false;const parts=hash.split('$');if(parts.length!==3)return false;return equal(await hashPassword(p,pepper,parts[1]),hash);}
const headers={'Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','X-Frame-Options':'DENY'};
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{...headers,'Content-Type':'application/json; charset=utf-8',...extra}});
const fail=(code,status)=>json({error:code},status);
const cookie=(value,maxAge=hours)=>`${COOKIE}=${value}; Path=/; Secure; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`;
async function session(req,env){const value=(req.headers.get('Cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);if(!/^[a-f0-9]{64}$/.test(value||''))return null;const tokenHash=await digest(value);const u=await env.AUTH_DB.prepare('SELECT u.id,u.username,u.display_name,u.role,u.status FROM pq_sessions s JOIN pq_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>?').bind(tokenHash,Date.now()).first();return u?.status==='approved'?{...u,tokenHash}:null;}
async function limit(env,key,count,ttl){const now=Date.now();const row=await env.AUTH_DB.prepare('INSERT INTO pq_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<=? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<=? THEN excluded.expires_at ELSE expires_at END RETURNING count').bind(key,now+ttl,now,now).first();return row.count<=count;}
async function audit(env,actor,target,action){await env.AUTH_DB.prepare('INSERT INTO pq_audit VALUES(?,?,?,?,?)').bind(crypto.randomUUID(),actor,target,action,Date.now()).run();}
const publicFiles=new Set(['/auth.css','/auth.js','/icon-192.png','/icon-512.png','/manifest.webmanifest']);
const publicPages=new Set(['/login','/request-access','/activate']);
const clearWorker=`self.addEventListener('install',e=>e.waitUntil(self.skipWaiting()));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pq-')).map(k=>caches.delete(k)))).then(()=>self.registration.unregister()).then(()=>self.clients.matchAll({type:'window'})).then(cs=>Promise.all(cs.map(c=>c.navigate('/login'))))));`;
async function asset(req,env,path){const url=new URL(req.url);if(path)url.pathname=path;const result=await env.ASSETS.fetch(new Request(url,{method:'GET'}));const h=new Headers(result.headers);for(const [k,v]of Object.entries(headers))h.set(k,v);h.set('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'");return new Response(req.method==='HEAD'?null:result.body,{status:result.status,headers:h});}
export default {async fetch(req,env){
 try{
 const url=new URL(req.url),path=url.pathname;
 if(path==='/sw.js')return new Response(clearWorker,{headers:{...headers,'Content-Type':'application/javascript','Service-Worker-Allowed':'/'}});
 if(publicPages.has(path)&&['GET','HEAD'].includes(req.method))return asset(req,env,'/auth');
 if(publicFiles.has(path)&&['GET','HEAD'].includes(req.method))return asset(req,env);
 if(!env.AUTH_DB||typeof env.AUTH_PEPPER!=='string'||env.AUTH_PEPPER.length<32)return fail('AUTH_NOT_CONFIGURED',503);
 if(req.method==='POST'){
  if(req.headers.get('Origin')!==url.origin||!req.headers.get('Content-Type')?.startsWith('application/json'))return fail('INVALID_ORIGIN',403);
  if(Number(req.headers.get('Content-Length'))>8192)return fail('BODY_TOO_LARGE',413);
 }
 if(path.startsWith('/api/auth/')||path.startsWith('/api/admin/')){
  const ip=await digest(env.AUTH_PEPPER+'|'+(req.headers.get('CF-Connecting-IP')||'unknown'));
  const body=async()=>{const text=await req.text();if(text.length>8192)throw Error('BAD_BODY');try{return JSON.parse(text);}catch{throw Error('BAD_BODY');}};
  if(path==='/api/auth/login'&&req.method==='POST'){
   if(!await limit(env,'login:'+ip,12,600000))return fail('TRY_LATER',429);
   const b=await body(),username=normalizeUsername(b.username);if(!validUsername(username)||!validPassword(b.password))return fail('LOGIN_FAILED',401);
   const user=await env.AUTH_DB.prepare('SELECT * FROM pq_users WHERE username=?').bind(username).first();
   const ok=await verifyPassword(b.password,user?.password_hash||'pq1$dummy$'+'0'.repeat(64),env.AUTH_PEPPER);
   if(!user||!ok||user.status!=='approved')return fail('LOGIN_FAILED',401);
   const value=token();await env.AUTH_DB.prepare('INSERT INTO pq_sessions VALUES(?,?,?)').bind(await digest(value),user.id,Date.now()+hours*1000).run();
   return json({ok:true,role:user.role},200,{'Set-Cookie':cookie(value)});
  }
  if(path==='/api/auth/request'&&req.method==='POST'){
   if(!await limit(env,'request:'+ip,3,3600000))return fail('TRY_LATER',429);
   const b=await body(),username=normalizeUsername(b.username),name=typeof b.name==='string'?b.name.trim():'';
   if(!validUsername(username)||!validPassword(b.password)||!name||name.length>80)return fail('INVALID_FIELDS',400);
   const total=await env.AUTH_DB.prepare('SELECT COUNT(*) AS n FROM pq_users WHERE status=?').bind('pending').first();if(total.n>=500)return fail('TRY_LATER',429);
   const hash=await hashPassword(b.password,env.AUTH_PEPPER),now=Date.now();
   await env.AUTH_DB.prepare("INSERT OR IGNORE INTO pq_users(id,username,display_name,role,status,password_hash,created_at,updated_at) VALUES(?,?,?,'student','pending',?,?,?)").bind(crypto.randomUUID(),username,name,hash,now,now).run();
   return json({ok:true,message:'REQUEST_RECEIVED'});
  }
  if(path==='/api/auth/activate'&&req.method==='POST'){
   if(!await limit(env,'activate:'+ip,8,600000))return fail('TRY_LATER',429);
   const b=await body();if(!/^[a-f0-9]{64}$/.test(b.token||'')||!validPassword(b.password))return fail('INVALID_INVITATION',400);
   const hash=await digest(b.token);const user=await env.AUTH_DB.prepare("SELECT id FROM pq_users WHERE invite_hash=? AND invite_expires>? AND status='approved'").bind(hash,Date.now()).first();if(!user)return fail('INVALID_INVITATION',400);
   const passwordHash=await hashPassword(b.password,env.AUTH_PEPPER);const updated=await env.AUTH_DB.prepare("UPDATE pq_users SET password_hash=?,invite_hash=NULL,invite_expires=NULL,updated_at=? WHERE id=? AND invite_hash=? AND invite_expires>? AND status='approved'").bind(passwordHash,Date.now(),user.id,hash,Date.now()).run();if(updated.meta.changes!==1)return fail('INVALID_INVITATION',400);
   await env.AUTH_DB.prepare('DELETE FROM pq_sessions WHERE user_id=?').bind(user.id).run();return json({ok:true});
  }
  const user=await session(req,env);if(!user)return fail('UNAUTHENTICATED',401);
  if(path==='/api/auth/me'&&req.method==='GET')return json({id:user.id,username:user.username,name:user.display_name,role:user.role});
  if(path==='/api/auth/logout'&&req.method==='POST'){await env.AUTH_DB.prepare('DELETE FROM pq_sessions WHERE token_hash=?').bind(user.tokenHash).run();return json({ok:true},200,{'Set-Cookie':cookie('',0),'Clear-Site-Data':'"cache"'});}
  if(path==='/api/auth/password'&&req.method==='POST'){
   if(!await limit(env,'password:'+user.id,5,600000))return fail('TRY_LATER',429);const b=await body();if(!validPassword(b.password)||!validPassword(b.current))return fail('INVALID_FIELDS',400);
   const row=await env.AUTH_DB.prepare('SELECT password_hash FROM pq_users WHERE id=?').bind(user.id).first();if(!await verifyPassword(b.current,row.password_hash,env.AUTH_PEPPER))return fail('LOGIN_FAILED',401);
   await env.AUTH_DB.batch([env.AUTH_DB.prepare('UPDATE pq_users SET password_hash=?,updated_at=? WHERE id=?').bind(await hashPassword(b.password,env.AUTH_PEPPER),Date.now(),user.id),env.AUTH_DB.prepare('DELETE FROM pq_sessions WHERE user_id=?').bind(user.id)]);return json({ok:true},200,{'Set-Cookie':cookie('',0)});
  }
  if(!path.startsWith('/api/admin/'))return fail('NOT_FOUND',404);
  if(user.role!=='admin')return fail('FORBIDDEN',403);
  if(path==='/api/admin/users'&&req.method==='GET'){const r=await env.AUTH_DB.prepare('SELECT id,username,display_name,role,status,created_at FROM pq_users ORDER BY created_at DESC LIMIT 600').all();return json({users:r.results});}
  if(path==='/api/admin/decision'&&req.method==='POST'){
   const b=await body();if(!['approved','rejected','suspended'].includes(b.status)||typeof b.id!=='string')return fail('INVALID_FIELDS',400);
   const target=await env.AUTH_DB.prepare("SELECT * FROM pq_users WHERE id=? AND role='student'").bind(b.id).first();if(!target)return fail('NOT_FOUND',404);
   await env.AUTH_DB.batch([env.AUTH_DB.prepare('UPDATE pq_users SET status=?,updated_at=? WHERE id=?').bind(b.status,Date.now(),b.id),env.AUTH_DB.prepare('DELETE FROM pq_sessions WHERE user_id=?').bind(b.id)]);await audit(env,user.id,b.id,b.status);return json({ok:true});
  }
  if(path==='/api/admin/invite'&&req.method==='POST'){
   const b=await body(),username=normalizeUsername(b.username);if(!validUsername(username))return fail('INVALID_FIELDS',400);
   const old=await env.AUTH_DB.prepare('SELECT * FROM pq_users WHERE username=?').bind(username).first();if(old?.role==='admin')return fail('FORBIDDEN',403);
   const value=token(),now=Date.now(),id=old?.id||crypto.randomUUID();const inviteHash=await digest(value);
   await env.AUTH_DB.batch([env.AUTH_DB.prepare("INSERT INTO pq_users(id,username,display_name,role,status,password_hash,invite_hash,invite_expires,created_at,updated_at) VALUES(?,?,?,'student','approved',NULL,?,?,?,?) ON CONFLICT(username) DO UPDATE SET status='approved',password_hash=NULL,invite_hash=excluded.invite_hash,invite_expires=excluded.invite_expires,updated_at=excluded.updated_at").bind(id,username,typeof b.name==='string'?b.name.slice(0,80)||username:username,inviteHash,now+86400000,now,now),env.AUTH_DB.prepare('DELETE FROM pq_sessions WHERE user_id=?').bind(id)]);await audit(env,user.id,id,'invitation');return json({url:url.origin+'/activate#'+value});
  }
  return fail('NOT_FOUND',404);
 }
 if(!['GET','HEAD'].includes(req.method))return fail('METHOD_NOT_ALLOWED',405);
 const user=await session(req,env);if(!user){if(req.headers.get('Sec-Fetch-Dest')==='document'||path==='/'||path.endsWith('.html'))return new Response(null,{status:302,headers:{...headers,Location:'/login'}});return fail('UNAUTHENTICATED',401);}
 if(path==='/admin'){if(user.role!=='admin')return fail('FORBIDDEN',403);return asset(req,env,'/auth');}
 return asset(req,env);
 }catch(error){return fail(error.message==='BAD_BODY'?'INVALID_FIELDS':'TEMPORARILY_UNAVAILABLE',error.message==='BAD_BODY'?400:503);}
}};
