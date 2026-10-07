// Accueil : cadran à l'heure du visiteur (trotteuse à 10 pas/s, 36 000 A/h), apparitions au défilement.
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('js-anim');
  const hands = { h: document.querySelector('[data-hand="h"]'), m: document.querySelector('[data-hand="m"]'), s: document.querySelector('[data-hand="s"]') };
  const date = document.querySelector('[data-date]');
  if (hands.h && hands.m && hands.s) {
    const set = (el, deg) => el.setAttribute('transform', `rotate(${deg} 200 200)`);
    const tick = () => {
      const d = new Date();
      const s = d.getSeconds() + (reduce ? 0 : Math.floor(d.getMilliseconds() / 100) / 10);
      const m = d.getMinutes() + s / 60;
      set(hands.s, s * 6); set(hands.m, m * 6); set(hands.h, (d.getHours() % 12 + m / 60) * 30);
      if (date) date.textContent = d.getDate();
    };
    tick();
    if (reduce) setInterval(tick, 1000);
    else { const loop = () => { tick(); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  }
  if (reduce) { document.querySelectorAll('.step').forEach((s) => s.classList.add('is-on')); return; }
  // Tout élément dont le haut est passé sous 90 % de l'écran (ou déjà dépassé) s'affiche : rien ne reste caché après un défilement rapide.
  let pending = [];
  document.querySelectorAll('.lot, .step, .h-head, .h-founder__text, .h-review').forEach((el, i) => {
    if (el.getBoundingClientRect().top < innerHeight) { el.classList.add('is-on'); return; }
    el.classList.add('reveal'); el.style.transitionDelay = `${(i % 3) * 80}ms`; pending.push(el);
  });
  const check = () => {
    pending = pending.filter((el) => { if (el.getBoundingClientRect().top < innerHeight * 0.9) { el.classList.add('is-on'); return false; } return true; });
    if (!pending.length) removeEventListener('scroll', onScroll);
  };
  let raf = 0;
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; check(); }); };
  addEventListener('scroll', onScroll, { passive: true });
})();
