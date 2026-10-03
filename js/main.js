(() => {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const menuBtn = document.getElementById('btn-menu');
  const menu = document.getElementById('menu');

  const setTheme = (theme, save) => {
    root.dataset.theme = theme;
    const dark = theme === 'dark';
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
    if (save) { try { localStorage.setItem('theme', theme); } catch (e) {} }
  };
  setTheme(root.dataset.theme, false);
  themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

  // Sin elección guardada, seguir los cambios del sistema
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    let saved = null; try { saved = localStorage.getItem('theme'); } catch (_) {}
    if (!saved) setTheme(e.matches ? 'dark' : 'light', false);
  });

  const toggleMenu = open => {
    menu.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  menuBtn.addEventListener('click', () => toggleMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) toggleMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
