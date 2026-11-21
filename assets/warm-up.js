'use strict';

const warmQuestions = [
  {
    title:'ชาไทยสูตรใหม่ ชนะสูตรเดิมไหม?',
    prompt:'ให้เพื่อนชุดเดิมชิมทั้งสองสูตรแล้วให้คะแนน อยากรู้ว่าคะแนนเฉลี่ยเปลี่ยนไหม',
    options:['เทียบคะแนนของคนเดิมทีละคู่','เทียบเหมือนเป็นเพื่อนสองกลุ่ม','นับจำนวนคนในแต่ละหมวด'],
    correct:0,
    explain:'คนเดิมชิมสองรอบ จับคู่คะแนนของแต่ละคนได้เลย คำจำคือ คนเดิม → ลบทีละคน → Paired t-test',
    formula:'paired-t'
  },
  {
    title:'ถามเพื่อนเพิ่ม จะมั่นใจขึ้นแค่ไหน?',
    prompt:'จากเดิมสุ่มถาม 4 คน เปลี่ยนเป็น 16 คน ถ้า SD เท่าเดิม ค่า SE ของค่าเฉลี่ยเปลี่ยนอย่างไร?',
    options:['เหลือหนึ่งในสี่','เหลือครึ่งหนึ่ง','เท่าเดิม'],
    correct:1,
    explain:'SE = SD ÷ √n จำนวนคนมากขึ้น 4 เท่า แต่ √n เพิ่ม 2 เท่า ค่า SE จึงเหลือครึ่งเดียว',
    formula:'ci-mean'
  },
  {
    title:'เดินไกลขึ้น ค่าเช่าที่ทำนายเปลี่ยนเท่าไร?',
    prompt:'โมเดลค่าเช่าหน่วยพันบาทให้ความชันของเวลาเดินเท่ากับ −0.3 ต่อนาที ถ้าเดินเพิ่ม 1 นาทีและตัวอื่นคงที่ จะอ่านอย่างไร?',
    options:['ลดลง 3 บาท','เพิ่มขึ้น 300 บาท','ลดลง 300 บาท'],
    correct:2,
    explain:'เครื่องหมายลบแปลว่าค่าทำนายลดลง และ 0.3 พันบาทเท่ากับ 300 บาท จุดนี้ให้เช็กเครื่องหมายกับหน่วยเสมอ',
    formula:'regression-predict'
  }
];

let warmIndex=0;
const warmAnswers=[];

function renderWarmUp(moveFocus = false) {
  const box=get('warm-up');
  const question=warmQuestions[warmIndex];
  const complete=!question;
  const selected=warmAnswers[warmIndex];
  const marks=warmQuestions.map((_,i)=>`<span class="${i<warmAnswers.length?'seen':''}"></span>`).join('');
  if (complete) {
    const score=warmAnswers.filter((choice,i)=>choice===warmQuestions[i].correct).length;
    box.innerHTML=`<div class="warm-rail"><p>จบเกมอุ่นเครื่อง</p><div class="warm-marks" aria-hidden="true">${marks}</div></div>
      <div class="warm-content"><h2 id="warm-heading" tabindex="-1">ตอบถูก ${score} / ${warmQuestions.length} ข้อ</h2>
        <p>${score===warmQuestions.length?'พร้อมลองโจทย์สลับบท หรือจับเวลาเลือกวิธีได้เลย':'ลองทวนจุดที่พลาด แล้วกลับมาตอบจากความจำอีกครั้ง'}</p>
        <div class="actions"><a class="button primary" href="#quick-quiz">เล่นเกมเลือกสูตรต่อ</a><button class="button quiet" type="button" id="warm-reset">เล่นใหม่</button></div></div>`;
    get('warm-reset').addEventListener('click',()=>{warmIndex=0;warmAnswers.length=0;renderWarmUp(true);});
  } else {
    box.innerHTML=`<div class="warm-rail"><p>เกมอุ่นเครื่อง</p><strong>ข้อ ${warmIndex+1} / ${warmQuestions.length}</strong><div class="warm-marks" aria-hidden="true">${marks}</div></div>
      <div class="warm-content"><h2 id="warm-heading" tabindex="-1">${question.title}</h2><p>${question.prompt}</p>
        <div class="warm-choices" role="group" aria-label="เลือกคำตอบ">${question.options.map((label,i)=>`
          <button class="choice${selected===undefined?'':i===question.correct?' good':i===selected?' bad':''}" type="button" data-warm-answer="${i}" ${selected===undefined?'':'disabled'}>
            <span class="warm-letter" aria-hidden="true">${['ก','ข','ค'][i]}</span><span>${label}${selected!==undefined&&i===question.correct?' ✓':''}</span>
          </button>`).join('')}</div>
        ${selected===undefined?'':`<div class="feedback${selected===question.correct?'':' retry'} warm-feedback" tabindex="-1" id="warm-note"><strong>${selected===question.correct?'ถูกแล้ว':'เคล็ดลับของข้อนี้'}</strong><p>${question.explain}</p></div>
          <div class="actions"><button class="button primary" id="warm-next" type="button">${warmIndex===warmQuestions.length-1?'ดูสรุป':'เล่นข้อต่อไป'}</button>
            <a class="button quiet" href="#formula-${question.formula}">ลองสูตรนี้</a></div>`}</div>`;
    box.querySelectorAll('[data-warm-answer]').forEach(button=>button.addEventListener('click',()=>{
      warmAnswers[warmIndex]=Number(button.dataset.warmAnswer);
      renderWarmUp();
      get('warm-note').focus();
    }));
    get('warm-next')?.addEventListener('click',()=>{warmIndex++;renderWarmUp(true);});
  }
  get('start-warm-up').onclick=()=>{
    box.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    get('warm-heading').focus({preventScroll:true});
  };
  if (moveFocus) get('warm-heading').focus();
}
