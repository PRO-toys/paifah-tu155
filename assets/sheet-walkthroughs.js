'use strict';

const walkthroughGroups = [
  {id:'l8', label:'Lecture 8', title:'Confidence intervals', source:0},
  {id:'l9', label:'Lecture 9', title:'Confidence intervals and hypothesis tests', source:1},
  {id:'l10', label:'Lecture 10', title:'Comparing population means', source:2},
  {id:'l11', label:'Lecture 11', title:'Comparing proportions and chi-square', source:3},
  {id:'l12', label:'Lecture 12', title:'Correlation and simple regression', source:4},
  {id:'l13', label:'Lecture 13', title:'Multiple regression', source:5},
  {id:'final', label:'Final practice', title:'Six practice exam questions', source:6},
  {id:'excel', label:'Excel', title:'Companion workbooks', source:null}
];

const sheetWalkthroughs = [
  {
    id:'park-estimate', group:'l8', where:'Pages 4–5', title:'Estimating attendance at a public park',
    question:'How could you estimate how many people use a park? Decide first what a single observation and the target population would be.',
    method:'Define the population and sample', clue:'An estimate of daily attendance needs observations from multiple days.',
    trap:'The total from one busy afternoon can look like an estimate for a typical day. Counting visits can also answer a different question from counting unique visitors.',
    fix:'Define the unit and time window before collecting data. For mean daily visits, sample days and count visits on each sampled day.',
    steps:[
      ['Define the target','For example, estimate the mean daily number of visits to this park during one month.'],
      ['Choose observations','Sample days across the month. Count visits over the same operating hours each day.'],
      ['Report the estimate','The mean of the sampled daily counts is a point estimate. With an appropriate sampling design and enough data, attach an interval to show sampling uncertainty.']
    ], formula:'ci-mean'
  },
  {
    id:'tv-width', group:'l8', where:'Page 5', title:'Same TV mean, different interval widths',
    question:'Both samples average 35 hours of TV per week. The 95% intervals are 33.04–36.96 for Great Britain and 34.02–35.98 for the United States. Which estimate is more precise?',
    method:'Compare margins of error', clue:'Both estimates have the same centre and confidence level.',
    trap:'Matching means do not imply matching precision. You cannot deduce the exact reason for the different widths from the intervals alone.',
    fix:'Calculate each half-width. Greater sample spread or a smaller effective sample can make an interval wider.',
    steps:[
      ['Measure the distance to an endpoint','Great Britain: 36.96−35 = 1.96 hours. United States: 35.98−35 = 0.98 hours.'],
      ['Compare precision','The US interval is half as wide. Its estimate has the smaller margin of error at the stated confidence level.'],
      ['Keep the target straight','These intervals concern population means. They do not describe how much television most individuals watched or provide a formal test of the difference between countries.']
    ], formula:'ci-mean'
  },
  {
    id:'critical-z', group:'l8', where:'Pages 7–8, 10', title:'Finding the 90%, 95%, and 99% z cutoffs',
    question:'Fill in α and z* for three two-sided confidence levels.',
    method:'Find a critical value', clue:'A central interval leaves the same probability outside at each end.',
    trap:'Reading α directly from a one-tail column puts twice the required probability into the chosen tail.',
    fix:'Calculate α = 1 − confidence, then α/2. In a cumulative z table, look up 1 − α/2.',
    steps:[
      ['90% confidence','α = 0.10, α/2 = 0.05, and the cumulative area is 0.95. z* ≈ 1.645.'],
      ['95% confidence','α = 0.05, α/2 = 0.025, and the cumulative area is 0.975. z* ≈ 1.960.'],
      ['99% confidence','α = 0.01, α/2 = 0.005, and the cumulative area is 0.995. z* ≈ 2.576. If your table starts from zero, use areas 0.45, 0.475, and 0.495 instead.']
    ], formula:'ci-mean'
  },
  {
    id:'finite-correction', group:'l8', where:'Page 7', also:[{group:'l9',where:'Page 5'}], title:'When sampling a large share of a small population',
    question:'Illustration for the sheet’s finite population correction: sample 36 of 100 students without replacement. The population SD is 12 points. How does the correction change the standard error?',
    method:'Multiply the usual SE by the finite population correction',
    clue:'The population size is known, and the sample takes more than one-third of it without replacement.',
    trap:'Treating each draw like a new independent draw ignores how much of the population is already in the sample.',
    fix:'For the SD convention in this formula, multiply σ/√n by √[(N−n)/(N−1)].',
    steps:[
      ['Start with the usual SE','12/√36 = 2 points.'],
      ['Find the correction factor','√[(100−36)/(100−1)] = √(64/99) ≈ 0.804.'],
      ['Multiply the two pieces','The corrected SE is about 1.61 points. For the same critical value, a smaller SE makes the interval narrower.']
    ], formula:'ci-mean'
  },
  {
    id:'design-company-ci', group:'l8', where:'Pages 9–10', title:'Years in business for design companies',
    question:'Forty-four companies average 10.455 years in practice. The population SD is 7.7 years. Find a 90% confidence interval for the mean.',
    method:'z interval for one mean', clue:'The problem explicitly gives the population standard deviation.',
    trap:'Using 7.7 as the margin or using 1.96 automatically ignores both sample size and the stated 90% level.',
    fix:'Divide σ by √n and use the z cutoff for 90%.',
    steps:[
      ['Find the standard error','SE = 7.7/√44 ≈ 1.1608 years.'],
      ['Find the margin','At 90%, z* ≈ 1.645. The margin is about 1.909 years.'],
      ['Report the range','10.455 ± 1.909 is about 8.55 to 12.36 years. The sheet displays 8.545 and 12.365 using intermediate rounding.']
    ], formula:'ci-mean'
  },
  {
    id:'midterm-ci', group:'l8', where:'Page 10', title:'Midterm score intervals at three confidence levels',
    question:'The slide centres the intervals at a sample mean of 15.5. Complete the confidence cutoffs and decide which bounds can be computed.',
    method:'Symbolic z intervals', clue:'The slide gives a centre and confidence levels. The interval width also needs SE.',
    trap:'The previous example has σ = 7.7 and n = 44, but those numbers describe design companies, not midterm scores.',
    fix:'Use the midterm SE if it is supplied separately. Otherwise report the bounds in terms of SE.',
    steps:[
      ['Use the given centre','Each interval is centred at 15.5.'],
      ['Write all three intervals','90%: 15.5 ± 1.645 SE. 95%: 15.5 ± 1.960 SE. 99%: 15.5 ± 2.576 SE.'],
      ['State what is needed','Numeric endpoints require the midterm standard error or the information to calculate it. With the same SE, the 99% interval is widest.']
    ], formula:'ci-mean'
  },
  {
    id:'manager-extra-time', group:'l8', where:'Page 14', title:'Extra hours worked by managers',
    question:'The mean extra work time is 13.56 hours per week for 18 managers, with sample SD 7.8 hours. Find a 90% interval.',
    method:'t interval for one mean', clue:'The spread is a sample SD and the target is the population mean.',
    trap:'Using z* = 1.645 because the confidence level is 90% overlooks the estimated population SD. The t cutoff depends on df.',
    fix:'Use t* from df = 17. Keep hours per week as the unit.',
    steps:[
      ['Find df and SE','df = 18−1 = 17. SE = 7.8/√18 ≈ 1.8385 hours.'],
      ['Find the margin','The 90% t cutoff is approximately 1.740. Multiply by the SE for about 3.198 hours.'],
      ['State the interval','13.56 ± 3.198 gives about 10.36 to 16.76 extra hours per week.']
    ], formula:'ci-mean'
  },
  {
    id:'ci-3419', group:'l8', where:'Page 15 · z exercise 1', title:'95% interval from 34.19, 9.5, and 72',
    question:'Given x̄ = 34.19, σ = 9.5, and n = 72, find the 95% confidence interval.',
    method:'z interval for one mean', clue:'σ is known, and 34.19 is the centre.',
    trap:'Dividing by 72 instead of √72 gives far too small a margin.',
    fix:'Write SE = σ/√n as a separate calculator line.',
    steps:[
      ['Calculate SE','9.5/√72 ≈ 1.1196.'],
      ['Calculate the margin','1.960 × 1.1196 ≈ 2.1943.'],
      ['Add and subtract','34.19 ± 2.1943 gives approximately (32.00, 36.38).']
    ], formula:'ci-mean'
  },
  {
    id:'ci-1196', group:'l8', where:'Page 15 · z exercise 2', also:[{group:'l9',where:'Page 9 · z checkpoint 2'}], title:'98% interval from 119.6, 23.89, and 60',
    question:'Given x̄ = 119.6, σ = 23.89, and n = 60, find the 98% confidence interval.',
    method:'z interval for one mean', clue:'The 98% level puts 1% in each tail.',
    trap:'An automatic 1.96 gives a 95% interval. The 98% cutoff is about 2.326.',
    fix:'Compute the upper cumulative probability 0.99 before looking up z*.',
    steps:[
      ['Select z*','α = 0.02 and α/2 = 0.01. z* ≈ 2.3263.'],
      ['Build the margin','SE = 23.89/√60 ≈ 3.0842. Margin ≈ 7.1749.'],
      ['Write the interval','119.6 ± 7.1749 gives approximately (112.43, 126.77). This question is repeated on Lecture 9 page 9.']
    ], formula:'ci-mean'
  },
  {
    id:'ci-raw-13', group:'l8', where:'Page 15 · t exercise', also:[{group:'l9',where:'Page 9 · t checkpoint'}], title:'95% interval from 13 raw values',
    question:'The handout lists 13 observations from a normal population. Estimate its mean with a 95% interval.',
    method:'t interval from raw data', clue:'You must calculate the sample mean and sample SD before building the interval.',
    trap:'Using a population SD function divides by n. Here the values form a sample, so use the sample SD.',
    fix:'Use AVERAGE and STDEV.S in Excel, or the sample SD mode on your calculator.',
    steps:[
      ['Summarise the 13 values','n = 13, Σx = 593, x̄ ≈ 45.6154, and s ≈ 5.6941.'],
      ['Find SE and the t cutoff','SE = 5.6941/√13 ≈ 1.5793. With df = 12, t* ≈ 2.1788.'],
      ['Write the answer','The margin is about 3.4409. The 95% interval is approximately (42.17, 49.06). The Lecture 9 recap supplies rounded summaries for these same values.']
    ], formula:'ci-mean'
  },
  {
    id:'telemarketing-ci', group:'l8', where:'Pages 16–17', title:'Share of firms using telemarketing to process orders',
    question:'A sample of 87 firms gives p̂ = 0.39. Estimate the population share with a 95% confidence interval.',
    method:'z interval for one proportion', clue:'The outcome is yes or no and the target is a proportion.',
    trap:'Using 39 instead of 0.39 in the formula, or describing all firms as if the sampled frame covered every firm, changes the answer.',
    fix:'Use decimal proportions and name the population represented by the sampled firms.',
    steps:[
      ['Identify the ingredients','p̂ = 0.39, 1−p̂ = 0.61, n = 87, and z* = 1.96.'],
      ['Find the margin','SE = √[0.39×0.61/87] ≈ 0.05229. Margin ≈ 0.10249.'],
      ['Read it in context','The 95% interval is approximately 0.2875 to 0.4925, or 28.75% to 49.25% for the target group of firms. The reported sample percentage is rounded.']
    ], formula:'ci-prop'
  },
  {
    id:'ci-transit', group:'l8', where:'Page 16', also:[{group:'l9',where:'Page 8'}], title:'Estimating the share who use public transport',
    question:'The slide mentions estimating public transport use. Decide how to turn survey results into an interval when the question only gives the scenario.',
    method:'Plan a proportion interval', clue:'Use a count of people who answer yes and the total number surveyed.',
    trap:'Treating yes/no answers as travel times changes the parameter. The slide gives no counts for a numeric interval.',
    fix:'Define what counts as use and collect x successes from n people in a suitable sample.',
    steps:[
      ['Calculate the estimate','Use p̂ = x/n, with yes meaning the definition in the survey.'],
      ['Calculate the interval','With adequate observed yes and no counts, use p̂ ± z*√[p̂(1−p̂)/n].'],
      ['State the target','Report the plausible share of the defined population who use public transport. Numeric endpoints require actual counts and a confidence level.']
    ], formula:'ci-prop'
  },
  {
    id:'ci-25', group:'l9', where:'Page 9 · z checkpoint 1', title:'95% interval around 25',
    question:'Given x̄ = 25, σ = 3.5, and n = 60, find the 95% confidence interval.',
    method:'z interval for one mean', clue:'This checkpoint uses a different set of numbers from Lecture 8 exercise 1.',
    trap:'Using a t cutoff just because the number of observations is given overlooks that σ is supplied.',
    fix:'Use a z cutoff of 1.960 for the two-sided 95% interval.',
    steps:[
      ['Find SE','3.5/√60 ≈ 0.45185.'],
      ['Find the margin','1.960 × 0.45185 ≈ 0.8856.'],
      ['Write the interval','25 ± 0.8856 gives approximately (24.11, 25.89). The second z checkpoint and the raw-data t checkpoint repeat Lecture 8 problems.']
    ], formula:'ci-mean', related:['ci-1196','ci-raw-13']
  },
  {
    id:'single-z-check', group:'l9', where:'Page 17 · z checkpoint', title:'Has the mean changed from 50?',
    question:'Test H₀: μ = 50 versus Hₐ: μ ≠ 50. The sample gives x̄ = 52.1, σ = 6, n = 36, and α = 0.05.',
    method:'Two-sided one-sample z-test', clue:'Known σ points to z. The ≠ sign points to two tails.',
    trap:'Because the result is above 50, reporting only the right tail is tempting. The alternative already specified both directions.',
    fix:'Calculate z and add the two symmetric tails beyond ±|z|.',
    steps:[
      ['Find SE and z','SE = 6/√36 = 1. z = (52.1−50)/1 = 2.10.'],
      ['Apply the rule','Two-sided cutoffs are ±1.96. The p-value is about 0.0357.'],
      ['Conclude','Reject H₀ at 0.05. There is evidence that the population mean differs from 50. The sample estimate is higher.']
    ], formula:'one-mean'
  },
  {
    id:'single-t-check', group:'l9', where:'Page 17 · t checkpoint', title:'Is the population mean below 48?',
    question:'With x̄ = 45.62, s = 5.69, and n = 13, test H₀: μ = 48 against Hₐ: μ < 48 at α = 0.05.',
    method:'Left-tailed one-sample t-test', clue:'Use s for the SE and take the left tail.',
    trap:'Using z reads the probability from the wrong distribution. Comparing 45.62 directly with a t cutoff mixes the original scale and the standardised scale.',
    fix:'Convert the mean gap into a t statistic first and use df = 12.',
    steps:[
      ['Compute the statistic','SE = 5.69/√13 ≈ 1.578; t = (45.62−48)/SE ≈ −1.508.'],
      ['Use the left tail','The 5% left cutoff is approximately −1.782. The one-sided p-value is about 0.0787.'],
      ['Conclude','Fail to reject H₀. There is insufficient evidence that the mean is below 48 at the 5% level.']
    ], formula:'one-mean'
  },
  {
    id:'single-prop-check', group:'l9', where:'Page 17 · proportion checkpoint', title:'Is the share above 40%?',
    question:'Of 150 items, 72 have the trait. Test H₀: p = 0.40 versus Hₐ: p > 0.40 at α = 0.05.',
    method:'Right-tailed one-proportion z-test', clue:'The claim is about a proportion and supplies p₀ = 0.40.',
    trap:'The observed 0.48 goes in the numerator. Using it in the denominator imports the confidence interval formula into a hypothesis test.',
    fix:'Build the SE under H₀ using p₀ = 0.40.',
    steps:[
      ['Find the observed share','p̂ = 72/150 = 0.48.'],
      ['Compute z','SE under H₀ = √[0.40×0.60/150] = 0.04. z = (0.48−0.40)/0.04 = 2.00.'],
      ['Read the right tail','p ≈ 0.0228 < 0.05. Reject H₀. There is evidence that the population share exceeds 40%.']
    ], formula:'one-prop'
  },
  {
    id:'tail-reading', group:'l9', where:'Pages 11–14', title:'Choose the tail and read the p-value',
    question:'Translate “lower than”, “higher than”, and “different from” into alternatives and rejection regions.',
    method:'Match the tail to the alternative', clue:'The direction is in the question. The data help calculate the statistic after you choose it.',
    trap:'A negative test statistic does not automatically require a left-tailed test. A slide also describes α imprecisely.',
    fix:'Set Hₐ first. Interpret α as a Type I error rate under the null, and interpret p as probability under H₀ of a result at least as extreme in the specified direction.',
    steps:[
      ['Direction from Hₐ','Use < for left, > for right, and ≠ for two-sided. Define the subtraction order if comparing groups.'],
      ['Compare p with α','Reject H₀ when p ≤ α. Otherwise report that evidence is insufficient.'],
      ['Write a contextual sentence','Name the population quantity and the direction being tested. For example, “There is insufficient evidence that the mean is below 48.”']
    ], formula:'p-value'
  },
  {
    id:'tutor-30', group:'l10', where:'Page 5', title:'Does tutoring improve scores for the 30 students?',
    question:'The same 30 students average 19.18 before tutoring and 23.46 after. The separate SDs are 3.45 and 6.14.',
    method:'Paired t-test setup', clue:'The observations are paired by student. The mean difference is 23.46−19.18 = 4.28.',
    trap:'Combining the separate SDs as if the two groups were independent ignores how the scores move together within each person.',
    fix:'Calculate each after-minus-before difference, or use the correlation plus both SDs to recover the SD of the differences.',
    steps:[
      ['Define the difference','Use d = after − before. With “improve”, Hₐ says μᵈ > 0.'],
      ['Build the statistic','With n = 30 and df = 29, the numerator is 4.28 and the denominator is sᵈ/√30.'],
      ['Identify what the slide supplies','It does not provide the paired raw scores, the SD of the differences, or the within-person correlation. The exact paired t and p cannot be recovered from the two marginal SDs alone.']
    ], formula:'paired-t'
  },
  {
    id:'company-video', group:'l10', where:'Pages 7–10', title:'Does the video raise company ratings?',
    question:'The same seven customers rate the company before and after a video. Test for an increase at α = 0.05.',
    method:'Paired t-test', clue:'One customer contributes two scores. The sheet uses before − after.',
    trap:'An increase in the original ratings appears as a negative difference when you subtract after from before.',
    fix:'Keep the order the same for every person and choose the matching tail.',
    steps:[
      ['Write the paired differences','Before − after gives −7, −4, −14, +4, −11, −1, −8. The mean is −5.857 and sᵈ ≈ 6.0945.'],
      ['Compute t','SE = 6.0945/√7 ≈ 2.303. t ≈ −2.543 with df = 6.'],
      ['Apply the left-tail rule','An increase means Hₐ: μᵈ < 0 in this order. −2.543 is below the cutoff −1.943, with p ≈ 0.0220. There is evidence that ratings rose.']
    ], formula:'paired-t'
  },
  {
    id:'pe-years', group:'l10', where:'Pages 11–13 · Excel: Paired t-test', title:'Do company P/E ratios differ between years?',
    question:'Nine companies have a P/E ratio in both years. Compare the population means at the 1% level.',
    method:'Two-sided paired t-test', clue:'The company is the pair. The question asks about a difference between years.',
    trap:'An Excel output headed Year 2 minus Year 1 flips the sign compared with a hand column defined as Year 1 minus Year 2.',
    fix:'Label d clearly before interpreting its sign. A two-sided p-value stays the same after reversing all differences.',
    steps:[
      ['Create nine paired differences','Using Year 1 − Year 2, d̄ ≈ −5.033 and sᵈ ≈ 21.599.'],
      ['Compute the statistic','SE ≈ 21.599/√9 = 7.200, giving t ≈ −0.699 with df = 8. Reversing the order gives +0.699.'],
      ['Use the two-sided decision','p ≈ 0.5043 > 0.01. There is insufficient evidence of a change in mean P/E.']
    ], formula:'paired-t'
  },
  {
    id:'training-methods', group:'l10', where:'Pages 14–15', title:'Are the two training methods equally effective?',
    question:'Group A has n = 15, mean 47.73, and variance 19.495. Group B has n = 12, mean 56.50, and variance 18.273. Compare the means at α = 0.05 using the handout’s equal-variance method.',
    method:'Pooled independent-samples t-test', clue:'Two separate groups and the handout specifies equal population variances.',
    trap:'The printed 19.495 and 18.273 are variances. Squaring them again makes the standard error too large.',
    fix:'Pool the two variances with n−1 weights, then take the square root once when finding SE.',
    steps:[
      ['Pool the variances','sₚ² = [14×19.495 + 11×18.273]/25 ≈ 18.957. df = 25.'],
      ['Compute the difference in SE units','SE = √[18.957(1/15 + 1/12)] ≈ 1.686. t = (47.73−56.50)/1.686 ≈ −5.20.'],
      ['Make the two-sided decision','|t| > 2.060 and p ≈ 0.0000222, so there is evidence that the mean understanding scores differ. Group B had the higher sample mean.']
    ], formula:'independent-t'
  },
  {
    id:'midterm-gender', group:'l10', where:'Pages 2, 4, 16–17', title:'Do midterm means differ by gender?',
    question:'Male students average 15.21 (n = 17, variance 27.78). Female students average 17.58 (n = 39, variance 17.66). Use the pooled method illustrated in the sheet at α = 0.05.',
    method:'Two-sided independent-samples t-test', clue:'The prompt asks whether scores differ. Page 17 compares that prompt with a prespecified directional alternative.',
    trap:'The same t gives two-sided p ≈ 0.078 and a one-sided p ≈ 0.039 in the observed direction. Choosing the smaller p after seeing the data changes the question.',
    fix:'Write Hₐ first. Use both tails for “differ”, and keep the separate directional result labelled.',
    steps:[
      ['Set the question','H₀: μmale = μfemale. Hₐ: μmale ≠ μfemale. The groups are independent.'],
      ['Compute t','Pooled SE ≈ 1.321, so t = (15.21−17.58)/1.321 ≈ −1.79, with df = 54.'],
      ['Read the decision','Two-sided p ≈ 0.078 > 0.05. The data give insufficient evidence of a difference. Only a prespecified alternative μmale < μfemale uses the illustrated left-tail p ≈ 0.039.']
    ], formula:'independent-t'
  },
  {
    id:'valve-anova', group:'l10', where:'Pages 21–25 · Excel: ANOVA', title:'Do the four operators open valves the same amount?',
    question:'Test whether the four mean valve openings match at α = 0.05. The sample sizes are 5, 8, 7, and 4.',
    method:'One-way ANOVA', clue:'Four separate groups and one quantitative outcome.',
    trap:'The worksheet has blank cells because group sizes are unequal. Filling those blanks with zero changes the group means and the test.',
    fix:'Use the observed measurements only. Compare mean squares and reserve pairwise claims for follow-up tests.',
    steps:[
      ['Name the hypotheses','H₀ says all four population means are equal. The alternative says the means are not all equal. Total N = 24.'],
      ['Read or compute the mean squares','Between: 0.23658/3 ≈ 0.07886. Within: 0.154916/20 ≈ 0.007746.'],
      ['Calculate and conclude','F ≈ 10.18, above the 5% cutoff of 3.098. p ≈ 0.000279. The data show the four means are not all equal.']
    ], formula:'anova'
  },
  {
    id:'commute-means', group:'l10', where:'Page 26 · Excel: Independent t-test', title:'Do home and near-campus commutes differ?',
    question:'Near campus: n = 35, mean 17.80, SD 8.93. At home: n = 25, mean 37.72, SD 27.36. Test for a difference at α = 0.05.',
    method:'Welch independent-samples t-test', clue:'Two independent groups with very different sample SDs. The exercise does not specify equal population variances.',
    trap:'Treating the groups as paired, using a one-sided result after seeing the means, or waiting for sample sizes to match all miss the setup.',
    fix:'Use Welch unless an equal-variance assumption is specified. Subtract in a named order and request a two-sided p-value.',
    steps:[
      ['Compute the mean difference','Near campus − home = 17.80−37.72 = −19.92 minutes.'],
      ['Compute Welch t','SE = √(8.93²/35 + 27.36²/25) ≈ 5.676. t ≈ −3.51, with Welch df ≈ 27.68.'],
      ['Write the two-sided conclusion','p ≈ 0.00156 < 0.05. There is evidence that mean commute times differ. The near-campus group averaged about 20 minutes less in the sample. If equal variances are explicitly assumed, the pooled result is t ≈ −4.03 with df = 58 and also rejects H₀.']
    ], formula:'independent-t'
  },
  {
    id:'consumer-ceo', group:'l11', where:'Pages 6–9', title:'Do consumers and CEOs differ on what influences ethics?',
    question:'About 57% of 755 consumers and 50% of 616 CEOs gave the specified response. The final question asks whether the consumer proportion is higher at α = 0.10.',
    method:'Right-tailed two-proportion z-test', clue:'Both samples report yes/no responses. The last line specifies “higher”.',
    trap:'The opening heading mentions a difference. The actual direction is supplied in the final research question. The given percentages are also rounded.',
    fix:'Define consumer minus CEO, use the right tail, and report the result as approximate.',
    steps:[
      ['Find the common estimate under H₀','Using the rounded rates, pooled p̂ ≈ (755×0.57 + 616×0.50)/(755+616) ≈ 0.5385.'],
      ['Find the statistic','SE ≈ √[0.5385(1−0.5385)(1/755 + 1/616)] ≈ 0.02707. z ≈ 0.07/0.02707 = 2.59.'],
      ['Compare with the cutoff','The right-tail 10% cutoff is about 1.282 and p ≈ 0.00485. There is evidence that the consumer proportion is higher.']
    ], formula:'two-prop'
  },
  {
    id:'service-gof', group:'l11', where:'Pages 11, 15–17 · Excel: Chi-sq_1', title:'Does the local service survey fit the national percentages?',
    question:'The 207 local responses are 21, 109, 62, and 15 across four categories. The reference proportions are 0.08, 0.47, 0.34, and 0.11. Test the fit at α = 0.05.',
    method:'Chi-square goodness-of-fit', clue:'There is one categorical variable and a stated reference distribution.',
    trap:'Comparing counts with percentages directly, or assuming each category should have 207/4 responses, builds the wrong expected table.',
    fix:'Multiply the sample total by each reference proportion, preserving decimals in E.',
    steps:[
      ['Find expected counts','E = 207×p gives 16.56, 97.29, 70.38, and 22.77.'],
      ['Calculate the contributions','Use (O−E)²/E for each category. The contributions are about 1.190, 1.409, 0.998, and 2.651, giving χ² ≈ 6.249.'],
      ['Compare the test result','With df = 4−1 = 3, p ≈ 0.1001. There is insufficient evidence that the local distribution differs from the reference.']
    ], formula:'chi-gof'
  },
  {
    id:'political-opinion', group:'l11', where:'Pages 17–21 · Excel: Chi-sq_2', title:'Are gender and opinion associated in the survey?',
    question:'For the two opinion rows, the counts by columns are [931, 1014] and [345, 525]. Work out expected counts and test independence.',
    method:'Chi-square test of independence', clue:'This is a 2×2 count table of two categorical variables.',
    trap:'The two gender groups have different totals. The larger count alone does not tell you which group has the larger favouring rate.',
    fix:'Build expected counts from the margins. If discussing direction, compare proportions within each gender group.',
    steps:[
      ['Find the four expected values','For favour/male, E = 1945×1276/2815 ≈ 881.64. The other expected counts are 1063.36, 394.36, and 475.64.'],
      ['Calculate and decide','The Pearson statistic without a continuity correction is χ² ≈ 16.354, df = 1, p ≈ 0.0000525. This gives evidence of an association.'],
      ['Describe the pattern if asked','Favouring rates are about 931/1276 = 73.0% and 1014/1539 = 65.9%. These observed rates describe the survey groups.']
    ], formula:'chi-ind'
  },
  {
    id:'lottery-independent', group:'l11', where:'Page 20', title:'Why six independent digits give one chance in a million',
    question:'Find the probability of matching a specified six-digit code when every digit is uniform and independent.',
    method:'Multiply independent probabilities', clue:'Each of the six places has ten possible digits, including zero.',
    trap:'Adding six probabilities answers a different event. Treating the code as a six-digit integer can also incorrectly exclude leading zeros.',
    fix:'Multiply 1/10 six times for one specified complete code.',
    steps:[
      ['Model one place','A match in any one place has probability 1/10.'],
      ['Combine all six places','Independence gives (1/10)⁶ = 1/1,000,000.'],
      ['Connect to expected counts','The same multiplication rule underlies P(row and column) = P(row)P(column) under independence. Multiply by N to get the expected cell count.']
    ], formula:'chi-ind'
  },
  {
    id:'gasoline-income', group:'l11', where:'Pages 22–24 · Excel: Chi-sq_3', title:'Is gasoline preference associated with income?',
    question:'A table crosses four income bands with three fuel types, N = 385. Test independence at α = 0.01. The first cell has O = 85, row total 107, and the regular-fuel column total is 238.',
    method:'Chi-square test of independence', clue:'Use a 4×3 table of observed data cells.',
    trap:'The “Total” row and column are helper values. Counting them as categories gives the wrong degrees of freedom.',
    fix:'Calculate all 12 expected cells from the unrounded margins and use df = (4−1)(3−1).',
    steps:[
      ['Work the first cell','E = 107×238/385 ≈ 66.1455. The contribution of O = 85 is about 5.3744.'],
      ['Sum the 12 cells','The workbook gives χ² ≈ 70.7274 and p ≈ 2.90×10⁻¹³. The lecture reports about 70.78 with its rounding. Both exceed the critical value 16.812.'],
      ['Conclude','Reject independence at 0.01. Fuel preference and income band are associated in the data.']
    ], formula:'chi-ind'
  },
  {
    id:'night-person', group:'l11', where:'Page 25 · in-class exercise', title:'Are living location and being a night person related?',
    question:'At home there are 5 morning and 20 night people. Near campus there are 7 morning and 28 night people. Test independence at α = 0.05.',
    method:'Chi-square test of independence', clue:'Compare the within-location rates before judging the counts.',
    trap:'28 night people near campus looks higher than 20 at home, but there are more students near campus.',
    fix:'Compute the rates or compare the observed table with its expected table.',
    steps:[
      ['Check the margins','There are 12 morning and 48 night people out of 60. The night share is 80%.'],
      ['Build the expected counts','At home: [5,20]. Near campus: [7,28]. The expected table matches the observed table exactly.'],
      ['Make the decision','χ² = 0, df = 1, p = 1. There is insufficient evidence that living location and morning/night preference are associated.']
    ], formula:'chi-ind'
  },
  {
    id:'interest-pearson', group:'l12', where:'Page 6', title:'Find Pearson r for interest and the futures index',
    question:'The 12 paired days have Σx = 92.93, Σy = 2725, Σx² ≈ 720.22, Σy² = 619207, and Σxy = 21115.07. Calculate and interpret r.',
    method:'Pearson correlation', clue:'Each day provides one pair of numerical values.',
    trap:'Using Σxy alone measures scale and size as well as how x and y move together. Pearson needs centred products and both spreads.',
    fix:'Use [Σxy − ΣxΣy/n] divided by the square root of the two centred sums of squares multiplied together.',
    steps:[
      ['Compute the centred product','Σxy − ΣxΣy/n ≈ 21115.07 − 92.93×2725/12 ≈ 12.22.'],
      ['Standardise by both spreads','Compute Sxx and Syy from the squared-sum columns, then divide Sxy by √(Sxx×Syy). With the printed precision, r ≈ 0.815.'],
      ['Interpret','The pairs show a strong positive linear association. One variable tending to be higher with the other does not establish the direction of causation.']
    ], formula:'simple-regression'
  },
  {
    id:'income-matrix', group:'l12', where:'Page 7 · correlation matrix', title:'Read an income correlation matrix',
    question:'Compare the entries for income in 2010 through 2014. What do 1.000 on the diagonal and values such as 0.720 and 0.968 off the diagonal tell you?',
    method:'Read Pearson r by row and column', clue:'Each off-diagonal cell compares two year variables.',
    trap:'The diagonal values of 1.000 compare each variable with itself. The mirror-image values above and below the diagonal repeat the same pairs.',
    fix:'Use one triangle of the matrix and compare distinct year pairs.',
    steps:[
      ['Choose a pair','2010 with 2014 gives r = 0.720. The reversed row/column pair gives the same number.'],
      ['Look for the strongest distinct pair','2013 with 2014 gives r = 0.968, the largest off-diagonal value shown.'],
      ['Explain the pattern','The entries are positive. People with higher income in one year tended to have higher income in another. r is unitless and describes a linear association.']
    ], formula:'simple-regression'
  },
  {
    id:'guess-r-class', group:'l12', where:'Pages 7–8 · Activity A, B, C', title:'Guess r from the three class scatterplots',
    question:'Match A: gadget hours and drink spending, B: sleep and gadget hours, and C: height and commute. Give a sign and a rough strength before reading the matrix.',
    method:'Read direction and strength', clue:'Decide whether the cloud rises, falls, or barely tilts, then judge how closely it follows a line.',
    trap:'A few extreme points or different axis scales can make the tilt look stronger. Correlation strength comes from the closeness to a line.',
    fix:'Use the matrix to check the sign and compare absolute r values.',
    steps:[
      ['A · gadgets and drink spending','r ≈ +0.40, a moderate positive linear association.'],
      ['B · sleep and gadget hours','r ≈ −0.17, a weak negative linear association.'],
      ['C · height and commute','r ≈ −0.04, very little linear association. Positive and negative describe direction. Absolute r describes strength.']
    ], formula:'simple-regression'
  },
  {
    id:'passenger-line', group:'l12', where:'Pages 13–16', title:'Build the passenger-cost regression line',
    question:'For 12 observations, x is passengers and y is cost in thousands of dollars. The table gives Σx = 930, Σy = 56.690, Σx² = 73,764, and Σxy = 4462.220.',
    method:'Simple linear regression by least squares', clue:'Use enough digits in the slope before computing the intercept.',
    trap:'One substitution on the slide appears to use 56.19 for Σy. The displayed data sum to 56.690. A slope in thousands of dollars also needs conversion when reporting dollars.',
    fix:'Use the verified total from the data table and label both units in the equation.',
    steps:[
      ['Centre the sums','Sxy = 4462.220 − 930×56.690/12 = 68.745. Sxx = 73764 − 930²/12 = 1689.'],
      ['Get slope and intercept','b₁ = 68.745/1689 ≈ 0.04070. b₀ = 56.690/12 − b₁(930/12) ≈ 1.5698.'],
      ['Write and read the line','ŷ ≈ 1.570 + 0.04070x in thousands of dollars. A one-passenger increase is associated with about 40.70 dollars higher predicted cost.']
    ], formula:'simple-regression'
  },
  {
    id:'passenger-residuals', group:'l12', where:'Pages 17–22', title:'Find a residual and the typical regression error',
    question:'For the passenger-cost line, the first observed point is x = 61 and y = 4.280 thousand dollars. Compute its residual, then turn SSE into the error standard deviation.',
    method:'Residual, SSE, and residual standard error', clue:'Residual = observed − predicted. SSE adds squared residuals.',
    trap:'Adding signed residuals makes positive and negative errors cancel. Dividing by n gives the wrong regression denominator for this model.',
    fix:'Square before summing. With a slope and an intercept estimated, use n−2 under the square root.',
    steps:[
      ['Find the first residual','ŷ ≈ 1.5698 + 0.04070×61 ≈ 4.0526. e ≈ 4.280−4.0526 = +0.2274. The dot lies above the line.'],
      ['Use the residual table','The slide reports SSE ≈ 0.31434 from its rounded residuals. Refitting the displayed observations in full precision gives about 0.31406.'],
      ['Find the typical error scale','Residual standard error ≈ √(0.31434/10) ≈ 0.1773 thousand dollars. The rounding difference scarcely affects this value.']
    ], formula:'simple-regression'
  },
  {
    id:'residual-plot', group:'l12', where:'Pages 18–20', title:'Read a residual plot before trusting the line',
    question:'The handout contrasts a healthy residual cloud with curves, funnels, and dependence patterns. Decide what each shape tells you.',
    method:'Regression diagnostics', clue:'Use zero as the reference line and inspect both the centre and spread of residuals.',
    trap:'A high R² can coexist with a curve or unequal spread. R² alone does not validate a linear model.',
    fix:'Check residuals against fitted values or x for shape and spread. Use observation order when investigating dependence.',
    steps:[
      ['Look for a curve','A systematic bend suggests the mean relationship may need a curved term or transformation.'],
      ['Look for a funnel','A widening or narrowing cloud suggests changing error variance.'],
      ['Look across order','Runs or periodic swings over time can signal dependence. A roughly even cloud around zero is more consistent with a simple linear model.']
    ], formula:'simple-regression'
  },
  {
    id:'forearm-foot', group:'l12', where:'Pages 23–24 · Excel: Data', title:'Predict foot length from forearm length',
    question:'The Excel output has intercept 9.5804, forearm coefficient 0.5940, R² ≈ 0.4054, and slope p ≈ 0.000155. Write the line, predict at 25 cm, and interpret.',
    method:'Read the coefficient table and the fit summary', clue:'Foot length is y. Forearm length is x.',
    trap:'Excel’s Multiple R is nonnegative. Determine the slope’s direction from its coefficient. The 40.54% from R² is a share of variation explained.',
    fix:'Use the coefficients for prediction, the slope p-value for significance, and R² for fit.',
    steps:[
      ['Build the equation','Predicted foot length = 9.5804 + 0.5940×forearm length, with lengths in cm.'],
      ['Predict for 25 cm','9.5804 + 0.5940×25 ≈ 24.43 cm. A 1 cm increase in forearm length corresponds to about 0.594 cm higher predicted foot length.'],
      ['Read the evidence and precision','p ≈ 0.000155 gives evidence of a nonzero slope. R² ≈ 40.5%. Residual standard error is about 1.64 cm.']
    ], formula:'simple-regression'
  },
  {
    id:'gadget-slope-intercept', group:'l12', where:'Page 25 · Activity 1 and 2', title:'Explain the gadget-hours slope and intercept',
    question:'Predicted weekly drink spending is ŷ = −95.7 + 38.4x, where x is gadget hours per day. Explain the slope and the literal intercept.',
    method:'Read the units of a fitted line', clue:'The predictor is measured per day and the prediction per week.',
    trap:'Saying “38.4 baht per day” changes the outcome unit. Believing negative spending literally at zero hours extends the line into an implausible region.',
    fix:'Read the slope as predicted weekly spending per additional daily hour, then check whether x = 0 is meaningful.',
    steps:[
      ['Interpret the slope','One extra gadget hour per day corresponds to 38.4 baht more in predicted drink spending per week.'],
      ['Interpret the intercept','At x = 0 the formula predicts −95.7 baht per week. The intercept positions the line. Its literal prediction is unsuitable for spending at zero hours.'],
      ['Read fit separately','r ≈ 0.395 and R² ≈ 0.156. The line explains about 15.6% of variation in the sample.']
    ], formula:'simple-regression'
  },
  {
    id:'whose-residual', group:'l12', where:'Page 26 · Activity A, B, C', title:'Who is above or below the spending prediction?',
    question:'Use ŷ = −95.7 + 38.4x. The three anonymous activity examples have (x,y) of (4,150), (8,30), and (12,500). Find all three predictions and residuals.',
    method:'Prediction followed by observed minus predicted', clue:'Each actual value goes into the residual, after you have calculated its prediction.',
    trap:'Subtracting actual from predicted flips above and below. The same slope and intercept apply to all three cases.',
    fix:'Write the calculation in two columns: ŷ first, y−ŷ second.',
    steps:[
      ['A at 4 hours','ŷ = 57.9. Residual = 150−57.9 = +92.1 baht. A is above the line.'],
      ['B at 8 hours','ŷ = 211.5. Residual = 30−211.5 = −181.5 baht. B is below the line.'],
      ['C at 12 hours','ŷ = 365.1. Residual = 500−365.1 = +134.9 baht. C is above the line.']
    ], formula:'simple-regression'
  },
  {
    id:'workweek-linear', group:'l13', where:'Pages 7–9 · Excel: Quadratic', title:'Read the linear trend in the Canadian workweek',
    question:'There are 35 observations. The straight-line fit is ŷ = 37.4161 − 0.0614t. Interpret t and the slope, and predict at period 35.',
    method:'Simple regression with an ordered time index', clue:'The input is period number 1 to 35.',
    trap:'Plugging an actual calendar year into the model or reading the slope as a percentage changes its meaning.',
    fix:'Use the same 1-to-35 time index and report the slope in weekly hours per period.',
    steps:[
      ['Read the trend','The linear fit predicts about 0.0614 fewer hours in the workweek for every additional period.'],
      ['Predict at the final sample period','37.4161 − 0.0614×35 ≈ 35.27 hours.'],
      ['Inspect the fit','R² ≈ 0.611. The plotted points bend back up late in the series, so compare the straight-line fit with a curved model. Forecasts far outside these periods need extra care.']
    ], formula:'simple-regression'
  },
  {
    id:'workweek-curve', group:'l13', where:'Pages 9–11 · Excel: Quadratic', title:'Why add time squared to the workweek model?',
    question:'Compare the straight-line and quadratic fits for the same 35 periods. The curved fit is approximately ŷ = 38.1644 − 0.1827t + 0.0034t².',
    method:'Quadratic regression and model comparison', clue:'A term in t² lets the line bend while keeping t as the time index.',
    trap:'Reading −0.1827 as the fixed change for every period ignores the change from the squared term. A higher in-sample R² alone does not guarantee better forecasts.',
    fix:'Include both t and t² for prediction. Compare adjusted R² and residual behaviour on the same data.',
    steps:[
      ['Make the curved prediction','At t = 35, substitute 35 for t and 1225 for t². The rounded slide coefficients give about 35.93 hours. The full-precision workbook fit gives about 35.90.'],
      ['Compare like with like','Linear R² ≈ 0.611 and adjusted R² ≈ 0.600. Quadratic R² ≈ 0.761 and adjusted R² ≈ 0.747.'],
      ['Interpret the bend','The squared coefficient is positive, so the fitted curve bends upward. Its slope depends on t. The squared-term p-value on the sheet is about 0.0000876.']
    ], formula:'regression-predict'
  },
  {
    id:'adult-height', group:'l13', where:'Page 12', title:'Set up a model for adult height',
    question:'Age, sex, current height, weight, and parental heights are candidate predictors. Identify the response and explain why this is a multiple-regression problem.',
    method:'Specify the response and predictors', clue:'Adult height is the number being predicted.',
    trap:'A predictor such as current height can be confused with the adult-height outcome. A category needs a suitable coding if it goes into a regression.',
    fix:'Write “predict Y from X” first. Use measured adult height for Y when fitting the model and encode categorical predictors.',
    steps:[
      ['Separate Y from X','Y is adult height. The six candidate predictors describe the child and their parents.'],
      ['Set up the model','Use a coefficient for each included numerical predictor and a reference level for any categorical predictor represented by dummy variables.'],
      ['Know what can be calculated','The slide names the variables. Numerical predictions require fitted coefficients, and assessment of prediction quality requires data.']
    ], formula:'regression-predict'
  },
  {
    id:'dummy-night', group:'l13', where:'Pages 13–14', title:'Read the morning/night dummy variable',
    question:'The fitted equation is ŷ = −214.2 + 39.1(gadget hours) + 140.4(Night). Night is 1 for a night person and 0 for a morning person. Compare the predictions at 8 gadget hours per day.',
    method:'Dummy variables and a reference category', clue:'Set the indicator to 0 or 1 and keep gadget hours fixed.',
    trap:'Using 1 and 2 for the two categories changes which intercept applies. Using all k indicators with an intercept causes exact dependence.',
    fix:'With an intercept, use k−1 indicators. The omitted category is the baseline.',
    steps:[
      ['Use the baseline','Morning: −214.2 + 39.1×8 + 140.4×0 = 98.6 baht per week.'],
      ['Switch only the indicator','Night: 98.6 + 140.4 = 239.0 baht per week.'],
      ['Read the comparison','The two fitted lines differ by 140.4 baht at the same gadget hours and share the 39.1 slope. Two living-location levels use one indicator. Seven weekdays use six.']
    ], formula:'regression-predict'
  },
  {
    id:'log-units', group:'l13', where:'Page 16 · four OLS forms', title:'Read coefficients when x or y is logged',
    question:'The handout lists level–level, log–level, level–log, and log–log models. Decide whether each coefficient describes units or percentages.',
    method:'Read the transformation on each side', clue:'An unlogged variable uses its original units. A log change is interpreted as a relative change.',
    trap:'Multiplying every coefficient by 100 works only as a small-coefficient approximation in the log–level case.',
    fix:'Ask whether the input change is one unit or 1%. Then describe the output in units or percentages to match its form.',
    steps:[
      ['Level–level and log–level','Level–level: +1 in x changes y by b units. Log–level: +1 in x gives a multiplicative factor eᵇ in the fitted outcome on the original scale, a 100(eᵇ−1)% change.'],
      ['Level–log','A 1% increase in x changes y by b×ln(1.01) units, about b/100.'],
      ['Log–log','b is elasticity. A small 1% increase in x corresponds to about b% change in y. Hold the other predictors fixed when reading a multiple regression.']
    ], formula:'regression-predict'
  },
  {
    id:'hedonic-land-table', group:'l13', where:'Pages 19–21 · first land-value study', title:'Read the transit distance coefficient in a land-value model',
    question:'The table has OLS, spatial error, and spatial lag columns for a land-price outcome. The station-distance coefficients are −0.41, −0.47, and −0.28.',
    method:'Interpret a partial coefficient in one fitted model', clue:'Choose a model column before reading its coefficient and t statistic.',
    trap:'Mixing one column’s coefficient with another column’s t statistic, reading stars as effect size, or treating association as a causal effect can mislead.',
    fix:'Stay inside one column, apply its units and reference categories, and explain the conditional association.',
    steps:[
      ['Choose the OLS column','The station-distance coefficient is −0.41 in the outcome units per distance unit. Holding the included predictors fixed, greater distance is associated with lower predicted land price.'],
      ['Check the table legend','The OLS t statistic is about −7.1. The stars refer to thresholds in the table legend. They describe statistical evidence.'],
      ['Read indicator rows against their baseline','A distance-band row compares that band with its omitted reference category. Use the category definitions rather than substituting a continuous-distance interpretation.']
    ], formula:'regression-t'
  },
  {
    id:'hedonic-accessibility', group:'l13', where:'Page 21 · second land-value study', title:'Separate accessibility, land prices, and causal claims',
    question:'The second hedonic example concerns transit accessibility and land values in the Bangkok region. How would you read a result from a model of this kind?',
    method:'Interpret multivariable model results in context', clue:'Identify the price outcome, the accessibility measure, and the other attributes included.',
    trap:'A relationship between accessibility and prices can reflect location or other characteristics. The slide introduces the paper without a full numerical results table for this second example.',
    fix:'State a conditional association using the actual coefficient and units if they are given.',
    steps:[
      ['Identify what is being predicted','Check how the study measures land value and accessibility. The outcome scale determines the interpretation.'],
      ['Hold included factors fixed','A coefficient describes the fitted difference for one predictor while the listed covariates stay fixed.'],
      ['Use the supplied evidence','This slide supports an interpretation exercise. A numerical answer requires the coefficient and units from the study or an output table provided on the exam.']
    ], formula:'regression-predict'
  },
  {
    id:'drink-overall-f', group:'l13', where:'Pages 22–23 · Class Data', title:'Do gadgets, sleep, and commute help jointly?',
    question:'The three-predictor spending model uses 60 students. MS Regression is 349,354 and MS Residual is 66,594. Test the model at α = 0.05.',
    method:'Overall F test', clue:'The prompt asks about the whole model. Read Significance F or calculate F from the two mean squares.',
    trap:'Using an individual p-value to answer the overall question, or claiming a significant F establishes that all predictors matter, overstates the result.',
    fix:'Test all slopes jointly under H₀. Use separate t tests to assess individual slopes.',
    steps:[
      ['Set the joint null','H₀: all three population slopes equal zero. Hₐ: at least one is nonzero.'],
      ['Compute F and its df','F = 349354/66594 ≈ 5.25. df = (3,56), and Significance F ≈ 0.0029.'],
      ['Conclude','Reject H₀. The predictors jointly improve the fit over an intercept-only model under the test assumptions.']
    ], formula:'regression-f', related:['drink-coefficients']
  },
  {
    id:'drink-coefficients', group:'l13', where:'Pages 22–23 · Class Data', title:'Which drink-spending predictors are significant?',
    question:'The p-values are 0.001 for gadget hours, 0.351 for sleep, and 0.076 for commute. Use α = 0.05 and interpret the gadget coefficient 39.56.',
    method:'Individual two-sided t tests', clue:'Use the P-value in each predictor’s own row.',
    trap:'The overall model’s p-value is small, but it answers a joint question. A negative sign or a large raw coefficient also does not determine significance.',
    fix:'Compare each coefficient’s p-value with α and explicitly hold the other predictors fixed in the interpretation.',
    steps:[
      ['Check each row','Gadget hours passes 0.05. Sleep and commute do not at this level.'],
      ['Interpret the gadget slope','At fixed sleep and commute times, one extra gadget hour per day corresponds to about 39.56 baht more in predicted weekly drink spending.'],
      ['Keep evidence and prediction separate','The fitted equation is ŷ ≈ 137.6 + 39.56(gadget) − 24.50(sleep) − 2.92(commute). Use all terms when asked to predict from the fitted equation.']
    ], formula:'regression-t'
  },
  {
    id:'adjusted-r-class', group:'l13', where:'Page 24 · Model comparison', title:'Compare R² and adjusted R² across three spending models',
    question:'For gadget only, gadget plus sleep, and all three predictors, R² is 0.156, 0.174, 0.219. Adjusted R² is 0.142, 0.145, 0.178.',
    method:'Compare fit with a penalty for adding predictors', clue:'All three models were fitted to the same outcome and observations.',
    trap:'Ordinary R² rises or stays the same when you add predictors to nested least-squares models on the same sample. Its increase by itself does not establish added predictive value.',
    fix:'Compare adjusted R² on this sample and consider validation when the goal is performance on new data.',
    steps:[
      ['Read ordinary R²','The all-predictor model explains about 21.9% of the sample variation.'],
      ['Read adjusted R²','Adjusted R² = 1 − (1−R²)(n−1)/(n−k−1). Here 0.178 is the largest adjusted value of the three.'],
      ['Use the correct claim','Among these models, the three-predictor model has the highest adjusted in-sample fit. This comparison does not provide a future-data error estimate.']
    ], formula:'regression-f'
  },
  {
    id:'vif-class', group:'l13', where:'Pages 17–18, 24', title:'Do the three predictors overlap too much?',
    question:'The reported VIFs for gadget hours, sleep, and commute are 1.06, 1.04, and 1.03.',
    method:'Read variance inflation factors', clue:'VIF measures how much the other predictors explain one predictor.',
    trap:'A small outcome p-value and a low VIF answer different questions. VIF concerns overlap among X variables.',
    fix:'Read VIF separately from outcome fit. The handout flags values above 5 as a screening rule.',
    steps:[
      ['Compute the idea behind VIF','For predictor j, regress it on the other predictors and calculate VIFⱼ = 1/(1−Rⱼ²).'],
      ['Interpret these numbers','All three VIFs are near 1. The model shows little variance inflation from overlap among these predictors.'],
      ['Handle a large value carefully','Inspect redundancy and the purpose of the model. Strong overlap can make individual slopes hard to estimate precisely.']
    ], formula:'regression-t'
  },
  {
    id:'correlation-limits', group:'l13', where:'Pages 25–26', title:'A strong correlation can still mislead',
    question:'The closing slides show several ways correlation can give an incomplete picture. Explain what to inspect before interpreting r.',
    method:'Diagnose the scatterplot', clue:'Pearson r measures linear association across the observed points.',
    trap:'One number hides curves, outliers, subgroups, and changing spread. It also does not establish a causal relationship.',
    fix:'Look at the graph and study design first. Explain the pattern the data support.',
    steps:[
      ['Inspect shape and outliers','A tight U-shaped relationship can have r near zero. A single extreme point can substantially change r.'],
      ['Check groups and spread','Separate groups or changing spread can make a pooled summary misleading. Examine relevant groups directly.'],
      ['Choose careful wording','Describe the direction and strength of the observed linear association. Causal claims require additional design or evidence.']
    ], formula:'simple-regression'
  },
  {
    id:'final-1', group:'final', where:'Page 1 · Question 1', title:'Q1. Did scores increase after tutoring?',
    question:'Eighteen students are measured twice. With d = after − before, the summary is d̄ = 3.389 and sᵈ = 3.274. Use α = 0.05 and follow the six-step test in the question.',
    method:'Right-tailed paired t-test', clue:'Same students and an explicitly directional “improve” claim.',
    trap:'Counting 36 scores instead of 18 pairs gives the wrong SE and df. A two-sided test also changes the specified question.',
    fix:'Work with one difference per student and use Hₐ: μᵈ > 0.',
    steps:[
      ['1–2. State the hypotheses and test','H₀: μᵈ = 0. Hₐ: μᵈ > 0. Use a paired t-test with df = 18−1 = 17.'],
      ['3–4. Set α and the rule','At α = 0.05, reject for t > 1.740 or for a right-tail p-value ≤ 0.05.'],
      ['5. Compute','SE = 3.274/√18 ≈ 0.7717. t = 3.389/SE ≈ 4.39.'],
      ['6. Conclude','Reject H₀. There is evidence that the population mean score rose after tutoring.']
    ], formula:'paired-t'
  },
  {
    id:'final-2', group:'final', where:'Page 2 · Question 2', title:'Q2. Do the two groups define success differently?',
    question:'Among women with sales of 100,000–500,000 baht, 39 of 95 chose sales or profit as a success measure. In the lower-sales group, 24 of 100 did. Use α = 0.01.',
    method:'Two-sided two-proportion z-test', clue:'The final instruction asks for a difference, even though the introduction mentions a directional finding.',
    trap:'Using the right-tail p ≈ 0.00546 for a “different” question reverses the decision at α = 0.01. Averaging the two observed rates also ignores unequal sample sizes.',
    fix:'Use Hₐ: p₁ ≠ p₂ for the final wording. Pool the counts, then double the corresponding extreme tail.',
    steps:[
      ['Define the groups','Group 1 is the higher-sales band. H₀: p₁ = p₂. Hₐ: p₁ ≠ p₂.'],
      ['Calculate the pooled rate and SE','Pooled p̂ = (39+24)/(95+100) ≈ 0.3231. SE = √[p̂(1−p̂)(1/95+1/100)] ≈ 0.0670.'],
      ['Compute z and the p-value','z ≈ (39/95−24/100)/SE ≈ 2.545. Two-sided p ≈ 0.01092.'],
      ['Conclude at 1%','p is slightly above 0.01. There is insufficient evidence that the proportions differ at the requested level.']
    ], formula:'two-prop'
  },
  {
    id:'final-3', group:'final', where:'Page 3 · Question 3', title:'Q3. Do mean scores differ across three classes?',
    question:'Use the supplied summaries (n, mean, s): (20, 17.59, 6.38), (19, 18.14, 6.25), and (21, 16.23, 4.96). Test at α = 0.05.',
    method:'One-way ANOVA from summary statistics', clue:'The question explicitly says to use the provided n, mean, and SD.',
    trap:'Averaging three group means with equal weights ignores unequal n. The s column contains SDs, so within-group SS needs s².',
    fix:'Weight each mean by n. Build within-group SS from (n−1)s².',
    steps:[
      ['Find the weighted mean','N = 60. Grand mean = (20×17.59 + 19×18.14 + 21×16.23)/60 ≈ 17.288.'],
      ['Build the sums of squares','Section 1 contributes 20(17.59−17.288)² between groups and (20−1)×6.38² within groups. Repeat and add for all three sections. SS between ≈ 39.123 and SS within ≈ 1968.541.'],
      ['Calculate F','df = (2,57). F = (39.123/2)/(1968.541/57) ≈ 0.566.'],
      ['Conclude','p ≈ 0.571 > 0.05. There is insufficient evidence that the three population means differ.']
    ], formula:'anova'
  },
  {
    id:'final-4', group:'final', where:'Page 4 · Question 4', title:'Q4. Is platform choice associated with age?',
    question:'A survey recorded the platforms used by 480 people across three age groups. Test whether age and platform choice are associated at α = 0.05.',
    table:{
      caption:'Observed counts by platform and age',
      columns:['Platform','12–34','35–54','55+','Total'],
      rows:[['Facebook',45,87,60,192],['Instagram',34,49,21,104],['Pinterest',38,31,15,84],['Twitter',48,30,22,100],['Total',165,197,118,480]]
    },
    method:'Chi-square test of independence', clue:'Two categorical variables and a contingency table.',
    trap:'Using 45 as the expected count or counting totals as extra categories misses how the expectation is defined. An association also does not establish causation.',
    fix:'Use the row and column margins to make E. Sum only the 12 actual data cells.',
    steps:[
      ['State H₀ and calculate the first E','H₀: age group and platform choice are independent. E = 192×165/480 = 66 for the first cell.'],
      ['Add the contributions','For ages 12–34, the four expected counts are 66, 35.75, 28.875, and 34.375. The first contribution is (45−66)²/66 ≈ 6.68. Repeat for all 12 cells. The sum is χ² ≈ 26.265.'],
      ['Find df and conclude','df = (4−1)(3−1) = 6 and p ≈ 0.000199. There is evidence that age and platform choice are associated.']
    ], formula:'chi-ind'
  },
  {
    id:'final-5', group:'final', where:'Page 5 · Question 5', title:'Q5. Estimate mean sleep for first-year students',
    question:'Sixty students report a mean of 6.83 hours per night and sample SD 1.33 hours. Construct and interpret a 95% confidence interval.',
    method:'One-sample t interval for a mean', clue:'s estimates σ. The target is the population’s average number of hours.',
    trap:'A statement about how much 95% of individual students sleep answers a different question. Using 1.33 as the margin ignores the sample size.',
    fix:'Find s/√n, multiply by t*, and write an interpretation about the population mean.',
    steps:[
      ['Find the ingredients','df = 59, t* ≈ 2.001, and SE = 1.33/√60 ≈ 0.1717 hours.'],
      ['Build the interval','Margin ≈ 0.3436. 6.83 ± 0.3436 gives about (6.49, 7.17) hours.'],
      ['Interpret','Under the sampling and inference assumptions, we are 95% confident that the target population mean lies between 6.49 and 7.17 hours per night.']
    ], formula:'ci-mean'
  },
  {
    id:'final-6', group:'final', where:'Page 6 · Question 6, parts a–e', title:'Q6. Read and use the condo price model',
    question:'The fitted model predicts a condo price in millions of baht from size, BTS distance in metres, and building age. The question asks for the equation, overall test, individual tests, interpretation, and prediction.',
    method:'Multiple regression output and prediction', clue:'Different subparts use different columns. Keep the prediction in millions of baht until conversion is requested.',
    trap:'Excel rounds the overall significance to 0.0000. This does not mean the p-value is exactly zero. A coefficient of −0.0007 million baht is −700 baht.',
    fix:'Use coefficients to build the equation and make predictions. Read Significance F for the overall test and each predictor’s p-value for its own test.',
    steps:[
      ['a. Write the equation','ŷ = 0.874 + 0.0562(size) − 0.0007(BTS distance) + 0.0021(age).'],
      ['b. Test the model overall','F(3,36) = 44.79 with p < 0.05. Reject H₀ that all three slopes are zero.'],
      ['c. Inspect each predictor','Size and BTS distance (p = 0.006) are significant at 0.05. Age (p = 0.863) is not significant at this level.'],
      ['d. Interpret the distance coefficient','With size and age fixed, one extra metre corresponds to 700 baht lower predicted price.'],
      ['e. Predict the requested condo','For 45 m², 300 metres, and 10 years, ŷ = 0.874 + 0.0562×45 − 0.0007×300 + 0.0021×10 = 3.214 million baht.']
    ], formula:'regression-predict', related:['drink-overall-f','drink-coefficients']
  },
  {
    id:'excel-means', group:'excel', where:'t test ANOVA example.xlsx · all 3 tabs', title:'Recreate the three mean comparisons in Excel',
    question:'Use the workbook tabs Paired t-test, Independent t-test, and ANOVA to match each data layout to its test.',
    method:'Pair first, then choose the test type', clue:'A row means a matched company in the first tab. Rows across the other group columns do not create pairs.',
    trap:'Selecting a full range with unrelated headings, filling blank rows with zero, or reordering one paired column can change the test.',
    fix:'Select numeric observations, keep true paired rows together, and select the test type from the study design.',
    steps:[
      ['Paired t-test tab','Use Year 1 − Year 2 row by row and retain each company’s pairing. T.TEST with tails = 2 and type = 1 reproduces p ≈ 0.5043.'],
      ['Independent t-test tab','Use the two observed commute columns. For Welch, set tails = 2 and type = 3. This gives p ≈ 0.00156.'],
      ['ANOVA tab','Use Data Analysis → ANOVA: Single Factor with columns grouped by operator. The blanks indicate unequal sizes. Check F ≈ 10.18 with df = (3,20).']
    ], formula:'independent-t', related:['pe-years','commute-means','valve-anova']
  },
  {
    id:'excel-chi-template', group:'excel', where:'TU155_Lecture 11.xlsx · Chi-sq_1, Chi-sq_2, Chi-sq_3', title:'Fill each chi-square worksheet',
    question:'The three tabs cover customer ratings, political opinion, and gasoline preference. Fill expected counts, per-cell contributions, and the overall result.',
    method:'Build the expected table before using CHISQ.TEST', clue:'The ratings tab supplies target proportions. The other tabs give pairs of categories.',
    trap:'Using the same E formula for all three tabs, or including subtotal cells in CHISQ.TEST, gives the wrong answer.',
    fix:'For goodness-of-fit, multiply N by the supplied p. For independence, multiply the row and column totals and divide by N.',
    steps:[
      ['Chi-sq_1','Build the four E values from the probabilities. Sum contributions to get χ² ≈ 6.2491, df = 3, p ≈ 0.1001.'],
      ['Chi-sq_2','Build a 2×2 expected table. The four contributions give χ² ≈ 16.3545 and p ≈ 0.0000525.'],
      ['Chi-sq_3','Build a 4×3 expected table. Keep E unrounded and exclude margins from the test inputs. Check χ² ≈ 70.7274 with df = 6.']
    ], formula:'chi-ind', related:['service-gof','political-opinion','gasoline-income']
  },
  {
    id:'excel-chi-in-class', group:'excel', where:'TU155_Lecture 11_in class.xlsx · Chi-sq_1, Chi-sq_2, Chi-sq_3', title:'Audit the in-class chi-square answers',
    question:'Compare the workbook’s populated results with the handout. Trace how each expected count and overall p-value is formed.',
    method:'Audit the observed and expected ranges', clue:'First check dimensions and matching totals, then reproduce one calculation by hand.',
    trap:'A Chi-sq column may hold a contribution, a total statistic, or a p-value. The same heading does not make those quantities interchangeable.',
    fix:'Check the function or formula used in each result cell and label each quantity by scale.',
    steps:[
      ['Audit Chi-sq_1','The four expected counts total 207, which matches the observed counts. Its overall statistic is about 6.2491.'],
      ['Audit Chi-sq_2','Check that favour/male E = 1945×1276/2815 ≈ 881.6412. The workbook displays the overall p-value, about 0.0000525.'],
      ['Audit Chi-sq_3','The displayed sum is about 70.7274. The separate p-value is about 2.90×10⁻¹³. Small differences from the slide’s rounded statistic do not change the conclusion.']
    ], formula:'chi-ind', related:['service-gof','political-opinion','gasoline-income']
  },
  {
    id:'excel-forearm', group:'excel', where:'Example_shoe size_forearm.xlsx · Data', title:'Fit the forearm and foot model from the workbook',
    question:'Use the 30 paired lengths to reproduce the handout’s foot-length regression.',
    method:'Fit y on the specified x', clue:'Select Foot_cm as Y and Forearm_cm as X.',
    trap:'Reversing X and Y keeps r the same but changes the regression equation. Entering the subject ID as a predictor changes the model.',
    fix:'Select the two measurement columns and keep rows aligned by subject.',
    steps:[
      ['Set the inputs','Use the 30 numeric rows from the two measurement columns, with foot length as Y and forearm length as X.'],
      ['Reproduce the fit','Check for intercept ≈ 9.5804, slope ≈ 0.5940, and R² ≈ 0.4054.'],
      ['Check one prediction','At 25 cm of forearm length, predicted foot length is about 24.43 cm. Use the residual plot to check the linear fit.']
    ], formula:'simple-regression', related:['forearm-foot']
  },
  {
    id:'excel-period-and-class', group:'excel', where:'TU155_example.xlsx · Quadratic and Class Data', title:'Fit the time trend and the spending model from Excel',
    question:'Use the Quadratic tab for the workweek trend and the Class Data tab for the spending models. Compare model summaries while keeping the outcome and rows fixed within each comparison.',
    method:'Compare nested models in the same sample', clue:'A quadratic adds a squared predictor. The class model adds sleep and commute to gadget hours.',
    trap:'Using an unsquared time column twice creates duplicate predictors. Changing the sample between models makes the R² comparison harder to interpret.',
    fix:'Create t² from the period index. For each nested comparison, keep the same observations and same Y.',
    steps:[
      ['Quadratic tab','Fit hours on t and then on t plus t². The adjusted R² values are about 0.600 and 0.747.'],
      ['Class Data tab','Fit drink spending on gadget hours, then add sleep and commute. The three-predictor model gives F ≈ 5.246 and adjusted R² ≈ 0.178.'],
      ['Read the model tests','The three-predictor model’s overall p is approximately 0.0029. At 0.05, only gadget hours is individually significant in that model.']
    ], formula:'regression-f', related:['workweek-curve','drink-overall-f','adjusted-r-class']
  }
];
