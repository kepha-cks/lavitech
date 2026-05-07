/* ============================================
   LaviTech — Shared JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- NAV SCROLL EFFECT ----
  const nav = document.querySelector('.nav-glass');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ---- MOBILE MENU ----
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- ACTIVE NAV LINK ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---- 3D CARD TILT ----
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      const inner = card.querySelector('.tilt-inner');
      if (inner) {
        inner.style.transform = `translateZ(40px)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
      const inner = card.querySelector('.tilt-inner');
      if (inner) inner.style.transform = 'translateZ(0)';
    });
  });

  // ---- TYPEWRITER EFFECT ----
  document.querySelectorAll('[data-typewriter]').forEach(el => {
    const strings = el.getAttribute('data-typewriter').split('||');
    const speed = parseInt(el.getAttribute('data-speed')) || 80;
    const deleteSpeed = parseInt(el.getAttribute('data-delete-speed')) || 40;
    const pause = parseInt(el.getAttribute('data-pause')) || 2000;
    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Create cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function type() {
      const current = strings[stringIndex];
      if (isDeleting) {
        el.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeout = isDeleting ? deleteSpeed : speed;

      if (!isDeleting && charIndex === current.length) {
        timeout = pause;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        timeout = 500;
      }

      setTimeout(type, timeout);
    }
    type();
  });

  // ---- SCROLL REVEAL ----
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

  // ---- COUNTER ANIMATION ----
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    let started = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !started) {
          started = true;
          const start = performance.now();
          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            const current = Math.floor(eased * target);
            el.textContent = prefix + current.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  // ---- PARALLAX ON SCROLL ----
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  if (parallaxElements.length > 0) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const rect = el.closest('section') || el.parentElement;
        const offset = (scrollY - (rect.offsetTop || 0)) * speed;
        el.style.transform = `translateY(${offset}px)`;
      });
    }, { passive: true });
  }

  // ---- 3D FLIP CARDS ----
  document.querySelectorAll('.flip-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });

  // ---- PORTFOLIO FILTER ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('[data-category]');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        portfolioItems.forEach(item => {
          if (filter === 'all' || item.getAttribute('data-category') === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.5s, transform 0.5s';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.transition = 'opacity 0.3s, transform 0.3s';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });
  }

  // ---- FLOATING PARTICLES ----
  document.querySelectorAll('.particles-container').forEach(container => {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 10;
      const isGold = Math.random() > 0.6;
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -10px;
        background: ${isGold ? 'var(--accent-gold)' : 'var(--accent-blue)'};
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
      `;
      container.appendChild(particle);
    }
  });

  // ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- FORM SUBMIT HANDLER (placeholder) ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Message Sent!';
      btn.style.background = '#22c55e';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    });
  }

  // ---- THEME SWITCHER ----
  const themeSelectors = document.querySelectorAll('.theme-selector');
  const savedTheme = localStorage.getItem('laviTechTheme') || 'default';

  function applyTheme(theme) {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-neon');
    if (theme && theme !== 'default') {
      document.body.classList.add(`theme-${theme}`);
    }
    document.documentElement.dataset.theme = theme;
    themeSelectors.forEach(selector => {
      selector.value = theme;
    });
    localStorage.setItem('laviTechTheme', theme);
  }

  themeSelectors.forEach(selector => {
    selector.addEventListener('change', (e) => {
      const theme = e.target.value;
      applyTheme(theme);
    });
  });

  applyTheme(savedTheme);

  // ---- QUICK MENU ----
  const quickMenu = document.getElementById('quick-menu');
  if (quickMenu) {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      quickMenu.style.display = 'block';
      quickMenu.style.left = e.pageX + 'px';
      quickMenu.style.top = e.pageY + 'px';
    });
    document.addEventListener('click', () => {
      quickMenu.style.display = 'none';
    });
    quickMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      const link = e.target.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
    });
  }

});