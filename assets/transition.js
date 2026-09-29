/* Brightix — page transition curtain. Loaded in <head> so it covers first paint. */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  const curtain = document.createElement('div');
  curtain.className = 'bx-curtain';
  curtain.innerHTML = '<div class="bx-curtain-mark"><span></span>BRIGHTIX</div>';
  document.documentElement.appendChild(curtain);

  const lift = () => {
    curtain.classList.add('is-open');
    setTimeout(() => curtain.classList.add('is-hidden'), 900);
    const main = document.querySelector('main');
    if (main) main.classList.add('bx-page-in');
  };

  if (document.readyState === 'complete') setTimeout(lift, 320);
  else window.addEventListener('load', () => setTimeout(lift, 320));

  /* drop the curtain before navigating to another page in the site */
  const drop = (href) => {
    curtain.classList.remove('is-hidden', 'is-open');
    curtain.style.transition = 'none';
    curtain.style.transform = 'translateY(-102%)';
    curtain.style.opacity = '1';
    void curtain.offsetHeight; // reflow
    curtain.style.transition = 'transform .55s cubic-bezier(.76,0,.24,1)';
    curtain.style.transform = 'translateY(0)';
    setTimeout(() => (window.location.href = href), 520);
  };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (a.hasAttribute('data-bx-soon') || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    drop(href);
  });

  /* coming back via history: make sure the curtain is not stuck down */
  window.addEventListener('pageshow', (ev) => {
    if (ev.persisted) lift();
  });
})();
