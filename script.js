'use strict';
// Navegación táctil y por teclado para las muestras reales del recetario.
// Los enlaces de compra funcionan también cuando JavaScript está desactivado.
document.querySelectorAll('[data-slider]').forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const cards = [...track.querySelectorAll('.recipe-card')];
  const previous = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const count = slider.querySelector('.slide-count');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;
  const position = () => {
    const left = track.getBoundingClientRect().left;
    let closest = 0;
    cards.forEach((card, index) => {
      if (Math.abs(card.getBoundingClientRect().left - left) <
          Math.abs(cards[closest].getBoundingClientRect().left - left)) closest = index;
    });
    return closest;
  };
  function update() {
    const index = position();
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft >= max - 3;
    count.textContent = `${track.scrollLeft >= max - 3 && max > 3 ? cards.length : index + 1} / ${cards.length}`;
    frame = null;
  }
  function move(direction) {
    const width = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 16;
    track.scrollBy({ left: direction * (width + gap), behavior: motion.matches ? 'instant' : 'smooth' });
  }
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(event.key === 'ArrowRight' ? 1 : -1);
    }
  });
  track.addEventListener('scroll', () => {
    if (frame === null) frame = requestAnimationFrame(update);
  }, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  else window.addEventListener('resize', update);
  update();
});
