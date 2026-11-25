# Ondera Studio · site4 (B + C melezi, 6 dil)

Statik site: HTML + CSS + düz JavaScript, derleme yok. `index.html`'i tarayıcıda açmanız yeterli. Henüz hiçbir yere yüklenmedi.

## Dosyalar
| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sayfa. Türkçe metinler doğrudan burada (Türkçe = kaynak dil). Kahraman sahnesi satır içi SVG |
| `css/style.css` | Bütün stil (mobil önce; 560 / 720 / 1040 px kırılımları, `prefers-reduced-motion`) |
| `js/config.js` | **Tek düzenleme yeri:** fiyatlar, WhatsApp numarası, e-posta. Altı dilde bütün fiyatlar ve bağlantılar buradan dolar |
| `js/main.js` | Dil seçimi, demo (gündüz → Rusça → gece), önce/sonra sürgüsü, menüler, sektörlerde "diğer 8" |
| `js/i18n/{en,ru,kk,uz,ky}.js` | Çeviriler (her biri 294 anahtar). Yalnız seçilen dilin dosyası yüklenir |
| `img/` | `onder.jpg` (kurucu), `favicon.svg` (deniz üstünde güneş), `og.png`, `apple-touch-icon.png` |
| `_notes/tr_source.json` | Türkçe kaynak metinlerin tamamı (çevirmene verilecek dosya) |
| `_notes/check_dict.js` | `node _notes/check_dict.js kk`: dil dosyasında eksik anahtar, yer tutucu, satır sonu kontrolü |
| `_notes/font_check.mjs` | `node --experimental-websocket _notes/font_check.mjs`: altı dilde yedek (sistem) fontla çizilen harf var mı |
| `_notes/COLORS.md` | Renkler, yazı tipleri, kontrast |
| `_preview/` | Ekran görüntüleri ve `frame.html` (headless Chrome kontrol aracı) |

## Dil
- Diller: TR, EN, RU, KK (Kazakça, Kiril), UZ (Özbekçe, **Latin**), KY (Kırgızca, Kiril).
- İlk ziyarette tarayıcı diline göre: kk→KK, uz→UZ, ky→KY, ru/uk/be→RU, tr→TR, diğerleri→EN.
- `?lang=tr|en|ru|kk|uz|ky` her şeyin önüne geçer. Elle seçilen dil `localStorage`'da hatırlanır.
- Seçici: üst çubukta açılır liste, telefon menüsünde 6 kısa kod. `<html lang>` her seçimde güncellenir.
- WhatsApp'a önceden yazılmış mesajlar, e-posta konuları, `alt` ve `aria-label` metinleri, sayfa başlığı ve açıklaması da çevrilir.
- Yeni bir metin eklerken: `index.html`'de `data-i18n="anahtar"` verin, aynı anahtarı beş dil dosyasına ekleyin, sonra `check_dict.js` ile kontrol edin. `_notes/tr_source.json`'u güncellemek için `_preview/frame.html?mode=dict` çıktısını kullanın.

## Ana dili konuşan birine okutulması gerekenler
EN ve TR'yi ben yazdım. RU önceki sitenin gözden geçirilmiş Rusçasına dayanıyor; KK, UZ ve KY sıfırdan yapay zekâ çevirisi. **Yayından önce KK, UZ ve KY bir ana dil konuşanına mutlaka okutulmalı.** RU için kısa bir okuma yeterli.

Özellikle bakılacak yerler:
- **Hepsi:** "taslak" için «макет» / "maket" seçildi; "bakım" (aylık plan) KK'da «қолдау», UZ'da "texnik xizmat" (biraz teknik duyulabilir). `hero.h1`, sabit kısa düğmeler (`float`, `cta.waShort`, `offer.cta`) ve WhatsApp mesajlarının açılış selamı.
- **KK:** "kurucu" = «Құрылтайшы» (alternatif «Негізін қалаушы»); `from` etiketi «бастапқы баға»; «маңдайша» (tabela); `ba.dm` gibi Instagram jargonu («DM-ге»); `offer.d` / `msg.offer`.
- **UZ:** oʻ/gʻ için U+02BB (ʻ), tutuq belgisi için U+02BC (ʼ) kullanıldı. "yozilish / navbatga yoziladi" (randevu), "Sartaroshlar va barberlar", "boshlangʻich" fiyat etiketi, "surgich" (sürgü), "ustama/ustamasiz" (kâr eklemeden), "Savol-javob" (SSS).
- **KY:** «баштапкы баа» ve «башталышы {fiyat}» (Kırgızcada "…дан баштап" fiyattan sonra gelir), «укладка», «кезметчилик сааттары» (nöbetçi eczane), «сыдырма» (sürgü), Latin marka adlarına kesme işaretli ekler («WhatsApp'та»). Örnek kuaför adı burada Kiril yazıldı («Калеичи чач студиясы»).
- **RU:** `hero.h1` «Солнце садится, а ваша витрина открыта.» (alternatif «…светится»), `ba.dm` «Цена — в директ», `hello.h` biraz kitabi; Latin yazılan "Önder" Rusçada çekim almıyor.

## Dürüstlük
- Uydurma müşteri, yorum, logo, sayı ya da sonuç yok. "Lale Çiçek", "Begonvil", "Kaleiçi Saç Atölyesi", "Deniz Kafe" hayalî örneklerdir; demo, önce/sonra ve "Örnek konseptler" bölümlerinde altı dilde "örnek konsept" diye yazıyor. Cihaz içindeki ₺ fiyatlar temsilîdir.
- Kurucunun yalnız adı ("Önder") geçer, soyadı yok. GitHub bağlantısı yok.

## Yayından önce yapılacaklar
- `og:image` şimdilik göreli (`img/og.png`) ve eski tasarımdan kalma. Alan adı belli olunca tam adresle değiştirin, istenirse yeni görsel hazırlanır.
- Yazı tipleri Google Fonts'tan geliyor (Montserrat Alternates, Geologica, Nunito ve yalnız ʻ ʼ işaretleri için 2 glifli Inter alt kümesi; hepsi SIL OFL). İsterseniz kendi sunucunuzda barındırılabilir.

## Kontroller (25 Kasım 2026, headless Chrome)
- Yatay taşma yok: 6 dilde 390 px, 320 px ve 1440 px (`scrollWidth` = pencere genişliği).
- Yedek font yok: 6 dilde bütün görünen metin web fontlarıyla çiziliyor (CDP `getPlatformFontsForNode`).
- Dil: tarayıcı dilinden algılama (kk-KZ, uz-UZ, ky-KG, uk-UA, be-BY, ru-RU, tr-TR, de-DE, en-US), `?lang=`, elle seçimin hatırlanması, dil değiştirme.
- Demo sekmeleri ve duraklatma; azaltılmış hareket tercihinde gece sahnesi sabit gösterilir ve tabela dönmez.
- Önce/sonra sürgüsü: dokunma, fare ve klavye (ok tuşları). Sektörlerde "diğer 8": 8/8 kart açılıyor.
- WhatsApp (`wa.me/905340679661?text=…`) ve `mailto:` bağlantıları her dilde kendi metniyle oluşuyor.
- Ekran görüntüleri: `_preview/phone-tr.png`, `phone-ru.png`, `phone-kk.png` (390 px, tam sayfa), `_preview/desktop-en.png` (1440 px).
