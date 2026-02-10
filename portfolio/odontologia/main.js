document.addEventListener('DOMContentLoaded', () => {

    // Adiciona uma classe ao HTML para indicar que o JS foi carregado
    document.documentElement.classList.add('js-loaded');

    // 1. Lógica do Menu Hamburger
    const hamburger = document.getElementById('hamburger-menu');
    const navWrapper = document.getElementById('nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navWrapper) {
        hamburger.addEventListener('click', () => {
            navWrapper.classList.toggle('active');
            
            // Alterna ícone do hamburger
            const icon = hamburger.querySelector('i');
            icon?.classList.toggle('fa-bars');
            icon?.classList.toggle('fa-times');
        });

        // Fecha menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Apenas fecha se o menu estiver ativo
                if (navWrapper.classList.contains('active')) {
                    hamburger.click(); // Simula o clique no hamburger para fechar e trocar o ícone
                }
            });
        });
    }

    // Navbar com efeito ao scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adiciona a classe 'scrolled' após 50px de rolagem
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ========================================
    // SMOOTH SCROLL para links internos
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignora se for apenas "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const offsetTop = target.offsetTop - 80; // 80px de offset para a navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // ANIMAÇÃO AO SCROLL (Intersection Observer)
    // ========================================
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('is-animated'); // Adiciona uma classe para marcar que foi animado
                observer.unobserve(entry.target); // Opcional: para a animação acontecer só uma vez
            }
        });
    }, { threshold: 0.1, rootMargin: '0px' }); // A animação começa quando 10% do elemento está visível, com rootMargin 0px

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Fallback para garantir visibilidade caso IntersectionObserver não dispare
    setTimeout(() => {
        animatedElements.forEach(el => {
            // Se o elemento ainda está invisível e não foi marcado como animado pelo observer
            if (window.getComputedStyle(el).opacity === '0' && !el.classList.contains('is-animated')) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }
        });
    }, 1500); // Dá 1.5 segundos para o observer agir antes de forçar a visibilidade

    // ========================================
    // SWIPER - Carrossel de Depoimentos
    // ========================================
    const testimonialSwiper = new Swiper('.testimonial-slider', {
        loop: true,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        slidesPerView: 1,
        spaceBetween: 30,
        breakpoints: {
            768: {
                slidesPerView: 1,
            },
            1024: {
                slidesPerView: 1,
            }
        }
    });

    // ========================================
    // Lógica do Acordeão (FAQ) para abrir um por vez
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item details');
    faqItems.forEach(item => {
        item.addEventListener('toggle', (event) => {
            if (item.open) {
                // Fecha todos os outros itens quando um é aberto
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.open) {
                        otherItem.removeAttribute('open');
                    }
                });
            }
        });
    });

    // ========================================
    // PREVENÇÃO DE SCROLL HORIZONTAL
    // ========================================
    function preventHorizontalScroll() {
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            window.clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (window.scrollX !== 0) { window.scrollTo(0, window.scrollY); }
            }, 50);
        });
    }
    preventHorizontalScroll();
    });
