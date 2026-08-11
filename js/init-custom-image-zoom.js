document.addEventListener('DOMContentLoaded', function () {
    if (window.hsInEditor) { return; }
    new Zooming({}).listen('.custom-image__zoomable')
})