/*
  Carrusel vanilla — reemplaza library/slick. Se llama una vez por instancia
  desde modules/helpers.html (macro slider_min) o directamente desde
  modules/slider.module/module.html.

  El número de slides visibles por breakpoint lo controla el CSS que genera
  slider_min (flex-basis en .carousel__slide) — este JS solo maneja
  navegación (flechas/puntos/teclado), autoplay, y loop, más el ancho de
  "cuántos slides saltar" por click, que sí necesita conocer el campo
  scroll.desktop/tablet/phone del editor.
*/
window.initCarousel = function (container, options) {
    if (!container) { return; }
    options = Object.assign({
        infinite: false,
        showDots: false,
        autoplay: false,
        autoplaySpeed: 3000,
        scrollByDesktop: 1,
        scrollByTablet: 1,
        scrollByPhone: 1,
        tabletBreakpoint: 992,
        phoneBreakpoint: 768
    }, options || {});

    var track = container.querySelector('.carousel__track');
    if (!track) { return; }

    var slides = Array.prototype.slice.call(track.children);
    slides.forEach(function (slide) { slide.classList.add('carousel__slide'); });
    if (!slides.length) { return; }

    var dotsContainer = container.querySelector('.carousel__dots');
    var dots = [];
    var currentIndex = 0;

    function getScrollBy() {
        if (window.matchMedia('(max-width:' + options.phoneBreakpoint + 'px)').matches) { return options.scrollByPhone; }
        if (window.matchMedia('(max-width:' + options.tabletBreakpoint + 'px)').matches) { return options.scrollByTablet; }
        return options.scrollByDesktop;
    }

    function getVisibleCount() {
        var slideWidth = slides[0].offsetWidth;
        if (!slideWidth) { return slides.length; }
        return Math.max(1, Math.round(track.clientWidth / slideWidth));
    }

    function setActiveDot(slideIndex) {
        if (!dots.length) { return; }
        var dotIndex = Math.min(dots.length - 1, Math.round(slideIndex / getScrollBy()));
        dots.forEach(function (dot, i) { dot.classList.toggle('carousel__dot--active', i === dotIndex); });
    }

    function buildDots() {
        if (!dotsContainer || !options.showDots) { return; }
        dotsContainer.innerHTML = '';
        dots = [];
        var visible = getVisibleCount();
        var by = getScrollBy();
        var pages = slides.length <= visible ? 0 : Math.ceil((slides.length - visible) / by) + 1;
        for (var i = 0; i < pages; i++) {
            var dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel__dot';
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', (function (startIndex) { return function () { scrollToSlide(startIndex); }; })(i * by));
            dotsContainer.appendChild(dot);
            dots.push(dot);
        }
        setActiveDot(currentIndex);
    }

    function scrollToSlide(index) {
        if (options.infinite) {
            index = ((index % slides.length) + slides.length) % slides.length;
        } else {
            index = Math.max(0, Math.min(index, slides.length - 1));
        }
        currentIndex = index;
        track.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        setActiveDot(index);
    }

    buildDots();

    /*
      resize reconstruye el DOM de los dots y lee offsetWidth/clientWidth
      (layout forzado). resize dispara en ráfaga al arrastrar la ventana, al
      rotar el móvil y al abrir el teclado virtual, así que va con debounce.
    */
    var resizeTimer = null;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildDots, 150);
    });

    /*
      passive: el handler no llama preventDefault, y decírselo al navegador le
      deja optimizar el scroll. Throttle con rAF: sin esto el loop O(n) sobre
      los slides más el toggle de clases corría en cada evento de scroll
      (~cada frame durante el scroll suave y el swipe).
    */
    var scrollScheduled = false;
    track.addEventListener('scroll', function () {
        if (scrollScheduled) { return; }
        scrollScheduled = true;
        requestAnimationFrame(function () {
            scrollScheduled = false;
            var left = track.scrollLeft;
            var nearest = 0;
            for (var i = 1; i < slides.length; i++) {
                if (Math.abs(slides[i].offsetLeft - left) < Math.abs(slides[nearest].offsetLeft - left)) { nearest = i; }
            }
            currentIndex = nearest;
            setActiveDot(nearest);
        });
    }, { passive: true });

    var prevBtn = container.querySelector('.carousel__arrow--prev');
    var nextBtn = container.querySelector('.carousel__arrow--next');
    if (prevBtn) { prevBtn.addEventListener('click', function () { scrollToSlide(currentIndex - getScrollBy()); }); }
    if (nextBtn) { nextBtn.addEventListener('click', function () { scrollToSlide(currentIndex + getScrollBy()); }); }

    if (options.autoplay) {
        var intervalId = null;
        function start() { intervalId = setInterval(function () { scrollToSlide(currentIndex + getScrollBy()); }, options.autoplaySpeed); }
        function stop() { clearInterval(intervalId); }
        start();
        container.addEventListener('mouseenter', stop);
        container.addEventListener('mouseleave', start);
        container.addEventListener('focusin', stop);
        container.addEventListener('focusout', start);
    }
};
