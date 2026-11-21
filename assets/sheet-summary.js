const sheetAttemptPrefix = 'tu155-sheet-first-attempt-v1.';
const sheetAttemptMemory = new Map();
const sheetSkills = [
  {key:'trap', label:'Spotting traps'},
  {key:'formula', label:'Choosing formulas'},
  {key:'calculation', label:'Calculating'}
];

function getSheetFirstAttempt(id) {
  try {
    const saved = JSON.parse(localStorage.getItem(sheetAttemptPrefix + id));
    if (Array.isArray(saved) && saved.length === sheetSkills.length && saved.every(score => typeof score === 'boolean')) {
      return saved;
    }
  } catch {
    // Use this session's result if browser storage is unavailable.
  }
  return sheetAttemptMemory.get(id);
}

function saveSheetFirstAttempt(id, scores) {
  if (getSheetFirstAttempt(id)) return;
  sheetAttemptMemory.set(id, scores);
  try {
    localStorage.setItem(sheetAttemptPrefix + id, JSON.stringify(scores));
  } catch {
    // Keep the result available while the page remains open.
  }
}

function renderSheetSummary(section, group) {
  const questions = sheetGroupQuestions(group.id);
  const attempts = questions.map(question => ({question, scores:getSheetFirstAttempt(question.id)}))
    .filter(attempt => attempt.scores);
  const results = sheetSkills.map((skill, index) => ({
    ...skill, missed:attempts.filter(attempt => !attempt.scores[index]).map(attempt => attempt.question)
  }));
  const mostMissed = Math.max(...results.map(result => result.missed.length));
  const weakest = mostMissed ? results.filter(result => result.missed.length === mostMissed) : [];
  const followUpTitle = weakest.length > 1 ? 'Choose a skill to practise' : 'Practise your most missed skill';

  section.innerHTML = `
    <header class="sheet-summary-header">
      <p class="kicker">${group.label}</p>
      <h2 id="sheet-summary-title">Your sheet summary</h2>
      <p>${attempts.length} of ${questions.length} practice questions submitted. Each question counts once, based on your first submitted answer.</p>
    </header>
    <ul class="sheet-summary-scores">
      ${results.map(result => `<li${weakest.includes(result) ? ' class="sheet-summary-priority"' : ''}>
        <span>${result.label}</span>
        <strong>${attempts.length ? result.missed.length + ' of ' + attempts.length + ' missed' : 'Awaiting answers'}</strong>
      </li>`).join('')}
    </ul>
    ${weakest.length ? `<div class="sheet-summary-focus">
      <h3>${followUpTitle}</h3>
      <p>${weakest.length > 1
        ? 'These skills have the same number of misses. Each has its own follow-up question.'
        : `Your most frequent mistake was in ${weakest[0].label.toLowerCase()}.`}</p>
      ${weakest.length > 1 ? `<div class="actions" role="group" aria-label="Choose a skill to practise">${weakest.map(result =>
        `<button type="button" class="button quiet" data-sheet-skill="${result.key}" aria-pressed="false">${result.label}</button>`).join('')}</div>` : ''}
      <div id="sheet-follow-up"></div>
    </div>` : `<p>${attempts.length
      ? 'You answered all three parts correctly on every question you’ve tried so far.'
      : 'Submit a practice question in this sheet to see which skill to work on.'}</p>`}`;

  if (!weakest.length) return;
  const followUp = section.querySelector('#sheet-follow-up');
  const buttons = section.querySelectorAll('[data-sheet-skill]');
  function showSkill(result, focus = false) {
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sheetSkill === result.key)));
    mountSheetFollowUp(followUp, group, result);
    if (focus) followUp.querySelector('h4').focus();
  }
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') !== 'true') showSkill(weakest.find(result => result.key === button.dataset.sheetSkill), true);
    });
  });
  showSkill(weakest[0]);
}

function mountSheetFollowUp(section, group, result) {
  const question = sheetFollowUps[group.id][result.key];
  const isNumeric = !question.options;
  const offset = (walkthroughGroups.indexOf(group) + sheetSkills.findIndex(skill => skill.key === result.key)) % 3;
  section.innerHTML = `
    <details class="sheet-summary-misses">
      <summary>See the questions you missed in this skill</summary>
      <ul>${result.missed.map(item => `<li><a href="#sheet-${item.id}${item.group === group.id ? '' : '--' + group.id}">${escapeSheetText(item.title)}</a></li>`).join('')}</ul>
    </details>
    <div class="sheet-practice sheet-follow-up">
      <div class="sheet-practice-header">
        <h4 tabindex="-1">${result.label} practice</h4>
        <p>${escapeSheetText(question.prompt)}</p>
      </div>
      <form class="sheet-practice-form">
        <fieldset class="sheet-practice-field">
          <legend>${isNumeric ? 'Your calculation' : 'Choose one answer'}</legend>
          ${isNumeric ? `
            <label for="sheet-follow-answer">${escapeSheetText(question.target)}</label>
            <input type="text" id="sheet-follow-answer" name="answer" inputmode="decimal" autocomplete="off" required>` :
            question.options.map((_, index) => {
              const option = (index + offset) % question.options.length;
              return `<label class="sheet-practice-option"><input type="radio" name="answer" value="${option}" required>
                <span>${escapeSheetText(question.options[option])}</span></label>`;
            }).join('')}
        </fieldset>
        <button type="submit" class="button primary">Check my answer</button>
      </form>
      <div class="sheet-practice-review" hidden>
        <p class="sheet-follow-feedback" tabindex="-1"></p>
        <ol class="steps sheet-practice-steps"></ol>
        <div class="actions">
          <button type="button" class="button primary" data-follow-reveal></button>
          <button type="button" class="button quiet" data-follow-retry>Try again</button>
        </div>
      </div>
    </div>`;

  const form = section.querySelector('form');
  const review = section.querySelector('.sheet-practice-review');
  const input = form.elements.answer;
  if (isNumeric) input.addEventListener('input', () => input.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!review.hidden) return;
    const raw = new FormData(form).get('answer');
    const answer = isNumeric ? readSheetNumber(raw) : Number(raw);
    if (!Number.isFinite(answer)) {
      input.setCustomValidity('Enter a number, such as 2.35 or −0.8.');
      input.reportValidity();
      return;
    }
    const correct = isNumeric ? Math.abs(answer - question.value) <= question.tolerance + 1e-9 : answer === 0;
    const feedback = review.querySelector('.sheet-follow-feedback');
    feedback.textContent = correct ? 'Correct. Reveal the reasoning when you’re ready.' : `Check your answer. ${question.hint}`;
    feedback.classList.add(correct ? 'practice-correct' : 'practice-retry');
    form.querySelector('fieldset').disabled = true;
    form.querySelector('button').hidden = true;
    bindExamStepReveal(review.querySelector('ol'), review.querySelector('[data-follow-reveal]'), question.steps);
    review.hidden = false;
    feedback.focus();
  });
  review.querySelector('[data-follow-retry]').addEventListener('click', () => {
    mountSheetFollowUp(section, group, result);
    section.querySelector('input').focus();
  });
}
