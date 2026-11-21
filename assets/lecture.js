'use strict';
const get = id => document.getElementById(id);
const sum = values => values.reduce((total, value) => total + value, 0);
const storageKey = 'paifah-tu155-v1';
let saved;
try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
const completed = new Set(Array.isArray(saved?.completed) ? saved.completed : []);
const answers = Array.isArray(saved?.answers) ? saved.answers.slice(0, practice.length) : [];
let examIndex = answers.length;
let currentLesson = 0;
let hideChoices = false;

function save() {
  try { localStorage.setItem(storageKey, JSON.stringify({completed:[...completed], answers})); } catch {}
}

function bar(label, value, max) {
  return `<div class="bar"><span>${label}</span><div class="track" aria-hidden="true"><span style="width:${100 * value / max}%"></span></div><strong>${value}</strong></div>`;
}

function table(headers, rows) {
  return `<div class="table-wrap" tabindex="0" role="region" aria-label="ตารางข้อมูล"><table><thead><tr>${headers.map(head => `<th scope="col">${head}</th>`).join('')}</tr></thead>
  <tbody>${rows.map(row => `<tr><th scope="row">${row[0]}</th>${row.slice(1).map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function socialTable() {
  return table(['แพลตฟอร์ม', ...social.ages, 'รวม'],
    [...social.rows.map((row,index) => [social.labels[index], ...row, sum(row)]), ['รวม', ...social.totals, 480]]);
}

function slider(label, min, max, value, step = 1) {
  return `<label class="slider-row"><span>${label} <output id="slider-value"></output></span>
    <input id="slider" type="range" min="${min}" max="${max}" value="${value}" step="${step}" aria-label="${label}"></label>`;
}

const labs = [
  {
    controls:slider('จำนวนผู้ตอบ', 15, 240, 60, 15),
    render(n) {
      const margin = 1.96 * 1.33 / Math.sqrt(n);
      const baseline = 50;
      const width = Math.min(98, margin * 100);
      return `<div class="track" aria-hidden="true"><span class="band" style="left:${baseline - width/2}%;width:${width}%"></span><span class="baseline" style="left:50%"></span></div>
        <div class="display">ช่วงจำลอง <b>${(6.83-margin).toFixed(2)}–${(6.83+margin).toFixed(2)} ชม.</b><br>SE = ${(1.33/Math.sqrt(n)).toFixed(3)} ชม. · จุดกลาง 6.83 ชม.</div>
        <p class="muted">ภาพนี้ตรึงค่าวิกฤตไว้ที่ 1.96 เพื่อให้เห็นผลของจำนวนคน ในโจทย์จริงด้านล่างใช้ t* ตาม df</p>`;
    }
  },
  {
    labels:['ต่างไหม (≠)','สูงขึ้นไหม (>)','ต่ำลงไหม (<)'],
    render(index) {
      const p = [0.078,0.039,0.961][index];
      return `<div class="display"><b>p = ${p.toFixed(3)} ${p <= 0.05 ? '≤' : '>'} α = 0.05</b><br>${p <= 0.05 ? 'ปฏิเสธ H₀ ตามข้ออ้างทิศทางที่เลือก' : 'หลักฐานยังไม่พอตามข้ออ้างที่เลือก'}</div>`;
    }
  },
  {
    controls:slider('คะแนนหลังติวของเมย์', 0, 20, 13),
    render(score) {
      const before = [12, 15, 10], after = [score,17,13];
      const diff = before.map((value,index) => after[index] - value);
      return table(['นักศึกษา','ก่อน','หลัง','ผลต่าง'], before.map((value,index) => [['เมย์','ต้น','ฟ้า'][index],value,after[index],diff[index]])) +
        `<div class="display">คะแนนเปลี่ยนเฉลี่ย <b>${(sum(diff)/diff.length).toFixed(2)} คะแนน</b></div>`;
    }
  },
  {
    labels:social.ages,
    render(index) {
      const observed = social.rows[0][index];
      const expected = 192 * social.totals[index] / 480;
      return bar('ที่เห็น (O)', observed, 85) + bar('ที่คาด (E)', Number(expected.toFixed(1)), 85) +
        `<div class="display">E = 192 × ${social.totals[index]} ÷ 480 = ${expected.toFixed(1)}<br>ส่วนที่เพิ่มใน χ² = (${observed} − ${expected.toFixed(1)})² ÷ ${expected.toFixed(1)} ≈ <b>${((observed-expected)**2/expected).toFixed(2)}</b></div>`;
    }
  },
  {
    controls:slider('ความชัน', 0, 3, 1, 0.1),
    render(slope) {
      const points = [[1,2.6],[2,5.1],[3,5.9],[4,8.0],[5,9.4]];
      const meanY = sum(points.map(point => point[1])) / points.length;
      const predict = x => meanY + slope*(x-3);
      const sse = sum(points.map(([x,y]) => (y-predict(x))**2));
      return {html:`<canvas class="plot" id="regression-plot" width="550" height="222" aria-label="กราฟค่าจริง เส้นทำนาย และส่วนต่างในแนวตั้ง" role="img"></canvas>
        <div class="display">ผลรวมกำลังสองของค่าคลาดเคลื่อน <b>${sse.toFixed(2)}</b> · จุดที่ x = 5 ค่าจริง 9.4 ทำนาย ${predict(5).toFixed(2)} เหลือ ${(9.4-predict(5)).toFixed(2)}</div>`,
        paint:() => drawRegression(points, predict)};
    }
  },
  {
    controls:slider('ระยะถึง BTS (เมตร)', 0, 1200, 300, 50),
    render(distance) {
      const price = 0.874 + 0.0562 * 45 - 0.0007*distance + 0.0021*10;
      return bar('ราคา (ล้านบาท)', Number(price.toFixed(3)), 4) +
        `<div class="display">0.874 + 0.0562(45) − 0.0007(${distance}) + 0.0021(10) = <b>${price.toFixed(3)} ล้านบาท</b></div>`;
    }
  }
];

function drawRegression(points, predict) {
  const canvas = get('regression-plot');
  const ctx = canvas.getContext('2d');
  const px = x => 33 + x*93;
  const py = y => 189 - y*15;
  function line(x1,y1,x2,y2,color,width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
  }
  ctx.fillStyle = '#675660';
  ctx.font = '15px system-ui';
  ctx.fillText('y', 12, 29);
  ctx.fillText('x', 518, 207);
  line(33,10,33,190,'#cbb5b2',1);
  line(33,190,510,190,'#cbb5b2',1);
  line(px(1),py(predict(1)),px(5),py(predict(5)),'#661e37',3);
  for (const [x,y] of points) {
    line(px(x),py(y),px(x),py(predict(x)),'#ce7629',3);
    ctx.fillStyle = '#2d1b24';
    ctx.beginPath();
    ctx.arc(px(x),py(y),5,0,Math.PI*2);
    ctx.fill();
  }
}

function renderAnova(wide) {
  const means = [4, 6, 8];
  const gap = wide ? 2 : 0.5;
  const groups = means.map(mean => [mean - gap, mean, mean + gap]);
  const between = sum(means.map(mean => 3 * (mean - 6)**2)) / 2;
  const within = sum(groups.flatMap((group, i) => group.map(value => (value - means[i])**2))) / 6;
  get('anova-output').innerHTML = groups.map((group, i) =>
    `<div class="bar"><span>ห้อง ${i+1}</span><div class="dot-track" aria-hidden="true">${group.map(value => `<span style="left:${value * 9 + 5}%"></span>`).join('')}</div><strong>เฉลี่ย ${means[i]}</strong></div>`
  ).join('') + `<div class="display">MS ระหว่าง = ${between} · MS ภายใน = ${within} · <b>F = ${(between/within).toFixed(2)}</b></div>`;
}

function renderHome() {
  get('home-progress').textContent = `ผ่านคำถามท้ายบท ${completed.size} / ${topics.length} บท`;
  get('lesson-grid').innerHTML = topics.map((topic,index) => `<a class="tile" href="#lesson-${index}">
    <span class="topic">LECTURE ${String(index + 8).padStart(2,'0')} · ${topic.short}</span><strong>${topic.title}</strong>
    <span class="context">${topic.context}</span><span class="tile-bottom"><span class="tag${completed.has(index) ? ' done' : ''}">${completed.has(index) ? '✓ ผ่านคำถามท้ายบท' : topic.cue}</span></span></a>`).join('');
}

function renderLesson(index) {
  currentLesson = index;
  const topic = topics[index];
  const lab = labs[index];
  get('lesson-nav').innerHTML = topics.map((item,i) => `<a href="#lesson-${i}" ${i === index ? 'aria-current="page"' : ''}>${i + 8} · ${item.short}${completed.has(i) ? ' ✓' : ''}</a>`).join('');
  get('lecture-body').innerHTML = `
    <p class="kicker">LECTURE ${index + 8} · ${topic.short}</p><h1 tabindex="-1">${topic.title}</h1><p class="scene">${topic.story}</p>
    <section class="lab"><h2>ลองเปลี่ยนตัวเลข</h2><p>${topic.prompt}</p>
      <div class="lab-controls">${lab.controls ?? `<div class="actions" role="group" aria-label="เลือกข้อมูล">${lab.labels.map((label,i) => `<button type="button" class="button quiet" data-lab="${i}">${label}</button>`).join('')}</div>`}</div>
      <div class="lab-output" id="lab-output" aria-live="polite"></div>
    </section>
    <details class="worked"><summary>เปิดที่มาของสูตรทีละขั้น</summary>
      <ol class="steps">${topic.parts.map(([heading,body]) => `<li><strong>${heading}</strong><p>${body}</p></li>`).join('')}</ol>
      <p class="math">${topic.example}</p><p class="tip">${topic.tip}</p>
      <p><a href="#sources">ที่มาของ Lecture ${index + 8}</a></p>
    </details>
    <details class="worked"><summary>ถ้าโจทย์เปลี่ยนรูป</summary><p>${variants[index]}</p></details>
    ${index === 2 ? `<section class="lab"><h2>ทำไม ANOVA ต้องหาร?</h2>
      <p>สามห้องมีค่าเฉลี่ยเท่าเดิม ลองเปลี่ยนเฉพาะความกระจายภายในห้อง แล้วดูว่า F เปลี่ยนแค่ไหน</p>
      <label><input id="anova-spread" type="checkbox"> ให้คะแนนในแต่ละห้องกระจายมากขึ้น</label>
      <div class="lab-output" id="anova-output" aria-live="polite"></div></section>` : ''}
    <section class="checkpoint"><h2>ลองตอบก่อนเปลี่ยนบท</h2><p>${topic.check[0]}</p>
      <div class="choice-grid" role="group" aria-label="ตัวเลือกท้ายบท">${topic.check[1].map((choice,i) => `<button class="choice" type="button" data-check="${i}">${choice}</button>`).join('')}</div>
      <div id="check-feedback" role="status"></div>
    </section>
    <div class="actions"><a class="button quiet" href="#home">กลับแผนเลือกวิธี</a><a class="button quiet" href="#formulas-${index}">ฝึกคำนวณสูตรของบทนี้</a>
      ${index < topics.length-1 ? `<a class="button primary" href="#lesson-${index+1}">บทถัดไป</a>` : '<a class="button primary" href="#exam">เริ่มซ้อมสอบ</a>'}</div>`;

  const sliderInput = get('slider');
  const buttons = get('lecture-body').querySelectorAll('[data-lab]');
  function updateLab(input) {
    const result = lab.render(input);
    get('lab-output').innerHTML = typeof result === 'string' ? result : result.html;
    if (typeof result !== 'string') result.paint();
    if (sliderInput) get('slider-value').textContent = input;
    buttons.forEach(button => {
      const active = Number(button.dataset.lab) === input;
      button.className = 'button ' + (active ? 'primary' : 'quiet');
      button.setAttribute('aria-pressed', String(active));
    });
  }
  if (sliderInput) sliderInput.addEventListener('input', () => updateLab(Number(sliderInput.value)));
  buttons.forEach(button => button.addEventListener('click', () => updateLab(Number(button.dataset.lab))));
  updateLab(Number(sliderInput?.value ?? 0));
  if (index === 2) {
    const spread = get('anova-spread');
    spread.addEventListener('change', () => renderAnova(spread.checked));
    renderAnova(spread.checked);
  }
  for (const button of get('lecture-body').querySelectorAll('[data-check]')) {
    button.addEventListener('click', () => {
      const correct = Number(button.dataset.check) === topic.check[2];
      get('check-feedback').className = 'feedback' + (correct ? '' : ' retry');
      get('check-feedback').textContent = correct ? 'ถูกครับ · ' + topic.check[3] : 'ลองอีกครั้ง · เปิดดูที่มาของสูตรแล้วกลับมาตอบได้';
      if (correct) {
        completed.add(currentLesson);
        save();
        get('lesson-nav').querySelector('[aria-current]').textContent = `${index+8} · ${topic.short} ✓`;
      }
    });
  }
}

function examTables(item) {
  if (item.table) return socialTable();
  if (item.condo) return table(['ตัวแปร','Coefficient','P-value'], [
    ['Intercept',0.874,0.016],['Size',0.0562,'0.000 (ปัดเศษ)'],['Distance to BTS',-0.0007,0.006],['Building age',0.0021,0.863]
  ]);
  return '';
}

function renderExam(focus = false) {
  const box = get('exam-body');
  if (examIndex >= practice.length) {
    const score = answers.filter((choice,index) => choice === practice[index].correct).length;
    box.innerHTML = `<p class="kicker">ชุดซ้อมปลายภาค</p><h1 tabindex="-1">ตอบถูก ${score} / ${practice.length} ข้อ</h1>
      <p>${score === practice.length ? 'ลองทำทั้ง 6 ข้ออีกครั้งบนกระดาษโดยปิดตัวเลือก แล้วเช็กการแทนสูตรและประโยคสรุปกับเฉลย' : 'เปิดเฉลยของข้อที่พลาด ทวนที่มาของสูตร แล้วลองทำอีกครั้งโดยไม่ดูตัวเลือก'}</p>
      <ul class="exam-links">${practice.map((item,index) => `<li>${answers[index] === item.correct ? 'ถูก' : 'ทบทวน'} ·
        <button class="button quiet" type="button" data-review="${index}">ดูข้อ ${index+1}</button> <a href="#lesson-${item.lesson}">${item.title}</a></li>`).join('')}</ul>
      <button type="button" class="button primary" id="reset">เริ่มซ้อมใหม่</button>`;
    get('reset').addEventListener('click', () => {answers.length = 0; examIndex = 0; save(); renderExam(true);});
    box.querySelectorAll('[data-review]').forEach(button => button.addEventListener('click', () => {examIndex = Number(button.dataset.review); renderExam(true);}));
  } else {
    const item = practice[examIndex];
    const selected = answers[examIndex];
    const done = selected !== undefined;
    box.innerHTML = `<p class="kicker">ชุดซ้อมปลายภาค · ข้อ ${examIndex+1} / ${practice.length}</p>
      <div class="progress" aria-hidden="true"><span style="width:${100 * answers.length / practice.length}%"></span></div>
      <h1 tabindex="-1">${item.title}</h1><div class="problem"><p>${item.context}</p>${examTables(item)}</div>
      <h2>${item.ask}</h2>
      ${done ? '' : `<button class="button quiet" id="choice-toggle" type="button" aria-expanded="${!hideChoices}" aria-controls="exam-choices">${hideChoices ? 'เปิดตัวเลือก' : 'ซ่อนตัวเลือกเพื่อคิดเอง'}</button>
        <p id="write-first" class="tip" ${hideChoices ? '' : 'hidden'}>ลองเขียนวิธีที่เลือก แทนตัวเลข และสรุปเป็นหนึ่งประโยคก่อนเปิดตัวเลือก</p>`}
      <div id="exam-choices" class="choice-grid" role="group" aria-label="ตัวเลือกคำตอบ" ${!done && hideChoices ? 'hidden' : ''}>${item.choices.map((choice,index) => `
        <button class="choice${done && index === item.correct ? ' good' : index === selected ? ' bad' : ''}" type="button" data-answer="${index}" ${done ? 'disabled' : ''}>${choice}${done && index === item.correct ? ' ✓' : ''}</button>`).join('')}</div>
      ${done ? `<div class="feedback${selected === item.correct ? '' : ' retry'}" id="exam-feedback" tabindex="-1"><strong>${selected === item.correct ? 'ถูกครับ' : 'ลองดูวิธีทำ'}</strong>
        <ol class="steps">${item.steps.map(step => `<li>${step}</li>`).join('')}</ol><a href="#lesson-${item.lesson}">ทวนบท ${topics[item.lesson].title}</a></div>` : ''}
      <div class="actions"><button class="button primary" id="next-question" type="button" ${done ? '' : 'disabled'}>${examIndex === practice.length-1 || answers.length === practice.length ? 'ดูคะแนน' : 'ข้อถัดไป'}</button>
      <a href="#sources" class="button quiet">ที่มาของชุดซ้อม</a></div>`;
    const toggle = get('choice-toggle');
    if (toggle) toggle.addEventListener('click', () => {
      hideChoices = !hideChoices;
      toggle.setAttribute('aria-expanded', String(!hideChoices));
      toggle.textContent = hideChoices ? 'เปิดตัวเลือก' : 'ซ่อนตัวเลือกเพื่อคิดเอง';
      get('exam-choices').hidden = hideChoices;
      get('write-first').hidden = !hideChoices;
    });
    box.querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click', () => {
      answers[examIndex] = Number(button.dataset.answer);
      save();
      renderExam();
      get('exam-feedback').focus();
    }));
    get('next-question').addEventListener('click', () => {
      examIndex = answers.length === practice.length ? practice.length : examIndex + 1;
      renderExam(true);
    });
  }
  if (focus) box.querySelector('h1').focus();
}

function route(focus = false) {
  const hash = location.hash.slice(1);
  const lessonMatch = /^lesson-([0-5])$/.exec(hash);
  const formulaRoute = /^(basics|quick-quiz|p-value|formulas(?:-[0-5])?|formula-[a-z0-9-]+)$/.test(hash);
  const page = lessonMatch ? 'lecture' : formulaRoute ? 'formula-room' : ['exam','mock','sources'].includes(hash) ? hash : 'home';
  document.querySelectorAll('[data-page]').forEach(section => {section.hidden = section.id !== page;});
  document.querySelectorAll('.top nav a').forEach(link => {
    if (link.hash === '#' + (page === 'lecture' ? 'home' : formulaRoute ? 'formulas' : page)) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if (page === 'home') renderHome();
  if (page === 'lecture') renderLesson(Number(lessonMatch[1]));
  if (page === 'exam') renderExam();
  if (page === 'mock') renderMock();
  if (formulaRoute) renderFormulaRoute(hash);
  if (focus) {
    const heading = get(page).querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}

get('source-list').innerHTML = sources.map(([label]) => `<li>${label}</li>`).join('');
window.addEventListener('hashchange', () => {
  if (location.hash !== '#main') route(true);
});
route();
