'use strict';

const forecastStorageKey = 'paifah-tu155-forecast-v1';
const forecastDuration = 15000;
const emptyForecast = () => ({
  index:0, submitted:false,
  entries:forecastQuestions.map(question => ({choice:null, deadline:0, locked:false, values:question.fields.map(() => '')}))
});

function loadForecast() {
  const fresh = emptyForecast();
  try {
    const saved = JSON.parse(localStorage.getItem(forecastStorageKey));
    if (!Array.isArray(saved?.entries)) return fresh;
    fresh.entries.forEach((entry,i) => {
      const old = saved.entries[i];
      if (!old) return;
      if (Number.isInteger(old.choice) && forecastQuestions[i].methods[old.choice]) entry.choice = old.choice;
      entry.locked = old.locked === true;
      if (!entry.locked && Number.isFinite(old.deadline) && old.deadline > 0) entry.deadline = old.deadline;
      if (Array.isArray(old.values)) entry.values = entry.values.map((_,j) => typeof old.values[j] === 'string' ? old.values[j] : '');
    });
    if (Number.isInteger(saved.index) && forecastQuestions[saved.index]) fresh.index = saved.index;
    fresh.submitted = saved.submitted === true && fresh.entries.every((entry,i) => forecastComplete(forecastQuestions[i],entry));
  } catch {}
  return fresh;
}

let forecastState = loadForecast();
let forecastReview = null;
let forecastTimer = null;

function saveForecast() {
  try { localStorage.setItem(forecastStorageKey, JSON.stringify(forecastState)); } catch {}
}

function stopForecastTimer() {
  clearInterval(forecastTimer);
  forecastTimer = null;
}

function forecastComplete(question, entry) {
  return entry.locked && question.fields.every((field,i) => field.options ?
    field.options.some((_,j) => String(j) === entry.values[i]) : Number.isFinite(mockNumber(entry.values[i])));
}

function forecastProblem(question) {
  return `<div class="problem"><p>${question.context}</p>${question.data ? table(...question.data) : ''}</div>`;
}

function forecastPhases(active) {
  return `<ol class="exam-phases" aria-label="ขั้นตอนทำข้อสอบ">${['เลือกวิธี','คำนวณ','เฉลย'].map((label,i) =>
    `<li${i===active?' aria-current="step"':''}>${label}</li>`
  ).join('')}</ol>`;
}

function forecastPager(box, selected) {
  const pager = box.querySelector('.mock-pager');
  pager.innerHTML = forecastQuestions.map((question,i) => {
    const done = forecastComplete(question,forecastState.entries[i]);
    return `<button type="button" class="button quiet" data-forecast-page="${i}" ${i===selected ? 'aria-current="step"' : ''}
      aria-label="ข้อ ${i+1}${forecastState.submitted ? '' : done ? ' ตอบครบแล้ว' : ' ยังตอบไม่ครบ'}">${i+1}${done&&!forecastState.submitted ? ' ✓' : ''}</button>`;
  }).join('');
  pager.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    const i=Number(button.dataset.forecastPage);
    if (i===selected) return;
    if (forecastState.submitted) forecastReview=i;
    else {forecastState.index=i;saveForecast();}
    renderForecast(true);
  }));
}

function renderForecastReady(box, index, entry) {
  box.innerHTML = `<div class="forecast-cover">
    <div><p class="kicker">ข้อสอบเก็ง · ข้อ ${index+1} / ${forecastQuestions.length}</p><h1>อ่านโจทย์.<br>จับวิธีให้ทัน.</h1>
      <p>กดเริ่มเพื่อเปิดโจทย์ย่อ พอเลือกวิธีหรือหมดเวลาแล้ว จะได้โจทย์เต็มไปคำนวณตามจังหวะของคุณ</p>
      <div class="actions"><button class="button primary" id="forecast-start" type="button">เริ่มจับเวลา 15 วินาที</button></div></div>
    <div class="cover-timer" aria-hidden="true"><b>15</b><span>วินาที</span></div></div>
    ${forecastPhases(0)}
    <div class="mock-pager" role="group" aria-label="เลือกข้อ"></div>
    <p class="muted">ถ้าหมดเวลาก่อนเลือก ยังทำส่วนคำนวณได้ เฉลยเปิดเมื่อส่งครบทั้งชุด</p>
    <div class="actions"><a class="button quiet" href="#mock">ข้อสอบชุดแรก</a><a class="button quiet" href="#quick-quiz">อุ่นเครื่องก่อนสอบ</a></div>`;
  forecastPager(box,index);
  get('forecast-start').addEventListener('click', () => {
    entry.deadline=Date.now()+forecastDuration;
    saveForecast();
    renderForecast(true);
  });
}

function renderForecastTimed(box, index, question, entry) {
  box.innerHTML = `${forecastPhases(0)}
    <div class="forecast-timed-head"><div><p class="kicker">ข้อ ${index+1} / ${forecastQuestions.length} · เลือกวิธี</p><h1>${question.title}</h1></div>
      <div class="forecast-clock" id="forecast-clock"><span>เหลือเวลา</span><strong id="forecast-seconds" role="timer" aria-live="off">15 วินาที</strong></div></div>
    <div class="progress forecast-time-track" aria-hidden="true"><span id="forecast-timebar"></span></div>
    <div class="problem"><p>${question.preview}</p></div>
    <form id="forecast-method-form">
      <fieldset class="mock-field"><legend>โจทย์นี้ใช้วิธีไหน?</legend>
        ${question.methods.map((label,i) => `<label class="mock-option"><input type="radio" name="forecast-method" value="${i}" ${entry.choice===i?'checked':''}><span>${label}</span></label>`).join('')}
      </fieldset>
      <button class="button primary" id="forecast-lock" type="submit" ${entry.choice===null?'disabled':''}>ยืนยันวิธีแล้วไปคำนวณ</button>
    </form>`;
  function lockMethod() {
    entry.locked=true;
    entry.deadline=0;
    saveForecast();
    renderForecast(true);
  }
  const form=get('forecast-method-form');
  form.addEventListener('input', event => {
    if (Date.now()>=entry.deadline) {lockMethod();return;}
    entry.choice=Number(event.target.value);
    saveForecast();
    get('forecast-lock').disabled=false;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (entry.choice!==null) lockMethod();
  });
  function tick() {
    const remaining=entry.deadline-Date.now();
    if (remaining<=0) {lockMethod();return;}
    get('forecast-seconds').textContent=`${Math.ceil(remaining/1000)} วินาที`;
    get('forecast-timebar').style.width=`${100*remaining/forecastDuration}%`;
    get('forecast-clock').dataset.urgent=String(remaining<=5000);
  }
  forecastTimer=setInterval(tick,100);
  tick();
}

function renderForecastCalculate(box, index, question, entry) {
  box.innerHTML = `${forecastPhases(1)}<p class="kicker">ข้อ ${index+1} / ${forecastQuestions.length} · คำนวณ</p><h1>${question.title}</h1>
    <p class="forecast-record">${entry.choice===null ? 'หมดเวลาก่อนเลือกวิธี' : 'บันทึกวิธีที่เลือกแล้ว · '+question.methods[entry.choice]} <strong>ตอนนี้คำนวณได้ตามจังหวะของคุณ</strong></p>
    <div class="mock-pager" role="group" aria-label="เลือกข้อ"></div><p class="muted" id="forecast-progress" role="status"></p>
    ${forecastProblem(question)}
    <p class="muted">กรอกตัวเลขทศนิยมอย่างน้อย 2 ตำแหน่งเมื่อจำเป็น และคงเครื่องหมายตามโจทย์</p>
    ${mockFields(question)}
    <div class="actions">
      ${index<forecastQuestions.length-1?'<button class="button quiet" type="button" id="forecast-next">ข้อถัดไป</button>':''}
      <button class="button primary" type="button" id="forecast-submit">ส่งคำตอบทั้งชุด</button>
    </div>
    <p id="forecast-missing" role="status"></p>`;
  function progress() {
    const count=forecastQuestions.filter((item,i)=>forecastComplete(item,forecastState.entries[i])).length;
    get('forecast-progress').textContent=`ตอบครบ ${count} จาก ${forecastQuestions.length} ข้อ`;
    box.querySelectorAll('[data-forecast-page]').forEach((button,i) => {
      const done=forecastComplete(forecastQuestions[i],forecastState.entries[i]);
      button.textContent=(i+1)+(done?' ✓':'');
      button.setAttribute('aria-label',`ข้อ ${i+1} ${done?'ตอบครบแล้ว':'ยังตอบไม่ครบ'}`);
    });
  }
  forecastPager(box,index);
  progress();
  box.querySelectorAll('[data-mock-field]').forEach(input => {
    const i=Number(input.dataset.mockField);
    if (input.type==='radio') input.checked=input.value===entry.values[i];
    else input.value=entry.values[i];
    input.addEventListener('input', () => {
      entry.values[i]=input.value;
      get('forecast-missing').textContent='';
      get('forecast-missing').className='';
      saveForecast();
      progress();
    });
  });
  get('forecast-next')?.addEventListener('click', () => {
    forecastState.index=index+1;
    saveForecast();
    renderForecast(true);
  });
  get('forecast-submit').addEventListener('click', () => {
    const incomplete=forecastQuestions.map((item,i)=>forecastComplete(item,forecastState.entries[i])?null:i).filter(i=>i!==null);
    const message=get('forecast-missing');
    if (incomplete.length) {
      message.textContent=`กรอกคำตอบข้อ ${incomplete.map(i=>i+1).join(', ')} ให้ครบก่อนส่ง`;
      message.className='feedback retry';
      return;
    }
    forecastState.submitted=true;
    saveForecast();
    renderForecast(true);
  });
}

function forecastPoints(question, entry) {
  return Number(question.method===entry.choice)+question.fields.filter((field,i)=>mockCorrect(field,entry.values[i])).length;
}

function renderForecastResults(box) {
  const methods=forecastQuestions.filter((item,i)=>item.method===forecastState.entries[i].choice).length;
  const max=forecastQuestions.reduce((total,item)=>total+item.fields.length+1,0);
  const score=forecastQuestions.reduce((total,item,i)=>total+forecastPoints(item,forecastState.entries[i]),0);
  box.innerHTML = `<p class="kicker">ส่งข้อสอบเก็งครบทั้งชุดแล้ว</p><h1>ได้ ${score} / ${max} คะแนน</h1>
    <div class="formula-patterns forecast-score"><div><strong>เลือกวิธีใน 15 วินาที</strong><p>${methods} / ${forecastQuestions.length}</p></div>
      <div><strong>คำนวณและแปลผล</strong><p>${score-methods} / ${max-forecastQuestions.length}</p></div></div>
    <h2>เฉลยทีละขั้น</h2><ol class="mock-results">${forecastQuestions.map((item,i) => `<li><button class="button quiet" type="button" data-forecast-review="${i}">
      <span>${i+1}. ${item.title}</span><strong>${forecastPoints(item,forecastState.entries[i])}/${item.fields.length+1}</strong></button></li>`).join('')}</ol>
    <div class="actions"><button class="button quiet" id="forecast-reset" type="button">ทำชุดเก็งใหม่</button><a class="button quiet" href="#formulas">เปิดห้องสูตร</a></div>`;
  box.querySelectorAll('[data-forecast-review]').forEach(button => button.addEventListener('click', () => {
    forecastReview=Number(button.dataset.forecastReview);
    renderForecast(true);
  }));
  get('forecast-reset').addEventListener('click', () => {
    if (!confirm('เริ่มใหม่และล้างคำตอบกับคะแนนเฉพาะข้อสอบเก็งชุดนี้ไหม?')) return;
    forecastState=emptyForecast();
    saveForecast();
    renderForecast(true);
  });
}

function renderForecastReview(box, index) {
  const question=forecastQuestions[index], entry=forecastState.entries[index];
  box.innerHTML = `${forecastPhases(2)}<p class="kicker">เฉลยข้อ ${index+1} / ${forecastQuestions.length}</p><h1>${question.title}</h1>
    <div class="mock-pager" role="group" aria-label="เลือกข้อ"></div>${forecastProblem(question)}
    <h2>คำตอบของคุณ</h2><ol class="steps" id="forecast-answers"></ol>
    <h2>วิธีคิดทีละขั้น</h2><ol class="steps forecast-solution" id="forecast-solution"></ol>
    <button type="button" class="button primary" id="forecast-reveal"></button>
    <div class="actions"><button class="button quiet" id="forecast-back" type="button">กลับไปดูคะแนน</button>
      <a class="button quiet" href="#formulas-${question.lesson}">ทวนสูตรในบทนี้</a></div>`;
  forecastPager(box,index);
  const answers=get('forecast-answers');
  const responses=[
    ['วิธีที่เลือก',entry.choice===null?'หมดเวลาก่อนเลือก':question.methods[entry.choice],question.method===entry.choice],
    ...question.fields.map((field,i) => [field.prompt,field.options?field.options[Number(entry.values[i])]:entry.values[i],mockCorrect(field,entry.values[i])])
  ];
  responses.forEach(([label,value])=>{
    const line=document.createElement('li');
    line.textContent=`${label} — ${value}`;
    answers.append(line);
  });
  get('forecast-back').addEventListener('click', () => {forecastReview=null;renderForecast(true);});
  bindExamStepReveal(get('forecast-solution'),get('forecast-reveal'),question.steps,()=>{
    [...answers.children].forEach((line,i)=>{
      const badge=document.createElement('span');
      badge.className='tag'+(responses[i][2]?' done':'');
      badge.textContent=responses[i][2]?'ถูก':'ทบทวน';
      line.append(' ',badge);
    });
  });
}

function renderForecast(moveFocus = false) {
  stopForecastTimer();
  const box=get('forecast-body');
  if (forecastState.submitted) {
    if (forecastReview===null) renderForecastResults(box);
    else renderForecastReview(box,forecastReview);
  } else {
    const index=forecastState.index, question=forecastQuestions[index], entry=forecastState.entries[index];
    if (!entry.locked && entry.deadline && Date.now()>=entry.deadline) {
      entry.deadline=0;
      entry.locked=true;
      saveForecast();
    }
    if (entry.locked) renderForecastCalculate(box,index,question,entry);
    else if (entry.deadline) renderForecastTimed(box,index,question,entry);
    else renderForecastReady(box,index,entry);
  }
  if (moveFocus) {
    const heading=box.querySelector('h1');
    heading.tabIndex=-1;
    heading.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}
