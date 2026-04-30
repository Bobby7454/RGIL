/* ══════════════════════════════════════════════════════
   RGIL NOTICES ENGINE
   - Loads saved notices from localStorage
   - Renders them into the page
   - Provides a hidden admin panel (press Ctrl+Shift+A)
══════════════════════════════════════════════════════ */

/* ── Default notices (shown on first ever load) ── */
const DEFAULT_NOTICES = [
  {
    id: 1,
    panel: "notices",
    date: "May 15",
    text: "Guest Lecture by Hon. Justice (Retd.) K. Ramakrishna on Constitutional Law",
    badge: "New",
    type: "link",
    href: "notices.html"
  },
  {
    id: 2,
    panel: "notices",
    date: "May 10",
    text: "Semester III Examination Results Declared — Check Portals",
    badge: "",
    type: "download",
    href: "assets/sem3-results.pdf"
  },
  {
    id: 3,
    panel: "notices",
    date: "May 05",
    text: "Moot Court National Competition — Team Selection on May 8",
    badge: "",
    type: "link",
    href: "notices.html"
  },
  {
    id: 4,
    panel: "notices",
    date: "Apr 28",
    text: "Legal Aid Camp at Ramanayyapeta — Volunteer Registrations Open",
    badge: "Ongoing",
    type: "text"
  },
  {
    id: 5,
    panel: "notices",
    date: "Apr 20",
    text: "Annual Sports Day — Schedule Released",
    badge: "",
    type: "text"
  },
  {
    id: 6,
    panel: "events",
    date: "Jun 01",
    text: "Admissions Commence — 2025–26 Batch",
    badge: "New",
    type: "link",
    href: "admissions.html"
  },
  {
    id: 7,
    panel: "events",
    date: "May 20",
    text: "HRC Visit — High Court of Andhra Pradesh, Amaravati",
    badge: "",
    type: "text"
  },
  {
    id: 8,
    panel: "events",
    date: "May 18",
    text: "NSS Camp — Village Adoption Programme, Kakinada Rural",
    badge: "",
    type: "text"
  },
  {
    id: 9,
    panel: "events",
    date: "May 12",
    text: "Central Prison Visit — Criminal Justice Field Study",
    badge: "",
    type: "text"
  },
  {
    id: 10,
    panel: "events",
    date: "May 02",
    text: "Inter-Collegiate Debate Competition — Results Announced",
    badge: "",
    type: "text"
  }
];

/* ── Storage helpers ── */
function loadNotices() {
  const saved = localStorage.getItem('rgil_notices');
  if (saved) return JSON.parse(saved);
  /* first time — seed with defaults */
  saveNotices(DEFAULT_NOTICES);
  return DEFAULT_NOTICES;
}

function saveNotices(items) {
  localStorage.setItem('rgil_notices', JSON.stringify(items));
}

function getNextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

/* ── Render a single notice row ── */
function makeNoticeRow(item, adminMode) {
  const row = document.createElement('div');
  row.className = 'notice-item';
  row.dataset.id = item.id;

  const date = document.createElement('div');
  date.className = 'notice-date';
  date.textContent = item.date;

  const textWrap = document.createElement('div');
  textWrap.className = 'notice-text';
  textWrap.textContent = item.text;

  if (item.type === 'download' && item.href) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-download';
    icon.style.cssText = 'margin-left:6px;font-size:0.65em;color:var(--gold)';
    textWrap.appendChild(icon);
  } else if (item.type === 'link' && item.href) {
    const icon = document.createElement('i');
    icon.className = 'fas fa-arrow-right';
    icon.style.cssText = 'margin-left:6px;font-size:0.65em;color:var(--gold)';
    textWrap.appendChild(icon);
  }

  if (item.badge) {
    const badge = document.createElement('span');
    badge.textContent = item.badge;
    textWrap.appendChild(badge);
  }

  /* make row clickable if link/download */
  if ((item.type === 'link' || item.type === 'download') && item.href) {
    row.style.cursor = 'pointer';
    row.addEventListener('click', () => {
      if (item.type === 'download') {
        const a = document.createElement('a');
        a.href = item.href; a.download = ''; a.click();
      } else {
        window.location.href = item.href;
      }
    });
  }
  row.appendChild(date);
  row.appendChild(textWrap);

  /* admin delete button */
  if (adminMode) {
    const del = document.createElement('button');
    del.innerHTML = '<i class="fas fa-trash"></i>';
    del.title = 'Delete';
    del.style.cssText = `
      margin-left:auto; background:rgba(220,50,50,0.1);
      border:1px solid rgba(220,50,50,0.3); color:#c0392b;
      border-radius:4px; padding:2px 8px; cursor:pointer;
      font-size:0.75rem; flex-shrink:0;
    `;
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!confirm('Delete this notice?')) return;
      const all = loadNotices().filter(n => n.id !== item.id);
      saveNotices(all);
      renderAllNotices(true);
    });
    row.style.display = 'flex';
    row.appendChild(del);
  }

  return row;
}

/* ── Render both panels ── */
function renderAllNotices(adminMode = false) {
  const items = loadNotices();
  const noticeList = document.getElementById('notice-list');
  const eventList  = document.getElementById('event-list');
  if (!noticeList || !eventList) return;

  noticeList.innerHTML = '';
  eventList.innerHTML  = '';

  /* newest first */
  const sorted = [...items].reverse();

  sorted.filter(i => i.panel === 'notices').forEach(i => {
    noticeList.appendChild(makeNoticeRow(i, adminMode));
  });
  sorted.filter(i => i.panel === 'events').forEach(i => {
    eventList.appendChild(makeNoticeRow(i, adminMode));
  });
}

/* ══════════════════════════════════════════════════════
   ADMIN PANEL
   Open with:  Ctrl + Shift + A
══════════════════════════════════════════════════════ */
function injectAdminPanel() {
  if (document.getElementById('rgil-admin')) return;

  const panel = document.createElement('div');
  panel.id = 'rgil-admin';
  panel.innerHTML = `
    <div id="rgil-admin-overlay"></div>
    <div id="rgil-admin-box">
      <div id="rgil-admin-head">
        <span>📋 Notice Board Admin</span>
        <button id="rgil-admin-close">✕</button>
      </div>
      <div id="rgil-admin-body">

        <div class="adm-row">
          <label>Panel</label>
          <select id="adm-panel">
            <option value="notices">Notices &amp; Circulars</option>
            <option value="events">Events &amp; Activities</option>
          </select>
        </div>

        <div class="adm-row">
          <label>Date <small>(e.g. May 15)</small></label>
          <input id="adm-date" type="text" placeholder="May 15"/>
        </div>

        <div class="adm-row">
          <label>Notice Text</label>
          <input id="adm-text" type="text" placeholder="Enter notice text..."/>
        </div>

        <div class="adm-row">
          <label>Type</label>
          <select id="adm-type">
            <option value="text">Text only</option>
            <option value="link">Link (navigate to page)</option>
            <option value="download">Download (PDF/file)</option>
          </select>
        </div>

        <div class="adm-row" id="adm-href-row" style="display:none">
          <label>URL / File path</label>
          <input id="adm-href" type="text" placeholder="e.g. notices.html or assets/file.pdf"/>
        </div>

        <div class="adm-row">
          <label>Badge <small>(optional)</small></label>
          <select id="adm-badge">
            <option value="">None</option>
            <option value="New">New</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>

        <button id="adm-submit">＋ Add Notice</button>
        <p id="adm-msg"></p>

        <hr style="margin:1.5rem 0;border-color:rgba(0,0,0,0.08)"/>
        <p style="font-size:0.78rem;color:#888;margin-bottom:0.5rem">
          To <strong>delete</strong> a notice, close this panel — notices now show a 🗑 delete button next to them. Press <kbd>Ctrl+Shift+A</kbd> again to exit admin mode.
        </p>
        <button id="adm-reset" style="background:rgba(220,50,50,0.08);color:#c0392b;border:1px solid rgba(220,50,50,0.25);padding:0.5rem 1rem;border-radius:4px;cursor:pointer;font-size:0.8rem;">
          ⚠ Reset to Defaults
        </button>

      </div>
    </div>
  `;

  /* styles */
  const style = document.createElement('style');
  style.textContent = `
    #rgil-admin-overlay {
      position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:10000;
    }
    #rgil-admin-box {
      position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
      width:min(520px,95vw);background:#fff;border-radius:10px;
      box-shadow:0 24px 64px rgba(0,0,0,0.25);z-index:10001;overflow:hidden;
    }
    #rgil-admin-head {
      background:#0f2340;color:#fff;padding:1rem 1.5rem;
      display:flex;align-items:center;justify-content:space-between;
      font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;
    }
    #rgil-admin-close {
      background:none;border:none;color:rgba(255,255,255,0.6);
      font-size:1.1rem;cursor:pointer;padding:2px 6px;
    }
    #rgil-admin-close:hover{color:#fff}
    #rgil-admin-body { padding:1.5rem; max-height:75vh; overflow-y:auto; }
    .adm-row { margin-bottom:1rem; }
    .adm-row label {
      display:block;font-size:0.75rem;font-weight:500;
      color:#0f2340;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:4px;
    }
    .adm-row label small { font-size:0.7rem;color:#888;text-transform:none;letter-spacing:0 }
    .adm-row input,.adm-row select {
      width:100%;padding:0.55rem 0.75rem;border:1px solid rgba(0,0,0,0.15);
      border-radius:5px;font-size:0.88rem;color:#1a1a2e;
      outline:none;transition:border-color 0.2s;
    }
    .adm-row input:focus,.adm-row select:focus { border-color:#c8973a; }
    #adm-submit {
      width:100%;padding:0.75rem;background:#c8973a;color:#0f2340;
      border:none;border-radius:5px;font-size:0.85rem;font-weight:600;
      letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;
      transition:background 0.2s;
    }
    #adm-submit:hover { background:#e8b96a; }
    #adm-msg { font-size:0.8rem;margin-top:0.6rem;color:#2e7d32;min-height:1.2em; }
  `;
  document.head.appendChild(style);
  document.body.appendChild(panel);

  /* show/hide href field */
  document.getElementById('adm-type').addEventListener('change', function() {
    document.getElementById('adm-href-row').style.display =
      (this.value === 'text') ? 'none' : 'block';
  });

  /* close */
  document.getElementById('rgil-admin-close').addEventListener('click', closeAdmin);
  document.getElementById('rgil-admin-overlay').addEventListener('click', closeAdmin);

  /* submit */
  document.getElementById('adm-submit').addEventListener('click', () => {
    const date  = document.getElementById('adm-date').value.trim();
    const text  = document.getElementById('adm-text').value.trim();
    const type  = document.getElementById('adm-type').value;
    const href  = document.getElementById('adm-href').value.trim();
    const badge = document.getElementById('adm-badge').value;
    const panel = document.getElementById('adm-panel').value;
    const msg   = document.getElementById('adm-msg');

    if (!date || !text) { msg.style.color = '#c0392b'; msg.textContent = '⚠ Date and text are required.'; return; }
    if (type !== 'text' && !href) { msg.style.color = '#c0392b'; msg.textContent = '⚠ Please enter a URL or file path.'; return; }

    const all = loadNotices();
    all.push({ id: getNextId(all), panel, date, text, type, href: href || '', badge });
    saveNotices(all);
    renderAllNotices(true);

    /* clear form */
    document.getElementById('adm-date').value  = '';
    document.getElementById('adm-text').value  = '';
    document.getElementById('adm-href').value  = '';
    document.getElementById('adm-badge').value = '';
    msg.style.color = '#2e7d32';
    msg.textContent = '✓ Notice added successfully!';
    setTimeout(() => msg.textContent = '', 3000);
  });

  /* reset */
  document.getElementById('adm-reset').addEventListener('click', () => {
    if (!confirm('Reset ALL notices to defaults? This cannot be undone.')) return;
    saveNotices(DEFAULT_NOTICES);
    renderAllNotices(true);
    closeAdmin();
  });
}

let adminOpen = false;
function closeAdmin() {
  const panel = document.getElementById('rgil-admin');
  if (panel) panel.remove();
  adminOpen = false;
  renderAllNotices(false); /* re-render without delete buttons */
}

/* ── Keyboard shortcut: Ctrl + Shift + A ── */
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    if (adminOpen) {
      closeAdmin();
    } else {
      adminOpen = true;
      renderAllNotices(true); /* show delete buttons */
      injectAdminPanel();
    }
  }
});

/* ── Initial render on page load ── */
renderAllNotices(false);