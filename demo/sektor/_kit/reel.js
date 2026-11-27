/* Onaz Studio · video şeridi: <div data-reel="7167,13088,..." data-every="3200" data-fx="fade|wipe|zoom" data-labels="k1,k2">
   İki video katmanı arasında yumuşak geçiş, görünmeyince durur, azaltılmış harekette yalnız poster. Mixkit 720p. */
(function () {
  var MK = function (id) { return 'https://assets.mixkit.co/videos/' + id + '/' + id + '-720.mp4'; };
  var MP = function (id) { return 'https://assets.mixkit.co/videos/' + id + '/' + id + '-thumb-720-0.jpg'; };
  window.MKV = MK; window.MKP = MP;
  /* Girdi: Mixkit numarası | "px:{id}/{dosya}" (Pexels) | tam adres. "yatay|dikey" yazılırsa telefonda dikey olan seçilir. */
  var portrait = matchMedia('(max-aspect-ratio: 4/5)');
  function pick(e) { var p = e.split('|'); return (p.length > 1 && portrait.matches ? p[1] : p[0]).split('@')[0]; }
  function RATE(e, d) { var m = String(e).match(/@([\d.]+)$/); return m ? +m[1] : d; }
  function SRC(e) { e = pick(e); if (/^px:/.test(e)) return 'https://videos.pexels.com/video-files/' + e.slice(3) + '.mp4'; return /^https?:/.test(e) ? e : MK(e); }
  function PST(e) { e = pick(e); if (/^px:/.test(e)) { var n = e.slice(3).split('/')[0]; return 'https://images.pexels.com/videos/' + n + '/pexels-photo-' + n + '.jpeg?auto=compress&cs=tinysrgb&w=1280'; } return /^\d+$/.test(e) ? MP(e) : ''; }
  /* Pexels büyük kapak yoksa küçük önizlemeye düş */
  function pfix(img) { img.addEventListener('error', function () { var m = img.src.match(/videos\/(\d+)\/pexels-photo/); if (m) img.src = 'https://images.pexels.com/videos/' + m[1] + '/pictures/preview-0.jpg'; else img.style.visibility = 'hidden'; }); img.addEventListener('load', function () { img.style.visibility = ''; }); }
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = '.reel{position:relative;overflow:hidden;background:#111;isolation:isolate}.reel>video,.reel>img.reel__p{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}' +
    '.reel>video{opacity:0;transition:opacity 1.1s cubic-bezier(.4,0,.2,1),transform 6s linear,clip-path 1.1s cubic-bezier(.7,0,.2,1)}.reel>video.on{opacity:1;z-index:1}' +
    '.reel[data-fx=zoom]>video{transform:scale(1.08)}.reel[data-fx=zoom]>video.on{transform:scale(1)}' +
    '.reel[data-fx=wipe]>video{opacity:1;clip-path:inset(0 0 0 100%)}.reel[data-fx=wipe]>video.on{clip-path:inset(0 0 0 0)}.reel[data-fx=wipe]>video.out{clip-path:inset(0 0 0 0);z-index:0}' +
    '.reel__cap{position:absolute;z-index:3;left:14px;bottom:14px;font-weight:700;font-size:14px;color:#fff;background:rgba(0,0,0,.42);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);padding:8px 12px;border-radius:99px;transition:opacity .4s}' +
    '.reel>img.reel__p[src=""]{display:none}.reel{background:radial-gradient(120% 90% at 30% 20%,#3a2e26,#141110)}' +
    '.reel__narr{position:absolute;z-index:4;left:clamp(18px,5vw,64px);right:clamp(18px,5vw,64px);bottom:clamp(26px,6vh,64px);margin:0;color:#fff;font:inherit;font-family:var(--k-display,inherit);font-weight:700;font-size:clamp(24px,4.4vw,52px);line-height:1.08;letter-spacing:-.02em;max-width:17ch;text-shadow:0 2px 24px rgba(0,0,0,.55);pointer-events:none}' +
    '.reel__narr span{display:inline-block;opacity:0;transform:translateY(.4em);filter:blur(6px);transition:opacity .7s cubic-bezier(.16,1,.3,1),transform .7s cubic-bezier(.16,1,.3,1),filter .7s}.reel__narr.in span{opacity:1;transform:none;filter:none}' +
    '.reel__narr small{display:block;margin-top:.5em;font-size:max(14px,.36em);font-family:var(--k-font,inherit);font-weight:500;letter-spacing:0;max-width:34ch;opacity:.9}.reel__narr--flow small{font-size:max(15px,.52em);line-height:1.35}' +
    '.reel__bars{position:absolute;z-index:4;top:18px;left:clamp(18px,5vw,64px);right:clamp(18px,5vw,64px);display:flex;gap:6px;pointer-events:none}.reel__bars i{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.3);overflow:hidden}.reel__bars i::after{content:"";display:block;height:100%;width:100%;background:#fff;transform:scaleX(0);transform-origin:left}.reel__bars i.done::after{transform:scaleX(1)}.reel__bars i.on::after{animation:reelbar var(--every) linear forwards}@keyframes reelbar{to{transform:scaleX(1)}}' +
    '.reel__shade{position:absolute;inset:0;z-index:3;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.28),transparent 22%,transparent 48%,rgba(0,0,0,.62))}' +
    'p.reel__narr.reel__narr--flow{position:relative;left:auto;right:auto;bottom:auto;z-index:auto;font-size:clamp(24px,3.4vw,36px);max-width:22ch;margin:14px 0 22px;text-shadow:0 2px 18px rgba(0,0,0,.5);min-height:2.3em}' +
    '.reel--amb>video,.reel--amb>img.reel__p{object-fit:contain;object-position:50% var(--amb-y,46%);-webkit-mask-image:linear-gradient(180deg,transparent var(--amb-a,0%),#000 var(--amb-b,0%),#000 var(--amb-c,100%),transparent var(--amb-d,100%));mask-image:linear-gradient(180deg,transparent var(--amb-a,0%),#000 var(--amb-b,0%),#000 var(--amb-c,100%),transparent var(--amb-d,100%))}.reel__amb{position:absolute;left:-10%;top:-10%;width:120%;height:120%;z-index:0;filter:blur(26px) saturate(1.35) brightness(.8);pointer-events:none}.reel--amb>video.on{z-index:1}' +
    '.reel--cine>video{filter:contrast(1.12) saturate(.9) brightness(.93)}' +
    '.reel__vig{position:absolute;inset:0;z-index:2;pointer-events:none;background:radial-gradient(120% 95% at 50% 42%,transparent 42%,rgba(0,0,0,.6) 100%)}' +
    '.reel__light{position:absolute;top:-20%;bottom:-20%;left:-30%;width:60%;z-index:2;pointer-events:none;background:linear-gradient(105deg,transparent 30%,rgba(255,236,210,.13) 50%,transparent 70%);mix-blend-mode:screen;transform:translateX(-100%);animation:reellight 11s cubic-bezier(.45,0,.2,1) infinite}' +
    '@keyframes reellight{0%{transform:translateX(-100%)}55%,100%{transform:translateX(320%)}}' +
    '.reel__step{display:block;font-style:normal;font-family:var(--k-font,inherit);font-size:max(12px,.24em);font-weight:700;letter-spacing:.14em;opacity:.75;margin-bottom:.5em}' +
    '@media (prefers-reduced-motion:reduce){.reel__light{display:none}}' +
    '@media (prefers-reduced-motion:reduce){.reel__narr span{opacity:1;transform:none;filter:none}}' +
    '.reel__dots{position:absolute;z-index:3;right:14px;bottom:18px;display:flex;gap:5px}.reel__dots i{width:6px;height:6px;border-radius:9px;background:rgba(255,255,255,.45);transition:width .4s,background .4s}.reel__dots i.on{width:18px;background:#fff}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function make(el) {
    var ids = el.getAttribute('data-reel').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var every = +el.getAttribute('data-every') || 3600, labels = (el.getAttribute('data-labels') || '').split(',').filter(Boolean);
    var narr = (el.getAttribute('data-narr') || '').split(',').filter(Boolean), nEl = null, bars = null;
    var slow = +el.getAttribute('data-slow') || 1, steps = el.hasAttribute('data-steps');
    el.classList.add('reel');
    var ambA = el.getAttribute('data-ambient'), amb = null, actx = null;
    if (ambA !== null && (ambA !== 'mobile' || matchMedia('(max-width: 899px)').matches)) { el.classList.add('reel--amb'); amb = document.createElement('canvas'); amb.className = 'reel__amb'; amb.width = 48; amb.height = 80; amb.setAttribute('aria-hidden', 'true'); actx = amb.getContext('2d'); el.prepend(amb); }
    if (el.getAttribute('data-grade') === 'cine') { el.classList.add('reel--cine'); var vg = document.createElement('i'); vg.className = 'reel__vig'; el.appendChild(vg); var lt = document.createElement('i'); lt.className = 'reel__light'; el.appendChild(lt); } if (!el.getAttribute('data-fx')) el.setAttribute('data-fx', 'fade');
    var poster = document.createElement('img'); poster.className = 'reel__p'; poster.alt = ''; poster.src = el.getAttribute('data-poster') || PST(ids[0]); poster.decoding = 'async'; pfix(poster); el.prepend(poster);
    var cap = null, dots = null;
    if (labels.length) { cap = document.createElement('span'); cap.className = 'reel__cap'; el.appendChild(cap); }
    if (ids.length > 1 && el.hasAttribute('data-dots')) { dots = document.createElement('div'); dots.className = 'reel__dots'; dots.innerHTML = ids.map(function () { return '<i></i>'; }).join(''); el.appendChild(dots); }
    var nt = el.getAttribute('data-narr-target');
    if (narr.length && nt) { nEl = document.querySelector(nt); if (nEl) nEl.classList.add('reel__narr', 'reel__narr--flow'); }
    else if (narr.length) { var sh = document.createElement('i'); sh.className = 'reel__shade'; el.appendChild(sh); nEl = document.createElement('p'); nEl.className = 'reel__narr'; el.appendChild(nEl); }
    if (nEl) nEl.setAttribute('aria-live', 'polite');
    if (ids.length > 1 && el.hasAttribute('data-bars')) { bars = document.createElement('div'); bars.className = 'reel__bars'; bars.style.setProperty('--every', every + 'ms'); bars.innerHTML = ids.map(function () { return '<i></i>'; }).join(''); el.appendChild(bars); }
    if (reduced) { setCap(0); return; }
    var A = vid(), B = vid(); el.insertBefore(A, poster.nextSibling); el.insertBefore(B, A.nextSibling);
    var i = 0, cur = A, nxt = B, timer = null, visible = false, started = false;
    function vid() { var v = document.createElement('video'); if (amb) v.crossOrigin = 'anonymous'; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'none'; v.setAttribute('aria-hidden', 'true'); return v; }
    function setCap(k) {
      if (cap) { var key = labels[k % labels.length]; cap.textContent = window.KIT ? KIT.t(key) : key; cap.setAttribute('data-k', key); }
      if (dots) Array.prototype.forEach.call(dots.children, function (d, n) { d.classList.toggle('on', n === k); });
      if (bars) Array.prototype.forEach.call(bars.children, function (d, n) { d.classList.remove('on'); void d.offsetWidth; d.classList.toggle('done', n < k); d.classList.toggle('on', n === k); });
      if (nEl && (steps || nEl.getAttribute('data-k') !== narr[k % narr.length])) { nEl.setAttribute('data-k', narr[k % narr.length]); if (steps) nEl.setAttribute('data-step', (k < 9 ? '0' : '') + (k + 1) + ' / ' + (ids.length < 10 ? '0' : '') + ids.length); narrate(nEl); }
    }
    function load(v, k) { v.src = SRC(ids[k]); var p = PST(ids[k]); if (p && !/pexels/.test(p)) v.poster = p; else v.removeAttribute('poster'); v.defaultPlaybackRate = RATE(ids[k], slow); v.load(); v.playbackRate = v.defaultPlaybackRate; }
    function show(k) {
      load(nxt, k);
      var go = function () {
        nxt.play().catch(function () {});
        nxt.classList.add('on'); var ps = PST(ids[k]); if (ps) poster.src = ps; cur.classList.remove('on'); cur.classList.add('out');
        var old = cur; setTimeout(function () { old.classList.remove('out'); old.pause(); }, 1200);
        cur = nxt; nxt = old; i = k; setCap(k); el.dispatchEvent(new CustomEvent('reel:change', { detail: k }));
      };
      if (nxt.readyState >= 3) go(); else nxt.addEventListener('canplay', function h() { nxt.removeEventListener('canplay', h); go(); });
    }
    function start() {
      if (!started) { started = true; load(cur, 0); var c0 = cur; c0.addEventListener('playing', function h() { c0.removeEventListener('playing', h); c0.classList.add('on'); }); cur.play().catch(function () {}); setCap(0); el.dispatchEvent(new CustomEvent('reel:change', { detail: 0 })); }
      else cur.play().catch(function () {});
      if (amb && !ambRaf) ambRaf = requestAnimationFrame(ambDraw);
      if (ids.length > 1 && !timer) timer = setInterval(function () { if (visible && !document.hidden) show((i + 1) % ids.length); }, every);
    }
    var ambRaf = 0;
    function ambDraw() {
      if (!amb || !visible) { ambRaf = 0; return; }
      var v = cur; if (v.readyState >= 2 && v.videoWidth && v.videoWidth !== el._ambW) {
        el._ambW = v.videoWidth; var W = el.clientWidth, H = el.clientHeight, k = Math.min(W / v.videoWidth, H / v.videoHeight), bh = v.videoHeight * k / H * 100, ay = parseFloat(getComputedStyle(el).getPropertyValue('--amb-y')) || 46, top = (100 - bh) * ay / 100, f = Math.min(6, bh / 6);
        if (bh < 99) { el.style.setProperty('--amb-a', top + '%'); el.style.setProperty('--amb-b', (top + f) + '%'); el.style.setProperty('--amb-c', (top + bh - f) + '%'); el.style.setProperty('--amb-d', (top + bh) + '%'); }
      }
      if (v.readyState >= 2 && v.videoWidth) { var cw = amb.width, ch = amb.height, sc = Math.max(cw / v.videoWidth, ch / v.videoHeight), w = v.videoWidth * sc, h = v.videoHeight * sc; try { actx.drawImage(v, (cw - w) / 2, (ch - h) / 2, w, h); } catch (e) {} }
      ambRaf = requestAnimationFrame(ambDraw);
    }
    function stop() { cur.pause(); clearInterval(timer); timer = null; }
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); else if (started) stop(); }, { rootMargin: '120px' }).observe(el);
    el._reelGo = function (k) { if (!started) start(); show(k); clearInterval(timer); timer = null; if (ids.length > 1) timer = setInterval(function () { if (visible) show((i + 1) % ids.length); }, every); };
    el._reelSet = function (list, lab) { ids = list; labels = lab || labels; el._reelGo(0); };
  }
  /* Anlatım: sözlük değeri "Başlık|alt satır" olabilir; sözcükler sırayla belirir. */
  function narrate(n) {
    var key = n.getAttribute('data-k'), raw = window.KIT ? KIT.t(key) : key, parts = String(raw).split('|');
    var esc = function (t) { return t.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    n.classList.remove('in');
    var stp = n.getAttribute('data-step');
    n.innerHTML = (stp ? '<em class="reel__step">' + stp + '</em>' : '') + parts[0].split(' ').map(function (w, j) { return '<span style="transition-delay:' + (j * 70) + 'ms">' + esc(w) + '</span>'; }).join(' ') + (parts[1] ? '<small><span style="transition-delay:' + (parts[0].split(' ').length * 70 + 120) + 'ms">' + esc(parts[1]) + '</span></small>' : '');
    setTimeout(function () { n.classList.add('in'); }, 40);
  }
  window.REEL_INIT = function (root) { (root || document).querySelectorAll('[data-reel]:not(.reel)').forEach(make); };
  function init() { window.REEL_INIT(document); }
  document.addEventListener('kit:lang', function () { document.querySelectorAll('.reel__cap[data-k]').forEach(function (c) { c.textContent = KIT.t(c.getAttribute('data-k')); }); document.querySelectorAll('.reel__narr[data-k]').forEach(narrate); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
