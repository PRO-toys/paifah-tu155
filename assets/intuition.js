'use strict';

const intuitionKey = 'paifah-tu155-intuition-v1';
const intuitionAnswers = {};
try {
  const saved = JSON.parse(localStorage.getItem(intuitionKey));
  intuitionScenes.forEach((scene,i) => {
    if (Number.isInteger(saved?.[i]) && scene.choices[saved[i]]) intuitionAnswers[i] = saved[i];
  });
} catch {}

const intuitionLink = i => i===0 ? '#play' : '#play-'+(i+1);
const playNumber = (value,digits=2) => new Intl.NumberFormat('th-TH',{maximumFractionDigits:digits}).format(value);

function playButtons(labels, initial, update) {
  const box=get('play-controls');
  box.innerHTML=`<div class="play-buttons" role="group" aria-label="เปลี่ยนข้อมูลในภาพ">${labels.map((label,i)=>
    `<button class="button quiet" type="button" data-play-switch="${i}" aria-pressed="false">${label}</button>`
  ).join('')}</div>`;
  const buttons=box.querySelectorAll('button');
  function select(index) {
    buttons.forEach((button,i)=>{
      button.setAttribute('aria-pressed',String(i===index));
      button.className='button '+(i===index?'primary':'quiet');
    });
    update(index);
  }
  buttons.forEach((button,i)=>button.addEventListener('click',()=>select(i)));
  select(initial);
}

function playSlider(label,min,max,step,initial,update) {
  get('play-controls').innerHTML=`<label class="play-slider" for="play-slider"><span>${label} <output id="play-slider-value"></output></span>
    <input id="play-slider" type="range" min="${min}" max="${max}" step="${step}" value="${initial}"></label>`;
  const slider=get('play-slider');
  function change(){
    const value=Number(slider.value);
    get('play-slider-value').textContent=playNumber(value,1);
    update(value);
  }
  slider.addEventListener('input',change);
  change();
}

function playBars(labels,max) {
  const chart=get('play-visual');
  chart.innerHTML=`<div class="play-bars">${labels.map(label=>`<div class="play-bar">
    <span>${label}</span><div class="play-bar-track"><i aria-hidden="true"></i></div><strong></strong></div>`).join('')}</div>`;
  const rows=chart.querySelectorAll('.play-bar');
  return (values,suffix='')=>rows.forEach((row,i)=>{
    row.querySelector('i').style.width=(100*values[i]/max)+'%';
    row.querySelector('strong').textContent=playNumber(values[i])+suffix;
  });
}

function playInterval() {
  get('play-visual').innerHTML=`<div class="play-interval" aria-hidden="true"><div class="play-mid"><b>60</b></div><div id="play-band"></div></div>
    <div class="play-axis" aria-hidden="true"><span>45 บาท</span><span>60 บาท</span><span>75 บาท</span></div>`;
  const sizes=[4,16,64];
  playButtons(sizes.map(n=>`ถาม ${n} คน`),0,index=>{
    const n=sizes[index],se=12/Math.sqrt(n),margin=1.96*se;
    get('play-band').style.width=(100*2*margin/30)+'%';
    get('play-live').textContent=`ถาม ${n} คน · ช่วงประมาณ ${playNumber(60-margin)}–${playNumber(60+margin)} บาท · ระยะเผื่อข้างละ ${playNumber(margin)} บาท`;
  });
}

function playCoin() {
  const counts=[1,10,45,120,210,252,210,120,45,10,1];
  get('play-visual').innerHTML=`<div class="play-coin-chart" aria-hidden="true">${counts.map((count,i)=>
    `<div class="coin-cell"><i style="height:${100*count/252}%"></i><span>${i}</span></div>`
  ).join('')}</div><p class="play-chart-label"><span>จำนวนหัวจาก 10 รอบ</span><span><i aria-hidden="true"></i> ผลที่นับรวม</span></p>`;
  let tail='right';
  let observed=8;
  function update() {
    const isExtreme=i=>tail==='right' ? i>=observed : tail==='left' ? i<=observed : Math.abs(i-5)>=Math.abs(observed-5);
    get('play-visual').querySelectorAll('.coin-cell').forEach((cell,i)=>cell.classList.toggle('extreme',isExtreme(i)));
    const cases=counts.reduce((total,count,i)=>total+(isExtreme(i)?count:0),0);
    get('play-live').textContent=`เห็น ${observed} หัว · นับ ${cases} จาก 1,024 แบบ · p ≈ ${playNumber(100*cases/1024,2)}%`;
  }
  playSlider('จำนวนหัวที่เห็น',0,10,1,8,value=>{observed=value;update();});
  get('play-controls').insertAdjacentHTML('beforeend',`<label class="play-tail">โจทย์ถามว่า
    <select id="play-tail"><option value="right">หัวมากเกินคาด</option><option value="left">หัวน้อยเกินคาด</option><option value="two">หัวต่างจากที่คาด</option></select></label>`);
  get('play-tail').addEventListener('change',event=>{tail=event.target.value;update();});
}

function playPairs() {
  const people=[['เมย์',6,8],['ต้น',9,10],['ฟ้า',4,7],['บาส',7,9]];
  const update=playBars(['ก่อนติว','หลังติว'],10);
  playButtons(people.map(person=>person[0]),0,index=>{
    const [name,before,after]=people[index];
    update([before,after]);
    get('play-live').textContent=`${name}: ${after} − ${before} = เพิ่ม ${after-before} คะแนน`;
  });
}

function playSpread() {
  const averages=[4,6,8];
  get('play-visual').innerHTML=`<div class="play-dots">${averages.map((mean,i)=>`<div>
    <span>ห้อง ${i+1}</span><div class="play-dot-track" aria-hidden="true"><b style="left:${mean*9+5}%"></b><i></i><i></i><i></i></div><strong>เฉลี่ย ${mean}</strong></div>`
  ).join('')}</div><div class="play-axis" aria-hidden="true"><span>0</span><span>5</span><span>10</span></div>`;
  const tracks=get('play-visual').querySelectorAll('.play-dot-track');
  playButtons(['คะแนนเกาะกลุ่ม','คะแนนกระจาย'],0,index=>{
    const spread=index===0?.5:2;
    tracks.forEach((track,i)=>track.querySelectorAll('i').forEach((dot,j)=>{
      dot.style.left=((averages[i]+(j-1)*spread)*9+5)+'%';
    }));
    get('play-live').textContent=`ค่าเฉลี่ยห้องยังเป็น 4, 6, 8 · ความแกว่งในห้อง (MS) = ${spread**2} · F = ${12/spread**2}`;
  });
}

function playProportions() {
  get('play-visual').innerHTML=`<div class="play-bars">${['บูธ A','บูธ B'].map(label=>`<div class="play-bar">
    <span>${label}</span><div class="play-bar-track"><i aria-hidden="true"></i></div><strong></strong></div>`).join('')}</div>`;
  const rows=get('play-visual').querySelectorAll('.play-bar');
  playButtons(['ดูจำนวนคน','คิดเป็นร้อยละ'],0,index=>{
    const values=index===0?[12,15]:[60,50];
    rows.forEach((row,i)=>{
      row.querySelector('i').style.width=(100*values[i]/(index===0?30:100))+'%';
      row.querySelector('strong').textContent=values[i]+(index===0?' คน':'%');
    });
    get('play-live').textContent=index===0?'บูธ A สมัคร 12 จาก 20 คน · บูธ B สมัคร 15 จาก 30 คน':'พอเทียบต่อ 100 คน บูธ A ได้ 60% · บูธ B ได้ 50%';
  });
}

function playCounts() {
  get('play-visual').innerHTML=`<div class="play-cell-grid">
    ${['เช้า · QR','เช้า · เงินสด','บ่าย · QR','บ่าย · เงินสด'].map(label=>`<div class="play-count-cell"><span>${label}</span>
    <strong></strong><div class="play-bar-track"><i aria-hidden="true"></i></div></div>`).join('')}</div>`;
  const cells=get('play-visual').querySelectorAll('.play-count-cell');
  playButtons(['เห็นจริง (O)','คาดไว้ (E)'],0,index=>{
    const values=index===0?[18,6,6,18]:[12,12,12,12];
    cells.forEach((cell,i)=>{
      cell.querySelector('strong').textContent=values[i]+' คน';
      cell.querySelector('i').style.width=(100*values[i]/24)+'%';
    });
    get('play-live').textContent=index===0?'เห็นจริง: ตอนเช้า QR 18 คน ตอนบ่าย QR 6 คน':'คาดไว้: ทุกช่องมี 12 คน ถ้าช่วงเวลาและวิธีจ่ายเป็นอิสระ';
  });
}

function drawPlayTrend(canvas,points,slope) {
  const ctx=canvas.getContext('2d');
  if (!ctx) return;
  const w=canvas.width,h=canvas.height, left=42, bottom=h-32;
  const x=v=>left+v*(w-left-18)/5;
  const y=v=>bottom-v*(bottom-16)/15;
  const predict=v=>7.5+slope*(v-2.5);
  function line(x1,y1,x2,y2,color,width){
    ctx.strokeStyle=color;
    ctx.lineWidth=width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
  ctx.clearRect(0,0,w,h);
  ctx.font='14px system-ui';
  ctx.fillStyle='#5c4a68';
  for(const marker of [0,5,10,15]){
    line(x(0),y(marker),x(5),y(marker),'#e6dfea',1);
    ctx.fillText(String(marker),10,y(marker)+4);
  }
  for(const marker of [1,2,3,4]){
    ctx.fillText(String(marker),x(marker)-4,bottom+20);
  }
  line(x(0),y(0),x(0),y(15),'#c0aecb',1);
  line(x(1),y(predict(1)),x(4),y(predict(4)),'#633d9b',4);
  points.forEach(([hours,bookings])=>{
    line(x(hours),y(bookings),x(hours),y(predict(hours)),'#e78c32',4);
    ctx.fillStyle='#271644';
    ctx.beginPath();
    ctx.arc(x(hours),y(bookings),5,0,2*Math.PI);
    ctx.fill();
  });
}

function playTrend() {
  const points=[[1,4],[2,7],[3,8],[4,11]];
  get('play-visual').innerHTML=`<canvas class="play-canvas" id="play-chart" width="620" height="265" aria-hidden="true"></canvas>
    <p class="play-chart-label"><span>แกนนอนเป็นชั่วโมง · แกนตั้งเป็นยอดจอง</span><span><i aria-hidden="true"></i> ระยะที่ทายพลาด</span></p>`;
  playSlider('ความชันของเส้น',0,4,.1,1,slope=>{
    drawPlayTrend(get('play-chart'),points,slope);
    const square=points.reduce((total,[hours,bookings])=>total+(bookings-(7.5+slope*(hours-2.5)))**2,0);
    get('play-live').textContent=`ความชัน ${playNumber(slope,1)} · ผลรวมกำลังสองของความคลาดเคลื่อน ${playNumber(square)} · ที่ 3 ชม. ทาย ${playNumber(7.5+slope*.5,2)} ยอด จากยอดจริง 8`;
  });
}

function playRent() {
  const update=playBars(['ราคาที่ทาย'],6000);
  playSlider('ระยะเดิน (เมตร)',0,500,50,200,distance=>{
    const price=6000-5*distance;
    update([price],' บาท');
    get('play-live').textContent=`ห้อง 30 ตร.ม. ตลอด · เดิน ${distance} เมตร · ราคาที่ทาย ${playNumber(price)} บาท`;
  });
}

const intuitionLabs=[playInterval,playCoin,playPairs,playSpread,playProportions,playCounts,playTrend,playRent];

function renderIntuition(index, focusFeedback = false) {
  const scene=intuitionScenes[index], choice=intuitionAnswers[index];
  const answered=choice!==undefined;
  const correct=choice===scene.correct;
  const done=Object.keys(intuitionAnswers).length;
  get('intuition-body').innerHTML=`<div class="intuition-layout">
    <aside class="intuition-nav" aria-label="สารบัญบทเรียนแบบภาพขยับ">
      <a class="intuition-home" href="#home">กลับหน้าหลัก</a>
      <p class="intuition-nav-title">บทเรียนแบบภาพขยับ</p>
      <p class="muted">ลองแล้ว ${done} / ${intuitionScenes.length} เรื่อง</p>
      <progress value="${done}" max="${intuitionScenes.length}" aria-label="จำนวนเรื่องที่ลองแล้ว"></progress>
      <nav>${intuitionScenes.map((item,i)=>`<a href="${intuitionLink(i)}" ${i===index?'aria-current="page"':''}>
        <span>${i+1}. ${item.short}</span>${intuitionAnswers[i]!==undefined?'<b aria-label="ลองแล้ว">✓</b>':''}</a>`).join('')}</nav>
      <label class="intuition-select">เลือกเรื่อง<select id="intuition-jump">${intuitionScenes.map((item,i)=>
        `<option value="${i}" ${i===index?'selected':''}>${i+1}. ${item.short}</option>`).join('')}</select></label>
    </aside>
    <article class="panel intuition-story">
      <p class="kicker">เล่าให้เห็น · เรื่อง ${index+1} / ${intuitionScenes.length}</p><h1>${scene.title}</h1><p class="scene">${scene.story}</p>
      <ol class="intuition-phases" aria-label="ขั้นตอนเรียน"><li ${answered?'':'aria-current="step"'}>ลองทาย</li><li id="play-step-lab" ${answered?'aria-current="step"':''}>ขยับดู</li><li id="play-step-formula">เปิดสูตร</li></ol>
      ${answered?`<details class="play-prediction play-prediction-review"><summary>ย้อนดูคำทาย</summary>
        <p>${scene.ask}</p><p>คุณตอบ <strong>${scene.choices[choice]}</strong> · คำตอบคือ <strong>${scene.choices[scene.correct]}</strong></p>
      </details>`:`<section class="play-prediction"><h2>${scene.ask}</h2>
        <div class="choice-grid" role="group" aria-label="เลือกคำตอบ">${scene.choices.map((value,i)=>`
          <button class="choice" type="button" data-intuition-answer="${i}">${value}</button>`).join('')}</div>
      </section>`}
      ${answered?`<section class="play-lab" aria-labelledby="play-feedback">
        <div class="play-lab-head"><h2 id="play-feedback" tabindex="-1">${correct?'ทายถูกแล้ว ลองขยับดู':'ลองดูว่าภาพบอกอะไร'}</h2><p>${scene.preview}</p></div>
        <div id="play-controls"></div>
        <div id="play-visual" class="play-visual"></div>
        <p class="play-live" id="play-live" role="status"></p>
        <p class="play-insight">${scene.insight}</p>
      </section>
      <details class="worked play-formula" id="play-formula"><summary>เปิดสูตรเมื่อพร้อม</summary>
        <p><strong>คำจำ</strong> ${scene.memory}</p><p class="math formula-symbol">${scene.formula}</p>
        <ol class="steps">${scene.steps.map(step=>`<li>${step}</li>`).join('')}</ol>
        <div class="actions"><a class="button quiet" href="#${scene.card==='p-value'?scene.card:'formula-'+scene.card}">ลองคำนวณต่อ</a>
          ${scene.another?`<a class="button quiet" href="#formula-${scene.another}">${index===3?'ดูแบบสองกลุ่มอิสระ':'ดู Overall F'}</a>`:''}</div>
      </details>
      <div class="actions"><a class="button primary" href="${index+1===intuitionScenes.length?'#quick-quiz':intuitionLink(index+1)}">${index+1===intuitionScenes.length?'ลองเกมเลือกสูตร':'ไปเรื่องถัดไป'}</a>
        <button class="button quiet" id="play-retry" type="button">ลองทายใหม่</button></div>`:''}
    </article></div>`;
  get('intuition-jump').addEventListener('change',event=>{location.hash=intuitionLink(Number(event.target.value));});
  document.querySelectorAll('#intuition-body [data-intuition-answer]').forEach(button=>button.addEventListener('click',()=>{
    intuitionAnswers[index]=Number(button.dataset.intuitionAnswer);
    saveIntuition();
    renderIntuition(index,true);
  }));
  if (answered) {
    intuitionLabs[index]();
    const formulaStep=get('play-step-formula');
    const labStep=get('play-step-lab');
    get('play-formula').addEventListener('toggle',event=>{
      const current=event.target.open?formulaStep:labStep;
      for (const step of [formulaStep,labStep]) {
        if (current===step) step.setAttribute('aria-current','step');
        else step.removeAttribute('aria-current');
      }
    });
    get('play-retry').addEventListener('click',()=>{
      delete intuitionAnswers[index];
      saveIntuition();
      renderIntuition(index);
      document.querySelector('#intuition-body [data-intuition-answer]').focus();
    });
  }
  if (focusFeedback) get('play-feedback').focus();
}

function saveIntuition() {
  try {localStorage.setItem(intuitionKey,JSON.stringify(intuitionAnswers));} catch {}
}
