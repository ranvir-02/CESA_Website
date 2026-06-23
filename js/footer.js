/* ============================================================
   CESA WEBSITE — footer.js
   Single source of truth for the footer.
   Injected into every page automatically.
   To update the footer — edit ONLY this file.
   ============================================================ */

(function () {

  var FOOTER_HTML = `
  <footer id="footer">
    <div class="container">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <img src="images/cesa-logo.png" alt="CESA Logo" />
            <span class="footer-logo-text">CESA</span>
          </div>
          <p class="footer-tagline">Learn &bull; Innovate &bull; Lead</p>
          <p style="font-size:0.8rem;color:rgba(255,255,255,0.3);margin-bottom:1rem;font-family:var(--font-body);line-height:1.5;">
            Computer Engineering Students Association<br />
            R. C. Patel College of Engineering and Polytechnic, Shirpur
          </p>
          <div class="footer-social">
            <a href="https://www.instagram.com/rcpcoep_cesa?igsh=eGJmZGFmaW9ucWl1"
               target="_blank" rel="noopener noreferrer"
               class="footer-social-link" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="https://linkedin.com/company/cesa-rcpet"
               target="_blank" rel="noopener noreferrer"
               class="footer-social-link" aria-label="LinkedIn">
              <i class="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="footer-col-title">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="home.html"       class="footer-link">Home</a></li>
            <li><a href="about.html"      class="footer-link">About</a></li>
            <li><a href="activities.html" class="footer-link">Activities</a></li>
            <li><a href="gallery.html"    class="footer-link">Gallery</a></li>
            <li><a href="team.html"       class="footer-link">Team</a></li>
            <li><a href="contact.html"    class="footer-link">Contact</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="footer-col-title">Contact</h4>
          <div class="footer-contact-item">
            <i class="fa-solid fa-location-dot"></i>
            <span>R. C. Patel COEP, Shirpur, Dist. Dhule, Maharashtra</span>
          </div>
          <div class="footer-contact-item">
            <i class="fa-solid fa-envelope"></i>
            <span>team.cesa2026@gmail.com</span>
          </div>
          <div class="footer-contact-item">
            <i class="fa-brands fa-instagram"></i>
            <span>@rcpcoep_cesa</span>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          &copy; 2025 CESA &mdash; Computer Engineering Students Association. All rights reserved.
        </p>
        <p class="footer-made-with">
          Made with <span>&hearts;</span> by CESA Technical Team
        </p>
      </div>
    </div>
  </footer>
  `;

  /* Find the existing footer element and replace its outerHTML,
     OR if no footer exists yet, append to body */
  function injectFooter() {
    var existing = document.getElementById('footer');
    if (existing) {
      existing.outerHTML = FOOTER_HTML;
    } else {
      document.body.insertAdjacentHTML('beforeend', FOOTER_HTML);
    }
  }

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectFooter);
  } else {
    injectFooter();
  }

})();
