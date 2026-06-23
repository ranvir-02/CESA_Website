/* ============================================================
   CESA WEBSITE — about.js
   Systems: cursor, navbar, hero particles, scroll reveal,
   hover focus system, building parallax, scroll-to-top,
   page transitions
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility: DOM ready ───────────────────────────────────── */
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {

    /* ============================================================
       1. CUSTOM CURSOR
       ============================================================ */
    const cursorDot  = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');

    let mouseX = window.innerWidth  / 2;
    let mouseY = window.innerHeight / 2;
    let ringX  = mouseX;
    let ringY  = mouseY;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
      }
    });

    (function animateRing() {
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    })();

    /* Hover state */
    const interactives =
      'a, button, .mv-card, .objective-card, .college-feature-card, ' +
      '.dept-highlight-card, .btn, .tag, .nav-link, .footer-social-link, ' +
      '.footer-link, #scroll-top';

    document.querySelectorAll(interactives).forEach(el => {
      el.addEventListener('mouseenter', () =>
        document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () =>
        document.body.classList.remove('cursor-hover'));
    });

    document.addEventListener('mousedown', () =>
      document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () =>
      document.body.classList.remove('cursor-click'));

    document.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.style.opacity  = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.style.opacity  = '1';
      if (cursorRing) cursorRing.style.opacity = '1';
    });

    /* ============================================================
       2. NAVBAR — scroll + hamburger
       ============================================================ */
    const navbar      = document.getElementById('navbar');
    const hamburger   = document.getElementById('hamburger');
    const mobileNav   = document.getElementById('navbar-mobile');
    const mobileClose = document.getElementById('mobile-close');

    function handleNavScroll() {
      if (!navbar) return;
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow =
          mobileNav.classList.contains('open') ? 'hidden' : '';
      });
    }

    if (mobileClose && mobileNav) {
      mobileClose.addEventListener('click', () => {
        hamburger && hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    if (mobileNav) {
      mobileNav.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger && hamburger.classList.remove('open');
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        });
      });
    }

    /* ============================================================
       3. HERO PARTICLES (lightweight — inner page density)
       ============================================================ */
    const heroCanvas = document.getElementById('about-hero-canvas');
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      let W, H, particles, animId;

      function resize() {
        W = heroCanvas.width  = heroCanvas.offsetWidth  || window.innerWidth;
        H = heroCanvas.height = heroCanvas.offsetHeight || 400;
      }

      function createParticles() {
        const count = Math.min(50, Math.floor((W * H) / 16000));
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x:     Math.random() * W,
            y:     Math.random() * H,
            vx:    (Math.random() - 0.5) * 0.3,
            vy:    (Math.random() - 0.5) * 0.3,
            r:     Math.random() * 1.4 + 0.3,
            alpha: Math.random() * 0.4 + 0.1,
            hue:   Math.random() > 0.5 ? 'blue' : 'purple',
          });
        }
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);

        /* Connections */
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 100) * 0.12})`;
              ctx.lineWidth   = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        /* Dots */
        particles.forEach(p => {
          ctx.beginPath();
          ctx.fillStyle = p.hue === 'blue'
            ? `rgba(0,212,255,${p.alpha})`
            : `rgba(168,85,247,${p.alpha})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = W;
          if (p.x > W) p.x = 0;
          if (p.y < 0) p.y = H;
          if (p.y > H) p.y = 0;
        });

        animId = requestAnimationFrame(draw);
      }

      resize();
      createParticles();
      draw();

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          cancelAnimationFrame(animId);
          resize();
          createParticles();
          draw();
        }, 200);
      });

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(animId);
        else draw();
      });
    }

    /* ============================================================
       4. SCROLL REVEAL
       ============================================================ */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealEls.length) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('visible'));
    }
    document.querySelectorAll('.hover-group').forEach(group => {
      const items = group.querySelectorAll('.hover-item');

      items.forEach(item => {
        item.addEventListener('mouseenter', () => {
          group.classList.add('is-hovering');
          item.classList.add('is-focused');
        });
        item.addEventListener('mouseleave', () => {
          group.classList.remove('is-hovering');
          item.classList.remove('is-focused');
        });
      });

      group.addEventListener('mouseleave', () => {
        group.classList.remove('is-hovering');
        items.forEach(i => i.classList.remove('is-focused'));
      });
    });

    /* ============================================================
       6. COLLEGE BUILDING PARALLAX
       ============================================================ */
    const buildingWrap = document.querySelector('.college-building-wrap');
    const buildingImg  = document.querySelector('.college-building-img');

    if (buildingWrap && buildingImg) {
      /* Only on desktop — skip on mobile for performance */
      const isMobile = () => window.innerWidth < 768;

      function parallaxBuilding() {
        if (isMobile()) {
          buildingImg.style.transform = '';
          return;
        }

        const rect   = buildingWrap.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewH  = window.innerHeight;

        /* Progress: -1 (above viewport) to +1 (below viewport) */
        const progress = (center - viewH / 2) / (viewH / 2);
        const shift    = progress * 20; /* max 20px shift */

        buildingImg.style.transform = `scale(1.06) translateY(${shift}px)`;
      }

      window.addEventListener('scroll', parallaxBuilding, { passive: true });
      window.addEventListener('resize', parallaxBuilding, { passive: true });
      parallaxBuilding();
    }

    /* ============================================================
       7. OBJECTIVES CARD — stagger animation delay
       ============================================================ */
    const objCards = document.querySelectorAll('.objective-card');
    objCards.forEach((card, i) => {
      const col = i % 3;
      card.style.transitionDelay = `${col * 0.07}s`;
    });

    /* ============================================================
       8. DEPARTMENT HIGHLIGHT CARDS — stagger
       ============================================================ */
    const deptCards = document.querySelectorAll('.dept-highlight-card');
    deptCards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.05}s`;
    });

    /* ============================================================
       9. SCROLL TO TOP
       ============================================================ */
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });

      scrollTopBtn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ============================================================
       10. ACTIVE NAV LINK
       ============================================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) link.classList.add('active');
      else link.classList.remove('active');
    });

    /* ============================================================
       11. PAGE TRANSITIONS
       ============================================================ */
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    /* Fade in on load */
    overlay.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('active');
      });
    });

    /* Fade out on navigation */
    document.querySelectorAll('a[href]').forEach(link => {
      const href   = link.getAttribute('href');
      const target = link.getAttribute('target');
      /* Skip: anchors, external links, mailto, tel, and links that open in new tab */
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          target === '_blank') return;

      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 380);
      });
    });

    /* ============================================================
       12. MISSION / VISION CARD — tilt on mouse move
       ============================================================ */
    const mvCards = document.querySelectorAll('.mv-card');
    mvCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const cx     = rect.width  / 2;
        const cy     = rect.height / 2;
        const tiltX  = ((y - cy) / cy) * 4;  /* max 4deg */
        const tiltY  = ((cx - x) / cx) * 4;

        card.style.transform =
          `translateY(-6px) perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

  }); // end ready()

})();
