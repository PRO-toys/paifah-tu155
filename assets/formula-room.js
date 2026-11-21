'use strict';

const formulaById = Object.fromEntries(formulas.map(card => [card.id, card]));
let formulaGame = null;

function renderFormulaRoute(hash) {
  const box = get('formula-body');
  if (hash === 'basics') renderBasics(box);
  else if (hash === 'quick-quiz') renderFormulaGame(box);
  else if (hash === 'p-value') renderPValue(box);
  else if (hash.startsWith('formula-') && Object.hasOwn(formulaById, hash.slice(8))) renderFormulaCard(box, formulaById[hash.slice(8)]);
  else renderFormulaIndex(box, /^formulas-[0-5]$/.test(hash) ? hash.at(-1) : '');
}

function renderBasics(box) {
  box.innerHTML = `
    <article class="panel formula-panel">
      <p class="kicker">เริ่มจากศูนย์ · ใช้เวลาประมาณ 5 นาที</p><h1>ตัวเลขกำลังบอกอะไร?</h1>
      <p class="scene">ลองนึกถึงร้านกาแฟที่มีลูกค้า 4 คนรอ <strong>4, 6, 8 และ 10 นาที</strong> เราจะใช้เรื่องเดียวกันเพื่อแกะคำที่เจอในสูตรสถิติ</p>
      <div class="foundation-values" aria-label="เวลารอสี่รายการ หน่วยนาที"><span>4</span><span>6</span><span>8</span><span>10</span></div>
      <section class="formula-foundation">
        <h2>1. ถ้าหารเวลารอเท่า ๆ กัน จะคนละกี่นาที?</h2>
        <p>บวกเวลาของทุกคนแล้วหารด้วยจำนวนคน นี่คือ <strong>ค่าเฉลี่ย</strong> เขียนว่า x̄</p>
        <details class="worked"><summary>เปิดดูวิธีคิด</summary><p class="math">x̄ = (4 + 6 + 8 + 10) ÷ 4 = 7 นาที</p><p>คิดเหมือนเอาน้ำจากสี่แก้วมารวมแล้วเทกลับให้เท่ากัน</p></details>
        <h2>2. แต่ละคนห่างจาก 7 นาทีแค่ไหน?</h2>
        <p><strong>SD</strong> บอกว่าข้อมูลรายคนกระจายแค่ไหน ถ้าทุกคนรอ 7 นาทีพอดี SD จะเป็นศูนย์</p>
        <details class="worked"><summary>เปิดดูที่มาของ SD</summary><ol class="steps"><li>ห่างจาก 7 อยู่ −3, −1, +1, +3 นาที</li><li>ยกกำลังสองให้เครื่องหมายบวกกับลบไม่หักล้างกัน ได้ 9, 1, 1, 9</li><li>รวมแล้วหารด้วย n−1 สำหรับความแปรปรวนตัวอย่าง ได้ 20/3 จากนั้นถอดรากเพื่อกลับมาเป็นหน่วยนาที ได้ s ≈ 2.58 นาที</li></ol></details>
        <h2>3. ค่าเฉลี่ยจะขยับแค่ไหนถ้าถามคนอีกชุด?</h2>
        <p><strong>SE</strong> บอกความแกว่งของค่าประมาณ ถ้าความกระจายรายคนคงเดิมและสุ่มแบบอิสระ การถามคนเพิ่มทำให้ค่าเฉลี่ยนิ่งขึ้น ลองเลือกจำนวนคนดู</p>
        <div class="actions" role="group" aria-label="เลือกจำนวนคน">${[4,16,64].map(n => `<button type="button" class="button quiet" data-foundation-n="${n}">${n} คน</button>`).join('')}</div>
        <div class="foundation-meter"><div class="track" aria-hidden="true"><span id="se-bar"></span></div><p id="se-text" role="status"></p></div>
        <h2>4. เอา SE ไปทำอะไร?</h2>
        <div class="formula-patterns">
          <div><strong>อยากได้ช่วง · CI</strong><p>จุดกลาง ± ระยะเผื่อ</p><small>ค่าวิกฤต × SE คือระยะเผื่อ</small></div>
          <div><strong>อยากทดสอบ · t หรือ z</strong><p>ความต่าง ÷ SE</p><small>ถามว่าห่างจากข้ออ้างกี่หน่วย SE</small></div>
          <div><strong>อยากทำนาย · ŷ</strong><p>ค่าเริ่มต้น + ผลของตัวแปร</p><small>ทำนายแล้วเช็กหน่วยเสมอ</small></div>
        </div>
        <p class="tip"><strong>ท่องก่อนเปิดสูตร</strong> ถามเป็น <strong>ช่วง</strong>, <strong>ทดสอบ</strong> หรือ <strong>ทำนาย</strong> แล้วค่อยดูว่าข้อมูลเป็นตัวเลขหรือหมวดหมู่</p>
        <details class="worked"><summary>วิธีกดเครื่องคิดเลขให้พลาดน้อยลง</summary>
          <ol class="steps"><li>เขียนหน่วยและลำดับการลบก่อน เช่น “หลัง − ก่อน” หรือ “กลุ่ม 1 − กลุ่ม 2”</li><li>คำนวณส่วนใต้รากและตัวหารให้เสร็จก่อน เช่น 10 ÷ √25 = 2</li><li>ใช้ค่าที่ยังไม่ปัดในขั้นต่อไป เช่น 2.064 × 2 = 4.128 แล้วค่อยปัดตอนตอบ</li><li>เช็กขนาดและเครื่องหมาย ถ้าจุดกลางคือ 60 และระยะเผื่อประมาณ 4 ขอบช่วงควรอยู่แถว 56 และ 64</li></ol>
        </details>
      </section>
      <div class="actions"><a class="button primary" href="#formula-ci-mean">ลองคำนวณสูตรแรก</a><a class="button quiet" href="#formulas">ดูสูตรทั้งหมด</a></div>
    </article>`;
  const controls = box.querySelectorAll('[data-foundation-n]');
  function showSE(n) {
    const s = Math.sqrt(20/3);
    get('se-bar').style.width = (200/Math.sqrt(n))+'%';
    get('se-text').textContent = `คง SD ≈ 2.58 นาที · SE = 2.58 ÷ √${n} ≈ ${formulaFormat(s/Math.sqrt(n),2)} นาที`;
    controls.forEach(button => {
      const active = Number(button.dataset.foundationN) === n;
      button.setAttribute('aria-pressed', String(active));
      button.className = 'button ' + (active ? 'primary' : 'quiet');
    });
  }
  controls.forEach(button => button.addEventListener('click', () => showSE(Number(button.dataset.foundationN))));
  showSE(4);
}

function renderFormulaIndex(box, selected) {
  box.innerHTML = `
    <section class="panel formula-index">
      <p class="kicker">TU155 · Lecture 8–13</p><h1>ห้องสูตร</h1>
      <p class="scene">อ่านว่าใช้เมื่อไร จับคำจำ แล้วลองแทนตัวเลขด้วยตัวเอง</p>
      <div class="actions"><a class="button primary" href="#quick-quiz">เล่นเกมเลือกสูตร</a><a class="button quiet" href="#basics">เริ่มจากศูนย์</a><a class="button quiet" href="#p-value">ลองอ่าน p-value</a></div>
      <div class="formula-patterns">
        <div><strong>ช่วง</strong><p>จุดกลาง ± ระยะเผื่อ</p></div>
        <div><strong>ทดสอบ</strong><p>ความต่าง ÷ ความแกว่ง</p><small>ใช้จำสถิติ t และ z</small></div>
        <div><strong>ทำนาย</strong><p>ค่าเริ่มต้น + ผลของตัวแปร</p></div>
      </div>
      <details class="worked"><summary>เปิดพจนานุกรมสัญลักษณ์</summary>
        ${table(['สัญลักษณ์','อ่านง่าย ๆ'],[['x̄ / μ','ค่าเฉลี่ยตัวอย่าง / ค่าเฉลี่ยประชากร'],['s / σ','SD ตัวอย่าง / SD ประชากร'],['n / N','จำนวนในตัวอย่าง / จำนวนทั้งหมดตามที่โจทย์นิยาม'],['p̂ / p₀','สัดส่วนตัวอย่าง / สัดส่วนที่อ้างใน H₀'],['SE / df','ความคลาดเคลื่อนมาตรฐาน / องศาอิสระ'],['H₀ / Hₐ','ข้ออ้างที่ใช้เป็นฐาน / สิ่งที่โจทย์ถามหาหลักฐาน'],['p-value / α','ความน่าจะเป็นที่จะได้สถิติสุดโต่งเท่านี้หรือกว่าเมื่อ H₀ จริง / เกณฑ์ที่ตั้งก่อนทดสอบ'],['O / E','จำนวนที่เห็น / จำนวนที่คาด'],['SS / MS','ผลรวมกำลังสอง / SS หารด้วย df'],['y / ŷ','ค่าจริง / ค่าทำนาย']])}
      </details>
      <div class="formula-filters">
        <label>ค้นสูตร<input id="formula-query" type="search" placeholder="เช่น ก่อน–หลัง, chi-square, SE"></label>
        <label>เลือกบท<select id="formula-filter"><option value="">ทุกบท</option>
          ${formulaGroups.map((name,i) => `<option value="${i}" ${String(i) === selected ? 'selected' : ''}>${i+8} · ${name}</option>`).join('')}</select></label>
      </div>
      <p class="muted" id="formula-count" role="status"></p>
      <div class="formula-index-grid" id="formula-list"></div>
      <details class="worked"><summary>วิธีทบทวนให้จำได้ตอนสอบ</summary>
        <ol class="steps"><li>ดูตัวอย่าง 1 ข้อแล้วอธิบายเองว่าทำไมแต่ละขั้นจึงใช้ตัวเลขนั้น</li><li>กดลองโจทย์ใหม่ ลองทำโดยปิดวิธีคิด แล้วค่อยเปิดเช็ก</li><li>สลับโจทย์คนละเรื่องในเกมเลือกสูตร เพื่อฝึกแยกโจทย์ที่หน้าตาคล้ายกัน</li><li>วันถัดไปลองเขียนสูตรจากความจำแล้วกลับมาแก้เฉพาะจุดที่ติด</li></ol>
        <p><a href="https://pubmed.ncbi.nlm.nih.gov/16507066/">การฝึกนึกคำตอบ</a> · <a href="https://doi.org/10.1207/s15516709cog1302_1">การอธิบายตัวอย่างด้วยตัวเอง</a> · <a href="https://doi.org/10.1037/EDU0000367">การสลับประเภทโจทย์</a></p>
      </details>
    </section>`;
  function listFormulas() {
    const group = get('formula-filter').value;
    const terms = get('formula-query').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const cards = formulas.filter(card => {
      const searchable = [card.name,card.when,card.keyword,card.memory,card.symbol].join(' ').toLowerCase();
      return (group === '' || String(card.group) === group) && terms.every(term => searchable.includes(term));
    });
    get('formula-count').textContent = `พบ ${cards.length} จาก ${formulas.length} สูตร`;
    get('formula-list').innerHTML = cards.map(card => `<a class="tile formula-tile" href="#formula-${card.id}">
      <span class="topic">${formulaGroups[card.group]}</span><strong>${card.name}</strong><span class="context">${card.when}</span>
      <span class="tile-bottom"><span class="tag">${card.memory}</span></span>
    </a>`).join('') || '<p>ยังไม่พบสูตรที่ตรง ลองค้นด้วยคำสั้นลงหรือเลือกทุกบท</p>';
  }
  get('formula-query').addEventListener('input', listFormulas);
  get('formula-filter').addEventListener('change', listFormulas);
  listFormulas();
}

function formulaInput(field, i) {
  return `<label for="formula-input-${i}"><strong>${field.label}</strong>
    ${field.options ? `<select id="formula-input-${i}">${field.options.map(([value,label]) => `<option value="${value}">${label}</option>`).join('')}</select>`
      : `<input type="text" id="formula-input-${i}" inputmode="${field.list || (!field.positive && field.min === undefined) ? 'text' : 'decimal'}" autocomplete="off" maxlength="${field.list ? 360 : 28}">`}</label>`;
}

function readFormulaInput(field, i) {
  const raw = get('formula-input-'+i).value;
  if (field.options) return raw;
  const values = field.list ? raw.trim().split(/[\s,]+/).map(mockNumber) : [mockNumber(raw)];
  if (values.some(value => !Number.isFinite(value) || Math.abs(value)>1e12 || (field.integer && !Number.isInteger(value)) ||
    (field.positive && value<=0) || (field.min !== undefined && value<field.min) || (field.max !== undefined && value>field.max))) {
    throw Error('ตรวจช่อง “'+field.label+'” ให้เป็นตัวเลขในช่วงที่โจทย์กำหนด');
  }
  return field.list ? values : values[0];
}

function renderFormulaCard(box, card) {
  const variant = formulaVariants[card.id];
  box.innerHTML = `
    <article class="panel formula-panel">
      <p class="kicker">ห้องสูตร · Lecture ${card.group+8}</p><h1>${card.name}</h1>
      <p class="scene">${card.when}</p>
      <div class="formula-memory"><span>คำจำ</span><strong>${card.memory}</strong></div>
      <details class="worked formula-explain"><summary>เปิดสูตรและดูว่ามาจากไหน</summary><p class="math formula-symbol">${card.symbol}</p><p>${card.why}</p>
        <p class="tip">${card.trap}</p></details>
      <section class="formula-calc">
        <h2>ลองแทนตัวเลข</h2><p id="formula-scenario">${card.question}</p>
        <form id="formula-calculator">
          <div class="formula-filters formula-inputs">${card.fields.map(formulaInput).join('')}</div>
          <div class="actions"><button class="button quiet" type="submit">ใช้ตัวเลขที่กรอก</button>
            <button class="button quiet" type="button" id="formula-example">คืนตัวอย่าง</button>
            <button class="button primary" type="button" id="formula-variant">ลองโจทย์ใหม่</button></div>
        </form>
        <p id="formula-error" role="status"></p>
        <form class="formula-challenge" id="formula-challenge" hidden>
          <label for="formula-answer"><strong>${variant.ask}</strong></label><input id="formula-answer" type="text" inputmode="${variant.answer < 0 ? 'text' : 'decimal'}" autocomplete="off" maxlength="28" placeholder="ใส่คำตอบของคุณ">
          <button type="submit" class="button primary">ตรวจคำตอบ</button><p id="formula-result" role="status"></p>
        </form>
        <div class="formula-solution"><h3>วิธีคิดทีละขั้น</h3><ol class="steps" id="formula-steps"></ol>
          <button class="button quiet" type="button" id="formula-reveal">เปิดขั้นแรก</button></div>
      </section>
      <div class="actions"><a class="button quiet" href="#formulas-${card.group}">สูตรในบทนี้</a><a class="button quiet" href="#lesson-${card.group}">กลับไปดูบทเรียน</a>
        ${/^(one-|paired|independent|anova|two-|chi|regression-[ft])/.test(card.id) ? '<a class="button quiet" href="#p-value">นำสถิติไปหา p-value</a>' : ''}
        <a class="button quiet" href="#quick-quiz">ปิดสูตรแล้วลองเกม</a></div>
    </article>`;
  let steps = [];
  let revealed = 0;
  const reveal = get('formula-reveal');
  const error = get('formula-error');
  const challenge = get('formula-challenge');
  function prepare() {
    error.className = '';
    error.textContent = '';
    get('formula-steps').replaceChildren();
    revealed = 0;
    try {
      steps = card.calc(card.fields.map(readFormulaInput));
      reveal.textContent = 'เปิดขั้นแรก';
      reveal.disabled = false;
    } catch (issue) {
      error.className = 'feedback retry';
      error.textContent = issue.message;
      steps = [];
      reveal.disabled = true;
      reveal.textContent = 'ตรวจตัวเลขก่อนเปิดขั้นตอน';
    }
  }
  function loadValues(values, isChallenge) {
    card.fields.forEach((_, i) => {get('formula-input-'+i).value = values[i];});
    challenge.hidden = !isChallenge;
    get('formula-answer').value = '';
    get('formula-result').textContent = '';
    get('formula-result').className = '';
    get('formula-scenario').textContent = isChallenge ? 'ใช้ตัวเลขชุดใหม่ด้านล่าง ลองคำนวณก่อนเปิดวิธีคิด' : card.question;
    prepare();
  }
  const form = get('formula-calculator');
  form.addEventListener('submit', event => {event.preventDefault(); prepare();});
  form.addEventListener('input', () => {
    challenge.hidden = true;
    get('formula-scenario').textContent = 'ชุดตัวเลขของคุณ · กด “ใช้ตัวเลขที่กรอก” เพื่อเปิดวิธีคิดชุดนี้';
    get('formula-steps').replaceChildren();
    reveal.disabled = true;
    reveal.textContent = 'รอใช้ตัวเลขที่แก้ไข';
    error.textContent = '';
    error.className = '';
  });
  get('formula-example').addEventListener('click', () => loadValues(card.fields.map(field => field.value), false));
  get('formula-variant').addEventListener('click', () => {
    loadValues(variant.values, true);
    get('formula-answer').focus();
  });
  challenge.addEventListener('submit', event => {
    event.preventDefault();
    const answer = mockNumber(get('formula-answer').value);
    const correct = Math.abs(answer-variant.answer) <= variant.tolerance+1e-9;
    const result = get('formula-result');
    result.className = 'feedback' + (correct ? '' : ' retry');
    result.textContent = !Number.isFinite(answer) ? 'ใส่คำตอบเป็นตัวเลขก่อนตรวจ'
      : correct ? 'ถูกครับ ลองอธิบายว่าตัวหารหรือระยะเผื่อในข้อนี้มาจากไหน แล้วเปิดวิธีคิดเช็ก'
      : 'ลองอีกครั้ง เช็กเครื่องหมาย หน่วย และตัวหาร หรือเปิดดูทีละขั้นตรงที่ติด';
  });
  reveal.addEventListener('click', () => {
    if (revealed >= steps.length) return;
    const [title, text] = steps[revealed++];
    const item = document.createElement('li');
    const label = document.createElement('strong');
    const paragraph = document.createElement('p');
    label.textContent = title;
    paragraph.textContent = text;
    item.append(label, paragraph);
    item.tabIndex = -1;
    get('formula-steps').append(item);
    item.focus();
    reveal.disabled = revealed >= steps.length;
    reveal.textContent = reveal.disabled ? 'เปิดครบทุกขั้นแล้ว' : 'เปิดขั้นถัดไป';
  });
  loadValues(card.fields.map(field => field.value), false);
}

function mixFormulaChoices(items) {
  const copy = [...items];
  for (let i=copy.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [copy[i],copy[j]] = [copy[j],copy[i]];
  }
  return copy;
}

function renderFormulaGame(box, moveFocus = false) {
  if (!formulaGame) {
    box.innerHTML = `<article class="panel formula-panel"><div class="formula-game-cover"><h1>เกมเลือกสูตร</h1>
      <p>เห็นสถานการณ์แล้วเลือกวิธี ลองจับคำสำคัญให้ทันก่อนเปิดสูตร</p></div>
      <div class="game-modes"><button class="button quiet" type="button" id="game-short"><b>6 ข้อ</b><span>รอบสั้น · สลับครบทุกบท</span></button>
        <button class="button quiet" type="button" id="game-all"><b>14 ข้อ</b><span>รอบเต็ม · หนึ่งข้อต่อสูตร</span></button></div>
      <div class="actions"><a href="#formulas" class="button quiet">ทวนคำจำ</a></div></article>`;
    get('game-short').addEventListener('click', () => {
      const cards = formulaGroups.map((_,group) => mixFormulaChoices(formulaPractice.filter(q => formulaById[q[1]].group===group))[0]);
      startFormulaGame(box, cards);
    });
    get('game-all').addEventListener('click', () => startFormulaGame(box, formulaPractice));
  } else if (formulaGame.index === formulaGame.deck.length) {
    const solved = formulaGame.answers.filter((answer,i) => answer === formulaGame.deck[i].question[1]).length;
    const missed = formulaGame.deck.filter(({question},i) => question[1] !== formulaGame.answers[i]);
    box.innerHTML = `<article class="panel formula-panel"><p class="kicker">จบรอบฝึก</p><h1>เลือกถูก ${solved} / ${formulaGame.deck.length}</h1>
      <p>${missed.length ? 'เปิดสูตรเฉพาะที่ติด แล้วลองเลือกจากสถานการณ์อีกครั้ง' : 'พร้อมลองแทนตัวเลขเองหรือไปข้อสอบจำลองได้เลย'}</p>
      ${missed.length ? `<ul class="steps">${missed.map(({question}) => `<li><a href="#formula-${question[1]}">${formulaById[question[1]].name}</a> · ${question[3]}</li>`).join('')}</ul>` : ''}
      <div class="actions">${missed.length ? '<button type="button" class="button primary" id="game-retry">ลองเฉพาะข้อที่พลาด</button>' : '<a class="button primary" href="#mock">ไปข้อสอบจำลอง</a>'}
        <button type="button" class="button quiet" id="game-reset">เลือกรอบใหม่</button><a class="button quiet" href="#formulas">เปิดห้องสูตร</a></div></article>`;
    get('game-reset').addEventListener('click', () => {formulaGame = null; renderFormulaGame(box,true);});
    get('game-retry')?.addEventListener('click', () => startFormulaGame(box,missed.map(entry=>entry.question)));
  } else {
    const index = formulaGame.index;
    const {question, choices} = formulaGame.deck[index];
    const [scene, answer,,reason] = question;
    const selected = formulaGame.answers[index];
    box.innerHTML = `<article class="panel formula-panel game-question"><p class="kicker">เกมเลือกสูตร · ข้อ ${index+1} / ${formulaGame.deck.length}</p>
      <div class="progress" aria-hidden="true"><span style="width:${100*formulaGame.answers.length/formulaGame.deck.length}%"></span></div>
      <h1>ข้อนี้ใช้สูตรไหน?</h1><div class="problem"><p>${scene}</p></div>
      <div class="choice-grid" role="group" aria-label="เลือกสูตร">${choices.map(id => `<button type="button" class="choice${selected && id===answer ? ' good' : id===selected ? ' bad' : ''}" data-game-answer="${id}" ${selected ? 'disabled' : ''}>${formulaById[id].name}${selected && id===answer ? ' ✓' : ''}</button>`).join('')}</div>
      ${selected ? `<div class="feedback${selected===answer ? '' : ' retry'}" id="game-feedback" tabindex="-1"><strong>${selected===answer ? 'ถูกครับ' : 'ดูคำใบ้จากโจทย์'}</strong><p>${reason}</p></div>` : ''}
      <div class="actions"><button class="button primary" type="button" id="game-next" ${selected ? '' : 'disabled'}>${index+1===formulaGame.deck.length ? 'ดูสรุป' : 'โจทย์ถัดไป'}</button>
        ${selected ? `<a class="button quiet" href="#formula-${answer}">เปิดสูตรนี้</a>` : ''}</div></article>`;
    box.querySelectorAll('[data-game-answer]').forEach(button => button.addEventListener('click', () => {
      formulaGame.answers[index] = button.dataset.gameAnswer;
      renderFormulaGame(box);
      get('game-feedback').focus();
    }));
    get('game-next').addEventListener('click', () => {formulaGame.index++; renderFormulaGame(box,true);});
  }
  if (moveFocus) {
    const heading = box.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}

function startFormulaGame(box, questions) {
  formulaGame = {
    index:0,
    answers:[],
    deck:mixFormulaChoices(questions).map(question => ({question,choices:mixFormulaChoices([question[1],...question[2]])}))
  };
  renderFormulaGame(box,true);
}
