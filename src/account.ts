export let account:{id:string;name:string;username:string;role:string}|null=null;
export function setAccount(value:typeof account){account=value;}
export const accountStorage={
 getItem(key:string){return localStorage.getItem(key==='pq-language'?key:`pq-account:${account?.id||'preview'}:${key}`);},
 setItem(key:string,value:string){localStorage.setItem(key==='pq-language'?key:`pq-account:${account?.id||'preview'}:${key}`,value);}
};
