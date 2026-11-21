function sheetChoiceFollowUp(prompt, options, hint, steps) {
  return {prompt, options, hint, steps};
}

function sheetNumberFollowUp(prompt, target, value, hint, steps, tolerance = 0.005) {
  return {prompt, target, value, hint, steps, tolerance};
}

const sheetFollowUps = {
  l8: {
    trap: sheetChoiceFollowUp(
      'A fruit market estimates the mean weight of its oranges. A sample of 64 has a 95% confidence interval of 156 to 164 grams. A headline reads “95% of oranges weigh 156 to 164 grams.” Which wording fixes it?',
      ['We are 95% confident that the population mean weight is between 156 and 164 grams.', '95% of the 64 oranges must weigh between 156 and 164 grams.', 'The market’s heaviest orange weighs 164 grams.'],
      'Check whether the target is an individual orange or an average.',
      [['Name the target','The target is the mean weight of all oranges in the population being sampled.'], ['Interpret the range','We are 95% confident that the population mean weight is between 156 and 164 grams.']]),
    formula: sheetChoiceFollowUp(
      'Twelve randomly sampled makers report their weekly sales. The data are approximately normal and only the sample SD is available. Which formula gives a two-sided 95% interval for the population mean?',
      ['x̄ ± t* × s/√12 with df = 11', 'x̄ ± 1.96 × s/√12', 'x̄ ± t* × s/12 with df = 12'],
      'Identify the source of the SD and count the degrees of freedom after estimating the mean.',
      [['Match the distribution','The sample SD estimates an unknown population SD, so use Student’s t with 12−1 = 11 degrees of freedom.'], ['Write the interval','Use x̄ ± t* × s/√12.']]),
    calculation: sheetNumberFollowUp(
      'A sample of 49 lunch boxes has a mean weight of 355 g. The population SD is 14 g. Use upper endpoint = x̄ + 1.96 × σ/√n.',
      'Upper endpoint in grams, to 2 decimals', 358.92, 'Compute the standard error before multiplying by 1.96.',
      [['Compute SE','14/√49 = 2 g.'], ['Add the margin','355 + 1.96×2 = 358.92 g.']])
  },
  l9: {
    trap: sheetChoiceFollowUp(
      'An advert promises that a redesign makes an app faster. The audit asks whether the mean load time has changed from 4 seconds in either direction. Which alternative matches the audit?',
      ['Hₐ: μ ≠ 4', 'Hₐ: μ < 4', 'Hₐ: μ > 4'],
      'Underline the direction the audit actually asks you to test.',
      [['Read the instruction','“Changed in either direction” covers both slower and faster loading.'], ['Write Hₐ','Use μ ≠ 4 seconds and a two-sided test.']]),
    formula: sheetChoiceFollowUp(
      'A newspaper says at least 30% of readers use its app. A survey gives an observed share of 0.24 from n readers. Using p₀ = 0.30, which formula gives the one-proportion z statistic?',
      ['(0.24−0.30)/√[0.30×0.70/n]', '(0.24−0.30)/√[0.24×0.76/n]', '(0.30−0.24)/√[0.30×0.70/n]'],
      'Build the denominator as if the null were true.',
      [['Set up the difference','Observed proportion minus the null value gives 0.24−0.30.'], ['Use the null standard error','The denominator is √[0.30×0.70/n].']]),
    calculation: sheetNumberFollowUp(
      'A machine is tested against μ₀ = 80. Its sample mean is 77 and the known population SD is 10 with n = 100. Use z = (x̄−μ₀)/(σ/√n).',
      'Signed z statistic', -3, 'Keep the observed mean first and take the square root of n.',
      [['Calculate the denominator','10/√100 = 1.'], ['Compute z','(77−80)/1 = −3.']])
  },
  l10: {
    trap: sheetChoiceFollowUp(
      'Two sets of 18 students take the same test. The two classes receive different treatments. The teacher places the scores side by side in alphabetical order. Which detail determines the design?',
      ['The classes contain distinct students with no meaningful row-by-row match.', 'The equal sample sizes make the two classes a paired sample.', 'The same test makes each row a before-and-after pair.'],
      'Ask what connects the two scores in a row.',
      [['Look at the participants','Each score comes from a different person. Sorting puts scores next to one another.'], ['Classify the design','These are two independent groups.']]),
    formula: sheetChoiceFollowUp(
      'Three separate groups are taught with different revision plans. You want a single test of whether all three population mean marks are equal. Which statistic fits?',
      ['One-way ANOVA F = MS between / MS within', 'Paired t = mean difference / SE of differences', 'Two-proportion z = gap in rates / pooled SE'],
      'Count the groups and identify whether the outcome is numeric.',
      [['Identify the outcome','Marks are numeric and the three groups are separate.'], ['Pick the ratio','Use the one-way ANOVA F statistic, comparing between-group and within-group mean squares.']]),
    calculation: sheetNumberFollowUp(
      'Nine players try a drill before and after coaching. For after minus before, mean change is 5 points and the sample SD of the changes is 6 points. Use t = d̄/(sᵈ/√n).',
      'Signed paired t statistic', 2.5, 'Use nine paired differences in the denominator.',
      [['Find the paired SE','6/√9 = 2.'], ['Standardise the mean change','5/2 = 2.50.']])
  },
  l11: {
    trap: sheetChoiceFollowUp(
      'Sixty residents and 90 commuters answer yes or no to a bus proposal. Both groups have 36 yes votes. A slide calls their support “identical.” Which comparison checks that claim?',
      ['Compare 36/60 with 36/90.', 'Compare the two 36s directly.', 'Divide both counts by 150.'],
      'Give each group its own denominator.',
      [['Find the shares','Residents report 60% support and commuters report 40%.'], ['Read the result','The raw counts match. The observed support rates differ by 20 percentage points.']]),
    formula: sheetChoiceFollowUp(
      'In a table crossing years of study and favourite commute mode, a row totals 45, a column totals 28, and the grand total is 140. Which formula gives the expected count at that intersection under independence?',
      ['E = 45×28/140', 'E = 45×28/(45+28)', 'E = 140/28'],
      'Apply the overall column share to the size of the row.',
      [['Find the column share','28/140 is the overall proportion for that commute mode.'], ['Use the row size','The expected count is 45×28/140.']]),
    calculation: sheetNumberFollowUp(
      'A snack survey records 36 fruit choices. The reference rate predicts 30. Use contribution = (O−E)²/E.',
      'Fruit category’s chi-square contribution', 1.2, 'Square the gap of 6 before dividing by the expected count.',
      [['Calculate the squared gap','(36−30)² = 36.'], ['Divide by E','36/30 = 1.20.']])
  },
  l12: {
    trap: sheetChoiceFollowUp(
      'A small survey finds r = −0.78 between travel time and satisfaction. A classmate describes this as a weak link because the value is negative. Which reading fits the result?',
      ['The magnitude suggests a fairly strong linear association, and the sign shows a downward direction.', 'Negative r always means a weaker association than positive r.', 'A negative r makes satisfaction the cause of travel time.'],
      'Separate the direction from the strength.',
      [['Read the magnitude','|−0.78| = 0.78, fairly close to 1.'], ['Read the direction','The negative sign describes a downward linear association in the survey.']]),
    formula: sheetChoiceFollowUp(
      'A delivery model predicts 22 minutes for a trip. The trip actually takes 18 minutes. Which expression gives its signed residual?',
      ['18 − 22', '22 − 18', '(18 − 22)²'],
      'A point below the line should give a negative residual.',
      [['Identify the observed and fitted values','Observed time is 18 and fitted time is 22.'], ['Write actual minus fitted','The right expression is 18 − 22.']]),
    calculation: sheetNumberFollowUp(
      'A kiosk model predicts receipts in hundreds of baht as ŷ = 4 + 0.8x, where x is the number of orders. Find the fitted value at x = 10 and convert to baht.',
      'Fitted receipts in baht', 1200, 'Apply both terms before converting the result from hundreds.',
      [['Predict in model units','4 + 0.8×10 = 12 hundred baht.'], ['Convert to baht','12×100 = 1,200 baht.']])
  },
  l13: {
    trap: sheetChoiceFollowUp(
      'A rent model gives a coefficient of −500 baht for each additional minute to the train. An advert says moving five minutes closer guarantees a 2,500-baht rent increase. Which claim can you support with this observational model?',
      ['With the other predictors held fixed, the model predicts rent 2,500 baht higher for a place five minutes closer.', 'The coefficient proves a nearby station causes the full rent increase.', 'Five fewer minutes means the fitted rent falls by 2,500 baht.'],
      'Separate the fitted comparison from a causal guarantee.',
      [['Read the prediction','Five fewer minutes gives (−500)(−5) = +2,500 baht in the fitted model.'], ['Describe the comparison','Say “predicted” and hold the other predictors fixed.']]),
    formula: sheetChoiceFollowUp(
      'A model predicts monthly expenses from rent, commute hours, and a residence indicator. You want one test of whether all three slopes are zero. Which statistic fits?',
      ['Overall F = MS Regression / MS Residual', 't = one estimated coefficient / its SE', 'VIF = 1/(1−R² of an auxiliary regression)'],
      'Use the part of the output that tests the predictors jointly.',
      [['Translate the null','The null sets all three slopes to zero together.'], ['Choose the test','Use the overall regression F statistic and its Significance F.']]),
    calculation: sheetNumberFollowUp(
      'A model predicts weekly study hours as ŷ = 3 + 0.9x + 2D. Here x is library visits, and D = 1 for dorm residents and 0 for commuters. Predict the hours for a commuter with five visits.',
      'Predicted hours', 7.5, 'Put the commuter’s indicator in the D slot.',
      [['Code both inputs','Use x = 5 and D = 0.'], ['Apply the full equation','3 + 0.9×5 + 2×0 = 7.5 hours.']])
  },
  final: {
    trap: sheetChoiceFollowUp(
      'A briefing says regular cyclists are more likely to support a new route. The last line asks whether support proportions differ between cyclists and walkers. Which phrase decides the alternative?',
      ['“Differ between cyclists and walkers,” so either direction counts.', '“More likely,” because the briefing appears first.', 'The direction of the observed sample difference decides the alternative.'],
      'Read the line that gives the actual testing instruction.',
      [['Separate background from the instruction','The briefing describes a directional claim. The last line asks about a difference.'], ['Translate the instruction','Use p₁ ≠ p₂ and both tails.']]),
    formula: sheetChoiceFollowUp(
      'An association asks whether three groups prefer different payment methods. It gives a table of actual counts by group and payment method. How do you use the totals to test independence?',
      ['Find E for each cell as row total × column total / grand total, then sum (O−E)²/E.', 'Set E in each cell to the grand total divided equally among all cells.', 'Use ANOVA to compare the average of the three group totals.'],
      'There are two categories defining each cell. Account for both margins.',
      [['Identify the design','Group and payment method are both categorical. The data are a table of counts.'], ['Choose the statistic','Construct expected counts from the margins and sum the chi-square contributions over the data cells.']]),
    calculation: sheetNumberFollowUp(
      'Two samples give 66 successes out of 120 and 45 out of 100. For their two-proportion test, use pooled p̂ = total successes / total people.',
      'Pooled proportion as a decimal, to 3 decimals', 111/220, 'Add successes before dividing by the combined sample size.',
      [['Combine the counts','66+45 = 111 successes and 120+100 = 220 people.'], ['Divide','111/220 ≈ 0.505 to three decimals.']], 0.0006)
  },
  excel: {
    trap: sheetChoiceFollowUp(
      'An Excel regression report lists Significance F = 0.003. The study-hours row has P-value = 0.12. The assignment asks whether the study-hours coefficient is individually significant at 5%. Which reading answers it?',
      ['Use the row p-value of 0.12 and find insufficient evidence for this coefficient at 5%.', 'Use 0.003 and declare study hours significant.', 'Multiply 0.003 by 0.12 to combine the model and coefficient tests.'],
      'Find the output that refers to this specific predictor.',
      [['Locate the correct row','The study-hours coefficient has p = 0.12. Significance F summarizes the overall model test.'], ['Compare with alpha','0.12 is above 0.05, so the coefficient falls short of significance at 5%.']]),
    formula: sheetChoiceFollowUp(
      'Two Excel columns contain scores from different groups of students. The instructions say to compare mean scores in both directions and allow unequal population variances. Which T.TEST settings fit?',
      ['tails = 2, type = 3 (independent samples, unequal variance)', 'tails = 2, type = 1 (paired samples)', 'tails = 1, type = 2 (independent samples, equal variance)'],
      'Read the direction, pairing, and variance assumption separately.',
      [['Choose tails','Both directions means two tails.'], ['Choose the test type','Independent samples with unequal variance calls for Excel type 3.']]),
    calculation: sheetNumberFollowUp(
      'An Excel model predicts demand using ŷ = 34 + 0.5t + 0.25t². Fill the prediction cell for period 8.',
      'Predicted demand for period 8', 54, 'Compute the squared-column value before multiplying by its coefficient.',
      [['Create the squared input','8² = 64.'], ['Apply the fitted coefficients','34 + 0.5×8 + 0.25×64 = 54.']])
  }
};
