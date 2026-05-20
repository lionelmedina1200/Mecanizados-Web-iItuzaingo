// formulario.js — Mecanizado Ituzaingó S.A.

(function () {
  'use strict';

  const form = document.getElementById('contactoForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');
  const submitBtn = form.querySelector('[type="submit"]');

  // ── Validaciones ──────────────────────────────
  const rules = {
    nombre: {
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
    err.textContent = error || '';
    el.style.borderColor = error ? '#fc8181' : '';
    el.style.boxShadow   = error ? '0 0 0 3px rgba(252,129,129,0.12)' : '';
  }

  function validateField(key) {
    const val   = rules[key].el.value.trim();
    const error = rules[key].validate(val);
    setFieldState(key, error);
    return !error;
  }

  Object.keys(rules).forEach(key => {
    const el = rules[key].el;
    el.addEventListener('blur',  () => validateField(key));
    el.addEventListener('input', () => { if (rules[key].err.textContent) validateField(key); });
  });

  // ── File drop zone ─────────────────────────────
  const drop    = document.getElementById('fileDrop');
  const input   = document.getElementById('archivo');
  const nameEl  = document.getElementById('fileName');
  const removeBtn = document.getElementById('fileRemove');

  function setFile(file) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      nameEl.textContent = 'El archivo supera los 10MB.';
      nameEl.style.color = '#fc8181';
      if (input) input.value = '';
      return;
    }
    nameEl.textContent = '✓ ' + file.name;
    nameEl.style.color = '';
    if (removeBtn) removeBtn.style.display = 'inline-flex';
  }

  function clearFile() {
    if (input) input.value = '';
    if (nameEl) { nameEl.textContent = ''; nameEl.style.color = ''; }
    if (removeBtn) removeBtn.style.display = 'none';
  }

  if (input) {
    input.addEventListener('change', () => setFile(input.files[0]));
  }

  if (drop) {
    drop.addEventListener('dragover',  (e) => { e.preventDefault(); drop.classList.add('dragover'); });
    drop.addEventListener('dragleave', ()  => drop.classList.remove('dragover'));
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      setFile(file);
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearFile();
    });
  }

  // ── Envío — sin archivo (Formspree free no soporta adjuntos) ──
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const valid = Object.keys(rules).map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = Object.values(rules).find(r => r.err.textContent);
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Enviando…';

    // Armar datos SIN archivo (Formspree free no acepta files)
    // Si hay archivo, agregar nota en el mensaje
    const archivo = input && input.files[0];
    const mensajeOriginal = form.querySelector('#mensaje').value;
    const mensajeFinal = archivo
      ? mensajeOriginal + '\n\n[El cliente adjuntó un archivo: ' + archivo.name + '. Se lo enviará por separado.]'
      : mensajeOriginal;

    const payload = {
      nombre:   form.querySelector('#nombre').value,
      empresa:  form.querySelector('#empresa') ? form.querySelector('#empresa').value : '',
      email:    form.querySelector('#email').value,
      telefono: form.querySelector('#telefono') ? form.querySelector('#telefono').value : '',
      servicio: form.querySelector('#servicio') ? form.querySelector('#servicio').value : '',
      mensaje:  mensajeFinal,
    };

    try {
      const res = await fetch('https://formspree.io/f/maqkewzb', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body:    JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('HTTP ' + res.status);

      form.reset();
      clearFile();
      Object.keys(rules).forEach(k => setFieldState(k, null));

      successEl.style.display = 'block';
      successEl.textContent   = archivo
        ? '✓ Consulta enviada. Acordate de mandarnos el archivo por WhatsApp o email. Te respondemos antes de las 24hs.'
        : '✓ Consulta enviada. Te contactamos antes de las 24hs hábiles.';

      submitBtn.textContent = 'Mensaje enviado';
      setTimeout(() => {
        successEl.style.display = 'none';
        submitBtn.textContent   = 'Enviar consulta →';
        submitBtn.disabled      = false;
      }, 7000);

    } catch (err) {
      console.error('Error formulario:', err);
      submitBtn.disabled      = false;
      submitBtn.textContent   = 'Error — intentá de nuevo';
      submitBtn.style.background = '#7f1d1d';
      setTimeout(() => {
        submitBtn.textContent      = 'Enviar consulta →';
        submitBtn.style.background = '';
      }, 4000);
    }
  });

})();
