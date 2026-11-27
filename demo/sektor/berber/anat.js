/* Berber girişi: yüz videosu ağır çekimde döner, önceden çıkarılmış yüz noktalarına (face-track.js) çizgiler çizilir.
   Evreler videodaki parçaya oranla: boy → alın → elmacık → çene → sonuç. Video yüze yakınlaştırılır (T.fx/T.fy, T.zoom). */
(function () {
  var T = window.FACE_TRACK; if (!T) return;
  var D = T.t1 - T.t0, SLOW = T.slow || 0.5;
  var PH = [[0.03, 'an_1'], [0.22, 'an_2'], [0.41, 'an_3'], [0.60, 'an_4'], [0.79, 'an_5']].map(function (p) { return [T.t0 + p[0] * D, p[1]]; });
  var LN = 0.17 * D, FADE = 0.1 * D; /* çizgi çizilme ve sondaki sönme süresi (video saniyesi) */
  var NS = 'http://www.w3.org/2000/svg';
  function init() {
    var box = document.getElementById('anat'), v = document.getElementById('anatv'), svg = document.getElementById('anatsvg'), narr = document.getElementById('hnarr');
    if (!box || !v) return;
    var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    var src = T.src.replace(/^px:/, 'https://videos.pexels.com/video-files/') + '.mp4';
    function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); svg.appendChild(e); return e; }
    var G = {
      gTop: el('line', { class: 'gd' }), gChin: el('line', { class: 'gd' }),
      len: el('path', { class: 'ln', pathLength: 1 }), fh: el('path', { class: 'ln', pathLength: 1 }), ck: el('path', { class: 'ln', pathLength: 1 }), jw: el('path', { class: 'ln', pathLength: 1 }),
      tLen: el('text', {}), tFh: el('text', {}), tCk: el('text', {}), tJw: el('text', {})
    };
    var dots = []; for (var i = 0; i < 9; i++) dots.push(el('circle', { class: 'dt', r: 2.6 }));
    var lastPh = -1, M = { s: 1, dx: 0, dy: 0, W: 0, H: 0, init: false };
    function label() { G.tLen.textContent = KIT.t('lb_len'); G.tFh.textContent = KIT.t('lb_fh'); G.tCk.textContent = KIT.t('lb_ck'); G.tJw.textContent = KIT.t('lb_jw'); }
    function say(key) {
      var p = String(KIT.t(key)).split('|'), w = p[0].split(' ');
      narr.classList.remove('in');
      narr.innerHTML = w.map(function (x, j) { return '<span style="transition-delay:' + j * 70 + 'ms">' + KIT.esc(x) + '</span>'; }).join(' ') + (p[1] ? '<small><span style="transition-delay:' + (w.length * 70 + 120) + 'ms">' + KIT.esc(p[1]) + '</span></small>' : '');
      setTimeout(function () { narr.classList.add('in'); }, 40);
    }
    /* videoyu yüze yakınlaştırarak yerleştir; çizgiler aynı ölçeği kullanır */
    function place() {
      var cw = box.clientWidth, ch = box.clientHeight, narrow = cw < 600, z = (T.zoom || [1, 1])[narrow ? 1 : 0];
      var s = Math.max(cw / T.w, ch / T.h) * z, W = T.w * s, H = T.h * s;
      var dx = cw * 0.5 - (T.fx || 0.5) * W, dy = ch * (T.cy ? T.cy[narrow ? 1 : 0] : (narrow ? 0.46 : 0.5)) - (T.fy || 0.5) * H;
      dx = Math.min(0, Math.max(cw - W, dx)); dy = Math.min(ch * (T.topRoom || 0), Math.max(ch - H, dy));
      M.s = s; M.dy = dy; M.W = W; M.H = H; if (!T.follow || !M.init) M.dx = dx;
      v.style.width = W + 'px'; v.style.height = H + 'px'; v.style.left = '0px'; v.style.top = dy + 'px'; v.style.transform = 'translate3d(' + M.dx + 'px,0,0)';
    }
    /* yüzü takip eden kamera: yüzün ortasını kutunun ortasında tut (yumuşak) */
    function follow(t) {
      if (!T.follow) return;
      var x = Math.max(0, Math.min(T.f.length - 1.001, (t - T.t0) / T.step)), i = Math.floor(x), f = x - i, A = T.f[i], B = T.f[i + 1] || A;
      var cx = ((A[2][0] + A[3][0]) / 2 * (1 - f) + (B[2][0] + B[3][0]) / 2 * f) / 1000;
      var cw = box.clientWidth, target = Math.min(0, Math.max(cw - M.W, cw * 0.5 - cx * M.W));
      M.dx = M.init ? M.dx + (target - M.dx) * 0.12 : target; M.init = true;
      v.style.transform = 'translate3d(' + M.dx.toFixed(1) + 'px,0,0)';
    }
    function frame(t) {
      var x = Math.max(0, Math.min(T.f.length - 1.001, (t - T.t0) / T.step)), i = Math.floor(x), f = x - i, A = T.f[i], B = T.f[i + 1] || A;
      return A.map(function (a, k) { var b = B[k]; return [M.dx + ((a[0] + (b[0] - a[0]) * f) / 1000) * T.w * M.s, M.dy + ((a[1] + (b[1] - a[1]) * f) / 1000) * T.h * M.s]; });
    }
    function prog(t, start) { return Math.max(0, Math.min(1, (t - start) / LN)); }
    function d(P) { return 'M' + P.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L'); }
    function draw(t) {
      follow(t);
      var P = frame(t), top = P[0], chin = P[1], cl = P[2], cr = P[3], jl = P[6], jr = P[7], fl = P[8], fr = P[9];
      var cw = box.clientWidth, narrow = cw < 600, fade = t > T.t1 - FADE ? Math.max(0, (T.t1 - t) / FADE) : 1;
      svg.style.opacity = fade;
      var fw = cr[0] - cl[0], lenX = narrow ? Math.max(14, cl[0] - fw * 0.35) : cr[0] + fw * 0.45;
      G.len.setAttribute('d', d([[lenX, top[1]], [lenX, chin[1]]]));
      G.gTop.setAttribute('x1', Math.min(lenX - 10, top[0] - 40)); G.gTop.setAttribute('x2', Math.max(lenX + 14, top[0] + 40)); G.gTop.setAttribute('y1', top[1]); G.gTop.setAttribute('y2', top[1]);
      G.gChin.setAttribute('x1', Math.min(lenX - 10, chin[0] - 40)); G.gChin.setAttribute('x2', Math.max(lenX + 14, chin[0] + 40)); G.gChin.setAttribute('y1', chin[1]); G.gChin.setAttribute('y2', chin[1]);
      G.fh.setAttribute('d', d([fl, fr])); G.ck.setAttribute('d', d([cl, cr])); G.jw.setAttribute('d', d([jl, chin, jr]));
      var pr = [prog(t, PH[0][0]), prog(t, PH[1][0]), prog(t, PH[2][0]), prog(t, PH[3][0])];
      [G.len, G.fh, G.ck, G.jw].forEach(function (g, k) { g.style.strokeDasharray = '1 1'; g.style.strokeDashoffset = 1 - pr[k]; });
      G.gTop.style.opacity = G.gChin.style.opacity = pr[0];
      function lab(tx, x, y, k, anchor) { tx.setAttribute('x', x); tx.setAttribute('y', y); tx.setAttribute('text-anchor', anchor || 'start'); tx.style.opacity = pr[k] > 0.6 ? 1 : 0; }
      lab(G.tLen, lenX + (narrow ? 8 : 10), narrow ? chin[1] - 10 : (top[1] + chin[1]) / 2, 0);
      lab(G.tFh, fr[0] + 12, fr[1] - 8, 1);
      if (narrow) lab(G.tCk, (cl[0] + cr[0]) / 2, Math.min(cl[1], cr[1]) - 10, 2, 'middle'); else lab(G.tCk, cr[0] + 14, cr[1] + 4, 2);
      if (narrow) lab(G.tJw, jr[0] - 6, jr[1] - 12, 3, 'end'); else lab(G.tJw, jr[0] + 12, jr[1] + 16, 3);
      [top, chin, cl, cr, jl, jr, fl, fr, P[10]].forEach(function (p, k) { dots[k].setAttribute('cx', p[0]); dots[k].setAttribute('cy', p[1]); dots[k].style.opacity = pr[0] > 0 ? 0.9 : 0; });
      var ph = 0; PH.forEach(function (q, k) { if (t >= q[0]) ph = k; });
      if (ph !== lastPh) { lastPh = ph; say(PH[ph][1]); }
    }
    var running = false;
    function loop() {
      if (!running) return;
      if (v.currentTime >= T.t1 || v.currentTime < T.t0 - 0.05) v.currentTime = T.t0;
      draw(Math.max(T.t0, v.currentTime));
      requestAnimationFrame(loop);
    }
    place(); new ResizeObserver(function () { place(); draw(Math.max(T.t0, v.currentTime || T.t0)); }).observe(box);
    v.src = src; v.defaultPlaybackRate = SLOW; v.loop = true;
    v.addEventListener('loadedmetadata', function () { if (v.currentTime < T.t0) v.currentTime = T.t0; });
    v.addEventListener('playing', function () { v.playbackRate = SLOW; v.classList.add('on'); });
    label(); say('an_1');
    if (reduced) { var tr = T.t0 + 0.9 * D; v.addEventListener('loadedmetadata', function () { v.currentTime = tr; }); v.addEventListener('seeked', function () { v.classList.add('on'); draw(tr); }); v.load(); return; }
    new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { v.play().catch(function () {}); if (!running) { running = true; requestAnimationFrame(loop); } }
      else { v.pause(); running = false; }
    }).observe(box);
    document.addEventListener('kit:lang', function () { label(); if (lastPh >= 0) say(PH[lastPh][1]); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
