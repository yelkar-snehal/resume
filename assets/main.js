/* Snehal Yelkar portfolio: scroll reveals, the timeline line and the request-path diagram. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var params = new URLSearchParams(location.search);
  var motion = doc.classList.contains('motion');

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  /* ---------------- Gentle reveal ---------------- */
  /* Checked on scroll (not IntersectionObserver), so it also runs in headless capture. */
  var pending = motion ? $$('.reveal') : [];
  pending.forEach(function (el) {
    /* Cards in the same grid come in one after another. */
    var sibs = $$(':scope > .reveal', el.parentNode);
    var i = sibs.indexOf(el);
    if (sibs.length > 1 && i > 0) el.style.transitionDelay = ((i % 3) * 90) + 'ms';
  });

  /* ---------------- Request path: parts appear in order, then one request travels it once ---------------- */
  var dia = $('#flow');
  function play() {
    if (dia.classList.contains('play')) return;
    dia.classList.add('play');
    var move = $('#flow-move'), pk = $('#flow-pk');
    if (!move || !move.beginElement || !pk) return;
    setTimeout(function () {
      pk.classList.add('on');
      move.beginElement();
      setTimeout(function () { pk.classList.remove('on'); }, 4300);
    }, 1500);
  }

  /* ---------------- Scroll loop: reveals, the diagram and the timeline line. All reads first, then writes. ---------------- */
  var lines = $$('[data-progress]');
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var shown = pending.filter(function (el) { return el.getBoundingClientRect().top < vh * 0.94; });
    var diaIn = dia && !dia.classList.contains('play') && dia.getBoundingClientRect().top < vh * 0.7;
    var vals = lines.map(function (el) {
      var r = el.getBoundingClientRect();
      return clamp((vh * 0.8 - r.top) / Math.max(1, r.height), 0, 1).toFixed(3);
    });
    lines.forEach(function (el, i) { if (el._p !== vals[i]) { el._p = vals[i]; el.style.setProperty('--p', vals[i]); } });
    if (shown.length) {
      shown.forEach(function (el) { el.classList.add('in'); });
      pending = pending.filter(function (el) { return shown.indexOf(el) < 0; });
    }
    if (diaIn) play();
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  if (motion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ---------------- Start. ?y=N scrolls there after load (for screenshots). ---------------- */
  function start() {
    var y = params.get('y');
    if (y !== null && !isNaN(+y)) {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo({ top: +y, behavior: 'instant' });
      /* Screenshot mode: show everything in its final state, with no transitions to wait for. */
      doc.classList.add('shot');
      $$('.reveal').forEach(function (el) { el.classList.add('in'); });
      if (dia) dia.classList.add('play');
    }
    if (motion) update();
  }
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);

  /* Optional photo: add data-photo="assets/photo.jpg" to #mark once the photo is committed. */
  var mark = $('#mark');
  if (mark && mark.dataset.photo) {
    var img = new Image();
    img.onload = function () { img.alt = ''; mark.textContent = ''; mark.appendChild(img); };
    img.src = mark.dataset.photo;
  }

  /* Tell the head script that init finished, so it keeps the motion layout. */
  window.__syReady = 1;
})();
