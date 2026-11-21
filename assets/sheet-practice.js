function mountSheetPractice(root, id) {
  const drill = sheetPracticeById[id];
  const section = root.querySelector('#sheet-practice');
  const stages = [
    {name:'trap', label:'Spot the trap', question:'Which reading of the question avoids the trap?', options:drill.traps},
    {name:'method', label:'Choose the formula', question:'Which calculation fits the question?', options:drill.methods}
  ];
  // Keep the order consistent on retry and vary the correct position between questions.
  const orderSeed = Object.keys(sheetPracticeById).indexOf(id);
  section.innerHTML = `
    <div class="sheet-practice-header">
      <h2 id="sheet-practice-title">Try a new question</h2>
      <p>${escapeSheetText(drill.prompt)}</p>
    </div>
    <form class="sheet-practice-form">
      ${stages.map((stage, position) => `
        <fieldset class="sheet-practice-field">
          <legend>${position + 1}. ${stage.label}</legend>
          <p>${stage.question}</p>
          ${stage.options.map((_, slot) => {
            const option = (slot + orderSeed + position) % stage.options.length;
            return `<label class="sheet-practice-option">
              <input type="radio" name="${stage.name}" value="${option}" required>
              <span>${escapeSheetText(stage.options[option])}</span>
            </label>`;
          }).join('')}
        </fieldset>
      `).join('')}
      <fieldset class="sheet-practice-field">
        <legend>3. Calculate it yourself</legend>
        <label for="sheet-practice-answer">${escapeSheetText(drill.target)}</label>
        <input type="text" id="sheet-practice-answer" name="number" inputmode="decimal" autocomplete="off" required>
      </fieldset>
      <button type="submit" class="button primary">Check my answers</button>
    </form>
    <section class="sheet-practice-review" hidden aria-labelledby="sheet-practice-review-title">
      <h3 id="sheet-practice-review-title" tabindex="-1">Your feedback</h3>
      <ul class="sheet-practice-results"></ul>
      <ol class="steps sheet-practice-steps"></ol>
      <div class="actions">
        <button type="button" class="button primary" id="sheet-practice-reveal"></button>
        <button type="button" class="button quiet" id="sheet-practice-retry">Try again</button>
      </div>
    </section>`;

  const form = section.querySelector('form');
  const answer = form.elements.number;
  const submit = form.querySelector('[type="submit"]');
  const review = section.querySelector('.sheet-practice-review');
  const steps = section.querySelector('.sheet-practice-steps');
  let reveal = section.querySelector('#sheet-practice-reveal');

  answer.addEventListener('input', () => answer.setCustomValidity(''));
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!review.hidden) return;
    const values = new FormData(form);
    const rawNumber = values.get('number').trim();
    const groupedNumber = /^[+−-]?[0-9๐-๙]{1,3}(?:,[0-9๐-๙]{3})+(?:\.[0-9๐-๙]+)?$/.test(rawNumber);
    const number = mockNumber(groupedNumber ? rawNumber.replaceAll(',', '') : rawNumber);
    if (!Number.isFinite(number)) {
      answer.setCustomValidity('Enter a number, such as 2.35 or −0.8.');
      answer.reportValidity();
      return;
    }

    const scores = [values.get('trap') === '0', values.get('method') === '0',
      Math.abs(number - drill.value) <= drill.tolerance + 1e-9];
    review.querySelector('.sheet-practice-results').innerHTML = [...stages.map(stage => stage.label), 'Calculation']
      .map((label, index) => `<li class="${scores[index] ? 'practice-correct' : 'practice-retry'}">
        <strong>${label} · ${scores[index] ? 'Correct' : 'Check this'}</strong>
        ${scores[index] ? '' : `<p>${escapeSheetText(drill.hints[index])}</p>`}</li>`).join('');
    form.querySelectorAll('fieldset').forEach(field => { field.disabled = true; });
    submit.hidden = true;
    bindExamStepReveal(steps, reveal, [
      ['Spot the trap', drill.traps[0]],
      ['Choose the formula', drill.methods[0]],
      ...drill.steps
    ]);
    review.hidden = false;
    review.querySelector('h3').focus();
  });

  section.querySelector('#sheet-practice-retry').addEventListener('click', () => {
    form.querySelectorAll('fieldset').forEach(field => { field.disabled = false; });
    form.reset();
    steps.replaceChildren();
    const nextReveal = reveal.cloneNode(false);
    nextReveal.disabled = false;
    reveal.replaceWith(nextReveal);
    reveal = nextReveal;
    review.hidden = true;
    submit.hidden = false;
    form.querySelector('input').focus();
  });
}
