// main.js — Mecanizado Ituzaingó S.A.

(function () {
  'use strict';

  // ── Navbar scroll ────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ── Menú mobile ──────────────────────────────
  const burger  = document.getElementById('navBurger');
  const navMenu = document.getElementById('navMenu');

  if (burger && navMenu) {
    burger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });

    // Cerrar al seleccionar un link
    navMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navMenu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    // Cerrar al tocar fuera
    document.addEventListener('click', (e) => {
      if (navbar && !navbar.contains(e.target)) {
        navMenu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Link activo por página ───────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });

  // ── Animaciones reveal al scroll ─────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger leve para grillas
        const delay = parseInt(entry.target.dataset.delay || '0') || i * 60;
        setTimeout(() => entry.target.classList.add('in'), Math.min(delay, 300));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  // Asignar delay escalonado a elementos en grilla
  document.querySelectorAll('.s-servicios-grid .reveal, .s-porque-grid .reveal, .s-sectores-row .reveal').forEach((el, i) => {
    el.dataset.delay = i * 80;
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

})();
