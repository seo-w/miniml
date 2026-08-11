document.querySelectorAll('.vertical-menu__sub-icon').forEach(function (icon) {
    icon.addEventListener('click', function () {
        var state = this.getAttribute('data-state');
        var parentElement = this.closest('.vertical-menu__item');

        if (state == 'disabled') {
            if (parentElement) { parentElement.classList.add('vertical-menu__item--active'); }
            this.setAttribute('data-state', 'active');
        } else {
            if (parentElement) { parentElement.classList.remove('vertical-menu__item--active'); }
            this.setAttribute('data-state', 'disabled');
        }
    });
});
