'use strict';

const gammaLanczos = [676.5203681218851,-1259.1392167224028,771.3234287776531,-176.6150291621406,12.507343278686905,-.13857109526572012,.000009984369578019572,.00000015056327351493116];
function logGammaPositive(shape) {
  const z=shape-1, t=z+7.5;
  const series=gammaLanczos.reduce((total,coefficient,i)=>total+coefficient/(z+i+1),.9999999999998099);
  return .5*Math.log(2*Math.PI)+(z+.5)*Math.log(t)-t+Math.log(series);
}

function gammaUpperTail(a,x) {
  if (x===0) return 1;
  const scale=Math.exp(a*Math.log(x)-x-logGammaPositive(a));
  if (x<a+1) {
    let term=1/a, total=term;
    for(let j=1;j<=1000;j++) {
      term*=x/(a+j);
      total+=term;
      if(term<=total*1e-14) break;
    }
    return 1-total*scale;
  }
  // Continued fraction for the upper tail avoids cancellation for small p.
  let b=x+1-a,c=1e300,d=1/b,fraction=d;
  for(let j=1;j<=1000;j++) {
    const numerator=j*(a-j);
    b+=2;
    d=1/(b+numerator*d);
    c=b+numerator/c;
    const ratio=c*d;
    fraction*=ratio;
    if(Math.abs(ratio-1)<1e-14) break;
  }
  return scale*fraction;
}

function betaContinuedFraction(a,b,x) {
  const keepNonzero=value=>Math.abs(value)<1e-300 ? (value<0 ? -1e-300 : 1e-300) : value;
  let c=1,d=1/keepNonzero(1-(a+b)*x/(a+1)), fraction=d;
  for(let j=1;j<=1000;j++) {
    let part=j*(b-j)*x/((a+2*j-1)*(a+2*j));
    d=1/keepNonzero(1+part*d);
    c=keepNonzero(1+part/c);
    fraction*=c*d;
    part=-(a+j)*(a+b+j)*x/((a+2*j)*(a+2*j+1));
    d=1/keepNonzero(1+part*d);
    c=keepNonzero(1+part/c);
    const ratio=c*d;
    fraction*=ratio;
    if(Math.abs(ratio-1)<1e-14) break;
  }
  return fraction;
}

function betaLowerTail(x,a,b) {
  if(x<=0 || x>=1) return x<=0 ? 0 : 1;
  if(x>(a+1)/(a+b+2)) return 1-betaLowerTail(1-x,b,a);
  const scale=Math.exp(logGammaPositive(a+b)-logGammaPositive(a)-logGammaPositive(b)+a*Math.log(x)+b*Math.log1p(-x));
  return scale*betaContinuedFraction(a,b,x)/a;
}

function tailProbability(kind, stat, leftDF, rightDF, tail) {
  let p;
  if (kind==='chi') p=gammaUpperTail(leftDF/2,stat/2);
  else if (kind==='f') p=betaLowerTail(rightDF/(rightDF+leftDF*stat),rightDF/2,leftDF/2);
  else {
    const half=(kind==='z' ? gammaUpperTail(.5,stat*stat/2) : betaLowerTail(leftDF/(leftDF+stat*stat),leftDF/2,.5))/2;
    p=tail==='two' ? 2*half : ((stat>=0)===(tail==='right')) ? half : 1-half;
  }
  return Math.min(1,Math.max(0,p));
}

function renderPValue(box) {
  box.innerHTML = `<article class="panel formula-panel">
    <p class="kicker">อ่านผลหลังคำนวณสถิติ</p><h1>p-value ไปทางไหน?</h1>
    <p class="scene">ค่า p คือโอกาสเห็นสถิติสุดโต่งเท่านี้หรือกว่านั้น ถ้า H₀ จริงและกำหนด “สุดโต่ง” ให้ตรงกับคำถาม</p>
    <div class="formula-patterns"><div><strong>ต่างกันไหม?</strong><p>ใช้สองหาง</p><small>Hₐ ใช้ ≠</small></div><div><strong>มากขึ้นไหม?</strong><p>ใช้หางขวา</p><small>Hₐ ใช้ &gt;</small></div><div><strong>ลดลงไหม?</strong><p>ใช้หางซ้าย</p><small>Hₐ ใช้ &lt;</small></div></div>
    <div class="formula-memory"><span>คำจำ</span><strong>กำหนดหางก่อนดูค่าที่ได้ แล้วเทียบ p กับ α</strong></div>
    <form id="p-form">
      <div class="formula-filters formula-inputs">
        <label>สถิติอ้างอิง<select id="p-kind"><option value="t">t · ค่าเฉลี่ยและสัมประสิทธิ์</option><option value="z">z · สัดส่วนหรือรู้ σ</option><option value="f">F · ANOVA / Regression</option><option value="chi">χ² · จำนวนในหมวดหมู่</option></select></label>
        <label>ค่าสถิติที่คำนวณได้<input id="p-stat" type="text" inputmode="text" maxlength="24" value="1.79"></label>
        <label id="p-df-a">df (ตัวแรกสำหรับ F)<input id="p-df1" type="text" inputmode="decimal" maxlength="12" value="54"></label>
        <label id="p-df-b" hidden>df ตัวส่วนของ F<input id="p-df2" type="text" inputmode="numeric" maxlength="12" value="46"></label>
        <label id="p-tail-label">หางตาม Hₐ<select id="p-tail"><option value="two">สองหาง · ต่างกัน</option><option value="right">ขวา · มากกว่า</option><option value="left">ซ้าย · น้อยกว่า</option></select></label>
        <label>เกณฑ์ α<input id="p-alpha" type="text" inputmode="decimal" maxlength="12" value="0.05"></label>
      </div>
      <p class="muted" id="p-tail-note" hidden>F และ χ² ใช้หางขวา เพราะค่าสถิติที่ใหญ่มากให้หลักฐานต่อ H₀ มากขึ้น</p>
      <div class="actions"><button type="submit" class="button primary">คำนวณและแปลผล</button></div>
      <div id="p-result" role="status"></div>
    </form>
    <p class="tip">เทียบ p ก่อนปัดเศษ ถ้า p ≤ α ใช้คำว่า “ปฏิเสธ H₀” แล้วสรุปเป็นภาษาโจทย์ ถ้า p &gt; α ใช้ “หลักฐานยังไม่พอ”</p>
    <div class="actions"><a class="button quiet" href="#formulas">กลับห้องสูตร</a><a class="button quiet" href="#lesson-1">ดูบททดสอบสมมติฐาน</a></div>
  </article>`;
  const kind = get('p-kind');
  kind.addEventListener('change', () => {
    const type = kind.value;
    get('p-df-a').hidden = type==='z';
    get('p-df-b').hidden = type!=='f';
    get('p-tail-label').hidden = type==='f'||type==='chi';
    get('p-tail-note').hidden = !get('p-tail-label').hidden;
    get('p-result').textContent = '';
    get('p-result').className = '';
  });
  for (const field of box.querySelectorAll('#p-form input, #p-tail')) field.addEventListener('input', () => {
    get('p-result').textContent = '';
    get('p-result').className = '';
  });
  get('p-form').addEventListener('submit', event => {
    event.preventDefault();
    const type=kind.value, result=get('p-result');
    const stat=mockNumber(get('p-stat').value), df1=mockNumber(get('p-df1').value);
    const df2=mockNumber(get('p-df2').value), alpha=mockNumber(get('p-alpha').value), tail=get('p-tail').value;
    const positiveOnly=type==='f'||type==='chi', validDF=n=>n>=1&&n<=10000;
    if (!Number.isFinite(stat) || Math.abs(stat)>1e8 || (positiveOnly&&stat<0) ||
      !(alpha>0&&alpha<1) || (type!=='z'&&!validDF(df1)) || (type==='f'&&!validDF(df2))) {
      result.className='feedback retry';
      result.textContent='ตรวจค่าสถิติ ค่า α ต้องอยู่ระหว่าง 0 กับ 1 และ df ที่ใช้ต้องอยู่ตั้งแต่ 1 ถึง 10,000 ส่วน F กับ χ² ต้องไม่ติดลบ';
      return;
    }
    const p=tailProbability(type,stat,df1,df2,tail);
    const reject=p<=alpha;
    const display=p===0 ? '< 1e−300' : p<.0001 ? '≈ '+p.toExponential(3) :'≈ '+formulaFormat(p,6);
    result.className='feedback';
    result.textContent=`p ${display} · ${reject ? 'p ≤ α ปฏิเสธ H₀ ตามคำถามที่ตั้งไว้' : 'p > α หลักฐานยังไม่พอที่จะปฏิเสธ H₀'}`;
  });
  get('p-form').requestSubmit();
}
