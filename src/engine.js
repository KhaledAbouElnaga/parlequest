export const normalize = s => s.normalize('NFC').trim().toLocaleLowerCase('fr').replace(/[’]/g,"'").replace(/\s+/g,' ');
export const isCorrect = (answer, accepted) => accepted.some(a=>normalize(a)===normalize(answer));
export const fresh = () => ({version:1, results:{}, history:[], errors:{}, started:false});
export function record(state,id,good,skill,tag){
 if(state.results[id]) return state;
 return {...state,results:{...state.results,[id]:{good,skill,tag}},errors:{...state.errors,[tag]:(state.errors[tag]||0)+(good?0:1)}};
}
export const xp = state => Object.values(state.results).reduce((n,r)=>n+(r.good?20:5),0);
export function load(storage){try {const s=JSON.parse(storage.getItem('parlequest-v1')); if(s?.version===1 && s.results && Array.isArray(s.history) && s.errors && Object.values(s.results).every(r=>r && typeof r.good==='boolean' && typeof r.skill==='string') && s.history.every(h=>h && typeof h.text==='string' && typeof h.node==='string')) return s;}catch{} return fresh();}
