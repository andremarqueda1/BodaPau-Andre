(() => {
  'use strict';

  // Ceremonia: sábado 15 de mayo de 2027, 1:30 PM, hora de Morelos (UTC-6, sin horario de verano)
  const WEDDING = new Date('2027-05-15T13:30:00-06:00');

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------------- Invitado personalizado ----------------
     Formatos aceptados:
       ?i=<código>              (generado en /generador)
       ?n=Familia%20López&p=4   (legible)                    */
  function readGuest() {
    const q = new URLSearchParams(location.search);
    let name = q.get('n') || q.get('invitado') || '';
    let seats = q.get('p') || q.get('pases') || '';
    const code = q.get('i');
    if (code) {
      try {
        const b64 = code.replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(escape(atob(b64)));
        const data = JSON.parse(json);
        name = data.n || name;
        seats = data.p || seats;
      } catch (e) { /* código inválido: se ignora */ }
    }
    name = String(name).trim().slice(0, 80);
    seats = parseInt(seats, 10);
    return { name, seats: Number.isFinite(seats) && seats > 0 && seats < 100 ? seats : 0 };
  }

  const guest = readGuest();
  if (guest.name) {
    const env = $('#envelopeGuest');
    env.textContent = '';
    env.append('Con mucho cariño para');
    const strong = document.createElement('strong');
    strong.textContent = guest.name;
    env.append(strong);
    env.hidden = false;

    $('#passName').textContent = guest.name;
    $('#passSeats').textContent = guest.seats
      ? (guest.seats === 1 ? 'Válido para 1 persona' : `Válido para ${guest.seats} personas`)
      : 'Te esperamos';
    $('#pase').hidden = false;
    document.title = `${guest.name} · Pau & André`;
  }

  /* ---------------- Sobre de entrada + música ---------------- */
  const envelope = $('#envelope');
  const song = $('#song');
  const musicBtn = $('#musicBtn');
  let audioAvailable = false;

  // Sólo mostramos el botón de música si existe el archivo /assets/audio/cancion.mp3
  fetch(song.getAttribute('src'), { method: 'HEAD' })
    .then(r => { audioAvailable = r.ok; if (r.ok) musicBtn.hidden = false; })
    .catch(() => {});

  function setPlaying(on) {
    musicBtn.setAttribute('aria-pressed', String(on));
    musicBtn.setAttribute('aria-label', on ? 'Pausar música' : 'Reproducir música');
  }
  function play() {
    if (!audioAvailable) return;
    song.volume = 0.6;
    song.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }
  musicBtn.addEventListener('click', () => {
    if (song.paused) play(); else { song.pause(); setPlaying(false); }
  });

  document.body.classList.add('locked');
  $('#openInvite').addEventListener('click', () => {
    envelope.classList.add('is-open');
    document.body.classList.remove('locked');
    play();
    setTimeout(() => envelope.remove(), 1000);
  });

  /* ---------------- Cuenta regresiva ---------------- */
  const cd = Object.fromEntries($$('[data-cd]').map(el => [el.dataset.cd, el]));
  const pad = (n, l = 2) => String(n).padStart(l, '0');
  function tick() {
    let diff = Math.max(0, WEDDING - Date.now());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    cd.d.textContent = pad(d, d >= 100 ? 3 : 2);
    cd.h.textContent = pad(h);
    cd.m.textContent = pad(m);
    cd.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------------- Agregar al calendario (.ics) ---------------- */
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//PauyAndre//Boda//ES', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    'UID:boda-pau-andre-20270515@pauyandre',
    'DTSTAMP:20261125T000000Z',
    'DTSTART:20270515T193000Z',
    'DTEND:20270516T070000Z',
    'SUMMARY:Boda de Pau & André',
    'LOCATION:Jardín Nativa\\, Paso de Las Fuentes\\, Col. Valle Verde\\, 62569 Jiutepec\\, Mor.',
    'DESCRIPTION:Ceremonia 1:30 PM · Coctel 3:00 PM · Recepción 4:00 PM · Comida 4:30 PM · Fiesta 6:00 PM. Código de vestimenta: Garden Formal. https://maps.app.goo.gl/285JMPF5CcxviSnE8',
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');
  $('#addToCal').href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));

  /* ---------------- Copiar CLABE / código ---------------- */
  const toast = $('#toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.append(ta); ta.select();
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    }
  }
  $$('.copy').forEach(btn => btn.addEventListener('click', async () => {
    const ok = await copyText(btn.dataset.copy);
    showToast(ok ? 'Copiado al portapapeles' : 'No se pudo copiar');
  }));

  /* ---------------- Animaciones al hacer scroll ---------------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));

    const nav = $('#nav');
    new IntersectionObserver(([e]) => nav.classList.toggle('is-visible', !e.isIntersecting), { threshold: 0.1 })
      .observe($('#inicio'));
  } else {
    $$('.reveal').forEach(el => el.classList.add('is-visible'));
  }
})();
