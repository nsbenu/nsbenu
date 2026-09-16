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

// ---------------------------------------------------------------
// Upcoming events — pulled live from a published Google Sheet.
// Replace EVENTS_SHEET_CSV_URL below with your own "Publish to web"
// CSV link (File → Share → Publish to web → CSV, in Google Sheets).
// Sheet columns, in order: Month | Day | Name | Description | Time | Location
// ---------------------------------------------------------------
const EVENTS_SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZKzO0lVjHLLowb3AUhKH7eJ9jSO1ZjXNPrER4WWsqNIcRN62qtffsg7TNlE2FHKa1zc0gGfzDCWT/pub?gid=0&single=true&output=csv 
';

function parseCSV(text) {
  const rows = [];
  let cur = '', row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
      } else {
        cur += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(cur); cur = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cur); cur = '';
      rows.push(row); row = [];
    } else {
      cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

function eventCard(ev) {
  const li = document.createElement('li');
  li.className = 'event';
  li.innerHTML = `
    <div class="event__date"><span class="event__month">${ev.month}</span><span class="event__day">${ev.day}</span></div>
    <div class="event__body">
      <h3>${ev.name}</h3>
      <p>${ev.description}</p>
      <p class="event__meta">${ev.time} · ${ev.location}</p>
    </div>
  `;
  return li;
}

async function loadEvents() {
  const list = document.getElementById('eventsList');
  if (!list) return; // not on the homepage

  if (EVENTS_SHEET_CSV_URL.includes('https://docs.google.com/spreadsheets/d/e/2PACX-1vRuZKzO0lVjHLLowb3AUhKH7eJ9jSO1ZjXNPrER4WWsqNIcRN62qtffsg7TNlE2FHKa1zc0gGfzDCWT/pub?gid=0&single=true&output=csv 
')) {
    list.innerHTML = '<li class="event event--loading"><div class="event__body"><p>Events sheet not connected yet — add your published CSV URL in script.js.</p></div></li>';
    return;
  }

  try {
    const res = await fetch(`${EVENTS_SHEET_CSV_URL}&t=${Date.now()}`); // cache-bust so edits show up fast
    const text = await res.text();
    const rows = parseCSV(text).slice(1); // drop header row

    if (!rows.length) {
      list.innerHTML = '<li class="event event--loading"><div class="event__body"><p>No upcoming events right now — check back soon.</p></div></li>';
      return;
    }

    list.innerHTML = '';
    rows.forEach(row => {
      const [month, day, name, description, time, location] = row;
      if (!name) return;
      list.appendChild(eventCard({ month, day, name, description, time, location }));
    });
  } catch (err) {
    console.error('Could not load events sheet:', err);
    list.innerHTML = '<li class="event event--loading"><div class="event__body"><p>Couldn\'t load events right now — check back soon.</p></div></li>';
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
loadEvents();
