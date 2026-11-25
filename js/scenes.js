/* Kahraman arka planı: 14 işletmenin çizimi. Yalnız o an gösterilen sahne kurulur (buildScene).
   İki düzen: "P" dik sütun (geniş ekran, telefonun solundaki 205 px), "B" yatay bant (telefon, 360×222).
   Her eşya bir kez çizilir (PR), düzene göre yerleştirilir. Birim = piksel. */
(function () {
  "use strict";
  var K = "#2B1430", MAG = "#B8125F", PINK = "#E5559A", SEA = "#075E7C", CIT = "#FFAE00", LEAF = "#23683F", GRN = "#3E9460",
      SAND = "#FBF3E6", W = "#FFFFFF", AMB = "#FFD58A", WD = "#C98B4E", WD2 = "#96582A", WD3 = "#E4B67E", BLU = "#8FD6EE", NV = "#25205A", RED = "#C42F66";
  function R(x, y, w, h, f, r, c) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (r || 0) + '" fill="' + f + '" class="' + (c === undefined ? "o" : c) + '"/>'; }
  function C(x, y, r, f, c) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '" class="' + (c || "") + '"/>'; }
  function E(x, y, a, b, f, c) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + a + '" ry="' + b + '" fill="' + f + '" class="' + (c || "") + '"/>'; }
  function P(d, f, c, x) { return '<path d="' + d + '" fill="' + (f || "none") + '" class="' + (c === undefined ? "o" : c) + '" ' + (x || "") + "/>"; }
  function L(d, col, w) { return '<path d="' + d + '" fill="none" stroke="' + (col || K) + '" stroke-width="' + (w || 3) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  function G(x, y, s, body, c) { return '<g transform="translate(' + x + " " + y + ")" + (s && s !== 1 ? " scale(" + s + ")" : "") + '"' + (c ? ' class="' + c + '"' : "") + ">" + body + "</g>"; }
  function M(cls, body) { return '<g class="' + cls + '">' + body + "</g>"; }
  function rep(n, fn) { var s = ""; for (var i = 0; i < n; i++) s += fn(i); return s; }
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; }

  /* Begonvil: (x,y) çevresinde w×h alana saçılmış yaprak ve çiçek */
  function bou(w, h, n, seed) {
    var r = rnd(seed || 7), s = "", i, g = ["#1F5E39", "#2C7A4B", GRN], f = [MAG, "#D42A7A", PINK, "#F27BB0"];
    for (i = 0; i < n; i++) s += C((r() * w).toFixed(0), (r() * h).toFixed(0), (6 + r() * 5).toFixed(1), g[i % 3]);
    for (i = 0; i < n; i++) s += C((r() * w).toFixed(0), (r() * h).toFixed(0), (4 + r() * 4).toFixed(1), f[i % 4]);
    return s;
  }
  /* Deniz ve Beydağları manzarası (w×h), gündüz ya da gece */
  function view(w, h, nt, frame, nosky) {
    var y = h * 0.66;
    return (nosky ? "" : R(0, 0, w, h, nt ? "url(#sc-dusk)" : "url(#sc-sky)", 0, "")) + C(w * 0.72, nt ? y - 4 : h * 0.3, 14, CIT) +
      P("M0 " + y + "L" + w * 0.12 + " " + h * 0.42 + "L" + w * 0.24 + " " + h * 0.54 + "L" + w * 0.4 + " " + h * 0.3 + "L" + w * 0.56 + " " + h * 0.52 + "L" + w * 0.7 + " " + h * 0.4 + "L" + w * 0.88 + " " + h * 0.56 + "L" + w + " " + h * 0.48 + "V" + y + "Z", nt ? "#4D4A82" : "#6F8FB5", "") +
      R(0, y, w, h - y, nt ? "#0A4F73" : "#0E86A8", 0, "") + L("M" + w * 0.6 + " " + (y + 8) + "h" + w * 0.22 + "M" + w * 0.66 + " " + (y + 17) + "h" + w * 0.13, nt ? AMB : W, 2) +
      (frame === false ? "" : P("M0 0H" + w + "V" + h + "H0Z", "none") + L("M" + w / 2 + " 0V" + h) + R(-6, h - 3, w + 12, 9, SAND, 3));
  }
  function bouquet(a, b, c) {
    return L("M-8 -6L-12 -26M0 -6V-32M8 -6L13 -26", LEAF, 3) + E(-17, -18, 9, 5, GRN) + E(17, -18, 9, 5, GRN) +
      C(-14, -30, 10, a, "o2") + C(13, -30, 10, b, "o2") + C(0, -42, 11, c, "o2") + C(0, -24, 10, a, "o2") + C(0, -42, 3.5, AMB) + C(-14, -30, 3, AMB) + C(13, -30, 3, AMB) + C(0, -24, 3, AMB);
  }
  function bucket(x, y, a, b, c, col) { return G(x, y, 1, bouquet(a, b, c) + P("M-18 -14H18L13 22H-13Z", col) + L("M-16 -3H16", "rgba(43,20,48,.35)", 3)); }
  function shirt(col, c2, dress) {
    return L("M0 -6V0") + (dress
      ? P("M-12 0L12 0L9 18L22 74H-22L-9 18Z", col) + L("M-9 20H9", c2, 4)
      : P("M-10 0L-24 12L-17 24L-13 20V58H13V20L17 24L24 12L10 0Q0 8 -10 0Z", col) + L("M-13 46H13", c2, 4));
  }
  function sneaker(col, acc, dirty) {
    return P("M2 26C2 14 6 6 10 2C14 8 22 9 28 4L44 16C52 20 62 20 64 29V33H2Z", col) + P("M1 32H65V39Q65 41 62 41H4Q1 41 1 38Z", W) + L("M27 11l-6 6M33 15l-6 6M39 19l-5 6", K, 2.4) + P("M4 22C9 26 18 26 24 24", "none", "", 'stroke="' + acc + '" stroke-width="4" stroke-linecap="round"') +
      (dirty ? C(14, 18, 3.5, WD2) + C(44, 26, 4.5, WD2) + C(54, 31, 3, WD2) + C(30, 30, 3.5, WD2) + C(20, 36, 3, WD2) + C(40, 37, 3, WD2) : "");
  }
  function washer(x, y, col, c1, c2, d) {
    return G(x, y, 1, R(0, 0, 88, 104, W, 9) + R(0, 0, 88, 24, "#E3EEF3", 9) + C(14, 12, 5, col, "o2") + R(50, 7, 28, 10, NV, 3, "") + C(44, 63, 32, "#BFD6E0", "o") + C(44, 63, 24, "#0E86A8", "o2") +
      G(44, 63, 1, M("spin" + (d || ""), E(-7, -6, 13, 7, c1) + E(8, 7, 12, 7, c2) + E(-3, 11, 8, 5, AMB) + C(12, -9, 4, W))) + P("M27 48Q35 41 46 42", "none", "", 'stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"'));
  }
  function jar(x, y, f, h) { return G(x, y, 1, R(-14, -(h || 34), 28, h || 34, f, 6) + R(-12, -(h || 34) - 8, 24, 9, MAG, 3) + R(-9, -(h || 34) * 0.62, 18, 13, SAND, 2, "")); }
  function bottle(x, y, f) { return G(x, y, 1, P("M-10 0V-34Q-10 -42 -5 -46V-58H5V-46Q10 -42 10 -34V0Z", f) + R(-6, -66, 12, 9, WD2, 2) + R(-7, -27, 14, 15, SAND, 2, "")); }
  function bee(c) { return M("bee " + (c || ""), E(-3, -9, 7, 5, "#DDF0F6", "o2") + E(6, -9, 6, 5, "#DDF0F6", "o2") + E(0, 0, 13, 9, CIT, "o2") + L("M-4 -7V7M3 -8V8", K, 3.5) + C(11, -1, 2, K)); }
  function flame(x, y, c) { return G(x, y, 1, M("flick " + (c || ""), P("M0 0C-7 -5 -5 -12 0 -19C5 -12 7 -5 0 0Z", CIT, "") + P("M0 -1C-3 -4 -2 -8 0 -11C2 -8 3 -4 0 -1Z", "#FFF3C9", ""))); }
  function dumb(x, y, col, s) { return G(x, y, s || 1, R(-9, -4, 18, 8, "#8A8FA3", 2, "o2") + R(-19, -13, 11, 26, col, 4, "o2") + R(8, -13, 11, 26, col, 4, "o2")); }
  function shelf(w, y) { return R(0, y, w, 9, WD, 2) + L("M14 " + (y + 9) + "v9M" + (w - 14) + " " + (y + 9) + "v9", K, 3); }
  function phoneIcon(x, y, c, s) { return G(x, y, s || 1, R(0, 0, 32, 54, K, 6, "") + R(3, 5, 26, 43, c, 3, "") + C(16, 51, 1.6, W)); }
  function awn(w, col, h) {
    var n = Math.round(w / 24), u = w / n, H = h || 30;
    return rep(n, function (i) { return P("M" + i * u + " 0H" + (i + 1) * u + "V" + H + "a" + u / 2 + " " + u / 2 + " 0 0 1 -" + u + " 0Z", i % 2 ? W : col, "o2"); }) + R(-4, -8, w + 8, 10, K, 4, "");
  }
  function lampP(len, col) { return L("M0 0V" + len) + P("M-20 " + (len + 22) + "Q-18 " + len + " 0 " + len + "Q18 " + len + " 20 " + (len + 22) + "Z", col) + E(0, len + 23, 9, 5, "#FFF3C9"); }

  /* Eşyalar: [genişlik, yükseklik, çizim(gece)] */
  var PR = {
    flStand: [190, 208, function () {
      return P("M12 92H178L184 108H6Z", WD) + P("M6 108V206M184 108V206") + P("M2 186H188V204H2Z", WD) + L("M16 108L6 186M174 108L184 186", WD2, 5) +
        bucket(38, 70, PINK, MAG, W, SEA) + bucket(95, 70, CIT, "#FFD58A", PINK, "#8AA3C2") + bucket(152, 70, W, "#F27BB0", MAG, SEA) +
        bucket(33, 164, MAG, RED, PINK, "#8AA3C2") + bucket(95, 164, W, PINK, CIT, SEA) + bucket(157, 164, "#9A6BD0", "#C9A6F0", W, "#8AA3C2"); }],
    flWin: [188, 124, function (n) {
      return R(10, 22, 168, 98, n ? "#FFCF73" : "#CDEFF8", 8) + (n ? E(94, 80, 74, 34, "#FFE3A3") : "") + L("M94 22V120M10 74H178", K, 3) + P("M24 120v-20q10-14 20 0v20ZM122 120v-26q13-16 26 0v26Z", "#2C7A4B", "") + C(34, 92, 9, MAG) + C(135, 86, 11, PINK) + C(60, 108, 8, "#F27BB0") + C(166, 106, 8, MAG) + G(4, 4, 1, awn(180, MAG, 20)); }],
    can: [62, 56, function () { return P("M12 18H44V54H12Z", SEA) + P("M44 30L60 12L62 18L46 44Z", SEA) + P("M14 20Q26 -4 42 18", "none") + M("drip", C(58, 24, 2.5, BLU)); }],
    hrMirror: [188, 136, function () {
      return R(24, 4, 140, 106, W, 14) + R(36, 16, 116, 82, "#CDEFF8", 8) + L("M52 84L92 30M70 88L104 42", W, 5) +
        rep(5, function (i) { return C(30 + i * 32, 10, 6, AMB, "o2 bulb"); }) + rep(3, function (i) { return C(30, 34 + i * 26, 6, AMB, "o2 bulb") + C(158, 34 + i * 26, 6, AMB, "o2 bulb"); }) +
        R(4, 118, 180, 11, WD, 3) + G(24, 118, 1, R(-8, -30, 16, 30, PINK, 4) + R(-4, -38, 8, 9, K, 2, "")) + G(48, 118, 1, R(-8, -22, 16, 22, SEA, 4) + R(-4, -30, 8, 9, K, 2, "")) + G(144, 118, 1, R(-8, -26, 16, 26, CIT, 4) + R(-5, -33, 10, 8, K, 2, "")) + G(166, 118, 1, R(-8, -34, 16, 34, GRN, 4) + R(-4, -42, 8, 9, K, 2, "")); }],
    hrChair: [132, 176, function () {
      return R(40, 2, 46, 26, "#8E1C4C", 9) + R(58, 26, 10, 12, "#8A8FA3", 0) + P("M26 38H100Q108 38 106 48L100 104H26L20 48Q18 38 26 38Z", MAG) + R(16, 98, 98, 24, RED, 10) + R(4, 72, 24, 12, K, 6, "") + R(102, 72, 24, 12, K, 6, "") + L("M14 84V108M114 84V108", K, 5) + R(56, 122, 18, 30, "#B7BBC9", 2) + E(65, 160, 40, 11, "#8A8FA3", "o") + P("M100 116L122 148H132", "none", "", 'stroke="' + K + '" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"'); }],
    hrPole: [40, 150, function () {
      return '<clipPath id="sc-pole"><rect x="8" y="22" width="24" height="98"/></clipPath>' + R(8, 22, 24, 98, W, 0) + '<g clip-path="url(#sc-pole)">' + M("pole", rep(9, function (i) { return P("M8 " + (i * 32 - 30) + "l24 -18v12l-24 18Z", RED, "") + P("M8 " + (i * 32 - 14) + "l24 -18v12l-24 18Z", SEA, ""); })) + "</g>" + R(8, 22, 24, 98, "none", 0) + R(3, 10, 34, 14, "#B7BBC9", 4) + C(20, 7, 8, CIT, "o") + R(3, 118, 34, 16, "#B7BBC9", 4) + R(12, 134, 16, 14, K, 0, ""); }],
    spTable: [196, 132, function () {
      return P("M24 82L14 130M172 82L182 130M62 82V130M136 82V130", "none", "", 'stroke="' + WD2 + '" stroke-width="8" stroke-linecap="round"') + R(8, 110, 180, 8, WD, 3) +
        P("M40 60Q44 34 70 32Q96 30 112 40L118 60Z", "#EFC3A0") + P("M52 56Q66 64 84 58", "none") + P("M92 60Q96 30 124 30Q160 28 184 42Q192 48 190 60Z", W) + L("M112 44Q140 34 172 46", "#E5B7CC", 4) +
        R(4, 46, 44, 16, "#F27BB0", 8) + P("M8 46Q6 24 26 24Q44 26 42 46Z", "#EFC3A0") + P("M6 42Q2 18 26 18Q36 18 40 26Q24 26 20 44Z", "#4A2A1E") + C(10, 20, 8, "#4A2A1E", "o2") + P("M27 38q4 3 8 0", "none", "o2") + R(2, 60, 192, 20, WD3, 8) + P("M36 60H190V88H36Z", "#FDF3F7") + R(36, 78, 154, 10, "#F2A7C6", 0, ""); }],
    spTowels: [72, 62, function () { var t = function (x, y, f) { return C(x, y, 16, f, "o") + P("M" + (x - 8) + " " + y + "a8 8 0 1 1 8 8", "none", "o2"); }; return t(18, 44, W) + t(52, 44, "#BFE3D0") + t(35, 18, "#FCE3B0"); }],
    spShelf: [188, 118, function () {
      return shelf(188, 90) + G(24, 90, 1, R(-11, -30, 22, 30, W, 4) + flame(0, -30)) + G(52, 90, 1, R(-11, -20, 22, 20, "#FCE3B0", 4) + flame(0, -20, "d2")) + G(96, 90, 1, E(0, -8, 24, 9, "#4B4660", "o") + E(0, -23, 18, 8, "#6B6780", "o") + E(0, -36, 12, 7, "#8A86A0", "o")) + G(152, 90, 1, P("M-14 -26H14L10 0H-10Z", SEA) + L("M-6 -26C-8 -50 -14 -62 -12 -84M4 -26C4 -52 10 -66 8 -88", GRN, 5) + P("M-12 -70q-16 -4 -20 -16q16 0 20 16ZM8 -62q16 -4 20 -18q-16 2 -20 18ZM8 -84q-14 -2 -18 -14q16 0 18 14Z", GRN, "")); }],
    spBowl: [76, 128, function () {
      return M("steam", L("M26 34q-8 -9 0 -16t0 -16M38 36q-8 -9 0 -16t0 -18M50 34q-8 -9 0 -16t0 -16", "#FFFFFF", 4)) + P("M12 42H64Q62 68 38 68Q14 68 12 42Z", WD2) + E(38, 42, 26, 7, "#BFE3D0", "o") + C(31, 41, 4, PINK) + C(45, 42, 4, MAG) + R(2, 68, 72, 9, WD, 3) + L("M14 78L8 126M62 78L68 126", WD2, 7); }],
    spBamboo: [54, 190, function () { return rep(3, function (i) { var x = 10 + i * 16; return R(x - 6, 10 + i * 14, 12, 170 - i * 14, i % 2 ? "#5FAF7A" : GRN, 5) + L("M" + (x - 5) + " 60h10M" + (x - 5) + " 108h10M" + (x - 5) + " 152h10", K, 2.5); }) + P("M4 34q-14 -6 -16 -20q16 2 16 20ZM44 52q16 -4 20 -18q-18 0 -20 18Z", LEAF, ""); }],
    gyRack: [192, 124, function () {
      return P("M14 8L8 122M178 8L184 122", "none", "", 'stroke="' + K + '" stroke-width="8" stroke-linecap="round"') + R(6, 34, 180, 9, "#8A8FA3", 2) + R(4, 92, 184, 9, "#8A8FA3", 2) +
        dumb(36, 20, MAG) + dumb(95, 20, SEA) + dumb(154, 20, CIT) + dumb(34, 74, NV, 1.2) + dumb(95, 74, RED, 1.2) + dumb(158, 74, GRN, 1.2); }],
    gyTread: [176, 158, function () {
      return R(8, 126, 162, 22, "#4B4660", 10) + '<path class="belt" d="M20 137H160" stroke="#B7BBC9" stroke-width="5" stroke-dasharray="14 10"/>' + C(18, 150, 7, K) + C(160, 150, 7, K) + L("M140 128L124 34", K, 9) + L("M134 92L84 84", K, 7) + R(96, 8, 60, 34, NV, 8) + R(104, 15, 44, 19, "#7BE0B0", 3, "") + L("M108 28l8 -7 7 6 9 -8 11 6", NV, 3); }],
    gyBall: [60, 60, function () { return C(30, 30, 28, PINK, "o") + P("M8 22Q30 34 52 22M8 40Q30 50 52 40", "none", "", 'stroke="#fff" stroke-width="3" opacity=".7"'); }],
    vtTable: [192, 176, function () {
      return R(20, 120, 12, 54, "#8A8FA3", 0) + R(160, 120, 12, 54, "#8A8FA3", 0) + R(14, 150, 164, 8, "#8A8FA3", 2) + R(2, 104, 188, 20, "#CFE6EE", 6) +
        G(58, 0, 1, M("wag", P("M78 82Q98 74 92 50", "none", "", 'stroke="' + WD2 + '" stroke-width="10" stroke-linecap="round"')) + P("M18 104V62Q18 48 34 46H56Q82 52 80 104Z", WD) + R(20, 84, 13, 20, WD3, 5) + R(38, 84, 13, 20, WD3, 5) + P("M6 8Q-8 20 2 44L14 40ZM58 8Q72 20 62 44L50 40Z", WD2) + P("M8 24Q8 2 32 2Q56 2 56 24Q56 54 32 54Q8 54 8 24Z", WD) + E(32, 40, 15, 12, SAND) + E(32, 34, 6, 4.5, K) + C(21, 23, 3.6, K) + C(43, 23, 3.6, K) + L("M32 39V44M26 46Q32 50 38 46", K, 2.6) + R(18, 54, 30, 7, RED, 3) + C(33, 64, 5, CIT, "o2")); }],
    vtShelf: [188, 128, function () {
      return shelf(188, 100) + G(6, 100, 1, R(0, -62, 44, 62, GRN, 6) + C(22, -32, 9, SAND) + C(13, -44, 3.6, SAND) + C(22, -47, 3.6, SAND) + C(31, -44, 3.6, SAND)) + G(58, 100, 1, R(0, -44, 30, 44, CIT, 6) + R(6, -28, 18, 12, W, 2, "")) + G(98, 100, 1, R(0, -30, 18, 30, W, 4) + R(4, -18, 10, 4, RED, 0, "") + R(7, -21, 4, 10, RED, 0, "")) + G(122, 100, 1, R(0, -38, 18, 38, "#8FD6EE", 4)) +
        G(160, 34, 1, C(0, 0, 27, SEA, "o") + E(0, 8, 10, 8, W) + C(-12, -2, 4.5, W) + C(-5, -11, 4.5, W) + C(5, -11, 4.5, W) + C(12, -2, 4.5, W)); }],
    vtCat: [80, 92, function () {
      return M("wag2", P("M66 78Q84 66 72 46", "none", "", 'stroke="#5A4560" stroke-width="9" stroke-linecap="round"')) + P("M16 88Q10 48 38 46Q68 50 66 88Z", "#7B6685") + P("M12 8L22 22H50L60 8L64 36Q62 56 36 56Q10 56 8 36Z", "#7B6685") + C(26, 33, 5, "#CDEE7A", "o2") + C(47, 33, 5, "#CDEE7A", "o2") + P("M33 42h7l-3.500 4Z", PINK, "") + L("M14 42H2M14 46L3 50M58 42H70M58 46L69 50", K, 2) + E(38, 76, 12, 11, "#D9CDE0"); }],
    phWall: [190, 136, function () {
      return R(0, 0, 190, 132, "#F4F8FB", 10) + rep(2, function (r) { return rep(4, function (c) { return phoneIcon(14 + c * 44, 8 + r * 62, [PINK, "#7BC8E8", CIT, "#8FD9AE", "#B79BE8", "#F59AA8", "#8FD6EE", "#FFD58A"][r * 4 + c]); }) + R(8, 64 + r * 62, 174, 5, "#8A8FA3", 2, ""); }); }],
    phBench: [192, 156, function () {
      return R(0, 98, 192, 16, WD, 4) + R(10, 114, 172, 40, WD2, 4) + R(22, 124, 66, 20, WD, 3) + R(102, 124, 66, 20, WD, 3) + C(55, 134, 3.5, K) + C(135, 134, 3.5, K) +
        L("M166 98V64L128 26", K, 6) + C(166, 64, 6, CIT, "o2") + P("M140 4L112 34Q104 22 116 10Q128 -2 140 4Z", CIT) + P("M112 36L72 96H132Z", "#FFE9B0", "glowc") +
        G(62, 60, 1, '<g transform="rotate(-8)">' + R(0, 0, 36, 38, K, 6, "") + R(4, 5, 28, 28, "#7BE0B0", 3, "blink") + L("M9 13l6 7 5 -5 8 9", K, 2.4) + "</g>") + G(20, 98, 1, R(-8, -26, 24, 26, SEA, 4) + L("M-2 -26V-46M5 -26V-52M12 -26V-42", RED, 5)) + L("M112 92l26 -10", "#8A8FA3", 5); }],
    phBox: [64, 62, function () { return R(2, 16, 58, 44, WD3, 4) + P("M2 16L14 2H48L60 16Z", WD) + R(24, 16, 14, 18, SAND, 0) + phoneIcon(22, 30, "#7BC8E8", 0.5); }],
    tlFabric: [190, 110, function () { var c = [MAG, SEA, CIT, GRN, "#9A6BD0"]; return R(0, 6, 190, 10, WD2, 5) + rep(5, function (i) { var x = 12 + i * 35; return P("M" + x + " 12h30v" + (72 + (i % 2) * 18) + "q-8 -7 -15 0t-15 0Z", c[i]) + L("M" + (x + 9) + " 30v42M" + (x + 20) + " 30v36", "rgba(255,255,255,.45)", 3); }); }],
    tlMachine: [192, 176, function () {
      return L("M22 112L12 174M170 112L180 174", K, 8) + L("M16 152H176", K, 5) + R(0, 96, 192, 18, WD, 5) + R(22, 80, 150, 18, K, 6, "") + P("M140 82V40Q140 18 118 18H48Q34 18 34 32V56H58V44H106Q114 44 114 54V82Z", "#2E2A66") + R(30, 22, 12, 22, CIT, 3, "o2") + C(156, 44, 17, "#B7BBC9", "o") + C(156, 44, 5, K) + P("M62 30H104", "none", "", 'stroke="' + AMB + '" stroke-width="4" stroke-linecap="round"') + R(74, 4, 14, 15, MAG, 3) + L("M81 4L46 22", MAG, 2) +
        M("stitch", L("M46 54V78", "#DDE3EE", 5)) + P("M0 96Q30 84 64 92T128 94V100H0Z", "#F27BB0") + P("M0 98Q-6 120 8 134L30 128Q14 116 26 100Z", "#F27BB0"); }],
    tlForm: [86, 188, function () {
      return R(38, 2, 12, 16, WD2, 4) + P("M18 24Q44 12 70 24Q78 44 66 62Q56 78 68 106Q72 118 66 122H22Q16 118 20 106Q32 78 22 62Q10 44 18 24Z", "#F6D9C0") + P("M22 70Q44 80 66 70L70 108Q44 118 18 108Z", MAG) + L("M30 22Q26 60 34 70M58 22Q64 46 56 70", CIT, 5) + L("M30 28h5M28 38h5M28 48h5M31 58h5", K, 2) + L("M44 122V168", WD2, 7) + P("M44 160L18 184M44 160L70 184M44 160V184", "none", "", 'stroke="' + K + '" stroke-width="6" stroke-linecap="round"'); }],
    ldRow2: [190, 112, function () { return washer(2, 4, RED, PINK, W) + washer(100, 4, GRN, "#8FD9AE", AMB, " d2"); }],
    ldRow3: [286, 112, function () { return washer(2, 4, RED, PINK, W) + washer(99, 4, GRN, "#8FD9AE", AMB, " d2") + washer(196, 4, CIT, "#B79BE8", W); }],
    ldShelf: [188, 112, function () {
      return shelf(188, 84) + G(8, 84, 1, rep(4, function (i) { return R(0, -15 - i * 15, 60, 14, [SEA, W, PINK, AMB][i], 6, "o2"); })) + G(80, 84, 1, rep(3, function (i) { return R(0, -15 - i * 15, 50, 14, [GRN, "#FCE3EC", NV][i], 6, "o2"); })) + G(144, 84, 1, R(0, -46, 34, 46, "#2BA3C6", 7) + R(10, -58, 14, 13, RED, 3) + C(17, -22, 10, W) + C(17, -22, 4, "#2BA3C6")); }],
    ldBasket: [92, 74, function () { return P("M14 30Q22 6 40 16Q50 -2 66 16Q82 12 80 32Z", PINK) + P("M10 30Q20 18 34 30Z", W) + P("M50 30Q60 12 76 30Z", "#8FD6EE") + P("M4 28H88L78 72H14Z", WD3) + L("M12 42H80M14 56H78M30 30L34 70M46 30V70M62 30L58 70", WD2, 3); }],
    shShelf: [190, 140, function () { var c = [[PINK, W], [SEA, AMB], [W, RED], [CIT, K], [GRN, W], ["#9A6BD0", AMB]]; return R(0, 0, 190, 136, "#E9D3B4", 8) + rep(2, function (r) { return rep(3 - 0, function (i) { var q = c[r * 3 + i]; return G(6 + i * 61, 14 + r * 64, 0.86, sneaker(q[0], q[1])); }) + R(0, 50 + r * 64, 190, 8, WD2, 2); }); }],
    shBench: [194, 150, function () {
      return R(0, 100, 194, 16, WD, 5) + L("M18 116V148M176 116V148", K, 8) + G(0, 46, 1.28, sneaker("#E9E3D6", "#B9A58A", true)) + G(112, 46, 1.28, sneaker(W, SEA)) + P("M88 70h18m-8 -8l8 8l-8 8", "none", "", 'stroke="' + MAG + '" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"') + L("M176 24l5 -12M186 36l9 -6M162 28l-3 -12", CIT, 4); }],
    shBrush: [112, 84, function () {
      return M("bub", C(24, 30, 10, "#DDF6FF", "o2") + C(46, 18, 7, "#DDF6FF", "o2") + C(84, 24, 9, "#DDF6FF", "o2") + C(64, 8, 5, "#DDF6FF", "o2")) + P("M8 70Q4 54 20 52Q24 40 40 46Q52 36 64 46Q82 40 88 54Q104 56 100 72Z", W) + R(14, 48, 84, 14, WD2, 7) + rep(9, function (i) { return L("M" + (20 + i * 9) + " 62v13", SEA, 5); }); }],
    btRail: [190, 132, function () { var g = [[MAG, W, 1], [SEA, AMB, 0], [CIT, MAG, 1], [W, RED, 0], [GRN, W, 1]]; return R(0, 10, 190, 7, "#B7BBC9", 3) + C(2, 13, 6, K) + C(188, 13, 6, K) + rep(5, function (i) { return G(26 + i * 35, 34, 0.96, M("sway d" + i, L("M0 -18Q6 -16 2 -10L-14 -2M2 -10L14 -2", K, 2.5) + shirt(g[i][0], g[i][1], g[i][2]))); }); }],
    btMann: [92, 206, function () {
      return C(46, 16, 14, "#F6D9C0", "o") + R(41, 28, 10, 12, "#F6D9C0", 0, "") + P("M26 42Q46 34 66 42L60 84L80 152H12L32 84Z", PINK) + L("M32 84Q46 90 60 84", K, 5) + L("M26 44L16 90M66 44L76 90", "#F6D9C0", 8) + L("M46 152V190", K, 6) + E(46, 196, 30, 8, "#4B4660", "o") + P("M38 42L46 52L54 42", W); }],
    btMirror: [78, 168, function () { return E(39, 72, 34, 66, WD3, "o") + E(39, 72, 25, 56, "#CDEFF8", "o2") + L("M26 98L50 40M36 108L56 62", W, 5) + L("M18 124L6 164M60 124L72 164", WD2, 7); }],
    btBag: [60, 62, function () { return P("M4 20H56L52 60H8Z", CIT) + P("M18 22Q18 4 30 4Q42 4 42 22", "none") + C(30, 40, 8, MAG); }],
    bcCounter: [194, 166, function () {
      return R(0, 58, 194, 106, W, 6) + rep(3, function (r) { return rep(6, function (c) { return R(6 + c * 31, 104 + r * 19, 27, 16, (r + c) % 2 ? "#F1C9D4" : "#FBE7EC", 2, ""); }); }) + P("M6 56H188V100H6Z", "#E4F3F8") +
        G(14, 92, 1, E(22, 0, 24, 6, W, "o2") + P("M4 -4Q4 -22 24 -20Q44 -18 40 -4Z", "#E0566B", "o2") + C(16, -11, 4.5, W)) + G(72, 92, 1, E(22, 0, 24, 6, W, "o2") + rep(3, function (i) { return E(8 + i * 14, -8, 7, 9, "#C8486A", "o2"); })) + G(130, 92, 1, E(22, 0, 26, 6, W, "o2") + P("M0 -4q6 -18 12 0q6 -18 12 0q6 -18 12 0q6 -16 10 0Z", "#B5523B", "o2")) + R(0, 48, 194, 12, "#7E0C41", 4) +
        G(140, 48, 1, P("M0 0L8 -30H42L34 0Z", WD2) + R(12, -50, 7, 22, K, 3, "") + R(22, -54, 7, 26, K, 3, "") + R(32, -48, 7, 20, K, 3, "")); }],
    bcScale: [92, 128, function () { return L("M46 0V16", K, 4) + C(46, 44, 29, W, "o") + rep(8, function (i) { var a = i * Math.PI / 4; return C(46 + Math.cos(a) * 21, 44 + Math.sin(a) * 21, 2, K); }) + G(46, 44, 1, M("needle", L("M0 4V-18", RED, 4))) + C(46, 44, 4, K) + L("M46 73V84M46 84L16 104M46 84L76 104", K, 3) + P("M10 104H82Q78 124 46 124Q14 124 10 104Z", "#B7BBC9"); }],
    bcBoard: [96, 108, function () { return P("M10 6H76Q84 6 84 14V92Q84 100 76 100H10Q2 100 2 92V14Q2 6 10 6Z", WD3) + C(14, 18, 4, K) + P("M26 60Q22 34 46 34Q70 36 66 62Q62 78 46 76Q30 78 26 60Z", RED, "o2") + C(40, 52, 6, W, "o2") + P("M86 20V64Q96 58 94 40Q94 26 86 20Z", "#DDE3EE") + L("M88 64V92", WD2, 8); }],
    bcRail: [188, 92, function () { return R(0, 4, 188, 7, "#8A8FA3", 3) + rep(4, function (i) { var x = 28 + i * 32; return L("M" + x + " 10V22", K, 3) + R(x - 8, 22, 16, 30, "#B5523B", 8) + (i % 2 ? "" : R(x - 8, 52, 16, 28, "#C8654C", 8)); }) + G(160, 10, 1, L("M0 0V8") + rep(5, function (k) { return E((k % 2 ? 5 : -5), 16 + k * 11, 8, 7, "#F3EAD8", "o2"); }) + P("M-4 10Q0 0 4 10", GRN, "o2")); }],
    fuSofa: [196, 108, function () { return R(20, 6, 156, 62, "#0E86A8", 16) + L("M98 10V58", K, 3) + R(22, 52, 76, 28, "#2BA3C6", 9) + R(98, 52, 76, 28, "#2BA3C6", 9) + R(2, 36, 30, 60, SEA, 13) + R(164, 36, 30, 60, SEA, 13) + R(20, 78, 156, 18, SEA, 6) + L("M28 98V106M168 98V106", WD2, 7) + '<g transform="rotate(-10 60 46)">' + R(44, 32, 32, 30, CIT, 6) + "</g>" + '<g transform="rotate(8 136 46)">' + R(122, 32, 30, 30, PINK, 6) + "</g>"; }],
    fuChair: [104, 108, function () { return P("M18 66V22Q18 4 52 4Q86 4 86 22V66Z", RED) + R(18, 56, 68, 26, PINK, 9) + R(4, 40, 24, 50, "#8E1C4C", 11) + R(76, 40, 24, 50, "#8E1C4C", 11) + R(20, 78, 64, 14, "#8E1C4C", 5) + L("M24 92L18 106M80 92L86 106", WD2, 7); }],
    fuLamp: [60, 196, function () { return L("M30 44V184", K, 5) + P("M8 46L18 4H42L52 46Z", CIT) + E(30, 190, 22, 6, K) + P("M8 48H52L64 116H-4Z", "#FFE9B0", "glowc"); }],
    fuRug: [210, 40, function () { return E(105, 20, 102, 18, "#E0697A", "o") + E(105, 20, 80, 13, "#FCE3B0") + E(105, 20, 54, 8, SEA); }],
    fuArt: [92, 74, function () { return R(0, 0, 92, 72, WD2, 4) + G(8, 8, 1, view(76, 56, false, false)); }],
    cpBench: [196, 148, function () {
      return R(0, 62, 196, 20, WD, 4) + R(14, 82, 20, 64, WD2, 2) + R(162, 82, 20, 64, WD2, 2) + R(34, 118, 128, 11, WD2, 2) + L("M14 72H70M96 72H184", WD2, 2.5) +
        G(4, 46, 1, R(0, 0, 118, 16, WD3, 2) + L("M10 6H80M20 11H104", WD, 2)) + G(40, 14, 1, M("saw", P("M30 0L100 22L98 34L26 18Z", "#DDE3EE") + L("M28 19l6 6 5 -5 6 7 5 -5 6 6 5 -5 6 6 5 -4 6 6 5 -4 6 6", K, 2) + P("M32 -4Q8 -10 4 10Q4 26 24 22L32 20Z", MAG) + E(17, 8, 7, 6, SAND, "o2"))) +
        G(142, 62, 1, R(0, -22, 40, 22, SEA, 4) + R(6, -30, 12, 9, K, 2, "")) + M("chip", P("M124 86q10 -6 12 4t-8 6", "none", "", 'stroke="' + WD3 + '" stroke-width="5" stroke-linecap="round"')) + P("M60 140q10 -8 14 2t-8 5M92 142q8 -8 14 0t-6 5M122 138q10 -6 13 3t-9 5", "none", "", 'stroke="' + WD3 + '" stroke-width="5" stroke-linecap="round"'); }],
    cpTools: [190, 124, function () {
      return R(0, 0, 190, 120, "#E4B67E", 6) + rep(4, function (r) { return rep(9, function (c) { return C(14 + c * 20, 16 + r * 29, 1.8, WD2); }); }) +
        G(16, 20, 1, P("M0 0H34Q40 0 40 8V16H0Z", "#8A8FA3") + R(12, 16, 12, 66, WD2, 4)) + G(78, 18, 1, P("M0 0H12V58H58V70H0Z", "#B7BBC9") + L("M14 62h6M26 62h6M38 62h6M3 10h6M3 24h6M3 38h6", K, 2)) + G(146, 20, 1, R(0, 0, 14, 34, RED, 5) + R(4, 34, 6, 46, "#DDE3EE", 1)) + G(168, 20, 1, R(0, 0, 13, 30, CIT, 5) + P("M2 30H11V66L6 78L2 66Z", "#DDE3EE")); }],
    cpPlanks: [74, 192, function () { return '<g transform="rotate(7 30 180)">' + R(2, 8, 20, 180, WD3, 2) + R(24, 2, 20, 186, WD, 2) + R(46, 18, 20, 170, WD3, 2) + L("M10 30V150M34 24V168M56 40V160", WD2, 2) + "</g>"; }],
    mkTable: [196, 150, function () {
      return P("M0 70H196V92H0Z", WD) + P("M6 92H190V148H6Z", "#FDE7F1") + rep(6, function (i) { return P("M" + (6 + i * 31) + " 92h15.500v56h-15.500Z", "#F2A7C6", ""); }) + P("M6 92H190V148H6Z", "none") +
        jar(26, 70, "#F2A81D", 38) + jar(60, 70, "#C97A0E", 30) + bottle(98, 70, "#6C8F2A") + bottle(124, 70, "#A9B93C") + jar(156, 70, "#F2A81D", 34) + C(182, 62, 8, "#4C6B1F", "o2") + C(176, 50, 7, "#6C8F2A", "o2"); }],
    mkComb: [112, 108, function () { var s = "", r, c; function hx(x, y, f) { return P("M" + x + " " + (y - 17) + "l15 8.500v17l-15 8.500l-15 -8.500v-17Z", f); } for (r = 0; r < 3; r++) for (c = 0; c < 3 - (r % 2); c++) s += hx(22 + c * 30 + (r % 2) * 15, 24 + r * 26, (r + c) % 2 ? "#FFC94D" : "#F2A81D"); return s + P("M60 96q-6 12 0 14q6 -2 0 -14Z", "#F2A81D", ""); }],
    mkCrate: [104, 72, function () { return C(20, 24, 13, "#E0562F", "o") + C(46, 18, 14, "#F2A81D", "o") + C(74, 22, 13, "#E0562F", "o") + C(90, 26, 10, "#6C8F2A", "o") + R(2, 28, 100, 42, WD3, 3) + L("M2 42H102M2 56H102M18 28V70M86 28V70", WD2, 3); }],
    mkSign: [70, 60, function () { return bee(); }],
    win: [170, 112, function (n) { return view(170, 112, n); }],
    winS: [110, 84, function (n) { return view(110, 84, n); }],
    lamp: [44, 80, function () { return G(22, 0, 1, lampP(42, CIT)); }],
    lampL: [44, 110, function () { return G(22, 0, 1, lampP(76, RED)); }],
    bee1: [40, 30, function () { return G(20, 18, 1, bee("b1")); }],
    bee2: [40, 30, function () { return G(20, 18, 0.8, bee("b2")); }],
    petals: [120, 60, function () { return M("petal", E(20, 10, 5, 3.5, PINK) + E(64, 26, 5, 3.5, MAG) + E(98, 4, 5, 3.5, "#F27BB0")); }]
  };

  /* Sahne: duvar, zemin, zemin çizgisi (P), süsler, P ve B yerleşimi [eşya, x, y, ölçek] */
  var SC = {
    fl: { w: "#FBE9D8", f: "#E9C99A", out: 1, P: [["flWin", 8, 186, 1], ["petals", 40, 300, 1], ["flStand", 6, 376, 1], ["can", 140, 566, 0.9]], B: [["flWin", 188, 22, 0.82], ["flStand", 34, 24, 0.7], ["can", 200, 128, 0.72], ["petals", 120, 60, 0.8]] },
    hr: { w: "#DDF0F6", f: "#E7D2C4", P: [["hrMirror", 8, 190, 1], ["hrChair", 2, 416, 1.02], ["hrPole", 150, 420, 1.1]], B: [["hrMirror", 124, 20, 0.9], ["hrChair", 34, 44, 0.72], ["hrPole", 286, 60, 0.74]] },
    sp: { w: "#E3C6A0", f: "#A8703F", P: [["spShelf", 8, 190, 1], ["spBamboo", 10, 318, 1.05], ["spBowl", 120, 366, 1], ["spTable", 4, 470, 1.02]], B: [["spShelf", 176, 8, 0.7], ["spBamboo", 36, 26, 0.72], ["spTable", 82, 56, 0.86], ["spBowl", 268, 78, 0.72]] },
    gy: { w: "#E4E1F4", f: "#9AA0B8", P: [["win", 17, 186, 1], ["gyRack", 4, 334, 1], ["gyTread", 10, 462, 1], ["gyBall", 6, 574, 0.8]], B: [["win", 168, 16, 0.86], ["gyRack", 36, 62, 0.8], ["gyTread", 196, 58, 0.72]] },
    vt: { w: "#DFF1E4", f: "#BFD6C6", tile: 1, P: [["vtShelf", 8, 192, 1], ["vtTable", 6, 380, 1.02], ["vtCat", 108, 516, 1]], B: [["vtShelf", 186, 8, 0.74], ["vtTable", 36, 40, 0.74], ["vtCat", 214, 98, 0.8]] },
    ph: { w: "#D5E6F3", f: "#B9A58A", P: [["phWall", 7, 190, 1], ["phBench", 6, 416, 1.02], ["phBox", 126, 560, 1]], B: [["phWall", 184, 18, 0.78], ["phBench", 34, 42, 0.8], ["phBox", 238, 124, 0.7]] },
    tl: { w: "#FCE3EC", f: "#D9B48A", P: [["tlFabric", 7, 186, 1], ["tlForm", 112, 320, 1], ["tlMachine", 6, 424, 1]], B: [["tlFabric", 130, 8, 0.74], ["tlMachine", 34, 34, 0.8], ["tlForm", 268, 28, 0.76]] },
    ld: { w: "#DDF1F7", f: "#C4DCE4", tile: 1, P: [["ldShelf", 8, 186, 1], ["ldRow2", 7, 320, 1], ["ldRow2", 7, 432, 1], ["ldBasket", 60, 554, 1]], B: [["ldShelf", 40, -6, 0.62], ["winS", 206, 8, 0.6], ["ldRow3", 26, 62, 0.98], ["ldBasket", 232, 116, 0.78]] },
    sh: { w: "#EAF3E4", f: "#D6BE98", P: [["shShelf", 7, 188, 1], ["shBench", 5, 404, 1], ["shBrush", 46, 546, 1]], B: [["shShelf", 198, 12, 0.7], ["shBench", 30, 48, 0.8], ["shBrush", 212, 116, 0.72]] },
    bt: { w: "#FDE7F1", f: "#E4C2A0", P: [["btRail", 7, 184, 1], ["btMirror", 6, 400, 1.14], ["btMann", 104, 392, 1], ["btBag", 62, 566, 0.9]], B: [["btRail", 122, 14, 0.94], ["btMann", 34, 14, 0.76], ["btMirror", 282, 46, 0.72], ["btBag", 192, 122, 0.74]] },
    bc: { w: "#F8EDF0", f: "#C9A0A8", tile: 1, awn: "#7E0C41", P: [["bcScale", 4, 206, 1.04], ["bcBoard", 106, 222, 0.98], ["bcRail", 8, 340, 1], ["bcCounter", 5, 434, 1]], B: [["bcCounter", 36, 36, 0.82], ["bcScale", 206, 34, 0.78], ["bcBoard", 284, 46, 0.5]] },
    fu: { w: "#F6E7CF", f: "#C99A66", fy: 470, P: [["fuArt", 12, 192, 1], ["lampL", 140, 160, 1], ["fuLamp", 140, 316, 1], ["fuChair", 10, 384, 1], ["fuRug", -2, 584, 1], ["fuSofa", 3, 494, 1]], B: [["fuArt", 152, 18, 0.74], ["fuLamp", 262, 26, 0.74], ["fuRug", 60, 148, 0.9], ["fuSofa", 40, 72, 0.9], ["fuChair", 232, 88, 0.78]] },
    cp: { w: "#F1DFC4", f: "#B9885A", P: [["cpTools", 7, 188, 1], ["cpPlanks", 124, 330, 1], ["cpBench", 4, 456, 1]], B: [["cpTools", 172, 16, 0.76], ["cpPlanks", 278, 30, 0.72], ["cpBench", 34, 52, 0.84]] },
    mk: { w: "#FFE7C2", f: "#D8B27A", out: 1, sea: 1, awn: "#D98A00", P: [["mkComb", 8, 244, 1], ["bee1", 130, 270, 1.2], ["bee2", 110, 330, 1.2], ["mkTable", 4, 392, 1], ["mkCrate", 78, 552, 1]], B: [["mkTable", 40, 48, 0.82], ["mkComb", 218, 46, 0.72], ["bee1", 174, 34, 1], ["bee2", 284, 40, 1], ["mkCrate", 232, 118, 0.74]] }
  };
  var DEFS = '<linearGradient id="sc-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FD6EE"/><stop offset="1" stop-color="#FFE7C2"/></linearGradient><linearGradient id="sc-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C1645"/><stop offset=".55" stop-color="#7A2F6E"/><stop offset="1" stop-color="#FF9F5A"/></linearGradient><radialGradient id="sc-glow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".75"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient>';

  window.buildScene = function (k, night, mode) {
    var s = SC[k], b = mode === "B", H = b ? 222 : 640, fy = b ? 150 : s.fy || 560, X = -400, WW = 1600, out = "<defs>" + DEFS + "</defs>";
    if (s.out) out += R(X, 0, WW, H, night ? "url(#sc-dusk)" : "url(#sc-sky)", 0, "");
    if (s.sea) out += G(X, b ? 30 : 330, 1, rep(3, function (i) { return G(i * 520, 0, 1, view(520, b ? 130 : 240, night, false, true)); }));
    if (!s.out) out += R(X, 0, WW, H, s.w, 0, "");
    if (k === "fl") out += R(X, b ? -20 : 90, WW, H, "#FBE9D8", 0, "");
    if (s.tile) out += L(rep(Math.ceil(fy / 34), function (i) { return "M" + X + " " + (i * 34 + 10) + "h" + WW; }) + rep(47, function (i) { return "M" + (X + i * 34) + " 0v" + fy; }), "rgba(43,20,48,.07)", 2);
    if (night) out += R(X, 0, WW, H, "#140C33", 0, "").replace("/>", ' opacity=".34"/>');
    var FH = b ? 900 : H - fy;
    out += R(X, fy, WW, FH, s.f, 0, "") + L("M" + X + " " + fy + "h" + WW, "rgba(43,20,48,.28)", 3);
    if (night) out += R(X, fy, WW, FH, "#140C33", 0, "").replace("/>", ' opacity=".26"/>') + E(b ? 180 : 104, b ? 100 : 400, b ? 210 : 190, b ? 120 : 250, "url(#sc-glow)", "glowc");
    if (!b) out += G(-6, 96, 1, bou(216, 58, 34, k.charCodeAt(0) * 31 + k.charCodeAt(1))) + G(-4, 150, 1, bou(20, 120, 12, 99));
    else out += G(-30, -6, 1, bou(420, 20, 34, k.charCodeAt(0) * 31 + k.charCodeAt(1)));
    if (s.awn) out += b ? G(-24, 14, 1, awn(408, s.awn, 14)) : G(-8, 168, 1, awn(216, s.awn, 22));
    if (k === "mk") out += b ? L("M30 30V160M330 30V160", WD2, 6) : L("M8 190V470M198 190V470", WD2, 6);
    (b ? s.B : s.P).forEach(function (p) { out += G(p[1], p[2], p[3], PR[p[0]][2](night)); });
    var el = document.createElement("div");
    el.className = "bg bg-" + mode;
    el.setAttribute("data-bg", k);
    el.innerHTML = '<svg aria-hidden="true" focusable="false" ' + (b ? 'viewBox="0 0 360 222" preserveAspectRatio="xMidYMax slice"' : 'width="560" height="640"') + ">" + out + "</svg>";
    return el;
  };
})();
