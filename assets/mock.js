'use strict';

const mockQuestions = [
  {
    title:'ป้ายใหม่ช่วยให้เดินถึงห้องสอบเร็วขึ้นไหม?',
    context:'นักศึกษา 16 คนลองเดินจากประตูมหาวิทยาลัยถึงห้องสอบก่อนและหลังติดป้ายใหม่ วัดเป็นนาที กำหนด d = เวลาก่อน − เวลาหลัง จากทั้ง 16 คู่ได้ d̄ = 1.80 และ sᵈ = 2.40 ทดสอบที่ α = 0.05 ว่าหลังติดป้ายใช้เวลาน้อยลงหรือไม่',
    lesson:2,
    fields:[
      {prompt:'ก. เลือกวิธีทดสอบและสมมติฐานทางเลือก',options:['Independent t-test, Hₐ: μก่อน > μหลัง','Paired t-test, Hₐ: μᵈ > 0','Paired t-test, Hₐ: μᵈ < 0'],correct:1},
      {prompt:'ข. คำนวณ t',value:3,tolerance:.01},
      {prompt:'ค. ข้อสรุปในภาษาของโจทย์',options:['หลักฐานยังไม่พอว่าหลังติดป้ายใช้เวลาลดลง','มีหลักฐานว่าหลังติดป้ายใช้เวลามากขึ้น','มีหลักฐานว่าเวลาเดินเฉลี่ยหลังติดป้ายลดลง'],correct:2}
    ],
    steps:[
      ['ตั้งสมมติฐาน','H₀: μᵈ = 0 และ Hₐ: μᵈ > 0 เพราะ d = ก่อน − หลัง ถ้าเวลาเดินลดลง d จะเป็นบวก'],
      ['เลือกสถิติ','ใช้ Paired t-test ทางขวา เพราะวัดคนเดิมสองครั้ง และใช้ผลต่างทีละคน คำนวณ df = 16 − 1 = 15'],
      ['กำหนดระดับนัยสำคัญ','ใช้ α = 0.05 ตามโจทย์'],
      ['ตั้งกฎตัดสิน','ปฏิเสธ H₀ เมื่อ t > 1.753 หรือ p ทางขวา ≤ 0.05'],
      ['คำนวณ','SE = 2.40/√16 = 0.60 นาที ดังนั้น t = (1.80 − 0)/0.60 = 3.00 และ p ≈ 0.00449'],
      ['สรุป','ปฏิเสธ H₀ มีหลักฐานว่าหลังติดป้ายใหม่ นักศึกษาใช้เวลาเดินเฉลี่ยน้อยลง']
    ]
  },
  {
    title:'สมาชิกสองกลุ่มสนใจรับแก้วใช้ซ้ำต่างกันไหม?',
    context:'ชมรมสำรวจนักศึกษาจากสองกลุ่มอิสระ กลุ่มที่เดินทางโดยรถไฟฟ้าตอบว่าสนใจ 54 จาก 120 คน และกลุ่มที่เดินทางโดยรถเมล์ตอบว่าสนใจ 34 จาก 100 คน ทดสอบว่าสัดส่วนผู้สนใจของสองกลุ่มแตกต่างกันหรือไม่ ที่ α = 0.05 กำหนดกลุ่ม 1 เป็นรถไฟฟ้า',
    lesson:3,
    fields:[
      {prompt:'ก. คำนวณสัดส่วนรวม p̂ ภายใต้ H₀ (ตอบเป็นทศนิยม)',value:.4,tolerance:.002},
      {prompt:'ข. คำนวณ z โดยใช้กลุ่ม 1 ลบกลุ่ม 2',value:1.6583,tolerance:.015},
      {prompt:'ค. เลือก p-value และข้อสรุปตามคำถามที่ให้',options:['p ≈ 0.049 พบความต่างแบบสองทาง','p ≈ 0.097 หลักฐานยังไม่พอว่าสัดส่วนต่างกัน','p ≈ 0.097 พบความต่างที่ α = 0.05'],correct:1}
    ],
    steps:[
      ['ตั้งสมมติฐาน','H₀: p₁ = p₂ และ Hₐ: p₁ ≠ p₂ คำว่า “ต่างกันหรือไม่” ให้ดูสองหาง'],
      ['หาสัดส่วนรวม','p̂₁ = 54/120 = 0.45, p̂₂ = 34/100 = 0.34 และ p̂รวม = (54+34)/(120+100) = 0.40 ใช้สัดส่วนรวมใน SE เพราะ H₀ กำหนดให้สองกลุ่มมีสัดส่วนเดียวกัน'],
      ['แทนสูตร','SE = √[0.40(1−0.40)(1/120+1/100)] ≈ 0.0663 แล้วหารผลต่าง 0.11 ด้วย SE ได้ z ≈ 1.658'],
      ['อ่านสองหางและสรุป','p สองทาง ≈ 0.0973 > 0.05 จึงยังมีหลักฐานไม่พอว่าสัดส่วนผู้สนใจต่างกัน ค่า 0.0486 เป็น p ทางขวาสำหรับคำถามเจาะทิศทางที่กำหนดไว้ก่อนดูข้อมูล']
    ]
  },
  {
    title:'เวิร์กช็อปสามแบบให้คะแนนต่างกันไหม?',
    context:'นักศึกษาแต่ละคนเข้าร่วมเวิร์กช็อปออกแบบต้นแบบเพียงแบบเดียว หลังจบกิจกรรมทุกคนทำข้อสอบชุดเดียวกัน ใช้สถิติสรุปในตารางทดสอบที่ α = 0.05 สมมติว่ากลุ่มเป็นอิสระ คะแนนในแต่ละประชากรแจกแจงใกล้ปกติ และความแปรปรวนประชากรเท่ากัน',
    data:[['รูปแบบ','n','ค่าเฉลี่ย','s'],[['วิดีโอ',15,72,8],['ลงมือทำ',12,76,7],['เพื่อนสอนเพื่อน',18,81,9]]],
    lesson:2,
    fields:[
      {prompt:'ก. คำนวณค่าเฉลี่ยรวมแบบถ่วงน้ำหนัก',value:76.6667,tolerance:.02},
      {prompt:'ข. คำนวณ F',value:5.0036,tolerance:.03},
      {prompt:'ค. เลือกข้อสรุปจากการทดสอบ One-way ANOVA',options:['คะแนนเฉลี่ยทั้งสามแบบเท่ากัน','ทุกคู่แตกต่างกันอย่างมีนัยสำคัญ','มีหลักฐานว่าคะแนนเฉลี่ยไม่ได้เท่ากันทั้งหมด'],correct:2}
    ],
    steps:[
      ['ตั้งสมมติฐาน','H₀: μ₁ = μ₂ = μ₃ และ Hₐ: ค่าเฉลี่ยไม่ได้เท่ากันทั้งหมด ใช้ One-way ANOVA เพราะเทียบคะแนนเฉลี่ยของสามกลุ่มอิสระ'],
      ['หาค่าเฉลี่ยรวมและความต่างระหว่างกลุ่ม','x̄รวม = (15×72 + 12×76 + 18×81)/45 ≈ 76.667 และ SS ระหว่าง = Σnᵢ(x̄ᵢ−x̄รวม)² = 670'],
      ['หาความแกว่งภายในกลุ่ม','SS ภายใน = Σ(nᵢ−1)sᵢ² = 14×8² + 11×7² + 17×9² = 2,812'],
      ['เปลี่ยน SS เป็น MS แล้วหาร','df ระหว่าง = 3−1 = 2 และ df ภายใน = 45−3 = 42 ได้ F = (670/2)/(2,812/42) ≈ 5.004'],
      ['สรุป','p ≈ 0.0112 < 0.05 จึงปฏิเสธ H₀ มีหลักฐานว่าคะแนนเฉลี่ยไม่ได้เท่ากันทั้งหมด ต้องทดสอบรายคู่เพื่อระบุคู่ที่ต่าง']
    ]
  },
  {
    title:'ที่พักสัมพันธ์กับวิธีเดินทางไปมหาวิทยาลัยไหม?',
    context:'นักศึกษา 200 คนตอบแบบสำรวจเรื่องที่พักและวิธีเดินทางหลัก คนละหนึ่งคำตอบ ใช้ α = 0.05 ทดสอบว่าตัวแปรทั้งสองเป็นอิสระกันหรือไม่',
    data:[['วิธีเดินทาง','หอใกล้ campus','หอนอกพื้นที่','บ้าน','รวม'],[['เดิน / จักรยาน',36,18,12,66],['รถรับส่ง / รถเมล์',20,32,18,70],['รถส่วนตัว',14,20,30,64],['รวม',70,70,60,200]]],
    lesson:3,
    fields:[
      {prompt:'ก. คำนวณ E ของช่องเดิน / จักรยาน × หอใกล้ campus',value:23.1,tolerance:.02},
      {prompt:'ข. คำนวณ χ² จากทุกช่อง (ไม่รวมแถวและคอลัมน์ยอดรวม)',value:24.4358,tolerance:.08},
      {prompt:'ค. เลือก df และข้อสรุป',options:['df = 4, มีหลักฐานว่าที่พักสัมพันธ์กับวิธีเดินทาง','df = 4, หลักฐานยังไม่พอว่าตัวแปรสัมพันธ์กัน','df = 8, ยืนยันว่าตัวแปรเป็นอิสระ'],correct:0}
    ],
    steps:[
      ['ตั้งสมมติฐาน','H₀: ที่พักกับวิธีเดินทางเป็นอิสระกัน และ Hₐ: ตัวแปรทั้งสองสัมพันธ์กัน ใช้ Chi-square test of independence'],
      ['เติมจำนวนที่คาด','E = ยอดรวมแถว × ยอดรวมคอลัมน์ / ยอดรวมทั้งหมด ช่องแรกได้ 66×70/200 = 23.10 จำนวนคาดหมายทั้งเก้าช่องมากกว่า 5'],
      ['คิดทีละช่อง','ช่องแรกได้ (36−23.10)²/23.10 ≈ 7.20 ลองทำแบบเดียวกันอีก 8 ช่องแล้วบวก จะได้ χ² ≈ 24.436'],
      ['หา df แล้วตัดสิน','df = (3−1)(3−1) = 4, p ≈ 0.0000653 < 0.05 จึงปฏิเสธ H₀ มีหลักฐานว่าที่พักสัมพันธ์กับวิธีเดินทางหลัก']
    ]
  },
  {
    title:'ลูกค้ารอกาแฟเฉลี่ยกี่นาที?',
    context:'สุ่มจับเวลาออเดอร์ 49 รายการที่เป็นอิสระกันในช่วงเช้า พบค่าเฉลี่ย 8.40 นาที และส่วนเบี่ยงเบนมาตรฐานตัวอย่าง 2.80 นาที ต้องการช่วงความเชื่อมั่น 95% ของเวลาเฉลี่ยที่ลูกค้ารอในช่วงเช้าของร้านนี้ ไม่ทราบ σ',
    lesson:0,
    fields:[
      {prompt:'ก. ขอบล่างของช่วง 95% (นาที)',value:7.59575,tolerance:.02},
      {prompt:'ข. ขอบบนของช่วง 95% (นาที)',value:9.20425,tolerance:.02},
      {prompt:'ค. ประโยคใดแปลผลช่วงได้ถูกต้อง?',options:['ออเดอร์ 95% ใช้เวลาอยู่ในช่วงที่คำนวณ','เราเชื่อมั่น 95% ว่าเวลาเฉลี่ยของออเดอร์ช่วงเช้าของร้านอยู่ในช่วงที่คำนวณ','ออเดอร์ถัดไปมีโอกาส 95% ที่จะอยู่ในช่วงที่คำนวณ'],correct:1}
    ],
    steps:[
      ['เลือกการแจกแจง','ใช้ one-sample t interval เพราะใช้ s ประมาณ σ และ df = 49−1 = 48 จากตารางได้ t* ≈ 2.011'],
      ['หา SE และระยะเผื่อ','SE = 2.80/√49 = 0.40 นาที ระยะเผื่อ = 2.011×0.40 ≈ 0.804 นาที'],
      ['สร้างช่วง','8.40 ± 0.804 ได้ช่วงประมาณ (7.60, 9.20) นาที'],
      ['แปลผล','เราเชื่อมั่น 95% ว่าค่าเฉลี่ยเวลารอกาแฟของออเดอร์ช่วงเช้าของร้านนี้อยู่ระหว่าง 7.60 ถึง 9.20 นาที ช่วงนี้ประมาณค่าเฉลี่ยประชากร']
    ]
  },
  {
    title:'ค่าเช่าหอใกล้รถไฟฟ้าทำนายได้เท่าไร?',
    context:'สำรวจห้องเช่า 50 ห้อง ใช้ขนาดห้อง (ตร.ม.) เวลาเดินถึงสถานี (นาที) และชั้นอาคาร ทำนายค่าเช่ารายเดือนในหน่วยพันบาท ผล ANOVA ของโมเดลให้ SS Regression = 96, SS Residual = 44 และ df เท่ากับ 3 กับ 46 ตามลำดับ ใช้ α = 0.05',
    data:[['ตัวแปร','Coefficient','p-value'],[['Intercept','5.20','&lt;0.001'],['ขนาดห้อง','0.18','0.0004'],['เวลาเดินถึงสถานี','−0.35','0.008'],['ชั้นอาคาร','0.12','0.180']]],
    lesson:5,
    fields:[
      {prompt:'ก. เลือกสมการทำนายค่าเช่า',options:['ŷ = 5.20 + 0.18(ขนาด) − 0.35(เวลาเดิน) + 0.12(ชั้น)','ŷ = 5.20 + 0.18(ขนาด) + 0.35(เวลาเดิน) + 0.12(ชั้น)','ŷ = 0.18(ขนาด) − 0.35(เวลาเดิน) + 0.12(ชั้น)'],correct:0},
      {prompt:'ข. คำนวณ F สำหรับทดสอบโมเดลโดยรวม',value:33.4545,tolerance:.1},
      {prompt:'ค. ตัวทำนายใดมีนัยสำคัญรายตัวที่ระดับ 0.05?',options:['ทุกตัวทำนาย','ขนาดห้องและเวลาเดินถึงสถานี','ขนาดห้องและชั้นอาคาร'],correct:1},
      {prompt:'ง. ถ้าเดินไกลขึ้น 1 นาที โดยขนาดและชั้นคงที่ ค่าเช่าที่ทำนายจะเปลี่ยนกี่บาท? (ใส่เครื่องหมายด้วย)',value:-350,tolerance:.1},
      {prompt:'จ. ทำนายค่าเช่าห้อง 32 ตร.ม. เดิน 8 นาที อยู่ชั้น 7 (ตอบเป็นพันบาท)',value:9,tolerance:.02}
    ],
    steps:[
      ['เขียนสมการ','ŷ = 5.20 + 0.18(ขนาด) − 0.35(เวลาเดิน) + 0.12(ชั้น) ได้จากคอลัมน์ Coefficient โดยคงเครื่องหมายของแต่ละตัว'],
      ['ทดสอบทั้งโมเดล','H₀: ความชันทั้งสามเป็นศูนย์ F = (96/3)/(44/46) ≈ 33.45 ที่ df = (3,46) และ p < 0.001 จึงปฏิเสธ H₀ มีหลักฐานว่าความชันอย่างน้อยหนึ่งตัวต่างจากศูนย์'],
      ['ดูนัยสำคัญรายตัว','ขนาด (p = 0.0004) และเวลาเดิน (p = 0.008) ผ่านเกณฑ์ 0.05 ส่วนชั้น (p = 0.180) ยังมีหลักฐานไม่พอว่าความชันต่างจากศูนย์'],
      ['แปลความชันและแปลงหน่วย','เมื่อขนาดและชั้นคงที่ เดินเพิ่ม 1 นาทีสัมพันธ์กับค่าเช่าที่ทำนายลดลง 0.35 พันบาท หรือ 350 บาท'],
      ['แทนค่าทำนาย','5.20 + 0.18(32) − 0.35(8) + 0.12(7) = 9.00 พันบาท หรือ 9,000 บาทต่อเดือน']
    ]
  }
];

const mockStorageKey = 'paifah-tu155-mock-v1';
const emptyMock = () => ({
  questions: mockQuestions.map(question => ({values: question.fields.map(() => ''), work: ''})),
  drilled: [],
  submitted: false,
  index: 0
});

function loadMock() {
  const fresh = emptyMock();
  try {
    const stored = JSON.parse(localStorage.getItem(mockStorageKey));
    if (!Array.isArray(stored?.questions)) return fresh;
    fresh.questions.forEach((entry, index) => {
      const from = stored.questions[index];
      if (!Array.isArray(from?.values)) return;
      entry.values = entry.values.map((_, i) => typeof from.values[i] === 'string' ? from.values[i] : '');
      if (typeof from.work === 'string') entry.work = from.work;
    });
    fresh.submitted = stored.submitted === true && fresh.questions.every((entry, index) => mockComplete(index, entry.values));
    if (fresh.submitted && Array.isArray(stored.drilled)) {
      fresh.drilled = [...new Set(stored.drilled.filter(key => Object.hasOwn(mockDrills, key)))];
    }
    if (Number.isInteger(stored.index) && mockQuestions[stored.index]) fresh.index = stored.index;
  } catch {}
  return fresh;
}

let mockState = loadMock();
let mockReview = null;
let mockDrillKey = null;

function saveMock() {
  try { localStorage.setItem(mockStorageKey, JSON.stringify(mockState)); } catch {}
}

function mockNumber(value) {
  const normalized = value.trim().replace(/−/g, '-').replace(/[๐-๙]/g, digit => digit.charCodeAt(0) - 0x0e50);
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized) ? Number(normalized) : NaN;
}

function mockComplete(index, values) {
  return mockQuestions[index].fields.every((field, i) =>
    field.options ? field.options.some((_, option) => String(option) === values[i]) : Number.isFinite(mockNumber(values[i])));
}

function mockCorrect(field, value) {
  return field.options ? String(field.correct) === value : Math.abs(mockNumber(value) - field.value) <= field.tolerance + 1e-9;
}

function mockScore(question, index) {
  return question.fields.filter((field, i) => mockCorrect(field, mockState.questions[index].values[i])).length;
}

function mockDiagnosis() {
  return mockQuestions.flatMap((question, index) => question.fields.map((field, i) => {
    const key = mockFieldDrills[index][i];
    return {
      key, index, title: mockDrills[key].title, skill: mockDrills[key].skill,
      correct: mockCorrect(field, mockState.questions[index].values[i])
    };
  }));
}

function mockPager(index, review = false) {
  return `<div class="mock-pager" role="group" aria-label="เลือกข้อ">${mockQuestions.map((_, i) =>
    `<button type="button" class="button quiet" data-mock-page="${i}" ${i === index ? 'aria-current="step"' : ''}
      aria-label="ข้อ ${i+1}${review ? '' : mockComplete(i, mockState.questions[i].values) ? ' ตอบครบแล้ว' : ' ยังตอบไม่ครบ'}">${i+1}${!review && mockComplete(i, mockState.questions[i].values) ? ' ✓' : ''}</button>`
  ).join('')}</div>`;
}

function mockFields(question) {
  return question.fields.map((field, index) => field.options ?
    `<fieldset class="mock-field">
      <legend>${field.prompt}</legend>
      ${field.options.map((option, i) => `<label class="mock-option"><input type="radio" name="mock-field-${index}" data-mock-field="${index}" value="${i}"><span>${option}</span></label>`).join('')}
    </fieldset>` :
    `<label class="mock-field mock-number"><strong>${field.prompt}</strong><input type="text" inputmode="decimal" autocomplete="off" data-mock-field="${index}" placeholder="คำตอบเป็นตัวเลข" maxlength="28"></label>`).join('');
}

function updateMockProgress() {
  const done = mockQuestions.map((_, i) => mockComplete(i, mockState.questions[i].values));
  const count = done.filter(Boolean).length;
  get('mock-progress-text').textContent = `ตอบครบ ${count} จาก ${mockQuestions.length} ข้อ`;
  get('mock-progress-bar').style.width = `${100 * count / mockQuestions.length}%`;
  get('mock-body').querySelectorAll('[data-mock-page]').forEach((button, i) => {
    button.textContent = (i+1) + (done[i] ? ' ✓' : '');
    button.setAttribute('aria-label', `ข้อ ${i+1} ${done[i] ? 'ตอบครบแล้ว' : 'ยังตอบไม่ครบ'}`);
  });
}

function renderMockAttempt(box) {
  const index = mockState.index;
  const question = mockQuestions[index];
  const entry = mockState.questions[index];
  box.innerHTML = `
    <p class="kicker">ข้อสอบจำลอง · ข้อ ${index+1} / ${mockQuestions.length}</p>
    <h1 tabindex="-1">${question.title}</h1>
    <p>คิดเหมือนทำข้อสอบจริงแล้วค่อยกรอกคำตอบ เฉลยจะเปิดหลังส่งครบทั้งชุด</p>
    ${mockPager(index)}
    <p id="mock-progress-text" class="muted" role="status"></p>
    <div class="progress" aria-hidden="true"><span id="mock-progress-bar"></span></div>
    <div class="problem"><p>${question.context}</p>${question.data ? table(...question.data) : ''}</div>
    <p class="muted">กรอกตัวเลขเป็นทศนิยมอย่างน้อย 2 ตำแหน่งเมื่อจำเป็น และปัดเศษตอนสุดท้าย</p>
    ${mockFields(question)}
    <details class="mock-work"><summary>จดวิธีทำของข้อนี้</summary>
      <label for="mock-work">เช่น H₀/Hₐ สูตรที่ใช้ และข้อสรุป</label>
      <textarea id="mock-work" rows="4" maxlength="2400" placeholder="จดตรงนี้หรือทำบนกระดาษ"></textarea>
    </details>
    <div class="actions">
      ${index > 0 ? '<button class="button quiet" type="button" id="mock-prev">ข้อก่อนหน้า</button>' : ''}
      ${index < mockQuestions.length-1 ? '<button class="button quiet" type="button" id="mock-next">ข้อถัดไป</button>' : ''}
      <button class="button primary" type="button" id="mock-submit">ส่งคำตอบทั้งชุด</button>
    </div>
    <p id="mock-submit-message" role="status"></p>`;

  box.querySelectorAll('[data-mock-field]').forEach(input => {
    const fieldIndex = Number(input.dataset.mockField);
    if (input.type === 'radio') input.checked = input.value === entry.values[fieldIndex];
    else input.value = entry.values[fieldIndex];
    input.addEventListener('input', () => {
      entry.values[fieldIndex] = input.value;
      get('mock-submit-message').textContent = '';
      saveMock();
      updateMockProgress();
    });
  });
  get('mock-work').value = entry.work;
  get('mock-work').closest('details').open = entry.work.length > 0;
  get('mock-work').addEventListener('input', event => {
    entry.work = event.target.value;
    saveMock();
  });

  function openQuestion(target) {
    if (target === index) return;
    mockState.index = target;
    saveMock();
    renderMock(true);
  }
  box.querySelectorAll('[data-mock-page]').forEach(button => button.addEventListener('click', () => openQuestion(Number(button.dataset.mockPage))));
  get('mock-prev')?.addEventListener('click', () => openQuestion(index-1));
  get('mock-next')?.addEventListener('click', () => openQuestion(index+1));
  get('mock-submit').addEventListener('click', () => {
    const missing = mockQuestions.map((_, i) => i).filter(i => !mockComplete(i, mockState.questions[i].values));
    if (missing.length) {
      openQuestion(missing[0]);
      get('mock-submit-message').className = 'tip';
      get('mock-submit-message').textContent = `กรอกคำตอบข้อ ${missing.map(i => i+1).join(', ')} ให้ครบก่อนส่ง`;
      get('mock-submit-message').tabIndex = -1;
      get('mock-submit-message').focus();
      return;
    }
    mockState.submitted = true;
    saveMock();
    renderMock(true);
  });
  updateMockProgress();
}

function renderMockResults(box) {
  const diagnosis = mockDiagnosis();
  const missed = diagnosis.filter(item => !item.correct);
  const remaining = missed.filter(item => !mockState.drilled.includes(item.key));
  box.innerHTML = `<p class="kicker">ส่งข้อสอบจำลองแล้ว</p><h1 tabindex="-1">ได้ ${diagnosis.length - missed.length} / ${diagnosis.length} คะแนน</h1>
    <p>แต่ละข้อย่อยมี 1 คะแนน ส่วนวิธีทำที่จดไว้ ให้ตรวจเทียบกับเฉลยทีละขั้นด้วยตัวเอง</p>
    <section class="mock-diagnosis" aria-labelledby="diagnosis-title">
      <h2 id="diagnosis-title">พลาดตรงไหน?</h2>
      <p class="muted">สรุปจากทักษะที่แต่ละข้อย่อยวัด หากตัวเลขคลาดเคลื่อน ให้เทียบวิธีทำกับเฉลยเพื่อดูว่าพลาดตอนเลือกตัวเลข แทนสูตร หรือคำนวณ</p>
      <div class="mock-skill-grid">${Object.entries(mockSkills).map(([key, skill]) => {
        const entries = diagnosis.filter(item => item.skill === key);
        const errors = entries.filter(item => !item.correct);
        return `<div class="mock-skill"><h3>${skill.label}</h3>
          <strong>ถูก ${entries.length - errors.length}/${entries.length}</strong><p class="muted">${skill.description}</p>
          ${errors.length ? `<ul>${errors.map(error => `<li>ข้อ ${error.index+1} · ${error.title}${mockState.drilled.includes(error.key) ? ' <span class="tag done">ฝึกผ่านแล้ว</span>' : ''}</li>`).join('')}</ul>` : '<p>ทำถูกทุกข้อที่วัดทักษะนี้</p>'}</div>`;
      }).join('')}</div>
      ${remaining.length ? `<div class="actions"><button class="button primary" id="mock-start-drills" type="button">ฝึกเฉพาะจุด · เหลือ ${remaining.length} ข้อ</button></div>` :
        `<p class="feedback">${missed.length ? 'ทำโจทย์ใหม่ผ่านครบทุกจุดที่พลาดแล้ว' : 'ทำถูกครบทุกข้อในชุดนี้ จึงไม่มีโจทย์เฉพาะจุดให้ฝึกเพิ่ม'}</p>`}
    </section>
    <h2>เฉลยข้อสอบทีละขั้น</h2>
    <ol class="mock-results">${mockQuestions.map((question, i) => `<li><button type="button" class="button quiet" data-mock-review="${i}">
      <span>${i+1}. ${question.title}</span><strong>${mockScore(question, i)}/${question.fields.length}</strong></button></li>`).join('')}</ol>
    <div class="actions"><button class="button quiet" type="button" id="mock-reset">เริ่มทำชุดนี้ใหม่</button><a class="button quiet" href="#exam">กลับไปชุดซ้อมจากชีต</a></div>`;
  box.querySelectorAll('[data-mock-review]').forEach(button => button.addEventListener('click', () => {
    mockReview = Number(button.dataset.mockReview);
    renderMock(true);
  }));
  get('mock-start-drills')?.addEventListener('click', () => {
    mockDrillKey = remaining[0].key;
    renderMock(true);
  });
  get('mock-reset').addEventListener('click', () => {
    if (!confirm('เริ่มใหม่และล้างคำตอบกับคะแนนของข้อสอบจำลองชุดนี้ไหม?')) return;
    mockState = emptyMock();
    mockDrillKey = null;
    saveMock();
    renderMock(true);
  });
}

function renderMockDrill(box) {
  const missed = mockDiagnosis().filter(item => !item.correct);
  const entry = missed.find(item => item.key === mockDrillKey);
  const drill = mockDrills[entry.key];
  const passed = mockState.drilled.filter(key => missed.some(item => item.key === key)).length;
  box.innerHTML = `<p class="kicker">ฝึกเฉพาะจุด · ${mockSkills[entry.skill].label}</p>
    <h1 tabindex="-1">${drill.title}</h1>
    <p class="muted" id="mock-drill-progress">ฝึกผ่าน ${passed} จาก ${missed.length} จุด · จากข้อสอบข้อ ${entry.index+1}</p>
    <div class="problem"><p>${drill.prompt}</p></div>
    <form id="mock-drill-form">
      ${mockFields({fields:[{...drill, prompt:'คำตอบของคุณ'}]})}
      <button class="button primary" id="mock-drill-check" type="submit">ตรวจคำตอบ</button>
      <p id="mock-drill-feedback" role="status"></p>
      <button class="button primary" id="mock-drill-next" type="button" hidden></button>
    </form>
    <div class="actions">
      <button class="button quiet" id="mock-drill-back" type="button">กลับไปดูสรุป</button>
      <a class="button quiet" href="#lesson-${mockQuestions[entry.index].lesson}">ทวนบทที่เกี่ยวข้อง</a>
    </div>`;
  get('mock-drill-form').addEventListener('submit', event => {
    event.preventDefault();
    const answer = box.querySelector(drill.options ? 'input:checked' : 'input[data-mock-field]');
    const feedback = get('mock-drill-feedback');
    if (!answer || (!drill.options && !Number.isFinite(mockNumber(answer.value)))) {
      feedback.className = 'feedback retry';
      feedback.textContent = drill.options ? 'เลือกหนึ่งคำตอบก่อนตรวจ' : 'กรอกคำตอบเป็นตัวเลขก่อนตรวจ';
      return;
    }
    if (!mockCorrect(drill, answer.value)) {
      feedback.className = 'feedback retry';
      feedback.textContent = 'ลองอีกครั้ง · ' + drill.hint;
      return;
    }
    if (!mockState.drilled.includes(entry.key)) mockState.drilled.push(entry.key);
    saveMock();
    feedback.className = 'feedback';
    feedback.textContent = 'ถูกครับ · ' + drill.explanation;
    box.querySelectorAll('[data-mock-field]').forEach(input => {input.disabled = true;});
    const checkButton = get('mock-drill-check');
    checkButton.disabled = true;
    checkButton.hidden = true;
    const remaining = missed.find(item => !mockState.drilled.includes(item.key));
    const next = get('mock-drill-next');
    next.textContent = remaining ? 'ฝึกจุดถัดไป' : 'ดูสรุปหลังฝึก';
    next.hidden = false;
    get('mock-drill-progress').textContent = `ฝึกผ่าน ${passed + 1} จาก ${missed.length} จุด · จากข้อสอบข้อ ${entry.index+1}`;
    next.addEventListener('click', () => {
      mockDrillKey = remaining?.key ?? null;
      renderMock(true);
    });
    feedback.tabIndex = -1;
    feedback.focus();
  });
  get('mock-drill-back').addEventListener('click', () => {
    mockDrillKey = null;
    renderMock(true);
  });
}

function renderMockReview(box, index) {
  const question = mockQuestions[index];
  const entry = mockState.questions[index];
  box.innerHTML = `<p class="kicker">เฉลยข้อ ${index+1} / ${mockQuestions.length}</p><h1 tabindex="-1">${question.title}</h1>
    ${mockPager(index, true)}
    <div class="problem"><p>${question.context}</p>${question.data ? table(...question.data) : ''}</div>
    <h2>คำตอบของคุณ</h2>
    <ol class="steps" id="mock-own-answers"></ol>
    ${entry.work ? '<details class="mock-work"><summary>วิธีทำที่คุณจดไว้</summary><p id="mock-own-work"></p></details>' : ''}
    <h2>เฉลยทีละขั้น</h2>
    <ol class="steps" id="mock-solution" aria-label="ขั้นตอนเฉลย"></ol>
    <button type="button" class="button primary" id="mock-reveal"></button>
    <div class="actions"><button class="button quiet" type="button" id="mock-back-score">กลับไปดูคะแนน</button>
      <a class="button quiet" href="#lesson-${question.lesson}">ทวนบท ${topics[question.lesson].title}</a></div>`;
  question.fields.forEach((field, i) => {
    const item = document.createElement('li');
    const response = field.options ? field.options[Number(entry.values[i])] : entry.values[i];
    item.textContent = `${field.prompt} — ${response}`;
    get('mock-own-answers').append(item);
  });
  if (entry.work) get('mock-own-work').textContent = entry.work;
  box.querySelectorAll('[data-mock-page]').forEach(button => button.addEventListener('click', () => {
    if (index === Number(button.dataset.mockPage)) return;
    mockReview = Number(button.dataset.mockPage);
    renderMock(true);
  }));
  get('mock-back-score').addEventListener('click', () => {mockReview = null; renderMock(true);});

  let step = 0;
  const reveal = get('mock-reveal');
  reveal.textContent = `เปิดขั้นที่ 1 จาก ${question.steps.length}`;
  reveal.addEventListener('click', () => {
    const [heading, explanation] = question.steps[step];
    const element = document.createElement('li');
    element.innerHTML = `<strong>${heading}</strong><p>${explanation}</p>`;
    element.tabIndex = -1;
    get('mock-solution').append(element);
    element.focus();
    step += 1;
    reveal.disabled = step >= question.steps.length;
    reveal.textContent = reveal.disabled ? 'เปิดเฉลยครบแล้ว' : `เปิดขั้นที่ ${step+1} จาก ${question.steps.length}`;
    if (reveal.disabled) {
      [...get('mock-own-answers').children].forEach((item, i) => {
        const correct = mockCorrect(question.fields[i], entry.values[i]);
        const badge = document.createElement('span');
        badge.className = 'tag mock-result-tag' + (correct ? ' done' : '');
        badge.textContent = correct ? 'ถูก' : 'ทบทวน';
        item.append(' ', badge);
      });
    }
  });
}

function renderMock(moveFocus = false) {
  const box = get('mock-body');
  if (!mockState.submitted) renderMockAttempt(box);
  else if (mockDrillKey && !mockState.drilled.includes(mockDrillKey)) renderMockDrill(box);
  else if (mockReview === null) renderMockResults(box);
  else renderMockReview(box, mockReview);
  if (moveFocus) box.querySelector('h1').focus();
}
