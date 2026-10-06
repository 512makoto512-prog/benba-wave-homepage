/* BEMBA OKINAWA — main.js */

document.addEventListener('DOMContentLoaded', () => {

  /* --- ハンバーガーメニュー --- */
  const toggle = document.getElementById('menu-toggle');
  const navList = document.getElementById('nav-list');
  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    navList.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navList.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* --- FAQ アコーディオン --- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* --- ヘッダー スクロール影 --- */
  const header = document.getElementById('site-header');
  if (header) {
    const updateHeader = () => {
      header.style.boxShadow = window.scrollY > 10
        ? '0 2px 16px rgba(0,0,0,.12)' : '';
    };
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

});
