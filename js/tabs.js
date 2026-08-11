document.querySelectorAll('.tab__item').forEach(function (item) {
    item.addEventListener('click', function () {
        var tabId = this.parentElement.getAttribute('data-tab-id');
        var tabIndex = this.getAttribute('data-index');

        document.querySelectorAll('ul[data-tab-id="' + tabId + '"] > .tab__item').forEach(function (el) {
            el.classList.remove('tab__item--active');
        });
        this.classList.add('tab__item--active');

        document.querySelectorAll('ul[data-tab-item-id="' + tabId + '"] > .tab-item__item').forEach(function (el) {
            el.classList.remove('tab-item__item--active');
        });
        var activeItem = document.querySelector('ul[data-tab-item-id="' + tabId + '"] > li[data-index="' + tabIndex + '"]');
        if (activeItem) { activeItem.classList.add('tab-item__item--active'); }
    });
});
