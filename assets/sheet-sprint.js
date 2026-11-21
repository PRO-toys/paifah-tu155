const sheetSprintKey = 'tu155-sheet-sprint-v1';
const sheetSprintDuration = 10 * 60 * 1000;
const sheetSprintLength = 6;
const sheetSprintScenarios = Object.fromEntries(sheetSprintBank.flatMap((scenarios, topic) =>
  scenarios.map(scenario => [scenario.id, {...scenario, topic}])));
let sheetSprintTimer;
let sheetSprint = loadSheetSprint();

function loadSheetSprint() {
  try {
    const state = JSON.parse(sessionStorage.getItem(sheetSprintKey));
    if (state && Number.isSafeInteger(state.round) && state.round > 0
      && Number.isFinite(state.deadline) && ['active','complete','expired'].includes(state.status)
      && Array.isArray(state.plan) && state.plan.length === sheetSprintLength && state.plan.every(item =>
        item && Object.hasOwn(sheetSprintScenarios, item.id) && sheetSkills.some(skill => skill.key === item.skill)
        && Number.isInteger(item.before?.correct) && Number.isInteger(item.before?.attempted)
        && item.before.correct >= 0 && item.before.attempted >= item.before.correct)
      && Array.isArray(state.answers) && state.answers.length <= sheetSprintLength
      && (state.status !== 'active' || state.answers.length < sheetSprintLength)
      && state.answers.every(answer => typeof answer === 'string') && typeof state.draft === 'string') return state;
  } catch {
    // The review can run in memory when session storage is unavailable.
  }
  return null;
}

function saveSheetSprint() {
  try { sessionStorage.setItem(sheetSprintKey, JSON.stringify(sheetSprint)); } catch {
    // Keep this round available while the page remains open.
  }
}

function buildSheetSprint(round, previousIds = []) {
  const {attempts} = getSheetPerformance(sheetWalkthroughs);
  const topicUses = formulaGroups.map(() => 0);
  const skillUses = sheetSkills.map(() => 0);
  const cells = formulaGroups.flatMap((_, topic) => sheetSkills.map((skill, skillIndex) => {
    const scores = attempts.filter(({question}) => sheetTopicIndex(question) === topic);
    return {topic, skill:skill.key, skillIndex, used:0,
      attempted:scores.length, correct:scores.filter(attempt => attempt.scores[skillIndex]).length};
  }));
  const skillMisses = sheetSkills.map((_, index) => attempts.filter(attempt => !attempt.scores[index]).length);
  const usedScenarios = new Set();
  const plan = [];
  while (plan.length < sheetSprintLength) {
    const available = cells.filter(cell => sheetSprintBank[cell.topic].some(scenario => !usedScenarios.has(scenario.id)));
    const weight = cell => (cell.attempted - cell.correct) / (1 + cell.used);
    const fallbackWeight = cell => skillMisses[cell.skillIndex] / (1 + skillUses[cell.skillIndex]);
    available.sort((a, b) =>
      weight(b) - weight(a) || fallbackWeight(b) - fallbackWeight(a)
      || topicUses[a.topic] - topicUses[b.topic] || skillUses[a.skillIndex] - skillUses[b.skillIndex]
      || a.topic - b.topic || a.skillIndex - b.skillIndex);
    const cell = available[0];
    const topicBank = sheetSprintBank[cell.topic];
    const offset = (round - 1 + cell.skillIndex) % topicBank.length;
    const ordered = [...topicBank.slice(offset), ...topicBank.slice(0, offset)];
    const fresh = ordered.filter(item => !usedScenarios.has(item.id));
    const scenario = fresh.find(item => !previousIds.includes(item.id)) || fresh[0];
    plan.push({id:scenario.id, skill:cell.skill, before:{attempted:cell.attempted, correct:cell.correct}});
    usedScenarios.add(scenario.id);
    cell.used++;
    topicUses[cell.topic]++;
    skillUses[cell.skillIndex]++;
  }
  return plan;
}

function stopSheetSprintTimer() {
  clearInterval(sheetSprintTimer);
}

function expireSheetSprint() {
  if (sheetSprint?.status !== 'active' || Date.now() < sheetSprint.deadline) return false;
  sheetSprint.status = 'expired';
  sheetSprint.draft = '';
  saveSheetSprint();
  return true;
}

function sheetSprintScore(item, raw) {
  const field = sheetSprintScenarios[item.id][item.skill];
  return field.options ? raw === '0' : Math.abs(readSheetNumber(raw) - field.value) <= field.tolerance + 1e-9;
}

function renderSheetSprint(root, moveFocus = false) {
  stopSheetSprintTimer();
  expireSheetSprint();
  if (!sheetSprint) renderSheetSprintIntro(root);
  else if (sheetSprint.status === 'active') renderSheetSprintQuestion(root);
  else renderSheetSprintResults(root);
  if (moveFocus) {
    const heading = root.querySelector('h1');
    heading.tabIndex = -1;
    heading.focus({preventScroll:true});
    window.scrollTo(0,0);
  }
}

function renderSheetSprintIntro(root) {
  const hasMisses = getSheetPerformance(sheetWalkthroughs).weakest.length > 0;
  root.innerHTML = `
    <article class="panel sheet-sprint">
      <p class="sheet-sprint-back"><a href="#sheets-review">← All-Sheet Review</a></p>
      <h1>10-minute exam review</h1>
      <p>Work through six new questions in ten minutes. You’ll get feedback after you finish or when time runs out.</p>
      <p>${hasMisses ? 'Your practice history determines which topics and skills come first.' :
        'This round starts with a mix of exam topics. As you submit more Sheet practice, future rounds can focus on your mistakes.'}</p>
      <div class="actions"><button type="button" class="button primary" data-sprint-start>Start 10-minute round</button></div>
    </article>`;
  root.querySelector('[data-sprint-start]').addEventListener('click', () => startSheetSprint(root));
}

function startSheetSprint(root) {
  const round = (sheetSprint?.round ?? 0) + 1;
  const previousIds = sheetSprint?.plan.map(item => item.id);
  sheetSprint = {round, plan:buildSheetSprint(round, previousIds), deadline:Date.now() + sheetSprintDuration,
    status:'active', answers:[], draft:''};
  saveSheetSprint();
  renderSheetSprint(root, true);
}

function renderSheetSprintQuestion(root) {
  const index = sheetSprint.answers.length;
  const item = sheetSprint.plan[index];
  const scenario = sheetSprintScenarios[item.id];
  const field = scenario[item.skill];
  const skill = sheetSkills.find(entry => entry.key === item.skill);
  const offset = (sheetSprint.round + index) % 3;
  root.innerHTML = `
    <article class="panel sheet-sprint">
      <p class="sheet-sprint-back"><a href="#sheets-review">← All-Sheet Review</a></p>
      <div class="sheet-sprint-head">
        <div><h1>Question ${index + 1} of ${sheetSprintLength}</h1>
        <p>${formulaGroups[scenario.topic]} · ${skill.label}</p></div>
        <div class="sheet-sprint-time"><span>Time left</span><strong role="timer" aria-live="off"></strong></div>
      </div>
      <progress aria-label="Questions submitted" value="${index}" max="${sheetSprintLength}"></progress>
      <form class="sheet-sprint-form">
        <p>${escapeSheetText(scenario.story)}</p>
        <fieldset class="sheet-practice-field">
          <legend>${escapeSheetText(field.ask)}</legend>
          ${field.options ? field.options.map((_, slot) => {
            const option = (slot + offset) % field.options.length;
            return `<label class="sheet-practice-option"><input type="radio" name="answer" value="${option}"
              ${sheetSprint.draft === String(option) ? 'checked' : ''} required><span>${escapeSheetText(field.options[option])}</span></label>`;
          }).join('') : `<label for="sheet-sprint-answer">Your answer</label>
            <input id="sheet-sprint-answer" type="text" name="answer" inputmode="decimal" autocomplete="off"
              value="${escapeSheetText(sheetSprint.draft)}" required>`}
        </fieldset>
        <button type="submit" class="button primary">${index === sheetSprintLength - 1 ? 'Finish and see results' : 'Submit and continue'}</button>
      </form>
    </article>`;

  const form = root.querySelector('.sheet-sprint-form');
  const timer = root.querySelector('[role="timer"]');
  form.addEventListener('input', () => {
    if (!field.options) form.elements.answer.setCustomValidity('');
    sheetSprint.draft = new FormData(form).get('answer') ?? '';
    saveSheetSprint();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (sheetSprint.status !== 'active' || sheetSprint.answers.length !== index) return;
    if (expireSheetSprint()) {
      renderSheetSprint(root, true);
      return;
    }
    const raw = new FormData(form).get('answer');
    if (!field.options && !Number.isFinite(readSheetNumber(raw))) {
      form.elements.answer.setCustomValidity('Enter a number such as 2.35 or −0.8.');
      form.elements.answer.reportValidity();
      return;
    }
    sheetSprint.answers.push(raw);
    sheetSprint.draft = '';
    if (sheetSprint.answers.length === sheetSprintLength) sheetSprint.status = 'complete';
    saveSheetSprint();
    renderSheetSprint(root, true);
  });

  function tick() {
    if (expireSheetSprint()) {
      renderSheetSprint(root, true);
      return;
    }
    const seconds = Math.ceil((sheetSprint.deadline - Date.now()) / 1000);
    timer.textContent = `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
    timer.parentElement.classList.toggle('sheet-sprint-low', seconds <= 60);
  }
  sheetSprintTimer = setInterval(tick, 250);
  tick();
}

function renderSheetSprintResults(root) {
  const entries = sheetSprint.plan.map((item, index) => {
    const answer = sheetSprint.answers[index];
    return {...item, number:index + 1, answer, correct:answer !== undefined && sheetSprintScore(item, answer)};
  });
  const correct = entries.filter(entry => entry.correct).length;
  const answered = sheetSprint.answers.length;
  const comparisons = sheetSkills.map(skill => {
    const skillEntries = entries.filter(entry => entry.skill === skill.key && entry.answer !== undefined);
    const comparable = skillEntries.filter(entry => entry.before.attempted);
    const earlier = comparable.reduce((total, entry) => total + entry.before.correct / entry.before.attempted, 0);
    return {skill, total:skillEntries.length, correct:skillEntries.filter(entry => entry.correct).length,
      compared:comparable.length, before:comparable.length ? Math.round(100 * earlier / comparable.length) : null,
      after:comparable.length ? Math.round(100 * comparable.filter(entry => entry.correct).length / comparable.length) : null};
  }).filter(item => item.total);
  const revisit = entries.filter(entry => entry.answer !== undefined && !entry.correct)
    .sort((a, b) => (b.before.attempted - b.before.correct) - (a.before.attempted - a.before.correct));
  const unanswered = entries.filter(entry => entry.answer === undefined);
  const covered = new Set(entries.filter(entry => entry.answer !== undefined)
    .map(entry => `${sheetSprintScenarios[entry.id].topic}/${entry.skill}`));
  const earlierMistakes = getSheetReview().ranked.filter(({question, skills}) =>
    skills.some(skill => !covered.has(`${sheetTopicIndex(question)}/${skill.key}`))).slice(0, 2);

  function reviewLink(entry) {
    const scenario = sheetSprintScenarios[entry.id];
    const question = sheetQuestionById[scenario.review];
    const skill = sheetSkills.find(item => item.key === entry.skill);
    return `<li><a href="#sheet-${question.id}">${escapeSheetText(question.title)}</a>
      <span class="muted"> · ${skill.label}</span></li>`;
  }

  root.innerHTML = `
    <article class="panel sheet-sprint">
      <p class="sheet-sprint-back"><a href="#sheets-review">← All-Sheet Review</a></p>
      <h1>${sheetSprint.status === 'expired' ? 'Time’s up' : 'Round complete'}</h1>
      <p class="sheet-sprint-mark"><strong>${correct} of ${answered} submitted answers correct</strong>
        ${unanswered.length ? `<span>${unanswered.length} of ${sheetSprintLength} unanswered</span>` : ''}</p>
      <section class="sheet-sprint-results" aria-labelledby="sprint-progress-title">
        <h2 id="sprint-progress-title">What improved</h2>
        <p>Each comparison uses earlier first attempts on the same topic and skill. The round uses different questions, so treat the change as a practice signal.</p>
        ${comparisons.length ? `<ul class="sheet-sprint-comparisons">${comparisons.map(item => {
          const change = item.after - item.before;
          return `<li>
            <strong>${item.skill.label}</strong>
            <span>${item.correct} of ${item.total} correct this round</span>
            ${item.compared ? `<span>Earlier ${item.before}% · This round ${item.after}% on ${item.compared} comparable ${item.compared === 1 ? 'question' : 'questions'}.</span>
              <span class="${change > 0 ? 'sheet-sprint-up' : change < 0 ? 'sheet-sprint-down' : ''}">${change > 0 ? 'Up' : change < 0 ? 'Down' : 'Steady'}${change ? ` ${Math.abs(change)} percentage ${Math.abs(change) === 1 ? 'point' : 'points'}` : ''}</span>` :
              '<span>First results for these topic and skill combinations.</span>'}
          </li>`;
        }).join('')}</ul>` : '<p>Submit an answer next round to get a comparison here.</p>'}
      </section>
      <section class="sheet-sprint-results" aria-labelledby="sprint-revisit-title">
        <h2 id="sprint-revisit-title">What to review next</h2>
        ${revisit.length ? `<ol class="steps">${revisit.map(reviewLink).join('')}</ol>` :
          answered ? '<p>Every submitted answer was correct.</p>' : ''}
        ${unanswered.length ? `<h3>Questions to revisit from the unfinished part</h3><ul class="steps">${unanswered.map(reviewLink).join('')}</ul>` : ''}
        ${earlierMistakes.length ? `<h3>Earlier mistakes outside this round</h3><ul class="steps">${earlierMistakes.map(({question}) =>
          `<li><a href="#sheet-${question.id}">${escapeSheetText(question.title)}</a></li>`).join('')}</ul>` : ''}
      </section>
      <section class="sheet-sprint-results" aria-labelledby="sprint-solutions-title">
        <h2 id="sprint-solutions-title">Review the answers</h2>
        ${entries.map(entry => {
          const scenario = sheetSprintScenarios[entry.id];
          const field = scenario[entry.skill];
          const expected = field.options ? field.options[0] : field.display;
          const submitted = field.options ? field.options[Number(entry.answer)] : entry.answer;
          return `<details class="worked">
            <summary>Question ${entry.number} · ${formulaGroups[scenario.topic]} · ${entry.answer === undefined ? 'Unanswered' : entry.correct ? 'Correct' : 'Needs review'}</summary>
            <p>${escapeSheetText(scenario.story)}</p><p><strong>${escapeSheetText(field.ask)}</strong></p>
            ${entry.answer !== undefined ? `<p>Your answer · ${escapeSheetText(submitted)}</p>` : ''}
            <p>Correct answer · ${escapeSheetText(expected)}</p>
            <p>${escapeSheetText(field.explanation)}</p>
          </details>`;
        }).join('')}
      </section>
      <div class="actions"><button type="button" class="button primary" data-sprint-start>Start another round</button>
        <a class="button quiet" href="#sheets-review">Back to All-Sheet Review</a></div>
    </article>`;
  root.querySelector('[data-sprint-start]').addEventListener('click', () => startSheetSprint(root));
}
