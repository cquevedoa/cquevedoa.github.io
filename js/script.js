// Alternar modo oscuro con persistencia y accesibilidad
const toggleBtn = document.getElementById('theme-toggle');
const icon = document.getElementById('icon');

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  } else {
    document.body.classList.remove('dark-theme');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
  }
}

let current = storedTheme || (prefersDark ? 'dark' : 'light');
applyTheme(current);
localStorage.setItem('theme', current);

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  // simple rotate animation
  icon.classList.add('icon-rotate');
  setTimeout(() => icon.classList.remove('icon-rotate'), 600);
  if (isDark) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'dark');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'light');
  }
}

if (toggleBtn) {
  toggleBtn.addEventListener('click', toggleTheme);
  toggleBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  });
}
