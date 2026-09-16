// Inject shared header/footer partials, then wire up behavior that depends on them.
async function loadPartial(url, mountId) {
  const mount = document.getElementById(mountId);
  if (!mount) return;
  try {
    const res = await fetch(url);
    mount.innerHTML = await res.text();
  } catch (err) {
    console.error(`Could not load ${url}. If you're opening this file directly ` +
      `(file://) instead of via a local server, the browser blocks this fetch — ` +
      `run "python3 -m http.server" in this folder and open http://localhost:8000 instead.`, err);
  }
}

async function initLayout() {
  await Promise.all([
    loadPartial('partials/header.html', 'site-header'),
    loadPartial('partials/footer.html', 'site-footer'),
  ]);

  // Highlight the current page in the nav
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.primary-nav a[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) link.classList.add('is-active');
  });

  // Fill in the footer's copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle (header now exists in the DOM)
  const navToggle = document.getElementById('navToggle');
  const primaryNav = document.getElementById('primaryNav');
  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        primaryNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Newsletter form: placeholder handler — wire this to Mailchimp, ConvertKit,
  // Formspree, or similar before publishing. GitHub Pages can't process form
  // submissions on its own since it only serves static files.
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterNote = document.getElementById('newsletterNote');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      newsletterNote.textContent = 'This form is a placeholder — connect it to Mailchimp, ConvertKit, or Formspree before publishing.';
    });
  }
}

initLayout();
