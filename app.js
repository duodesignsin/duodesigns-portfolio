/**
 * DUO DESIGNS — CREATIVE AGENCY PORTFOLIO
 * Smooth Scrolling, Reveal Animations, Custom Magnetic Cursor & Interactive Modals
 */

const DUO_AGENCY = (() => {
  'use strict';

  // --- DOM Elements Cache ---
  const DOM = {
    header: document.getElementById('siteHeader'),
    mobileMenuBtn: document.getElementById('mobileMenuBtn'),
    mobileDrawer: document.getElementById('mobileDrawer'),
    mobileLinks: document.querySelectorAll('.mobile-link'),
    artworkModal: document.getElementById('artworkModal'),
    modalImg: document.getElementById('modalImg'),
    modalTitle: document.getElementById('modalTitle'),
    modalCategory: document.getElementById('modalCategory'),
    modalFocus: document.getElementById('modalFocus'),
    modalDesc: document.getElementById('modalDesc'),
    allWorkDrawer: document.getElementById('allWorkDrawer'),
    copySuccessToast: document.getElementById('copySuccessToast'),
    copyTextHandle: document.getElementById('copyTextHandle'),
    cursor: document.getElementById('customCursor'),
    cursorTrail: document.getElementById('cursorTrail'),
    navLinks: document.querySelectorAll('.desktop-nav .nav-item:not(.nav-cta)')
  };

  // --- 1. Custom Smooth Agency Cursor ---
  const initCustomCursor = () => {
    if (!DOM.cursor || !DOM.cursorTrail) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let trailX = mouseX;
    let trailY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      DOM.cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    // Smooth lerp loop for outer trail ring
    const renderLoop = () => {
      trailX += (mouseX - trailX) * 0.18;
      trailY += (mouseY - trailY) * 0.18;
      DOM.cursorTrail.style.transform = `translate(${trailX}px, ${trailY}px)`;
      requestAnimationFrame(renderLoop);
    };
    renderLoop();

    // Hover scale trigger on clickable items
    const hoverTargets = document.querySelectorAll('a, button, .project-image-bezel, .compact-media-wrap, .service-row, .drawer-item');
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  };

  // --- 2. Mobile Drawer Navigation ---
  const toggleMobileMenu = () => {
    if (!DOM.mobileMenuBtn || !DOM.mobileDrawer) return;
    const isOpen = DOM.mobileDrawer.classList.contains('open');

    if (isOpen) {
      closeMobileMenu();
    } else {
      DOM.mobileMenuBtn.classList.add('active');
      DOM.mobileMenuBtn.setAttribute('aria-expanded', 'true');
      DOM.mobileDrawer.classList.add('open');
      DOM.mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeMobileMenu = () => {
    if (!DOM.mobileMenuBtn || !DOM.mobileDrawer) return;
    DOM.mobileMenuBtn.classList.remove('active');
    DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    DOM.mobileDrawer.classList.remove('open');
    DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // --- 3. Scroll Reveal Observer ---
  const initScrollReveal = () => {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade');
    if (!revealElements.length) return;

    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => revealObserver.observe(el));
  };

  // --- 4. Active Navigation State Tracking ---
  const initNavScrollSpy = () => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || !DOM.navLinks.length) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 140;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          DOM.navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.style.color = 'var(--text-pure)';
            } else {
              link.style.color = '';
            }
          });
        }
      });
    }, { passive: true });
  };

  // --- 4b. Smart Header Hide on Scroll Down / Show on Scroll Up ---
  const initSmartHeader = () => {
    if (!DOM.header) return;
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateHeader = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;

      // Always show at very top
      if (currentScrollY <= 10) {
        DOM.header.classList.remove('header-hidden');
        DOM.header.classList.add('at-top');
      } else if (scrollDelta > 6) {
        // Scrolling DOWN — hide header
        DOM.header.classList.add('header-hidden');
        DOM.header.classList.remove('at-top');
      } else if (scrollDelta < -4) {
        // Scrolling UP — show header
        DOM.header.classList.remove('header-hidden');
        DOM.header.classList.remove('at-top');
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initialize state
    DOM.header.classList.add('at-top');
  };

  // --- 5. Fullscreen Artwork Modal ---
  const openModal = (imgSrc, title, category, focus, desc) => {
    if (!DOM.artworkModal) return;
    DOM.modalImg.src = imgSrc;
    DOM.modalImg.alt = title;
    DOM.modalTitle.textContent = title;
    DOM.modalCategory.textContent = category.toUpperCase();
    DOM.modalFocus.textContent = focus;
    DOM.modalDesc.textContent = desc;

    DOM.artworkModal.classList.add('open');
    DOM.artworkModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!DOM.artworkModal) return;
    DOM.artworkModal.classList.remove('open');
    DOM.artworkModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // --- 6. View All Work Drawer ---
  const openAllWorkDrawer = () => {
    if (!DOM.allWorkDrawer) return;
    DOM.allWorkDrawer.classList.add('open');
    DOM.allWorkDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeAllWorkDrawer = () => {
    if (!DOM.allWorkDrawer) return;
    DOM.allWorkDrawer.classList.remove('open');
    DOM.allWorkDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // --- 7. Copy Handle Function ---
  const copyHandle = () => {
    const handle = '@duodesigns.in';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(handle).then(showToast).catch(() => fallbackCopy(handle));
    } else {
      fallbackCopy(handle);
    }
  };

  const fallbackCopy = (text) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand('copy');
      showToast();
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(el);
  };

  const showToast = () => {
    if (!DOM.copySuccessToast) return;
    DOM.copySuccessToast.classList.add('show');
    if (DOM.copyTextHandle) DOM.copyTextHandle.textContent = 'COPIED TO CLIPBOARD!';

    setTimeout(() => {
      DOM.copySuccessToast.classList.remove('show');
      if (DOM.copyTextHandle) DOM.copyTextHandle.textContent = 'COPY @duodesigns.in';
    }, 3200);
  };

  // --- 8. Event Bindings ---
  const initListeners = () => {
    // Mobile menu toggle
    if (DOM.mobileMenuBtn) {
      DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile drawer when link clicked
    DOM.mobileLinks.forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Escape key closes modals/drawers
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        closeAllWorkDrawer();
        closeMobileMenu();
      }
    });

    // Smooth offset scroll for all internal anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - headerOffset,
            behavior: 'smooth'
          });
        }
      });
    });
  };

  // --- Bootstrapping ---
  const init = () => {
    initCustomCursor();
    initScrollReveal();
    initNavScrollSpy();
    initSmartHeader();
    initListeners();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Public API
  return {
    openModal,
    closeModal,
    openAllWorkDrawer,
    closeAllWorkDrawer,
    copyHandle
  };
})();
