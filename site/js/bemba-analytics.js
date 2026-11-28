/*
 * BEMBA アクセス解析（GA4 直接設置。Googleタグマネージャーは使わない）
 * 設計書：docs/ANALYTICS_SETUP.md
 *
 * - 個人情報は送らない：送るのはページの種類・ツアー名・ボタンの場所・言語だけ。
 *   page_location は UTM 以外のクエリと # 以降を削除、page_referrer はドメインとパスだけに短縮。
 * - booking_form_click / line_click は「フォーム・LINEを開いたクリック」。予約の成立数ではない。
 * - 表示速度：gtag.js はページ表示後（空き時間）か、最初の操作時に読み込む。
 * - 取りこぼし防止：読み込み前のクリックは dataLayer に溜めて後から送信。
 *   同じタブで移動するリンクだけ、送信完了まで最大0.6秒待ってから移動する。
 * - 管理者の除外：URLの末尾に #bemba-internal-on を付けて一度開くと、そのブラウザのアクセスに
 *   traffic_type=internal が付く（GA4のデータフィルタで除外）。#bemba-internal-off で解除。
 * - 動作確認：#bemba-debug-on で GA4 の DebugView に表示（#bemba-debug-off で解除）。
 */
(function () {
  'use strict';
  var MEASUREMENT_ID = 'G-R58EK2MPC1';
  if (window.__bembaAnalytics) return;      // 二重読み込み防止
  window.__bembaAnalytics = true;

  // --- 管理者用フラグ（このブラウザだけに保存。GA4には送らない） ---
  function flag(name, value) {
    try {
      if (value === undefined) return localStorage.getItem(name) === '1';
      if (value) localStorage.setItem(name, '1'); else localStorage.removeItem(name);
    } catch (e) { return false; }
  }
  function applyHashFlags() {
    var h = location.hash;
    if (h === '#bemba-internal-on') flag('bemba_internal', true);
    if (h === '#bemba-internal-off') flag('bemba_internal', false);
    if (h === '#bemba-debug-on') flag('bemba_debug', true);
    if (h === '#bemba-debug-off') flag('bemba_debug', false);
  }
  applyHashFlags();
  window.addEventListener('hashchange', applyHashFlags);  // 同じページで # だけ変えた場合（次のページから反映）
  var internal = flag('bemba_internal');
  var debug = flag('bemba_debug');

  // --- ページ情報（個人情報を含まない固定の値だけ） ---
  var path = location.pathname.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
  var slug = path.replace(/^\//, '').replace(/-en$/, '');
  if (slug === '' || slug === 'index') slug = 'top';
  var TOURS = {
    'sup': 'SUP', 'kayak': 'Sea Kayak', 'clear-kayak': 'Clear Kayak', 'snorkel': 'Snorkeling',
    'sup-snorkel': 'SUP + Snorkeling', 'kayak-snorkel': 'Kayak + Snorkeling', 'drone': 'Beach Drone',
    'mangrove-sup': 'Mangrove SUP', 'mangrove-kayak': 'Mangrove Kayak', 'special-menu': 'Sunrise & Sunset'
  };
  var me = document.currentScript;
  var forced = me && me.getAttribute('data-page-type');
  if (forced) { slug = forced; }
  var pageType = forced ? forced : TOURS[slug] ? 'tour' : (slug === 'top' ? 'top' : slug.replace(/[^a-z0-9-]/g, '').slice(0, 40));
  var tour = TOURS[slug] || '(none)';
  var lang = (document.documentElement.lang || 'ja').slice(0, 2) === 'en' ? 'en' : 'ja';

  function cleanLocation() {
    var keep = new URLSearchParams();
    new URLSearchParams(location.search).forEach(function (v, k) {
      if (/^utm_(source|medium|campaign|content|term)$/.test(k)) keep.set(k, v.slice(0, 100));
    });
    var q = keep.toString();
    // /sup と /sup.html を同じページとして記録する（表記揺れの防止）
    var p = location.pathname.replace(/\/index(\.html)?$/, '/').replace(/\.html$/, '');
    return location.origin + p + (q ? '?' + q : '');
  }
  function cleanReferrer() {
    if (!document.referrer) return '';
    try { var r = new URL(document.referrer); return r.origin + r.pathname; } catch (e) { return ''; }
  }

  // --- gtag の準備（本体は後から読み込む。それまでのイベントは dataLayer に溜まる） ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // 同意設定：広告用の保存・送信は常に無効。アナリティクスは日本など多くの地域で有効、
  // 同意バナーが必要な欧州経済領域・英国・スイスでは既定で無効（Cookieを保存しない）。
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'granted'
  });
  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT',
             'LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH']
  });

  var shared = { page_type: pageType, tour_name: tour, site_language: lang };
  if (internal) shared.traffic_type = 'internal';
  window.gtag('set', shared);
  window.gtag('js', new Date());
  // 共通パラメータは config にも入れる（gtag('set') だけでは自動送信の page_view に付かないことを GA4 の実データで確認）
  var config = {
    page_type: pageType,
    tour_name: tour,
    site_language: lang,
    page_location: cleanLocation(),
    page_referrer: cleanReferrer(),
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  };
  if (internal) config.traffic_type = 'internal';
  if (debug) config.debug_mode = true;
  window.gtag('config', MEASUREMENT_ID, config);

  var loaded = false, requested = false;
  function loadGtag() {
    if (requested) return;
    requested = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
    s.onload = function () { loaded = true; };
    document.head.appendChild(s);
  }
  // ページ表示後の空き時間に読み込む。先に操作があればその時点で読み込む。
  function whenIdle() {
    if ('requestIdleCallback' in window) requestIdleCallback(loadGtag, { timeout: 2000 });
    else setTimeout(loadGtag, 1200);
  }
  if (document.readyState === 'complete') whenIdle(); else window.addEventListener('load', whenIdle);
  ['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (t) {
    window.addEventListener(t, loadGtag, { once: true, passive: true, capture: true });
  });

  // --- 予約フォーム・公式LINE のクリック計測 ---
  function placeOf(a) {
    if (a.closest('#sp-cta')) return 'sticky_bar';
    if (a.closest('#hdr, header, .nav-sp, .nav-pc')) return 'header';
    if (a.closest('#hero')) return 'hero';
    if (a.closest('#gallery')) return 'gallery';
    if (a.closest('#booking')) return 'booking_section';
    if (a.closest('.spc-card, .spc-card-en, .spec-card')) return 'special_menu_card';
    if (a.closest('.faq-item')) return 'faq';
    if (a.closest('.mangrove-head')) return 'mangrove_note';
    if (a.closest('footer')) return 'footer';
    return 'body';
  }
  function kindOf(href) {
    if (/^https:\/\/docs\.google\.com\/forms\//.test(href)) return 'booking_form_click';
    if (/^https:\/\/(lin\.ee|line\.me)\//.test(href)) return 'line_click';
    return '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var name = kindOf(a.href);
    if (!name) return;
    var params = {
      link_location: placeOf(a),
      page_type: pageType,
      tour_name: tour,
      site_language: lang,
      transport_type: 'beacon'
    };
    var sameTab = (!a.target || a.target === '_self') && !e.defaultPrevented && e.button === 0 &&
                  !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey);
    if (sameTab && !loaded) {
      // 計測の読み込み前に同じタブで移動すると記録が消えるため、送信完了まで最大0.6秒待つ
      e.preventDefault();
      var href = a.href, done = false;
      var go = function () { if (!done) { done = true; location.href = href; } };
      params.event_callback = go;
      params.event_timeout = 600;
      loadGtag();
      window.gtag('event', name, params);
      setTimeout(go, 700);
      return;
    }
    window.gtag('event', name, params);
  }, true);
})();
