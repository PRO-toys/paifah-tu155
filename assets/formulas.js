'use strict';

const formulaGroups = ['ช่วงความเชื่อมั่น', 'ทดสอบสมมติฐาน', 'ค่าเฉลี่ยหลายกลุ่ม', 'สัดส่วนและตารางนับ', 'ถดถอยอย่างง่าย', 'ถดถอยพหุคูณ'];
const formulaFormat = (value, digits = 4) => Number(value.toFixed(digits)).toString();
const formulaTotal = values => values.reduce((total, value) => total + value, 0);
const formulaMean = values => formulaTotal(values) / values.length;
const fnum = (label, value, limits = {}) => ({label, value, ...limits});
const flist = (label, value) => ({label, value, list:true});
const fcount = (label, value, min = 0) => fnum(label, value, {min, integer:true});
const fpos = (label, value) => fnum(label, value, {positive:true});
const fprob = (label, value) => fnum(label, value, {min:0, max:1});

const formulas = [
  {id:'ci-mean', group:0, name:'CI ของค่าเฉลี่ย', keyword:'confidence interval t z SD SE', symbol:'x̄ ± c* × SD/√n',
   when:'อยากประมาณค่าเฉลี่ยประชากรเป็นช่วง เช่น ค่าอาหารเฉลี่ยต่อมื้อ',
   memory:'จุดกลาง ± ระยะเผื่อ',
   why:'ค่าเฉลี่ยตัวอย่างเป็นจุดกลาง แต่เปลี่ยนได้เมื่อสุ่มใหม่ เราเผื่อระยะตามความแกว่งของค่าเฉลี่ยและระดับความเชื่อมั่นที่ต้องการ',
   trap:'รู้ σ ใช้ z* และ σ ถ้าประมาณ σ ด้วย s ใช้ t* ที่ df = n−1 ช่องค่าวิกฤตในตัวอย่างใช้ t* จากตารางสำหรับ 95% และ n = 25 ต้องเปลี่ยนเมื่อเปลี่ยน df หรือระดับความเชื่อมั่น',
   question:'ร้านมหาวิทยาลัยสำรวจค่าอาหาร 25 มื้อ ค่าเฉลี่ย 60 บาท และ SD ตัวอย่าง 10 บาท ต้องการช่วง 95%',
   fields:[fnum('ค่าเฉลี่ย x̄',60), fpos('SD, ใช้ s หรือ σ ให้ตรงกับวิธี',10), fcount('จำนวนข้อมูล n',25,2), fpos('ค่าวิกฤต c* จากตาราง',2.064)],
   calc([mean,sd,n,c]){
    const se = sd/Math.sqrt(n), margin = c*se;
    return [['หาความแกว่งของค่าเฉลี่ย',`SE = ${sd}/√${n} = ${formulaFormat(se)}`],
      ['แปลงเป็นระยะเผื่อ',`ME = ${c} × ${formulaFormat(se)} ≈ ${formulaFormat(margin)}`],
      ['เดินออกจากจุดกลางสองข้าง',`CI = ${mean} ± ${formulaFormat(margin)} ≈ (${formulaFormat(mean-margin)}, ${formulaFormat(mean+margin)}) หน่วยเดียวกับข้อมูล`]];
   }},
  {id:'ci-prop', group:0, name:'CI ของสัดส่วน', keyword:'proportion CI p-hat', symbol:'p̂ ± z*√[p̂(1−p̂)/n]',
   when:'อยากประมาณว่าในประชากรมีคนตอบ “ใช่” กี่เปอร์เซ็นต์',
   memory:'นับใช่ หารทั้งหมด แล้วเผื่อสองข้าง',
   why:'คำตอบใช่/ไม่ใช่แทนด้วย 1/0 ได้ ค่าเฉลี่ยจึงเป็นสัดส่วน และ p̂(1−p̂) ประมาณความแปรปรวนของคำตอบ 1/0',
   trap:'สูตรประมาณด้วยปกติเหมาะเมื่อจำนวนใช่และไม่ใช่มากพอ ตัวช่วยนี้ใช้เกณฑ์อย่างละอย่างน้อย 10',
   question:'สำรวจ 100 คน มี 60 คนเลือกซื้อแก้วใช้ซ้ำ ประมาณสัดส่วนที่ระดับ 95%',
   fields:[fcount('ตอบใช่ x',60,0), fcount('จำนวนทั้งหมด n',100,1), fpos('ค่าวิกฤต z*',1.96)],
   calc([x,n,c]){
    if (x<10 || n-x<10) throw Error('สำหรับสูตรนี้ จำนวนตอบใช่และไม่ใช่ต้องอย่างละอย่างน้อย 10 และ x ต้องไม่เกิน n');
    const p=x/n, se=Math.sqrt(p*(1-p)/n), margin=c*se;
    return [['แปลงจำนวนคนเป็นสัดส่วน',`p̂ = ${x}/${n} = ${formulaFormat(p)}`],
      ['หา SE และระยะเผื่อ',`SE = √[${formulaFormat(p)}(1−${formulaFormat(p)})/${n}] ≈ ${formulaFormat(se)} และ ME ≈ ${formulaFormat(margin)}`],
      ['สร้างช่วงแล้วอ่านเป็นเปอร์เซ็นต์',`ช่วง ≈ ${formulaFormat(100*(p-margin),2)}% ถึง ${formulaFormat(100*(p+margin),2)}%`]];
   }},
  {id:'one-mean', group:1, name:'ทดสอบค่าเฉลี่ยหนึ่งกลุ่ม', keyword:'one sample z test t test', symbol:'t หรือ z = (x̄ − μ₀)/(SD/√n)',
   when:'ถามว่าค่าเฉลี่ยของประชากรหนึ่งกลุ่มต่างจากค่าที่กำหนดไหม',
   memory:'เอาค่าที่เจอ ลบค่าที่อ้าง แล้วหารความแกว่ง',
   why:'ค่าเศษคือระยะที่ผลสำรวจอยู่ห่างจากข้ออ้าง ตัวหารเปลี่ยนระยะเป็นหน่วย SE เพื่อเทียบกับการแจกแจงอ้างอิง',
   trap:'รู้ σ ใช้ z ถ้าใช้ s ให้ใช้ t และ df = n−1 ต้องเลือกหางจาก Hₐ ก่อนดูผล เครื่องหมายของสถิติขึ้นกับลำดับการลบ',
   question:'ร้านอ้างว่ารอเฉลี่ย 8 นาที สำรวจ 25 ออเดอร์พบเฉลี่ย 9 นาที และ s = 2.5 นาที คำนวณสถิติทดสอบ',
   fields:[fnum('ค่าเฉลี่ย x̄',9),fnum('ค่าอ้างใน H₀, μ₀',8),fpos('SD, ใช้ s หรือ σ ให้ตรงกับวิธี',2.5),fcount('จำนวนข้อมูล n',25,2)],
   calc([mean,nullMean,sd,n]){
    const se=sd/Math.sqrt(n), stat=(mean-nullMean)/se;
    return [['ลบค่าอ้างอิง',`x̄ − μ₀ = ${mean} − (${nullMean}) = ${formulaFormat(mean-nullMean)}`],
      ['หา SE',`SE = ${sd}/√${n} ≈ ${formulaFormat(se)}`],
      ['หารและเลือกหางตามคำถาม',`สถิติทดสอบ ≈ ${formulaFormat(stat)} ใช้ t ที่ df = ${n-1} ถ้าใช้ s หรือ z ถ้ารู้ σ แล้วอ่าน p หรือเปรียบเทียบค่าวิกฤตตาม Hₐ`]];
   }},
  {id:'one-prop', group:1, name:'ทดสอบสัดส่วนหนึ่งกลุ่ม', keyword:'one proportion z test p null', symbol:'z = (p̂ − p₀)/√[p₀(1−p₀)/n]',
   when:'ถามว่าสัดส่วนตอบ “ใช่” ของประชากรต่างจากเปอร์เซ็นต์ที่อ้างไหม',
   memory:'ทดสอบข้ออ้าง ใช้ p₀ ใต้ราก',
   why:'เราวัดว่าผลสำรวจห่างจากข้ออ้างเท่าไร โดยหาความแกว่งจากโลกสมมติที่ข้ออ้าง p₀ เป็นจริง',
   trap:'ในตัวหารใช้ p₀ ส่วน CI ของสัดส่วนใช้ p̂ ตัวช่วยใช้เกณฑ์จำนวนคาดหมายใช่และไม่ใช่อย่างละอย่างน้อย 10',
   question:'ชมรมอ้างว่าสมาชิก 50% ใช้รถสาธารณะ สำรวจ 100 คน พบว่าใช้ 62 คน คำนวณ z',
   fields:[fcount('ตอบใช่ x',62),fcount('จำนวนทั้งหมด n',100,1),fprob('สัดส่วนอ้างอิง p₀ (ทศนิยม)',.5)],
   calc([x,n,p0]){
    if (x>n || n*p0<10 || n*(1-p0)<10) throw Error('ตรวจว่า x ไม่เกิน n และจำนวนที่คาด n×p₀ กับ n×(1−p₀) อย่างละอย่างน้อย 10');
    const p=x/n, se=Math.sqrt(p0*(1-p0)/n);
    return [['หาสัดส่วนจากข้อมูล',`p̂ = ${x}/${n} = ${formulaFormat(p)}`],
      ['หา SE ภายใต้ H₀',`SE = √[${p0}(1−${p0})/${n}] ≈ ${formulaFormat(se)}`],
      ['แปลงความต่างเป็น z',`z = (${formulaFormat(p)} − ${p0})/${formulaFormat(se)} ≈ ${formulaFormat((p-p0)/se)} แล้วอ่าน p ตามหางที่เลือก`]];
   }},
  {id:'paired-t', group:2, name:'Paired t-test', keyword:'paired matched before after คนเดิม', symbol:'t = (d̄ − 0)/(sᵈ/√n)',
   when:'วัดคนเดิมสองครั้ง หรือข้อมูลสองฝั่งจับคู่ไว้แล้ว',
   memory:'คนเดิม ลบทีละคน',
   why:'หลังลบทีละคู่ ข้อมูลสองคอลัมน์เหลือหนึ่งชุด คือผลต่าง d จึงใช้แนวคิดเดียวกับทดสอบค่าเฉลี่ยหนึ่งกลุ่ม',
   trap:'n นับจำนวนคู่ ส่วน sᵈ เป็น SD ของผลต่าง อ่านทิศของ Hₐ จากลำดับการลบก่อน–หลังที่โจทย์กำหนด',
   question:'นักศึกษา 16 คนทดสอบก่อน–หลัง ได้ผลต่างหลังลบก่อนเฉลี่ย 1.80 คะแนน และ SD ของผลต่าง 2.40',
   fields:[fnum('ผลต่างเฉลี่ย d̄',1.8),fpos('SD ของผลต่าง sᵈ',2.4),fcount('จำนวนคู่ n',16,2)],
   calc([d,sd,n]){
    const se=sd/Math.sqrt(n);
    return [['จับคู่และลบ','กำหนด d = หลัง − ก่อนให้เหมือนกันทุกคู่ แล้วสรุปเป็น d̄ กับ sᵈ'],
      ['ใช้ SD ของผลต่างเท่านั้น',`SE = ${sd}/√${n} = ${formulaFormat(se)}`],
      ['เทียบการเปลี่ยนแปลงกับศูนย์',`t = (${d} − 0)/${formulaFormat(se)} ≈ ${formulaFormat(d/se)}, df = ${n-1}`]];
   }},
  {id:'independent-t', group:2, name:'Independent t-test', keyword:'independent Welch pooled equal variance', symbol:'t = (x̄₁ − x̄₂)/SE ของผลต่าง',
   when:'เทียบค่าเฉลี่ยของคนสองกลุ่มที่เป็นอิสระต่อกัน',
   memory:'สองทีม หาค่าเฉลี่ยแต่ละทีมก่อนลบ',
   why:'ค่าเฉลี่ยทั้งสองกลุ่มแกว่งได้ เมื่อเป็นอิสระ ความแปรปรวนของผลต่างมาจากทั้งสองฝั่ง Welch รวม s₁²/n₁ กับ s₂²/n₂ ส่วน pooled รวมความแปรปรวนประชากรที่ถือว่าเท่ากันก่อน',
   trap:'เลือก pooled เมื่อสมมติความแปรปรวนเท่ากัน โจทย์ทั่วไปที่สมมตินี้ไม่ได้กำหนดสามารถใช้ Welch ได้',
   question:'เทียบเวลาเดินทางสองกลุ่ม ตัวอย่าง 25 และ 35 คน ค่าเฉลี่ย 37.72 และ 17.80 นาที ตามลำดับ',
   fields:[fnum('ค่าเฉลี่ยกลุ่ม 1',37.72),fpos('SD กลุ่ม 1',27.36),fcount('จำนวนกลุ่ม 1',25,2),
     fnum('ค่าเฉลี่ยกลุ่ม 2',17.8),fpos('SD กลุ่ม 2',8.93),fcount('จำนวนกลุ่ม 2',35,2),
     {label:'สูตรความแปรปรวน',value:'welch',options:[['welch','Welch · แยกความแปรปรวน'],['pooled','Pooled · สมมติเท่ากัน']]}],
   calc([m1,s1,n1,m2,s2,n2,method]){
    const a=s1*s1/n1, b=s2*s2/n2, pooled=((n1-1)*s1*s1+(n2-1)*s2*s2)/(n1+n2-2);
    const equal=method==='pooled', se=Math.sqrt(equal ? pooled*(1/n1+1/n2) : a+b);
    const df=equal ? n1+n2-2 : (a+b)**2/(a*a/(n1-1)+b*b/(n2-1));
    return [['ลบค่าเฉลี่ยสองกลุ่ม',`x̄₁ − x̄₂ = ${formulaFormat(m1-m2)}`],
      ['หาความแกว่งของผลต่าง',equal ? `sₚ² = [(n₁−1)s₁² + (n₂−1)s₂²]/(n₁+n₂−2) ≈ ${formulaFormat(pooled)} แล้ว SE = √[sₚ²(1/n₁+1/n₂)] ≈ ${formulaFormat(se)}`
      : `SE = √(${s1}²/${n1} + ${s2}²/${n2}) ≈ ${formulaFormat(se)}`],
      ['คำนวณ t',`t ≈ ${formulaFormat((m1-m2)/se)}, df ≈ ${formulaFormat(df,2)}${equal ? '' : ' ตามสูตร Welch–Satterthwaite'}`]];
   }},
  {id:'anova', group:2, name:'One-way ANOVA', keyword:'anova F MS SS weighted mean 3 กลุ่ม', symbol:'F = MS ระหว่างกลุ่ม / MS ภายในกลุ่ม',
   when:'ถามว่าค่าเฉลี่ยของหลายกลุ่มอิสระเท่ากันทั้งหมดหรือไม่',
   memory:'ห่างระหว่างทีม หารความแกว่งในทีม',
   why:'ถ้าค่าเฉลี่ยห้องห่างกัน แต่คะแนนในแต่ละห้องกระจายมาก ความห่างนั้นอาจยังเล็กเมื่อเทียบกับความแกว่ง ให้เปลี่ยน SS เป็น MS ด้วย df ก่อนเทียบ',
   trap:'สมมติกลุ่มอิสระ การแจกแจงในกลุ่มใกล้ปกติ และความแปรปรวนเท่ากัน ผลมีนัยสำคัญบอกว่าค่าเฉลี่ยต่างกันอย่างน้อยหนึ่งคู่ ต้องทดสอบรายคู่เพิ่มเพื่อระบุคู่',
   question:'สามห้องมีนักศึกษา 10, 15, 15 คน ค่าเฉลี่ย 60, 64, 68 และ SD ห้องละ 4 คะแนน',
   fields:[flist('จำนวน n ของแต่ละห้อง (คั่นด้วยจุลภาค)','10, 15, 15'),flist('ค่าเฉลี่ยของแต่ละห้อง','60, 64, 68'),flist('SD ของแต่ละห้อง','4, 4, 4')],
   calc([n,m,s]){
    if(n.length<2 || n.length!==m.length || n.length!==s.length || n.some(x=>!Number.isInteger(x)||x<2) || s.some(x=>x<0)) throw Error('กรอก n, ค่าเฉลี่ย และ SD ให้ครบทุกกลุ่ม ใช้อย่างน้อย 2 กลุ่ม n ต้องเป็นจำนวนเต็มตั้งแต่ 2 และ SD ต้องไม่ติดลบ');
    const k=n.length, count=formulaTotal(n), mean=formulaTotal(n.map((x,i)=>x*m[i]))/count;
    const ssb=formulaTotal(n.map((x,i)=>x*(m[i]-mean)**2));
    const ssw=formulaTotal(n.map((x,i)=>(x-1)*s[i]**2));
    const msb=ssb/(k-1), msw=ssw/(count-k);
    if (!msw) throw Error('ต้องมีความแปรปรวนภายในอย่างน้อยหนึ่งกลุ่มเพื่อหารหา F');
    return [['ถ่วงค่าเฉลี่ยตามจำนวนคน',`x̄ รวม = Σnᵢx̄ᵢ/N = ${formulaFormat(mean)} จากคนทั้งหมด ${count} คน`],
      ['แยกความแกว่งเป็นสองกอง',`SS ระหว่าง = Σnᵢ(x̄ᵢ−x̄รวม)² ≈ ${formulaFormat(ssb)} ส่วน SS ภายใน = Σ(nᵢ−1)sᵢ² ≈ ${formulaFormat(ssw)}`],
      ['หารแต่ละกองด้วย df แล้วหา F',`F = (SS ระหว่าง/${k-1})/(SS ภายใน/${count-k}) ≈ ${formulaFormat(msb/msw)}`]];
   }},
  {id:'two-prop', group:3, name:'Two-proportion z-test', keyword:'proportion z pooled p-hat สองสัดส่วน', symbol:'z = (p̂₁−p̂₂)/√[p̂รวม(1−p̂รวม)(1/n₁+1/n₂)]',
   when:'เทียบสัดส่วนคำตอบ “ใช่” ของสองกลุ่มอิสระ',
   memory:'สองสัดส่วน เทียบด้วยฐานรวม',
   why:'H₀ ว่าสัดส่วนเท่ากัน เราจึงใช้ข้อมูลทั้งสองกลุ่มช่วยกันประมาณสัดส่วนเดียวเพื่อหา SE',
   trap:'รวมจำนวนตอบใช่แล้วหารด้วยจำนวนคนทั้งหมด คำว่า “ต่างไหม” ใช้สองหาง',
   question:'คนกลุ่ม A ตอบใช่ 53 จาก 100 คน กลุ่ม B ตอบใช่ 37 จาก 100 คน',
   fields:[fcount('ตอบใช่กลุ่ม 1',53),fcount('จำนวนกลุ่ม 1',100,1),fcount('ตอบใช่กลุ่ม 2',37),fcount('จำนวนกลุ่ม 2',100,1)],
   calc([x1,n1,x2,n2]){
    const pooled=(x1+x2)/(n1+n2);
    if(x1>n1 || x2>n2 || [n1,n2].some(n=>n*pooled<10 || n*(1-pooled)<10)) throw Error('ตรวจจำนวนตอบใช่ และให้จำนวนคาดหมายใช่/ไม่ใช่ภายใต้ H₀ อย่างละอย่างน้อย 10 ในแต่ละกลุ่ม');
    const p1=x1/n1,p2=x2/n2,se=Math.sqrt(pooled*(1-pooled)*(1/n1+1/n2));
    return [['หาเปอร์เซ็นต์ของแต่ละกลุ่ม',`p̂₁ = ${formulaFormat(p1)}, p̂₂ = ${formulaFormat(p2)}`],
      ['รวมยอดก่อนหาร',`p̂รวม = (${x1}+${x2})/(${n1}+${n2}) = ${formulaFormat(pooled)}`],
      ['แทน SE แล้วคำนวณ z',`SE ≈ ${formulaFormat(se)} และ z ≈ ${formulaFormat((p1-p2)/se)}`]];
   }},
  {id:'chi-gof', group:3, name:'Chi-square Goodness-of-fit', keyword:'chi square goodness of fit observed expected', symbol:'χ² = Σ(O − E)²/E, Eᵢ = Npᵢ',
   when:'มีข้อมูลหมวดหมู่ตัวแปรเดียว และมีสัดส่วนอ้างอิงให้เทียบ',
   memory:'รู้สัดส่วนเป้าหมาย คูณยอดรวมเพื่อหา E',
   why:'คำนวณจำนวนที่ควรเห็นในแต่ละหมวดจากสัดส่วนอ้างอิง แล้วรวมความคลาดเคลื่อนแบบสัมพัทธ์ทุกหมวด',
   trap:'ใช้จำนวนคนหรือสิ่งของในสูตร χ² ส่วนสัดส่วนเอาไว้สร้าง E ตัวช่วยใช้เกณฑ์ E ทุกช่องอย่างน้อย 5',
   question:'สุ่มออเดอร์ 100 รายการ พบแพ็กเกจ A/B/C 55, 30, 15 รายการ ต้องการเทียบกับสัดส่วนกำหนด 0.5, 0.3, 0.2',
   fields:[flist('จำนวนที่พบในแต่ละหมวด O','55, 30, 15'),flist('สัดส่วนที่อ้างในแต่ละหมวด','0.5, 0.3, 0.2')],
   calc([obs,prob]){
    if(obs.length<2 || obs.length!==prob.length || obs.some(x=>!Number.isInteger(x)||x<0) || prob.some(p=>p<=0||p>1) || Math.abs(formulaTotal(prob)-1)>1e-8) throw Error('กรอกจำนวนเต็มไม่ติดลบและสัดส่วนให้ครบทุกหมวด สัดส่วนต้องรวมกันเป็น 1');
    const exp=prob.map(p=>p*formulaTotal(obs));
    if(exp.some(x=>x<5)) throw Error('ตัวอย่างนี้ใช้การประมาณ χ² เมื่อจำนวนที่คาดทุกหมวดอย่างน้อย 5');
    const parts=obs.map((o,i)=>(o-exp[i])**2/exp[i]);
    return [['สร้างจำนวนที่คาด',`E = N × p ในแต่ละหมวด ได้ ${exp.map(n=>formulaFormat(n)).join(', ')}`],
      ['หาผลของแต่ละช่อง',`(O−E)²/E ของแต่ละหมวด = ${parts.map(n=>formulaFormat(n)).join(', ')}`],
      ['บวกแล้วหา df',`χ² ≈ ${formulaFormat(formulaTotal(parts))}, df = ${obs.length-1} เมื่อสัดส่วนถูกกำหนดล่วงหน้าทั้งหมด`]];
   }},
  {id:'chi-ind', group:3, name:'Chi-square Independence', keyword:'chi square independence ตารางไขว้ age platform', symbol:'E = ยอดแถว × ยอดคอลัมน์ / ยอดทั้งหมด, χ² = Σ(O−E)²/E',
   when:'ถามว่าตัวแปรหมวดหมู่สองตัวสัมพันธ์กันไหม เช่น ช่วงเวลาและวิธีชำระเงิน',
   memory:'ตารางไขว้ หา E ทีละช่อง แล้วบวกทุกช่อง',
   why:'ถ้าสองตัวแปรเป็นอิสระ สัดส่วนวิธีจ่ายในแต่ละช่วงเวลาควรใกล้ภาพรวม เอาสัดส่วนภาพรวมคูณจำนวนลูกค้าของช่วงนั้นจะได้ E',
   trap:'ไม่เอายอดรวมมาเป็นช่องของ χ² ในตารางใหญ่ใช้วิธีเดียวกันและ df = (จำนวนแถว−1)(จำนวนคอลัมน์−1)',
   question:'ช่วงเช้าจ่าย QR 24 คน จ่ายสด 12 คน ช่วงบ่ายจ่าย QR 16 คน จ่ายสด 28 คน',
   fields:[fcount('เช้า × QR',24),fcount('เช้า × เงินสด',12),fcount('บ่าย × QR',16),fcount('บ่าย × เงินสด',28)],
   calc([a,b,c,d]){
    const total=a+b+c+d, obs=[a,b,c,d];
    const exp=[(a+b)*(a+c),(a+b)*(b+d),(c+d)*(a+c),(c+d)*(b+d)].map(n=>n/total);
    if(!total || exp.some(e=>e<5)) throw Error('ตัวอย่างนี้ต้องมีจำนวนที่คาดหมายอย่างน้อย 5 ทุกช่อง');
    const parts=obs.map((o,i)=>(o-exp[i])**2/exp[i]);
    return [['เริ่มจากขอบตาราง',`ยอดรวมแถว = ${a+b}, ${c+d} ยอดรวมคอลัมน์ = ${a+c}, ${b+d} และยอดทั้งหมด = ${total}`],
      ['หา E ทั้งสี่ช่อง',`E ช่องแรก = (${a+b}×${a+c})/${total} ≈ ${formulaFormat(exp[0])} ตามด้วย ${exp.slice(1).map(n=>formulaFormat(n)).join(', ')}`],
      ['รวมความต่างที่ปรับขนาดแล้ว',`χ² = Σ(O−E)²/E ≈ ${formulaFormat(formulaTotal(parts))}, df = 1 สำหรับตาราง 2×2`]];
   }},
  {id:'simple-regression', group:4, name:'สร้างเส้น Simple Regression', keyword:'least squares OLS b0 b1 residual R2 Pearson r', symbol:'b₁ = Σ(x−x̄)(y−ȳ)/Σ(x−x̄)², b₀ = ȳ−b₁x̄',
   when:'ใช้ตัวแปรตัวเดียวทำนายผลลัพธ์เชิงตัวเลขด้วยเส้นตรง',
   memory:'ชันก่อน ตัดแกนทีหลัง จริงลบทายคือ residual',
   why:'เส้น OLS เลือกสัมประสิทธิ์ให้ผลรวมกำลังสองของระยะแนวตั้งจากจุดจริงถึงเส้นต่ำสุด เส้นที่มี intercept วิ่งผ่านจุด (x̄, ȳ)',
   trap:'อย่าสลับ x กับ y หรือทำนายไกลนอกช่วงข้อมูลโดยไม่ตรวจเงื่อนไข สำหรับการอนุมานให้ตรวจ residual และสมมติฐานของโมเดล',
   question:'ร้านทดลองเวลาโปรโมต x ชั่วโมง กับยอดจอง y รายการ 4 วัน ลองทำนายเมื่อ x = 3 และยอดจริงเป็น 11',
   fields:[flist('รายการ x','1, 2, 3, 4'),flist('รายการ y ตามลำดับคู่','5, 8, 11, 12'),fnum('x ที่ต้องการทำนาย',3),fnum('y จริงที่ x นี้',11)],
   calc([x,y,target,actual]){
    if(x.length!==y.length || x.length<2) throw Error('ใส่ x และ y ให้จำนวนเท่ากันและมีอย่างน้อยสองคู่');
    const mx=formulaMean(x),my=formulaMean(y);
    const sxx=formulaTotal(x.map(v=>(v-mx)**2)), sxy=formulaTotal(x.map((v,i)=>(v-mx)*(y[i]-my)));
    if(!sxx) throw Error('ค่า x ต้องมีมากกว่าหนึ่งค่าเพื่อหาเส้น');
    const b1=sxy/sxx,b0=my-b1*mx,pred=b0+b1*target;
    const sst=formulaTotal(y.map(v=>(v-my)**2)),sse=formulaTotal(y.map((v,i)=>(v-b0-b1*x[i])**2));
    return [['วางจุดกลางและหาความชัน',`x̄ = ${formulaFormat(mx)}, ȳ = ${formulaFormat(my)}; b₁ = ${formulaFormat(sxy)}/${formulaFormat(sxx)} ≈ ${formulaFormat(b1)}`],
      ['หา intercept และเขียนเส้น',`b₀ = ȳ − b₁x̄ ≈ ${formulaFormat(b0)}; ŷ = ${formulaFormat(b0)} + (${formulaFormat(b1)})x`],
      ['ทำนายและตรวจค่าคลาดเคลื่อน',`ที่ x = ${target} ได้ ŷ ≈ ${formulaFormat(pred)}, residual = y − ŷ ≈ ${formulaFormat(actual-pred)}${sst ? ' และ R² ≈ '+formulaFormat(1-sse/sst)+', เท่ากับ r² ใน simple regression ที่มี intercept' : ''}`]];
   }},
  {id:'regression-predict', group:5, name:'ทำนายด้วย Multiple Regression', keyword:'multiple regression predict predict slope coefficient intercept', symbol:'ŷ = b₀ + b₁x₁ + b₂x₂ + b₃x₃',
   when:'มีค่าสัมประสิทธิ์แล้วและต้องการทำนายจากตัวแปรหลายตัว',
   memory:'ตั้งต้นที่ intercept แล้วบวกผลทีละตัว',
   why:'แต่ละพจน์คือค่าสัมประสิทธิ์คูณค่าตัวแปร เมื่อแปลความชัน ให้ขยับตัวนั้นเพียงตัวเดียวและคงตัวอื่นไว้',
   trap:'เช็กหน่วยก่อนคำนวณ เช่น ราคาเป็นพันบาท และระยะอาจเป็นเมตรหรือนาที เครื่องหมายลบต้องตามสัมประสิทธิ์เดิม',
   question:'โมเดลค่าเช่าหน่วยพันบาทใช้ขนาดห้อง เวลาเดินถึงรถไฟฟ้า และชั้น ทำนายห้องขนาด 32 ตร.ม. เดิน 8 นาที ชั้น 7',
   fields:[fnum('Intercept b₀',5.2),fnum('b₁ ของขนาด',.18),fnum('ขนาด x₁',32),fnum('b₂ ของเวลาเดิน',-.35),fnum('เวลาเดิน x₂',8),fnum('b₃ ของชั้น',.12),fnum('ชั้น x₃',7)],
   calc([intercept,b1,x1,b2,x2,b3,x3]){
    const terms=[b1*x1,b2*x2,b3*x3];
    return [['จับคู่ β กับ x ของตัวแปรเดียวกัน',`พจน์จากขนาด = ${formulaFormat(terms[0])}, เวลาเดิน = ${formulaFormat(terms[1])}, ชั้น = ${formulaFormat(terms[2])}`],
      ['รวมกับค่าเริ่มต้น',`ŷ = ${intercept} + (${terms.map(n=>formulaFormat(n)).join(') + (')}) = ${formulaFormat(intercept+formulaTotal(terms))} พันบาท`],
      ['อ่านความชันของเวลาเดิน',`เมื่อเพิ่มเวลาเดิน 1 นาทีและคงขนาดกับชั้นไว้ ค่าทำนายเปลี่ยน ${b2} พันบาท หรือ ${formulaFormat(b2*1000)} บาท`]];
   }},
  {id:'regression-f', group:5, name:'Overall F และ R²', keyword:'regression overall F significance R square adjusted R2 ANOVA output', symbol:'F = (SSR/k)/(SSE/(n−k−1)), R² = SSR/(SSR+SSE)',
   when:'ถามว่าทั้งโมเดลมีนัยสำคัญไหม และอธิบายความแปรปรวนได้เท่าไร',
   memory:'ทั้งโมเดลดู F ความพอดีดู R²',
   why:'SSR วัดส่วนที่โมเดลอธิบายได้ SSE วัดส่วนที่ยังทายพลาด F เทียบสองส่วนหลังหารด้วย df ส่วน R² เป็นสัดส่วนที่อธิบายได้จากความแปรปรวนทั้งหมด',
   trap:'Significance F คือ p ของการทดสอบความชันพร้อมกัน ผลมีนัยสำคัญไม่ได้บอกว่าทุกตัวแปรมีนัยสำคัญ',
   question:'ผลถดถอยจาก 50 ห้อง ใช้ 3 ตัวทำนาย ได้ SSR = 96 และ SSE = 44',
   fields:[fnum('SSR (SS Regression)',96,{min:0}),fpos('SSE (SS Residual)',44),fcount('จำนวนตัวทำนาย k',3,1),fcount('จำนวนข้อมูล n',50,3)],
   calc([ssr,sse,k,n]){
    const df=n-k-1;
    if(df<1) throw Error('ต้องมี n มากกว่า k + 1 เพื่อเหลือ df ของส่วนคลาดเคลื่อน');
    const r2=ssr/(ssr+sse),adjusted=1-(1-r2)*(n-1)/df;
    return [['หา Mean Square',`MSR = ${ssr}/${k} ≈ ${formulaFormat(ssr/k)}, MSE = ${sse}/${df} ≈ ${formulaFormat(sse/df)}`],
      ['เทียบทั้งโมเดล',`F ≈ ${formulaFormat((ssr/k)/(sse/df))}, df = (${k}, ${df}) นำไปหา p หรืออ่าน Significance F`],
      ['รายงานความพอดีในตัวอย่าง',`R² ≈ ${formulaFormat(100*r2,2)}% และ Adjusted R² ≈ ${formulaFormat(100*adjusted,2)}% สำหรับโมเดลที่มี intercept`]];
   }},
  {id:'regression-t', group:5, name:'ทดสอบสัมประสิทธิ์รายตัว', keyword:'regression coefficient individual t test P-value beta', symbol:'t = (bⱼ−0)/SE(bⱼ), df = n−k−1',
   when:'ถามว่าตัวทำนายตัวนี้มีความชันต่างจากศูนย์ไหม เมื่อคุมตัวอื่นในโมเดล',
   memory:'ถามรายตัว เปิด p ของแถวนั้น',
   why:'ความชันที่ใหญ่จะมีน้ำหนักมากขึ้นเมื่อประมาณได้แม่น ตัวหารจึงใช้ SE ของความชันของตัวแปรนั้น',
   trap:'ใช้ได้กับ simple regression เมื่อ k = 1 ด้วย อ่านคอลัมน์ P-value ของตัวทำนายเมื่อทดสอบรายตัว',
   question:'ความชันเวลาเดินคือ −0.35 พันบาทต่อหนึ่งนาที มี SE = 0.12 จากข้อมูล 50 ห้องและตัวทำนาย 3 ตัว',
   fields:[fnum('สัมประสิทธิ์ bⱼ',-.35),fpos('SE ของสัมประสิทธิ์',.12),fcount('จำนวนตัวทำนาย k',3,1),fcount('จำนวนข้อมูล n',50,3)],
   calc([b,se,k,n]){
    if(n-k-1<1) throw Error('ต้องมี n มากกว่า k + 1 เพื่อคำนวณ df');
    return [['ระบุพารามิเตอร์','H₀: ความชันประชากรของตัวทำนายนี้เท่ากับ 0 เมื่อคุมตัวแปรอื่น'],
      ['เทียบค่าประมาณกับความไม่แน่นอน',`t = (${b} − 0)/${se} ≈ ${formulaFormat(b/se)}, df = ${n-k-1}`],
      ['ดูหลักฐานแล้วอ่านหน่วย','อ่าน p จากแถวของตัวทำนาย เทียบกับ α แล้วอธิบายความชันต่อหนึ่งหน่วยเมื่อคงตัวอื่นไว้']];
   }}
];

const formulaPractice = [
  ['ผู้จัดงานอยากประมาณเวลาเฉลี่ยที่ผู้ร่วมงานรอคิวเป็นช่วง', 'ci-mean',['one-mean','ci-prop'],'ผลที่ต้องการเป็นช่วง และข้อมูลเป็นนาที'],
  ['ถามนักศึกษา 120 คนว่าใช้รถรับส่งหรือไม่ อยากประมาณสัดส่วนเป็นช่วง', 'ci-prop',['ci-mean','two-prop'],'มีหนึ่งกลุ่มและต้องการช่วงของคำตอบใช่/ไม่ใช่'],
  ['ร้านอ้างว่าใช้เวลาจัดส่งเฉลี่ย 25 นาที คุณต้องการตรวจข้ออ้างจากตัวอย่างหนึ่งชุด', 'one-mean',['ci-mean','paired-t'],'เทียบค่าเฉลี่ยหนึ่งกลุ่มกับค่าอ้างใน H₀'],
  ['สโมสรตั้งเป้า 60% ของสมาชิกสมัครกิจกรรม อยากทดสอบว่าสัดส่วนจริงต่างจาก 60% ไหม', 'one-prop',['ci-prop','two-prop'],'เทียบหนึ่งสัดส่วนกับค่าอ้างที่กำหนด'],
  ['ให้นักศึกษาคนเดิมจับเวลาทำโปสเตอร์ก่อนและหลังเรียนทางลัด', 'paired-t',['independent-t','anova'],'เวลาสองค่าวัดจากคนเดียวกัน จึงใช้ผลต่างทีละคู่'],
  ['เปรียบเทียบคะแนนสอบของสองห้องที่มีนักศึกษาคนละชุด', 'independent-t',['paired-t','two-prop'],'คะแนนเป็นตัวเลขและสองห้องเป็นกลุ่มอิสระ'],
  ['ถามว่าคะแนนเฉลี่ยนักศึกษาจากห้องเรียนสามห้องเท่ากันทั้งหมดไหม', 'anova',['independent-t','chi-ind'],'ตรวจค่าเฉลี่ยพร้อมกันมากกว่าสองกลุ่ม'],
  ['เทียบเปอร์เซ็นต์ผู้กดสมัครรับข่าวระหว่างผู้ใช้แอปสองรุ่นที่เป็นคนละกลุ่ม', 'two-prop',['independent-t','one-prop'],'เปรียบเทียบคำตอบใช่/ไม่ใช่ของสองกลุ่มอิสระ'],
  ['เทียบยอดสั่งเมนู 3 แบบกับสัดส่วนที่ร้านคาดไว้ 50%, 30%, 20%', 'chi-gof',['chi-ind','anova'],'มีตัวแปรหมวดเดียวเทียบกับสัดส่วนที่กำหนด'],
  ['ถามว่าช่วงวัยสัมพันธ์กับแพลตฟอร์มที่เลือกใช้หรือไม่', 'chi-ind',['chi-gof','anova'],'ช่วงวัยและแพลตฟอร์มเป็นตัวแปรหมวดสองตัว'],
  ['มีความยาวแขนและความยาวเท้าของแต่ละคน ต้องการเส้นทำนายความยาวเท้าจากความยาวแขน', 'simple-regression',['regression-predict','regression-f'],'หาเส้นจากข้อมูลดิบโดยใช้ตัวทำนายตัวเดียว'],
  ['มีสมการค่าเช่ากับค่าสัมประสิทธิ์ครบ และต้องการราคาของห้องขนาดและระยะที่ระบุ', 'regression-predict',['regression-f','regression-t'],'โจทย์ให้แทนค่าเพื่อทำนายผลลัพธ์'],
  ['อยากรู้ว่าตัวทำนายทั้งหมดร่วมกันมีหลักฐานว่าโมเดลดีกว่าใช้ intercept อย่างเดียวไหม', 'regression-f',['regression-t','regression-predict'],'ทดสอบความชันของทุกตัวพร้อมกัน'],
  ['ในโมเดลค่าเช่า อยากรู้ว่าระยะเดินมีนัยสำคัญไหมเมื่อคุมขนาดห้อง', 'regression-t',['regression-f','regression-predict'],'ทดสอบความชันรายตัวเมื่อคุมตัวทำนายอื่น']
];

const formulaVariants = {
  'ci-mean': {values:[72,12,36,2.03], ask:'ระยะเผื่อ ME เท่ากับเท่าไร?', answer:4.06, tolerance:.01},
  'ci-prop': {values:[36,80,1.96], ask:'ระยะเผื่อ ME เท่ากับเท่าไร? ตอบเป็นทศนิยม เช่น 0.123', answer:.10902, tolerance:.002},
  'one-mean': {values:[52,50,8,64], ask:'หาค่าสถิติ t เมื่อใช้ SD ตัวอย่าง', answer:2, tolerance:.01},
  'one-prop': {values:[55,100,.60], ask:'หาค่า z โดยคงเครื่องหมาย', answer:-1.02062, tolerance:.015},
  'paired-t': {values:[-1.25,2.5,25], ask:'หาค่า t โดยคงเครื่องหมาย', answer:-2.5, tolerance:.01},
  'independent-t': {values:[40,6,36,38,8,64,'welch'], ask:'คำนวณ t ของ Welch', answer:Math.SQRT2, tolerance:.015},
  'anova': {values:['12, 12, 12','7, 8, 9','2, 2, 2'], ask:'คำนวณ F ของสามกลุ่ม', answer:3, tolerance:.01},
  'two-prop': {values:[44,80,36,90], ask:'หาค่า z ของกลุ่ม 1 ลบกลุ่ม 2', answer:1.95576, tolerance:.015},
  'chi-gof': {values:['40, 32, 28','0.5, 0.3, 0.2'], ask:'รวม χ² จากทั้งสามหมวด', answer:5.33333, tolerance:.02},
  'chi-ind': {values:[30,10,20,40], ask:'รวม χ² ทั้งสี่ช่อง', answer:16.66667, tolerance:.03},
  'simple-regression': {values:['1, 2, 3, 4','4, 7, 8, 11',3,9], ask:'จงหาค่าที่ทำนาย ŷ เมื่อ x = 3', answer:8.6, tolerance:.01},
  'regression-predict': {values:[4,.20,30,-.40,5,.10,3], ask:'ค่าที่ทำนาย ŷ เป็นกี่พันบาท?', answer:8.3, tolerance:.01},
  'regression-f': {values:[60,30,2,33], ask:'หาค่า F ของโมเดลโดยรวม', answer:30, tolerance:.02},
  'regression-t': {values:[.48,.20,2,33], ask:'หาค่า t ของสัมประสิทธิ์รายตัว', answer:2.4, tolerance:.01}
};
