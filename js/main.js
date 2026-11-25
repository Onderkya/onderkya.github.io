/* Ondera Studio: dil, demo, önce/sonra sürgüsü, menüler. Bağımlılık yok. */
(function () {
  "use strict";
  var root = document.documentElement;
  var CFG = window.ONDERA || {};
  var DICT = window.I18N || (window.I18N = {});
  var LANGS = ["tr", "en", "ru", "kk", "uz", "ky"];
  var LOCALE = { tr: "tr-TR", en: "en-US", ru: "ru-RU", kk: "kk-KZ", uz: "uz-Latn-UZ", ky: "ky-KG" };
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = "tr";
  root.classList.add("js");

  /* ---------- 1. Türkçe kaynak metin sayfanın kendisidir ---------- */
  var TR_EXTRA = {
    "who.1.pay": "Başlangıç {site.first}, yani bir iki buket. Bakım ayda {care.basic}, bir buketten az.",
    "who.2.pay": "Bakım ayda {care.basic}, bir saç kesiminden az; ayda bir yeni müşteri kendini öder.",
    "who.3.pay": "Bakım ayda {care.basic}, bir manikürden az.",
    "who.5.pay": "QR menü başlangıç {menu.first}: birkaç masanın hesabı kadar.",
    "care.pay": "Temel bakım ayda {care.basic}: bir saç kesiminden az. Ayda bir yeni müşteri kendini öder.",
    "why.6.d": "Temel bakım ayda {care.basic}: çoğu işletmede bir saç kesiminden ya da bir buketten az. Fiyat ve fotoğraf değişikliklerini biz yaparız.",
    "who.showLess": "Daha az gösterin",
    "nav.close": "Menüyü kapatın",
    "demo.play": "Demoyu oynatın",
    "demo.say.day": "Gündüz: örnek çiçekçi sitesi Türkçe açık.",
    "demo.say.ru": "Aynı site Rusça.",
    "demo.say.night": "Gece 23:41: dükkân kapalı, site açık; WhatsApp mesajları geliyor.",
    "meta.ogLocale": "tr_TR",
    "care.basic.name": "Temel bakım planı",
    "care.std.name": "Standart bakım planı",
    "care.plus.name": "Plus bakım planı",
    "msg.wa": "Merhaba Önder, Ondera Studio'nun sitesinden yazıyorum. İşletmem için web sitesi hakkında bilgi almak istiyorum.",
    "msg.draft": "Merhaba Önder, işletmem için ücretsiz taslak istiyorum.\n\nİşletme adı:\nSektör:\nMevcut site / Instagram bağlantısı (varsa):",
    "msg.review": "Merhaba Önder, işletmem için ücretsiz site incelemesi rica ediyorum.\n\nİşletme adı:\nMevcut site / Instagram / Google Haritalar bağlantısı:",
    "msg.pkg": "Merhaba Önder, “{pkg}” hakkında bilgi almak istiyorum.",
    "msg.offer": "Merhaba Önder, ilk 5 işletmeye özel fiyattan yararlanmak istiyorum. İşletmem:",
    "msg.quote": "Merhaba Önder, işletmem için özel bir proje hakkında teklif almak istiyorum. Kısaca ihtiyacımız:",
    "msg.quoteSubject": "Teklif talebi – Ondera Studio",
    "msg.quoteBody": "Merhaba Önder,\n\nŞirket:\nİhtiyacımız:\nYetkili kişi ve telefon:\n\nTeşekkürler.",
    "msg.mailSubject": "Web sitesi hakkında – Ondera Studio",
    "msg.mailBody": "Merhaba Önder,\n\nİşletme adı:\nMevcut site / Instagram bağlantısı:\nNe istiyoruz:\n\nTeşekkürler."
  };
  var tr = DICT.tr = DICT.tr || {};
  function grab(attr, read) {
    document.querySelectorAll("[" + attr + "]").forEach(function (el) {
      var k = el.getAttribute(attr);
      if (!(k in tr)) tr[k] = read(el);
    });
  }
  grab("data-i18n", function (el) { return el.textContent.trim(); });
  grab("data-i18n-alt", function (el) { return el.getAttribute("alt"); });
  grab("data-i18n-aria", function (el) { return el.getAttribute("aria-label"); });
  Object.keys(TR_EXTRA).forEach(function (k) { tr[k] = TR_EXTRA[k]; });

  var META = {
    title: "title",
    desc: 'meta[name="description"]',
    ogTitle: 'meta[property="og:title"]',
    ogDesc: 'meta[property="og:description"]',
    ogLocale: 'meta[property="og:locale"]'
  };
  Object.keys(META).forEach(function (k) {
    var el = document.querySelector(META[k]);
    META[k] = el;
    var key = "meta." + k;
    if (el && !(key in tr)) tr[key] = k === "title" ? document.title : el.getAttribute("content");
  });

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
  function t(key) {
    var d = DICT[current] || {};
    var s = key in d ? d[key] : (DICT.en && key in DICT.en) ? DICT.en[key] : key in tr ? tr[key] : "";
    return String(s).replace(/\{([a-z]+\.[a-z]+)\}/g, function (m, path) {
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
      var text = pkg ? t("msg.pkg").replace("{pkg}", t(pkg)) : t(a.getAttribute("data-msg") || "msg.wa");
      a.href = "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
      a.target = "_blank";
    });
    document.querySelectorAll(".js-mail").forEach(function (a) {
      var s = t(a.getAttribute("data-subject") || "msg.mailSubject");
      var b = t(a.getAttribute("data-body") || "msg.mailBody");
      a.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(s) + "&body=" + encodeURIComponent(b);
    });
    document.querySelectorAll(".js-phone").forEach(function (el) { if (CFG.phoneDisplay) el.textContent = CFG.phoneDisplay; });
    document.querySelectorAll(".js-email").forEach(function (el) { el.textContent = EMAIL; });
  }

  /* ---------- 4. Dil dosyasını yükle ve uygula ---------- */
  function loadDict(lang, cb) {
    if (lang === "tr" || DICT[lang]) return cb();
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

  var SIGN = { tr: "AÇIK", en: "OPEN", ru: "ОТКРЫТО", kk: "АШЫҚ", uz: "OCHIQ", ky: "АЧЫК" };
  var SIGN_ORDER = ["tr", "en", "ru", "kk", "uz", "ky"];
  var signEl = document.getElementById("sign-text");
  var signIdx = 0;

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    current = lang;
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) { el.setAttribute("alt", t(el.getAttribute("data-i18n-alt"))); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.title = t("meta.title");
    ["desc", "ogTitle", "ogDesc", "ogLocale"].forEach(function (k) {
      if (META[k]) META[k].setAttribute("content", t("meta." + k));
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
    if (live && stage) live.textContent = t("demo.say." + stage.dataset.scene);
    if (signEl) { signIdx = SIGN_ORDER.indexOf(lang); signEl.textContent = SIGN[lang]; }
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var v = priceOf(el.getAttribute("data-price"));
      if (v !== null) el.textContent = fmt(v);
    });
    updateLinks();
    setMenuLang(lang === "tr" || lang === "en" ? lang : lang === "uz" ? "en" : "ru");
    root.classList.remove("i18n-wait");
  }

  function choose(lang) {
    loadDict(lang, function () {
      apply(lang);
      try { localStorage.setItem("ondera-lang", lang); } catch (e) {}
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

  /* ---------- 7. Kahraman demosu: gündüz → Rusça → gece ---------- */
  var stage = document.getElementById("stage");
  var live = document.getElementById("scene-say");
  var pauseBtn = document.getElementById("pause");
  var playing = !reduce;
  var timer = 0, signTimer = 0;
  var tabs = document.querySelectorAll("[data-go]");
  var ORDER = ["day", "ru", "night"];
  var HOLD = { day: 3200, ru: 3000, night: 7000 };

  function show(name) {
    stage.dataset.scene = name;
    tabs.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.go === name)); });
    if (live) live.textContent = t("demo.say." + name);
  }
  function next() {
    clearTimeout(timer);
    if (!playing) return;
    timer = setTimeout(function () {
      show(ORDER[(ORDER.indexOf(stage.dataset.scene) + 1) % ORDER.length]);
      next();
    }, HOLD[stage.dataset.scene]);
  }
  function cycleSign() {
    clearInterval(signTimer);
    if (!playing || !signEl) return;
    signTimer = setInterval(function () {
      signIdx = (signIdx + 1) % SIGN_ORDER.length;
      signEl.textContent = SIGN[SIGN_ORDER[signIdx]];
    }, 1500);
  }
  function setPlaying(on) {
    playing = on;
    if (pauseBtn) {
      pauseBtn.setAttribute("aria-label", t(on ? "demo.pause" : "demo.play"));
      pauseBtn.querySelector("use").setAttribute("href", on ? "#i-pause" : "#i-play");
      pauseBtn.setAttribute("aria-pressed", String(!on));
    }
    if (on) { next(); cycleSign(); }
    else { clearTimeout(timer); clearInterval(signTimer); if (signEl) signEl.textContent = SIGN[current]; }
  }
  if (stage) {
    tabs.forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.go); setPlaying(false); });
    });
    if (pauseBtn) pauseBtn.addEventListener("click", function () { setPlaying(!playing); });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { clearTimeout(timer); clearInterval(signTimer); }
      else if (playing) { next(); cycleSign(); }
    });
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

  /* ---------- 9. Sektörler: telefonda ilk altı, gerisi istek üzerine ---------- */
  var moreBtn = document.querySelector(".more-btn");
  var tilesEl = document.getElementById("tiles");
  if (moreBtn && tilesEl) {
    moreBtn.addEventListener("click", function () {
      var open = !tilesEl.classList.contains("open");
      tilesEl.classList.toggle("open", open);
      moreBtn.setAttribute("aria-expanded", String(open));
      moreBtn.textContent = t(open ? "who.showLess" : "who.showAll");
      if (open) {
        var first = tilesEl.querySelector(".extra h3");
        if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: false }); }
      }
    });
  }

  /* ---------- 10. Örnek kafe menüsü: kendi TR / EN / RU düğmeleri ---------- */
  var MENU = {
    tr: { sub: "Menü · Masa 7", cat1: "Kahvaltı", cat2: "İçecekler", i1: "Menemen", i2: "Serpme kahvaltı (2 kişilik)", i3: "Türk kahvesi", i4: "Taze portakal suyu" },
    en: { sub: "Menu · Table 7", cat1: "Breakfast", cat2: "Drinks", i1: "Menemen (Turkish eggs)", i2: "Turkish breakfast spread (for 2)", i3: "Turkish coffee", i4: "Fresh orange juice" },
    ru: { sub: "Меню · Стол 7", cat1: "Завтрак", cat2: "Напитки", i1: "Менемен (яичница с томатами)", i2: "Турецкий завтрак (на двоих)", i3: "Турецкий кофе", i4: "Свежевыжатый апельсиновый сок" }
  };
  function setMenuLang(lang) {
    var m = MENU[lang] || MENU.tr;
    document.querySelectorAll("[data-menu-t]").forEach(function (el) {
      el.textContent = m[el.getAttribute("data-menu-t")];
      el.setAttribute("lang", lang);
    });
    document.querySelectorAll("[data-menu-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-menu-lang") === lang));
    });
  }
  document.querySelectorAll("[data-menu-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setMenuLang(b.getAttribute("data-menu-lang")); });
  });

  /* ---------- 11. Başlat ---------- */
  var start = window.ONDERA_LANG || "tr";
  if (stage) {
    if (reduce) show("night"); else show("day");
  }
  loadDict(start, function () {
    apply(start);
    if (stage) setPlaying(!reduce);
  });
})();
