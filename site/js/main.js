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

  /* --- LINE PC モーダル --- */
  const lineModal = document.getElementById('line-modal');
  if (lineModal) {
    const overlay = lineModal.querySelector('.line-modal-overlay');
    const closeBtn = lineModal.querySelector('.line-modal-close');

    const isDesktop = () => window.matchMedia('(min-width: 768px)').matches;

    const openModal = () => {
      lineModal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };
    const closeModal = () => {
      lineModal.hidden = true;
      document.body.style.overflow = '';
    };

    document.querySelectorAll('a[href="https://lin.ee/ohC64EDT"]').forEach(a => {
      a.addEventListener('click', e => {
        if (isDesktop()) {
          e.preventDefault();
          openModal();
        }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !lineModal.hidden) closeModal();
      if (e.key === 'Tab' && !lineModal.hidden) {
        const focusable = lineModal.querySelectorAll('button, a, [tabindex]');
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

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
