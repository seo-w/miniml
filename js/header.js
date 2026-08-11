(function () {
    var headerPopup = document.querySelector('.header-popup');
    if (!headerPopup) { return; }

    /*
      .open-header-popup / .close-header-popup quedan en el <ul> contenedor
      del icons.module (viene de advance.classes) — el <button> real que
      recibe foco/teclado está adentro (.icons__anchor). El click sigue
      escuchándose en el contenedor (un click/Enter en el botón burbujea
      igual hasta ahí), pero aria-expanded tiene que ir en el botón real.
    */
    var openContainers = document.querySelectorAll('.open-header-popup');
    var closeContainers = document.querySelectorAll('.close-header-popup');
    var toggleButtons = document.querySelectorAll('.open-header-popup .icons__anchor, .close-header-popup .icons__anchor');

    function setOpen(isOpen) {
        headerPopup.classList.toggle('header-popup__active', isOpen);
        toggleButtons.forEach(function (btn) {
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    openContainers.forEach(function (el) {
        el.addEventListener('click', function () { setOpen(true); });
    });

    closeContainers.forEach(function (el) {
        el.addEventListener('click', function () { setOpen(false); });
    });
})();
