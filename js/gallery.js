/* ============================================================
   CESA WEBSITE — gallery.js
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     EVENT DATA
     Update image paths and Google Drive URLs here.
  ============================================================ */
  var EVENTS = {
    techquest: {
      name:     'Tech Quest Arena',
      sub:      'CESA Technical Event',
      icon:     'fa-solid fa-chess-knight',
      accent:   'blue',
      driveUrl: '#',
      winner: [
        { src: 'images/gallery/techquest/winner-1.jpg',   alt: 'Tech Quest Arena — Winner 1' },
        { src: 'images/gallery/techquest/winner-2.jpg',   alt: 'Tech Quest Arena — Winner 2' }
      ],
      runnerup: [
        { src: 'images/gallery/techquest/runnerup-1.jpg', alt: 'Tech Quest Arena — Runner-Up 1' },
        { src: 'images/gallery/techquest/runnerup-2.jpg', alt: 'Tech Quest Arena — Runner-Up 2' }
      ],
      moments: [
        { src: 'images/gallery/techquest/moment-1.jpg', alt: 'Tech Quest Arena — Moment 1' },
        { src: 'images/gallery/techquest/moment-2.jpg', alt: 'Tech Quest Arena — Moment 2' },
        { src: 'images/gallery/techquest/moment-3.jpg', alt: 'Tech Quest Arena — Moment 3' },
        { src: 'images/gallery/techquest/moment-4.jpg', alt: 'Tech Quest Arena — Moment 4' },
        { src: 'images/gallery/techquest/moment-5.jpg', alt: 'Tech Quest Arena — Moment 5' },
        { src: 'images/gallery/techquest/moment-6.jpg', alt: 'Tech Quest Arena — Moment 6' }
      ]
    },
    debate: {
      name:     'Debate Competition',
      sub:      'CESA Non-Technical Event',
      icon:     'fa-solid fa-microphone-lines',
      accent:   'purple',
      driveUrl: '#',
      winner: [
        { src: 'images/gallery/debate/winner-1.jpg',   alt: 'Debate Competition — Winner 1' },
        { src: 'images/gallery/debate/winner-2.jpg',   alt: 'Debate Competition — Winner 2' }
      ],
      runnerup: [
        { src: 'images/gallery/debate/runnerup-1.jpg', alt: 'Debate Competition — Runner-Up 1' },
        { src: 'images/gallery/debate/runnerup-2.jpg', alt: 'Debate Competition — Runner-Up 2' }
      ],
      moments: [
        { src: 'images/gallery/debate/moment-1.jpg', alt: 'Debate Competition — Moment 1' },
        { src: 'images/gallery/debate/moment-2.jpg', alt: 'Debate Competition — Moment 2' },
        { src: 'images/gallery/debate/moment-3.jpg', alt: 'Debate Competition — Moment 3' },
        { src: 'images/gallery/debate/moment-4.jpg', alt: 'Debate Competition — Moment 4' },
        { src: 'images/gallery/debate/moment-5.jpg', alt: 'Debate Competition — Moment 5' },
        { src: 'images/gallery/debate/moment-6.jpg', alt: 'Debate Competition — Moment 6' }
      ]
    },
    antratech: {
      name:     'Antratech 2.0',
      sub:      'CESA Flagship Inter-College Fest',
      icon:     'fa-solid fa-rocket',
      accent:   'gold',
      driveUrl: '#',
      winner: [
        { src: 'images/gallery/antratech/winner-1.jpg',   alt: 'Antratech 2.0 — Winner 1' },
        { src: 'images/gallery/antratech/winner-2.jpg',   alt: 'Antratech 2.0 — Winner 2' }
      ],
      runnerup: [
        { src: 'images/gallery/antratech/runnerup-1.jpg', alt: 'Antratech 2.0 — Runner-Up 1' },
        { src: 'images/gallery/antratech/runnerup-2.jpg', alt: 'Antratech 2.0 — Runner-Up 2' }
      ],
      moments: [
        { src: 'images/gallery/antratech/moment-1.jpg', alt: 'Antratech 2.0 — Moment 1' },
        { src: 'images/gallery/antratech/moment-2.jpg', alt: 'Antratech 2.0 — Moment 2' },
        { src: 'images/gallery/antratech/moment-3.jpg', alt: 'Antratech 2.0 — Moment 3' },
        { src: 'images/gallery/antratech/moment-4.jpg', alt: 'Antratech 2.0 — Moment 4' },
        { src: 'images/gallery/antratech/moment-5.jpg', alt: 'Antratech 2.0 — Moment 5' },
        { src: 'images/gallery/antratech/moment-6.jpg', alt: 'Antratech 2.0 — Moment 6' }
      ]
    }
  };

  /* Lightbox state */
  var lbImages = [];
  var lbIndex  = 0;

  /* ============================================================
     INIT — wait for DOM
  ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {

    /* ── Element refs ── */
    var viewEvents = document.getElementById('view-events');
    var viewDetail = document.getElementById('view-detail');
    var backBtn    = document.getElementById('gdetail-back');

    var lbEl       = document.getElementById('glightbox');
    var lbImg      = document.getElementById('glightbox-img');
    var lbLoader   = document.getElementById('glightbox-loader');
    var lbCounter  = document.getElementById('glightbox-counter');
    var lbClose    = document.getElementById('glightbox-close');
    var lbPrev     = document.getElementById('glightbox-prev');
    var lbNext     = document.getElementById('glightbox-next');
    var lbDl       = document.getElementById('glightbox-dl');
    var lbBackdrop = document.getElementById('glightbox-backdrop');

    /* ============================================================
       CURSOR
    ============================================================ */
    var dot  = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
    });

    (function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
      requestAnimationFrame(loop);
    })();

    document.addEventListener('mousedown', function () { document.body.classList.add('cursor-click'); });
    document.addEventListener('mouseup',   function () { document.body.classList.remove('cursor-click'); });

    function addHover(el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    }

    function refreshHoverTargets() {
      document.querySelectorAll('a, button, .gallery-event-card, .gdetail-podium-card, .gdetail-moment-card').forEach(addHover);
    }
    refreshHoverTargets();

    /* ============================================================
       NAVBAR
    ============================================================ */
    var navbar    = document.getElementById('navbar');
    var hamburger = document.getElementById('hamburger');
    var mobileNav = document.getElementById('navbar-mobile');
    var mClose    = document.getElementById('mobile-close');

    window.addEventListener('scroll', function () {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
      });
    }
    if (mClose && mobileNav) {
      mClose.addEventListener('click', function () {
        if (hamburger) hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    /* ============================================================
       HERO PARTICLES
    ============================================================ */
    var hc = document.getElementById('gallery-hero-canvas');
    if (hc) {
      var hctx = hc.getContext('2d');
      var hW, hH, hPts, hAid;

      function hResize() {
        hW = hc.width  = hc.offsetWidth  || window.innerWidth;
        hH = hc.height = hc.offsetHeight || 400;
      }

      function hMkPts() {
        var n = Math.min(50, Math.floor((hW * hH) / 16000));
        hPts = [];
        for (var i = 0; i < n; i++) {
          hPts.push({
            x: Math.random()*hW, y: Math.random()*hH,
            vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3,
            r: Math.random()*1.4+0.3, a: Math.random()*0.4+0.1,
            blue: Math.random() > 0.5
          });
        }
      }

      function hDraw() {
        hctx.clearRect(0, 0, hW, hH);
        for (var i = 0; i < hPts.length; i++) {
          for (var j = i+1; j < hPts.length; j++) {
            var dx=hPts[i].x-hPts[j].x, dy=hPts[i].y-hPts[j].y, d=Math.sqrt(dx*dx+dy*dy);
            if (d < 100) {
              hctx.beginPath();
              hctx.strokeStyle = 'rgba(0,212,255,'+(1-d/100)*0.12+')';
              hctx.lineWidth = 0.5;
              hctx.moveTo(hPts[i].x, hPts[i].y);
              hctx.lineTo(hPts[j].x, hPts[j].y);
              hctx.stroke();
            }
          }
        }
        hPts.forEach(function (p) {
          hctx.beginPath();
          hctx.fillStyle = p.blue ? 'rgba(0,212,255,'+p.a+')' : 'rgba(168,85,247,'+p.a+')';
          hctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          hctx.fill();
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0) p.x = hW; if (p.x > hW) p.x = 0;
          if (p.y < 0) p.y = hH; if (p.y > hH) p.y = 0;
        });
        hAid = requestAnimationFrame(hDraw);
      }

      hResize(); hMkPts(); hDraw();
      var hrt;
      window.addEventListener('resize', function () {
        clearTimeout(hrt);
        hrt = setTimeout(function () { cancelAnimationFrame(hAid); hResize(); hMkPts(); hDraw(); }, 200);
      });
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) cancelAnimationFrame(hAid); else hDraw();
      });
    }

    /* ============================================================
       SCROLL REVEAL
    ============================================================ */
    function runReveal() {
      var els = document.querySelectorAll('.reveal:not(.visible)');
      if (!window.IntersectionObserver) {
        els.forEach(function (el) { el.classList.add('visible'); });
        return;
      }
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      els.forEach(function (el) { obs.observe(el); });
    }
    runReveal();

    /* ============================================================
       VIEW SWITCHING
    ============================================================ */
    function showEvents() {
      if (viewDetail) viewDetail.style.display = 'none';
      if (viewEvents) viewEvents.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showDetail(key) {
      var ev = EVENTS[key];
      if (!ev) return;

      /* Header */
      var iconEl = document.getElementById('gdetail-icon');
      var nameEl = document.getElementById('gdetail-name');
      var subEl  = document.getElementById('gdetail-sub');

      if (nameEl) nameEl.textContent = ev.name;
      if (subEl)  subEl.textContent  = ev.sub;

      if (iconEl) {
        iconEl.innerHTML = '<i class="' + ev.icon + '"></i>';
        if (ev.accent === 'purple') {
          iconEl.style.cssText = 'width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;background:rgba(168,85,247,0.12);border:1px solid rgba(168,85,247,0.3);color:#a855f7;';
        } else if (ev.accent === 'gold') {
          iconEl.style.cssText = 'width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;background:rgba(255,215,0,0.1);border:1px solid rgba(255,215,0,0.3);color:#ffd700;';
        } else {
          iconEl.style.cssText = 'width:50px;height:50px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:#00d4ff;';
        }
      }

      /* Grids */
      buildPodium('grid-winner',   ev.winner,   true);
      buildPodium('grid-runnerup', ev.runnerup, false);
      buildMoments('grid-moments', ev.moments);

      /* Download All */
      ['btn-download-all-top','btn-download-all-bottom'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.onclick = function () { dlAll(ev); };
      });

      /* Drive */
      ['btn-drive-top','btn-drive-bottom'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (!btn) return;
        btn.onclick = function () {
          if (ev.driveUrl && ev.driveUrl !== '#') {
            window.open(ev.driveUrl, '_blank', 'noopener');
          } else {
            alert('Google Drive link not configured yet.');
          }
        };
      });

      /* Show */
      if (viewEvents) viewEvents.style.display = 'none';
      if (viewDetail) viewDetail.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });

      refreshHoverTargets();
      runReveal();
    }

    /* Back button */
    if (backBtn) {
      backBtn.addEventListener('click', function () { showEvents(); });
    }

    /* ── EVENT CARD CLICKS — the main fix ── */
    var cards = document.querySelectorAll('.gallery-event-card');
    cards.forEach(function (card) {
      /* Click */
      card.addEventListener('click', function (e) {
        e.stopPropagation();
        var key = card.getAttribute('data-event');
        if (key) showDetail(key);
      });

      /* Keyboard */
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var key = card.getAttribute('data-event');
          if (key) showDetail(key);
        }
      });

      /* Hover focus handled by pure CSS .hover-group:hover .hover-item */
    });

    /* ============================================================
       BUILD GRIDS
    ============================================================ */
    function buildPodium(gridId, images, isWinner) {
      var grid = document.getElementById(gridId);
      if (!grid) return;
      grid.innerHTML = '';

      if (!images || images.length === 0) {
        grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-size:0.8rem;font-family:sans-serif;padding:1rem 0">No images yet.</p>';
        return;
      }

      images.forEach(function (img, idx) {
        var card = document.createElement('div');
        card.className = 'gdetail-podium-card glass hover-item ' + (isWinner ? 'is-winner' : 'is-runnerup');

        var labelHTML = isWinner
          ? '<i class="fa-solid fa-crown" style="color:#ffd700;margin-right:6px"></i><span>Winner</span>'
          : '<i class="fa-solid fa-medal" style="color:#c0c0c0;margin-right:6px"></i><span>Runner-Up</span>';

        card.innerHTML =
          '<div class="gimg-wrap">' +
            '<img src="' + img.src + '" alt="' + img.alt + '" loading="lazy" ' +
              'onerror="this.parentElement.style.background=\'#0d0d2e\'" />' +
            '<div class="gimg-overlay">' +
              '<button class="gimg-btn gimg-view" title="View"><i class="fa-solid fa-expand"></i></button>' +
              '<button class="gimg-btn gimg-dl"   title="Download"><i class="fa-solid fa-download"></i></button>' +
            '</div>' +
          '</div>' +
          '<div class="gdetail-podium-label">' + labelHTML + '</div>';

        /* Listeners */
        var pool = images; /* closure */
        card.querySelector('.gimg-view').addEventListener('click', function (e) {
          e.stopPropagation(); openLightbox(pool, idx);
        });
        card.querySelector('.gimg-dl').addEventListener('click', function (e) {
          e.stopPropagation(); dlSingle(img.src, img.alt);
        });
        card.querySelector('.gimg-wrap').addEventListener('click', function () {
          openLightbox(pool, idx);
        });

        /* Hover focus */
        card.addEventListener('mouseenter', function () {
          grid.classList.add('is-hovering');
          card.classList.add('is-focused');
        });
        card.addEventListener('mouseleave', function () {
          grid.classList.remove('is-hovering');
          card.classList.remove('is-focused');
        });

        grid.appendChild(card);
      });
    }

    function buildMoments(gridId, images) {
      var grid = document.getElementById(gridId);
      if (!grid) return;
      grid.innerHTML = '';

      if (!images || images.length === 0) {
        grid.innerHTML = '<p style="color:rgba(255,255,255,0.3);font-size:0.8rem;font-family:sans-serif;padding:1rem 0">No moments yet.</p>';
        return;
      }

      images.forEach(function (img, idx) {
        var card = document.createElement('div');
        card.className = 'gdetail-moment-card hover-item';

        var pool = images;
        card.innerHTML =
          '<div class="gimg-wrap">' +
            '<img src="' + img.src + '" alt="' + img.alt + '" loading="lazy" ' +
              'onerror="this.parentElement.style.background=\'#0d0d2e\'" />' +
            '<div class="gimg-overlay">' +
              '<button class="gimg-btn gimg-view" title="View"><i class="fa-solid fa-expand"></i></button>' +
              '<button class="gimg-btn gimg-dl"   title="Download"><i class="fa-solid fa-download"></i></button>' +
            '</div>' +
          '</div>';

        card.querySelector('.gimg-view').addEventListener('click', function (e) {
          e.stopPropagation(); openLightbox(pool, idx);
        });
        card.querySelector('.gimg-dl').addEventListener('click', function (e) {
          e.stopPropagation(); dlSingle(img.src, img.alt);
        });
        card.querySelector('.gimg-wrap').addEventListener('click', function () {
          openLightbox(pool, idx);
        });

        card.addEventListener('mouseenter', function () {
          grid.classList.add('is-hovering');
          card.classList.add('is-focused');
        });
        card.addEventListener('mouseleave', function () {
          grid.classList.remove('is-hovering');
          card.classList.remove('is-focused');
        });

        grid.appendChild(card);
      });
    }

    /* ============================================================
       LIGHTBOX
    ============================================================ */
    function openLightbox(images, idx) {
      lbImages = images;
      lbIndex  = idx;
      if (lbEl) { lbEl.style.display = 'flex'; }
      document.body.style.overflow = 'hidden';
      renderLb();
    }

    function closeLightbox() {
      if (lbEl) { lbEl.style.display = 'none'; }
      document.body.style.overflow = '';
      if (lbImg) lbImg.src = '';
    }

    function renderLb() {
      var item = lbImages[lbIndex];
      if (!item || !lbImg) return;
      if (lbLoader) lbLoader.style.display = 'flex';
      lbImg.style.opacity = '0';

      lbImg.onload = function () {
        if (lbLoader) lbLoader.style.display = 'none';
        lbImg.style.opacity = '1';
      };
      lbImg.onerror = function () {
        if (lbLoader) lbLoader.style.display = 'none';
        lbImg.style.opacity = '1';
      };

      lbImg.src = item.src;
      lbImg.alt = item.alt || '';

      if (lbCounter) lbCounter.textContent = (lbIndex + 1) + ' / ' + lbImages.length;
      if (lbPrev)    lbPrev.disabled  = lbIndex === 0;
      if (lbNext)    lbNext.disabled  = lbIndex === lbImages.length - 1;
      if (lbDl)      lbDl.onclick     = function () { dlSingle(item.src, item.alt); };
    }

    function lbPrevFn() { if (lbIndex > 0) { lbIndex--; renderLb(); } }
    function lbNextFn() { if (lbIndex < lbImages.length - 1) { lbIndex++; renderLb(); } }

    if (lbClose)    lbClose.addEventListener('click', closeLightbox);
    if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);
    if (lbPrev)     lbPrev.addEventListener('click', lbPrevFn);
    if (lbNext)     lbNext.addEventListener('click', lbNextFn);

    document.addEventListener('keydown', function (e) {
      if (!lbEl || lbEl.style.display === 'none') return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  lbPrevFn();
      if (e.key === 'ArrowRight') lbNextFn();
    });

    /* Touch swipe */
    var tStartX = 0;
    if (lbEl) {
      lbEl.addEventListener('touchstart', function (e) { tStartX = e.touches[0].clientX; }, { passive: true });
      lbEl.addEventListener('touchend', function (e) {
        var dx = tStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 40) { dx > 0 ? lbNextFn() : lbPrevFn(); }
      }, { passive: true });
    }

    /* ============================================================
       DOWNLOAD
       Works in all cases: file://, local server, and hosted.
    ============================================================ */
    function dlSingle(src, alt) {
      if (!src) return;

      var filename = src.split('/').pop() || 'cesa-photo.jpg';

      /* Method 1: Simple <a download> — works on local server + hosted */
      var a = document.createElement('a');
      a.href     = src;
      a.download = filename;
      a.target   = '_blank';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { a.remove(); }, 500);

      /* Method 2: fetch + blob fallback for cross-origin or if above fails */
      /* Uncomment below if images are hosted on a different server:
      fetch(src)
        .then(function (r) { if (!r.ok) throw new Error('fail'); return r.blob(); })
        .then(function (blob) {
          var url = URL.createObjectURL(blob);
          var a2  = document.createElement('a');
          a2.href = url;
          a2.download = filename;
          a2.style.display = 'none';
          document.body.appendChild(a2);
          a2.click();
          setTimeout(function () { URL.revokeObjectURL(url); a2.remove(); }, 1000);
        })
        .catch(function () { window.open(src, '_blank', 'noopener'); });
      */
    }

    function dlAll(ev) {
      var all = (ev.winner || []).concat(ev.runnerup || []).concat(ev.moments || []);
      /* Show confirmation for multiple downloads */
      if (all.length > 3) {
        var ok = confirm(
          'This will download ' + all.length + ' photos from ' + ev.name + '.\n\n' +
          'Your browser may ask permission to download multiple files.\n\n' +
          'Click OK to continue.'
        );
        if (!ok) return;
      }
      all.forEach(function (img, i) {
        setTimeout(function () { dlSingle(img.src, img.alt); }, i * 600);
      });
    }

    /* ============================================================
       SCROLL TO TOP
    ============================================================ */
    var stb = document.getElementById('scroll-top');
    if (stb) {
      window.addEventListener('scroll', function () {
        stb.classList.toggle('visible', window.scrollY > 400);
      }, { passive: true });
      stb.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ============================================================
       PAGE TRANSITIONS
       NOTE: Only for non-gallery-card links.
             Gallery event cards use stopPropagation.
    ============================================================ */
    var overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    document.body.appendChild(overlay);

    /* Fade in on load */
    overlay.classList.add('active');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { overlay.classList.remove('active'); });
    });

    document.querySelectorAll('a[href]').forEach(function (link) {
      var href   = link.getAttribute('href');
      var target = link.getAttribute('target');
      /* Skip: anchors, external links, mailto, tel, and links that open in new tab */
      if (!href || href === '#' || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          target === '_blank') return;
      link.addEventListener('click', function (e) {
        e.preventDefault();
        overlay.classList.add('active');
        setTimeout(function () { window.location.href = href; }, 380);
      });
    });

  }); /* end DOMContentLoaded */

})();
