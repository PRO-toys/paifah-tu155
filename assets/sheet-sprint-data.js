'use strict';

function sprintChoice(ask, correct, alternative, distractor, explanation) {
  return {ask, options:[correct, alternative, distractor], explanation};
}

function sprintNumber(ask, value, explanation, tolerance = 0.005, display = String(value)) {
  return {ask, value, explanation, tolerance, display};
}

const sheetSprintBank = [
  [
    {
      id:'print-shop', review:'design-company-ci',
      story:'A campus print shop samples 49 print jobs and gets a mean of 140 baht. The population SD is known to be 21 baht. The manager wants a two-sided 95% interval for the mean.',
      trap:sprintChoice('Which interpretation fits the resulting interval?', 'It estimates the average cost for the population of print jobs.', 'It contains 95% of individual print-job costs.', 'It gives the cheapest and most expensive job in the population.', 'The interval puts a margin of error around a sample mean. Its target is the population mean.'),
      formula:sprintChoice('Which expression gives the confidence interval?', '140 ± 1.960 × 21/√49', '140 ± 1.960 × 21/49', '140 ± 1.960 × 21', 'A known population SD gives a z interval. The SE is 21/√49.'),
      calculation:sprintNumber('Find the upper endpoint in baht. Use 140 + 1.960 × 21/√49.', 145.88, '21/√49 = 3. Then 140 + 1.960×3 = 145.88 baht.')
    },
    {
      id:'bread-weights', review:'manager-extra-time',
      story:'Nine randomly selected loaves have a mean weight of 480 g and a sample SD of 12 g. The population is approximately normal. The baker wants a 95% interval for the population mean.',
      trap:sprintChoice('Which detail determines the critical-value distribution?', 'The 12 g SD comes from the nine sampled loaves.', 'The measurement is in grams.', 'The requested interval has two endpoints.', 'With the population SD unknown, the sample SD estimates it. For a roughly normal population, use Student’s t with 8 degrees of freedom.'),
      formula:sprintChoice('Which calculation gives the confidence interval?', '480 ± t* × 12/√9, using df = 8', '480 ± 1.960 × 12/√9', '480 ± t* × 12/9, using df = 9', 'Use t with n−1 = 8 degrees of freedom and s/√n as the standard error.'),
      calculation:sprintNumber('Find the lower endpoint in grams. Use 480 − 2.306 × 12/√9.', 470.776, '12/√9 = 4. Then 480 − 2.306×4 = 470.776 g.')
    },
    {
      id:'library-app', review:'telemarketing-ci',
      story:'In a survey of 160 library users, 96 say they book seats in an app. These users collectively made 280 app bookings last month. The library wants an interval for the proportion of users who use the app.',
      trap:sprintChoice('Which denominator matches the requested proportion?', '160 users, because the survey measures people.', '280 bookings, because the question mentions the app.', '96 users, because they use the app.', 'The study estimates a share of users. Use 96 successes out of 160 surveyed people.'),
      formula:sprintChoice('Which expression is the estimated SE for a proportion interval?', '√[(96/160)(1−96/160)/160]', '√[(96/280)(1−96/280)/280]', '√[0.5(1−0.5)/160]', 'A one-proportion confidence interval uses the sample proportion and its complement in the SE.'),
      calculation:sprintNumber('Compute √[0.60×0.40/160]. Enter the standard error as a decimal to 3 places.', Math.sqrt(.24/160), '0.60×0.40/160 = 0.0015. The square root is about 0.039.', 0.0006, '0.039')
    },
    {
      id:'bottle-fill', review:'ci-3419',
      story:'A bottler samples 64 bottles with a mean volume of 508 mL. The known population SD is 16 mL. The auditor wants a two-sided 95% confidence interval for the mean.',
      trap:sprintChoice('Which value belongs in the margin of error as the SE?', '16/√64, because the interval estimates a mean.', '16, because it is the reported population SD.', '508, because it is the centre of the interval.', 'The population SD describes individual bottles. Divide it by the square root of the sample size to measure uncertainty in the mean.'),
      formula:sprintChoice('Which expression gives the interval?', '508 ± 1.960×16/√64', '508 ± 1.960×16/64', '508 ± 1.960×16', 'The known population SD calls for a z interval. Use the SE 16/√64 and the 95% critical value 1.960.'),
      calculation:sprintNumber('Calculate the lower endpoint 508 − 1.960×16/√64. Enter mL.', 504.08, '16/√64 = 2. Subtract the margin of 3.92 mL from 508 mL.')
    }
  ],
  [
    {
      id:'screen-repair', review:'single-z-check',
      story:'A shop used to finish phone-screen repairs in 50 minutes on average. A sample of 36 repairs now averages 46 minutes, with known population SD of 12. An advert says repairs got faster. The audit asks whether the population mean changed.',
      trap:sprintChoice('Which wording determines the direction of the test?', '“Changed” in the audit calls for a two-sided test.', '“Faster” in the advert makes the test left-tailed.', 'The sample mean is lower, so use the left tail.', 'The audit specifies the alternative. A change could be up or down.'),
      formula:sprintChoice('Which statistic and tail match the audit?', 'z = (46−50)/(12/√36), two-sided', 'z = (46−50)/(12/√36), left-tailed', 'z = (46−50)/12, two-sided', 'Use a two-sided z test with the known population SD and a standard error of 12/√36.'),
      calculation:sprintNumber('Enter the signed statistic z = (46−50)/(12/√36).', -2, 'The gap is −4 minutes and the standard error is 2 minutes, giving z = −2.')
    },
    {
      id:'shuttle-capacity', review:'single-prop-check',
      story:'A campus shuttle aims for 50% of students to use the booking system. Of 64 students surveyed, 42 used it. The team asks whether the population rate is above 50%.',
      trap:sprintChoice('Which percentage describes the null model for the test?', '50%, the benchmark set by the team.', '65.625%, the observed share in the survey.', '42%, the number who booked expressed as a percent.', 'At the boundary of the null, p₀ = 0.50. The observed share of 42/64 goes in the numerator.'),
      formula:sprintChoice('Which expression gives the one-proportion z statistic?', '(42/64−0.50)/√[0.50×0.50/64]', '(42/64−0.50)/√[(42/64)(1−42/64)/64]', '(0.50−42/64)/√[0.50×0.50/64]', 'Subtract p₀ from the observed proportion and build the SE using the null proportion and its complement.'),
      calculation:sprintNumber('Enter the signed z statistic using (42/64−0.50)/√[0.50×0.50/64].', 2.5, 'The numerator is 0.15625. The denominator is 0.0625, so z = 2.5.')
    },
    {
      id:'podcast-length', review:'single-t-check',
      story:'An editor wants to know whether episodes average under 30 minutes. Sixteen episodes average 27.5 minutes with sample SD 5 minutes. The production schedule calls them “30-minute episodes.”',
      trap:sprintChoice('Which value is the hypothesised population mean?', '30 minutes', '27.5 minutes', '5 minutes', 'The claim tests a population mean of 30 against a lower mean. The sample mean is 27.5.'),
      formula:sprintChoice('Which test statistic and direction fit?', 't = (27.5−30)/(5/√16), left-tailed', 't = (30−27.5)/(5/√16), left-tailed', 'z = (27.5−30)/(5/√16), two-sided', 'Use the sample SD and Student’s t. The observed value comes first and “under” sets the left tail.'),
      calculation:sprintNumber('Enter the signed t statistic using (27.5−30)/(5/√16).', -2, 'The gap is −2.5 minutes, and 5/√16 = 1.25. Their ratio is −2.')
    },
    {
      id:'locker-renewal', review:'single-prop-check',
      story:'Historically, 75% of locker bookings were renewed. Now 60 of 100 bookings renew. The office wants to test whether the renewal rate has fallen.',
      trap:sprintChoice('Which detail sets the direction of the test?', 'The office asks whether renewal has fallen, so use the left tail.', 'The old rate is above 50%, so use the right tail.', 'The sample size is 100, so always use both tails.', '“Fallen” sets a lower alternative. Test the probability of a result this low or lower under the null.'),
      formula:sprintChoice('Which test statistic matches the question?', 'z = (0.60−0.75)/√(0.75×0.25/100)', 'z = (0.60−0.75)/√(0.60×0.40/100)', 'z = (0.75−0.60)/√(0.75×0.25/100)', 'Use observed minus null, and build the standard error with the 0.75 null share.'),
      calculation:sprintNumber('Compute signed z = (0.60−0.75)/√(0.75×0.25/100). Round to 2 decimals.', -0.15/Math.sqrt(0.75*0.25/100), 'The SE is about 0.0433. Divide −0.15 by that SE to get −3.46.', 0.005, '−3.46')
    }
  ],
  [
    {
      id:'typing-drill', review:'final-1',
      story:'Thirty-six interns take a typing test before and after coaching. For after − before, the mean difference is 6 words per minute and its sample SD is 9. The two columns contain 72 readings.',
      trap:sprintChoice('What is the sample size for the paired comparison?', '36 differences, one for each intern.', '72 differences, one for each reading.', '2 differences, one for each test session.', 'Each person supplies one difference. The sample size counts the 36 pairs.'),
      formula:sprintChoice('Which statistic tests whether average typing speed improved?', 'Paired t = 6/(9/√36), right-tailed', 'Paired t = 6/(9/√72), right-tailed', 'Paired t = 6/(9/√36), left-tailed', 'A positive after-minus-before difference means improvement. Test the mean of the 36 differences using the right tail.'),
      calculation:sprintNumber('Enter the paired t statistic using 6/(9/√36).', 4, 'The SE of the changes is 9/6 = 1.5. Then t = 6/1.5 = 4.')
    },
    {
      id:'shift-packing', review:'commute-means',
      story:'Different staff work the morning and evening packing shifts. The two samples have the same size and are listed side by side in order of output. The worksheet asks for a difference in average output, allowing unequal variances.',
      trap:sprintChoice('Which detail determines whether the samples are paired?', 'The staff are different and have no meaningful row-by-row match.', 'Both samples have the same size.', 'The two columns use the same sort order.', 'Pairing requires repeated measurements on the same units or a meaningful match. These shifts contain separate staff.'),
      formula:sprintChoice('What method fits a test for a difference?', 'Two-sided Welch independent-samples t-test', 'Two-sided paired t-test', 'Right-tailed pooled independent-samples t-test', 'Choose an independent-samples test with separate variance terms. The direction comes from “difference.”'),
      calculation:sprintNumber('Morning mean is 50 and evening mean is 44. Both samples have n = 16. Their SDs are 8 and 4. Calculate Welch t = (50−44)/√(8²/16+4²/16), to 2 decimals.', 6/Math.sqrt(5), 'The SE is √(4+1) = √5. Divide 6 by √5 to get about 2.68.', 0.005, '2.68')
    },
    {
      id:'route-layouts', review:'final-3',
      story:'Four café layouts are tested using 32 tables total. An ANOVA worksheet reports between-group SS of 90 and within-group SS of 140. The researcher asks whether all four mean service times are equal.',
      trap:sprintChoice('What still needs to happen before dividing between-group by within-group variation?', 'Divide each sum of squares by its own degrees of freedom.', 'Take the square root of each sum of squares.', 'Divide both sums of squares by 32.', 'The F statistic uses mean squares. Between-group df is 3 and within-group df is 28.'),
      formula:sprintChoice('Which calculation gives the ANOVA F statistic?', '(90/3)/(140/28)', '90/140', '(140/28)/(90/3)', 'Place the between-group mean square in the numerator and the within-group mean square in the denominator.'),
      calculation:sprintNumber('Calculate F = (90/3)/(140/28).', 6, 'MS between is 30 and MS within is 5. Their ratio is 6.')
    },
    {
      id:'seed-trays', review:'valve-anova',
      story:'A garden compares mean plant height under three fertilisers using 27 pots. Its ANOVA output gives SS between = 56 and SS within = 96.',
      trap:sprintChoice('Which number determines the between-group degrees of freedom?', 'Three fertiliser groups, giving df = 2.', 'Twenty-seven pots, giving df = 26.', 'Ninety-six units of within-group SS, giving df = 95.', 'The between-group degrees of freedom come from the number of group means, so use 3−1.'),
      formula:sprintChoice('Which expression gives the F statistic?', '(56/2)/(96/24)', '(56/24)/(96/2)', '56/96', 'Convert each SS to its own mean square, then divide between by within.'),
      calculation:sprintNumber('Calculate F = (56/2)/(96/24).', 7, 'MS between = 28 and MS within = 4. Divide 28 by 4.')
    }
  ],
  [
    {
      id:'umbrella-survey', review:'final-2',
      story:'Of 100 walkers, 54 carry an umbrella. Of 100 cyclists, 36 carry one. A headline claims walkers carry umbrellas more often. The assignment asks whether the population proportions differ.',
      trap:sprintChoice('How many tails match the assignment?', 'Two, because the assignment asks whether the proportions differ.', 'One, because the headline states a direction.', 'One, because walkers had the higher sample proportion.', 'The assignment asks about a difference in either direction. Set a two-sided alternative before looking at the sample result.'),
      formula:sprintChoice('What SE belongs in the two-proportion z-test?', '√[0.45×0.55×(1/100+1/100)] using the pooled share', '√[0.54×0.46/100+0.36×0.64/100] using separate shares', '√[0.45×0.55/200] using the total alone', 'Under the equal-proportion null, both groups share the pooled estimate of 90/200. Both sample sizes enter the difference SE.'),
      calculation:sprintNumber('Find the pooled share (54+36)/(100+100). Enter it as a decimal.', 0.45, 'Pool all 90 successes across all 200 participants. The resulting share is 0.45.', 0.0006)
    },
    {
      id:'seminar-dates', review:'final-4',
      story:'A survey crosses student year and seminar availability. For second-year students, the row total is 40. The weekend column total is 30, with 15 second-year weekend responses. The grand total is 120.',
      trap:sprintChoice('Which value is the observed count for this cell?', '15 second-year students who selected weekends.', '40 second-year students who answered the survey.', '30 weekend responses from all years.', 'The observed count lies where second-year and weekends intersect. The row and column totals describe margins.'),
      formula:sprintChoice('How do you find this cell’s expected count under independence?', '40×30/120', '15×30/120', '40×15/120', 'Apply the overall weekend share to the second-year row total.'),
      calculation:sprintNumber('Calculate expected count = 40×30/120.', 10, 'The weekend share is 30/120 = 0.25. The second-year expected count is 40×0.25 = 10.')
    },
    {
      id:'snack-choices', review:'service-gof',
      story:'A café expects 25% of customers to choose a fruit snack. In 200 orders, 62 were fruit snacks. The manager wants the fruit category’s contribution to a goodness-of-fit statistic.',
      trap:sprintChoice('Which share should set the expected count?', '25%, the target distribution share.', '31%, the observed 62 out of 200.', '50%, because the manager mentioned one category.', 'Goodness-of-fit compares observations with a stated target. The target share gives an expected count of 50.'),
      formula:sprintChoice('Which expression gives the fruit contribution?', '(62−50)²/50', '(62−50)²/62', '(62−50)/50', 'Square the gap between observed and expected, then divide by the expected count.'),
      calculation:sprintNumber('Calculate (62−50)²/50.', 2.88, '(62−50)² = 144. Dividing by 50 gives 2.88.')
    },
    {
      id:'study-space', review:'political-opinion',
      story:'A campus survey crosses residence and preferred study space. The commuter row has 60 responses. The library column has 75 responses. A total of 35 commuters chose the library, and the survey includes 150 students.',
      trap:sprintChoice('Which number is the expected library count for commuters under independence?', '30, because half of all respondents chose the library.', '35, because that many commuters chose the library.', '37.5, because there are two groups of students.', 'The expected commuter count uses the overall library share of 75/150 applied to 60 commuters.'),
      formula:sprintChoice('Which term is the commuter library cell’s chi-square contribution?', '(35−30)²/30', '(35−30)²/35', '(35−30)/30', 'The contribution is the squared difference between observed and expected divided by expected.'),
      calculation:sprintNumber('Compute (35−30)²/30. Round to 2 decimals.', 25/30, 'The squared gap is 25. Divide by 30 to get 0.83.', 0.005, '0.83')
    }
  ],
  [
    {
      id:'campus-photos', review:'passenger-line',
      story:'A model predicts photo-printing cost y in tens of baht from the number of pages x. The sample means are x̄ = 12 and ȳ = 8, and the fitted slope is 0.5.',
      trap:sprintChoice('What does the slope 0.5 mean in baht?', 'Each extra page raises the fitted cost by 5 baht.', 'Each extra page raises the fitted cost by 0.5 baht.', 'The cost with zero pages is 5 baht.', 'The model measures y in tens of baht. A slope of 0.5 tens of baht means 5 baht per page.'),
      formula:sprintChoice('Which expression finds the intercept in model units?', 'ȳ − b₁x̄', 'ȳ + b₁x̄', 'x̄ − b₁ȳ', 'The fitted line passes through the sample means. Rearrange ȳ = b₀ + b₁x̄ to solve for b₀.'),
      calculation:sprintNumber('Find the intercept in baht using 10×(8−0.5×12).', 20, '8−0.5×12 = 2 tens of baht. Multiply by ten to get 20 baht.')
    },
    {
      id:'focus-music', review:'interest-pearson',
      story:'A survey pairs loudness ratings and focus scores. Its centred sums are Sxx = 16, Syy = 36, and Sxy = −18.',
      trap:sprintChoice('What does the negative cross-product tell you?', 'The fitted linear association has a negative direction.', 'The association is necessarily weak.', 'Loudness has been proven to cause lower focus.', 'The cross-product gives the sign of r. Its standardised magnitude describes strength, and causation requires additional evidence.'),
      formula:sprintChoice('Which expression gives Pearson r?', '−18/√(16×36)', '−18/16', '−18/(16+36)', 'Correlation standardises the centred cross-product by the square root of both centred sums of squares.'),
      calculation:sprintNumber('Calculate Pearson r = −18/√(16×36).', -0.75, '√(16×36) = 24. Dividing −18 by 24 gives −0.75.')
    },
    {
      id:'coffee-queues', review:'whose-residual',
      story:'A model predicts that a café customer with a two-item order will wait 7 minutes. Their actual wait is 10 minutes. Their receipt says the queue closed at 11 a.m.',
      trap:sprintChoice('Where is this observation relative to the fitted line?', 'Above the line because the actual wait is longer than predicted.', 'Below the line because the order had only two items.', 'On the line because both times concern the same customer.', 'Compare actual wait with predicted wait for this customer’s predictor values. A larger actual wait lies above the fitted line.'),
      formula:sprintChoice('Which expression gives the signed residual?', '10 − 7', '7 − 10', '(10 − 7)²', 'A signed residual keeps the direction of the difference. Subtract predicted from observed.'),
      calculation:sprintNumber('Calculate the signed residual in minutes as actual minus fitted.', 3, '10−7 = +3 minutes. The customer waited 3 minutes longer than predicted.')
    },
    {
      id:'parcel-fuel', review:'passenger-line',
      story:'A fitted line predicts van fuel use as ŷ = 12 + 0.4x litres, where x is the number of stops. On a 20-stop route, the van actually used 18 litres.',
      trap:sprintChoice('Which statement describes the 0.4?', 'It is the increase in fitted litres per extra stop.', 'It is the prediction for a route with zero stops.', 'It is the signed residual for the 20-stop route.', 'The coefficient of x gives the change in predicted fuel for a one-stop increase.'),
      formula:sprintChoice('Which expression gives the signed residual on the route?', '18 − (12 + 0.4×20)', '(12 + 0.4×20) − 18', '18 − 0.4×20', 'Subtract the full fitted value from the actual use.'),
      calculation:sprintNumber('Calculate the signed residual 18 − (12 + 0.4×20), in litres.', -2, 'The fitted value is 20 litres. Actual minus fitted is −2 litres.')
    }
  ],
  [
    {
      id:'canteen-staff', review:'dummy-night',
      story:'A fitted model for lunch orders is ŷ = 24 + 7x + 12D, where x counts staff-hours and D = 1 on event days and 0 on regular days. The canteen schedules five staff-hours on a regular day.',
      trap:sprintChoice('What value of D belongs in this prediction?', '0, the code for a regular day.', '1, because one day is being predicted.', '5, the number of staff-hours.', 'The staff-hours fill the x slot. D records the day type, and regular days have code zero.'),
      formula:sprintChoice('Which expression predicts orders on this day?', '24 + 7×5 + 12×0', '24 + 7×5 + 12×1', '24 + 7×0 + 12×5', 'Keep the intercept. Enter five for x and zero for the regular-day indicator.'),
      calculation:sprintNumber('Calculate the predicted orders using 24 + 7×5 + 12×0.', 59, 'The staff term is 35 and the indicator contributes zero. The prediction is 24+35 = 59.')
    },
    {
      id:'water-bills', review:'drink-overall-f',
      story:'A regression of water bills on three predictors gives MS Regression = 630 and MS Residual = 90. One predictor has a p-value of 0.18. The analyst wants to test the slopes jointly.',
      trap:sprintChoice('Which part of the output addresses the joint question?', 'The overall ANOVA F-test.', 'The p-value of the one predictor.', 'The intercept’s coefficient.', 'The overall F-test checks whether all three slope coefficients are zero together.'),
      formula:sprintChoice('Which calculation gives the joint test statistic?', '630/90', '90/630', '630/0.18', 'Take the ratio of regression mean square to residual mean square.'),
      calculation:sprintNumber('Calculate the overall F statistic as MS Regression / MS Residual.', 7, '630 divided by 90 gives F = 7.')
    },
    {
      id:'tutor-rates', review:'drink-coefficients',
      story:'A multiple regression on tutoring rates has a coefficient of 24 for weekly experience, with a standard error of 8. The overall model p-value is 0.01. The analyst wants to test just this coefficient against zero.',
      trap:sprintChoice('Which information is specific to the question?', 'The experience coefficient and its own standard error.', 'The overall model p-value alone.', 'The number of predictors alone.', 'The coefficient row answers a question about an individual slope. Its t statistic uses its own estimate and SE.'),
      formula:sprintChoice('Which statistic tests this individual coefficient?', 't = (24−0)/8', 't = (24−0)/0.01', 'F = 8/24', 'Compare the estimated slope with zero by dividing by its standard error.'),
      calculation:sprintNumber('Calculate the signed t statistic using (24−0)/8.', 3, 'The slope is three standard errors above zero, so t = +3.')
    },
    {
      id:'delivery-slope', review:'drink-coefficients',
      story:'A model for delivery times includes distance, traffic, and a weekend indicator. The traffic slope is 4.5 and its standard error is 1.5. The overall model F is 27.',
      trap:sprintChoice('Which part of the output tests the traffic predictor by itself?', 'The coefficient row for traffic.', 'The overall model F statistic.', 'The intercept row.', 'An individual predictor has its own coefficient and standard error. The overall F statistic covers the slopes jointly.'),
      formula:sprintChoice('Which expression tests whether the traffic slope is zero?', 't = (4.5−0)/1.5', 't = (4.5−0)/27', 't = 1.5/4.5', 'Divide the estimated slope minus its null value by its own standard error.'),
      calculation:sprintNumber('Calculate t = (4.5−0)/1.5.', 3, 'The slope is three standard errors above zero, so t = 3.')
    }
  ]
];

// Extra versions leave fresh questions for a focused round after any three scenarios from a topic.
sheetSprintBank[0].push(...[
  ['towel-sizes', 'A hotel checks towel lengths', 70, 8, 'cm'],
  ['tea-fill', 'A café checks tea portions', 300, 20, 'mL']
].map(([id, setting, mean, sd, unit]) => ({
  id, review:'ci-3419',
  story:`${setting} using 16 independent observations. The sample mean is ${mean} ${unit}, and the known population SD is ${sd} ${unit}. The goal is a 95% interval for the population mean.`,
  trap:sprintChoice('Which number belongs at the centre of the interval?', `${mean}, the sample mean.`, `${sd}, the population SD.`, '16, the sample size.', 'The sample mean is the point estimate at the centre. Use SD and sample size to calculate the margin.'),
  formula:sprintChoice('Which formula gives the two-sided interval?', 'x̄ ± 1.960 × σ/√n', 'x̄ ± 1.960 × σ/n', 'x̄ ± σ/√n', 'With known σ, multiply its standard error by the 95% z critical value of 1.960.'),
  calculation:sprintNumber(`Find the upper endpoint in ${unit} using ${mean} + 1.960 × ${sd}/√16.`, mean+1.96*sd/4,
    `The SE is ${sd}/4 = ${sd/4}. Add the margin of ${1.96*sd/4} to ${mean}.`)
})));

sheetSprintBank[1].push(...[
  ['bus-departures', 'a shuttle’s departure delay in minutes', 12, 10, 8],
  ['device-batteries', 'a device’s battery life in hours', 18, 15, 6]
].map(([id, outcome, benchmark, mean, sd]) => ({
  id, review:'single-t-check',
  story:`The question asks whether the mean of ${outcome} is lower than ${benchmark}. In a sample of 16, the mean is ${mean} with sample SD ${sd}.`,
  trap:sprintChoice('Which alternative answers the question?', `μ < ${benchmark}`, `μ > ${benchmark}`, `μ ≠ ${benchmark}`, 'The requested direction is lower. Write the benchmark into a left-tailed alternative.'),
  formula:sprintChoice('Which test statistic fits?', 't = (x̄−μ₀)/(s/√n), with df = 15', 't = (μ₀−x̄)/(s/√n), with df = 16', 'z = (x̄−μ₀)/s', 'Use the sample SD to estimate the standard error, and subtract the null mean from the observed mean.'),
  calculation:sprintNumber(`Compute signed t = (${mean}−${benchmark})/(${sd}/√16).`, (mean-benchmark)/(sd/4),
    `The signed gap is ${mean-benchmark}. The SE is ${sd/4}. Divide the gap by the SE.`)
})));

sheetSprintBank[2].push(...[
  ['delivery-training', 'couriers completing a route', -4, 8],
  ['word-puzzles', 'students solving a word puzzle', -6, 6]
].map(([id, participants, change, sd]) => ({
  id, review:'company-video',
  story:`Sixteen ${participants} record their completion time before and after coaching. For after minus before, the mean change is ${change} minutes and its sample SD is ${sd} minutes. The question asks whether completion time fell.`,
  trap:sprintChoice('What sign means improvement under this coding?', 'Negative, because an improved time is shorter.', 'Positive, because an improvement always raises the measurement.', 'Zero, because both measurements come from the same person.', 'A shorter after time makes after minus before negative. Use a left-tailed test for a fall in completion time.'),
  formula:sprintChoice('Which statistic matches the design?', 'Paired t = d̄/(sᵈ/√16)', 'Independent t based on 32 separate recorded times', 'Paired t = d̄/(sᵈ/√32)', 'Find the standard error from 16 within-person changes.'),
  calculation:sprintNumber(`Compute signed paired t = ${change}/(${sd}/√16).`, change/(sd/4),
    `The SE is ${sd}/4 = ${sd/4}. The ratio is ${change/(sd/4)}.`)
})));

sheetSprintBank[3].push(...[
  ['music-app', 'students and staff', 'a music app', 21, 14],
  ['cashless-stalls', 'two market zones', 'cashless payment', 24, 16]
].map(([id, groups, outcome, first, second]) => ({
  id, review:'final-2',
  story:`Two samples from ${groups} report their use of ${outcome}. The first sample has ${first} successes out of 40. The second has ${second} successes out of 60. A headline says the first group uses it more often. The test asks whether the population proportions differ.`,
  trap:sprintChoice('Which phrase guides the tail choice?', '“The proportions differ,” so use two tails.', '“More often” in the headline, so use the right tail.', 'The first sample has more successes, so use the left tail.', 'The actual test asks about a difference in either direction.'),
  formula:sprintChoice('How do you pool under the equal-proportion null?', `(${first}+${second})/(40+60)`, `(${first}/40+${second}/60)/2`, `(${first}+${second})/60`, 'Combine success counts and sample sizes before dividing.'),
  calculation:sprintNumber(`Compute the pooled proportion (${first}+${second})/(40+60). Enter a decimal.`, (first+second)/100,
    `There are ${first+second} successes in 100 observations, giving a pooled share of ${(first+second)/100}.`, 0.0006)
})));

sheetSprintBank[4].push(...[
  ['refill-station', 'water-refill time', 'number of bottles', 3, 2, 4, 10],
  ['repair-booking', 'repair time', 'number of parts', 6, 3, 5, 25]
].map(([id, outcome, predictor, intercept, slope, input, actual]) => ({
  id, review:'whose-residual',
  story:`A line predicts ${outcome} in minutes as ŷ = ${intercept} + ${slope}x, where x is the ${predictor}. For x = ${input}, the observed time was ${actual} minutes.`,
  trap:sprintChoice('What does the intercept represent?', 'The fitted time at x = 0.', 'The extra minutes for each increase of one in x.', 'The difference between the observed and fitted time.', 'The intercept is the fitted value when the predictor is zero.'),
  formula:sprintChoice('How do you find the signed residual?', `${actual}−(${intercept}+${slope}×${input})`, `(${intercept}+${slope}×${input})−${actual}`, `${actual}−${slope}×${input}`, 'Subtract the full fitted value from the observed value.'),
  calculation:sprintNumber(`Calculate signed residual = ${actual}−(${intercept}+${slope}×${input}).`, actual-(intercept+slope*input),
    `The fitted time is ${intercept+slope*input} minutes. Observed minus fitted is ${actual-(intercept+slope*input)} minutes.`)
})));

sheetSprintBank[5].push(...[
  ['museum-entry', 'museum admissions', 48, 12, 0.24],
  ['market-stock', 'market stock costs', 160, 20, 0.31]
].map(([id, outcome, modelMS, errorMS, coefficientP]) => ({
  id, review:'drink-overall-f',
  story:`A model for ${outcome} uses three predictors. Its output gives MS Regression = ${modelMS}, MS Residual = ${errorMS}, and a p-value of ${coefficientP} for one coefficient. The question asks about all three slopes jointly.`,
  trap:sprintChoice('Which result matches the target of the question?', 'The overall model F statistic.', 'The p-value for the one coefficient.', 'The intercept as a fitted value.', 'A joint test asks whether all slopes are zero together. The overall F test addresses that claim.'),
  formula:sprintChoice('Which quotient gives the overall F statistic?', `${modelMS}/${errorMS}`, `${errorMS}/${modelMS}`, `${modelMS}/${coefficientP}`, 'Divide the regression mean square by the residual mean square.'),
  calculation:sprintNumber(`Compute overall F = ${modelMS}/${errorMS}.`, modelMS/errorMS,
    `The two lines are already mean squares. Their ratio is ${modelMS/errorMS}.`)
})));
