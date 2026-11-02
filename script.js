// ============================================
// Doni Irawan Portfolio - JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // ========== Navigation: Smooth Scroll & Scroll Spy ==========
  const navLinks = document.querySelectorAll('#desktop-nav .nav-item');
  const sections = ['home', 'about', 'experience', 'projects', 'contact']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  };

  let isClickScrolling = false;
  let scrollLockTimer = null;
  let scrollTicking = false;

  // Satu listener per link: set state aktif + tandai sedang smooth-scroll
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const id = (link.getAttribute('href') || '').replace('#', '');
      if (id) setActiveLink(id);

      isClickScrolling = true;
      clearTimeout(scrollLockTimer);
      scrollLockTimer = setTimeout(() => {
        isClickScrolling = false;
        updateActiveSection();
      }, 1000);
    });
  });

  const updateActiveSection = () => {
    if (isClickScrolling) return;

    const scrollPos = window.scrollY + 120;

    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec.offsetTop <= scrollPos) {
        setActiveLink(sec.id);
        return;
      }
    }
  };

  window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
      updateActiveSection();
      scrollTicking = false;
    });
  }, { passive: true });

  updateActiveSection();

  // ========== Mobile Menu Toggle ==========
  // Kontrol utama memakai checkbox + <label>, jadi buka/tutup tetap jalan tanpa JS.
  // JS hanya menyinkronkan state tambahan: scroll lock, aria, dan class.
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const mobileClose = document.getElementById('mobile-menu-close');
  const mobileLinks = document.querySelectorAll('#mobile-nav a');

  const isMobileMenuOpen = () =>
    Boolean(mobileMenu && (mobileMenu.classList.contains('open') || (mobileToggle && mobileToggle.checked)));

  function setMenuState(open) {
    if (!mobileMenu || !mobileOverlay) return;

    if (mobileToggle) mobileToggle.checked = open;
    mobileMenu.classList.toggle('open', open);
    mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
    mobileOverlay.classList.toggle('hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  const closeMobile = () => setMenuState(false);

  if (mobileToggle) {
    mobileToggle.addEventListener('change', () => setMenuState(mobileToggle.checked));
  }

  // Label dengan role="button" tidak otomatis aktif lewat keyboard, jadi tangani manual
  [mobileBtn, mobileClose].forEach(el => {
    if (!el) return;
    el.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      if (mobileToggle) mobileToggle.click();
      else setMenuState(!isMobileMenuOpen());
    });
  });

  mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

  // Tutup menu dengan tombol ESC, lalu kembalikan fokus ke tombol pembuka
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuOpen()) {
      closeMobile();
      if (mobileBtn) mobileBtn.focus();
    }
  });

  // ========== Scroll Reveal Animation ==========
  const revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -100px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      // Fallback browser lama: langsung tampilkan semua
      revealElements.forEach(el => el.classList.add('visible'));
    }
  }

  // ========== Dynamic Year in Footer ==========
  const yearElements = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

});
