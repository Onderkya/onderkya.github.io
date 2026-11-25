(function () {
  "use strict";
  var root = document.documentElement;
  var PHONE = root.getAttribute("data-phone");
  var EMAIL = root.getAttribute("data-email");
  var DICT = window.I18N || {};
  var LANGS = ["tr", "en", "ru"];
  var current = "tr";

  /* 1. Türkçe metinleri sayfadan oku (tek kaynak HTML) */
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
  tr["meta.title"] = document.title;
  var metaDesc = document.querySelector('meta[name="description"]');
  tr["meta.desc"] = metaDesc ? metaDesc.getAttribute("content") : "";

  function t(key) {
    var d = DICT[current] || {};
    return key in d ? d[key] : tr[key];
  }

  /* 2. Fiyatlar: paketlerdeki data-price kutuları tek kaynak */
  var prices = {};
  document.querySelectorAll("[data-price]").forEach(function (el) {
    prices[el.getAttribute("data-price")] = el.textContent.trim();
  });
  function fillPrices() {
    document.querySelectorAll("[data-copy-price]").forEach(function (el) {
      el.textContent = prices[el.getAttribute("data-copy-price")] || "";
    });
  }

  /* 3. Bağlantılar (WhatsApp mesajı ve e-posta konusu dile göre) */
  function waLink(text) {
    return "https://wa.me/" + PHONE + "?text=" + encodeURIComponent(text);
  }
  function mailLink(subject, body) {
    return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function updateLinks() {
    document.querySelectorAll(".js-wa").forEach(function (a) {
      var pkg = a.getAttribute("data-pkg");
      a.href = pkg ? waLink(t("msg.pkg").replace("{pkg}", t(pkg))) : waLink(t("msg.wa"));
    });
    document.querySelectorAll(".js-review").forEach(function (a) {
      a.href = mailLink(t("msg.reviewSubject"), t("msg.reviewBody"));
    });
    document.querySelectorAll(".js-quote").forEach(function (a) {
      a.href = mailLink(t("msg.quoteSubject"), t("msg.quoteBody"));
    });
  }

  /* 4. Dil değiştirme */
  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "tr";
    current = lang;
    root.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      el.setAttribute("alt", t(el.getAttribute("data-i18n-alt")));
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
    });
    document.title = t("meta.title");
    if (metaDesc) metaDesc.setAttribute("content", t("meta.desc"));
    document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    fillPrices();
    updateLinks();
    setMenuLang(lang);
  }

  function initialLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q && LANGS.indexOf(q) >= 0) return q;
    try {
      var saved = localStorage.getItem("lang");
      if (saved && LANGS.indexOf(saved) >= 0) return saved;
    } catch (e) {}
    var nav = (navigator.language || "").toLowerCase();
    return nav.indexOf("ru") === 0 ? "ru" : "tr";
  }

  document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      var lang = b.getAttribute("data-lang");
      apply(lang);
      try { localStorage.setItem("lang", lang); } catch (e) {}
    });
  });

  /* 5. Konsept kafe menüsü: kendi TR/EN/RU sekmeleri */
  var MENU = {
    tr: { sub: "Menü · Masa 7", cat1: "Kahvaltı", cat2: "İçecekler", i1: "Menemen", i2: "Serpme kahvaltı (2 kişilik)", i3: "Türk kahvesi", i4: "Taze portakal suyu" },
    en: { sub: "Menu · Table 7", cat1: "Breakfast", cat2: "Drinks", i1: "Menemen (Turkish eggs)", i2: "Turkish breakfast spread (for 2)", i3: "Turkish coffee", i4: "Fresh orange juice" },
    ru: { sub: "Меню · Стол 7", cat1: "Завтрак", cat2: "Напитки", i1: "Менемен (яичница с томатами)", i2: "Турецкий завтрак (на двоих)", i3: "Турецкий кофе", i4: "Свежевыжатый апельсиновый сок" }
  };
  function setMenuLang(lang) {
    var m = MENU[lang] || MENU.tr;
    document.querySelectorAll("[data-menu-t]").forEach(function (el) {
      el.textContent = m[el.getAttribute("data-menu-t")];
    });
    document.querySelectorAll("[data-menu-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-menu-lang") === lang));
    });
  }
  document.querySelectorAll("[data-menu-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setMenuLang(b.getAttribute("data-menu-lang")); });
  });

  /* 6. Telefonda yüzen WhatsApp düğmesi: kahraman bölüm geçilince görünür */
  var floatBtn = document.querySelector(".float-wa");
  var hero = document.querySelector(".hero");
  var contact = document.querySelector("#iletisim");
  if (floatBtn && hero && "IntersectionObserver" in window) {
    var heroVisible = true, contactVisible = false;
    var sync = function () { floatBtn.classList.toggle("show", !heroVisible && !contactVisible); };
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; sync(); }).observe(hero);
    if (contact) new IntersectionObserver(function (e) { contactVisible = e[0].isIntersecting; sync(); }).observe(contact);
  }

  apply(initialLang());
})();
