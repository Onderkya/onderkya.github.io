(function () {
  "use strict";
  var root = document.documentElement;
  var CFG = window.ONDERA || {};
  var DICT = window.I18N || {};
  var LANGS = ["tr", "en", "ru"];
  var LOCALE = { tr: "tr-TR", en: "en-US", ru: "ru-RU" };
  var current = "tr";

  /* 1. Turkish source texts are read from the page itself (HTML is the TR source) */
  var tr = DICT.tr || (DICT.tr = {});
  function grab(attr, read) {
    document.querySelectorAll("[" + attr + "]").forEach(function (el) {
      var k = el.getAttribute(attr);
      if (!(k in tr)) tr[k] = read(el);
    });
  }
  grab("data-i18n", function (el) { return el.textContent.trim(); });
  grab("data-i18n-html", function (el) { return el.innerHTML.trim(); });
  grab("data-i18n-alt", function (el) { return el.getAttribute("alt"); });
  grab("data-i18n-aria", function (el) { return el.getAttribute("aria-label"); });

  var META = {
    title: { el: null, sel: "title" },
    desc: { sel: 'meta[name="description"]' },
    ogTitle: { sel: 'meta[property="og:title"]' },
    ogDesc: { sel: 'meta[property="og:description"]' },
    ogLocale: { sel: 'meta[property="og:locale"]' }
  };
  Object.keys(META).forEach(function (k) {
    var el = document.querySelector(META[k].sel);
    META[k].el = el;
    var key = "meta." + k;
    if (el && !(key in tr)) tr[key] = k === "title" ? document.title : el.getAttribute("content");
  });

  function t(key) {
    var d = DICT[current] || {};
    var s = key in d ? d[key] : key in tr ? tr[key] : (DICT.en && DICT.en[key]) || "";
    /* {site.first}, {care.basic}… are replaced with prices from js/config.js */
    return s.replace(/\{([a-z]+\.[a-z]+)\}/g, function (m, path) {
      var v = priceOf(path);
      return v === null ? m : fmt(v);
    });
  }

  /* 2. Prices come from js/config.js */
  function priceOf(path) {
    var parts = path.split("."), v = CFG.prices;
    for (var i = 0; v && i < parts.length; i++) v = v[parts[i]];
    return typeof v === "number" ? v : null;
  }
  function fmt(n) {
    try {
      return new Intl.NumberFormat(LOCALE[current], { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
    } catch (e) { return "$" + n; }
  }
  function fillPrices() {
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var v = priceOf(el.getAttribute("data-price"));
      if (v !== null) el.textContent = fmt(v);
    });
  }

  /* 3. WhatsApp / e-mail links in the current language */
  var PHONE = CFG.phone || "905340679661";
  var EMAIL = CFG.email || "onderkya35@gmail.com";
  function waLink(text) { return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text); }
  function updateLinks() {
    document.querySelectorAll(".js-wa").forEach(function (a) {
      var pkg = a.getAttribute("data-pkg");
      var msg = a.getAttribute("data-msg");
      var text = pkg ? t("msg.pkg").replace("{pkg}", t(pkg)) : t(msg || "msg.wa");
      a.href = waLink(text);
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

  /* 4. Apply a language */
  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    current = lang;
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) { el.setAttribute("alt", t(el.getAttribute("data-i18n-alt"))); });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    document.title = t("meta.title");
    ["desc", "ogTitle", "ogDesc", "ogLocale"].forEach(function (k) {
      if (META[k].el) META[k].el.setAttribute("content", t("meta." + k));
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    var mb = document.querySelector(".menu-btn");
    if (mb) mb.setAttribute("aria-label", t(mb.getAttribute("aria-expanded") === "true" ? "nav.close" : "nav.open"));
    fillPrices();
    updateLinks();
    setMenuLang(lang);
    root.classList.remove("i18n-wait");
  }

  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      var lang = b.getAttribute("data-lang");
      apply(lang);
      try { localStorage.setItem("ondera-lang", lang); } catch (e) {}
      try {
        var u = new URL(location.href);
        if (u.searchParams.has("lang")) { u.searchParams.set("lang", lang); history.replaceState(null, "", u); }
      } catch (e) {}
    });
  });

  /* 5. Concept cafe menu: its own TR / EN / RU tabs */
  var MENU = {
    tr: { sub: "Menü · Masa 7", cat1: "Kahvaltı", cat2: "İçecekler", i1: "Menemen", i2: "Serpme kahvaltı (2 kişilik)", i3: "Türk kahvesi", i4: "Taze portakal suyu" },
    en: { sub: "Menu · Table 7", cat1: "Breakfast", cat2: "Drinks", i1: "Menemen (Turkish eggs)", i2: "Turkish breakfast spread (for 2)", i3: "Turkish coffee", i4: "Fresh orange juice" },
    ru: { sub: "Меню · Стол 7", cat1: "Завтрак", cat2: "Напитки", i1: "Менемен (яичница с томатами)", i2: "Турецкий завтрак (на двоих)", i3: "Турецкий кофе", i4: "Свежевыжатый апельсиновый сок" }
  };
  function setMenuLang(lang) {
    var m = MENU[lang] || MENU.tr;
    document.querySelectorAll("[data-menu-t]").forEach(function (el) { el.textContent = m[el.getAttribute("data-menu-t")]; });
    document.querySelectorAll("[data-menu-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-menu-lang") === lang));
    });
  }
  document.querySelectorAll("[data-menu-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setMenuLang(b.getAttribute("data-menu-lang")); });
  });

  /* 5b. Sector list on phones: first six, the rest on request */
  var whoBtn = document.querySelector(".who-toggle");
  if (whoBtn) whoBtn.addEventListener("click", function () {
    var list = document.querySelector(".who");
    list.classList.add("open");
    whoBtn.setAttribute("aria-expanded", "true");
    whoBtn.parentNode.hidden = true;
    var first = list.querySelector(".who-extra h3");
    if (first) { first.setAttribute("tabindex", "-1"); first.focus({ preventScroll: true }); }
  });

  /* 6. Mobile menu */
  var menuBtn = document.querySelector(".menu-btn");
  var mnav = document.getElementById("mnav");
  function setMenu(open) {
    if (!menuBtn || !mnav) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
    mnav.hidden = !open;
  }
  if (menuBtn && mnav) {
    menuBtn.addEventListener("click", function () { setMenu(menuBtn.getAttribute("aria-expanded") !== "true"); });
    mnav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* 7. Header border on scroll */
  var top = document.querySelector(".top");
  function onScroll() { if (top) top.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 8. Subtle reveal on scroll + floating WhatsApp button */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -40px 0px", threshold: 0.05 });
    document.querySelectorAll("[data-reveal]").forEach(function (el) { io.observe(el); });

    var floatBtn = document.querySelector(".float-wa");
    var hero = document.querySelector(".hero");
    var contact = document.getElementById("iletisim");
    if (floatBtn && hero) {
      var heroVis = true, contactVis = false;
      var sync = function () { floatBtn.classList.toggle("show", !heroVis && !contactVis); };
      new IntersectionObserver(function (e) { heroVis = e[0].isIntersecting; sync(); }).observe(hero);
      if (contact) new IntersectionObserver(function (e) { contactVis = e[0].isIntersecting; sync(); }).observe(contact);
    }
  } else {
    document.querySelectorAll("[data-reveal]").forEach(function (el) { el.classList.add("in"); });
  }

  apply(window.__ONDERA_LANG || "tr");
})();
