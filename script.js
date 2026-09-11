const modal=document.getElementById("modal"), content=document.getElementById("modalContent");
const closeBtn=document.getElementById("close"), toast=document.getElementById("toast"), countEl=document.getElementById("foundCount");
let found=new Set(), soundOn=true, audioCtx=null;

function tone(freq=440,dur=.06,type="sine"){
  if(!soundOn)return;
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.035,audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);
  o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur);
}
function mark(id){if(!found.has(id)){found.add(id);countEl.textContent=`${found.size} thing${found.size===1?"":"s"} found`;}}
function openModal(html,id){content.innerHTML=html;modal.classList.add("open");modal.setAttribute("aria-hidden","false");if(id)mark(id);tone(520,.05)}
function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");}
closeBtn.onclick=closeModal; modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
document.querySelectorAll(".tile").forEach(t=>t.onclick=()=>openTool(t.dataset.open));

function openTool(id){
 if(id==="illusion") openModal(`<h2>your eyes are lying.</h2><p>Stare at the middle for about 15 seconds. Then look at a blank wall.</p><div class="illusion-box"><span>KEEP LOOKING</span></div><p class="hint">The stripes aren't moving. Your brain just likes making stuff up.</p>`,"illusion");
 if(id==="reaction") reaction();
 if(id==="memory") memory();
 if(id==="science") science();
 if(id==="obvious") obvious();
 if(id==="soundtoy") soundtoy();
 if(id==="surprise") surprise();
 if(id==="secret") secret();
}

function reaction(){
 openModal(`<h2>don't jump the gun.</h2><p>Wait. The box will change. Tap it the moment it turns green.</p><div id="react" class="reaction-area wait">wait...</div><p id="reactText" class="hint"></p>`,"reaction");
 const r=document.getElementById("react"), txt=document.getElementById("reactText");
 let start,done=false,tooSoon=false;
 const delay=1200+Math.random()*3200;
 const timer=setTimeout(()=>{r.className="reaction-area ready";r.textContent="TAP NOW";start=performance.now();},delay);
 r.onclick=()=>{tone(680,.05);if(!start){clearTimeout(timer);r.textContent="TOO EARLY 😭";txt.textContent="okay okay, you couldn't wait. Try again by closing this and reopening it.";tooSoon=true;return}if(done)return;done=true;const ms=Math.round(performance.now()-start);r.textContent=`${ms} ms`;txt.textContent=ms<220?"that was suspiciously fast.":ms<350?"pretty quick.":"respectable. the screen won a little.";
 };
}

function memory(){
 const n=12, target=[1,4,7,10], html=`<h2>remember these.</h2><p>You'll see four squares light up. Then tap the same four.</p><div id="mem" class="memory-grid">${Array.from({length:n},(_,i)=>`<button class="memory-cell" data-i="${i}"></button>`).join("")}</div><p id="memText" class="hint">watch...</p>`;
 openModal(html,"memory");
 const cells=[...document.querySelectorAll(".memory-cell")], txt=document.getElementById("memText");
 target.forEach(i=>cells[i].classList.add("on"));
 setTimeout(()=>{cells.forEach(c=>c.classList.remove("on"));txt.textContent="your turn.";},1700);
 let hits=new Set();
 cells.forEach(c=>c.onclick=()=>{const i=+c.dataset.i;if(hits.has(i))return;hits.add(i);c.classList.add(target.includes(i)?"hit":"on");tone(target.includes(i)?600:180,.05);if(hits.size===n){txt.textContent=[...hits].every(i=>target.includes(i))?"clean sweep.":"close enough 😭";}});
}

function science(){
 const q=[["What happens to a marshmallow in a vacuum?","It expands","It freezes","Nothing",0],["Why does ice float?","It is lighter when solid","It has air inside","Water forgets gravity",0],["Can sound travel through space?","No","Yes, but quietly","Only at night",0]];
 const x=q[Math.floor(Math.random()*q.length)];
 openModal(`<h2>weird science.</h2><p>${x[0]}</p><div class="science-choice">${x.slice(1,4).map((a,i)=>`<button data-a="${i}">${a}</button>`).join("")}</div><div id="sci" class="result" style="display:none"></div>`,"science");
 document.querySelectorAll(".science-choice button").forEach(b=>b.onclick=()=>{const ok=+b.dataset.a===x[4],s=document.getElementById("sci");s.style.display="block";s.textContent=ok?"yep. somehow you knew.":"nope 😭 the answer is: "+x[x[4]+1];tone(ok?700:220,.07);});
}

let obviousClicks=0;
function obvious(){
 openModal(`<h2>don't tap this.</h2><p>There is absolutely no reason to press the button.</p><button id="dont" class="action">DO NOT PRESS</button><div id="obv"></div>`,"obvious");
 document.getElementById("dont").onclick=()=>{obviousClicks++;tone(180+obviousClicks*40,.05);const o=document.getElementById("obv");o.innerHTML=obviousClicks<4?`<p class="hint">you pressed it ${obviousClicks} time${obviousClicks>1?"s":""}.</p>`:`<div class="result">I literally told you 😭</div>`};
}

function soundtoy(){
 openModal(`<h2>tiny noise machine.</h2><p>Make a little rhythm. Headphones optional.</p><div class="sound-pad">${[261.63,329.63,392,523.25,659.25,783.99].map((f,i)=>`<button class="pad" data-f="${f}">${["C","E","G","C²","E²","G²"][i]}</button>`).join("")}</div>`,"soundtoy");
 document.querySelectorAll(".pad").forEach(b=>b.onclick=()=>tone(+b.dataset.f,.14,"triangle"));
}

const surprises=[
 "You are legally allowed to ignore this website for five minutes.",
 "Plot twist: there was never a point to this.",
 "Go drink some water. This is your reminder.",
 "I spent time making a button that says this.",
 "Somewhere on this page, there is a thing you haven't clicked yet.",
 "Okay. One more thing: check the photos."
];
function surprise(){
 const text=surprises[Math.floor(Math.random()*surprises.length)];
 openModal(`<h2>surprise.</h2><div class="surprise">${text}</div><button id="again" class="action">again</button>`,"surprise");
 document.getElementById("again").onclick=()=>{tone(540,.04);document.querySelector(".surprise").textContent=surprises[Math.floor(Math.random()*surprises.length)]};
}

function secret(){
 openModal(`<div class="secret-note"><div class="eyebrow">YOU FOUND THE QUIET BIT</div><div class="reveal">Anyway.<small>I hope you're having fun here.<br><br>I just wanted to make you something you'd actually enjoy messing around with.</small></div><button id="keep" class="action alt">keep looking</button></div>`,"secret");
 document.getElementById("keep").onclick=()=>{tone(760,.08);document.getElementById("keep").textContent="there's still more. keep looking.";setTimeout(()=>toastMsg("look very, very closely 👀"),350)};
}

document.querySelectorAll(".photo").forEach(p=>p.onclick=()=>{
 const src=p.querySelector("img").src;
 openModal(`<img class="full-photo" src="${src}" alt="Nicole"><p class="hint">yeah. I was putting these somewhere. obviously.</p>`,"photo"+p.dataset.photo);
});

document.getElementById("soundBtn").onclick=()=>{
 soundOn=!soundOn;document.getElementById("soundBtn").textContent=`sound: ${soundOn?"on":"off"}`;if(soundOn)tone(500,.07);
};
function toastMsg(t){toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1800)}
document.getElementById("egg").onclick=()=>{mark("egg");toastMsg("okay you found the tiny hidden thing.");tone(820,.08)};

// A few deliberately non-obvious clickable details.
document.querySelector(".eyebrow").onclick=()=>{mark("header");toastMsg("you clicked the heading. respect.");tone(620,.05)};
document.querySelector(".bottom-note span:last-child").onclick=()=>{mark("bottom");toastMsg("good luck indeed.");tone(260,.05)};
