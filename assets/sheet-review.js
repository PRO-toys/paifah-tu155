function getSheetReview() {
  const {attempts, results, weakest} = getSheetPerformance(sheetWalkthroughs);
  const totals = Object.fromEntries(results.map(result => [result.key, result.missed.length]));
  const topics = formulaGroups.map(name => ({name, attempted:0, missed:0}));
  const ranked = [];

  for (const {question, scores} of attempts) {
    const skills = sheetSkills.filter((_, index) => !scores[index])
      .sort((a, b) => totals[b.key] - totals[a.key]);
    const topic = topics[formulaById[question.formula]?.group ?? 1];
    topic.attempted++;
    if (skills.length) {
      topic.missed++;
      ranked.push({question, skills, topic:topic.name});
    }
  }

  ranked.sort((a, b) =>
    b.skills.length - a.skills.length ||
    b.skills.reduce((total, skill) => total + totals[skill.key], 0) -
      a.skills.reduce((total, skill) => total + totals[skill.key], 0) ||
    Number(b.question.group === 'final') - Number(a.question.group === 'final'));

  return {
    attempts, results, weakest, ranked,
    topics:topics.filter(topic => topic.attempted)
      .sort((a, b) => b.missed - a.missed || b.missed / b.attempted - a.missed / a.attempted)
  };
}

function renderSheetReview(root) {
  const {attempts, results, weakest, ranked, topics} = getSheetReview();
  const attemptedIds = new Set(attempts.map(({question}) => question.id));
  const nextQuestions = sheetWalkthroughs.filter(question => !attemptedIds.has(question.id))
    .sort((a, b) => Number(b.group === 'final') - Number(a.group === 'final')).slice(0, 3);
  const mostMissedTopic = topics[0]?.missed ?? 0;
  const topTopics = mostMissedTopic ? topics.filter(topic => topic.missed === mostMissedTopic) : [];
  const firstSet = ranked.slice(0, 5);
  const remaining = ranked.slice(5);

  function reviewItem({question, skills, topic}) {
    return `<li>
      <div class="sheet-review-item">
        <div>
          <p class="muted">${sheetGroupById[question.group].label} · ${topic}</p>
          <h3><a href="#sheet-${question.id}">${escapeSheetText(question.title)}</a></h3>
          <p class="sheet-review-misses">${skills.map(skill => skill.label).join(' · ')}</p>
        </div>
        <button type="button" class="button quiet" data-review-question="${question.id}" aria-controls="sheet-review-drill">Practise missed skills</button>
      </div>
    </li>`;
  }

  root.innerHTML = `
    <div class="sheet-review">
      <header class="sheet-intro">
        <div>
          <a class="sheet-review-back" href="#sheets">← All sheets</a>
          <h1>All-Sheet Review</h1>
          <p>See where you lose marks and what to review first before the exam.</p>
        </div>
        <div class="sheet-progress">
          <strong>${attempts.length} of ${sheetWalkthroughs.length} practice questions submitted</strong>
          <progress aria-label="Practice questions submitted" value="${attempts.length}" max="${sheetWalkthroughs.length}"></progress>
        </div>
      </header>
      ${attempts.length ? `<div class="sheet-review-overview">
        <section class="panel" aria-labelledby="sheet-review-skills-title">
          <h2 id="sheet-review-skills-title">Most missed skills</h2>
          <p>Each question counts once, using your first submission, even if it appears in two sheets.</p>
          <ul class="sheet-summary-scores">
            ${results.map(result => `<li${weakest.includes(result) ? ' class="sheet-summary-priority"' : ''}>
              <span>${result.label}</span><strong>${result.missed.length} of ${attempts.length} missed</strong>
            </li>`).join('')}
          </ul>
          ${weakest.length ? `<div class="actions">${weakest.map(skill => `<button type="button" class="button primary"
            data-review-skill="${skill.key}" aria-controls="sheet-review-drill">Practise ${skill.label.toLowerCase()}</button>`).join('')}</div>` :
            '<p>All three parts were correct on every question you’ve tried.</p>'}
        </section>
        <section class="panel" aria-labelledby="sheet-review-topics-title">
          <h2 id="sheet-review-topics-title">Topics to revisit</h2>
          <p>Counts show how many questions had at least one missed part in each topic.</p>
          <ul class="sheet-review-topics">${topics.map(topic => `<li${topTopics.includes(topic) ? ' class="sheet-summary-priority"' : ''}>
            <span>${topic.name}</span><strong>${topic.missed} of ${topic.attempted} missed</strong>
          </li>`).join('')}</ul>
        </section>
      </div>` : `<section class="panel sheet-review-section">
        <h2>Start with a practice question</h2>
        <p>Submit a practice answer in any sheet to see your most missed skills and get a review order here.</p>
      </section>`}
      <section class="panel sheet-review-section" id="sheet-review-drill" aria-labelledby="sheet-review-drill-title" hidden></section>
      ${ranked.length ? `<section class="panel sheet-review-section" aria-labelledby="sheet-review-rank-title">
        <h2 id="sheet-review-rank-title">Review these first</h2>
        <p>Questions with more missed parts come first. Ties favour skills you miss more often, then Final Practice.</p>
        <ol class="sheet-review-list">${firstSet.map(reviewItem).join('')}</ol>
        ${remaining.length ? `<details class="sheet-review-more">
          <summary>Show ${remaining.length} more ${remaining.length === 1 ? 'question' : 'questions'}</summary>
          <ol class="sheet-review-list" start="${firstSet.length + 1}">${remaining.map(reviewItem).join('')}</ol>
        </details>` : ''}
      </section>` : ''}
      ${nextQuestions.length ? `<section class="panel sheet-review-section" aria-labelledby="sheet-review-next-title">
        <h2 id="sheet-review-next-title">${attempts.length ? 'Still to try' : 'Start with Final Practice'}</h2>
        <ul class="sheet-review-next">${nextQuestions.map(question => `<li><a href="#sheet-${question.id}">${escapeSheetText(question.title)}</a></li>`).join('')}</ul>
      </section>` : ''}
    </div>`;

  const panel = root.querySelector('#sheet-review-drill');
  function openDrill(entry, selectedSkill, trigger) {
    const group = sheetGroupById[entry.question.group];
    panel.hidden = false;
    panel.innerHTML = `
      <h2 id="sheet-review-drill-title" tabindex="-1">Targeted practice</h2>
      <p>Practise the same skill with another question from ${group.label}. <a href="#sheet-${entry.question.id}">Review the original walkthrough</a></p>
      ${entry.skills.length > 1 ? `<div class="actions sheet-review-switch" role="group" aria-label="Choose a skill to practise">
        ${entry.skills.map(skill => `<button type="button" class="button quiet" data-review-switch="${skill.key}" aria-pressed="false">${skill.label}</button>`).join('')}
      </div>` : ''}
      <div class="sheet-review-exercise"></div>
      <button type="button" class="button quiet sheet-review-close">Close practice</button>`;
    const exercise = panel.querySelector('.sheet-review-exercise');
    const switches = panel.querySelectorAll('[data-review-switch]');
    function showSkill(skill) {
      switches.forEach(button => {
        button.setAttribute('aria-pressed', String(button.dataset.reviewSwitch === skill.key));
      });
      mountSheetFollowUp(exercise, group, {...skill, missed:[]}, 'h3');
    }
    switches.forEach(button => button.addEventListener('click', () => {
      if (button.getAttribute('aria-pressed') === 'true') return;
      showSkill(entry.skills.find(skill => skill.key === button.dataset.reviewSwitch));
      exercise.querySelector('.sheet-follow-up-title').focus();
    }));
    panel.querySelector('.sheet-review-close').addEventListener('click', () => {
      panel.hidden = true;
      trigger.focus();
    });
    showSkill(selectedSkill);
    panel.querySelector('h2').focus({preventScroll:true});
    panel.scrollIntoView({block:'start'});
  }
  root.querySelectorAll('[data-review-question]').forEach(button => button.addEventListener('click', () => {
    const entry = ranked.find(item => item.question.id === button.dataset.reviewQuestion);
    openDrill(entry, entry.skills[0], button);
  }));
  root.querySelectorAll('[data-review-skill]').forEach(button => button.addEventListener('click', () => {
    const skill = weakest.find(item => item.key === button.dataset.reviewSkill);
    const entry = ranked.find(item => item.skills.some(itemSkill => itemSkill.key === skill.key));
    openDrill(entry, skill, button);
  }));
}
