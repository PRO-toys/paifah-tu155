const sheetSprintHistoryPrefix = 'tu155-sheet-sprint-history-v1.';
const sheetSprintHistoryMemory = new Map();

function newSheetSprintId() {
  return globalThis.crypto?.randomUUID?.() ??
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function sheetSprintId(round) {
  return typeof round.id === 'string' && /^[a-z0-9-]+$/.test(round.id) ? round.id :
    `legacy-${Math.trunc(round.deadline)}-${round.round}`;
}

function archiveSheetSprint(round) {
  if (!round || round.status === 'active') return;
  const id = sheetSprintId(round);
  if (sheetSprintHistoryMemory.has(id)) return;
  const snapshot = {...round, id};
  sheetSprintHistoryMemory.set(id, snapshot);
  try {
    const key = sheetSprintHistoryPrefix + id;
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify(snapshot));
  } catch {
    // Keep round history available while the page is open.
  }
}

function getSheetSprintHistory() {
  const records = new Map(sheetSprintHistoryMemory);
  try {
    for (let index = 0; index < localStorage.length; index++) {
      const key = localStorage.key(index);
      if (!key?.startsWith(sheetSprintHistoryPrefix)) continue;
      try {
        const record = JSON.parse(localStorage.getItem(key));
        if (validSheetSprint(record) && record.status !== 'active') records.set(sheetSprintId(record), record);
      } catch {
        // Other records remain available if one is invalid.
      }
    }
  } catch {
    // Session results remain available if browser storage is disabled.
  }
  const finished = round => Number.isFinite(round.finishedAt) ? round.finishedAt :
    round.status === 'expired' ? round.deadline : round.deadline - sheetSprintDuration;
  return [...records.values()].sort((a, b) => finished(b) - finished(a) || sheetSprintId(b).localeCompare(sheetSprintId(a)));
}

function sheetSprintCell(item) {
  return `${sheetSprintScenarios[item.id].topic}/${item.skill}`;
}

function buildFocusedSheetSprint(round, previousIds = []) {
  const missed = new Map();
  for (const entry of getSheetSprintEntries(round)) {
    if (entry.answer === undefined || entry.correct) continue;
    const key = sheetSprintCell(entry);
    const group = missed.get(key);
    if (group) group.count++;
    else missed.set(key, {topic:sheetSprintScenarios[entry.id].topic, skill:entry.skill, count:1});
  }
  const targets = [...missed.values()].sort((a, b) => b.count - a.count);
  const available = sheetSprintBank.map(bank => bank.filter(scenario => !round.plan.some(item => item.id === scenario.id))
    .sort((a, b) => Number(previousIds.includes(a.id)) - Number(previousIds.includes(b.id))));
  const topicUses = formulaGroups.map(() => 0);
  const {attempts} = getSheetPerformance(sheetWalkthroughs);
  const plan = [];
  for (const {topic, skill} of targets) {
    const scenario = available[topic].shift();
    if (!scenario) continue;
    const skillIndex = sheetSkills.findIndex(item => item.key === skill);
    plan.push({id:scenario.id, skill, before:sheetSprintBaseline(attempts, topic, skillIndex)});
    topicUses[topic]++;
  }
  // Cover as many missed combinations as the fresh scenarios allow, then add extra practice.
  while (plan.length < sheetSprintLength) {
    const target = targets.find(item => topicUses[item.topic] < 3 && available[item.topic].length);
    if (!target) break;
    const {topic, skill} = target;
    const scenario = available[topic].shift();
    const skillIndex = sheetSkills.findIndex(item => item.key === skill);
    plan.push({id:scenario.id, skill, before:sheetSprintBaseline(attempts, topic, skillIndex)});
    topicUses[topic]++;
  }
  return plan;
}

function renderSheetSprintComparison(round, previous, title = 'Compared with the previous round') {
  function countByCell(record) {
    const cells = new Map();
    for (const entry of getSheetSprintEntries(record)) {
      if (entry.answer === undefined) continue;
      const key = sheetSprintCell(entry);
      const row = cells.get(key) || {topic:sheetSprintScenarios[entry.id].topic, skill:entry.skill, correct:0, total:0};
      row.total++;
      row.correct += Number(entry.correct);
      cells.set(key, row);
    }
    return cells;
  }

  const earlier = previous ? countByCell(previous) : new Map();
  const comparisons = [...countByCell(round)].filter(([key]) => earlier.has(key))
    .map(([key, current]) => {
      const before = earlier.get(key);
      return {current, before, change:Math.round(100 * current.correct / current.total) - Math.round(100 * before.correct / before.total)};
    }).sort((a, b) => b.change - a.change);
  return `<section class="sheet-sprint-results" aria-labelledby="sprint-round-compare-title">
    <h2 id="sprint-round-compare-title">${title}</h2>
    ${comparisons.length ? `
      <p>Only answered questions on the same topic and skill are compared.</p>
      <ul class="sheet-sprint-comparisons">${comparisons.map(({current, before, change}) => {
        const label = sheetSkills.find(item => item.key === current.skill).label;
        return `<li><strong>${formulaGroups[current.topic]} · ${label}</strong>
          <span>Previous ${before.correct}/${before.total} correct · This round ${current.correct}/${current.total} correct</span>
          <span class="${change > 0 ? 'sheet-sprint-up' : change < 0 ? 'sheet-sprint-down' : ''}">${change > 0 ? 'Up' : change < 0 ? 'Down' : 'Steady'}${change ? ` ${Math.abs(change)} percentage ${Math.abs(change) === 1 ? 'point' : 'points'}` : ''}</span>
        </li>`;
      }).join('')}</ul>` : `<p>${previous ? 'A comparison needs an answered question on the same topic and skill in both rounds.' :
        'This is your first saved result. Finish another round to see what changed.'}</p>`}
  </section>`;
}

function sheetSprintFocusButton() {
  if (sheetSprint?.status === 'active') return '<a class="button primary" href="#sheets-sprint">Resume current round</a>';
  return '<button type="button" class="button primary" data-sprint-focus>Practise remaining mistakes</button>';
}

function renderSheetSprintHistory(root, selectedId) {
  expireSheetSprint();
  archiveSheetSprint(sheetSprint);
  const history = getSheetSprintHistory();
  const selected = history.find(round => sheetSprintId(round) === selectedId);
  if (selected) {
    renderSheetSprintResults(root, selected, true);
    return;
  }

  const latest = history[0];
  const hasMisses = latest && getSheetSprintEntries(latest).some(entry => entry.answer !== undefined && !entry.correct);
  const dateFormat = new Intl.DateTimeFormat('en', {dateStyle:'medium', timeStyle:'short'});
  root.innerHTML = `
    <article class="panel sheet-sprint">
      <p class="sheet-sprint-back"><a href="#sheets-review">← All-Sheet Review</a></p>
      <h1>10-minute review history</h1>
      <p>${history.length ? 'Your results are saved in this browser.' : 'Finish a round to save your first result here.'}</p>
      <div class="actions">${hasMisses ? sheetSprintFocusButton() :
        `<a class="button primary" href="#sheets-sprint">${sheetSprint?.status === 'active' ? 'Resume current round' : 'Open 10-minute review'}</a>`}</div>
      ${latest ? renderSheetSprintComparison(latest, history[1], 'Latest round vs previous round') : ''}
      ${history.length ? `<section class="sheet-sprint-results" aria-labelledby="sprint-history-list-title">
        <h2 id="sprint-history-list-title">Saved rounds</h2>
        <ol class="sheet-sprint-history">${history.map((round, index) => {
          const correct = getSheetSprintEntries(round).filter(item => item.correct).length;
          const unanswered = round.plan.length - round.answers.length;
          return `<li>
            <div><a href="#sheets-sprint-round-${sheetSprintId(round)}">Round ${history.length - index}${index === 0 ? ' · Latest' : ''}</a>
            <span class="muted">${dateFormat.format(round.deadline - sheetSprintDuration)} · ${round.mode === 'focused' ? 'Focused practice' : 'Standard review'}</span></div>
            <span><strong>${correct} of ${round.answers.length} correct</strong>${unanswered ?
              `<span class="muted"> · ${unanswered} unanswered</span>` : ''}</span>
          </li>`;
        }).join('')}</ol>
      </section>` : ''}
    </article>`;
  root.querySelector('[data-sprint-focus]')?.addEventListener('click', () => startSheetSprint(root, latest));
}
