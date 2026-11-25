# Önder Kaya: tek sayfa site

Statik site (HTML + CSS + düz JavaScript), derleme adımı yok. `index.html` dosyasını tarayıcıda açmanız yeterli.
GitHub Pages'te `https://onderkya.github.io/` adresinde yayınlanmak üzere hazırlandı (henüz yayınlanmadı).

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Bütün sayfa. Türkçe metinler doğrudan burada. |
| `css/style.css` | Tasarım. Renkler en üstte `:root` içinde. |
| `js/i18n.js` | İngilizce (`en`) ve Rusça (`ru`) çeviriler, ayrıca dile göre WhatsApp/e-posta mesaj şablonları (`msg.*`). |
| `js/main.js` | Dil değiştirici, fiyat kopyalama, WhatsApp/e-posta bağlantıları, kafe menüsü örneği, yüzen WhatsApp düğmesi. |
| `img/onder.jpg` | Fotoğraf. |
| `img/favicon.svg`, `img/apple-touch-icon.png` | Site simgesi. |
| `img/og.png` | WhatsApp/sosyal medyada paylaşılınca görünen önizleme görseli (1200×630). |

## Telefon numarası

Numara geçen her yerde `PHONE_PLACEHOLDER` yazıyor (hepsi `index.html` içinde: WhatsApp düğmeleri, iletişim satırı,
`<html data-phone="...">`). JavaScript numarayı `data-phone` alanından okur.
Numarayı ülke koduyla, boşluksuz ve `+` olmadan yazın (WhatsApp `wa.me` bu biçimi ister). Tek komutla değiştirin:

```sh
cd /Users/onder/web-ajans/site
sed -i '' 's/PHONE_PLACEHOLDER/905XXXXXXXXX/g' index.html
```

İletişim bölümünde numara `+905XXXXXXXXX` olarak görünür.

## Fiyatlar

Fiyatlar tek yerde: `index.html` içindeki **Paketler** bölümü (`<!-- FİYATLAR BURADA -->` yorumunun altı).
Değiştirmeniz gereken kutular:

| Paket | Satır |
|---|---|
| Tek Sayfa İşletme Sitesi | `<b data-price="site">4.900 TL</b>` |
| Dijital / QR Menü | `<b data-price="menu">2.500 TL</b>` |
| Online Randevu + Site | `<b data-price="book">7.900 TL</b>` |
| Aylık bakım | `<span data-price="care">500 TL</span>` |

Sayfanın başka yerlerindeki fiyatlar (SSS'deki ilk cevap, "Nasıl çalışıyoruz" 4. adım) bu kutulardan otomatik
kopyalanır (`data-copy-price`); onlara dokunmayın. Fiyatlar her dilde aynı biçimde (TL) görünür.
Sayfada hepsi açıkça "Başlangıç fiyatı" olarak etiketli.

## Diller

- Varsayılan Türkçe. Sağ üstteki TR / EN / RU düğmeleri bütün metni değiştirir; seçim tarayıcıda hatırlanır.
- Tarayıcı dili Rusça olan ziyaretçi sayfayı Rusça açar.
- Bağlantıyla dil seçmek için: `https://onderkya.github.io/?lang=ru` (Rusça konuşan işletme sahiplerine bunu gönderin)
  ya da `?lang=en`.
- Bir metni değiştirirken üç yeri de güncelleyin: Türkçe `index.html`'de, İngilizce ve Rusça `js/i18n.js`'te
  (aynı anahtar, örn. `hero.h1`).

## Dürüstlük notları

- Sahte yorum, sahte müşteri logosu, müşteri sayısı yok. "Yorumlar yakında" bölümü gerçek yorumlar gelince doldurulur
  (`index.html` içinde `reviews-soon`).
- Örnekler bölümündeki üç telefon (Örnek Kuaför, Örnek Kafe, Örnek Eczanesi) HTML/CSS ile çizilmiş konsept
  tasarımlardır ve her biri "Örnek konsept tasarım" etiketlidir.

## Yayınlamadan önce

1. `PHONE_PLACEHOLDER` yerine gerçek numara (yukarıdaki komut).
2. Fiyatları kontrol edin.
3. `onderkya.github.io` adlı GitHub deposuna bu klasörün içeriğini koyun (`index.html` kökte olmalı).
