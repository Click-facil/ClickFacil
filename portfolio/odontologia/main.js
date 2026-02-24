document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar scroll ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // --- Hamburger / Mobile Nav ---
    const hamburger = document.getElementById('hamburger-menu');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-cta');

    function openMenu() {
        overlay.classList.add('active');
        hamburger.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        overlay.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', () => {
        overlay.classList.contains('active') ? closeMenu() : openMenu();
    });

    closeBtn?.addEventListener('click', closeMenu);

    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') { e.preventDefault(); return; }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // --- Fade-in on Scroll ---
    const fadeEls = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach(el => observer.observe(el));

    // Fallback
    setTimeout(() => {
        fadeEls.forEach(el => {
            if (!el.classList.contains('visible')) {
                el.classList.add('visible');
            }
        });
    }, 1800);

    // --- Swiper ---
    new Swiper('.testimonial-slider', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        slidesPerView: 1,
        spaceBetween: 24,
    });

});