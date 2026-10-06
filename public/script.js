const hero = document.querySelector('.hero-image');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const hoverCapable = matchMedia('(hover: hover)').matches;

if (hero && !reducedMotion && hoverCapable) {
  window.addEventListener('scroll', () => {
    const y = Math.min(window.scrollY * 0.12, 65);
    hero.style.transform = `translateY(${y}px) scale(1.04)`;
  }, { passive: true });
}

const featuredNote = document.querySelector('[data-featured-note]');
if (featuredNote) {
  const notes = [
    { id: 'long-record', tag: 'ALASKA · 85-YEAR RECORD', title: 'What changes when the glacier record gets longer?', copy: 'Historical photographs helped researchers extend the record for Kennicott and Root Glaciers back to 1938—and refine estimates of future mass loss.' },
    { id: 'old-photos', tag: 'EAST ANTARCTICA · PHOTOGRAMMETRY', title: 'How can old photographs become elevation data?', copy: 'Overlapping photographs of Byrd Glacier helped reconstruct a 1978–79 surface and compare it with modern elevation measurements.' },
    { id: 'hidden-flood', tag: 'BYRD GLACIER · SUBGLACIAL FLOOD', title: 'Can a crevasse reveal a flood beneath the ice?', copy: 'Radar measurements of basal crevasses preserve evidence of a 2006 flood beneath Byrd Glacier.' },
    { id: 'between-calvings', tag: 'GREENLAND · HELHEIM GLACIER', title: 'What happens between iceberg calving events?', copy: 'Repeated laser scans showed that individual calving episodes did not cause a lasting increase in glacier speed during the study.' },
    { id: 'grounding-zone', tag: 'GREENLAND · GROUNDING ZONE', title: 'How do researchers track where a glacier meets the ocean?', copy: 'Repeated measurements at Helheim Glacier documented more than three kilometres of grounding-zone retreat between 2018 and 2019.' },
    { id: 'surface-depressions', tag: 'GREENLAND · LASER SCANS', title: 'What can a dip in the glacier surface tell us?', copy: 'High-resolution scans helped researchers track surface depressions that developed before calving at Helheim Glacier.' },
    { id: 'radar-under-ice', tag: 'BYRD GLACIER · AIRBORNE RADAR', title: 'How can radar reveal fractures at a glacier’s base?', copy: 'Airborne radar detected hundreds of basal crevasses beneath Byrd Glacier, structures that are hidden from surface view.' }
  ];
  const note = notes[Math.floor(Math.random() * notes.length)];
  featuredNote.querySelector('[data-featured-status]').textContent = note.tag;
  featuredNote.querySelector('[data-featured-title]').textContent = note.title;
  featuredNote.querySelector('[data-featured-copy]').textContent = note.copy;
  featuredNote.querySelector('[data-featured-link]').href = `/thoughts.html#${note.id}`;
}

const airphotoVideo = document.querySelector('.airphoto-video');
const airphotoSource = airphotoVideo?.querySelector('source[data-src]');
if (airphotoVideo && airphotoSource && !reducedMotion) {
  const startAirphotoVideo = () => {
    if (!airphotoSource.src) {
      airphotoSource.src = airphotoSource.dataset.src;
      airphotoVideo.load();
    }
    airphotoVideo.play().catch(() => {});
  };

  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startAirphotoVideo();
      else airphotoVideo.pause();
    }, { rootMargin: '200px 0px' });
    videoObserver.observe(airphotoVideo);
  } else {
    startAirphotoVideo();
  }
}
