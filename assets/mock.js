'use strict';

const mockQuestions = [
  {
    title:"Did the new signs shorten the walk?",
    context:"Sixteen students walk from the university gate to the exam room before and after new signs are installed. Define d = time before − time after in minutes. The mean and SD of the 16 differences are 1.80 and 2.40. Test whether average walking time fell, using α = 0.05.",
    lesson:2,
    fields:[
      {prompt:"a. Choose the test and alternative hypothesis.",options:["Independent-samples t-test, Hₐ: μ before > μ after",'Paired t-test, Hₐ: μᵈ > 0','Paired t-test, Hₐ: μᵈ < 0'],correct:1},
      {prompt:"b. Calculate t.",value:3,tolerance:.01},
      {prompt:"c. Choose a conclusion in context.",options:["There is insufficient evidence that average walking time fell after the new signs.","There is evidence that average walking time increased after the new signs.","There is evidence that average walking time fell after the new signs."],correct:2}
    ],
    steps:[
      ["State the hypotheses","H₀: μᵈ = 0 and Hₐ: μᵈ > 0. We define d = before − after, so a shorter walk gives a positive difference."],
      ["Choose the method","Use a right-tailed paired t-test because each student is measured twice. There are 16 differences, so df = 16 − 1 = 15."],
      ["Set the significance level","Use α = 0.05 as stated."],
      ["State the decision rule","Reject H₀ if t > 1.753 or the right-tail p-value is ≤ 0.05."],
      ["Calculate","SE = 2.40/√16 = 0.60 minutes. Then t = (1.80 − 0)/0.60 = 3.00 and p ≈ 0.00449."],
      ["Write the conclusion","Reject H₀. There is evidence that students took less time on average after the new signs were installed."]
    ]
  },
  {
    title:"Do the groups differ in interest in reusable cups?",
    context:"A student club surveys two independent groups. Of 120 train users, 54 are interested in a reusable cup. Of 100 bus users, 34 are interested. Test for a difference at α = 0.05, with train users as group 1.",
    lesson:3,
    fields:[
      {prompt:"a. Calculate the pooled proportion under H₀. Enter a decimal.",value:.4,tolerance:.002},
      {prompt:"b. Calculate z using group 1 minus group 2.",value:1.6583,tolerance:.015},
      {prompt:"c. Choose the p-value and conclusion for this question.",options:["Two-sided p ≈ 0.049. There is evidence that the proportions differ.","p ≈ 0.097. There is insufficient evidence that the proportions differ.","p ≈ 0.097. There is evidence of a difference at α = 0.05."],correct:1}
    ],
    steps:[
      ["State the hypotheses","H₀: p₁ = p₂ and Hₐ: p₁ ≠ p₂. The question asks whether the proportions differ, so use two tails."],
      ["Calculate the pooled proportion","p̂₁ = 54/120 = 0.45 and p̂₂ = 34/100 = 0.34. The pooled proportion is (54+34)/(120+100) = 0.40."],
      ["Substitute into the formula","SE = √[0.40(1−0.40)(1/120+1/100)] ≈ 0.0663. Divide the observed difference of 0.11 by SE to get z ≈ 1.658."],
      ["Read both tails and conclude","Two-sided p ≈ 0.0973 > 0.05, so there is insufficient evidence that interest differs. A right-tail value of 0.0486 applies to an alternative specified in that direction before seeing the data."]
    ]
  },
  {
    title:"Do the three workshops lead to different mean scores?",
    context:"Each student attends one prototype-design workshop. Everyone then takes the same test. At α = 0.05, compare the means using the summaries below. Assume independent observations, roughly normal scores in each population, and equal population variances.",
    data:[["Workshop",'n',"Mean score",'s'],[["Video",15,72,8],["Hands-on",12,76,7],["Peer teaching",18,81,9]]],
    lesson:2,
    fields:[
      {prompt:"a. Calculate the weighted grand mean.",value:76.6667,tolerance:.02},
      {prompt:"b. Calculate F.",value:5.0036,tolerance:.03},
      {prompt:"c. Choose the one-way ANOVA conclusion.",options:["The three population means are equal.","Every pair differs significantly.","There is evidence that the three population means are not all equal."],correct:2}
    ],
    steps:[
      ["State the hypotheses","H₀: μ₁ = μ₂ = μ₃. Hₐ: The means are not all equal. Use one-way ANOVA to compare three independent groups."],
      ["Find the grand mean and between-group variation","Grand mean = (15×72 + 12×76 + 18×81)/45 ≈ 76.667. SS between = Σnᵢ(x̄ᵢ−grand mean)² = 670."],
      ["Find the within-group variation","SS within = Σ(nᵢ−1)sᵢ² = 14×8² + 11×7² + 17×9² = 2,812."],
      ["Convert each SS to MS and divide","Between-group df = 3−1 = 2. Within-group df = 45−3 = 42. F = (670/2)/(2,812/42) ≈ 5.004."],
      ["Write the conclusion","p ≈ 0.0112 < 0.05. Reject H₀. The means are not all equal. Follow-up comparisons are needed to identify particular pairs."]
    ]
  },
  {
    title:"Is accommodation related to how students commute?",
    context:"Two hundred students identify their accommodation and one main way of getting to university. Test independence at α = 0.05.",
    data:[["Commute method","Dorm near campus","Off-campus dorm","Home","Total"],[["Walk or cycle",36,18,12,66],["Shuttle or bus",20,32,18,70],["Private vehicle",14,20,30,64],["Total",70,70,60,200]]],
    lesson:3,
    fields:[
      {prompt:"a. Calculate E for walking or cycling among students in dorms near campus.",value:23.1,tolerance:.02},
      {prompt:"b. Calculate χ² across the data cells. Exclude the total row and column.",value:24.4358,tolerance:.08},
      {prompt:"c. Choose the degrees of freedom and conclusion.",options:["df = 4. There is evidence that accommodation is associated with commute method.","df = 4. There is insufficient evidence of an association.","df = 8. The variables are confirmed to be independent."],correct:0}
    ],
    steps:[
      ["State the hypotheses","H₀: Accommodation and commute method are independent. Hₐ: They are associated. Use the chi-square test of independence."],
      ["Calculate the expected counts","E = row total × column total ÷ grand total. The first cell gives 66×70/200 = 23.10. All nine expected counts are above 5."],
      ["Work one cell at a time","The first cell gives (36−23.10)²/23.10 ≈ 7.20. Add contributions from all nine cells to get χ² ≈ 24.436."],
      ["Find df and make a decision","df = (3−1)(3−1) = 4, and p ≈ 0.0000653 < 0.05. Reject H₀. There is evidence that accommodation is associated with commute method."]
    ]
  },
  {
    title:"How long do customers wait for coffee?",
    context:"Time 49 independent morning orders selected at random. The mean wait is 8.40 minutes and the sample SD is 2.80 minutes. Find a 95% confidence interval for the shop's mean morning wait. The population SD is unknown.",
    lesson:0,
    fields:[
      {prompt:"a. Lower bound (minutes).",value:7.59575,tolerance:.02},
      {prompt:"b. Upper bound (minutes).",value:9.20425,tolerance:.02},
      {prompt:"c. Choose the correct interpretation.",options:["Ninety-five percent of individual orders take a time within this interval.","We are 95% confident that the population mean morning wait lies in this interval.","The next order has a 95% chance of a wait within this interval."],correct:1}
    ],
    steps:[
      ["Choose the reference distribution","Use a one-sample t interval because s estimates σ. With df = 49−1 = 48, t* ≈ 2.011."],
      ["Find the SE and margin of error","SE = 2.80/√49 = 0.40 minutes. The margin is 2.011×0.40 ≈ 0.804 minutes."],
      ["Find the endpoints","8.40 ± 0.804 gives approximately (7.60, 9.20) minutes."],
      ["Interpret the interval","We are 95% confident that the shop's population mean morning wait lies between 7.60 and 9.20 minutes."]
    ]
  },
  {
    title:"How much rent does the model predict?",
    context:"Data from 50 rooms predict monthly rent in thousands of baht from room size in m², walking time to the BTS in minutes, and floor. The model gives SS Regression = 96 with 3 df and SS Residual = 44 with 46 df. Use α = 0.05.",
    data:[["Variable",'Coefficient','p-value'],[['Intercept','5.20','&lt;0.001'],["Room size",'0.18','0.0004'],["Walking time to the station",'−0.35','0.008'],["Floor",'0.12','0.180']]],
    lesson:5,
    fields:[
      {prompt:"a. Choose the prediction equation.",options:["ŷ = 5.20 + 0.18(size) − 0.35(walking time) + 0.12(floor)","ŷ = 5.20 + 0.18(size) + 0.35(walking time) + 0.12(floor)","ŷ = 0.18(size) − 0.35(walking time) + 0.12(floor)"],correct:0},
      {prompt:"b. Calculate F for the overall model.",value:33.4545,tolerance:.1},
      {prompt:"c. Which predictors are individually significant at 0.05?",options:["All three predictors","Room size and walking time to the station","Room size and floor"],correct:1},
      {prompt:"d. What is the change in predicted rent in baht for one more minute of walking, with size and floor fixed? Include the sign.",value:-350,tolerance:.1},
      {prompt:"e. Predict rent in thousands of baht for 32 m², an 8-minute walk, and floor 7.",value:9,tolerance:.02}
    ],
    steps:[
      ["Write the prediction equation","Use the Coefficient column and keep each sign: ŷ = 5.20 + 0.18(size) − 0.35(walking time) + 0.12(floor)."],
      ["Test the overall model","H₀: All three slopes are zero. F = (96/3)/(44/46) ≈ 33.45 with df = (3,46). Since p < 0.001, reject H₀."],
      ["Test each coefficient","Size (p = 0.0004) and walking time (p = 0.008) meet the 0.05 level. For floor (p = 0.180), there is insufficient evidence of a nonzero slope."],
      ["Interpret the slope and convert the units","With size and floor fixed, an extra minute of walking lowers predicted rent by 0.35 thousand baht, or 350 baht."],
      ["Predict the rent","5.20 + 0.18(32) − 0.35(8) + 0.12(7) = 9.00 thousand baht, or 9,000 baht per month."]
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
  return `<div class="mock-pager" role="group" aria-label="Choose a question">${mockQuestions.map((_, i) =>
    `<button type="button" class="button quiet" data-mock-page="${i}" ${i === index ? 'aria-current="step"' : ''} aria-label="Question ${i+1}${review ? '' : mockComplete(i, mockState.questions[i].values) ? " complete" : " incomplete"}">${i+1}${!review && mockComplete(i, mockState.questions[i].values) ? ' ✓' : ''}</button>`
  ).join('')}</div>`;
}

function mockFields(question) {
  return question.fields.map((field, index) => field.options ?
    `<fieldset class="mock-field">
      <legend>${field.prompt}</legend>
      ${field.options.map((option, i) => `<label class="mock-option"><input type="radio" name="mock-field-${index}" data-mock-field="${index}" value="${i}"><span>${option}</span></label>`).join('')}
    </fieldset>` :
    `<label class="mock-field mock-number"><strong>${field.prompt}</strong><input type="text" inputmode="decimal" autocomplete="off" data-mock-field="${index}" placeholder="Enter a number" maxlength="28"></label>`).join('');
}

function updateMockProgress() {
  const done = mockQuestions.map((_, i) => mockComplete(i, mockState.questions[i].values));
  const count = done.filter(Boolean).length;
  get('mock-progress-text').textContent = `${count} of ${mockQuestions.length} questions complete`;
  get('mock-progress-bar').style.width = `${100 * count / mockQuestions.length}%`;
  get('mock-body').querySelectorAll('[data-mock-page]').forEach((button, i) => {
    button.textContent = (i+1) + (done[i] ? ' ✓' : '');
    button.setAttribute('aria-label', `Question ${i+1} ${done[i] ? "complete" : "incomplete"}`);
  });
}

function renderMockAttempt(box) {
  const index = mockState.index;
  const question = mockQuestions[index];
  const entry = mockState.questions[index];
  box.innerHTML = `<p class="kicker">Mock exam · Question ${index+1} / ${mockQuestions.length}</p>
    <h1 tabindex="-1">${question.title}</h1>
    <p>Work through the questions before checking the answers. Solutions unlock when you submit the full set.</p>${mockPager(index)}<p id="mock-progress-text" class="muted" role="status">
    </p>
    <div class="progress" aria-hidden="true"><span id="mock-progress-bar"></span>
    </div>
    <div class="problem">
    <p>${question.context}</p>${question.data ? table(...question.data) : ''}</div>
    <p class="muted">Use at least two decimal places when needed. Round at the end.</p>${mockFields(question)}<details class="mock-work"><summary>Show your working</summary>
    <label for="mock-work">You can note H₀ and Hₐ, your formula, and a conclusion.</label><textarea id="mock-work" rows="4" maxlength="2400" placeholder="Write your working here or use paper"></textarea>
    </details>
    <div class="actions">${index > 0 ? "<button class=\"button quiet\" type=\"button\" id=\"mock-prev\">Previous question</button>" : ''}${index < mockQuestions.length-1 ? "<button class=\"button quiet\" type=\"button\" id=\"mock-next\">Next question</button>" : ''}<button class="button primary" type="button" id="mock-submit">Submit all answers</button>
    </div>
    <p id="mock-submit-message" role="status">
    </p>`;

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
      get('mock-submit-message').textContent = `Finish question(s) ${missing.map(i => i+1).join(', ')} before submitting.`;
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
  box.innerHTML = `<p class="kicker">Mock exam submitted</p>
    <h1 tabindex="-1">Score: ${diagnosis.length - missed.length} / ${diagnosis.length}</h1>
    <p>Each part is one point. Compare your written working with the step-by-step solution.</p>
    <section class="mock-diagnosis" aria-labelledby="diagnosis-title">
    <h2 id="diagnosis-title">Where did you lose marks?</h2>
    <p class="muted">This summary groups the skills tested by each part. For a missed numerical answer, compare your working with the solution to see which step needs practice.</p>
    <div class="mock-skill-grid">${Object.entries(mockSkills).map(([key, skill]) => {
        const entries = diagnosis.filter(item => item.skill === key);
        const errors = entries.filter(item => !item.correct);
        return `<div class="mock-skill">
    <h3>${skill.label}</h3><strong>${entries.length - errors.length} / ${entries.length} correct</strong>
    <p class="muted">${skill.description}</p>${errors.length ? `<ul>${errors.map(error => `<li>Question ${error.index+1} · ${error.title}${mockState.drilled.includes(error.key) ? " <span class=\"tag done\">Practised</span>" : ''}</li>`).join('')}</ul>` : "<p>All the parts that test this skill were correct.</p>"}</div>`;
      }).join('')}</div>${remaining.length ? `<div class="actions"><button class="button primary" id="mock-start-drills" type="button">Targeted practice · ${remaining.length} remaining</button></div>` :
        `<p class="feedback">${missed.length ? "You have completed a new practice question for every skill you missed." : "You got every part right. There are no missed skills to practise from this attempt."}</p>`}</section>
    <h2>Step-by-step solutions</h2>
    <ol class="mock-results">${mockQuestions.map((question, i) => `<li><button type="button" class="button quiet" data-mock-review="${i}">
      <span>${i+1}. ${question.title}</span><strong>${mockScore(question, i)}/${question.fields.length}</strong></button></li>`).join('')}</ol>
    <div class="actions"><a class="button primary" href="#forecast">Try the 15-second mock</a><button class="button quiet" type="button" id="mock-reset">Retake this mock</button><a class="button quiet" href="#exam">Back to course practice</a>
    </div>`;
  box.querySelectorAll('[data-mock-review]').forEach(button => button.addEventListener('click', () => {
    mockReview = Number(button.dataset.mockReview);
    renderMock(true);
  }));
  get('mock-start-drills')?.addEventListener('click', () => {
    mockDrillKey = remaining[0].key;
    renderMock(true);
  });
  get('mock-reset').addEventListener('click', () => {
    if (!confirm("Reset your answers and score for this mock exam?")) return;
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
  box.innerHTML = `<p class="kicker">Targeted practice · ${mockSkills[entry.skill].label}</p>
    <h1 tabindex="-1">${drill.title}</h1>
    <p class="muted" id="mock-drill-progress">Completed ${passed} / ${missed.length} skills · From question ${entry.index+1}</p>
    <div class="problem">
    <p>${drill.prompt}</p>
    </div>
    <form id="mock-drill-form">${mockFields({fields:[{...drill, prompt:"Your answer"}]})}<button class="button primary" id="mock-drill-check" type="submit">Check answer</button>
    <p id="mock-drill-feedback" role="status">
    </p><button class="button primary" id="mock-drill-next" type="button" hidden></button>
    </form>
    <div class="actions"><button class="button quiet" id="mock-drill-back" type="button">Back to the summary</button><a class="button quiet" href="#lesson-${mockQuestions[entry.index].lesson}">Review the related lesson</a>
    </div>`;
  get('mock-drill-form').addEventListener('submit', event => {
    event.preventDefault();
    const answer = box.querySelector(drill.options ? 'input:checked' : 'input[data-mock-field]');
    const feedback = get('mock-drill-feedback');
    if (!answer || (!drill.options && !Number.isFinite(mockNumber(answer.value)))) {
      feedback.className = 'feedback retry';
      feedback.textContent = drill.options ? "Choose one answer first." : "Enter a number before checking.";
      return;
    }
    if (!mockCorrect(drill, answer.value)) {
      feedback.className = 'feedback retry';
      feedback.textContent = "Try again · " + drill.hint;
      return;
    }
    if (!mockState.drilled.includes(entry.key)) mockState.drilled.push(entry.key);
    saveMock();
    feedback.className = 'feedback';
    feedback.textContent = "Correct · " + drill.explanation;
    box.querySelectorAll('[data-mock-field]').forEach(input => {input.disabled = true;});
    const checkButton = get('mock-drill-check');
    checkButton.disabled = true;
    checkButton.hidden = true;
    const remaining = missed.find(item => !mockState.drilled.includes(item.key));
    const next = get('mock-drill-next');
    next.textContent = remaining ? "Next skill to practise" : "See the practice summary";
    next.hidden = false;
    get('mock-drill-progress').textContent = `Completed ${passed + 1} / ${missed.length} skills · From question ${entry.index+1}`;
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
  box.innerHTML = `<p class="kicker">Solution ${index+1} / ${mockQuestions.length}</p>
    <h1 tabindex="-1">${question.title}</h1>${mockPager(index, true)}<div class="problem">
    <p>${question.context}</p>${question.data ? table(...question.data) : ''}</div>
    <h2>Your answers</h2>
    <ol class="steps" id="mock-own-answers">
    </ol>${entry.work ? "<details class=\"mock-work\"><summary>Your written working</summary><p id=\"mock-own-work\"></p></details>" : ''}<h2>Work through the solution</h2>
    <ol class="steps" id="mock-solution" aria-label="Solution steps">
    </ol><button type="button" class="button primary" id="mock-reveal"></button>
    <div class="actions"><button class="button quiet" id="mock-back-score" type="button">Back to scores</button><a class="button quiet" href="#lesson-${question.lesson}">Review ${topics[question.lesson].title}</a>
    </div>`;
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

  bindExamStepReveal(get('mock-solution'), get('mock-reveal'), question.steps, () => {
    [...get('mock-own-answers').children].forEach((item, i) => {
      const correct = mockCorrect(question.fields[i], entry.values[i]);
      const badge = document.createElement('span');
      badge.className = 'tag mock-result-tag' + (correct ? ' done' : '');
      badge.textContent = correct ? "Correct" : "Review";
      item.append(' ', badge);
    });
  });
}

function bindExamStepReveal(list, button, steps, onComplete = () => {}) {
  let step = 0;
  button.textContent = `Reveal step 1 of ${steps.length}`;
  button.addEventListener('click', () => {
    const [heading, explanation] = steps[step++];
    const element = document.createElement('li');
    const title = document.createElement('strong');
    const text = document.createElement('p');
    title.textContent = heading;
    text.textContent = explanation;
    element.append(title, text);
    element.tabIndex = -1;
    list.append(element);
    element.focus();
    button.disabled = step === steps.length;
    button.textContent = button.disabled ? "All steps revealed" : `Reveal step ${step+1} of ${steps.length}`;
    if (button.disabled) onComplete();
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
