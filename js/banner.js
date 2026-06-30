// banner.js — Carrusel fullscreen con flechas, dots y barra de progreso

(function () {
  'use strict';

  const banner = document.getElementById('imgBanner');
  if (!banner) return;

  const slides   = Array.from(banner.querySelectorAll('.banner-slide'));
  const dots     = Array.from(banner.querySelectorAll('.banner-dot'));
  const progress = banner.querySelector('.banner-progress');
  const INTERVAL = 3500;  // 3.5 segundos

  if (slides.length < 2) return;

  let current   = 0;
  let timer     = null;
  let progTimer = null;

  // ── Ir a un slide ──────────────────────────────
  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = ((index % slides.length) + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');

    resetProgress();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  // ── Barra de progreso ──────────────────────────
  function resetProgress() {
    if (!progress) return;
    clearTimeout(progTimer);
    progress.style.transition = 'none';
    progress.style.width = '0%';
    // Forzar reflow
    void progress.offsetWidth;
    progress.style.transition = `width ${INTERVAL}ms linear`;
    progress.style.width = '100%';
  }

  // ── Auto play ──────────────────────────────────
  function startAuto() {
    stopAuto();
    timer = setInterval(next, INTERVAL);
    resetProgress();
  }
  function stopAuto() {
    clearInterval(timer);
    if (progress) {
      progress.style.transition = 'none';
      progress.style.width = progress.style.width; // congela donde está
    }
  }

  // ── Flechas ────────────────────────────────────
  const prevBtn = banner.querySelector('.banner-arrow-prev');
  const nextBtn = banner.querySelector('.banner-arrow-next');

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });

  // ── Dots ───────────────────────────────────────
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startAuto(); });
  });

  // ── Touch / swipe ──────────────────────────────
  let touchStartX = 0;
  banner.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  banner.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      startAuto();
    }
  }, { passive: true });

  // ── Pausa si pestaña oculta ───────────────────
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  // ── Pausa al hover (solo desktop) ─────────────
  banner.addEventListener('mouseenter', stopAuto);
  banner.addEventListener('mouseleave', startAuto);

  // ── Teclado ────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); startAuto(); }
  });

  // ── Inicio ─────────────────────────────────────
  startAuto();

})();
