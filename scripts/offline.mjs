import {readdirSync,writeFileSync,readFileSync} from 'node:fs';
const assets=readdirSync('dist/assets').map(f=>'./assets/'+f);
const version='pq-'+Date.now();
writeFileSync('dist/sw.js',`const CACHE=${JSON.stringify(version)};const FILES=${JSON.stringify(['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',...assets])};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pq-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;const url=new URL(e.request.url);const base=new URL('./',self.location).pathname;const isAsset=url.pathname.startsWith(base+'assets/')||/\.(png|webmanifest)$/.test(url.pathname);if(e.request.mode!=='navigate'&&!isAsset)return;if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).catch(()=>caches.match(new URL('./index.html',self.location).href)));return;}e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));});`);
console.log('Offline cache generated:',assets.length,'bundles');
