(() => {
  const light = document.querySelector('.seam-light');
  const enabled = matchMedia('(min-width: 801px) and (hover: hover) and (prefers-reduced-motion: no-preference)');
  let target = innerHeight / 2, current = target, frame = 0, last = 0;
  function animate(time) {
    const dt = last ? Math.min(time - last, 50) : 16;
    last = time;
    current += (target - current) * (1 - Math.exp(-dt / 110));
    light.style.setProperty('--light-y', `${current}px`);
    if (Math.abs(target - current) > .1) frame = requestAnimationFrame(animate);
    else { frame = 0; last = 0; }
  }
  document.addEventListener('pointermove', event => {
    if (!enabled.matches || event.pointerType === 'touch') return;
    target = event.clientY;
    light.classList.add('active');
    if (!frame) frame = requestAnimationFrame(animate);
  }, { passive: true });
  function hide() { light.classList.remove('active'); }
  document.documentElement.addEventListener('pointerleave', hide);
  window.addEventListener('blur', hide);
  enabled.addEventListener('change', hide);
})();
