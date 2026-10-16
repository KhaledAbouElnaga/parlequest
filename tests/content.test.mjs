import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=ts.transpileModule(readFileSync(new URL('../src/content.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {scenes,exercises,cultures}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
test('Every dialogue branch terminates and every scene is reachable',()=>{const ids=new Set(scenes.map(s=>s.id));assert.equal(ids.size,scenes.length);const reached=new Set();function visit(id,path=[]){assert.ok(ids.has(id),'Missing target '+id);assert.ok(!path.includes(id),'Cycle '+id);reached.add(id);const scene=scenes.find(s=>s.id===id);for(const c of scene.choices){assert.ok(c.feedback);assert.ok(c.next);visit(c.next,[...path,id]);}}visit('accueil');assert.equal(reached.size,scenes.length);assert.equal(scenes.find(s=>s.id==='fin').choices.length,0);});
test('Exercises contain target and nonempty, distinct corrections',()=>{assert.equal(new Set(exercises.map(e=>e.id)).size,exercises.length);for(const e of exercises){assert.ok(e.sentence.includes(e.target));assert.ok(e.answers.length);assert.ok(e.answers.every(a=>a.trim()&&a!==e.target));assert.ok(e.explanation&&e.tag);}});
test('Cultural decisions include contrasted, explained choices',()=>{for(const c of cultures){assert.ok(c.choices.some(x=>x.good));assert.ok(c.choices.some(x=>!x.good));assert.ok(c.choices.every(x=>x.feedback));}});
