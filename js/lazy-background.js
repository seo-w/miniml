/*
  Lazy-load opcional para background-image, para casos donde el fondo
  realmente conviene cargarlo así (ej. custom_section.module con overlay +
  degradado, donde no hay un <img> real que pueda usar loading="lazy" nativo).

  Es opt-in por instancia (campo "lazy_load_background" del módulo) — nunca
  se activa solo. Un único IntersectionObserver para toda la página: barato,
  no corre en cada scroll, se desconecta apenas carga cada elemento.
*/
window.lazyLoadBackground = function (el, desktopValue, mobileValue, mobileBreakpoint) {
    if (!el || !desktopValue) { return; }

    var observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) { return; }
            var isMobile = mobileBreakpoint && window.matchMedia('(max-width:' + mobileBreakpoint + 'px)').matches;
            entry.target.style.backgroundImage = (isMobile && mobileValue) ? mobileValue : desktopValue;
            obs.unobserve(entry.target);
        });
    }, { rootMargin: '200px 0px' });

    observer.observe(el);
};
