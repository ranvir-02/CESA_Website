/* ============================================================
   CESA WEBSITE — contact.js
   Systems: cursor, navbar, hero particles, scroll reveal,
   hover focus system, form validation, input glow,
   submit handler (EmailJS), scroll-to-top,
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
      'a, button, .contact-info-card, .contact-quick-btn, ' +
      '.form-input, .form-submit-btn, .nav-link, ' +
      '.footer-link, .footer-social-link, #scroll-top';

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
    const heroCanvas = document.getElementById('contact-hero-canvas');
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
       6. FORM — INPUT FOCUS GLOW (enhanced)
       ============================================================ */
    document.querySelectorAll('.form-input').forEach(input => {
      input.addEventListener('focus', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.add('focused');
      });

      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (group) group.classList.remove('focused');
        /* Validate on blur */
        validateField(input);
      });

      /* Live clear error on type */
      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) {
          if (input.value.trim() !== '') {
            clearFieldError(input);
          }
        }
      });
    });

    /* ============================================================
       7. FORM VALIDATION
       ============================================================ */
    const form = document.getElementById('contact-form');

    /* Validate a single field */
    function validateField(input) {
      const name  = input.name;
      const value = input.value.trim();
      let   error = '';

      if (name === 'name') {
        if (value === '') {
          error = 'Please enter your full name.';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters.';
        }
      }

      if (name === 'email') {
        if (value === '') {
          error = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address.';
        }
      }

      if (name === 'subject') {
        if (value === '') {
          error = 'Please enter a subject.';
        } else if (value.length < 3) {
          error = 'Subject must be at least 3 characters.';
        }
      }

      if (name === 'message') {
        if (value === '') {
          error = 'Please write your message.';
        } else if (value.length < 10) {
          error = 'Message must be at least 10 characters.';
        }
      }

      if (error) {
        setFieldError(input, error);
        return false;
      } else {
        setFieldSuccess(input);
        return true;
      }
    }

    function setFieldError(input, message) {
      const group = input.closest('.form-group');
      const errEl = group && group.querySelector('.form-error');
      if (group) {
        group.classList.add('has-error');
        group.classList.remove('has-success');
      }
      if (errEl) errEl.textContent = message;
    }

    function setFieldSuccess(input) {
      const group = input.closest('.form-group');
      const errEl = group && group.querySelector('.form-error');
      if (group) {
        group.classList.remove('has-error');
        group.classList.add('has-success');
      }
      if (errEl) errEl.textContent = '';
    }

    function clearFieldError(input) {
      const group = input.closest('.form-group');
      const errEl = group && group.querySelector('.form-error');
      if (group) {
        group.classList.remove('has-error');
      }
      if (errEl) errEl.textContent = '';
    }

    /* Validate all fields */
    function validateForm() {
      const inputs = form.querySelectorAll('.form-input[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!validateField(input)) valid = false;
      });
      return valid;
    }

    /* ============================================================
       8. FORM SUBMIT HANDLER
       ============================================================ */
    const submitBtn      = document.getElementById('form-submit');
    const submitText     = submitBtn && submitBtn.querySelector('.form-submit-text');
    const submitLoading  = submitBtn && submitBtn.querySelector('.form-submit-loading');
    const feedbackEl     = document.getElementById('form-feedback');
    const feedbackInner  = document.getElementById('form-feedback-inner');
    const feedbackIcon   = document.getElementById('form-feedback-icon');
    const feedbackMsg    = document.getElementById('form-feedback-msg');

    function showFeedback(type, message) {
      if (!feedbackEl || !feedbackInner) return;

      feedbackEl.style.display = 'block';
      feedbackInner.className  = 'form-feedback-inner ' + type;

      if (feedbackIcon) {
        feedbackIcon.className = type === 'success'
          ? 'fa-solid fa-circle-check'
          : 'fa-solid fa-circle-exclamation';
      }

      if (feedbackMsg) feedbackMsg.textContent = message;

      /* Auto-hide success after 6s */
      if (type === 'success') {
        setTimeout(() => {
          feedbackEl.style.display = 'none';
        }, 6000);
      }
    }

    function setSubmitLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      if (submitText)    submitText.style.display    = loading ? 'none'  : 'flex';
      if (submitLoading) submitLoading.style.display = loading ? 'flex'  : 'none';
    }

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* Hide any previous feedback */
        if (feedbackEl) feedbackEl.style.display = 'none';

        /* Validate */
        if (!validateForm()) return;

        /* Get values */
        const name    = form.querySelector('#input-name').value.trim();
        const email   = form.querySelector('#input-email').value.trim();
        const subject = form.querySelector('#input-subject').value.trim();
        const message = form.querySelector('#input-message').value.trim();

        /* Show loading state */
        setSubmitLoading(true);

        /* ── EmailJS Integration ── */

        /* IMPORTANT: Replace these three values with your own from emailjs.com */
        var EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   /* Account → API Keys */
        var EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   /* Email Services */
        var EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  /* Email Templates */

        /* Check if EmailJS is loaded */
        if (typeof emailjs === 'undefined') {
          setSubmitLoading(false);
          showFeedback('error',
            'Email service not loaded. Please refresh the page and try again.');
          return;
        }

        /* Check if keys are configured */
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY' ||
            EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
            EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID') {
          setSubmitLoading(false);
          showFeedback('error',
            'EmailJS is not configured yet. Please update the keys in contact.js.');
          return;
        }

        /* Initialise EmailJS with your public key */
        emailjs.init(EMAILJS_PUBLIC_KEY);

        /* Send the email */
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
          from_name:  name,
          from_email: email,
          reply_to:   email,
          subject:    subject,
          message:    message,
          to_name:    'CESA Team'
        })
        .then(function () {
          /* SUCCESS */
          setSubmitLoading(false);
          showFeedback(
            'success',
            'Your message was sent successfully! We will get back to you soon.'
          );

          /* Reset form */
          form.reset();
          form.querySelectorAll('.form-group').forEach(function (g) {
            g.classList.remove('has-error', 'has-success', 'focused');
          });
          form.querySelectorAll('.form-error').forEach(function (e) {
            e.textContent = '';
          });
        })
        .catch(function (error) {
          /* FAILURE */
          setSubmitLoading(false);
          console.error('EmailJS error:', error);
          showFeedback(
            'error',
            'Failed to send message. Please try again or email us directly at team.cesa2026@gmail.com'
          );
        });

      });
    }

    /* ============================================================
       9. CONTACT INFO CARD — tilt on hover
       ============================================================ */
    document.querySelectorAll('.contact-info-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect  = card.getBoundingClientRect();
        const x     = e.clientX - rect.left;
        const y     = e.clientY - rect.top;
        const cx    = rect.width  / 2;
        const cy    = rect.height / 2;
        const tiltX = ((y - cy) / cy) * 4;
        const tiltY = ((cx - x) / cx) * 4;

        card.style.transform =
          `translateY(-6px) perspective(700px) ` +
          `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

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
       13. TEXTAREA — auto resize
       ============================================================ */
    const textarea = document.querySelector('.form-textarea');
    if (textarea) {
      textarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 300) + 'px';
      });
    }

  }); // end ready()

})();
