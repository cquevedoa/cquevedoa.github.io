(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const themeMeta = document.querySelector('meta[name=theme-color]');
  const COLORS = { dark: '#12161b', light: '#eef0f2' };

  /* ---- Tema ---- */
  const setTheme = (theme, save) => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    if (themeMeta) themeMeta.content = COLORS[theme];
    if (save) { try { localStorage.setItem('theme', theme); } catch (e) {} }
  };
  setTheme(root.dataset.theme, false);
  themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    let saved = null; try { saved = localStorage.getItem('theme'); } catch (_) {}
    if (!saved) setTheme(e.matches ? 'dark' : 'light', false);
  });

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

  /* ---- Botón "Instalar app" (Android/Chrome) ---- */
  const installBtn = document.getElementById('install-btn');
  let deferred = null;
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; installBtn.hidden = false; });
  installBtn.addEventListener('click', async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null; installBtn.hidden = true;
  });
  addEventListener('appinstalled', () => { installBtn.hidden = true; });

  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Service worker (requiere HTTPS o localhost) ---- */
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
})();
