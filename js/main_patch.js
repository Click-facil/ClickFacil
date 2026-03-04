/* =========================================
   CLICK FÁCIL — JS ENHANCEMENT PATCH v2
   Adicione este script após main.js no index.html:
   <script src="js/main_patch.js"></script>
   ========================================= */

(function() {
  'use strict';

  // ---- Sticky Header with scroll detection ----
  const header = document.querySelector('.main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ---- Scroll progress indicator (linha fina no topo) ----
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'height:2px', 'width:0%',
    'background:linear-gradient(90deg,#00e5ff,#3b82f6)',
    'z-index:10000', 'transition:width 0.1s linear', 'pointer-events:none'
  ].join(';');
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = ((window.scrollY / docH) * 100) + '%';
  }, { passive: true });

  // ---- Parallax-lite no Hero ----
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        const heroContent = heroSection.querySelector('.hero-content');
        if (heroContent) {
          heroContent.style.transform = 'translateY(' + (scrolled * 0.1) + 'px)';
        }
      }
    }, { passive: true });
  }

  // ---- Magnetic effect nos botões CTA ----
  function addMagneticEffect(selector) {
    document.querySelectorAll(selector).forEach(btn => {
      btn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = 'translateY(-3px) translate(' + (x * 0.06) + 'px,' + (y * 0.06) + 'px)';
      });
      btn.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }
  addMagneticEffect('.contact-button-big');
  addMagneticEffect('.saiba-mais.whatsapp-button');

  // ---- Cursor glow suave (só desktop) ----
  if (window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = [
      'position:fixed', 'width:400px', 'height:400px', 'border-radius:50%',
      'background:radial-gradient(circle,rgba(0,229,255,0.035) 0%,transparent 70%)',
      'pointer-events:none', 'z-index:0', 'top:0', 'left:0',
      'transform:translate(-50%,-50%)', 'will-change:left,top'
    ].join(';');
    document.body.appendChild(glow);

    let mX = 0, mY = 0, gX = 0, gY = 0;
    document.addEventListener('mousemove', e => { mX = e.clientX; mY = e.clientY; });

    (function animGlow() {
      gX += (mX - gX) * 0.07;
      gY += (mY - gY) * 0.07;
      glow.style.left = gX + 'px';
      glow.style.top  = gY + 'px';
      requestAnimationFrame(animGlow);
    })();
  }

  // ---- Números animados (quando entram na viewport) ----
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count') || el.textContent, 10);
    if (isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();
    (function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    })(start);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  // ---- Card tilt suave 3D ----
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.bento-card, .project-card, .blog-card').forEach(card => {
      card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width - 0.5;
        const yPct = (e.clientY - rect.top) / rect.height - 0.5;
        this.style.transform = 'translateY(-6px) rotateX(' + (-yPct * 4) + 'deg) rotateY(' + (xPct * 4) + 'deg) scale(1.01)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = '';
      });
    });
  }

})();