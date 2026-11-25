/* Dil, marka adı, demo, önce/sonra sürgüsü, menüler. Bağımlılık yok. */
(function () {
  "use strict";
  var root = document.documentElement;
  var CFG = window.SITE || {};
  var DICT = window.I18N || (window.I18N = {});
  var LANGS = ["tr", "en", "ru", "kk", "uz", "ky"];
  var LOCALE = { tr: "tr-TR", en: "en-US", ru: "ru-RU", kk: "ru-RU", uz: "ru-RU", ky: "ru-RU" }; /* yalnız sayı biçimi: kk/uz/ky yerel verisi her tarayıcıda yok, binlik boşluk aynı */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = "tr";
  root.classList.add("js");

  /* ---------- 1. Marka ve sayfa meta bilgileri (metinler js/i18n/*.js içinde) ---------- */
  var BRAND = CFG.brand || { name: "", short: "" };
  document.querySelectorAll("[data-brand]").forEach(function (el) { el.textContent = BRAND[el.getAttribute("data-brand")] || BRAND.name; });

  var META = {
    title: "title",
    desc: 'meta[name="description"]',
    ogTitle: 'meta[property="og:title"]',
    ogDesc: 'meta[property="og:description"]',
    ogLocale: 'meta[property="og:locale"]'
  };
  Object.keys(META).forEach(function (k) { META[k] = document.querySelector(META[k]); });

  /* ---------- 2. Fiyatlar js/config.js'ten ---------- */
  function priceOf(path) {
    var parts = path.split("."), v = CFG.prices;
    for (var i = 0; v && i < parts.length; i++) v = v[parts[i]];
    return typeof v === "number" ? v : null;
  }
  function fmt(n) {
    /* Rakam yerel biçimde; dolar işareti TR/EN'de önde ($99), RU/KK/UZ/KY'de sonda (99 $) */
    var s;
    try { s = new Intl.NumberFormat(LOCALE[current], { maximumFractionDigits: 0 }).format(n); } catch (e) { s = String(n); }
    return current === "tr" || current === "en" ? "$" + s : s + " $";
  }
  function fmtTry(n) {
    /* Örnek fiyatlar: TR/EN ₺1.450 / ₺1,450; diğerleri 1 450 ₺ */
    var s;
    try { s = new Intl.NumberFormat(LOCALE[current], { maximumFractionDigits: 0 }).format(n); } catch (e) { s = String(n); }
    return current === "tr" || current === "en" ? "₺" + s : s + "\u00a0₺";
  }
  function t(key) {
    var d = DICT[current] || {};
    var s = key in d ? d[key] : (DICT.en && key in DICT.en) ? DICT.en[key] : null;
    if (s === null) return null;
    return String(s)
      .replace(/\{brand\}/g, BRAND.name)
      .replace(/\{try:(\d+)\}/g, function (m, n) { return fmtTry(+n); })
      .replace(/\{([a-z]+\.[a-z]+)\}/g, function (m, path) {
        var v = priceOf(path);
        return v === null ? m : fmt(v);
      });
  }

  /* ---------- 3. WhatsApp ve e-posta bağlantıları o anki dilde ---------- */
  var PHONE = CFG.phone || "905340679661";
  var EMAIL = CFG.email || "onderkya35@gmail.com";
  function updateLinks() {
    document.querySelectorAll(".js-wa").forEach(function (a) {
      var pkg = a.getAttribute("data-pkg");
      var text = pkg ? (t("msg.pkg") || "{pkg}").replace("{pkg}", t(pkg) || "") : t(a.getAttribute("data-msg") || "msg.wa") || "";
      a.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
      a.target = "_blank";
    });
    document.querySelectorAll(".js-mail").forEach(function (a) {
      var s = t(a.getAttribute("data-subject") || "msg.mailSubject") || "";
      var b = t(a.getAttribute("data-body") || "msg.mailBody") || "";
      a.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(s) + "&body=" + encodeURIComponent(b);
    });
    document.querySelectorAll(".js-phone").forEach(function (el) { if (CFG.phoneDisplay) el.textContent = CFG.phoneDisplay; });
    document.querySelectorAll(".js-email").forEach(function (el) { el.textContent = EMAIL; });
  }

  /* ---------- 4. Dil dosyasını yükle ve uygula ---------- */
  function loadDict(lang, cb) {
    if (DICT[lang]) return cb();
    var s = document.querySelector('script[data-dict="' + lang + '"]');
    var done = false;
    function fin() { if (!done) { done = true; cb(); } }
    if (!s) {
      s = document.createElement("script");
      s.src = "js/i18n/" + lang + ".js";
      s.setAttribute("data-dict", lang);
      document.head.appendChild(s);
    }
    s.addEventListener("load", fin);
    s.addEventListener("error", fin);
    if (DICT[lang]) fin();
  }

  function each(attr, fn) {
    document.querySelectorAll("[" + attr + "]").forEach(function (el) {
      var v = t(el.getAttribute(attr));
      if (v !== null) fn(el, v);
    });
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    current = lang;
    root.lang = lang;
    each("data-i18n", function (el, v) { el.textContent = v; });
    each("data-i18n-alt", function (el, v) { el.setAttribute("alt", v); });
    each("data-i18n-aria", function (el, v) { el.setAttribute("aria-label", v); });
    each("data-i18n-lang", function (el, v) { el.lang = v; });
    document.querySelectorAll("[data-lc]").forEach(function (el) { el.textContent = lang.toUpperCase(); });
    document.querySelectorAll("[data-try]").forEach(function (el) { el.textContent = fmtTry(+el.getAttribute("data-try")); });
    document.title = t("meta.title") || BRAND.name;
    ["desc", "ogTitle", "ogDesc", "ogLocale"].forEach(function (k) {
      var v = t("meta." + k);
      if (META[k] && v !== null) META[k].setAttribute("content", v);
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.setAttribute("aria-current", on ? "true" : "false");
    });
    var cur = document.querySelector(".lang-cur");
    if (cur) cur.textContent = lang.toUpperCase();
    var mb = document.querySelector(".menu-btn");
    if (mb) mb.setAttribute("aria-label", t(mb.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"));
    if (pauseBtn) pauseBtn.setAttribute("aria-label", t(playing ? "demo.pause" : "demo.play"));
    if (moreBtn && moreBtn.getAttribute("aria-expanded") === "true") moreBtn.textContent = t("who.showLess");
    if (live) live.textContent = "";
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var v = priceOf(el.getAttribute("data-price"));
      if (v !== null) el.textContent = fmt(v);
    });
    updateLinks();
    root.classList.remove("i18n-wait");
  }

  var wanted = null;
  function choose(lang) {
    wanted = lang;
    loadDict(lang, function () {
      if (wanted !== lang) return; /* hızlı art arda seçimde son dil geçerli */
      apply(lang);
      try { localStorage.setItem("site-lang", lang); } catch (e) {}
      try {
        var u = new URL(location.href);
        if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u); }
      } catch (e) {}
    });
  }

  /* ---------- 5. Dil menüsü (üst çubuk) ---------- */
  var langWrap = document.querySelector("[data-lang-menu]");
  var langBtn = langWrap && langWrap.querySelector(".lang-btn");
  var langList = langWrap && langWrap.querySelector(".lang-list");
  function closeLang(focusBtn) {
    if (!langList || langList.hidden) return;
    langList.hidden = true;
    langBtn.setAttribute("aria-expanded", "false");
    if (focusBtn) langBtn.focus();
  }
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var open = langList.hidden;
      langList.hidden = !open;
      langBtn.setAttribute("aria-expanded", String(open));
      if (open) {
        var on = langList.querySelector('[aria-current="true"]') || langList.querySelector("button");
        on.focus();
      }
    });
    langList.addEventListener("keydown", function (e) {
      var items = [].slice.call(langList.querySelectorAll("button"));
      var i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
    });
    document.addEventListener("click", function (e) { if (!langWrap.contains(e.target)) closeLang(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeLang(true); closeMenu(true); } });
  }
  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      choose(b.getAttribute("data-lang"));
      closeLang(langList && langList.contains(b));
      if (menu && menu.contains(b)) closeMenu(false);
    });
  });

  /* ---------- 6. Telefon menüsü ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var menu = document.getElementById("m-menu");
  function closeMenu(focusBtn) {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", t("nav.open"));
    menuBtn.querySelector("use").setAttribute("href", "#i-menu");
    if (focusBtn) menuBtn.focus();
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      if (!menu.hidden) return closeMenu(false);
      menu.hidden = false;
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", t("nav.close"));
      menuBtn.querySelector("use").setAttribute("href", "#i-close");
      var first = menu.querySelector("a");
      if (first) first.focus();
    });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { closeMenu(false); }); });
  }

  /* ---------- 7. Kahraman: 14 işletme, 14 sohbet sahnesi ----------
     Adım türleri: c müşteri · f yabancı müşteri (özgün + çeviri) · p fotoğraflı müşteri · a asistan ·
     o sahibin onay kartı · r sahibe iletilen özel istek · n sahibe bildirim · s ara not (sözlük anahtarı) */
  var SCENES = [
    { k: "fl", icon: "flower",   c: "#B8125F", time: "23:41", night: true, s: ["c1", "a2", "c3", "o4", "a5"] },
    { k: "hr", icon: "scissors", c: "#075E7C", time: "12:20", s: ["c1", "a2", "c3", "o4", "a5"] },
    { k: "sp", icon: "lotus",    c: "#23683F", time: "21:05", night: true, s: ["f1", "a3", "s:ow.l", "o4", "a5"] },
    { k: "gy", icon: "dumbbell", c: "#25205A", time: "18:10", s: ["c1", "a2", "c3", "o4", "a5"] },
    { k: "vt", icon: "paw",      c: "#8A5A00", time: "10:15", s: ["a1", "c2", "a3", "o4", "a5"] },
    { k: "ph", icon: "phone",    c: "#075E7C", time: "16:40", s: ["c1", "a2", "o3", "a4", "c5"] },
    { k: "tl", icon: "needle",   c: "#C42F66", time: "22:30", night: true, s: ["c1", "a2", "c3", "o4", "a5"] },
    { k: "ld", icon: "washer",   c: "#075E7C", time: "20:50", night: true, s: ["c1", "a2", "o3", "a4", "s:ow.2d", "a5"] },
    { k: "sh", icon: "shoe",     c: "#23683F", time: "14:05", s: ["p1", "a2", "o3", "a4", "c5"] },
    { k: "bt", icon: "hanger",   c: "#B8125F", time: "15:30", s: ["c1", "a2", "c3", "n4", "s:ow.2d", "a5"] },
    { k: "bc", icon: "meat",     c: "#7E0C41", time: "21:40", night: true, s: ["c1", "a2", "c3", "o4", "a5"] },
    { k: "fu", icon: "sofa",     c: "#8A5A00", time: "19:20", s: ["p1", "a2", "r3", "a4", "c5"] },
    { k: "cp", icon: "saw",      c: "#23683F", time: "11:50", s: ["c1", "a2", "p3", "o4", "a5"] },
    { k: "mk", icon: "jar",      c: "#8A5A00", time: "22:15", night: true, s: ["c1", "a2", "c3", "o4", "a5"] }
  ];
  var stage = document.getElementById("stage");
  var log = document.getElementById("log");
  var live = document.getElementById("scene-say");
  var pauseBtn = document.getElementById("pause");
  var chipsEl = document.getElementById("chips");
  var chipBtns = document.querySelectorAll("#chips [data-biz]");
  var SVGNS = "http://www.w3.org/2000/svg";
  var playing = !reduce, cur = 0, running = false, inView = true, ready = false;
  var timers = [];

  function later(fn, ms) { timers.push(setTimeout(fn, ms)); }
  function stopTimers() { timers.forEach(clearTimeout); timers = []; }
  function icon(id) {
    var s = document.createElementNS(SVGNS, "svg"), u = document.createElementNS(SVGNS, "use");
    s.setAttribute("aria-hidden", "true");
    u.setAttribute("href", "#i-" + id);
    s.appendChild(u);
    return s;
  }
  function text(key, tag, cls) {
    var el = document.createElement(tag || "span");
    if (cls) el.className = cls;
    el.setAttribute("data-i18n", key);
    el.textContent = t(key) || "";
    return el;
  }
  function setKey(el, key) { if (el) { el.setAttribute("data-i18n", key); var v = t(key); if (v !== null) el.textContent = v; } }
  function setIcon(el, id) { if (el) el.querySelector("use").setAttribute("href", "#i-" + id); }
  function message(sc, step, done) {
    var type = step.charAt(0), el = document.createElement("div"), key = "h." + sc.k + "." + step.slice(1);
    el.className = "m m-" + type;
    if (type === "s") { el.appendChild(text(step.slice(2))); return el; }
    if (type === "o" || type === "r" || type === "n") {
      var h = document.createElement("b");
      h.appendChild(icon("bell"));
      h.appendChild(text(type === "o" ? "ow.o" : type === "r" ? "ow.f" : "r.n"));
      el.appendChild(h);
      el.appendChild(text(key));
      if (type !== "n") {
        var b = document.createElement("i");
        b.className = "okb";
        b.appendChild(text(type === "o" ? (done ? "ow.d" : "ow.a") : (done ? "ow.rd" : "ow.r")));
        el.appendChild(b);
        if (done) el.className += " done";
      }
      return el;
    }
    if (type === "f") {
      var o = text(key, "span", "m-orig");
      o.setAttribute("data-foreign", "");
      o.setAttribute("data-i18n-lang", "d.ol");
      o.lang = t("d.ol") || "";
      el.appendChild(o);
      el.appendChild(text("d.tl", "b", "m-tl"));
      el.appendChild(text("h." + sc.k + "." + (+step.slice(1) + 1)));
      return el;
    }
    if (type === "p") {
      var ph = document.createElement("span");
      ph.className = "m-photo";
      ph.appendChild(icon(sc.k === "cp" ? "img" : sc.icon));
      ph.appendChild(text("ow.photo"));
      el.appendChild(ph);
    }
    el.appendChild(text(key));
    if (type === "a") el.appendChild(icon("ticks"));
    return el;
  }
  function finish(card) {
    if (!card || card.classList.contains("done")) return;
    card.classList.add("done");
    setKey(card.querySelector(".okb span"), card.classList.contains("m-o") ? "ow.d" : "ow.rd");
  }
  /* Arka plan: yeni yer 400 ms'de eskisinin üstüne açılır; telefonda bant, geniş ekranda sütun düzeni */
  var world = document.getElementById("world");
  var wide = window.matchMedia("(min-width:600px)");
  function backdrop(sc, now) {
    if (!world || !window.buildScene) return;
    var el = window.buildScene(sc.k, !!sc.night, wide.matches ? "P" : "B"), old = [].slice.call(world.children);
    if (old.length && !now && !reduce) el.classList.add("fade");
    world.appendChild(el);
    setTimeout(function () { old.forEach(function (o) { o.remove(); }); }, old.length && !now && !reduce ? 450 : 0);
  }
  if (wide.addEventListener) wide.addEventListener("change", function () { if (ready) backdrop(SCENES[cur], true); });
  function dress(sc) {
    stage.dataset.biz = sc.k;
    stage.style.setProperty("--aw", sc.c);
    stage.classList.toggle("is-night", !!sc.night);
    backdrop(sc);
    setIcon(document.getElementById("shop-i"), sc.icon);
    setIcon(document.getElementById("ph-ava"), sc.icon);
    ["shop-n", "ph-n"].forEach(function (id) { setKey(document.getElementById(id), "b." + sc.k); });
    setKey(document.getElementById("sign-text"), sc.night ? "demo.night" : "d.sign");
    setKey(document.getElementById("cap"), "cap." + sc.k);
    document.getElementById("ph-time").textContent = sc.time;
    chipBtns.forEach(function (b) {
      var on = b.getAttribute("data-biz") === sc.k;
      b.setAttribute("aria-pressed", String(on));
      if (on && chipsEl.scrollWidth > chipsEl.clientWidth + 2) {
        var x = b.offsetLeft - (chipsEl.clientWidth - b.offsetWidth) / 2;
        if (chipsEl.scrollTo) chipsEl.scrollTo({ left: Math.max(0, x), behavior: reduce ? "auto" : "smooth" });
      }
    });
  }
  function finishScene() {
    stopTimers();
    running = false;
    var sc = SCENES[cur];
    log.textContent = "";
    sc.s.forEach(function (st) { log.appendChild(message(sc, st, true)); });
  }
  function advance() {
    if (playing && inView && !document.hidden) later(function () { playScene((cur + 1) % SCENES.length, true); }, 2200);
  }
  function playScene(i, animate) {
    stopTimers();
    cur = i;
    var sc = SCENES[i];
    if (stage.dataset.biz !== sc.k || !world || !world.firstChild) dress(sc);
    if (!animate || reduce) { finishScene(); return; }
    running = true;
    log.textContent = "";
    var n = 0;
    (function step() {
      if (n >= sc.s.length) { running = false; advance(); return; }
      var st = sc.s[n++], type = st.charAt(0), talk = "cafp".indexOf(type) > -1, dots;
      function put() {
        if (dots) dots.remove();
        var el = message(sc, st, false), hold = Math.max(750, Math.min(1700, 450 + el.textContent.length * 19));
        el.classList.add("in");
        log.appendChild(el);
        if (type === "o" || type === "r") { later(function () { finish(el); }, hold); hold += 600; }
        later(step, hold);
      }
      if (!talk) { later(put, 250); return; }
      dots = document.createElement("div");
      dots.className = "m typing m-" + (type === "a" ? "a" : "c");
      dots.setAttribute("aria-hidden", "true");
      dots.innerHTML = "<i></i><i></i><i></i>";
      log.appendChild(dots);
      later(put, 480);
    })();
  }
  function setPlaying(on) {
    playing = on;
    if (pauseBtn) {
      var v = t(on ? "demo.pause" : "demo.play");
      if (v) pauseBtn.setAttribute("aria-label", v);
      pauseBtn.querySelector("use").setAttribute("href", on ? "#i-pause" : "#i-play");
    }
  }
  if (stage) {
    chipBtns.forEach(function (b, i) {
      b.addEventListener("click", function () {
        setPlaying(!reduce); /* dokunduktan sonra da otomatik geçiş sürer; durdurma düğmesi ayrı */
        /* yanan düğmeye yeniden dokunmak sohbeti sona atlar */
        if (i === cur && b.getAttribute("aria-pressed") === "true" && running) { finishScene(); advance(); }
        else playScene(i, true);
        if (live) live.textContent = t("b." + SCENES[i].k) + ". " + t("cap." + SCENES[i].k);
      });
    });
    if (pauseBtn) pauseBtn.addEventListener("click", function () {
      setPlaying(!playing);
      if (!playing) finishScene();
      else playScene((cur + 1) % SCENES.length, true);
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) finishScene();
      else if (playing && ready) playScene(cur, true);
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        var was = inView;
        inView = es[es.length - 1].isIntersecting;
        /* sahne görünürken yüzen WhatsApp düğmesi sohbeti kapatmasın */
        root.classList.toggle("stage-in", inView);
        if (!ready) return;
        if (was && !inView) finishScene();
        if (!was && inView && playing) playScene(cur, true);
      }, { threshold: 0.05 }).observe(stage);
    }
  }

  /* ---------- 8. Önce / sonra sürgüsü (dokunma, fare, klavye) ---------- */
  var ba = document.getElementById("ba");
  var range = document.getElementById("ba-range");
  if (ba && range) {
    var setX = function (v) {
      v = Math.max(0, Math.min(100, v));
      range.value = String(Math.round(v));
      ba.style.setProperty("--x", v + "%");
    };
    range.addEventListener("input", function () { setX(+range.value); });
    var dragging = false;
    var fromPointer = function (e) {
      var r = ba.getBoundingClientRect();
      setX(((e.clientX - r.left) / r.width) * 100);
    };
    ba.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      fromPointer(e);
      if (e.pointerType === "mouse") { try { ba.setPointerCapture(e.pointerId); } catch (x) {} }
    });
    ba.addEventListener("pointermove", function (e) { if (dragging) fromPointer(e); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ev) {
      ba.addEventListener(ev, function () { dragging = false; });
    });
  }

  /* ---------- 9. Sektörler: ilk altı, gerisi istek üzerine ---------- */
  var moreBtn = document.querySelector(".more-btn");
  var tilesEl = document.getElementById("tiles");
  if (moreBtn && tilesEl) {
    moreBtn.addEventListener("click", function () {
      var open = !tilesEl.classList.contains("open");
      tilesEl.classList.toggle("open", open);
      moreBtn.setAttribute("aria-expanded", String(open));
      moreBtn.textContent = t(open ? "who.showLess" : "who.showAll");
      if (open) {
        var first = tilesEl.querySelector(".extra summary");
        if (first) first.focus();
      }
    });
  }

  /* ---------- 10. Başlat ---------- */
  var start = window.SITE_LANG || "tr";
  loadDict(start, function () {
    apply(start);
    if (stage) { ready = true; setPlaying(!reduce); playScene(0, !reduce); }
  });
})();
