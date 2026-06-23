/* ============================================================
   CESA WEBSITE — home.js
   Global systems: cursor, navbar, particles, scroll reveal,
   hover focus system, scroll-to-top
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
    let isVisible = false;

    /* Update dot instantly */
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top  = mouseY + 'px';
      }

      if (!isVisible) {
        isVisible = true;
        if (cursorDot)  cursorDot.style.opacity  = '1';
        if (cursorRing) cursorRing.style.opacity = '1';
      }
    });

    /* Ring follows with lerp */
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.11;
      ringY += (mouseY - ringY) * 0.11;
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    })();

    /* Hover state on interactive elements */
    const interactiveSelectors =
      'a, button, .highlight-card, .team-pill, .contact-icon-item, ' +
      '.btn, .nav-link, .footer-social-link, .footer-link, #scroll-top';

    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () =>
        document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () =>
        document.body.classList.remove('cursor-hover'));
    });

    /* Click flash */
    document.addEventListener('mousedown', () =>
      document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () =>
      document.body.classList.remove('cursor-click'));

    /* Hide cursor when leaving window */
    document.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.style.opacity  = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.style.opacity  = '1';
      if (cursorRing) cursorRing.style.opacity = '1';
    });

    /* ============================================================
       2. NAVBAR — scroll behaviour + hamburger
       ============================================================ */
    const navbar      = document.getElementById('navbar');
    const hamburger   = document.getElementById('hamburger');
    const mobileNav   = document.getElementById('navbar-mobile');
    const mobileClose = document.getElementById('mobile-close');

    /* Scroll → add .scrolled class */
    function handleNavScroll() {
      if (!navbar) return;
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* Hamburger open */
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow =
          mobileNav.classList.contains('open') ? 'hidden' : '';
      });
    }

    /* Mobile close button */
    if (mobileClose && mobileNav) {
      mobileClose.addEventListener('click', () => {
        hamburger && hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    /* Close mobile nav on link click */
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
       3. HERO PARTICLES
       ============================================================ */
    const heroCanvas = document.getElementById('hero-particles');
    if (heroCanvas) {
      const ctx = heroCanvas.getContext('2d');
      let W, H, particles, animId;

      function resizeCanvas() {
        W = heroCanvas.width  = window.innerWidth;
        H = heroCanvas.height = window.innerHeight;
      }

      function createParticles() {
        const count = Math.min(90, Math.floor((W * H) / 12000));
        particles = [];
        for (let i = 0; i < count; i++) {
          particles.push({
            x:     Math.random() * W,
            y:     Math.random() * H,
            vx:    (Math.random() - 0.5) * 0.4,
            vy:    (Math.random() - 0.5) * 0.4,
            r:     Math.random() * 1.6 + 0.3,
            alpha: Math.random() * 0.55 + 0.15,
            hue:   Math.random() > 0.55 ? 'blue' : 'purple',
          });
        }
      }

      /* Mouse repulsion */
      let mx = -9999, my = -9999;
      document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

      function drawFrame() {
        ctx.clearRect(0, 0, W, H);

        /* Connections */
        const maxDist = 120;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxDist) {
              const a = (1 - dist / maxDist) * 0.15;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0,212,255,${a})`;
              ctx.lineWidth   = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }

        /* Particles */
        particles.forEach(p => {
          /* Mouse repulsion */
          const dx   = p.x - mx;
          const dy   = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100 * 0.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }

          /* Speed cap */
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 1.2) {
            p.vx = (p.vx / speed) * 1.2;
            p.vy = (p.vy / speed) * 1.2;
          }

          /* Damping */
          p.vx *= 0.995;
          p.vy *= 0.995;

          p.x += p.vx;
          p.y += p.vy;

          /* Wrap edges */
          if (p.x < -10) p.x = W + 10;
          if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10;
          if (p.y > H + 10) p.y = -10;

          /* Draw dot */
          const color = p.hue === 'blue'
            ? `rgba(0,212,255,${p.alpha})`
            : `rgba(168,85,247,${p.alpha})`;

          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          /* Glow halo */
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          grad.addColorStop(0, p.hue === 'blue'
            ? `rgba(0,212,255,${p.alpha * 0.35})`
            : `rgba(168,85,247,${p.alpha * 0.35})`);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.beginPath();
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fill();
        });

        animId = requestAnimationFrame(drawFrame);
      }

      /* Init */
      resizeCanvas();
      createParticles();
      drawFrame();

      /* Resize handler */
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          cancelAnimationFrame(animId);
          resizeCanvas();
          createParticles();
          drawFrame();
        }, 200);
      });

      /* Pause when tab hidden */
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          cancelAnimationFrame(animId);
        } else {
          drawFrame();
        }
      });
    }

    /* ============================================================
       4. SCROLL REVEAL (IntersectionObserver)
       ============================================================ */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && revealEls.length) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      revealEls.forEach(el => revealObserver.observe(el));
    } else {
      /* Fallback: show all immediately */
      revealEls.forEach(el => el.classList.add('visible'));
    }
    const hoverGroups = document.querySelectorAll('.hover-group');

    hoverGroups.forEach(group => {
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

      /* Reset on group leave */
      group.addEventListener('mouseleave', () => {
        group.classList.remove('is-hovering');
        items.forEach(i => i.classList.remove('is-focused'));
      });
    });

    /* ============================================================
       6. SCROLL TO TOP
       ============================================================ */
    const scrollTopBtn = document.getElementById('scroll-top');

    if (scrollTopBtn) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }, { passive: true });

      scrollTopBtn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ============================================================
       7. HERO SCROLL INDICATOR — hide on scroll
       ============================================================ */
    const heroScroll = document.getElementById('hero-scroll');
    if (heroScroll) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
          heroScroll.style.opacity = '0';
          heroScroll.style.transform = 'translateX(-50%) translateY(10px)';
        } else {
          heroScroll.style.opacity = '';
          heroScroll.style.transform = '';
        }
      }, { passive: true });
    }

    /* ============================================================
       8. ACTIVE NAV LINK
       ============================================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    /* ============================================================
       9. SMOOTH SECTION TRANSITIONS
       ============================================================ */
    /* Stagger reveal for team pills */
    const pills = document.querySelectorAll('.team-pill');
    pills.forEach((pill, i) => {
      pill.style.transitionDelay = `${i * 0.06}s`;
    });

    /* ============================================================
       10. PAGE TRANSITION (outgoing links)
       ============================================================ */
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    document.querySelectorAll('a[href]').forEach(link => {
      const href   = link.getAttribute('href');
      const target = link.getAttribute('target');
      /* Only internal page links — skip external, anchors, mailto, tel, new-tab links */
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          target === '_blank') return;

      link.addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(() => {
          window.location.href = href;
        }, 380);
      });
    });

    /* Fade in on page load */
    overlay.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        overlay.classList.remove('active');
      });
    });

  }); // end ready()

})();
