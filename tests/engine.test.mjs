import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fresh,record,xp,isCorrect,load} from '../src/engine.js';
test('French normalization preserves meaningful accents',()=>{assert.ok(isCorrect('  Arrivées  ',['arrivées']));assert.ok(!isCorrect('arrivees',['arrivées']));});
test('First attempt fixes points and errors; retries cannot farm XP',()=>{let s=record(fresh(),'e1',false,'Grammaire','accord');assert.equal(xp(s),5);s=record(s,'e1',true,'Grammaire','accord');assert.equal(xp(s),5);assert.equal(s.errors.accord,1);s=record(s,'e2',true,'Grammaire','articles');assert.equal(xp(s),25);});
test('Persistence round-trip and corrupt storage recover',()=>{const s=record(fresh(),'e1',true,'Grammaire','accord');assert.deepEqual(load({getItem:()=>JSON.stringify(s)}),s);assert.deepEqual(load({getItem:()=>'{bad'}),fresh());assert.deepEqual(load({getItem:()=>JSON.stringify({version:1})}),fresh());assert.deepEqual(load({getItem:()=>{throw Error()}}),fresh());});
