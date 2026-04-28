  /* ═══════════════════════════════════════════════════════════════
    RGIL Loader — No-Flicker Edition
    
    HOW IT WORKS:
    1. Nav placeholder gets a fixed height + background INSTANTLY
        via a <style> tag → no layout shift, no flash of empty space.
    2. Nav + footer are fetched IN PARALLEL (Promise.all).
    3. sessionStorage cache → subsequent page visits are INSTANT,
        zero network requests.
    4. Fires custom event 'rgil:ready' after inject → pages that
        need post-load logic (like counters) listen for this event.
  ═══════════════════════════════════════════════════════════════ */

  const CACHE_NAV  = 'rgil_nav_v1';
  const CACHE_FOOT = 'rgil_foot_v1';

  /* ── 1. Reserve nav space immediately to prevent layout shift ── */
  (function reserveSpace() {
    const s = document.createElement('style');
    s.textContent = `
      #navbar-placeholder {
        display: block;
        height: 72px;
      }
      /* Hide body content below nav until nav is injected */
      body > *:not(#navbar-placeholder) {
        visibility: hidden;
      }
    `;
    s.id = 'rgil-reserve';
    document.head.appendChild(s);
  })();

  /* ── 2. Wire nav interactivity (called after injection) ── */
  function wireNav() {
    /* Active link */
    const page = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-item > a').forEach(a => {
      if (a.getAttribute('href') === page)
        a.closest('.nav-item')?.classList.add('active');
    });

    /* Scroll shadow */
    const nav = document.getElementById('mainNav');
    if (nav && !nav._sw) {
      nav._sw = true;
      const onScroll = () => nav.classList.toggle('scrolled', scrollY > 60);
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    /* Hamburger */
    const ham = document.getElementById('ham');
    const mob = document.getElementById('mobileMenu');
    if (ham && mob && !ham._wired) {
      ham._wired = true;
      ham.addEventListener('click', () => {
        const open = ham.classList.toggle('open');
        mob.classList.toggle('open', open);
        ham.setAttribute('aria-expanded', String(open));
        document.body.style.overflow = open ? 'hidden' : '';
      });
      document.querySelectorAll('.mob-toggle').forEach(a =>
        a.addEventListener('click', e => {
          e.preventDefault();
          a.closest('.mobile-item')?.classList.toggle('open');
        })
      );
      document.querySelectorAll('.mobile-item .sub a').forEach(a =>
        a.addEventListener('click', () => {
          mob.classList.remove('open');
          ham.classList.remove('open');
          ham.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        })
      );
    }
  }

  /* ── 3. Fetch with sessionStorage cache ── */
  async function getCached(url, key) {
    const hit = sessionStorage.getItem(key);
    if (hit) return hit;
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + ' ' + r.status);
    const t = await r.text();
    try { sessionStorage.setItem(key, t); } catch (_) {}
    return t;
  }

  /* ── 4. Main bootstrap ── */
  async function boot() {
    try {
      /* Parallel fetch — biggest speed win */
      const [nav, foot] = await Promise.all([
        getCached('components/navbar.html', CACHE_NAV),
        getCached('components/footer.html', CACHE_FOOT),
      ]);

      const navEl  = document.getElementById('navbar-placeholder');
      const footEl = document.getElementById('footer-placeholder');
      if (navEl)  navEl.innerHTML  = nav;
      if (footEl) footEl.innerHTML = foot;

      wireNav();

    } catch (e) {
      console.error('[RGIL Loader]', e);
    } finally {
      /* ── 5. Reveal page content (remove visibility:hidden) ── */
      const reserve = document.getElementById('rgil-reserve');
      if (reserve) reserve.remove();

      /* ── 6. Signal pages that components are ready ── */
      document.dispatchEvent(new Event('rgil:ready'));
    }
  }

  /* ── Run as early as possible ── */
  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  else
    boot();
