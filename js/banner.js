// banner.js — Carrusel con autoplay 3.5s + navegación manual + swipe

(function () {
  'use strict';

  const banner = document.getElementById('imgBanner');
  if (!banner) return;

  const slides  = Array.from(banner.querySelectorAll('.banner-slide'));
  const dots    = Array.from(banner.querySelectorAll('.banner-dot'));
  const btnPrev = banner.querySelector('.banner-arrow-prev');
  const btnNext = banner.querySelector('.banner-arrow-next');
  if (slides.length < 2) return;

  const INTERVAL = 3500;
  let current  = 0;
  let timer    = null;
  let progTimer = null;

  // ── Ir a una slide ────────────────────────────
  function goTo(index, direction) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = ((index % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');


  }

  // ── Autoplay ──────────────────────────────────
  function startAuto() {
    stopAuto();
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  }
  function stopAuto() {
    clearInterval(timer);
  }

  // ── Flechas ───────────────────────────────────
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goTo(current - 1);
      startAuto();
    });
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      goTo(current + 1);
      startAuto();
    });
  }

  // ── Dots ──────────────────────────────────────
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto();
    });
  });

  // ── Swipe touch (mobile) ──────────────────────
  let touchStartX = 0;
  let touchStartY = 0;

  banner.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  banner.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    // Solo swipe horizontal (ignora scroll vertical)
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goTo(current + 1);
    else        goTo(current - 1);
    startAuto();
  }, { passive: true });

  // ── Drag mouse (desktop) ──────────────────────
  let mouseStartX = 0;
  let isDragging  = false;

  banner.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isDragging  = true;
    stopAuto();
  });
  window.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const dx = e.clientX - mouseStartX;
    if (Math.abs(dx) > 40) {
      if (dx < 0) goTo(current + 1);
      else        goTo(current - 1);
    }
    startAuto();
  });

  // ── Teclado ───────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (!banner.getBoundingClientRect().bottom > 0) return;
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  // ── Pausa con visibilidad ─────────────────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // ── Arrancar ──────────────────────────────────
  startAuto();
})();
