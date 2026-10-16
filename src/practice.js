export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export function dailyIndex(day,length,salt=0){let n=salt;for(const c of day)n=(n*31+c.charCodeAt(0))>>>0;return length?n%length:0;}
export function nextReview(previous,good,now=Date.now()){const streak=good?Math.min((previous?.streak||0)+1,4):0;const days=good?[1,3,7,14][streak-1]:0;return {streak,due:now+(good?days*86400000:600000),lastGood:good};}
export function reviewQueue(bank,results,reviews,now=Date.now()){return bank.filter(q=>results[q.id]?.good===false||reviews[q.id]).filter(q=>!reviews[q.id]||reviews[q.id].due<=now).sort((a,b)=>(reviews[a.id]?.due||0)-(reviews[b.id]?.due||0));}
