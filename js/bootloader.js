/* ============================================================
   CESA WEBSITE — bootloader.js
   Sequence: Closed Doors → CESA Text → Doors Open → Reveal Screen
   Total duration: 3.0 – 3.5 seconds
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM References ───────────────────────────────────────── */
  const bootloader     = document.getElementById('bootloader');
  const doorLeft       = document.getElementById('door-left');
  const doorRight      = document.getElementById('door-right');
  const cesaText       = document.getElementById('boot-cesa-text');
  const revealScreen   = document.getElementById('reveal-screen');
  const revealCard     = document.getElementById('reveal-card');
  const revealParticles= document.getElementById('reveal-particles');

  /* ── Timing Configuration (ms) ───────────────────────────── */
  const T = {
    doorHold:       300,   // Closed doors visible before text appears
    textFadeIn:     500,   // CESA text fade-in duration (CSS handles this)
    textVisible:    850,   // How long text stays fully visible
    textFadeOut:    350,   // CESA text fade-out duration
    doorsOpen:      900,   // Door slide animation duration (CSS)
    revealDelay:    200,   // Gap between doors fully open and reveal fade-in
    cardDelay:      300,   // Card entrance after reveal bg appears
    enterDelay:     600,   // "Scroll to Enter" appearance after card
  };

  /* ── Sequence Timeline ────────────────────────────────────── */
  /*
     0ms    → Doors closed (initial state)
     300ms  → Show CESA glowing text
     1650ms → Hide CESA text  (300 + 500 + 850)
     2000ms → Open doors      (300 + 500 + 850 + 350)
     2900ms → Show reveal     (2000 + 900)
     3100ms → Show card       (2900 + 200)
     3400ms → Scroll To Enter (3100 + 300)
     Total  ≈ 3.1 – 3.5 seconds
  */

  let sequenceDone = false;

  function runSequence() {

    /* Step 1 — Doors are already closed (CSS default).
       Wait doorHold ms then show CESA text. */
    setTimeout(() => {
      showCesaText();
    }, T.doorHold);

    /* Step 2 — Hide CESA text */
    const hideAt = T.doorHold + T.textFadeIn + T.textVisible;
    setTimeout(() => {
      hideCesaText();
    }, hideAt);

    /* Step 3 — Open doors */
    const openAt = hideAt + T.textFadeOut;
    setTimeout(() => {
      openDoors();
    }, openAt);

    /* Step 4 — Show reveal screen */
    const revealAt = openAt + T.doorsOpen + T.revealDelay;
    setTimeout(() => {
      showReveal();
    }, revealAt);

    /* Step 5 — Animate card in */
    const cardAt = revealAt + T.cardDelay;
    setTimeout(() => {
      revealCard.classList.add('show');
    }, cardAt);

    /* Step 6 — Hide bootloader entirely */
    setTimeout(() => {
      bootloader.classList.add('done');
      sequenceDone = true;
    }, revealAt + 500);
  }

  /* ── Step Functions ───────────────────────────────────────── */

  function showCesaText() {
    cesaText.classList.remove('hide');
    cesaText.classList.add('show');
  }

  function hideCesaText() {
    cesaText.classList.remove('show');
    cesaText.classList.add('hide');
  }

  function openDoors() {
    doorLeft.classList.add('open');
    doorRight.classList.add('open');
  }

  function showReveal() {
    revealScreen.classList.add('visible');
    initRevealParticles();
  }

  /* ── Reveal Particles ─────────────────────────────────────── */

  function initRevealParticles() {
    const canvas = revealParticles;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;
    let animFrame;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createParticles() {
      const count = Math.min(70, Math.floor((W * H) / 14000));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x:   Math.random() * W,
          y:   Math.random() * H,
          vx:  (Math.random() - 0.5) * 0.35,
          vy:  (Math.random() - 0.5) * 0.35,
          r:   Math.random() * 1.8 + 0.4,
          hue: Math.random() > 0.5 ? 'blue' : 'purple',
          alpha: Math.random() * 0.5 + 0.2,
        });
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      /* Draw connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 110;

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      /* Draw dots */
      particles.forEach(p => {
        ctx.beginPath();
        const color = p.hue === 'blue'
          ? `rgba(0, 212, 255, ${p.alpha})`
          : `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fillStyle = color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        /* Subtle glow */
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        grad.addColorStop(0, p.hue === 'blue'
          ? `rgba(0,212,255,${p.alpha * 0.4})`
          : `rgba(168,85,247,${p.alpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        /* Move */
        p.x += p.vx;
        p.y += p.vy;

        /* Wrap */
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      });

      animFrame = requestAnimationFrame(drawParticles);
    }

    resize();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animFrame);
      resize();
      createParticles();
      drawParticles();
    });
  }

  /* ── Enter Handlers (Scroll / Click / Key) ────────────────── */

  function enterSite() {
    if (!sequenceDone) return;

    /* Prevent double-fire */
    enterSite = () => {};

    /* Exit animation on reveal screen */
    revealScreen.classList.add('exit');

    /* Navigate after exit animation */
    setTimeout(() => {
      window.location.href = 'home.html';
    }, 500);
  }

  /* Scroll */
  window.addEventListener('wheel', () => enterSite(), { passive: true });

  /* Touch swipe up */
  let touchStartY = 0;
  window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', e => {
    const dy = touchStartY - e.changedTouches[0].clientY;
    if (dy > 30) enterSite();
  }, { passive: true });

  /* Click anywhere on reveal screen */
  revealScreen.addEventListener('click', () => enterSite());

  /* Keyboard: Enter / Space / ArrowDown */
  window.addEventListener('keydown', e => {
    if (['Enter', ' ', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      enterSite();
    }
  });

  /* ── Preload door images, then start ─────────────────────── */

  function preloadImages(srcs, callback) {
    let loaded = 0;
    if (srcs.length === 0) { callback(); return; }

    srcs.forEach(src => {
      const img = new Image();
      img.onload  = () => { loaded++; if (loaded === srcs.length) callback(); };
      img.onerror = () => { loaded++; if (loaded === srcs.length) callback(); };
      img.src = src;
    });
  }

  /* Start sequence once DOM is ready */
  document.addEventListener('DOMContentLoaded', () => {
    preloadImages(
      ['images/left-door.png', 'images/right-door.png', 'images/cesa-logo.png'],
      () => {
        /* Small frame delay to ensure first paint is visible */
        requestAnimationFrame(() => {
          setTimeout(runSequence, 80);
        });
      }
    );
  });

  /* ── Fallback: if page already loaded ───────────────────── */
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    preloadImages(
      ['images/left-door.png', 'images/right-door.png', 'images/cesa-logo.png'],
      () => {
        requestAnimationFrame(() => {
          setTimeout(runSequence, 80);
        });
      }
    );
  }

})();
