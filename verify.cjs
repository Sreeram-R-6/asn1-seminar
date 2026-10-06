const fs = require('node:fs');
const assert = require('node:assert/strict');
const {JSDOM} = require('./.tools/test-runtime/node_modules/jsdom');
async function verify(){
  const errors=[];
  const dom=new JSDOM(fs.readFileSync('index.html','utf8'),{url:'http://localhost:8000',runScripts:'outside-only',pretendToBeVisual:true});
  const w=dom.window,d=w.document;
  w.matchMedia=()=>({matches:false,addEventListener(){}});w.scrollTo=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
  w.addEventListener('error',e=>errors.push(e.error));
  let fullscreen=null,requests=0,printed=false,rejectFullscreen=false;
  Object.defineProperty(d,'fullscreenElement',{get:()=>fullscreen});
  d.documentElement.requestFullscreen=async options=>{requests++;assert.equal(options.navigationUI,'hide');if(rejectFullscreen)throw Error('Denied');fullscreen=d.documentElement;d.dispatchEvent(new w.Event('fullscreenchange'))};
  d.exitFullscreen=async()=>{fullscreen=null;d.dispatchEvent(new w.Event('fullscreenchange'))};
  w.print=()=>{printed=true};w.eval(fs.readFileSync('app.js','utf8'));
  const q=s=>d.querySelector(s),click=s=>{assert(q(s),`Missing ${s}`);q(s).click()},goto=n=>click(`#progress-dots [data-goto="${n}"]`);
  const input=(selector,value)=>{q(selector).value=value;q(selector).dispatchEvent(new w.Event('input',{bubbles:true}))};
  const key=k=>d.dispatchEvent(new w.KeyboardEvent('keydown',{key:k,bubbles:true}));
  const tick=()=>new Promise(resolve=>setImmediate(resolve));
  const count=d.querySelectorAll('#progress-dots button').length;
  assert.equal(count,20);assert.match(q('#slide').textContent,/Many machines/);assert.match(q('#slide').textContent,/values it is allowed to contain/);
  assert(q('#previous').disabled);assert(q('#edge-previous').disabled);
  const titles=[];
  for(let i=0;i<count;i++){
    goto(i);titles.push(q('#slide h1').textContent);assert.equal(q('#slide-count').textContent,`${String(i+1).padStart(2,'0')} / ${count}`);
    assert(q('#note-text').textContent.length>50);
    assert.equal(d.querySelectorAll('#slide [id]').length,new Set([...d.querySelectorAll('#slide [id]')].map(e=>e.id)).size);
    assert(!q('#quiz-question'));assert(!q('#ber-type'));
  }
  assert(q('#next').disabled);assert(q('#edge-next').disabled);
  assert(titles.slice(-4).every((t,i)=>t.startsWith(['P9-17','P9-18','P9-20','P9-21'][i])));
  assert(!titles.some(t=>/network management|encoding lab|Your turn/i.test(t)));
  goto(1);assert.match(q('#slide').textContent,/schema/);goto(2);assert.match(q('#slide').textContent,/Abstract/);
  goto(3);click('[data-interpret="letter"]');assert.match(q('#bit-answer').textContent,/character A/);
  goto(7);for(let i=0;i<8;i++){click(`[data-type="${i}"]`);assert(q('#type-detail h3').textContent)}
  goto(9);for(const [n,valid] of [[14,false],[15,true],[22,true],[40,true],[41,false]]){input('#class-size',n);assert.equal(!q('#class-valid').classList.contains('invalid'),valid)}
  goto(11);click('#reveal-record');click('#reveal-record');click('#reveal-record');assert(q('#reveal-record').disabled);click('#reset-record');assert(!q('#reveal-record').disabled);
  goto(0);click('#present');await tick();assert.equal(requests,1);assert(fullscreen);assert(d.body.classList.contains('presenting'));assert(!d.body.classList.contains('hud-visible'));assert(!q('#edge-next').hidden);
  click('#edge-next');assert.match(q('#slide-count').textContent,/02/);click('#edge-previous');assert.match(q('#slide-count').textContent,/01/);
  key('h');assert(d.body.classList.contains('hud-visible'));key('h');assert(!d.body.classList.contains('hud-visible'));
  key('Escape');await tick();assert(!fullscreen);assert(!d.body.classList.contains('presenting'));assert(q('#edge-next').hidden);
  click('#present');await tick();fullscreen=null;d.dispatchEvent(new w.Event('fullscreenchange'));assert(!d.body.classList.contains('presenting'));
  rejectFullscreen=true;click('#present');await tick();assert(d.body.classList.contains('presenting'));assert(!fullscreen);assert.match(q('#toast').textContent,/blocked or unavailable/);key('Escape');await tick();assert(!d.body.classList.contains('presenting'));
  click('#notes-toggle');assert(!q('#teaching-notes').hidden);click('#notes-toggle');assert(q('#teaching-notes').hidden);
  goto(0);key('ArrowRight');assert.match(q('#slide-count').textContent,/02/);assert(!q('#slide .animate'));
  click('#overview');assert(q('#overview-dialog').open);click('#overview-dialog [data-goto="16"]');assert(!q('#overview-dialog').open);assert.match(q('#slide h1').textContent,/P9-17/);
  click('#autoplay');assert.equal(q('#autoplay').getAttribute('aria-pressed'),'true');click('#next');assert.equal(q('#autoplay').getAttribute('aria-pressed'),'false');
  click('#sources');click('#print');assert(printed);assert.equal(d.querySelectorAll('.print-slide').length,20);
  const printText=q('#print-deck').textContent;
  for(const p of ['P9-17','P9-18','P9-20','P9-21'])assert(printText.includes(p));
  assert(!printText.includes('Quiz complete'));assert(!printText.includes('P9-19'));
  w.dispatchEvent(new w.Event('afterprint'));assert.equal(q('#print-deck').children.length,0);click('#sources-dialog [data-close]');goto(7);assert(q('#slide #type-detail h3'));
  assert.equal(errors.length,0,errors.map(String).join('\n'));
  dom.window.close();console.log('PASS: 20 ASN.1 slides, expanded introduction, four textbook answers, fullscreen request/exit/rejection handlers, hidden HUD, H toggle, edge navigation, constraints, records, chapters and print deck. Native browser fullscreen not verified.');
}
verify().catch(e=>{console.error(e);process.exit(1)});
