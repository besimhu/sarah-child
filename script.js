const hero = document.querySelector('.hero-image');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hoverCapable = matchMedia('(hover: hover)').matches;

if (hero && !reducedMotion && hoverCapable) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY * 0.12, 65);
    hero.style.transform = `translateY(${y}px) scale(1.04)`;
  }, { passive: true });
}
