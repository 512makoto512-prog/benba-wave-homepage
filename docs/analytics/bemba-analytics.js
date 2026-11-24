/*
 * BEMBA アクセス解析（GA4）— 導入準備用。まだ本番サイトには入れていない。
 *
 * 使い方：
 *   1. 下の MEASUREMENT_ID に、GA4で発行された本物の測定ID（G- で始まる）を入れる。
 *      空のままなら何もしない（GA4へは一切送信しない）。
 *   2. このファイルを site/js/bemba-analytics.js に置き、全ページの </body> の直前に
 *        <script src="js/bemba-analytics.js" defer></script>
 *      を1行追加する。
 *
 * 設計方針：
 *   - 表示速度：gtag.js はページの読み込み完了後、ブラウザが空いた時に読み込む（LCPに影響させない）。
 *   - 個人情報：氏名・メール・電話・予約番号などは一切送らない。送るのはページの種類、ツアー名、
 *     ボタンの場所、言語だけ。URLのクエリ（?以降）も UTM 以外は送らない。
 *   - 予約の区別：送るのは「予約フォームを開いた」「LINEを開いた」というクリックだけ。
 *     実際の予約成立は、GoogleフォームとLINEの側で数える（GA4では計測しない）。
 */
(function () {
  'use strict';
  var MEASUREMENT_ID = ''; // 例: 'G-ABC1234567'（本物の測定IDを入れるまで空のままにする）
  if (!/^G-[A-Z0-9]{6,}$/.test(MEASUREMENT_ID)) return;

  // --- ページの情報（個人情報を含まない） ---
  var path = location.pathname.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  var slug = path.replace(/^\//, '').replace(/-en$/, '') || 'top';
  var TOURS = {
    'sup': 'SUP', 'kayak': 'Sea Kayak', 'clear-kayak': 'Clear Kayak', 'snorkel': 'Snorkeling',
    'sup-snorkel': 'SUP + Snorkeling', 'kayak-snorkel': 'Kayak + Snorkeling', 'drone': 'Beach Drone',
    'mangrove-sup': 'Mangrove SUP', 'mangrove-kayak': 'Mangrove Kayak', 'special-menu': 'Sunrise & Sunset'
  };
  var tour = TOURS[slug] || '';
  var pageType = tour ? 'tour' : (slug === 'top' ? 'top' : slug);
  var lang = (document.documentElement.lang || 'ja').slice(0, 2);

  // URL から UTM 以外のクエリと #以降 を外して送る（個人情報が混ざる余地をなくす）
  function cleanLocation() {
    var keep = new URLSearchParams();
    new URLSearchParams(location.search).forEach(function (v, k) { if (/^utm_/.test(k)) keep.set(k, v); });
    var q = keep.toString();
    return location.origin + location.pathname + (q ? '?' + q : '');
  }

  // --- gtag の準備（スクリプト本体は後から読み込む） ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    page_location: cleanLocation(),
    page_type: pageType,       // カスタムディメンション（GA4側で登録）
    tour_name: tour,           // カスタムディメンション（GA4側で登録）
    site_language: lang,       // カスタムディメンション（GA4側で登録）
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  function loadGtag() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    document.head.appendChild(s);
  }
  function whenIdle() { ('requestIdleCallback' in window) ? requestIdleCallback(loadGtag, { timeout: 3000 }) : setTimeout(loadGtag, 1500); }
  if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle);

  // --- 予約フォーム・公式LINE のクリック計測 ---
  function placeOf(a) {
    if (a.closest('#sp-cta')) return 'sticky_bar';
    if (a.closest('#hdr, header, .nav-sp, .nav-pc')) return 'header';
    if (a.closest('#hero')) return 'hero';
    if (a.closest('#gallery')) return 'gallery';
    if (a.closest('#booking')) return 'booking_section';
    if (a.closest('.spc-card, .spc-card-en, .spec-card')) return 'special_menu_card';
    if (a.closest('.faq-item')) return 'faq';
    if (a.closest('footer')) return 'footer';
    return 'body';
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    var name = /docs\.google\.com\/forms/.test(href) ? 'booking_form_click'
             : /(^https?:\/\/)?(lin\.ee|line\.me)\//.test(href) ? 'line_click' : '';
    if (!name) return;
    window.gtag('event', name, {
      link_location: placeOf(a),   // どの場所のボタンか
      page_type: pageType,         // どの種類のページから
      tour_name: tour,             // どのツアーページから
      site_language: lang,
      transport_type: 'beacon'
    });
  }, { capture: true, passive: true });
})();
