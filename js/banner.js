// banner.js — Carrusel de imágenes automático (5s)

(function () {
  'use strict';

  const banner = document.getElementById('imgBanner');
  if (!banner) return;

  const slides = Array.from(banner.querySelectorAll('.banner-slide'));
  const dots   = Array.from(banner.querySelectorAll('.banner-dot'));
  if (slides.length < 2) return;

  let current = 0;
  let timer   = null;
  const INTERVAL = 5000;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function startAuto() {
    stopAuto();
    timer = setInterval(next, INTERVAL);
  }
  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      startAuto();
    });
  });

  // Pausar al pasar el mouse, reanudar al salir
  banner.addEventListener('mouseenter', stopAuto);
  banner.addEventListener('mouseleave', startAuto);

  // Pausar si la pestaña no está visible (ahorra recursos)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  startAuto();
})();
