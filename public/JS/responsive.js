document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const existingNav = document.querySelector('nav');
  if (existingNav) {
    // create toggle button if not present
    let toggle = document.querySelector('.menu-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'menu-toggle';
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Toggle navigation');
      toggle.innerHTML = '<span aria-hidden="true">☰</span>';
      // insert before nav
      existingNav.parentNode.insertBefore(toggle, existingNav);
    }

    // ensure nav has a ul wrapper for manipulation
    const navList = existingNav.querySelector('ul') || existingNav;
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = existingNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    document.addEventListener('click', (e) => {
      if (!existingNav.contains(e.target) && !toggle.contains(e.target) && existingNav.classList.contains('open')) {
        existingNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
});
