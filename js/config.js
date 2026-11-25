/* ==========================================================
   DÜZENLENECEK TEK YER
   Marka adı, fiyatlar (ABD doları, başlangıç fiyatı) ve iletişim.
   Sayfadaki bütün adlar, fiyatlar, WhatsApp ve e-posta bağlantıları
   altı dilde buradan doldurulur. Değeri değiştirip kaydetmeniz yeterli.
   ========================================================== */
window.SITE = {
  brand: {
    name: "Onaz Studio",            // tam ad: sayfa başlığı, kurucu satırı, mesajlar, alt bilgi
    short: "Onaz"                   // logo yanındaki kısa ad (Kiril dillerde de Latin yazılır)
  },

  phone: "905340679661",            // wa.me biçimi: ülke kodu, boşluksuz, + yok
  phoneDisplay: "+90 534 067 96 61",
  email: "onderkya35@gmail.com",

  prices: {
    site: { first: 99,  std: 159 },      // Tek sayfa işletme sitesi (first = ilk 5 işletme)
    catalog: { first: 49,  std: 69 },    // Dijital katalog / fiyat listesi
    book: { first: 159, std: 249 },      // Randevulu site
    care: { basic: 15, standard: 25, plus: 45 }  // Aylık bakım
  }
};
