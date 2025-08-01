document.addEventListener('DOMContentLoaded', function() {
    try {
        
        // --- Formulário de Contato com Feedback Aprimorado ---
        const form = document.querySelector('.contact-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const button = form.querySelector('button');
                const status = document.createElement('p');
                status.className = 'form-status'; // Você pode estilizar esta classe se quiser
                if (!form.querySelector('.form-status')) {
                    form.appendChild(status);
                }

                button.textContent = 'Enviando...';
                button.disabled = true;
                status.textContent = '';

                const data = new FormData(form);
                fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        status.textContent = "Obrigado pelo seu contato!";
                        status.style.color = 'green';
                        form.reset();
                    } else {
                        status.textContent = "Oops! Houve um problema ao enviar seu formulário.";
                        status.style.color = 'red';
                    }
                    button.textContent = 'Enviar';
                    button.disabled = false;
                }).catch(error => {
                    status.textContent = "Oops! Houve um problema ao enviar seu formulário.";
                    status.style.color = 'red';
                    button.textContent = 'Enviar';
                    button.disabled = false;
                });
            });
        }
        
        // --- Hamburger Menu Logic ---
        const hamburgerBtn = document.getElementById('hamburger-menu');
        const mainNav = document.getElementById('main-nav');

        if (hamburgerBtn && mainNav) {
            hamburgerBtn.addEventListener('click', function() {
                mainNav.classList.toggle('open');
                document.body.classList.toggle('no-scroll'); // Trava/destrava o scroll do body
                // Toggle icon
                const icon = hamburgerBtn.querySelector('i');
                if (mainNav.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });

            // Fecha o menu ao clicar em um link da navegação (em telas móveis)
            mainNav.addEventListener('click', function(e) {
                if (e.target.tagName === 'A' && mainNav.classList.contains('open')) {
                    hamburgerBtn.click(); // Simula um clique no botão para fechar
                }
            });
        }
        // --- Sticky Header on Scroll ---
        const header = document.querySelector('.main-header');
        if (header) {
            window.addEventListener('scroll', function() {
                // Adiciona a classe 'scrolled' ao header se a rolagem for maior que 50px
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        // --- Botão Voltar ao Topo ---
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) { // Mostra o botão após rolar 300px
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            backToTopBtn.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Rolagem suave para o topo
            });
        }

        // --- Rolagem Suave para Âncoras ---
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 100; // Altura do header fixo
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    // Close menu after clicking a link (for mobile)
                    if (mainNav && mainNav.classList.contains('open')) {
                        mainNav.classList.remove('open');
                        hamburgerBtn.querySelector('i').classList.remove('fa-times');
                        hamburgerBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            });
        });

        // --- Ano Dinâmico no Rodapé ---
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }

        // --- Animação de Fade-in ao Rolar ---
        const sections = document.querySelectorAll('.fade-in-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => observer.observe(section));

    } catch (error) {
        console.error("Ocorreu um erro em main.js, mas a execução continuará:", error);
    }
});

/**
 * Exibe uma notificação toast na tela.
 * @param {string} message A mensagem a ser exibida.
 * @param {string} type O tipo de notificação ('info', 'success', 'error').
 * @param {number} duration A duração em milissegundos.
 */
function showToast(message, type = 'info', duration = 4000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Adiciona a classe 'show' para ativar a animação de entrada
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Remove o toast após a duração especificada
    setTimeout(() => {
        toast.classList.remove('show');
        toast.addEventListener('transitionend', () => toast.remove());
    }, duration);
}