const sheetProgressKey = 'tu155-sheet-progress-v1';
const sheetGroupById = Object.fromEntries(walkthroughGroups.map(group => [group.id, group]));
const sheetQuestionById = Object.fromEntries(sheetWalkthroughs.map(question => [question.id, question]));
const sheetCompleted = new Set();

try {
  const savedSheets = JSON.parse(localStorage.getItem(sheetProgressKey) || '[]');
  if (Array.isArray(savedSheets)) savedSheets.forEach(id => {
    if (Object.hasOwn(sheetQuestionById, id)) sheetCompleted.add(id);
  });
} catch {
  // The walkthroughs also work when browser storage is unavailable.
}

function escapeSheetText(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function sheetReferences(question) {
  return [{group:question.group, where:question.where}, ...(question.also || [])];
}

function sheetGroupQuestions(groupId) {
  return sheetWalkthroughs.filter(question => sheetReferences(question).some(reference => reference.group === groupId))
    .sort((a, b) => {
      const page = question => Number(sheetReferences(question).find(ref => ref.group === groupId).where.match(/^Pages? (\d+)/)?.[1] || 0);
      return page(a) - page(b);
    });
}

function sheetSourceLabel(reference) {
  const group = sheetGroupById[reference.group];
  const label = `${group.label} · ${escapeSheetText(reference.where)}`;
  if (location.protocol !== 'file:' || typeof sourceURL !== 'function') return label;
  const pdfPage = reference.where.match(/^Pages? (\d+)/)?.[1];
  const href = group.source === null ? 'Statistic/OneDrive_2_11-21-2026.zip' :
    sourceURL(group.source) + (pdfPage ? `#page=${pdfPage}` : '');
  return `<a href="${escapeSheetText(href)}">${label}</a>`;
}

function renderSheetIndex(root, selectedGroup) {
  root.innerHTML = `
    <header class="sheet-intro">
      <div>
        <h1>Sheet Walkthroughs</h1>
        <p>Follow a worked question, then try a new one on the same skill and get feedback on your answers.</p>
      </div>
      <div class="sheet-progress">
        <strong>${sheetCompleted.size} of ${sheetWalkthroughs.length} reviewed</strong>
        <progress aria-label="Walkthroughs reviewed" value="${sheetCompleted.size}" max="${sheetWalkthroughs.length}"></progress>
      </div>
    </header>
    <nav class="sheet-filters" aria-label="Filter walkthroughs by source">
      ${[{id:'', label:'All sheets'}, ...walkthroughGroups].map(group => `
        <a class="button quiet" href="#sheets${group.id ? '-' + group.id : ''}" ${group.id === selectedGroup ? 'aria-current="page"' : ''}>${group.label}</a>
      `).join('')}
    </nav>
    <label class="sheet-search">Find a question or method
      <input type="search" id="sheet-search" placeholder="Try paired t, chi-square, or sleep" autocomplete="off">
    </label>
    <p class="muted" id="sheet-result-count" aria-live="polite"></p>
    <div id="sheet-results"></div>`;

  const input = root.querySelector('#sheet-search');
  const results = root.querySelector('#sheet-results');
  const count = root.querySelector('#sheet-result-count');
  const groups = selectedGroup ? [sheetGroupById[selectedGroup]] : walkthroughGroups;
  function showMatches() {
    const terms = input.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const matchedIds = new Set();
    const sections = groups.map(group => {
      const questions = sheetGroupQuestions(group.id).filter(question => {
        const source = sheetReferences(question).find(reference => reference.group === group.id);
        const searchable = [group.label, group.title, source.where, question.title, question.question, question.method].join(' ').toLowerCase();
        return terms.every(term => searchable.includes(term));
      });
      if (!questions.length) return '';
      questions.forEach(question => matchedIds.add(question.id));
      return `<section class="sheet-group">
        <h2>${group.label} <span>${group.title}</span></h2>
        <ul class="sheet-cards">${questions.map(question => {
          const source = sheetReferences(question).find(reference => reference.group === group.id);
          const reviewed = sheetCompleted.has(question.id);
          return `<li><a class="sheet-card" href="#sheet-${question.id}${question.group === group.id ? '' : '--' + group.id}">
            <span class="sheet-card-label">${escapeSheetText(source.where)}</span>
            <strong>${escapeSheetText(question.title)}</strong>
            ${reviewed ? '<span class="tag done">Reviewed</span>' : ''}
          </a></li>`;
        }).join('')}</ul>
      </section>`;
    });
    count.textContent = `${matchedIds.size} ${matchedIds.size === 1 ? 'walkthrough' : 'walkthroughs'}`;
    results.innerHTML = sections.join('') || '<p class="panel">No matches. Try a shorter search or choose another sheet.</p>';
  }
  input.addEventListener('input', showMatches);
  showMatches();
}

function renderSheetQuestion(root, question, groupId) {
  const group = sheetGroupById[groupId];
  const questions = sheetGroupQuestions(groupId);
  const index = questions.indexOf(question);
  const previous = questions[index - 1];
  const next = questions[index + 1];
  const caseURL = item => `#sheet-${item.id}${item.group === groupId ? '' : '--' + groupId}`;
  const references = sheetReferences(question);
  const source = references.find(reference => reference.group === groupId);
  const formulaURL = question.formula === 'p-value' ? '#p-value' : `#formula-${question.formula}`;
  root.innerHTML = `
    <article class="panel sheet-question">
      <nav class="sheet-back" aria-label="Sheet location">
        <a href="#sheets-${groupId}">← ${group.label}</a>
        <span>${index + 1} of ${questions.length} in this sheet</span>
      </nav>
      <h1>${escapeSheetText(question.title)}</h1>
      <p class="sheet-source">${sheetSourceLabel(source)}</p>
      <button type="button" class="button quiet sheet-practice-jump">Jump to the new question ↓</button>
      <section class="sheet-prompt" aria-labelledby="sheet-prompt-title">
        <h2 id="sheet-prompt-title">The question</h2>
        <p>${escapeSheetText(question.question)}</p>
        ${question.table ? `<div class="table-wrap" tabindex="0" role="region" aria-label="${escapeSheetText(question.table.caption)}">
          <table><caption>${escapeSheetText(question.table.caption)}</caption>
            <thead><tr>${question.table.columns.map(column => `<th scope="col">${escapeSheetText(column)}</th>`).join('')}</tr></thead>
            <tbody>${question.table.rows.map(([label, ...cells]) => `<tr><th scope="row">${escapeSheetText(label)}</th>${cells.map(cell => `<td>${escapeSheetText(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table>
        </div>` : ''}
      </section>
      <div class="sheet-thinking">
        <details class="sheet-reveal sheet-clue">
          <summary>Find the clue</summary>
          <p>${escapeSheetText(question.clue)}</p>
          <p><strong>Method</strong> · ${escapeSheetText(question.method)}</p>
        </details>
        <details class="sheet-reveal sheet-trap">
          <summary>Spot the trap and fix it</summary>
          <p><strong>The trap</strong> · ${escapeSheetText(question.trap)}</p>
          <p><strong>The fix</strong> · ${escapeSheetText(question.fix)}</p>
        </details>
      </div>
      <section class="sheet-solution" aria-labelledby="sheet-solution-title">
        <h2 id="sheet-solution-title">Work it out</h2>
        <ol class="steps" id="sheet-steps"></ol>
        <div class="actions"><button type="button" class="button primary" id="sheet-reveal"></button>
          <a class="button quiet" href="${formulaURL}">${question.formula === 'p-value' ? 'Explore p-values' : 'Open the formula guide'}</a></div>
        <p class="sheet-reviewed" id="sheet-reviewed" role="status" ${sheetCompleted.has(question.id) ? '' : 'hidden'}>Reviewed</p>
      </section>
      <section id="sheet-practice" class="sheet-practice" aria-labelledby="sheet-practice-title"></section>
      ${references.length > 1 ? `<p class="sheet-source">Also appears in ${references.filter(ref => ref !== source).map(ref => sheetSourceLabel(ref)).join(', ')}</p>` : ''}
      ${question.related?.length ? `<section class="sheet-related"><h2>Related questions</h2><ul>${question.related.map(id =>
        `<li><a href="#sheet-${id}">${escapeSheetText(sheetQuestionById[id].title)}</a></li>`).join('')}</ul></section>` : ''}
      <nav class="sheet-neighbors" aria-label="Other questions in ${group.label}">
        ${previous ? `<a class="button quiet" href="${caseURL(previous)}">← Previous question</a>` : ''}
        <a class="button quiet" href="#sheets-${groupId}">All ${group.label} questions</a>
        ${next ? `<a class="button quiet" href="${caseURL(next)}">Next question →</a>` : ''}
      </nav>
    </article>`;
  bindExamStepReveal(root.querySelector('#sheet-steps'), root.querySelector('#sheet-reveal'), question.steps, () => {
    sheetCompleted.add(question.id);
    try {
      localStorage.setItem(sheetProgressKey, JSON.stringify([...sheetCompleted]));
    } catch {
      // Progress remains available for this session.
    }
    root.querySelector('#sheet-reviewed').hidden = false;
  });
  mountSheetPractice(root, question.id);
  root.querySelector('.sheet-practice-jump').addEventListener('click', () => {
    const heading = root.querySelector('#sheet-practice-title');
    heading.tabIndex = -1;
    heading.focus();
    heading.scrollIntoView({block:'start'});
  });
}

function renderSheetRoute(hash) {
  const root = get('sheet-body');
  if (hash.startsWith('sheet-')) {
    const [id, group] = hash.slice(6).split('--');
    if (Object.hasOwn(sheetQuestionById, id)) {
      const question = sheetQuestionById[id];
      const selectedGroup = sheetReferences(question).some(ref => ref.group === group) ? group : question.group;
      renderSheetQuestion(root, question, selectedGroup);
      return;
    }
  }
  const group = hash.slice(7);
  renderSheetIndex(root, Object.hasOwn(sheetGroupById, group) ? group : '');
}
