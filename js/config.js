/* ==========================================================
   ONDERA STUDIO: düzenlenecek tek yer
   Fiyatlar (ABD doları, başlangıç fiyatı) ve iletişim bilgileri.
   Sayfadaki bütün fiyatlar ve WhatsApp/e-posta bağlantıları
   buradan doldurulur. Rakamı değiştirip kaydetmeniz yeterli.
   ========================================================== */
window.ONDERA = {
  phone: "905340679661",            // wa.me biçimi: ülke kodu, boşluksuz, + yok
  phoneDisplay: "+90 534 067 96 61",
  email: "onderkya35@gmail.com",

  prices: {
    site: { first: 99,  std: 159 },   // Tek sayfa işletme sitesi (first = ilk 5 işletme)
    menu: { first: 49,  std: 69 },    // QR menü TR/EN/RU
    book: { first: 159, std: 249 },   // Randevulu site
    care: { basic: 15, standard: 25, plus: 45 }  // Aylık bakım
  }
};
