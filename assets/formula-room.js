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
  box.innerHTML = `<article class="panel formula-panel">
    <p class="kicker">Start from scratch · About 5 minutes</p>
    <h1>What are the numbers telling you?</h1>
    <p class="scene">Four people in a coffee shop wait <strong>4, 6, 8, and 10 minutes</strong>. We will use their waits to unpack three ideas that appear in almost every lesson.</p>
    <div class="foundation-values" aria-label="Four waiting times in minutes"><span>4</span><span>6</span><span>8</span><span>10</span>
    </div>
    <section class="formula-foundation">
    <h2>1. What if everyone waited the same amount?</h2>
    <p>Add the waits and divide by the number of people. This is the <strong>mean</strong>, written x̄.</p>
    <details class="worked"><summary>See the calculation</summary>
    <p class="math">x̄ = (4 + 6 + 8 + 10) ÷ 4 = 7 minutes</p>
    <p>Think of pouring four glasses of water into one jug, then splitting it evenly.</p>
    </details>
    <h2>2. How far are the waits from 7 minutes?</h2>
    <p><strong>Standard deviation (SD)</strong> measures spread. If everyone waited exactly 7 minutes, the SD would be zero.</p>
    <details class="worked"><summary>See where the SD comes from</summary>
    <ol class="steps"><li>The gaps from 7 are −3, −1, +1, and +3 minutes.</li><li>Square the gaps to keep positive and negative values from cancelling: 9, 1, 1, 9.</li><li>Add them and divide by n−1 for the sample variance: 20/3. Take the square root to return to minutes: s ≈ 2.58 minutes.</li>
    </ol>
    </details>
    <h2>3. How much would the sample mean change if we asked other people?</h2>
    <p><strong>Standard error (SE)</strong> measures how much the estimate varies from sample to sample. If individual spread stays fixed, a larger independent sample gives a steadier mean.</p>
    <div class="actions" role="group" aria-label="Choose a sample size">${[4,16,64].map(n => `<button type="button" class="button quiet" data-foundation-n="${n}">${n} people</button>`).join('')}</div>
    <div class="foundation-meter">
    <div class="track" aria-hidden="true"><span id="se-bar"></span>
    </div>
    <p id="se-text" role="status">
    </p>
    </div>
    <h2>4. What are you trying to do?</h2>
    <div class="formula-patterns">
    <div><strong>Estimate a range</strong>
    <p>Centre ± margin of error</p><small>The margin is critical value × SE.</small>
    </div>
    <div><strong>Test a claim</strong>
    <p>Difference ÷ SE</p><small>How many standard errors from the claimed value?</small>
    </div>
    <div><strong>Make a prediction</strong>
    <p>Starting value + predictor terms</p><small>Keep the units clear.</small>
    </div>
    </div>
    <p class="tip"><strong>Before choosing a formula:</strong> ask whether the goal is to estimate, test, or predict. Then check whether the data are numbers or categories.</p>
    <details class="worked"><summary>Four ways to avoid calculator errors</summary>
    <ol class="steps"><li>Write the units and the subtraction order first, for example after − before or group 1 − group 2.</li><li>Calculate the denominator first, for example 10 ÷ √25 = 2.</li><li>Keep the unrounded result between steps. For example, 2.064 × 2 = 4.128. Round only at the end.</li><li>Check the size and sign. A centre of 60 and margin near 4 should give bounds near 56 and 64.</li>
    </ol>
    </details>
    </section>
    <div class="actions"><a class="button primary" href="#formula-ci-mean">Try your first formula</a><a class="button quiet" href="#formulas">Browse all formulas</a>
    </div>
    </article>`;
  const controls = box.querySelectorAll('[data-foundation-n]');
  function showSE(n) {
    const s = Math.sqrt(20/3);
    get('se-bar').style.width = (200/Math.sqrt(n))+'%';
    get('se-text').textContent = `Fixed SD ≈ 2.58 minutes · SE = 2.58 ÷ √${n} ≈ ${formulaFormat(s/Math.sqrt(n),2)} minutes`;
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
  box.innerHTML = `<section class="panel formula-index">
    <p class="kicker">TU155 · Lectures 8–13</p>
    <h1>Formula guide</h1>
    <p class="scene">Find when to use a formula, grab a memory cue, and try your own numbers.</p>
    <div class="actions"><a class="button primary" href="#quick-quiz">Play the formula game</a><a class="button quiet" href="#basics">Start from scratch</a><a class="button quiet" href="#p-value">Work out a p-value</a>
    </div>
    <div class="formula-patterns">
    <div><strong>Estimate</strong>
    <p>Centre ± margin of error</p>
    </div>
    <div><strong>Test</strong>
    <p>Difference ÷ standard error</p><small>Use this for t and z statistics.</small>
    </div>
    <div><strong>Predict</strong>
    <p>Starting value + predictor terms</p>
    </div>
    </div>
    <details class="worked"><summary>Look up a symbol</summary>${table(["Symbol","Meaning"],[['x̄ / μ',"Sample mean / population mean"],['s / σ',"Sample standard deviation / population standard deviation"],['n / N',"Sample size / total size as defined by the question"],['p̂ / p₀',"Sample proportion / proportion claimed under H₀"],['SE / df',"Standard error / degrees of freedom"],['H₀ / Hₐ',"Null hypothesis (reference claim) / alternative hypothesis (the question being tested)"],['p-value / α',"Probability of a result at least this extreme under H₀ / significance cutoff set before testing"],['O / E',"Observed count / expected count"],['SS / MS',"Sum of squares / sum of squares divided by its degrees of freedom"],['y / ŷ',"Observed value / predicted value"]])}</details>
    <div class="formula-filters">
    <label>Find a formula<input id="formula-query" type="search" placeholder="For example: before and after, chi-square, SE">
    </label>
    <label>Topic<select id="formula-filter"><option value="">All topics</option>${formulaGroups.map((name,i) => `<option value="${i}" ${String(i) === selected ? 'selected' : ''}>${i+8} · ${name}</option>`).join('')}</select>
    </label>
    </div>
    <p class="muted" id="formula-count" role="status">
    </p>
    <div class="formula-index-grid" id="formula-list">
    </div>
    <details class="worked"><summary>How to make it stick for the exam</summary>
    <ol class="steps"><li>Work through one example and explain why each number goes where it does.</li><li>Try a fresh question before revealing the steps.</li><li>Mix question types in the formula game so you learn to tell similar problems apart.</li><li>Tomorrow, write down the formula from memory and revisit the step where you got stuck.</li>
    </ol>
    <p><a href="https://pubmed.ncbi.nlm.nih.gov/16507066/">Retrieval practice</a> · <a href="https://doi.org/10.1207/s15516709cog1302_1">Self-explanation</a> · <a href="https://doi.org/10.1037/EDU0000367">Mixed practice</a>
    </p>
    </details>
    </section>`;
  function listFormulas() {
    const group = get('formula-filter').value;
    const terms = get('formula-query').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const cards = formulas.filter(card => {
      const searchable = [card.name,card.when,card.keyword,card.memory,card.symbol].join(' ').toLowerCase();
      return (group === '' || String(card.group) === group) && terms.every(term => searchable.includes(term));
    });
    get('formula-count').textContent = `${cards.length} of ${formulas.length} formulas shown`;
    get('formula-list').innerHTML = cards.map(card => `<a class="tile formula-tile" href="#formula-${card.id}">
      <span class="topic">${formulaGroups[card.group]}</span><strong>${card.name}</strong><span class="context">${card.when}</span>
      <span class="tile-bottom"><span class="tag">${card.memory}</span></span>
    </a>`).join('') || "<p>No formulas match. Try a shorter term or choose all topics.</p>";
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
    throw Error("Check the field “"+field.label+"” and enter a number in the stated range.");
  }
  return field.list ? values : values[0];
}

function renderFormulaCard(box, card) {
  const variant = formulaVariants[card.id];
  box.innerHTML = `<article class="panel formula-panel">
    <p class="kicker">Formula guide · Lecture ${card.group+8}</p>
    <h1>${card.name}</h1>
    <p class="scene">${card.when}</p>
    <div class="formula-memory"><span>Memory cue</span><strong>${card.memory}</strong>
    </div>
    <details class="worked formula-explain"><summary>Reveal the formula and why it works</summary>
    <p class="math formula-symbol">${card.symbol}</p>
    <p>${card.why}</p>
    <p class="tip">${card.trap}</p>
    </details>
    <section class="formula-calc">
    <h2>Try the numbers</h2>
    <p id="formula-scenario">${card.question}</p>
    <form id="formula-calculator">
    <div class="formula-filters formula-inputs">${card.fields.map(formulaInput).join('')}</div>
    <div class="actions"><button class="button quiet" type="submit">Use my numbers</button><button class="button quiet" type="button" id="formula-example">Restore example</button><button class="button primary" type="button" id="formula-variant">Try a new question</button>
    </div>
    </form>
    <p id="formula-error" role="status">
    </p>
    <form class="formula-challenge" id="formula-challenge" hidden>
    <label for="formula-answer"><strong>${variant.ask}</strong>
    </label><input id="formula-answer" type="text" inputmode="${variant.answer < 0 ? 'text' : 'decimal'}" autocomplete="off" maxlength="28" placeholder="Enter your answer"><button type="submit" class="button primary">Check answer</button>
    <p id="formula-result" role="status">
    </p>
    </form>
    <div class="formula-solution">
    <h3>Work it out step by step</h3>
    <ol class="steps" id="formula-steps">
    </ol><button class="button quiet" type="button" id="formula-reveal">Reveal the first step</button>
    </div>
    </section>
    <div class="actions"><a class="button quiet" href="#formulas-${card.group}">Formulas for this topic</a><a class="button quiet" href="#lesson-${card.group}">Back to the lesson</a>${/^(one-|paired|independent|anova|two-|chi|regression-[ft])/.test(card.id) ? "<a class=\"button quiet\" href=\"#p-value\">Calculate a p-value</a>" : ''}<a class="button quiet" href="#quick-quiz">Try the formula game</a>
    </div>
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
      reveal.textContent = "Reveal the first step";
      reveal.disabled = false;
    } catch (issue) {
      error.className = 'feedback retry';
      error.textContent = issue.message;
      steps = [];
      reveal.disabled = true;
      reveal.textContent = "Check the numbers first";
    }
  }
  function loadValues(values, isChallenge) {
    card.fields.forEach((_, i) => {get('formula-input-'+i).value = values[i];});
    challenge.hidden = !isChallenge;
    get('formula-answer').value = '';
    get('formula-result').textContent = '';
    get('formula-result').className = '';
    get('formula-scenario').textContent = isChallenge ? "Use the new numbers below. Try the calculation before revealing the steps." : card.question;
    prepare();
  }
  const form = get('formula-calculator');
  form.addEventListener('submit', event => {event.preventDefault(); prepare();});
  form.addEventListener('input', () => {
    challenge.hidden = true;
    get('formula-scenario').textContent = "Your numbers · Select “Use my numbers” to refresh the calculation.";
    get('formula-steps').replaceChildren();
    reveal.disabled = true;
    reveal.textContent = "Apply your changes first";
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
    result.textContent = !Number.isFinite(answer) ? "Enter a number before checking."
      : correct ? "Correct. Explain why you used that denominator or margin, then compare with the worked steps."
      : "Try again. Check the sign, units, and denominator. Reveal a step if you get stuck.";
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
    reveal.textContent = reveal.disabled ? "All steps revealed" : "Reveal the next step";
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
    box.innerHTML = `<article class="panel formula-panel">
    <div class="formula-game-cover">
    <h1>Which formula fits?</h1>
    <p>Read a short scenario and pick a method. Look for the clue that tells you what the question is asking.</p>
    </div>
    <div class="game-modes"><button class="button quiet" type="button" id="game-short"><b>6 questions</b><span>Quick round · one per topic</span></button><button class="button quiet" type="button" id="game-all"><b>14 questions</b><span>Full round · one per formula</span></button>
    </div>
    <div class="actions"><a href="#formulas" class="button quiet">Review the formulas</a>
    </div>
    </article>`;
    get('game-short').addEventListener('click', () => {
      const cards = formulaGroups.map((_,group) => mixFormulaChoices(formulaPractice.filter(q => formulaById[q[1]].group===group))[0]);
      startFormulaGame(box, cards);
    });
    get('game-all').addEventListener('click', () => startFormulaGame(box, formulaPractice));
  } else if (formulaGame.index === formulaGame.deck.length) {
    const solved = formulaGame.answers.filter((answer,i) => answer === formulaGame.deck[i].question[1]).length;
    const missed = formulaGame.deck.filter(({question},i) => question[1] !== formulaGame.answers[i]);
    box.innerHTML = `<article class="panel formula-panel">
    <p class="kicker">Round complete</p>
    <h1>${solved} / ${formulaGame.deck.length} correct</h1>
    <p>${missed.length ? "Review the formulas you missed, then try choosing them from the scenario again." : "Try a worked calculation or move on to a mock exam."}</p>${missed.length ? `<ul class="steps">${missed.map(({question}) => `<li><a href="#formula-${question[1]}">${formulaById[question[1]].name}</a> · ${question[3]}</li>`).join('')}</ul>` : ''}<div class="actions">${missed.length ? "<button type=\"button\" class=\"button primary\" id=\"game-retry\">Retry missed questions</button>" : "<a class=\"button primary\" href=\"#mock\">Open the mock exam</a>"}<button type="button" class="button quiet" id="game-reset">Choose a new round</button><a class="button quiet" href="#formulas">Browse formulas</a>
    </div>
    </article>`;
    get('game-reset').addEventListener('click', () => {formulaGame = null; renderFormulaGame(box,true);});
    get('game-retry')?.addEventListener('click', () => startFormulaGame(box,missed.map(entry=>entry.question)));
  } else {
    const index = formulaGame.index;
    const {question, choices} = formulaGame.deck[index];
    const [scene, answer,,reason] = question;
    const selected = formulaGame.answers[index];
    box.innerHTML = `<article class="panel formula-panel game-question">
    <p class="kicker">Formula game · Question ${index+1} / ${formulaGame.deck.length}</p>
    <div class="progress" aria-hidden="true"><span style="width:${100*formulaGame.answers.length/formulaGame.deck.length}%"></span>
    </div>
    <h1>Which method fits?</h1>
    <div class="problem">
    <p>${scene}</p>
    </div>
    <div class="choice-grid" role="group" aria-label="Choose a method">${choices.map(id => `<button type="button" class="choice${selected && id===answer ? ' good' : id===selected ? ' bad' : ''}" data-game-answer="${id}" ${selected ? 'disabled' : ''}>${formulaById[id].name}${selected && id===answer ? ' ✓' : ''}</button>`).join('')}</div>${selected ? `<div class="feedback${selected===answer ? '' : ' retry'}" id="game-feedback" tabindex="-1"><strong>${selected===answer ? "Correct" : "Here is the clue"}</strong><p>${reason}</p></div>` : ''}<div class="actions"><button class="button primary" type="button" id="game-next" ${selected ? '' : 'disabled'}>${index+1===formulaGame.deck.length ? "See your score" : "Next question"}</button>${selected ? `<a class="button quiet" href="#formula-${answer}">Explore this formula</a>` : ''}</div>
    </article>`;
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
