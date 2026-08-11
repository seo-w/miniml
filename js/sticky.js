function stickyMin(id, class_fixed, initialPosition ) {

    if (window.hsInEditor) { return; }

    let element               = document.getElementById(id);
    let positionTop           = element.offsetTop;
    let width                 = element.parentElement.offsetWidth;

    if(window.scrollY >= positionTop) {
        element.style.width = width+'px' ;
        element.classList.add(class_fixed);
    } 
    if( window.scrollY < initialPosition ) {
        element.classList.remove(class_fixed);
    }

}