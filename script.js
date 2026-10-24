//PURE-START
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function gen(i){let a1,a0,b1,b0;
 if(i<3){a1=rnd(1,4);b1=rnd(1,4);a0=rnd(1,4);b0=rnd(1,4)}
 else if(i<6){do{a1=rnd(1,7);b1=rnd(1,7);a0=rnd(1,8);b0=rnd(1,8)}while(a1+b1>9||a0+b0>9)}
 else{do{a1=rnd(1,7);b1=rnd(1,7);a0=rnd(2,9);b0=rnd(2,9)}while(a0+b0<10||a1+b1>8)}
 const a=a1*10+a0,b=b1*10+b0;return{a,b,T:b1*10,O:b0,s:a+b}}
function makeQs(){const qs=[],seen=new Set();
 for(let i=0;i<10;i++){let q;do{q=gen(i)}while(seen.has(q.a+'+'+q.b));seen.add(q.a+'+'+q.b);qs.push(q)}return qs}
const SK=['Breaking apart numbers into tens and ones','Adding tens to a two-digit number','Adding the remaining ones','Finding the correct total'];
const TIP=['Practice breaking numbers into tens and ones.','Practice adding the tens to a two-digit number.','Practice adding the leftover ones.','Practice putting the tens and ones together to find the total.'];
function stats(rec){const n=rec.length;
 const acc=[0,1,2,3].map(s=>n?rec.filter(r=>r.ft[s]).length/n:0);
 const pts=rec.reduce((t,r)=>t+r.ft.reduce((x,y)=>x+y,0),0);
 return{n,acc,pts,max:4*n,correct:rec.filter(r=>r.ft[3]).length,pct:n?Math.round(100*pts/(4*n)):0}}
function advice(acc){const w=acc.map((v,i)=>[v,i]).filter(x=>x[0]<0.8).sort((a,b)=>a[0]-b[0]);
 return w.length?w.slice(0,2).map(x=>TIP[x[1]]).join(' '):'Great job! You are a Break Apart and Build star!'}
//PURE-END
const $=id=>document.getElementById(id);
let G=null,name='';
const show=id=>{['welcome','game','report'].forEach(s=>$(s).hidden=s!==id);window.scrollTo(0,0)};
const num=id=>{const v=$(id).value.trim();return v===''?null:+v};
function begin(){const v=$('nm').value.trim();if(!v){$('nmErr').textContent='Please type your name first.';$('nm').focus();return}name=v;newGame()}
function newGame(){G={qs:makeQs(),i:0,stars:0,pts:0,rec:[]};show('game');loadQ()}
function loadQ(){const q=G.qs[G.i];G.q=q;G.cur={phase:0,ft:[1,1,1,1]};
 $('who').textContent='👷 '+name;$('qn').textContent='Question '+(G.i+1)+' of '+G.qs.length;
 $('bar').style.width=(G.i/G.qs.length*100)+'%';$('qt').textContent='Question '+(G.i+1)+': '+q.a+' + '+q.b+' = ?';
 $('steps').innerHTML=
 `<div class="step" data-s="0"><b>Step 1:</b> Break apart ${q.b}.<div class="eq">${q.b} = <input id="i0a" inputmode="numeric" maxlength="2" placeholder="tens"> + <input id="i0b" inputmode="numeric" maxlength="2" placeholder="ones"> <button data-c="0">Check ✔</button></div></div>
 <div class="step" data-s="1"><b>Step 2:</b> Add the tens.<div class="eq"><span class="l"></span><input id="i1" inputmode="numeric" maxlength="3"> <button data-c="1">Check ✔</button></div></div>
 <div class="step" data-s="2"><b>Step 3:</b> Add the ones.<div class="eq"><span class="l"></span><input id="i2" inputmode="numeric" maxlength="3"> <button data-c="2">Check ✔</button></div></div>
 <div class="step" data-s="3"><b>Step 4:</b> Find the total.<div class="eq"><span class="l"></span><input id="i3" inputmode="numeric" maxlength="3"> <button data-c="3">Check ✔</button></div></div>`;
 $('fb').textContent='Let’s start! Break apart '+q.b+'.';$('fb').className='';
 $('next').hidden=true;$('hint').disabled=false;upd();renderModel(false);$('i0a').focus()}
function upd(){const q=G.q,p=G.cur.phase,L=document.querySelectorAll('.l');
 L[0].textContent=q.a+' + '+(p>=1?q.T:'?')+' = ';
 L[1].textContent=(p>=2?q.a+q.T:'?')+' + '+(p>=1?q.O:'?')+' = ';
 L[2].textContent=q.a+' + '+q.b+' = ';
 document.querySelectorAll('.step').forEach(el=>{const s=+el.dataset.s;
  el.classList.toggle('done',s<p);el.classList.toggle('locked',s>p);
  el.querySelectorAll('input,button').forEach(x=>x.disabled=s!==p)});
 $('stars').textContent='⭐ '+G.stars;$('score').textContent='Score: '+G.pts}
const rods=(n,nw)=>Array.from({length:n},(_,i)=>`<i class="rod${i>=n-nw?' drop':''}"></i>`).join('');
const cubes=(n,nw)=>Array.from({length:n},(_,i)=>`<i class="cube${i>=n-nw?' drop':''}"></i>`).join('');
const card=(cls,lab,r,c)=>`<div class="mcard ${cls}"><div class="lab">${lab}</div><div class="blocks"><div class="rods">${r}</div><div class="cubes">${c}</div></div></div>`;
function renderModel(anim){const q=G.q,p=G.cur.phase,a1=(q.a-q.a%10)/10,b1=q.T/10,P='<div class="plus">+</div>';
 const lab=p<2?q.a:p===2?q.a+q.T:q.s;
 let h=card('main'+(p===4?' done':''),lab,rods(a1+(p>=2?b1:0),anim&&p===2?b1:0),cubes(q.a%10+(p>=3?q.O:0),anim&&p===3?q.O:0));
 const pc=anim&&p===1?' pop':'';
 if(p===0)h+=P+card('second',q.b,rods(b1),cubes(q.O));
 if(p===1)h+=P+card('tens'+pc,q.T+' <small>tens</small>',rods(b1),'')+P+card('ones'+pc,q.O+' <small>ones</small>','',cubes(q.O));
 if(p===2)h+=P+card('ones','' +q.O+' <small>ones</small>','',cubes(q.O));
 $('model').innerHTML=h}
const OKS=['Great job!','You got it!','Awesome building!','Super!','Nice work!'];
const GO=['Now you have tens and ones. Add the tens first!','Tens done! Now add the ones.','Ones done! Now find the total.','You built it! ⭐ You earned a star!'];
const BAD=['Not quite. How many tens and how many ones are in '+'#'+'? Try again!','Not quite. Add the tens part to the first number. Try again!','Not quite. Add the ones to your new number. Try again!','Not quite. Put the tens and ones together. Try again!'];
const HINT=['Hint: Split the second number into tens and ones. How many tens? How many ones?','Hint: Start with the first number. Add only the tens part.','Hint: Take your last answer and add the ones.','Hint: Look at the blocks. Put all the tens and ones together!'];
function say(t,c){$('fb').textContent=t;$('fb').className=c||''}
function check(s){const q=G.q,c=G.cur;if(s!==c.phase)return;let ok,empty;
 if(s===0){const x=num('i0a'),y=num('i0b');empty=x===null||y===null;ok=!empty&&((x===q.T&&y===q.O)||(x===q.O&&y===q.T))}
 else{const v=num('i'+s);empty=v===null;ok=v===[0,q.a+q.T,q.a+q.T+q.O,q.s][s]}
 if(empty){say('Type a number in each box first.','bad');return}
 if(!ok){c.ft[s]=0;say(BAD[s].replace('#',q.b),'bad');const el=document.querySelector(`[data-s="${s}"]`);el.classList.remove('shake');void el.offsetWidth;el.classList.add('shake');
  const f=el.querySelector('input');f.select();f.focus();return}
 if(c.ft[s])G.pts++;c.phase++;
 say(OKS[Math.floor(Math.random()*OKS.length)]+' '+GO[s],'ok');
 const gone=s===1?'.tens':s===2?'.ones':null,el=gone&&document.querySelector(gone);
 if(el){el.classList.add('out');setTimeout(()=>renderModel(true),400)}else renderModel(true);
 if(s===3){G.stars++;G.rec.push({ft:[...c.ft]});$('bar').style.width=((G.i+1)/G.qs.length*100)+'%';
  $('next').hidden=false;$('next').textContent=G.i<G.qs.length-1?'Next Question ▶':'See My Report ⭐';$('hint').disabled=true;$('next').focus()}
 upd();const nx=document.getElementById('i'+(s===0?1:s+1));if(s<3&&nx)nx.focus()}
function report(){const S=stats(G.rec);show('report');$('rname').textContent=name;
 $('tiles').innerHTML=`<div class="tile"><b>${S.n}</b><span>Questions completed</span></div><div class="tile"><b>${S.correct} of ${S.n}</b><span>Final answers right on the first try</span></div><div class="tile"><b>${S.pts} / ${S.max}</b><span>Score (${S.pct}%)</span></div><div class="tile"><b>⭐ ${G.stars}</b><span>Stars earned</span></div>`;
 $('skills').innerHTML=SK.map((n,i)=>{const a=S.acc[i],m=a>=0.8;
  return `<div class="sk"><span>${n}</span><div class="sb"><i style="width:${Math.round(a*100)}%;background:${m?'#2e9d4a':'#fb8c00'}"></i></div><span class="st ${m?'ok':'bad'}">${m?'✅ Mastered':'🔧 Needs practice'}</span></div>`}).join('');
 $('rec').textContent=advice(S.acc)}
$('go').onclick=begin;$('nm').onkeydown=e=>{if(e.key==='Enter')begin()};
$('steps').addEventListener('click',e=>{const b=e.target.closest('button[data-c]');if(b)check(+b.dataset.c)});
$('steps').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.tagName==='INPUT')check(+e.target.closest('.step').dataset.s)});
$('steps').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'')});
$('hint').onclick=()=>{say(HINT[G.cur.phase],'');const m=$('model');m.classList.remove('hint');void m.offsetWidth;m.classList.add('hint');setTimeout(()=>m.classList.remove('hint'),2400)};
$('next').onclick=()=>{if(G.i<G.qs.length-1){G.i++;loadQ()}else report()};
$('again').onclick=newGame;$('newst').onclick=()=>{$('nm').value='';$('nmErr').textContent='';show('welcome');$('nm').focus()};$('print').onclick=()=>window.print();
