'use strict';
const sources = [
  ['Lecture 8 · Confidence Interval'],
  ['Lecture 9 · CI & Hypothesis Testing'],
  ['Lecture 10 · Comparing Population Means'],
  ['Lecture 11 · Comparing Proportions & Chi-square'],
  ['Lecture 12 · Simple Linear Regression'],
  ['Lecture 13 · Multiple Linear Regression'],
  ["Final Practice Questions · 6 questions"]
];

const topics = [
  {title:"Confidence intervals", short:'CI', context:"How long do students sleep on average?", cue:"Estimate a range",
   story:"Your friends average 6.83 hours of sleep. Another sample might give a different average. A confidence interval puts a margin around the sample estimate.",
   prompt:"Change the number of respondents. Will the interval grow or shrink?",
   parts:[
    ["Choose the centre","Use the sample mean x̄ to estimate the population mean μ."],
    ["Measure how much the estimate varies","SE = s/√n. With independent observations, the mean from a larger sample is more precise. If n quadruples and s stays fixed, SE halves."],
    ["Allow a margin on both sides","CI = estimate ± critical value × SE. For a mean, use t* with df = n−1 when estimating σ with s. Use z* when σ is known. For a proportion, use p̂ ± z*√[p̂(1−p̂)/n] with sufficiently many successes and failures."]
   ],
   example:"Mean sleep = 6.83 h, s = 1.33, n = 60. SE = 1.33/√60 ≈ 0.172, t* ≈ 2.001, and the 95% CI is approximately (6.49, 7.17) hours. We are 95% confident that the target population mean lies in this interval.",
   tip:"Across repeated random samples, about 95% of intervals constructed this way cover the true mean under the assumptions of the method.",
   check:["If the sample size quadruples and s stays fixed, what happens to the SE?", ["It halves.","It stays the same.","It doubles."],0,"√4 = 2, so the denominator doubles."]
  },
  {title:"Hypothesis testing", short:"Hypotheses", context:"Does the average meal cost differ from 60 baht?", cue:"Compare the evidence with a threshold",
   story:"A café says customers spend an average of 60 baht. Your sample averages 64 baht. How large is that gap of 4 baht compared with the uncertainty of the sample mean?",
   prompt:"The simulated result has a right-tail p-value of 0.039. Change the alternative hypothesis to see what happens.",
   parts:[
    ["State the claims before seeing the data","H₀ gives the reference value, such as μ = 60. In Hₐ, use ≠ for different, > for higher, and < for lower."],
    ["Express the difference in standard-error units","t = (x̄ − μ₀)/(s/√n) tells you how many standard errors the sample mean is from the reference. With known σ, use z and replace s with σ. For one proportion, use z = (p̂ − p₀)/√[p₀(1−p₀)/n] because the denominator is computed under H₀."],
    ["Compare p with α and write a conclusion","Under H₀, p is the probability of a test statistic at least as extreme as the one observed, using the tails from Hₐ. Reject H₀ if p ≤ α. Otherwise, report insufficient evidence."]
   ],
   example:"Six steps: state H₀ and Hₐ, choose the test, set α, state the decision rule, calculate, and conclude in the words of the question.",
   tip:"For a two-sided test and its matching 95% interval, a reference value outside the interval is rejected at the 5% level.",
   check:["“Does the average meal cost differ from 60 baht?” Which tail(s)?", ["Right tail","Both tails","Left tail"],1,"Different includes both higher and lower."]
  },
  {title:"Comparing means", short:'t-test / ANOVA', context:"Before and after, two separate groups, or three classes", cue:"Check whether the data are paired",
   story:"With before-and-after data, subtract scores within each person. With two separate classes, compare their means. With three classes, compare their means together.",
   prompt:"Change May's after-tutoring score and watch the average gain change. These numbers are made up to practise pairing.",
   parts:[
    ["Paired t-test · same people","Form d = after − before for each pair. Test the mean difference with t = (d̄ − 0)/(sᵈ/√n), where n is the number of pairs and df = n−1."],
    ["Independent-samples t-test · two separate groups","Subtract the two sample means. Welch uses SE = √(s₁²/n₁ + s₂²/n₂). If equal variances are assumed, use sₚ√(1/n₁ + 1/n₂), with sₚ² = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁+n₂−2) and df = n₁+n₂−2."],
    ["One-way ANOVA · several independent groups","F = MS between groups ÷ MS within groups. MS between = Σnᵢ(x̄ᵢ−grand mean)²/(k−1). MS within = Σ(nᵢ−1)sᵢ²/(N−k). The ratio compares separation between means with spread within groups."]
   ],
   example:"The mean commute gap is 19.92 minutes for students living at home versus near the university. Welch gives t ≈ 3.51 and two-sided p ≈ 0.0016. For the four valve operators, ANOVA gives F ≈ 10.18 and p ≈ 0.00028.",
   tip:"Paired tests work with differences within pairs. Standard ANOVA assumes independent observations, equal population variances, and roughly normal within-group distributions. A significant result means the means are not all equal.",
   check:["Classes A and B contain different students but have the same size. Which test compares their mean scores?", ['Paired t-test','Independent t-test',"One-way ANOVA for several classes"],1,"The two groups have no defined pairs."]
  },
  {title:"Proportions and chi-square", short:"Proportions / χ²", context:"Does platform choice vary by age?", cue:"Count people by category",
   story:"A yes/no response gives a proportion. Two categorical variables, such as age group and platform, give a table of counts that can show an association.",
   prompt:"Choose a Facebook cell and compare its observed count with the count expected if age group and platform were independent.",
   parts:[
    ["Two proportions · start with yes responses","p̂₁ = x₁/n₁ and p̂₂ = x₂/n₂. Under H₀ of equal proportions, divide the combined yes count by the combined sample size to estimate the common proportion."],
    ["Divide the difference by its standard error","z = (p̂₁−p̂₂)/√[p̂ pooled(1−p̂ pooled)(1/n₁+1/n₂)]. Use it for independent groups with sufficiently large expected success and failure counts."],
    ["Chi-square · work one cell at a time","E = row total × column total ÷ grand total. Under independence, the overall platform share applies to each age group. Sum (O−E)²/E over the cells to get χ². The degrees of freedom are (rows−1)(columns−1)."]
   ],
   example:"For Facebook users aged 12–34, O = 45 and E = 192×165/480 = 66. The cell contributes about 6.68. Across 12 cells, χ² ≈ 26.26, df = 6, and p ≈ 0.000199.",
   tip:"Count each person in one cell and check that expected counts are large enough. Use the right tail because larger discrepancies produce larger χ² values.",
   check:["If O = E, what does that cell add to χ²?", ['0','1',"Exactly E"],0,"O − E is zero."]
  },
  {title:"Simple linear regression", short:'Simple regression', context:"Predict foot length from forearm length", cue:"Predict from one variable",
   story:"Each person is a dot. The line predicts foot length from forearm length. The vertical gap from a dot to its fitted value is the residual.",
   prompt:"Change the slope and watch the sum of squared residuals.",
   parts:[
    ["Write the line","ŷ = b₀ + b₁x. The slope b₁ describes how ŷ changes for a one-unit increase in x. The intercept b₀ is ŷ at x = 0."],
    ["Measure prediction error","A residual is e = y − ŷ and is positive when the dot lies above the line. Squaring keeps positive and negative errors from cancelling and gives larger errors greater weight."],
    ["Choose the line with the smallest squared error","OLS selects b₀ and b₁ to minimise Σe². The line has b₁ = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)² and b₀ = ȳ−b₁x̄. To test H₀: β₁ = 0, use t = b₁/SE(b₁) with df = n−2."]
   ],
   example:"The handout gives predicted foot length = 9.580 + 0.594(forearm length). A 25 cm forearm predicts about 24.43 cm. The slope p-value is approximately 0.000155.",
   tip:"Check the residual plot. An even, patternless spread around zero supports a straight line with constant variance. A curve or funnel prompts a closer look.",
   check:["An actual price is 4 million baht and the prediction is 3.5 million. What is the residual?", ["−0.5 million baht","+0.5 million baht","+7.5 million baht"],1,"Observed − predicted = 4 − 3.5."]
  },
  {title:"Multiple linear regression", short:'Multiple regression', context:"Predict condo prices from size, BTS distance, and age", cue:"Change one predictor at a time",
   story:"Large condos and condos near BTS can command higher prices for different reasons. To read the distance coefficient, hold room size and building age fixed.",
   prompt:"Change the distance to BTS. Keep the room size at 45 m² and building age at 10 years.",
   parts:[
    ["Combine predictors in one equation","ŷ = b₀ + b₁x₁ + b₂x₂ + …. The slope bⱼ is the change in ŷ for a one-unit increase in xⱼ with other predictors fixed. With an intercept, a categorical predictor with k levels uses k−1 dummy variables."],
    ["Use F for the overall model","F = MSR/MSE compares explained variation per degree of freedom with unexplained variation per degree of freedom. Significance F is the p-value for H₀ that all slopes are zero."],
    ["Read individual coefficients and model fit","Use each P-value to test a slope with t = bⱼ/SE(bⱼ). R² = 1−SSE/SST is the share of sample variation explained. Adjusted R² takes predictor count into account. VIF helps assess overlap among predictors."]
   ],
   example:"Predicted condo price in millions of baht is ŷ = 0.874 + 0.0562(size) − 0.0007(BTS distance) + 0.0021(age). For 100 extra metres, predicted price falls by 70,000 baht with size and age fixed.",
   tip:"F = 44.79. Significance F rounds to 0.0000. Size (p rounds to 0.000) and distance (p = 0.006) meet 0.05. Age (p = 0.863) does not.",
   check:["Which entry tells you whether building age is significant after controlling for the other predictors?", ['Significance F','R²',"P-value in the Building Age row"],2,"A predictor's row gives its own p-value while controlling for the other predictors."]
  }
];

const variants = [
  "When sampling without replacement and n is a large share of population N, multiply the SE by √[(N−n)/(N−1)]. As the sample approaches the whole population, sampling uncertainty falls.",
  "A Type I error rejects a true H₀. A Type II error fails to reject a false H₀. At α = 0.05, z cutoffs are ±1.96 for two tails and +1.645 or −1.645 for the chosen single tail.",
  "If ANOVA is significant and you need to identify pairs, use follow-up comparisons that control for multiple testing.",
  "For one categorical variable with expected proportions, use a chi-square goodness-of-fit test. Calculate Eᵢ = Npᵢ and sum (O−E)²/E over categories. With every proportion specified in advance, df = categories − 1.",
  "With an intercept, R² = 1 − SSE/SST. Pearson r describes direction and strength of a linear association. In simple regression with an intercept, R² = r².",
  "With ln(y) as the outcome, a one-unit increase in x gives a change of 100(eᵇ−1)%, approximately 100b% for small b. With ln(x) alone, a 1% increase in x changes ŷ by about b/100 units. In a log–log model, b is the elasticity."
];

const practice = [
  {title:"Did scores improve after tutoring?", lesson:2, context:"Eighteen students take a test before and after tutoring. Let d = after − before, with d̄ = 3.389 and sᵈ = 3.274. Use α = 0.05.",
   ask:"Choose the tail and calculate t.", choices:["Two-sided, t ≈ 4.39","Right-tailed, t ≈ 4.39","Left-tailed, t ≈ −4.39"], correct:1,
   steps:["H₀: μᵈ = 0. Hₐ: μᵈ > 0 because the question asks whether scores improved.","Use a right-tailed paired t-test with df = 18−1 = 17.","Set α = 0.05.","Reject H₀ when t > 1.740 or p ≤ 0.05.",'t = 3.389/(3.274/√18) ≈ 4.39',"Reject H₀. The data provide evidence that the mean score rose after tutoring."]},
  {title:"Do the two groups define success differently?", lesson:3, context:"Among women entrepreneurs with sales below 100,000 baht, 24 of 100 chose sales or profit as their measure of success. In the 100,000–500,000 baht group, 39 of 95 did. Use α = 0.01.",
   ask:"The question asks whether the rates differ. Given z ≈ 2.545, what should you conclude?", choices:["Two-sided p ≈ 0.00546. There is evidence of a difference.","p ≈ 0.01092. There is evidence of a difference.","p ≈ 0.01092. There is insufficient evidence of a difference."], correct:2,
   steps:["Group 1 is higher sales and group 2 is lower sales. H₀: p₁ = p₂ and Hₐ: p₁ ≠ p₂.","Use a two-sided two-proportion z-test at α = 0.01.","Pooled p̂ = (39+24)/(95+100) = 0.3231.",'z = (39/95−24/100)/√[0.3231(1−0.3231)(1/95+1/100)] ≈ 2.545',"Two-sided p ≈ 0.01092 > 0.01, so there is insufficient evidence of different proportions.","A right-tailed question specified in advance, asking whether the higher-sales group has a greater proportion, gives p ≈ 0.00546."]},
  {title:"Are the mean scores the same across three classes?", lesson:2, context:"The class summaries (n, mean, s) are (20, 17.59, 6.38), (19, 18.14, 6.25), and (21, 16.23, 4.96). Use α = 0.05.",
   ask:"Choose the test statistic and conclusion.", choices:["One-way ANOVA, F ≈ 0.566. There is insufficient evidence of differing means.","One-way ANOVA, F ≈ 0.566. All class means differ.","Paired t-test because the classes took the same exam."], correct:0,
   steps:["H₀: μ₁ = μ₂ = μ₃. Hₐ: The population means are not all equal.","Weighted grand mean = (20×17.59 + 19×18.14 + 21×16.23)/60 ≈ 17.288.","SS between ≈ 39.123 from Σnᵢ(x̄ᵢ−grand mean)². SS within ≈ 1968.541 from Σ(nᵢ−1)sᵢ².","With df = (2,57), F = (39.123/2)/(1968.541/57) ≈ 0.566.","p ≈ 0.571 > 0.05. There is insufficient evidence that the three mean scores differ."]},
  {title:"Is age group associated with platform choice?", lesson:3, context:"The 480 respondents are grouped by four platforms and three age bands. Use α = 0.05.",
   table:true, ask:"If age and platform are independent, what count is expected for Facebook users aged 12–34?", choices:['45','66','96'], correct:1,
   steps:["H₀: Age group and platform are independent. Hₐ: They are associated.","Use the chi-square test of independence at α = 0.05.","For Facebook and ages 12–34, E = 192×165/480 = 66. The contribution is (45−66)²/66 ≈ 6.68.","Sum all cell contributions: χ² ≈ 26.265, df = (4−1)(3−1) = 6.","p ≈ 0.000199 < 0.05. There is evidence of an association."]},
  {title:"How much do first-year students sleep on average?", lesson:0, context:"Sixty students report a mean of 6.83 hours per night with a sample SD of 1.33 hours. Find a 95% interval for the population mean.",
   ask:"Use t* ≈ 2.001 to find the interval.", choices:["About 5.50–8.16 hours","About 6.66–7.00 hours","About 6.49–7.17 hours"], correct:2,
   steps:["Use t because s estimates σ, with df = 60−1 = 59.",'SE = 1.33/√60 ≈ 0.1717',"Margin of error = 2.001×0.1717 ≈ 0.3436 hours.","6.83 ± 0.3436 gives about (6.49, 7.17) hours.","Under the sampling and inference assumptions, we are 95% confident that the target population mean sleep for first-year students is 6.49 to 7.17 hours per night."]},
  {title:"How much does the condo cost?", lesson:5, context:"The model uses 40 condos and predicts prices in millions of baht. F(3,36) = 44.79. Excel displays Significance F as 0.0000 because of rounding.",
   condo:true, ask:"Predict the price of a 45 m² unit, 300 metres from BTS, in a 10-year-old building.", choices:["3.214 million baht","3.424 million baht","3.634 million baht"], correct:0,
   steps:["(a) ŷ = 0.874 + 0.0562(size) − 0.0007(BTS distance) + 0.0021(age).","(b) Overall F tests whether all three slopes are zero. p is below 0.05, so reject H₀.","(c) Size and distance to BTS are significant at 0.05. Age has p = 0.863, which gives insufficient evidence that its slope differs from zero.","(d) With size and age fixed, one more metre lowers predicted price by 0.0007 million baht, or 700 baht.","(e) ŷ = 0.874 + 0.0562(45) − 0.0007(300) + 0.0021(10) = 3.214 million baht."]}
];

const social = {labels:['Facebook','Instagram','Pinterest','Twitter'], ages:['12–34','35–54','55+'], rows:[[45,87,60],[34,49,21],[38,31,15],[48,30,22]], totals:[165,197,118]};
