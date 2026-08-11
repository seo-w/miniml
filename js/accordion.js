/*
  Reemplaza a library/accordionjs.
  - Un solo panel abierto a la vez (closeOther).
  - Clic en el panel abierto lo cierra (a diferencia de la librería
    original, que no dejaba cerrar el único abierto — decisión explícita
    del usuario de cambiar ese comportamiento).
  - El primer panel viene abierto por default (server-rendered con
    acc_active en modules/accordion.module/module.html).
*/
(function () {
    function getSections(accordion) {
        return Array.prototype.filter.call(accordion.children, function (el) {
            return el.classList.contains('acc_section');
        });
    }

    function openSection(section) {
        var head = section.querySelector('.acc_head');
        var content = section.querySelector('.accordion__content');
        section.classList.add('acc_active');
        if (head) { head.setAttribute('aria-expanded', 'true'); }
        if (content) { content.style.maxHeight = content.scrollHeight + 'px'; }
    }

    function closeSection(section) {
        var head = section.querySelector('.acc_head');
        var content = section.querySelector('.accordion__content');
        section.classList.remove('acc_active');
        if (head) { head.setAttribute('aria-expanded', 'false'); }
        if (content) { content.style.maxHeight = '0px'; }
    }

    document.querySelectorAll('.accordionjs').forEach(function (accordion) {
        var sections = getSections(accordion);

        sections.forEach(function (section) {
            var content = section.querySelector('.accordion__content');
            if (!content) { return; }
            content.style.maxHeight = section.classList.contains('acc_active') ? content.scrollHeight + 'px' : '0px';
        });

        accordion.addEventListener('click', function (e) {
            var head = e.target.closest('.acc_head');
            if (!head || !accordion.contains(head)) { return; }

            var section = head.closest('.acc_section');
            if (!section) { return; }

            var isOpen = section.classList.contains('acc_active');
            if (isOpen) {
                closeSection(section);
                return;
            }

            sections.forEach(function (sibling) {
                if (sibling !== section && sibling.classList.contains('acc_active')) {
                    closeSection(sibling);
                }
            });
            openSection(section);
        });
    });

    window.addEventListener('resize', function () {
        document.querySelectorAll('.acc_section.acc_active .accordion__content').forEach(function (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
        });
    });
})();
