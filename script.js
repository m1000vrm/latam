'use strict';

document.querySelectorAll('[data-slider]').forEach((slider) => {
  const track = slider.querySelector('.slider-track');
  const cards = [...track.querySelectorAll('.recipe-card')];
  const previous = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const count = slider.querySelector('.slide-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = null;

  function currentIndex() {
    const left = track.getBoundingClientRect().left;
    return cards.reduce((closest, card, index) => (
      Math.abs(card.getBoundingClientRect().left - left) <
      Math.abs(cards[closest].getBoundingClientRect().left - left) ? index : closest
    ), 0);
  }

  function update() {
    const index = currentIndex();
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    previous.disabled = track.scrollLeft <= 3;
    next.disabled = track.scrollLeft >= max - 3;
    count.textContent = `${track.scrollLeft >= max - 3 && max > 3 ? cards.length : index + 1} / ${cards.length}`;
    frame = null;
  }

  function move(direction) {
    const width = cards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 14;
    track.scrollBy({ left: direction * (width + gap), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
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

const stickyBuy = document.querySelector('[data-sticky-buy]');
const offers = document.querySelector('#ofertas');
const finalCta = document.querySelector('.final-cta');

if (stickyBuy && offers && finalCta && 'IntersectionObserver' in window) {
  const visibleSections = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleSections.add(entry.target);
      else visibleSections.delete(entry.target);
    });
    stickyBuy.classList.toggle('is-hidden', visibleSections.size > 0);
  }, { threshold: 0.08 });
  observer.observe(offers);
  observer.observe(finalCta);
}
