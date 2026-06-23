/* ============================================================
   CESA WEBSITE — team.js
   Systems: cursor, navbar, hero particles, scroll reveal,
   hover focus system, member card tilt, faculty card tilt,
   section stagger delays, scroll-to-top, page transitions
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

    /* Hover state on interactive elements */
    function attachCursorHover() {
      const sel =
        'a, button, .member-card, .faculty-card, .president-card, ' +
        '.member-action-btn, .faculty-linkedin, .president-linkedin, ' +
        '.president-contact-btn, .nav-link, .footer-link, ' +
        '.footer-social-link, #scroll-top';

      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener('mouseenter', () =>
          document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () =>
          document.body.classList.remove('cursor-hover'));
      });
    }
    attachCursorHover();

    document.addEventListener('mousedown', () =>
      document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup', () =>
      document.body.classList.remove('cursor-click'));

    document.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.style.opacity = '0';
      if (cursorRing) cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.style.opacity = '1';
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
       3. HERO PARTICLES
       ============================================================ */
    const heroCanvas = document.getElementById('team-hero-canvas');
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
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );
      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('visible'));
    }
    function initHoverGroups() {
      document.querySelectorAll('.hover-group').forEach(group => {
        group.classList.remove('is-hovering');
        const items = group.querySelectorAll('.hover-item');
        items.forEach(item => item.classList.remove('is-focused'));

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
    }

    /* ============================================================
       6. MEMBER CARD — 3D TILT ON MOUSE MOVE
       ============================================================ */
    function attachCardTilt(selector, maxTilt) {
      document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect  = card.getBoundingClientRect();
          const x     = e.clientX - rect.left;
          const y     = e.clientY - rect.top;
          const cx    = rect.width  / 2;
          const cy    = rect.height / 2;
          const tiltX = ((y - cy) / cy) * maxTilt;
          const tiltY = ((cx - x) / cx) * maxTilt;

          card.style.transform =
            `translateY(-6px) perspective(800px) ` +
            `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    /* Subtle tilt for member cards */
    attachCardTilt('.member-card', 4);

    /* Slightly more tilt for faculty cards */
    attachCardTilt('.faculty-card', 5);

    /* ============================================================
       7. PRESIDENT CARD — MOUSE PARALLAX GLOW
       ============================================================ */
    const presidentCard = document.querySelector('.president-card');
    if (presidentCard) {
      presidentCard.addEventListener('mousemove', e => {
        const rect  = presidentCard.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const tiltX = ((y - cy) / cy) * 3;
        const tiltY = ((cx - x) / cx) * 3;

        presidentCard.style.transform =
          `translateY(-6px) perspective(1000px) ` +
          `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        /* Shift glow position with mouse */
        const glow = presidentCard.querySelector('.president-card-glow');
        if (glow) {
          const pctX = (x / rect.width  * 100).toFixed(1);
          const pctY = (y / rect.height * 100).toFixed(1);
          glow.style.background =
            `radial-gradient(ellipse at ${pctX}% ${pctY}%, ` +
            `rgba(255,215,0,0.08) 0%, transparent 60%)`;
        }
      });

      presidentCard.addEventListener('mouseleave', () => {
        presidentCard.style.transform = '';
        const glow = presidentCard.querySelector('.president-card-glow');
        if (glow) {
          glow.style.background =
            'radial-gradient(ellipse at 20% 50%, rgba(255,215,0,0.06) 0%, transparent 60%)';
        }
      });
    }

    /* ============================================================
       8. STAGGER DELAYS PER SECTION
       ============================================================ */

    /* Faculty cards */
    document.querySelectorAll('.faculty-card').forEach((card, i) => {
      card.style.transitionDelay = `${i * 0.08}s`;
    });

    /* Member cards — stagger by column position within each grid */
    document.querySelectorAll('.team-cards-grid').forEach(grid => {
      const cards = grid.querySelectorAll('.member-card');
      cards.forEach((card, i) => {
        /* Get number of columns from computed style */
        const cols = Math.round(grid.offsetWidth /
          (cards[0] ? cards[0].offsetWidth + 32 : 1)) || 3;
        const col = i % cols;
        card.style.transitionDelay = `${col * 0.07}s`;
      });
    });

    /* ============================================================
       9. SECTION ICON ANIMATION — pulse on scroll enter
       ============================================================ */
    const sectionIcons = document.querySelectorAll('.team-section-icon');

    if ('IntersectionObserver' in window) {
      const iconObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.style.animation =
                'icon-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards';
              iconObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      sectionIcons.forEach(icon => iconObserver.observe(icon));
    }

    /* Inject keyframe if not present */
    if (!document.querySelector('#team-icon-keyframe')) {
      const style = document.createElement('style');
      style.id = 'team-icon-keyframe';
      style.textContent = `
        @keyframes icon-pop {
          0%   { transform: scale(0.7) rotate(-10deg); opacity: 0.5; }
          60%  { transform: scale(1.15) rotate(4deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    /* ============================================================
       10. SCROLL TO TOP
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
       11. ACTIVE NAV LINK
       ============================================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });

    /* ============================================================
       12. PAGE TRANSITIONS
       ============================================================ */
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    /* Fade in on load */
    overlay.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.remove('active'));
    });

    /* Fade out on outgoing navigation */
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
       13. PHOTO FALLBACK — ensure fallback shown when img fails
       ============================================================ */
    document.querySelectorAll('.member-photo, .president-photo').forEach(img => {
      if (img.complete && img.naturalWidth === 0) {
        img.style.display = 'none';
        const fallback = img.nextElementSibling;
        if (fallback) fallback.style.display = 'flex';
      }

      img.addEventListener('error', function () {
        this.style.display = 'none';
        const fallback = this.nextElementSibling;
        if (fallback) fallback.style.display = 'flex';
      });
    });

  }); // end ready()

})();
