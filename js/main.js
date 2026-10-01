/* =================================================================
   LE FORBICI D’ORO — interazioni
   Nessuna dipendenza esterna.
   ================================================================= */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header: stato allo scroll ---------- */
  const header = $('[data-header]');
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 16);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Menu mobile ---------- */
  const toggle = $('[data-menu-toggle]');
  const menu = $('[data-menu]');
  const outside = $$('main, footer, [data-callbar]');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
    menu.classList.toggle('is-open', open);
    menu.inert = !open;
    outside.forEach(el => { el.inert = open; });
    header.classList.toggle('menu-active', open);
    document.documentElement.classList.toggle('menu-open', open);
  }

  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  // Chiudere anche cliccando il logo mentre il menu è aperto
  $('.brand', header).addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 960px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Barra "Chiama" mobile: compare dopo la hero ---------- */
  const callbar = $('[data-callbar]');
  const heroActions = $('[data-hero-actions]');
  const footer = $('.site-footer');
  if (callbar && heroActions && 'IntersectionObserver' in window) {
    let pastHero = false;
    let atFooter = false;
    const sync = () => callbar.classList.toggle('is-visible', pastHero && !atFooter);
    new IntersectionObserver(([entry]) => {
      pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      sync();
    }).observe(heroActions);
    new IntersectionObserver(([entry]) => {
      atFooter = entry.isIntersecting;
      sync();
    }).observe(footer);
  }

  /* ---------- Reveal allo scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Navigazione: sezione attiva ---------- */
  const navLinks = $$('.nav-list a');
  const targets = navLinks
    .map(a => ({ link: a, el: document.getElementById(a.hash.slice(1)) }))
    .filter(t => t.el);
  if (targets.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const t = targets.find(x => x.el === entry.target);
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.removeAttribute('aria-current'));
          t.link.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(t => spy.observe(t.el));
  }

  /* ---------- Orari: giorno corrente + aperto/chiuso (ora di Roma) ---------- */
  const hoursList = $('[data-hours]');
  const statusEl = $('[data-status]');
  const statusDots = $$('[data-status-dot]');

  const toMinutes = hhmm => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };

  function romeNow() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    const get = type => parts.find(p => p.type === type).value;
    const days = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    return { day: days[get('weekday')], minutes: Number(get('hour')) * 60 + Number(get('minute')) };
  }

  function updateHours() {
    if (!hoursList) return;
    const { day, minutes } = romeNow();
    const rows = $$('li', hoursList);
    rows.forEach(li => li.classList.toggle('is-today', Number(li.dataset.day) === day));

    const today = rows.find(li => Number(li.dataset.day) === day);
    const tomorrow = rows.find(li => Number(li.dataset.day) === (day + 1) % 7);
    if (!today) return;

    const open = toMinutes(today.dataset.open);
    const close = toMinutes(today.dataset.close);
    const isOpen = minutes >= open && minutes < close;

    let text;
    if (isOpen) text = `Aperto ora · chiude alle ${today.dataset.close}`;
    else if (minutes < open) text = `Chiuso · apre alle ${today.dataset.open}`;
    else text = `Chiuso · apre domani alle ${tomorrow ? tomorrow.dataset.open : today.dataset.open}`;

    if (statusEl) {
      statusEl.innerHTML = '';
      const dot = document.createElement('span');
      dot.className = `status-dot ${isOpen ? 'is-open' : 'is-closed'}`;
      dot.setAttribute('aria-hidden', 'true');
      statusEl.append(dot, text);
    }
    statusDots.forEach(d => {
      d.classList.toggle('is-open', isOpen);
      d.classList.toggle('is-closed', !isOpen);
    });
  }
  try {
    updateHours();
    setInterval(updateHours, 60 * 1000);
  } catch (err) {
    /* Intl non disponibile: gli orari restano comunque leggibili */
  }

  /* ---------- Gallery + lightbox ---------- */
  const grid = $('[data-gallery]');
  const items = Array.isArray(window.GALLERY) ? window.GALLERY : [];
  const lb = $('[data-lightbox]');
  let current = 0;
  let lastFocus = null;

  function placeholder(label) {
    const div = document.createElement('div');
    div.className = 'ph';
    div.dataset.label = `Foto · ${label}`;
    return div;
  }

  function renderGallery() {
    if (!grid) return;
    const frag = document.createDocumentFragment();
    items.forEach((item, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'g-item' + (item.featured ? ' g-item--featured' : '');
      btn.setAttribute('aria-label', `Ingrandisci: ${item.alt || item.caption || 'foto ' + (i + 1)}`);
      btn.dataset.reveal = '';
      btn.style.setProperty('--d', `${(i % 4) * 60}ms`);

      if (item.src) {
        const img = document.createElement('img');
        img.src = item.thumb || item.src;
        img.alt = '';                      // descrizione già nel pulsante
        img.loading = 'lazy';
        img.decoding = 'async';
        if (item.width && item.height) { img.width = item.width; img.height = item.height; }
        btn.append(img);
      } else {
        btn.append(placeholder(item.caption || 'in arrivo'));
      }

      const cap = document.createElement('span');
      cap.className = 'g-caption';
      cap.setAttribute('aria-hidden', 'true');
      cap.innerHTML = `<span></span><svg><use href="#i-arrow"/></svg>`;
      cap.firstChild.textContent = item.caption || '';
      btn.append(cap);

      btn.addEventListener('click', () => openLightbox(i));
      frag.append(btn);
    });
    grid.append(frag);

    // attiva il reveal anche sugli elementi creati dinamicamente
    const newEls = $$('[data-reveal]', grid);
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      newEls.forEach(el => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
      }, { rootMargin: '0px 0px -5% 0px' });
      newEls.forEach(el => io.observe(el));
    }
  }

  function show(index) {
    const n = items.length;
    current = (index + n) % n;
    const item = items[current];
    const stage = $('[data-lb-stage]', lb);

    let node;
    if (item.src) {
      node = document.createElement('img');
      node.src = item.src;
      node.alt = item.alt || '';
      node.decoding = 'async';
      if (item.width && item.height) { node.width = item.width; node.height = item.height; }
    } else {
      node = placeholder(item.caption || 'in arrivo');
      node.setAttribute('role', 'img');
      node.setAttribute('aria-label', `Segnaposto: ${item.alt || item.caption || 'foto'}`);
    }
    stage.replaceChildren(node);
    $('[data-lb-caption]', lb).textContent = item.caption || '';
    $('[data-lb-counter]', lb).textContent = `${String(current + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;

    // precarica le immagini vicine
    [current + 1, current - 1].forEach(j => {
      const near = items[(j + n) % n];
      if (near && near.src) { const im = new Image(); im.src = near.src; }
    });
  }

  function openLightbox(index) {
    if (!lb || typeof lb.showModal !== 'function') return;
    lastFocus = document.activeElement;
    show(index);
    lb.showModal();
    document.documentElement.classList.add('menu-open'); // blocca lo scroll di fondo
  }

  if (lb) {
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    $('[data-lb-prev]', lb).addEventListener('click', () => show(current - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(current + 1));

    lb.addEventListener('close', () => {
      document.documentElement.classList.remove('menu-open');
      if (lastFocus) lastFocus.focus();
    });
    lb.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
    // click sullo sfondo = chiudi
    lb.addEventListener('click', e => {
      if (e.target === lb || e.target.matches('[data-lb-stage]')) lb.close();
    });
    // swipe su touch
    const stage = $('[data-lb-stage]', lb);
    let startX = null, startY = null;
    stage.addEventListener('pointerdown', e => { startX = e.clientX; startY = e.clientY; });
    stage.addEventListener('pointerup', e => {
      if (startX === null) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
      startX = startY = null;
    });
  }

  renderGallery();

  /* ---------- Mappa su richiesta ---------- */
  const mapBtn = $('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.google.com/maps?q=' +
        encodeURIComponent('Via Nomentana 58, 00015 Monterotondo RM') + '&output=embed';
      iframe.title = 'Mappa: Le Forbici d’Oro, Via Nomentana 58, Monterotondo';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      iframe.allowFullscreen = true;
      $('[data-map]').replaceChildren(iframe);
      iframe.focus();
    });
  }

  /* ---------- Anno nel footer ---------- */
  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
