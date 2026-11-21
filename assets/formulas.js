'use strict';

const formulaGroups = ["Confidence intervals", "Hypothesis testing", "Comparing means", "Proportions and counts", "Simple regression", "Multiple regression"];
const formulaFormat = (value, digits = 4) => Number(value.toFixed(digits)).toString();
const formulaTotal = values => values.reduce((total, value) => total + value, 0);
const formulaMean = values => formulaTotal(values) / values.length;
const fnum = (label, value, limits = {}) => ({label, value, ...limits});
const flist = (label, value) => ({label, value, list:true});
const fcount = (label, value, min = 0) => fnum(label, value, {min, integer:true});
const fpos = (label, value) => fnum(label, value, {positive:true});
const fprob = (label, value) => fnum(label, value, {min:0, max:1});

const formulas = [
  {id:'ci-mean', group:0, name:"Confidence interval for a mean", keyword:'confidence interval t z SD SE', symbol:'x̄ ± c* × SD/√n',
   when:"Estimate a population mean as a range, such as average spending per meal.",
   memory:"Centre ± margin of error",
   why:"The sample mean is our starting point. It varies across random samples. The margin allows for that uncertainty and the confidence level you choose.",
   trap:"Use z* and σ when the population SD is known. When you estimate σ with s, use t* with df = n−1. Update the critical value when the confidence level or relevant degrees of freedom change.",
   question:"At a campus café, 25 meals cost an average of 60 baht with a sample SD of 10 baht. Find a 95% interval for the population mean.",
   fields:[fnum("Sample mean x̄",60), fpos("SD: enter s or σ as appropriate",10), fcount("Sample size n",25,2), fpos("Critical value c*",2.064)],
   calc([mean,sd,n,c]){
    const se = sd/Math.sqrt(n), margin = c*se;
    return [["Find the standard error of the mean",`SE = ${sd}/√${n} = ${formulaFormat(se)}`],
      ["Calculate the margin of error",`ME = ${c} × ${formulaFormat(se)} ≈ ${formulaFormat(margin)}`],
      ["Add and subtract the margin",`CI = ${mean} ± ${formulaFormat(margin)} ≈ (${formulaFormat(mean-margin)}, ${formulaFormat(mean+margin)}), in the original units.`]];
   }},
  {id:'ci-prop', group:0, name:"Confidence interval for a proportion", keyword:'proportion CI p-hat', symbol:'p̂ ± z*√[p̂(1−p̂)/n]',
   when:"Estimate the share of a population that would answer yes.",
   memory:"Count the yeses, divide by the total, then add and subtract a margin.",
   why:"Code yes as 1 and no as 0. Their average is the sample proportion. Its estimated per-response variance is p̂(1−p̂).",
   trap:"This normal approximation uses at least 10 observed successes and 10 observed failures.",
   question:"Sixty of 100 people choose a reusable cup. Estimate the population proportion with a 95% interval.",
   fields:[fcount("Yes responses x",60,0), fcount("Sample size n",100,1), fpos("Critical z value z*",1.96)],
   calc([x,n,c]){
    if (x<10 || n-x<10) throw Error("Enter at least 10 yes responses and 10 no responses. The number of yes responses cannot exceed the total.");
    const p=x/n, se=Math.sqrt(p*(1-p)/n), margin=c*se;
    return [["Turn the count into a proportion",`p̂ = ${x}/${n} = ${formulaFormat(p)}`],
      ["Calculate the SE and margin",`SE = √{${formulaFormat(p)}(1−${formulaFormat(p)})/${n}} ≈ ${formulaFormat(se)} and margin of error ≈ ${formulaFormat(margin)}.`],
      ["Express the interval as percentages",`Interval ≈ ${formulaFormat(100*(p-margin),2)}% to ${formulaFormat(100*(p+margin),2)}%.`]];
   }},
  {id:'one-mean', group:1, name:"One-sample test for a mean", keyword:'one sample z test t test', symbol:"t or z = (x̄ − μ₀)/(SD/√n)",
   when:"Test a claim about the mean of one population.",
   memory:"Observed estimate − reference value, divided by the standard error.",
   why:"The numerator measures the gap between the sample mean and the claim. Dividing by the SE expresses that gap in standard-error units.",
   trap:"Use z with known σ, or t with df = n−1 when using s. Choose the tail from Hₐ before seeing the result. Keep the sign from your subtraction.",
   question:"A shop claims the average wait is 8 minutes. For 25 orders, the mean wait is 9 minutes and s = 2.5 minutes. Calculate the test statistic.",
   fields:[fnum("Sample mean x̄",9),fnum("Mean claimed under H₀, μ₀",8),fpos("SD: enter s or σ as appropriate",2.5),fcount("Sample size n",25,2)],
   calc([mean,nullMean,sd,n]){
    const se=sd/Math.sqrt(n), stat=(mean-nullMean)/se;
    return [["Subtract the reference mean",`x̄ − μ₀ = ${mean} − (${nullMean}) = ${formulaFormat(mean-nullMean)}`],
      ["Find the SE",`SE = ${sd}/√${n} ≈ ${formulaFormat(se)}`],
      ["Divide and read the tail from Hₐ",`Test statistic ≈ ${formulaFormat(stat)}. With s, use t with df = ${n-1}. With known σ, use z. Then find p or compare with the critical value for the tail in Hₐ.`]];
   }},
  {id:'one-prop', group:1, name:"One-proportion z-test", keyword:'one proportion z test p null', symbol:'z = (p̂ − p₀)/√[p₀(1−p₀)/n]',
   when:"Test whether a population proportion differs from a claimed value.",
   memory:"Testing a claim? Use p₀ under the square root.",
   why:"Compare the sample proportion with the claim. Calculate the standard error as if the claimed proportion p₀ were true.",
   trap:"A test uses p₀ in the denominator. A confidence interval uses p̂. Here the expected counts under H₀ must be at least 10 for both outcomes.",
   question:"A club claims 50% of members use public transport. In a sample of 100, 62 do. Calculate z.",
   fields:[fcount("Yes responses x",62),fcount("Sample size n",100,1),fprob("Claimed proportion p₀ (decimal)",.5)],
   calc([x,n,p0]){
    if (x>n || n*p0<10 || n*(1-p0)<10) throw Error("Check that x ≤ n and that both expected counts, n×p₀ and n×(1−p₀), are at least 10.");
    const p=x/n, se=Math.sqrt(p0*(1-p0)/n);
    return [["Find the sample proportion",`p̂ = ${x}/${n} = ${formulaFormat(p)}`],
      ["Calculate SE under H₀",`SE = √[${p0}(1−${p0})/${n}] ≈ ${formulaFormat(se)}`],
      ["Express the difference as a z statistic",`z = (${formulaFormat(p)} − ${p0})/${formulaFormat(se)} ≈ ${formulaFormat((p-p0)/se)}. Find the p-value for the chosen tail or tails.`]];
   }},
  {id:'paired-t', group:2, name:'Paired t-test', keyword:"paired matched same person before after", symbol:'t = (d̄ − 0)/(sᵈ/√n)',
   when:"Use this when each value has a match, such as measurements before and after on the same person.",
   memory:"Same person? Subtract within each pair.",
   why:"Subtracting within each pair turns two columns into one list of differences. You then test the mean of that list.",
   trap:"n is the number of pairs. sᵈ is the SD of the differences. Read the sign in Hₐ from the order of subtraction stated in the question.",
   question:"For 16 students, the before-to-after gain has a mean of 1.80 points and an SD of 2.40.",
   fields:[fnum("Mean difference d̄",1.8),fpos("SD of the differences sᵈ",2.4),fcount("Number of pairs n",16,2)],
   calc([d,sd,n]){
    const se=sd/Math.sqrt(n);
    return [["Match and subtract","Calculate d = after − before for each pair. Then find d̄ and sᵈ from those differences."],
      ["Use the SD of the differences",`SE = ${sd}/√${n} = ${formulaFormat(se)}`],
      ["Compare the mean change with zero",`t = (${d} − 0)/${formulaFormat(se)} ≈ ${formulaFormat(d/se)}, df = ${n-1}`]];
   }},
  {id:'independent-t', group:2, name:'Independent t-test', keyword:'independent Welch pooled equal variance', symbol:"t = (x̄₁ − x̄₂)/SE of the difference",
   when:"Compare means from two independent groups.",
   memory:"Two separate groups? Subtract their sample means.",
   why:"Both independent means contribute uncertainty. Welch adds s₁²/n₁ and s₂²/n₂. The pooled method first estimates a common variance.",
   trap:"Use the pooled test when equal population variances are assumed. Welch can be used without that assumption.",
   question:"Two groups of 25 and 35 students report mean commutes of 37.72 and 17.80 minutes, respectively.",
   fields:[fnum("Group 1 mean",37.72),fpos("Group 1 SD",27.36),fcount("Group 1 sample size",25,2),
     fnum("Group 2 mean",17.8),fpos("Group 2 SD",8.93),fcount("Group 2 sample size",35,2),
     {label:"Variance method",value:'welch',options:[['welch',"Welch · separate variances"],['pooled',"Pooled · assume equal variances"]]}],
   calc([m1,s1,n1,m2,s2,n2,method]){
    const a=s1*s1/n1, b=s2*s2/n2, pooled=((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2);
    const equal=method==='pooled', se=Math.sqrt(equal ? pooled*(1/n1+1/n2) : a+b);
    const df=equal ? n1+n2-2 : (a+b)**2/(a*a/(n1-1)+b*b/(n2-1));
    return [["Subtract the two sample means",`x̄₁ − x̄₂ = ${formulaFormat(m1-m2)}`],
      ["Find the standard error of their difference",equal ? `sₚ² = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁+n₂−2) ≈ ${formulaFormat(pooled)}. Then SE = √[sₚ²(1/n₁+1/n₂)] ≈ ${formulaFormat(se)}.`
      : `SE = √(${s1}²/${n1} + ${s2}²/${n2}) ≈ ${formulaFormat(se)}`],
      ["Calculate t",`t ≈ ${formulaFormat((m1-m2)/se)}, df ≈ ${formulaFormat(df,2)}${equal ? '' : " using the Welch–Satterthwaite formula"}`]];
   }},
  {id:'anova', group:2, name:'One-way ANOVA', keyword:"ANOVA F MS SS weighted grand mean three groups", symbol:"F = MS between groups / MS within groups",
   when:"Test whether several independent population means are all equal.",
   memory:"Separation between groups ÷ spread within groups",
   why:"A gap between means is harder to distinguish when scores vary a lot within each group. Divide each sum of squares (SS) by its degrees of freedom to get a mean square (MS).",
   trap:"The standard test assumes independent observations, roughly normal scores within each population, and equal population variances. A significant result calls for follow-up comparisons to identify particular pairs.",
   question:"Three classes have 10, 15, and 15 students. Their mean scores are 60, 64, and 68, with an SD of 4 in each class.",
   fields:[flist("Group sizes n, separated by commas",'10, 15, 15'),flist("Group means",'60, 64, 68'),flist("Group SDs",'4, 4, 4')],
   calc([n,m,s]){
    if(n.length<2 || n.length!==m.length || n.length!==s.length || n.some(x=>!Number.isInteger(x)||x<2) || s.some(x=>x<0)) throw Error("Enter matching lists of sizes, means, and SDs for at least two groups. Sizes must be integers of at least 2, and SDs cannot be negative.");
    const k=n.length, count=formulaTotal(n), mean=formulaTotal(n.map((x,i)=>x*m[i]))/count;
    const ssb=formulaTotal(n.map((x,i)=>x*(m[i]-mean)**2));
    const ssw=formulaTotal(n.map((x,i)=>(x-1)*s[i]**2));
    const msb=ssb/(k-1), msw=ssw/(count-k);
    if (!msw) throw Error("At least one group needs a positive variance so F has a nonzero denominator.");
    return [["Weight each mean by its group size",`Grand mean = Σnᵢx̄ᵢ/N = ${formulaFormat(mean)}, using all ${count} observations.`],
      ["Split the variation into two parts",`SS between = Σnᵢ(x̄ᵢ−x̄ overall)² ≈ ${formulaFormat(ssb)}. SS within = Σ(nᵢ−1)sᵢ² ≈ ${formulaFormat(ssw)}.`],
      ["Divide by the degrees of freedom, then find F",`F = (SS between / ${k-1}) / (SS within / ${count-k}) ≈ ${formulaFormat(msb/msw)}.`]];
   }},
  {id:'two-prop', group:3, name:'Two-proportion z-test', keyword:"proportion z pooled p-hat two groups", symbol:"z = (p̂₁−p̂₂)/√[p̂ pooled(1−p̂ pooled)(1/n₁+1/n₂)]",
   when:"Compare yes rates in two independent groups.",
   memory:"Two groups, one pooled estimate under H₀.",
   why:"If H₀ says the population proportions are equal, combine the samples to estimate their common proportion for the SE.",
   trap:"Add both yes counts and divide by the combined sample size. Use two tails if the question asks whether the rates differ.",
   question:"In group A, 53 of 100 answer yes. In group B, 37 of 100 answer yes.",
   fields:[fcount("Group 1 yes responses",53),fcount("Group 1 sample size",100,1),fcount("Group 2 yes responses",37),fcount("Group 2 sample size",100,1)],
   calc([x1,n1,x2,n2]){
    const pooled=(x1+x2)/(n1+n2);
    if(x1>n1 || x2>n2 || [n1,n2].some(n=>n*pooled<10 || n*(1-pooled)<10)) throw Error("Check that yes counts do not exceed group sizes. Under H₀, each group needs at least 10 expected yes responses and 10 expected no responses.");
    const p1=x1/n1,p2=x2/n2,se=Math.sqrt(pooled*(1-pooled)*(1/n1+1/n2));
    return [["Calculate each group's sample proportion",`p̂₁ = ${formulaFormat(p1)}, p̂₂ = ${formulaFormat(p2)}`],
      ["Combine the counts before dividing",`Pooled p̂ = (${x1}+${x2})/(${n1}+${n2}) = ${formulaFormat(pooled)}.`],
      ["Use the SE to calculate z",`SE ≈ ${formulaFormat(se)} and z ≈ ${formulaFormat((p1-p2)/se)}.`]];
   }},
  {id:'chi-gof', group:3, name:'Chi-square Goodness-of-fit', keyword:'chi square goodness of fit observed expected', symbol:'χ² = Σ(O − E)²/E, Eᵢ = Npᵢ',
   when:"Compare the counts for one categorical variable with a specified set of proportions.",
   memory:"Expected count = total count × reference proportion.",
   why:"Use the reference proportions to get the counts expected in each category. Then combine the discrepancies between observed and expected counts.",
   trap:"Use counts in the chi-square statistic. This guide requires all expected counts to be at least 5.",
   question:"A sample of 100 orders contains 55, 30, and 15 orders of types A, B, and C. Compare with reference proportions of 0.5, 0.3, and 0.2.",
   fields:[flist("Observed counts O",'55, 30, 15'),flist("Reference proportions",'0.5, 0.3, 0.2')],
   calc([obs,prob]){
    if(obs.length<2 || obs.length!==prob.length || obs.some(x=>!Number.isInteger(x)||x<0) || prob.some(p=>p<=0||p>1) || Math.abs(formulaTotal(prob)-1)>1e-8) throw Error("Enter matching lists of nonnegative integer counts and positive proportions. The proportions must add to 1.");
    const exp=prob.map(p=>p*formulaTotal(obs));
    if(exp.some(x=>x<5)) throw Error("This approximation requires an expected count of at least 5 in every category.");
    const parts=obs.map((o,i)=>(o-exp[i])**2/exp[i]);
    return [["Find the expected counts",`E = N × p by category: ${exp.map(n=>formulaFormat(n)).join(', ')}.`],
      ["Calculate the contribution of each category",`(O−E)²/E by category: ${parts.map(n=>formulaFormat(n)).join(', ')}.`],
      ["Add the contributions and find df",`χ² ≈ ${formulaFormat(formulaTotal(parts))}, with df = ${obs.length-1} when all reference proportions are specified in advance.`]];
   }},
  {id:'chi-ind', group:3, name:'Chi-square Independence', keyword:"chi square independence cross-tabulation age platform", symbol:"E = row total × column total / grand total. χ² = Σ(O−E)²/E.",
   when:"Test whether two categorical variables are associated, such as time of day and payment method.",
   memory:"Find the expected count in each cell, then add the contributions.",
   why:"If the variables are independent, the overall share using a payment method applies to each time period. Multiply that share by the period's total for E.",
   trap:"Leave the total row and column out of the χ² sum. In a larger table, df = (rows−1)(columns−1).",
   question:"In the morning, 24 customers pay by QR and 12 by cash. In the afternoon, 16 pay by QR and 28 by cash.",
   fields:[fcount("Morning × QR",24),fcount("Morning × Cash",12),fcount("Afternoon × QR",16),fcount("Afternoon × Cash",28)],
   calc([a,b,c,d]){
    const total=a+b+c+d, obs=[a,b,c,d];
    const exp=[(a+b)*(a+c),(a+b)*(b+d),(c+d)*(a+c),(c+d)*(b+d)].map(n=>n/total);
    if(!total || exp.some(e=>e<5)) throw Error("This guide requires all four expected counts to be at least 5.");
    const parts=obs.map((o,i)=>(o-exp[i])**2/exp[i]);
    return [["Start at the margins of the table",`Row totals: ${a+b}, ${c+d}. Column totals: ${a+c}, ${b+d}. Grand total: ${total}.`],
      ["Calculate E for all four cells",`First cell: E = (${a+b}×${a+c})/${total} ≈ ${formulaFormat(exp[0])}. Other expected counts: ${exp.slice(1).map(n=>formulaFormat(n)).join(', ')}.`],
      ["Add the four contributions",`χ² = Σ(O−E)²/E ≈ ${formulaFormat(formulaTotal(parts))}, with df = 1 for a 2×2 table.`]];
   }},
  {id:'simple-regression', group:4, name:"Fit a simple linear regression line", keyword:'least squares OLS b0 b1 residual R2 Pearson r', symbol:'b₁ = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)², b₀ = ȳ−b₁x̄',
   when:"Use one predictor to estimate a numerical outcome with a straight line.",
   memory:"Slope first, intercept second. Observed minus predicted gives the residual.",
   why:"Ordinary least squares (OLS) minimises the sum of squared vertical gaps from the data points to the line. With an intercept, the line passes through (x̄, ȳ).",
   trap:"Identify x and y before calculating. Check residuals and model assumptions before drawing inferences. Predictions far outside the observed x range need extra care.",
   question:"A shop records promotion hours x and bookings y over four days. Predict bookings at x = 3, where the observed value is 11.",
   fields:[flist("List of x values",'1, 2, 3, 4'),flist("Matching list of y values",'5, 8, 11, 12'),fnum("x value for the prediction",3),fnum("Observed y at that x",11)],
   calc([x,y,target,actual]){
    if(x.length!==y.length || x.length<2) throw Error("Enter matching lists with at least two x–y pairs.");
    const mx=formulaMean(x),my=formulaMean(y);
    const sxx=formulaTotal(x.map(v=>(v-mx)**2)), sxy=formulaTotal(x.map((v,i)=>(v-mx)*(y[i]-my)));
    if(!sxx) throw Error("The x values need to vary to estimate a slope.");
    const b1=sxy/sxx,b0=my-b1*mx,pred=b0+b1*target;
    const sst=formulaTotal(y.map(v=>(v-my)**2)),sse=formulaTotal(y.map((v,i)=>(v-b0-b1*x[i])**2));
    return [["Find the centre and the slope",`x̄ = ${formulaFormat(mx)}, ȳ = ${formulaFormat(my)}; b₁ = ${formulaFormat(sxy)}/${formulaFormat(sxx)} ≈ ${formulaFormat(b1)}`],
      ["Find the intercept and write the fitted line",`b₀ = ȳ − b₁x̄ ≈ ${formulaFormat(b0)}; ŷ = ${formulaFormat(b0)} + (${formulaFormat(b1)})x`],
      ["Predict and check the residual",`At x = ${target}, ŷ ≈ ${formulaFormat(pred)} and residual = y − ŷ ≈ ${formulaFormat(actual-pred)}${sst ? ", with R² ≈ "+formulaFormat(1-sse/sst)+" (equal to r² in simple regression with an intercept)" : ''}.`]];
   }},
  {id:'regression-predict', group:5, name:"Predict with multiple regression", keyword:'multiple regression predict predict slope coefficient intercept', symbol:'ŷ = b₀ + b₁x₁ + b₂x₂ + b₃x₃',
   when:"Use known coefficients to predict an outcome from several predictors.",
   memory:"Start at the intercept. Add each coefficient times its predictor.",
   why:"Each term is a coefficient times a predictor value. To interpret one slope, change that predictor while holding the others fixed.",
   trap:"Check the original units and signs. For example, rent may be in thousands of baht and the walk may be measured in minutes.",
   question:"A rent model uses room size, minutes to the BTS, and floor number. Predict rent for 32 m², an 8-minute walk, and floor 7.",
   fields:[fnum('Intercept b₀',5.2),fnum("Size coefficient b₁",.18),fnum("Room size x₁",32),fnum("Walking-time coefficient b₂",-.35),fnum("Walking time x₂",8),fnum("Floor coefficient b₃",.12),fnum("Floor x₃",7)],
   calc([intercept,b1,x1,b2,x2,b3,x3]){
    const terms=[b1*x1,b2*x2,b3*x3];
    return [["Match each coefficient with its predictor",`Size term: ${formulaFormat(terms[0])}. Walking-time term: ${formulaFormat(terms[1])}. Floor term: ${formulaFormat(terms[2])}.`],
      ["Add the intercept",`ŷ = ${intercept} + (${terms.map(n=>formulaFormat(n)).join(') + (')}) = ${formulaFormat(intercept+formulaTotal(terms))} thousand baht.`],
      ["Interpret the walking-time slope",`For one extra minute of walking, with size and floor held fixed, predicted rent changes by ${b2} thousand baht, or ${formulaFormat(b2*1000)} baht.`]];
   }},
  {id:'regression-f', group:5, name:"Overall F test and R²", keyword:'regression overall F significance R square adjusted R2 ANOVA output', symbol:'F = (SSR/k)/(SSE/(n−k−1)), R² = SSR/(SSR+SSE)',
   when:"Test whether the predictors help as a group, and quantify how much variation the fitted model explains.",
   memory:"Overall evidence: F. Share of variation explained: R².",
   why:"SSR measures variation explained by the model. SSE measures variation left unexplained. F compares their mean squares. R² is the share of total variation explained in the sample.",
   trap:"Significance F is the p-value for testing all slopes jointly. Use each predictor's own p-value to test it individually.",
   question:"A regression with 50 rooms and 3 predictors gives SSR = 96 and SSE = 44.",
   fields:[fnum('SSR (SS Regression)',96,{min:0}),fpos('SSE (SS Residual)',44),fcount("Number of predictors k",3,1),fcount("Sample size n",50,3)],
   calc([ssr,sse,k,n]){
    const df=n-k-1;
    if(df<1) throw Error("Use n > k + 1 so that the residual degrees of freedom are positive.");
    const r2=ssr/(ssr+sse),adjusted=1-(1-r2)*(n-1)/df;
    return [["Convert the sums of squares to mean squares",`MSR = ${ssr}/${k} ≈ ${formulaFormat(ssr/k)}, MSE = ${sse}/${df} ≈ ${formulaFormat(sse/df)}`],
      ["Test the model as a whole",`F ≈ ${formulaFormat((ssr/k)/(sse/df))}, with df = (${k}, ${df}). Use the right-tail p-value, labelled Significance F in Excel.`],
      ["Report how well the model fits the sample",`R² ≈ ${formulaFormat(100*r2,2)}% and adjusted R² ≈ ${formulaFormat(100*adjusted,2)}% for the model with an intercept.`]];
   }},
  {id:'regression-t', group:5, name:"Test an individual coefficient", keyword:'regression coefficient individual t test P-value beta', symbol:'t = (bⱼ−0)/SE(bⱼ), df = n−k−1',
   when:"Test whether one predictor's slope differs from zero, holding the other predictors fixed.",
   memory:"One predictor? Read the p-value in its row.",
   why:"A coefficient is stronger evidence against zero when it is large relative to its standard error.",
   trap:"For simple regression, k = 1. In regression output, read the P-value column for the predictor you are testing.",
   question:"The slope for walking time is −0.35 thousand baht per minute, with SE = 0.12. The model uses 50 rooms and 3 predictors.",
   fields:[fnum("Estimated coefficient bⱼ",-.35),fpos("Standard error of the coefficient",.12),fcount("Number of predictors k",3,1),fcount("Sample size n",50,3)],
   calc([b,se,k,n]){
    if(n-k-1<1) throw Error("Use n > k + 1 so that the test has positive degrees of freedom.");
    return [["State the null hypothesis","H₀: This predictor's population slope is zero, holding the other predictors fixed."],
      ["Compare the estimate with its standard error",`t = (${b} − 0)/${se} ≈ ${formulaFormat(b/se)}, df = ${n-k-1}`],
      ["Read the evidence and interpret the units","Compare the predictor's p-value with α. Explain the change per unit of that predictor while holding the others fixed."]];
   }}
];

const formulaPractice = [
  ["An event organiser wants an interval estimate for the average wait in line.", 'ci-mean',['one-mean','ci-prop'],"Waiting time is numerical, and the goal is an interval for its mean."],
  ["Ask 120 students whether they use the shuttle. Estimate the proportion as an interval.", 'ci-prop',['ci-mean','two-prop'],"One sample answers yes or no, and the goal is an interval for a proportion."],
  ["A shop claims its average delivery time is 25 minutes. Test that claim using one sample.", 'one-mean',['ci-mean','paired-t'],"Compare one population mean with the value stated under H₀."],
  ["A club's goal is 60% participation. Does the actual signup proportion differ from 60%?", 'one-prop',['ci-prop','two-prop'],"Compare one population proportion with a fixed reference value."],
  ["The same students time themselves making a poster before and after learning a shortcut.", 'paired-t',['independent-t','anova'],"The two measurements belong to the same person, so calculate a difference for each person."],
  ["Compare exam scores from two classes with different students.", 'independent-t',['paired-t','two-prop'],"Scores are numerical. The two classes are independent groups."],
  ["Do three independent classes have the same average score?", 'anova',['independent-t','chi-ind'],"Compare more than two independent means at once."],
  ["Compare signup percentages between separate groups using two versions of an app.", 'two-prop',['independent-t','one-prop'],"The outcome is yes or no in two independent groups."],
  ["Compare counts for three menu items with the expected mix of 50%, 30%, and 20%.", 'chi-gof',['chi-ind','anova'],"One categorical variable is being compared with specified proportions."],
  ["Is age group associated with choice of platform?", 'chi-ind',['chi-gof','anova'],"Age group and platform are two categorical variables."],
  ["Fit a line that predicts foot length from arm length.", 'simple-regression',['regression-predict','regression-f'],"Use one predictor to fit a line to paired numerical observations."],
  ["The rent equation and coefficients are given. Predict the rent for a room with a specified size and distance.", 'regression-predict',['regression-f','regression-t'],"Substitute predictor values to obtain a prediction."],
  ["Do the predictors jointly improve the model over an intercept-only model?", 'regression-f',['regression-t','regression-predict'],"The overall F test checks all slopes together."],
  ["Is walking distance a significant predictor of rent after controlling for room size?", 'regression-t',['regression-f','regression-predict'],"Test the slope for one predictor while holding the other fixed."]
];

const formulaVariants = {
  'ci-mean': {values:[72,12,36,2.03], ask:"What is the margin of error?", answer:4.06, tolerance:.01},
  'ci-prop': {values:[36,80,1.96], ask:"What is the margin of error? Enter a decimal, such as 0.123.", answer:.10902, tolerance:.002},
  'one-mean': {values:[52,50,8,64], ask:"Find t using the sample SD.", answer:2, tolerance:.01},
  'one-prop': {values:[55,100,.60], ask:"Find z, including its sign.", answer:-1.02062, tolerance:.015},
  'paired-t': {values:[-1.25,2.5,25], ask:"Find t, including its sign.", answer:-2.5, tolerance:.01},
  'independent-t': {values:[40,6,36,38,8,64,'welch'], ask:"Calculate Welch's t.", answer:Math.SQRT2, tolerance:.015},
  'anova': {values:['12, 12, 12','7, 8, 9','2, 2, 2'], ask:"Calculate F for the three groups.", answer:3, tolerance:.01},
  'two-prop': {values:[44,80,36,90], ask:"Find z using group 1 minus group 2.", answer:1.95576, tolerance:.015},
  'chi-gof': {values:['40, 32, 28','0.5, 0.3, 0.2'], ask:"Sum χ² across all three categories.", answer:5.33333, tolerance:.02},
  'chi-ind': {values:[30,10,20,40], ask:"Sum χ² across all four cells.", answer:16.66667, tolerance:.03},
  'simple-regression': {values:['1, 2, 3, 4','4, 7, 8, 11',3,9], ask:"Predict ŷ at x = 3.", answer:8.6, tolerance:.01},
  'regression-predict': {values:[4,.20,30,-.40,5,.10,3], ask:"What is the predicted value in thousands of baht?", answer:8.3, tolerance:.01},
  'regression-f': {values:[60,30,2,33], ask:"Find F for the overall model.", answer:30, tolerance:.02},
  'regression-t': {values:[.48,.20,2,33], ask:"Find t for the individual coefficient.", answer:2.4, tolerance:.01}
};
