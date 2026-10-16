import test from 'node:test';
import assert from 'node:assert/strict';
import {dayKey,dailyIndex,nextReview,reviewQueue} from '../src/practice.js';
test('daily choice is stable, level pool bounded, and uses local calendar date',()=>{assert.equal(dayKey(new Date(2026,9,16,0,1)),'2026-10-16');assert.equal(dailyIndex('2026-10-16',250),dailyIndex('2026-10-16',250));assert.ok(dailyIndex('2026-10-16',250)<250);assert.notEqual(dailyIndex('2026-10-16',250),dailyIndex('2026-10-17',250));});
test('review spacing advances 1, 3, 7, 14 days and errors reset to ten minutes',()=>{let r;for(const days of [1,3,7,14,14]){r=nextReview(r,true,1000);assert.equal(r.due,1000+days*86400000);}r=nextReview(r,false,1000);assert.equal(r.streak,0);assert.equal(r.due,601000);assert.equal(nextReview(r,true,1000).due,86401000);});
test('only due reviews or unscheduled grammar mistakes enter the notebook',()=>{const bank=[{id:'a'},{id:'b'},{id:'c'},{id:'d'}];assert.deepEqual(reviewQueue(bank,{a:{good:false},b:{good:true},c:{good:false}},{c:{due:2000},d:{due:900}},1000).map(q=>q.id),['a','d']);});
