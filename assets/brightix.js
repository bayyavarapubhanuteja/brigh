/* Brightix — shared behaviour: nav dropdown, scroll reveal, pointer parallax, counters */
(function () {
  const ready = (fn) =>
    document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

  ready(() => {
    /* --- About Us dropdown --- */
    const trigger = document.querySelector('[data-bx-dropdown-trigger]');
    const menu = document.querySelector('[data-bx-dropdown-menu]');
    if (trigger && menu) {
      const open = (state) => {
        menu.classList.toggle('opacity-0', !state);
        menu.classList.toggle('invisible', !state);
        menu.classList.toggle('translate-y-2', !state);
        trigger.setAttribute('aria-expanded', String(state));
      };
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        open(menu.classList.contains('invisible'));
      });
      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !trigger.contains(e.target)) open(false);
      });
      document.addEventListener('keydown', (e) => e.key === 'Escape' && open(false));
    }

    /* --- mobile nav --- */
    const burger = document.querySelector('[data-bx-burger]');
    const mobile = document.querySelector('[data-bx-mobile]');
    if (burger && mobile) burger.addEventListener('click', () => mobile.classList.toggle('hidden'));

    /* --- placeholder links (Services / IT Solutions / Book a Demo) --- */
    document.querySelectorAll('[data-bx-soon]').forEach((el) =>
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const toast = document.querySelector('[data-bx-toast]');
        if (!toast) return;
        toast.textContent = `“${el.dataset.bxSoon}” is planned for a later phase of the prototype.`;
        toast.classList.remove('opacity-0', 'translate-y-4');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4'), 2600);
      })
    );

    /* --- navbar solidify on scroll --- */
    const nav = document.querySelector('[data-bx-nav]');
    if (nav) {
      const onScroll = () => nav.classList.toggle('bx-nav-solid', window.scrollY > 24);
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* --- scroll reveal --- */
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -60px' }
    );
    document.querySelectorAll('.bx-reveal').forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 90}ms`;
      io.observe(el);
    });

    /* --- pointer parallax on 3D scenes --- */
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      const scenes = [...document.querySelectorAll('[data-bx-parallax]')];
      if (scenes.length) {
        window.addEventListener('pointermove', (e) => {
          const rx = (e.clientY / window.innerHeight - 0.5) * -14;
          const ry = (e.clientX / window.innerWidth - 0.5) * 18;
          scenes.forEach((s) => (s.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`));
        });
      }
    }

    /* --- animated counters --- */
    const cio = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const el = en.target;
          const target = parseFloat(el.dataset.bxCount);
          const dur = 1400;
          const t0 = performance.now();
          const step = (t) => {
            const p = Math.min((t - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = (target % 1 ? (target * eased).toFixed(1) : Math.round(target * eased)).toString();
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          cio.unobserve(el);
        }),
      { threshold: 0.6 }
    );
    document.querySelectorAll('[data-bx-count]').forEach((el) => cio.observe(el));
  });
})();
