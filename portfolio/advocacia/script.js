const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

// Seleciona tudo que deve "revelar"
document.querySelectorAll('.hero-content, .hero-image, .manifesto-grid, .service-panel, h2').forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
});