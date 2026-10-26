import {readFileSync,writeFileSync} from 'node:fs';
writeFileSync('dist/_worker.js',readFileSync('server/worker.mjs','utf8').replace(/export (?=(?:const|async function|function) )/g,''));
writeFileSync('dist/_routes.json',JSON.stringify({version:1,include:['/*'],exclude:[]}));
console.log('Server authorization enabled for every route; no static bypass.');
