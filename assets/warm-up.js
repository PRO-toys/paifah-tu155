'use strict';

const warmQuestions = [
  {
    title:"Does the new Thai tea recipe score differently?",
    prompt:"The same friends taste both recipes and rate them. You want to know whether the average score changed.",
    options:["Compare the two scores from each person.","Compare the scores as two separate groups.","Count the people in each category."],
    correct:0,
    explain:"Each friend tastes both recipes. Match their two scores, then subtract one from the other. That is the idea behind a paired t-test.",
    formula:'paired-t'
  },
  {
    title:"What happens when you ask more people?",
    prompt:"You increase a random sample from 4 to 16 people. If the SD stays the same, what happens to the standard error of the mean?",
    options:["It drops to one quarter.","It drops by half.","It stays the same."],
    correct:1,
    explain:"SE = SD ÷ √n. The sample becomes four times as large, so √n doubles and the SE falls by half.",
    formula:'ci-mean'
  },
  {
    title:"How does a longer walk affect predicted rent?",
    prompt:"A rent model uses thousands of baht. The coefficient for walking time is −0.3 per minute. What happens if the walk is one minute longer and everything else stays fixed?",
    options:["It falls by 3 baht.","It rises by 300 baht.","It falls by 300 baht."],
    correct:2,
    explain:"The minus sign means the prediction falls. A change of 0.3 thousand baht is 300 baht. Check both the sign and the units.",
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
    box.innerHTML=`<div class="warm-rail">
    <p>Warm-up complete</p>
    <div class="warm-marks" aria-hidden="true">${marks}</div>
    </div>
    <div class="warm-content">
    <h2 id="warm-heading" tabindex="-1">${score} / ${warmQuestions.length} correct</h2>
    <p>${score===warmQuestions.length?"Try a mixed round or put your method choice on the clock.":"Review the ideas you missed, then try again from memory."}</p>
    <div class="actions"><a class="button primary" href="#quick-quiz">Play the formula game</a><button class="button quiet" type="button" id="warm-reset">Play again</button>
    </div>
    </div>`;
    get('warm-reset').addEventListener('click',()=>{warmIndex=0;warmAnswers.length=0;renderWarmUp(true);});
  } else {
    box.innerHTML=`<div class="warm-rail">
    <p>Warm-up</p><strong>Question ${warmIndex+1} / ${warmQuestions.length}</strong>
    <div class="warm-marks" aria-hidden="true">${marks}</div>
    </div>
    <div class="warm-content">
    <h2 id="warm-heading" tabindex="-1">${question.title}</h2>
    <p>${question.prompt}</p>
    <div class="warm-choices" role="group" aria-label="Choose an answer">${question.options.map((label,i)=>`
          <button class="choice${selected===undefined?'':i===question.correct?' good':i===selected?' bad':''}" type="button" data-warm-answer="${i}" ${selected===undefined?'':'disabled'}>
            <span class="warm-letter" aria-hidden="true">${["A","B","C"][i]}</span><span>${label}${selected!==undefined&&i===question.correct?' ✓':''}</span>
          </button>`).join('')}</div>${selected===undefined?'':`<div class="feedback${selected===question.correct?'':' retry'} warm-feedback" tabindex="-1" id="warm-note"><strong>${selected===question.correct?"Correct":"The clue to look for"}</strong>
    <p>${question.explain}</p>
    </div>
    <div class="actions"><button class="button primary" id="warm-next" type="button">${warmIndex===warmQuestions.length-1?"See your score":"Next question"}</button><a class="button quiet" href="#formula-${question.formula}">Try this formula</a>
    </div>`}</div>`;
    box.querySelectorAll('[data-warm-answer]').forEach(button=>button.addEventListener('click',()=>{
      warmAnswers[warmIndex]=Number(button.dataset.warmAnswer);
      renderWarmUp();
      get('warm-note').focus();
    }));
    get('warm-next')?.addEventListener('click',()=>{warmIndex++;renderWarmUp(true);});
  }
  if (moveFocus) get('warm-heading').focus();
}
