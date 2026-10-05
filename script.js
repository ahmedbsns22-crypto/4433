'use strict';
/* ZY Bag — cinematic vertical ad. CSS does all motion; JS only switches shots on a timer. */

const stage = document.getElementById('stage');
const A = 'assets/';
const AR = { bag: 933 / 630, shoe: 440 / 330, lap: 470 / 370, main: 570 / 260, dev: 290 / 355 };

// hand-drawn underline (pathLength=1 so CSS can draw it)
const UL = ['M2 7C22 2 48 11 98 4', 'M2 4C30 9 60 2 98 7', 'M3 6C28 3 70 10 97 5'];
let ui = 0;
const H = (w, d) => `<span class="h" style="--ud:${d}s">${w}<svg class="ul" viewBox="0 0 100 12" preserveAspectRatio="none"><path pathLength="1" d="${UL[ui++ % 3]}"/></svg></span>`;

// text: [html, top%, delay s, dx, dy, class, extraDelay(e) for swap]
// cam: a = start [focusX, focusY, scale], m = at 60%, b = end
const SHOTS = [
 { t: 0, d: 3, img: 'bag', a: [.48, .39, 3.4], m: [.5, .4, 3.0], b: [.5, .5, 1.25], sfx: 'WHOOSH',   // SFX: WHOOSH (fast zoom-out ~1.8s)
   txt: [['تريد حقيبة...', 14, .2, 0, '-40px', 'big'],
         ['تبقى وياك ' + H('<span class="big2">بكل مكان</span>', 1.9) + '؟', 72, 1.0, 0, '40px', 'big']] },

 { t: 3, d: 3, img: 'bag', a: [.2, .5, 2], m: [.8, .5, 2], b: [.5, .5, 1.2], sx: '-12%', sfx: 'CAMERA PUSH', // SFX: CAMERA PUSH
   txt: [['شوف هاي الحقيبة...', 12, .2, '60px', 0, ''],
         ['شكد ' + H('جوكر', 2.0), 74, 1.2, 0, '50px', 'xl']] },

 { t: 6, d: 3, img: 'bag', a: [.5, .5, 1.0], m: [.4, .5, 1.15], b: [.6, .5, 1.25], sx: '10%',
   txt: [['<span class="h" style="--ud:9s">للرياضة</span>', 11, .2, '90px', 0, 'big'],
         [H('للسفر', 1.5), 76, .8, '-90px', 0, 'big'],
         [H('للعمل', 2.2), 86, 1.4, 0, '70px', 'big']] },

 { t: 9, d: 3, img: 'bag', a: [.3, .5, 1.5], m: [.19, .5, 3.0], b: [.185, .5, 3.4], sfx: 'ZIPPER CLICK', // SFX: ZIPPER CLICK
   txt: [[H('جيب أمامي', 1.0), 13, .5, 0, '-40px', 'xl'], ['بسحاب', 80, 1.0, 0, '40px', 'big']] },

 { t: 12, d: 3, img: 'shoe', a: [.2, .55, 1.3], m: [.35, .55, 1.5], b: [.3, .55, 1.9], sx: '-30%', sfx: 'WHOOSH', // SFX: WHOOSH (pan to side)
   txt: [['جيب جانبي', 12, .3, '60px', 0, 'big'], [H('للحذاء', 1.4), 76, .9, '-60px', 0, 'xl']] },

 { t: 15, d: 3, img: 'lap', a: [.5, .5, 1.0], m: [.45, .72, 1.9], b: [.45, .76, 2.3], sfx: 'CAMERA PUSH', // SFX: CAMERA PUSH
   txt: [['جيب ' + H('شبكي داخلي', 1.2), 12, .3, 0, '-40px', 'big'], ['بسحاب', 80, 1.0, 0, '40px', 'sm']] },

 { t: 18, d: 3, img: 'main', a: [.5, .5, 1.3], m: [.5, .5, 1.0], b: [.5, .5, 1.7], sfx: 'SUBTLE IMPACT', // SFX: SUBTLE IMPACT (on "واسع")
   txt: [['الجيب الرئيسي', 13, .2, 0, '-40px', 'big'], ['واسع', 70, 1.1, 0, 0, 'xl pop']] },

 { t: 21, d: 2.4, img: 'dev', a: [.5, .5, 1.1], m: [.5, .52, 1.4], b: [.5, .55, 1.6], sx: '20%',
   txt: [[H('جيب للأجهزة', 1.0), 12, .3, 0, '-40px', 'big']] },

 { t: 23.4, d: 1.6, img: 'bag', a: [.5, .55, 1.2], m: [.8, .55, 1.8], b: [.95, .55, 2.4], sx: '40%', sfx: 'WHOOSH', // SFX: WHOOSH (to rear)
   txt: [['باب خلفي', 12, .1, '-60px', 0, 'big'], ['للأغراض الشخصية', 80, .5, '80px', 0, 'big']] },

 { t: 25, d: 4, img: 'bag', a: [.5, .5, .8], m: [.5, .5, .8], b: [.5, .5, .82],
   over: '<i class="ln x" style="--d:.4s"></i><i class="ln y" style="--d:1.4s"></i><i class="ln z" style="--d:2.4s"></i>', // SFX: LINE DRAW (x3)
   txt: [['45 سم — الطول', 68, .6, '60px', 0, 'big'], ['22 سم — العمق', 77, 1.6, '-60px', 0, 'big'], ['21 سم — الارتفاع', 86, 2.6, '60px', 0, 'big']] },

 { t: 29, d: 4, img: 'bag', a: [.6, .6, 1.2], m: [.58, .68, 2.0], b: [.55, .72, 2.6], water: 1, sfx: 'CAMERA PUSH',
   txt: [[H('مقاومة للماء', 1.0), 12, .3, 0, '-40px', 'big'],
         ['حتى ' + H('تحافظ', 2.7) + ' على أغراضك الثمينة', 76, 1.8, 0, '40px', '']] },

 { t: 33, d: 3, img: 'bag', a: [.3, .5, 1.5], m: [.7, .5, 1.5], b: [.5, .5, 1.3], sfx: 'TEXT IMPACT', // SFX: TEXT IMPACT (x3 rapid words)
   txt: [['الجيم', 14, .1, 0, '-40px', 'xl sw', '.55s'], ['السفر', 14, .6, 0, '-40px', 'xl sw', '1.05s'], ['الدوام', 14, 1.1, 0, '-40px', 'xl sw', '1.55s'],
         ['هاي الحقيبة تشتغل وياك ' + H('بكل مكان', 2.3) + '.', 72, 1.7, 0, '40px', 'big']] },

 { t: 36, d: 3, img: 'bag', a: [.5, .5, 1.6], m: [.5, .5, 1.2], b: [.5, .5, .9], sx: '-12%',
   txt: [['والتوصيل متوفر', 14, .3, 0, '-40px', 'big'], ['لكل ' + H('محافظات العراق', 1.4), 74, .9, 0, '40px', 'big']] },

 { t: 39, d: 3, img: 'bag', a: [.8, .5, 1.9], m: [.6, .5, 1.5], b: [.5, .5, 1.1], sfx: 'SUBTLE IMPACT',
   chk: 1.9,
   txt: [['وفحص المنتج', 12, .2, 0, '-40px', 'big'], [H('قبل الاستلام', 1.2), 72, .7, 0, '40px', 'xl']] },

 { t: 42, d: 5, img: 'bag', a: [.5, .5, 1.2], m: [.5, .5, 1.0], b: [.5, .5, .95], logo: 1,
   txt: [['ZY Bag', 18.5, 3.4, 0, '30px', 'brand'], ['للطلب والاستفسار', 68, 1.0, 0, '40px', 'big'],
         ['07714348036', 74.5, 1.5, 0, '40px', 'ltr'],
         ['فحص المنتج قبل الاستلام', 84, 2.3, 0, '30px', 'sm'], ['توصيل لكل محافظات العراق', 89, 2.8, 0, '30px', 'sm']] },
];
const END = 47;

/* ---- build DOM once ---- */
const els = SHOTS.map(s => {
  const e = document.createElement('div');
  e.className = 'shot';
  if (s.sx) e.style.setProperty('--sx', s.sx);
  const v = (k, p) => `--x${k}:${p[0]};--y${k}:${p[1]};--s${k}:${p[2]};`;
  let h = `<div class="cam" style="--ar:${AR[s.img]};--dur:${s.d}s;${v(0, s.a)}${v('m', s.m)}${v(1, s.b)}">` +
          `<img src="${A + s.img}.png" alt="" decoding="async">${s.over || ''}</div>`;
  if (s.water) for (let i = 0; i < 8; i++) h += `<i class="drop" style="--l:${8 + i * 12}%;--dl:${(i * .37) % 1.5}s"></i>`;
  if (s.logo) h += `<img class="logo" src="${A}logo.png" alt="">`;
  if (s.chk) h += `<svg class="chk" viewBox="0 0 100 80" style="--d:${s.chk}s"><path pathLength="1" d="M8 42L38 70L92 10"/></svg>`;
  s.txt.forEach(([html, top, d, dx, dy, cls, end]) => {
    h += `<div class="t ${cls}" style="top:${top}%;--d:${d}s;--dx:${dx};--dy:${dy};${end ? '--e:' + end : ''}">${html}</div>`;
  });
  e.innerHTML = h;
  stage.appendChild(e);
  return e;
});

/* ---- timeline: JS only toggles classes; CSS animates ---- */
let timers = [], cur = -1;
function sfx(name) { /* hook for syncing audio later */ }
function show(i) {
  if (cur >= 0) els[cur].classList.remove('on');
  cur = i;
  els[i].classList.add('on');
  if (SHOTS[i].sfx) sfx(SHOTS[i].sfx);
}
function play() {
  timers.forEach(clearTimeout); timers = [];
  els.forEach(e => e.classList.remove('on')); cur = -1;
  SHOTS.forEach((s, i) => timers.push(setTimeout(() => show(i), s.t * 1000)));
  timers.push(setTimeout(() => { /* hold on final frame; tap to replay */ }, END * 1000));
}

// preload all images, then allow start
const start = document.getElementById('start');
Promise.all([...new Set(SHOTS.map(s => s.img)), 'logo'].map(n => new Promise(r => {
  const im = new Image(); im.onload = im.onerror = r; im.src = A + n + '.png';
}))).then(() => start.querySelector('span').textContent = 'اضغط للبدء');
start.addEventListener('click', () => { start.classList.add('hide'); play(); });
stage.addEventListener('click', play); // tap to replay
