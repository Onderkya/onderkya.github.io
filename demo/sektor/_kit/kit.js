/* Onaz Studio sektör kiti: dil, tema, açık/kapalı rozeti, kayan şeritler, talep akışı → WhatsApp/Telegram, dock, harita.
   Kullanım: sayfa, kit.js'den ÖNCE window.SITE = { id, cfg, theme, i18n:{tr,ru,en}, flows, quotes } tanımlar. */
(function () {
  'use strict';
  var S = window.SITE, C = S.cfg, D = S.i18n, LANGS = C.langs || ['tr', 'ru', 'en'];
  var BASE = {
    tr: {
      k_wa: 'WhatsApp', k_tg: 'Telegram', k_call: 'Ara', k_route: 'Yol tarifi', k_back: 'Geri', k_next: 'Devam',
      k_skip: 'Atla', k_close: 'Kapat', k_step: 'Adım {a}/{b}', k_send_wa: "WhatsApp'tan gönder", k_send_tg: "Telegram'dan gönder",
      k_ready: 'Mesajınız hazır', k_ready_sub: 'Göndermeden önce WhatsApp ya da Telegram içinde değiştirebilirsiniz.',
      k_copied: 'Mesaj kopyalandı. Telegram açılınca sohbete yapıştırın.', k_optional: 'İsteğe bağlı', k_note_ph: 'Kısa bir not yazabilirsiniz',
      k_orig: 'Orijinali göster', k_trans: 'Çeviriyi göster', k_trans_note: 'Çeviri · orijinali {l}', k_l_ru: 'Rusça', k_l_tr: 'Türkçe', k_l_en: 'İngilizce',
      k_theme: 'Tema değiştir', k_lang: 'Dil', k_open: 'Şu an açık', k_closed: 'Şu an kapalı', k_until: '{t} saatine kadar', k_opens: '{t} açılıyor',
      k_demo: 'Demo · Onaz Studio tarafından {name} için hazırlanmıştır.', k_photos: 'Görseller temsilidir (Unsplash). Kendi fotoğraflarınızla değişir.',
      k_map_g: 'Google Haritalar', k_map_y: 'Yandex Haritalar', k_from: 'Alış', k_to: 'Dönüş', k_date: 'Tarih', k_choose: 'Seçin',
      k_hello: 'Merhaba!', k_req: 'TALEP', k_lang_line: 'Müşteri dili', k_top: 'Başa dön', k_map_title: 'Harita', k_today: 'Bugün', k_tomorrow: 'Yarın', k_night_h: 'Gece 2’de bile yazın.', k_night_p: 'Birkaç dokunuşla talebiniz hazır bir WhatsApp mesajına dönüşür: sizin dilinizde, altında işletme için Türkçe özetle. İşletme müsait olunca size döner.', k_night_sum: 'Türkçe özet', k_night_cta: 'Talebimi hazırla', k_night_auto: 'Mesaj gönderildi'
    },
    ru: {
      k_wa: 'WhatsApp', k_tg: 'Telegram', k_call: 'Позвонить', k_route: 'Маршрут', k_back: 'Назад', k_next: 'Далее',
      k_skip: 'Пропустить', k_close: 'Закрыть', k_step: 'Шаг {a}/{b}', k_send_wa: 'Отправить в WhatsApp', k_send_tg: 'Отправить в Telegram',
      k_ready: 'Сообщение готово', k_ready_sub: 'Перед отправкой его можно изменить в WhatsApp или Telegram.',
      k_copied: 'Сообщение скопировано. Вставьте его в чат, когда откроется Telegram.', k_optional: 'По желанию', k_note_ph: 'Можно добавить короткую заметку',
      k_orig: 'Показать оригинал', k_trans: 'Показать перевод', k_trans_note: 'Перевод · оригинал: {l}', k_l_ru: 'русский', k_l_tr: 'турецкий', k_l_en: 'английский',
      k_theme: 'Сменить тему', k_lang: 'Язык', k_open: 'Сейчас открыто', k_closed: 'Сейчас закрыто', k_until: 'до {t}', k_opens: 'откроется в {t}',
      k_demo: 'Демо · подготовлено Onaz Studio для {name}.', k_photos: 'Фото иллюстративные (Unsplash). Их заменят ваши собственные.',
      k_map_g: 'Google Карты', k_map_y: 'Яндекс Карты', k_from: 'Получение', k_to: 'Возврат', k_date: 'Дата', k_choose: 'Выберите',
      k_hello: 'Здравствуйте!', k_req: 'ЗАПРОС', k_lang_line: 'Язык клиента', k_top: 'Наверх', k_map_title: 'Карта', k_night_h: 'Пишите даже в 2 ночи.', k_night_p: 'Пара касаний — и запрос превращается в готовое сообщение WhatsApp: на вашем языке, с кратким переводом на турецкий для мастера. Вам ответят, как только освободятся.', k_night_sum: 'Кратко по-турецки', k_night_cta: 'Подготовить запрос', k_night_auto: 'Сообщение отправлено', k_today: 'Сегодня', k_tomorrow: 'Завтра'
    },
    en: {
      k_wa: 'WhatsApp', k_tg: 'Telegram', k_call: 'Call', k_route: 'Directions', k_back: 'Back', k_next: 'Next',
      k_skip: 'Skip', k_close: 'Close', k_step: 'Step {a}/{b}', k_send_wa: 'Send on WhatsApp', k_send_tg: 'Send on Telegram',
      k_ready: 'Your message is ready', k_ready_sub: 'You can still edit it in WhatsApp or Telegram before sending.',
      k_copied: 'Message copied. Paste it into the chat when Telegram opens.', k_optional: 'Optional', k_note_ph: 'Add a short note if you like',
      k_orig: 'Show original', k_trans: 'Show translation', k_trans_note: 'Translation · original in {l}', k_l_ru: 'Russian', k_l_tr: 'Turkish', k_l_en: 'English',
      k_theme: 'Change theme', k_lang: 'Language', k_open: 'Open now', k_closed: 'Closed now', k_until: 'until {t}', k_opens: 'opens at {t}',
      k_demo: 'Demo · prepared by Onaz Studio for {name}.', k_photos: 'Photos are illustrative (Unsplash) and will be replaced with your own.',
      k_map_g: 'Google Maps', k_map_y: 'Yandex Maps', k_from: 'Pick-up', k_to: 'Return', k_date: 'Date', k_choose: 'Choose',
      k_hello: 'Hello!', k_req: 'REQUEST', k_lang_line: 'Customer language', k_top: 'Back to top', k_map_title: 'Map', k_today: 'Today', k_tomorrow: 'Tomorrow', k_night_h: 'Message us even at 2 a.m.', k_night_p: 'A few taps turn your request into a ready WhatsApp message: in your language, with a Turkish summary for the business underneath. They reply as soon as they are free.', k_night_sum: 'Turkish summary', k_night_cta: 'Prepare my request', k_night_auto: 'Message sent'
    }
  };
  LANGS.forEach(function (l) { D[l] = Object.assign({}, BASE[l] || BASE.en, D[l] || {}); });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = { get: function (k) { try { return localStorage.getItem(S.id + ':' + k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(S.id + ':' + k, v); } catch (e) {} } };
  var lang;
  function fill(s, o) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return o && o[k] != null ? o[k] : (C[k] != null ? C[k] : m); }); }
  function t(k, o, l) { var d = D[l || lang] || D.tr; var v = d[k]; if (v == null) v = D.tr[k]; if (v == null) { console.warn('i18n eksik', k); v = k; } return fill(v, o); }
  window.KIT = { t: function (k, o, l) { return t(k, o, l); }, lang: function () { return lang; }, cfg: C, $: $, $$: $$ };

  /* ---------- dil ---------- */
  function pickLang() {
    var q = new URLSearchParams(location.search).get('lang');
    if (q && LANGS.indexOf(q) > -1) return q;
    var s = store.get('lang'); if (s && LANGS.indexOf(s) > -1) return s;
    var n = (navigator.language || 'tr').slice(0, 2);
    if (n === 'kk' || n === 'uz' || n === 'ky' || n === 'uk' || n === 'be') n = 'ru';
    return LANGS.indexOf(n) > -1 ? n : (C.defaultLang || 'tr');
  }
  function applyLang(l) {
    lang = l; store.set('lang', l);
    document.documentElement.lang = l;
    $$('[data-t]').forEach(function (el) { el.textContent = t(el.getAttribute('data-t')); });
    $$('[data-th]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-th')); });
    $$('[data-ta]').forEach(function (el) {
      el.getAttribute('data-ta').split(';').forEach(function (p) { var a = p.split(':'); if (a[1]) el.setAttribute(a[0].trim(), t(a[1].trim())); });
    });
    $$('[data-setlang]').forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-setlang') === l ? 'true' : 'false'); });
    if (D[l].page_title) document.title = t('page_title');
    var md = $('meta[name="description"]'); if (md && D[l].page_desc) md.setAttribute('content', t('page_desc'));
    renderDock(); renderQuotes(); renderMap(); renderBadge(); renderNight();
    var u = new URL(location.href); u.searchParams.set('lang', l); history.replaceState(null, '', u);
    document.dispatchEvent(new CustomEvent('kit:lang', { detail: l }));
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-setlang]'); if (b) { applyLang(b.getAttribute('data-setlang')); }
  });

  /* ---------- tema ---------- */
  var theme = store.get('theme') || S.theme || 'light';
  function applyTheme(th) {
    theme = th; document.documentElement.setAttribute('data-theme', th); store.set('theme', th);
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--k-bg').trim() || '#fff');
  }
  applyTheme(theme);
  document.addEventListener('click', function (e) { if (e.target.closest('[data-theme-toggle]')) applyTheme(theme === 'dark' ? 'light' : 'dark'); });

  /* ---------- bağlantılar ---------- */
  var q = encodeURIComponent(C.name + ' ' + C.address);
  var L = {
    wa: function (txt) { return 'https://wa.me/' + C.phone + (txt ? '?text=' + encodeURIComponent(txt) : ''); },
    tg: C.telegram ? 'https://t.me/' + C.telegram : 'https://t.me/+' + C.phone,
    tel: 'tel:+' + C.phone,
    g: C.mapsGoogle || 'https://www.google.com/maps/search/?api=1&query=' + q,
    y: C.mapsYandex || 'https://yandex.com.tr/maps/?text=' + q
  };
  KIT.links = L;
  function ruFirst() { return lang === 'ru'; }
  function svg(id) { return '<svg aria-hidden="true" width="22" height="22"><use href="#' + id + '"/></svg>'; }
  var ICONS = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    '<symbol id="k-wa" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></symbol>' +
    '<symbol id="k-tg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.4 3.6 2.9 10.8c-1.3.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.4.8.8.8.4 0 .6-.2.8-.4l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8l3.1-14.7c.3-1.3-.5-1.9-1.3-1.5ZM9.6 14.3l-.4 3.7-1.4-4.6 10.3-6.6-8.5 7.5Z"/></symbol>' +
    '<symbol id="k-call" viewBox="0 0 24 24"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></symbol>' +
    '<symbol id="k-route" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></symbol>' +
    '<symbol id="k-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.5" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></g></symbol>' +
    '<symbol id="k-moon" viewBox="0 0 24 24"><path fill="currentColor" d="M20.7 14.6A8.6 8.6 0 0 1 9.4 3.3a8.6 8.6 0 1 0 11.3 11.3Z"/></symbol>' +
    '<symbol id="k-up" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" d="M6 14l6-6 6 6"/></symbol>' +
    '<symbol id="k-ig" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3" fill="currentColor"/></symbol>' +
    '</svg>';
  document.body.insertAdjacentHTML('afterbegin', ICONS);
  $$('[data-link]').forEach(function (a) {
    var k = a.getAttribute('data-link');
    a.href = k === 'wa' ? L.wa(t('wa_hello')) : L[k]; a.target = k === 'tel' ? '' : '_blank'; a.rel = 'noopener';
    if (k === 'tg') a.addEventListener('click', function (e) { e.preventDefault(); tgSend(t('wa_hello')); });
  });

  /* ---------- dock ---------- */
  function renderDock() {
    var d = $('#k-dock'); if (!d) return;
    var items = [['wa', L.wa(t('wa_hello')), 'k-wa', 'k_wa'], ['tg', L.tg, 'k-tg', 'k_tg'], ['tel', L.tel, 'k-call', 'k_call'], ['route', ruFirst() ? L.y : L.g, 'k-route', 'k_route']];
    if (ruFirst()) items = [items[1], items[0], items[2], items[3]];
    d.innerHTML = items.map(function (i) {
      return '<a class="k-dock__a k-dock__' + i[0] + '" href="' + i[1] + '"' + (i[0] === 'tel' ? '' : ' target="_blank" rel="noopener"') + ' data-dock="' + i[0] + '">' + svg(i[2]) + '<span>' + t(i[3]) + '</span></a>';
    }).join('');
    var tg = $('[data-dock="tg"]', d); tg.addEventListener('click', function (e) { e.preventDefault(); tgSend(t('wa_hello')); });
  }

  /* ---------- gece talebi: <section data-night></section> + SITE.night = { flow, tr: [Türkçe özet satırları] } + sözlükte night_msg ---------- */
  var nightSeen = false;
  function renderNight() {
    var el = $('[data-night]'); if (!el || !S.night) return;
    var N = S.night, esc = function (x) { return String(x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
    el.classList.add('k-night'); if (nightSeen) el.classList.add('is-in');
    el.innerHTML = '<div class="k-night__in"><div class="k-night__copy"><span class="k-night__moon" aria-hidden="true"></span><h2>' + esc(t('k_night_h')) + '</h2><p>' + esc(t('k_night_p')) + '</p>' +
      (N.flow ? '<button type="button" class="k-btn k-btn--main" data-flow="' + N.flow + '">' : '<a class="k-btn k-btn--main" href="' + (N.href || '#') + '">') + svg('k-wa') + esc(t('k_night_cta')) + (N.flow ? '</button>' : '</a>') + '</div>' +
      '<div class="k-night__phone" aria-hidden="true"><div class="k-night__bar"><b>' + esc(C.name) + '</b><span>02:14</span></div><div class="k-night__chat">' +
      '<div class="k-night__b k-night__b--me">' + esc(t('k_hello')) + ' ' + esc(t('night_msg')).replace(/\n/g, '<br>') + '<small>02:14 ✓✓</small></div>' +
      '<div class="k-night__b k-night__b--me k-night__b--sum"><em>' + esc(t('k_night_sum')) + '</em>' + N.tr.map(esc).join('<br>') + '<small>02:14 ✓✓</small></div>' +
      '<div class="k-night__sent">' + esc(t('k_night_auto')) + '</div></div></div></div>';
    if (!nightSeen && 'IntersectionObserver' in window) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { nightSeen = true; el.classList.add('is-in'); o.disconnect(); } }, { threshold: 0.35 }).observe(el);
    else el.classList.add('is-in');
  }

  /* ---------- toast ---------- */
  var toastEl;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'k-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('is-on'); }, 3600);
  }
  function tgSend(txt) {
    var done = function () { toast(t('k_copied')); setTimeout(function () { window.open(L.tg, '_blank', 'noopener'); }, 700); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(done, done); else done();
  }
  KIT.toast = toast; KIT.tgSend = tgSend;

  /* ---------- açık / kapalı ---------- */
  function renderBadge() {
    var el = $('[data-open-badge]'); if (!el) return;
    if (!C.hours) { el.hidden = true; return; }
    var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    var day = now.getDay(), h = C.hours[day] || null, min = now.getHours() * 60 + now.getMinutes();
    var m2 = function (s) { var p = s.split(':'); return +p[0] * 60 + +p[1]; };
    var open = h && min >= m2(h[0]) && min < m2(h[1]);
    var next = h && min < m2(h[0]) ? h[0] : (C.hours[(day + 1) % 7] || [''])[0];
    el.hidden = false; el.classList.toggle('is-open', !!open);
    el.innerHTML = '<i aria-hidden="true"></i><b>' + t(open ? 'k_open' : 'k_closed') + '</b><span>' + (open ? t('k_until', { t: h[1] }) : (next ? t('k_opens', { t: next }) : '')) + '</span>';
  }

  /* ---------- yorum alıntıları ---------- */
  function renderTicker() {
    $$('[data-ticker]').forEach(function (box) {
      var items = (S.quotes || []).map(function (qq) {
        var same = qq.lang === lang;
        return '<span class="k-tick"><q lang="' + (same ? qq.lang : lang) + '">' + esc(same ? qq.orig : (qq[lang] || qq.orig)) + '</q><small>' + esc(t(qq.who)) + '</small></span>';
      }).join('') + (S.tickerExtra ? S.tickerExtra.map(function (k) { return '<span class="k-tick"><b>' + esc(t(k)) + '</b></span>'; }).join('') : '');
      box.classList.add('k-marquee');
      box.innerHTML = '<div>' + items + items + '</div><div aria-hidden="true">' + items + items + '</div>';
    });
  }
  function renderQuotes() {
    renderTicker();
    $$('[data-quotes]').forEach(function (box) {
      var list = S.quotes || [];
      box.innerHTML = list.map(function (qq, i) {
        var same = qq.lang === lang, txt = same ? qq.orig : (qq[lang] || qq.orig);
        return '<figure class="k-quote" data-i="' + i + '"><blockquote lang="' + (same ? qq.lang : lang) + '">' + esc(txt) + '</blockquote>' +
          '<figcaption><span>' + esc(t(qq.who)) + '</span>' + (same ? '' : '<small>' + esc(t('k_trans_note', { l: t('k_l_' + qq.lang) })) + '</small>') +
          (same ? '' : '<button type="button" class="k-quote__sw" data-orig="0">' + esc(t('k_orig')) + '</button>') +
          (qq.url ? '<a href="' + qq.url + '" target="_blank" rel="noopener">' + esc(t(qq.src || 'k_map_y')) + '</a>' : '') + '</figcaption></figure>';
      }).join('');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.k-quote__sw'); if (!b) return;
    var f = b.closest('.k-quote'), qq = S.quotes[+f.getAttribute('data-i')], on = b.getAttribute('data-orig') === '0';
    var bq = $('blockquote', f); bq.textContent = on ? qq.orig : (qq[lang] || qq.orig); bq.lang = on ? qq.lang : lang;
    b.setAttribute('data-orig', on ? '1' : '0'); b.textContent = t(on ? 'k_trans' : 'k_orig');
  });
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  KIT.esc = esc;

  /* ---------- harita (kendiliğinden yüklenir) ---------- */
  var mapSeen = false;
  function renderMap() {
    var f = $('[data-map]'); if (!f) return;
    var src = ruFirst() ? 'https://yandex.com/map-widget/v1/?text=' + q + '&z=16' : 'https://maps.google.com/maps?q=' + q + '&z=16&output=embed';
    f.title = t('k_map_title');
    if (mapSeen) { if (f.src !== src) f.src = src; return; }
    f.dataset.src = src;
    if (!('IntersectionObserver' in window)) { f.src = src; mapSeen = true; return; }
    if (f._io) return;
    f._io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { f.src = f.dataset.src; mapSeen = true; f._io.disconnect(); } }, { rootMargin: '600px' });
    f._io.observe(f);
  }

  /* ---------- kayan şeritler ---------- */
  $$('.k-marquee').forEach(function (m) {
    var track = m.firstElementChild; if (!track) return;
    var clone = track.cloneNode(true); clone.setAttribute('aria-hidden', 'true'); $$('a,button', clone).forEach(function (x) { x.tabIndex = -1; });
    m.appendChild(clone);
  });

  /* ---------- talep akışı ---------- */
  var sheet, flow, step, ans, pre = {};
  function next() { step++; while (flow.steps[step] && pre[flow.steps[step].id]) step++; renderStep(); }
  function buildSheet() {
    sheet = document.createElement('dialog'); sheet.className = 'k-sheet'; sheet.setAttribute('aria-labelledby', 'k-sheet-h');
    sheet.innerHTML = '<div class="k-sheet__in"><header class="k-sheet__top"><button type="button" class="k-sheet__back" data-k-back></button><span class="k-sheet__step" aria-live="polite"></span><button type="button" class="k-sheet__x" data-k-close></button></header><div class="k-sheet__body"></div></div>';
    document.body.appendChild(sheet);
    sheet.addEventListener('click', function (e) {
      if (e.target === sheet || e.target.closest('[data-k-close]')) { sheet.close(); return; }
      if (e.target.closest('[data-k-back]')) { if (step > 0) { step--; renderStep(); } else sheet.close(); return; }
      var c = e.target.closest('[data-k-opt]');
      if (c) {
        var st = flow.steps[step];
        if (st.multi) { var a = ans[st.id] || []; var v = c.getAttribute('data-k-opt'); var i = a.indexOf(v); if (i > -1) a.splice(i, 1); else a.push(v); ans[st.id] = a; c.setAttribute('aria-pressed', i > -1 ? 'false' : 'true'); $('[data-k-next]', sheet).disabled = !a.length; }
        else { ans[st.id] = c.getAttribute('data-k-opt'); delete pre[st.id]; next(); }
        return;
      }
      if (e.target.closest('[data-k-next]')) {
        var s2 = flow.steps[step];
        if (s2.type === 'dates') { var a1 = $('#k-d1', sheet).value, a2 = $('#k-d2', sheet).value; ans[s2.id] = [a1, a2]; }
        if (s2.type === 'date') { ans[s2.id] = $('#k-d1', sheet).value; }
        if (s2.type === 'text') { ans[s2.id] = $('#k-tx', sheet).value.trim(); }
        next(); return;
      }
      if (e.target.closest('[data-k-wa]')) { window.open(L.wa(message()), '_blank', 'noopener'); return; }
      if (e.target.closest('[data-k-tg]')) { tgSend(message()); }
    });
    sheet.addEventListener('input', function (e) {
      var st = flow.steps[step]; if (!st) return;
      if (st.type === 'dates' || st.type === 'date') { var ok = $('#k-d1', sheet).value && (st.type === 'date' || $('#k-d2', sheet).value); $('[data-k-next]', sheet).disabled = !ok; }
    });
  }
  function open(name, preset) {
    if (!sheet) buildSheet();
    flow = S.flows[name]; flow.name = name; step = 0; ans = {}; pre = {};
    if (preset) Object.keys(preset).forEach(function (k) { ans[k] = preset[k]; pre[k] = 1; });
    while (flow.steps[step] && pre[flow.steps[step].id]) step++;
    renderStep(); if (!sheet.open) sheet.showModal();
  }
  KIT.openFlow = open;
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-flow]'); if (!b) return; e.preventDefault();
    var pre = b.getAttribute('data-preset'); open(b.getAttribute('data-flow'), pre ? JSON.parse(pre) : null);
  });
  function fmtDate(v) { if (!v) return ''; var p = v.split('-'); return p[2] + '.' + p[1] + '.' + p[0]; }
  function today(off) { var d = new Date(Date.now() + (off || 0) * 864e5); return d.toISOString().slice(0, 10); }
  function renderStep() {
    var n = flow.steps.length, body = $('.k-sheet__body', sheet);
    $('[data-k-back]', sheet).textContent = '‹ ' + t('k_back');
    $('[data-k-close]', sheet).setAttribute('aria-label', t('k_close')); $('[data-k-close]', sheet).textContent = '×';
    $('.k-sheet__step', sheet).textContent = step < n ? t('k_step', { a: step + 1, b: n }) : t('k_ready');
    if (flow.custom) $('.k-sheet__step', sheet).textContent = t('k_ready');
    if (step >= n) {
      body.innerHTML = '<h2 id="k-sheet-h" class="k-sheet__h">' + esc(t('k_ready')) + '</h2><p class="k-sheet__sub">' + esc(t('k_ready_sub')) + '</p>' +
        '<pre class="k-sheet__msg">' + esc(customerLine()) + '</pre>' +
        '<div class="k-sheet__send">' + (ruFirst() ? tgBtn() + waBtn() : waBtn() + tgBtn()) + '</div>';
      return;
    }
    var st = flow.steps[step], h = '<h2 id="k-sheet-h" class="k-sheet__h">' + esc(t(st.q)) + '</h2>';
    if (st.hint) h += '<p class="k-sheet__sub">' + esc(t(st.hint)) + '</p>';
    if (st.type === 'chips' || !st.type) {
      h += '<div class="k-chips' + (st.cols ? ' k-chips--' + st.cols : '') + '">' + st.opts.map(function (o) {
        var on = st.multi && (ans[st.id] || []).indexOf(o) > -1;
        var sub = D.tr[o + '_d'] != null ? '<small>' + esc(t(o + '_d')) + '</small>' : '';
        return '<button type="button" class="k-chip" data-k-opt="' + o + '"' + (st.multi ? ' aria-pressed="' + on + '"' : '') + '><span>' + esc(t(o)) + '</span>' + sub + '</button>';
      }).join('') + '</div>';
      if (st.multi) h += '<button type="button" class="k-btn k-btn--main" data-k-next' + ((ans[st.id] || []).length ? '' : ' disabled') + '>' + esc(t('k_next')) + '</button>';
    } else if (st.type === 'dates') {
      var v = ans[st.id] || [today(1), today(8)];
      h += '<div class="k-dates"><label><span>' + esc(t(st.from || 'k_from')) + '</span><input type="date" id="k-d1" min="' + today() + '" value="' + v[0] + '"></label><label><span>' + esc(t(st.to || 'k_to')) + '</span><input type="date" id="k-d2" min="' + today() + '" value="' + v[1] + '"></label></div>' +
        '<button type="button" class="k-btn k-btn--main" data-k-next>' + esc(t('k_next')) + '</button>';
    } else if (st.type === 'date') {
      h += '<div class="k-dates k-dates--one"><label><span>' + esc(t(st.label || 'k_date')) + '</span><input type="date" id="k-d1" min="' + today() + '" value="' + (ans[st.id] || today(1)) + '"></label></div>' +
        '<button type="button" class="k-btn k-btn--main" data-k-next>' + esc(t('k_next')) + '</button>';
    } else if (st.type === 'days') {
      h += '<div class="k-days" role="group">' + dayList(st.n || 14).map(function (d) {
        return '<button type="button" class="k-day" data-k-opt="' + d.iso + '"><small>' + esc(d.wd) + '</small><b>' + d.d + '</b><small>' + esc(d.mo) + '</small></button>';
      }).join('') + '</div>';
    } else if (st.type === 'text') {
      h += '<label class="k-text"><span>' + esc(t('k_optional')) + '</span><textarea id="k-tx" rows="3" maxlength="300" placeholder="' + esc(t(st.ph || 'k_note_ph')) + '">' + esc(ans[st.id] || '') + '</textarea></label>' +
        '<button type="button" class="k-btn k-btn--main" data-k-next>' + esc(t('k_next')) + '</button>';
    }
    body.innerHTML = h;
    var first = $('.k-chip, input, textarea', body); if (first && matchMedia('(pointer:fine)').matches) first.focus();
  }
  function waBtn() { return '<button type="button" class="k-btn k-btn--wa" data-k-wa>' + svg('k-wa') + esc(t('k_send_wa')) + '</button>'; }
  function tgBtn() { return '<button type="button" class="k-btn k-btn--tg" data-k-tg>' + svg('k-tg') + esc(t('k_send_tg')) + '</button>'; }
  function answerText(st, l) {
    var a = ans[st.id]; if (a == null || a === '' || (a.length === 0)) return '';
    if (st.type === 'dates') return fmtDate(a[0]) + ' → ' + fmtDate(a[1]);
    if (st.type === 'date') return fmtDate(a);
    if (st.type === 'days') return fmtDay(a, l);
    if (st.type === 'text') return a;
    if (st.multi) return a.map(function (o) { return t(o, null, l); }).join(', ');
    return t(a, null, l);
  }
  function customerLine() {
    if (flow.custom) return flow.custom.c;
    var parts = flow.steps.filter(function (s) { return s.type !== 'text'; }).map(function (s) { return answerText(s, lang); }).filter(Boolean);
    var note = flow.steps.filter(function (s) { return s.type === 'text'; }).map(function (s) { return answerText(s, lang); }).filter(Boolean)[0];
    return t('k_hello') + ' ' + t(flow.msg, { list: parts.join(' · ') }) + (note ? '\n' + note : '');
  }
  function message() {
    if (flow.custom) return flow.custom.c + (lang === 'tr' ? '\n\n' : '\n\n—\n') + flow.custom.tr.concat(['🌐 Müşteri dili: ' + { tr: 'Türkçe', ru: 'Rusça', en: 'İngilizce' }[lang]]).join('\n');
    var tr = ['—', '🔔 ' + t('k_req', null, 'tr') + ': ' + t(flow.title, null, 'tr')];
    flow.steps.forEach(function (s) { var v = answerText(s, 'tr'); if (v) tr.push((s.icon || '▫️') + ' ' + (s.type === 'text' ? 'Not' : t(s.q, null, 'tr').replace(/\?$/, '')) + ': ' + v); });
    tr.push('🌐 ' + t('k_lang_line', null, 'tr') + ': ' + { tr: 'Türkçe', ru: 'Rusça', en: 'İngilizce' }[lang]);
    return customerLine() + (lang === 'tr' ? '\n\n' + tr.slice(1).join('\n') : '\n\n' + tr.join('\n'));
  }
  KIT.message = function () { return message(); };
  function dayList(n) {
    var out = [], base = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    for (var i = 0; i < n; i++) {
      var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      var iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
      out.push({ iso: iso, d: d.getDate(), wd: i === 0 ? t('k_today') : i === 1 ? t('k_tomorrow') : d.toLocaleDateString(lang, { weekday: 'short' }), mo: d.toLocaleDateString(lang, { month: 'short' }) });
    }
    return out;
  }
  function fmtDay(iso, l) { var p = iso.split('-'); var d = new Date(+p[0], +p[1] - 1, +p[2]); return d.toLocaleDateString(l || lang, { weekday: 'long', day: 'numeric', month: 'long' }); }
  KIT.dayList = dayList; KIT.fmtDay = fmtDay;
  /* sayfa içi kuruculardan doğrudan hazır mesaj ekranı: c = müşterinin dilinde metin, tr = Türkçe özet satırları */
  KIT.handoff = function (c, tr) {
    if (!sheet) buildSheet();
    flow = { steps: [], custom: { c: c, tr: tr } }; step = 0; ans = {}; pre = {};
    renderStep(); if (!sheet.open) sheet.showModal();
  };

  /* ---------- başa dön ---------- */
  var up = $('#k-up');
  if (up) {
    up.innerHTML = svg('k-up'); up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
    addEventListener('scroll', function () { up.classList.toggle('is-on', scrollY > innerHeight * 1.2); }, { passive: true });
  }
  $$('[data-year]').forEach(function (y) { y.textContent = new Date().getFullYear(); });
  KIT.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  applyLang(pickLang());
  if (S.onReady) S.onReady(KIT);
})();
