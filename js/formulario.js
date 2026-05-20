// formulario.js — Mecanizado Ituzaingó S.A.

(function () {
  'use strict';

  const form = document.getElementById('contactoForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('[type="submit"]');

  const rules = {
    nombre:  {
      el: form.querySelector('#nombre'),
      err: form.querySelector('#err-nombre'),
      validate(v) {
        if (!v) return 'El nombre es requerido.';
        if (v.length < 2) return 'Mínimo 2 caracteres.';
        return null;
      }
    },
    email: {
      el: form.querySelector('#email'),
      err: form.querySelector('#err-email'),
      validate(v) {
        if (!v) return 'El email es requerido.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ingresá un email válido.';
        return null;
      }
    },
    mensaje: {
      el: form.querySelector('#mensaje'),
      err: form.querySelector('#err-mensaje'),
      validate(v) {
        if (!v) return 'Describí tu consulta.';
        if (v.length < 15) return 'Por favor agregá más detalle (mín. 15 caracteres).';
        return null;
      }
    }
  };

  function setFieldState(key, error) {
    const { el, err } = rules[key];
    const hasError = Boolean(error);
    err.textContent = error || '';
    el.style.borderColor  = hasError ? '#fc8181' : '';
    el.style.boxShadow    = hasError ? '0 0 0 3px rgba(252,129,129,0.12)' : '';
  }

  function validateField(key) {
    const val = rules[key].el.value.trim();
    const error = rules[key].validate(val);
    setFieldState(key, error);
    return !error;
  }

  // Validación en tiempo real (blur + input si ya hay error)
  Object.keys(rules).forEach(key => {
    const el = rules[key].el;
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      if (rules[key].err.textContent) validateField(key);
    });
  });

  // Envío
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      // Focus al primer campo con error
      const firstInvalid = Object.values(rules).find(r => r.err.textContent);
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';

    // ─────────────────────────────────────────────────────────
    // CONFIGURAR ENDPOINT
    // Opción A — Formspree (recomendado, gratis hasta 50/mes):
    //   1. Ir a https://formspree.io y crear cuenta
    //   2. Crear formulario y copiar el ID
    //   3. Reemplazar 'TU_FORM_ID' con el ID real
    //
    // Opción B — Netlify Forms:
    //   Agregar netlify al <form> y no se necesita endpoint
    // ─────────────────────────────────────────────────────────
    const ENDPOINT = 'https://formspree.io/f/maqkewzb';

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      form.reset();
      Object.keys(rules).forEach(k => setFieldState(k, null));
      successEl.style.display = 'block';
      successEl.textContent = '✓ Consulta enviada. Te contactamos en menos de 24hs hábiles.';
      submitBtn.textContent = 'Mensaje enviado';

      setTimeout(() => {
        successEl.style.display = 'none';
        submitBtn.textContent = 'Enviar consulta';
        submitBtn.disabled = false;
      }, 6000);

    } catch (err) {
      console.error('Error al enviar formulario:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Error al enviar — intentá de nuevo';
      submitBtn.style.background = '#7f1d1d';
      setTimeout(() => {
        submitBtn.textContent = 'Enviar consulta';
        submitBtn.style.background = '';
      }, 4000);
    }
  });

})();

// ── File drop zone ─────────────────────────────
(function () {
  const drop     = document.getElementById('fileDrop');
  const input    = document.getElementById('archivo');
  const nameEl   = document.getElementById('fileName');
  if (!drop || !input) return;

  // Click en el label abre el file picker
  input.addEventListener('change', () => {
    const file = input.files[0];
    if (!file) return;
    // Validar tamaño máx 10MB
    if (file.size > 10 * 1024 * 1024) {
      nameEl.textContent = 'El archivo supera los 10MB.';
      nameEl.style.color = '#fc8181';
      input.value = '';
      return;
    }
    nameEl.textContent = '✓ ' + file.name;
    nameEl.style.color = '';
  });

  // Drag & drop
  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.classList.add('dragover');
  });
  drop.addEventListener('dragleave', () => drop.classList.remove('dragover'));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (!file) return;
    // Transferir al input real
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change'));
  });
})();
