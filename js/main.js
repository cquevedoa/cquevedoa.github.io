(() => {
  const root = document.documentElement;
  const COLORS = { dark: '#12161b', light: '#eef0f2' };
  const themeMeta = document.querySelector('meta[name=theme-color]');
  const systemDark = matchMedia('(prefers-color-scheme: dark)');
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('app-menu');
  const choices = [...menu.querySelectorAll('[data-theme-choice]')];

  /* ---- Tema: sigue al sistema salvo que se elija Claro u Oscuro ---- */
  const readPref = () => {
    try { const v = localStorage.getItem('theme'); return v === 'dark' || v === 'light' ? v : null; }
    catch (e) { return null; }
  };
  const writePref = v => {
    try { v ? localStorage.setItem('theme', v) : localStorage.removeItem('theme'); } catch (e) {}
  };
  const applyTheme = () => {
    const pref = readPref();
    const theme = pref || (systemDark.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    if (themeMeta) themeMeta.content = COLORS[theme];
    choices.forEach(c => c.setAttribute('aria-checked', String(c.dataset.themeChoice === (pref || 'system'))));
  };
  applyTheme();
  systemDark.addEventListener('change', () => { if (!readPref()) applyTheme(); });

  /* ---- Menú desplegable ---- */
  const isOpen = () => !menu.hidden;
  const openMenu = () => {
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    (choices.find(c => c.getAttribute('aria-checked') === 'true') || choices[0]).focus();
  };
  const closeMenu = refocus => {
    if (!isOpen()) return;
    menu.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
    if (refocus) menuBtn.focus();
  };
  menuBtn.addEventListener('click', () => (isOpen() ? closeMenu(true) : openMenu()));
  menuBtn.addEventListener('keydown', e => { if (e.key === 'ArrowDown') { e.preventDefault(); openMenu(); } });
  choices.forEach(c => c.addEventListener('click', () => {
    const v = c.dataset.themeChoice;
    writePref(v === 'system' ? null : v);
    applyTheme();
    closeMenu(true);
  }));
  menu.addEventListener('keydown', e => {
    const i = choices.indexOf(document.activeElement);
    const go = n => { e.preventDefault(); choices[(n + choices.length) % choices.length].focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(choices.length - 1);
    else if (e.key === 'Tab') closeMenu(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(true); });
  document.addEventListener('pointerdown', e => { if (isOpen() && !e.target.closest('.menu-wrap')) closeMenu(false); });

  /* ---- Navegación interna sin ensuciar el historial ---- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView();
    history.replaceState(null, '', a.getAttribute('href'));
  });

  /* ---- Pestaña activa de la barra inferior (scrollspy) ---- */
  const links = [...document.querySelectorAll('[data-spy]')];
  const sections = links.map(l => document.getElementById(l.dataset.spy)).filter(Boolean);
  let ticking = false;
  const updateActive = () => {
    ticking = false;
    const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4;
    let current = sections[0];
    if (atBottom) current = sections[sections.length - 1];
    else for (const s of sections) if (s.getBoundingClientRect().top <= innerHeight * 0.4) current = s;
    links.forEach(l => l.setAttribute('aria-current', String(l.dataset.spy === current.id)));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateActive); } }, { passive: true });
  addEventListener('resize', updateActive, { passive: true });
  updateActive();

  /* ---- Entrada suave de secciones ---- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    reveals.forEach(r => io.observe(r));
  } else reveals.forEach(r => r.classList.add('in'));

  /* ---- Formulario de contacto ---- */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('[type=submit]');
    const label = submitBtn.querySelector('.btn-label');
    const fields = [...form.querySelectorAll('input[required], textarea[required]')];

    const errText = f => {
      const v = f.validity;
      if (v.valueMissing) return 'Completá este campo.';
      if (v.typeMismatch || v.patternMismatch) return 'Ingresá un email válido.';
      if (v.tooShort) return `Escribí al menos ${f.minLength} caracteres.`;
      return 'Revisá este campo.';
    };
    const showErr = f => {
      const bad = !f.validity.valid;
      f.setAttribute('aria-invalid', String(bad));
      document.getElementById('err-' + f.id.slice(2)).textContent = bad ? errText(f) : '';
    };
    const clearErrs = () => fields.forEach(f => {
      f.removeAttribute('aria-invalid');
      document.getElementById('err-' + f.id.slice(2)).textContent = '';
    });
    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.className = 'status' + (kind ? ' ' + kind : '');
    };
    const setBusy = busy => {
      submitBtn.disabled = busy;
      label.textContent = busy ? 'Enviando…' : 'Enviar mensaje';
    };

    fields.forEach(f => {
      f.addEventListener('blur', () => { if (f.value) showErr(f); });
      f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') showErr(f); });
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      setStatus('', '');
      fields.forEach(showErr);
      const firstBad = fields.find(f => !f.validity.valid);
      if (firstBad) { firstBad.focus(); return; }

      const data = Object.fromEntries(new FormData(form));
      if (data.website) { // campo trampa para bots: se simula éxito sin enviar nada
        form.reset();
        setStatus('¡Gracias! Tu mensaje fue enviado.', 'ok');
        return;
      }

      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        setBusy(true);
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ name: data.name, email: data.email, message: data.message })
          });
          if (!res.ok) throw new Error(res.status);
          form.reset(); clearErrs();
          setStatus('¡Gracias! Recibí tu mensaje y te respondo a la brevedad.', 'ok');
        } catch (_) {
          setStatus('No se pudo enviar el mensaje. Probá de nuevo o escribime por email.', 'fail');
        } finally { setBusy(false); }
      } else {
        const to = form.dataset.email;
        const subject = `Contacto desde la web — ${data.name}`;
        const body = `${data.message}\n\n— ${data.name} (${data.email})`;
        location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setStatus(`Se abrió tu app de correo con el mensaje listo. Si no pasó nada, escribime a ${to}.`, 'ok');
      }
    });
  }

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Service worker (requiere HTTPS o localhost) ---- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
