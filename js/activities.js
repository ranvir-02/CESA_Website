/* ============================================================
   CESA WEBSITE — activities.js
   Systems: cursor, navbar, hero particles, tab switching,
   scroll reveal, hover focus system, scroll-to-top,
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

    const interactives =
      'a, button, .act-card, .act-tab, .comp-featured-item, ' +
      '.btn, .tag, .nav-link, .footer-social-link, .footer-link, #scroll-top';

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
       3. HERO PARTICLES
       ============================================================ */
    const heroCanvas = document.getElementById('activities-hero-canvas');
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
       4. TAB SWITCHING SYSTEM
       ============================================================ */
    const tabs     = document.querySelectorAll('.act-tab');
    const sections = document.querySelectorAll('.activities-section');
    const tabBar   = document.getElementById('activities-tab-bar');

    /* Check URL hash for deep-linking */
    function getInitialTab() {
      const hash = window.location.hash.replace('#', '');
      const validTargets = ['technical', 'non-technical', 'competitions', 'leadership'];
      return validTargets.includes(hash) ? hash : 'technical';
    }

    function activateTab(targetId) {
      /* Update tabs */
      tabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.target === targetId);
      });

      /* Update sections */
      sections.forEach(section => {
        if (section.id === targetId) {
          section.classList.add('active');

          /* Re-trigger reveal animations for newly shown section */
          const revealEls = section.querySelectorAll('.reveal:not(.visible)');
          revealEls.forEach(el => {
            /* Small delay so animation triggers after display:block */
            setTimeout(() => {
              if (revealObserver) revealObserver.observe(el);
            }, 50);
          });

        } else {
          section.classList.remove('active');
        }
      });

      /* Update URL hash without scrolling */
      history.replaceState(null, '', '#' + targetId);

      /* Scroll to tab bar if below it */
      const tabBarRect = tabBar.getBoundingClientRect();
      if (tabBarRect.top < 0) {
        const scrollTarget = window.scrollY + tabBarRect.top - 70;
        window.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' });
      }
    }

    /* Tab click handler */
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        activateTab(tab.dataset.target);
      });
    });

    /* Tab bar elevation on scroll */
    if (tabBar) {
      window.addEventListener('scroll', () => {
        tabBar.classList.toggle('elevated', window.scrollY > 100);
      }, { passive: true });
    }

    /* Keyboard navigation for tabs */
    tabs.forEach((tab, index) => {
      tab.addEventListener('keydown', e => {
        let next = -1;
        if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (e.key === 'ArrowLeft')  next = (index - 1 + tabs.length) % tabs.length;
        if (next >= 0) {
          tabs[next].focus();
          activateTab(tabs[next].dataset.target);
        }
      });
    });

    /* Initialise correct tab */
    activateTab(getInitialTab());

    /* ============================================================
       5. SCROLL REVEAL (IntersectionObserver)
       ============================================================ */
    let revealObserver;

    const allRevealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
      revealObserver = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      /* Only observe elements in the active section */
      allRevealEls.forEach(el => {
        const section = el.closest('.activities-section');
        if (!section || section.classList.contains('active')) {
          revealObserver.observe(el);
        }
      });

    } else {
      allRevealEls.forEach(el => el.classList.add('visible'));
    }
    function reInitHoverGroups() {
      document.querySelectorAll('.hover-group').forEach(group => {
        /* Remove any stale state */
        group.classList.remove('is-hovering');
        group.querySelectorAll('.hover-item').forEach(i =>
          i.classList.remove('is-focused'));
      });

      document.querySelectorAll('.hover-group').forEach(group => {
        const items = group.querySelectorAll('.hover-item');

        items.forEach(item => {
          /* Clone to remove old listeners */
          const newItem = item.cloneNode(true);
          item.parentNode.replaceChild(newItem, item);
        });
      });

      /* Re-attach after clone */
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
    }

    /* ============================================================
       7. ACTIVITY CARD — subtle tilt on mouse move
       ============================================================ */
    function attachCardTilt() {
      document.querySelectorAll('.act-card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect  = card.getBoundingClientRect();
          const x     = e.clientX - rect.left;
          const y     = e.clientY - rect.top;
          const cx    = rect.width  / 2;
          const cy    = rect.height / 2;
          const tiltX = ((y - cy) / cy) * 3;
          const tiltY = ((cx - x) / cx) * 3;

          card.style.transform =
            `translateY(-6px) perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }

    attachCardTilt();

    /* ============================================================
       8. SCROLL TO TOP
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
       9. ACTIVE NAV LINK
       ============================================================ */
    const currentPage = window.location.pathname.split('/').pop() || 'home.html';
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage) link.classList.add('active');
      else link.classList.remove('active');
    });

    /* ============================================================
       10. PAGE TRANSITIONS
       ============================================================ */
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    overlay.classList.add('active');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.remove('active'));
    });

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
       11. SWIPE BETWEEN TABS (mobile touch)
       ============================================================ */
    const tabOrder = ['technical', 'non-technical', 'competitions', 'leadership'];
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = Math.abs(touchStartY - e.changedTouches[0].clientY);

      /* Only horizontal swipes (dx > 60, dy < 40) */
      if (Math.abs(dx) < 60 || dy > 40) return;

      const activeTab = document.querySelector('.act-tab.active');
      if (!activeTab) return;

      const currentIndex = tabOrder.indexOf(activeTab.dataset.target);

      if (dx > 0 && currentIndex < tabOrder.length - 1) {
        /* Swipe left → next tab */
        activateTab(tabOrder[currentIndex + 1]);
        attachCardTilt();
      } else if (dx < 0 && currentIndex > 0) {
        /* Swipe right → previous tab */
        activateTab(tabOrder[currentIndex - 1]);
        attachCardTilt();
      }
    }, { passive: true });

  }); // end ready()

})();
