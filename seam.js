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

  // Icon hover glow: same easing and fade as the seam light, tracking the cursor in 2D.
  document.querySelectorAll('nav a').forEach(link => {
    let tx = 50, ty = 50, cx = 50, cy = 50, frame = 0, last = 0;
    function animate(time) {
      const dt = last ? Math.min(time - last, 50) : 16;
      last = time;
      const k = 1 - Math.exp(-dt / 110);
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      link.style.setProperty('--gx', cx + '%');
      link.style.setProperty('--gy', cy + '%');
      if (Math.abs(tx - cx) > .1 || Math.abs(ty - cy) > .1) frame = requestAnimationFrame(animate);
      else { frame = 0; last = 0; }
    }
    link.addEventListener('pointermove', event => {
      if (!enabled.matches || event.pointerType === 'touch') return;
      const r = link.getBoundingClientRect();
      tx = (event.clientX - r.left) / r.width * 100;
      ty = (event.clientY - r.top) / r.height * 100;
      link.classList.add('glow-active');
      if (!frame) frame = requestAnimationFrame(animate);
    }, { passive: true });
    link.addEventListener('pointerleave', () => link.classList.remove('glow-active'));
  });
})();
