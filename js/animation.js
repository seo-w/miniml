function animationMin(selector, transitionClass){
    let observer = new IntersectionObserver((idSelector) => {
        if(idSelector[0].isIntersecting){
            let animationId = idSelector[0].target;
            animationId.classList.add('animate__animated', transitionClass);
        }
    })
    observer.observe(selector);
}