document.addEventListener('DOMContentLoaded', () => {

    document.documentElement.classList.add('js-on');

    // ── Navbar scroll ──────────────────────────
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });

    // ── Hamburger / mobile nav ─────────────────
    const hamburger  = document.getElementById('hamburger-menu');
    const navWrapper = document.getElementById('nav-wrapper');

    hamburger?.addEventListener('click', () => {
        navWrapper.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon?.classList.toggle('fa-bars');
        icon?.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navWrapper.classList.contains('active')) hamburger.click();
        });
    });

    // ── Smooth scroll ──────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') { e.preventDefault(); return; }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 76, behavior: 'smooth' });
            }
        });
    });

    // ── Reveal genérico: [data-reveal] ─────────
    const reveals = document.querySelectorAll('[data-reveal]');
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('revealed');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObs.observe(el));
    setTimeout(() => reveals.forEach(el => el.classList.add('revealed')), 1800);

    // ── Especialidades: stagger de entrada ─────
    const espCards = document.querySelectorAll('.esp-card');
    const espObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const idx = [...espCards].indexOf(e.target);
                setTimeout(() => e.target.classList.add('in-view'), idx * 70);
                espObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    espCards.forEach(c => espObs.observe(c));
    setTimeout(() => espCards.forEach(c => c.classList.add('in-view')), 1800);

    // ── Swiper (depoimentos) ───────────────────
    new Swiper('.testimonial-slider', {
        loop: true,
        autoplay: { delay: 5500, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        slidesPerView: 1,
        spaceBetween: 24,
    });

});