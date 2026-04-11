/* ============================================================
   nav.js — injects the shared navbar into every page
   Usage: <script src="components/nav.js"></script>
   ============================================================ */

(function () {

  /* Detect base path — works both on Live Server (/) and GitHub Pages (/repo-name/) */
  const base = (() => {
    const parts = location.pathname.split('/');
    // On GitHub Pages pathname starts with /repo-name/
    // On Live Server it starts with / directly
    const isGHPages = parts[1] && !parts[1].includes('.html');
    return isGHPages ? '/' + parts[1] : '';
  })();

  /* 1. Build the navbar HTML string */
  const navbar = `
    <nav class="navbar">
      <div class="nav-inner">

        <a href="${base}/index.html" class="nav-logo">
          <!-- Small inline SVG: two nodes connected by an edge — fits the visualizer theme -->
          <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="5"  cy="10" r="4.5" fill="#1A1A1A" />
            <circle cx="23" cy="4"  r="4.5" fill="#1A1A1A" />
            <circle cx="23" cy="16" r="4.5" fill="#1A1A1A" />
            <line x1="9"  y1="9"  x2="19" y2="5"  stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
            <line x1="9"  y1="11" x2="19" y2="15" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="nav-logo-text">AI / ML <span class="nav-logo-accent">Notes</span></span>
        </a>

        <div class="nav-links">
          <a href="${base}/index.html" class="nav-link">Home</a>
          <a href="${base}/index.html?cat=ai" class="nav-link">AI</a>
          <a href="${base}/index.html?cat=ml" class="nav-link">ML</a>
        </div>

      </div>
    </nav>
  `;

  /* 2. Inject it as the very first element inside <body> */
  document.body.insertAdjacentHTML('afterbegin', navbar);

  /* 3. Mark the active link based on current URL */
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    if (link.href === location.href) {
      link.classList.add('nav-link--active');
    }
  });

})();
