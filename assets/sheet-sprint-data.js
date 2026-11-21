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
    }
  ]
];
