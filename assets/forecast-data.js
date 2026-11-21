'use strict';

const forecastQuestions = [
  {
    title:"Did the shortcut make checking faster?",
    preview:"The same students check a file before and after learning a shortcut. Does the average time fall? Define d = after − before.",
    methods:["Paired t-test, left-tailed","Paired t-test, right-tailed","Independent-samples t-test, two-sided"], method:0, lesson:2,
    context:"Twenty-five students check a file before and after learning a shortcut. Define d = time after − time before. The mean difference is −2.70 minutes and its SD is 4.50 minutes. Test whether the average time decreases at α = 0.05.",
    fields:[
      {prompt:"a. Calculate the SE of the mean difference (minutes).",value:.9,tolerance:.01},
      {prompt:"b. Calculate t, including its sign.",value:-3,tolerance:.02},
      {prompt:"c. Choose a conclusion.",options:["There is insufficient evidence that the average time decreased.","There is evidence that the average time decreased after training.","There is evidence that the average time increased after training."],correct:1}
    ],
    steps:[
      ["Choose the test and its tail","Each student was measured twice, so use a paired t-test. A shorter time after training means d < 0, so use the left tail."],
      ["State the hypotheses","H₀: μᵈ = 0 and Hₐ: μᵈ < 0. Use α = 0.05 and df = 25 − 1 = 24."],
      ["Find the standard error","SE = 4.50/√25 = 0.90 minutes."],
      ["Calculate t and read the p-value","t = (−2.70 − 0)/0.90 = −3.00. The left-tail p-value is about 0.00310."],
      ["Write the conclusion","p < 0.05, so reject H₀. The data provide evidence that the average checking time fell after training."]
    ]
  },
  {
    title:"Do the signup rates differ?",
    preview:"Two independent groups see different email signup pages, one with pictures and one with text. Do their signup rates differ?",
    methods:["Independent-samples t-test, two-sided","Two-proportion z-test, two-sided","One-proportion z-test, right-tailed"], method:1, lesson:3,
    context:"On the picture-based page, 44 of 80 visitors sign up. On the text-based page, 31 of 80 sign up. The groups are independent. Test for a difference in signup rates at α = 0.05. Use the picture-based page as group 1.",
    fields:[
      {prompt:"a. Find the pooled proportion under H₀. Give at least three decimal places.",value:.46875,tolerance:.001},
      {prompt:"b. Calculate z using group 1 minus group 2.",value:2.05951,tolerance:.02},
      {prompt:"c. Choose the p-value and conclusion.",options:["Two-sided p ≈ 0.0197. There is evidence that signup rates differ.","p ≈ 0.0394. There is insufficient evidence that signup rates differ.","Two-sided p ≈ 0.0394. There is evidence that signup rates differ."],correct:2}
    ],
    steps:[
      ["Choose the test and its tails","Compare the yes rates in two independent groups. The question asks whether they differ, so use a two-sided two-proportion z-test."],
      ["Calculate the sample and pooled proportions","p̂₁ = 44/80 = 0.55 and p̂₂ = 31/80 = 0.3875. Under H₀: p₁ = p₂, the pooled estimate is (44 + 31)/(80 + 80) = 0.46875."],
      ["Find the SE under H₀",'SE = √[0.46875(1−0.46875)(1/80+1/80)] ≈ 0.07890'],
      ["Calculate z and conclude","z = (0.55 − 0.3875)/0.07890 ≈ 2.06. The two-sided p-value is about 0.0394, below 0.05, so there is evidence of a difference in signup rates."]
    ]
  },
  {
    title:"Do the three prototypes score equally?",
    preview:"Each tester rates just one of three prototypes. Are the three population mean ratings all equal?",
    methods:['Paired t-test','Chi-square Independence','One-way ANOVA'], method:2, lesson:2,
    context:"Test whether mean ratings differ among prototypes A, B, and C at α = 0.05. Assume independent observations, roughly normal scores within each population, and equal population variances.",
    data:[["Prototype",'n',"Mean rating",'s'],[['A',12,18,4],['B',18,22,3],['C',15,20,5]]],
    fields:[
      {prompt:"a. Calculate the weighted grand mean.",value:20.2667,tolerance:.015},
      {prompt:"b. Calculate F.",value:3.61237,tolerance:.03},
      {prompt:"c. Choose a conclusion if p ≈ 0.0357.",options:["There is evidence that the means are not all equal.","There is evidence that every pair differs.","There is insufficient evidence of a difference in mean scores."],correct:0}
    ],
    steps:[
      ["Choose a method and state H₀","Compare three independent means with one-way ANOVA. H₀: μA = μB = μC."],
      ["Find the grand mean","There are 45 people. The grand mean is (12×18 + 18×22 + 15×20)/45 ≈ 20.2667."],
      ["Split the sum of squares","SS between = Σnᵢ(x̄ᵢ−x̄ overall)² = 116.80. SS within = 11×4² + 17×3² + 14×5² = 679."],
      ["Divide each SS by its degrees of freedom","Between-group df = 2 and within-group df = 42. F = (116.80/2)/(679/42) ≈ 3.61."],
      ["Write the conclusion","p ≈ 0.0357 < 0.05. There is evidence that the means are not all equal. Use follow-up comparisons to find which pairs differ."]
    ]
  },
  {
    title:"Does year of study relate to how people heard about the event?",
    preview:"Students report their year of study and the first channel through which they heard about an event. Each student names one channel. Are the variables associated?",
    methods:['Chi-square Goodness-of-fit','Chi-square Independence','One-way ANOVA'], method:1, lesson:3,
    context:"The organisers survey 120 students. They group the students by year and classify each student's first source of information. Test for an association at α = 0.05.",
    data:[["First source","First year","Second year or later","Total"],[["Social media",32,12,44],["Friend referral",20,22,42],["Campus poster",8,26,34],["Total",60,60,120]]],
    fields:[
      {prompt:"a. If the two variables are independent, how many first-year students would you expect to hear about the event on social media?",value:22,tolerance:.02},
      {prompt:"b. Calculate χ² using the six data cells.",value:18.71556,tolerance:.07},
      {prompt:"c. Choose the degrees of freedom and conclusion.",options:["df = 3. There is evidence of an association.","df = 2. There is insufficient evidence of an association.","df = 2. There is evidence that study year is associated with the first source."],correct:2}
    ],
    steps:[
      ["Choose the test and state H₀","Both variables are categorical. Use the chi-square test of independence. H₀: the two variables are independent."],
      ["Find the expected counts","E = row total × column total ÷ grand total. The first cell gives 44×60/120 = 22. For the three rows, the two cells in each row have expected counts of 22, 21, and 17, respectively."],
      ["Add the cell contributions","The first cell contributes (32−22)²/22 ≈ 4.55. Sum (O−E)²/E over all six cells to get χ² ≈ 18.72."],
      ["Find df and write the conclusion","df = (3−1)(2−1) = 2 and p ≈ 0.0000863 < 0.05. There is evidence that study year is associated with the first source."]
    ]
  },
  {
    title:"What range could contain the average weight of a boxed lunch?",
    preview:"A random sample of lunch boxes gives a sample mean and SD. Estimate the population mean with a confidence interval. The population SD is unknown.",
    methods:["A z confidence interval for a proportion","A one-sample t-test against 500 grams","A t confidence interval for a mean"], method:2, lesson:0,
    context:"Thirty-six independent lunch boxes have a mean weight of 485 grams and s = 24 grams. The population SD σ is unknown. Find a 95% confidence interval using t* = 2.030.",
    fields:[
      {prompt:"a. Lower bound (grams).",value:476.88,tolerance:.04},
      {prompt:"b. Upper bound (grams).",value:493.12,tolerance:.04},
      {prompt:"c. Choose the correct interpretation.",options:["We are 95% confident that the population mean weight lies in the interval.","Ninety-five percent of individual boxes weigh within this interval.","There is a 95% chance that the next box weighs within the interval."],correct:0}
    ],
    steps:[
      ["Choose the right interval","The target is the population mean. We estimate σ with s, so use a t interval with df = 36−1 = 35."],
      ["Find the standard error and margin","SE = 24/√36 = 4 grams. The margin of error is 2.030×4 = 8.12 grams."],
      ["Build both endpoints","485 ± 8.12 gives (476.88, 493.12) grams."],
      ["Interpret the interval","We are 95% confident that the target population's mean lunch-box weight is between 476.88 and 493.12 grams."]
    ]
  },
  {
    title:"What will the booth earn on event day?",
    preview:"Predict sales from opening hours, the number of nearby shops, and online promotion. Assess each predictor while holding the others fixed.",
    methods:['Simple Linear Regression','Multiple Linear Regression','One-way ANOVA'], method:1, lesson:5,
    context:"Data from 35 booths predict daily sales in thousands of baht. Promotion = 1 for online promotion and 0 otherwise. The ANOVA table gives SS Regression = 180 with 3 df and SS Residual = 75 with 31 df. Use α = 0.05.",
    data:[["Variable",'Coefficient','p-value'],[['Intercept','2.40','0.019'],["Opening hours",'0.75','0.001'],["Nearby shops",'−0.18','0.041'],['Promotion','1.20','0.083']]],
    fields:[
      {prompt:"a. Calculate F for the overall model.",value:24.8,tolerance:.08},
      {prompt:"b. Which predictors are individually significant?",options:["Opening hours and Promotion","All three predictors","Opening hours and nearby shops"],correct:2},
      {prompt:"c. How many baht does predicted sales revenue change for one extra nearby shop, holding other predictors fixed? Include the sign.",value:-180,tolerance:.05},
      {prompt:"d. Predict sales (thousands of baht) for a booth open 6 hours with 5 nearby shops and online promotion.",value:7.2,tolerance:.025}
    ],
    steps:[
      ["Write the prediction equation","With three predictors, use multiple linear regression. ŷ = 2.40 + 0.75(hours) − 0.18(nearby shops) + 1.20(Promotion)."],
      ["Test the overall model","F = (180/3)/(75/31) = 24.80 with df = (3,31). Since p < 0.001, reject H₀ that all three slopes equal zero."],
      ["Read the individual tests","Opening hours (p = 0.001) and nearby shops (p = 0.041) meet the 0.05 threshold. Promotion has p = 0.083."],
      ["Interpret the slope and units","One extra nearby shop lowers predicted revenue by 0.18 thousand baht, or 180 baht, holding opening hours and promotion fixed."],
      ["Substitute and predict","With Promotion = 1, ŷ = 2.40 + 0.75×6 − 0.18×5 + 1.20×1 = 7.20 thousand baht, or 7,200 baht."]
    ]
  }
];
