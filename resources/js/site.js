import Alpine from 'alpinejs';

window.Alpine = Alpine;
Alpine.start();

// Hero slider del home
function initHeroSlider() {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    if (slides.length === 0) return;

    const titleEl = document.querySelector('[data-hero-title]');
    const subtitleEl = document.querySelector('[data-hero-subtitle]');
    const dotsContainer = document.querySelector('[data-hero-dots]');
    const prevBtn = document.querySelector('[data-hero-prev]');
    const nextBtn = document.querySelector('[data-hero-next]');
    const baseTitle = titleEl ? titleEl.textContent.trim() : '';
    const baseSubtitle = subtitleEl ? subtitleEl.textContent.trim() : '';
    const interval = 4000;

    let current = 0;
    let timer = null;
    const dots = [];

    function setText(el, text) {
        if (!el) return;
        el.style.opacity = '0';
        setTimeout(() => {
            el.textContent = text;
            el.style.opacity = '1';
        }, 250);
    }

    function go(i) {
        if (i === current) return;
        slides[current].classList.remove('is-active');
        if (dots[current]) dots[current].classList.remove('is-active');
        current = i;
        slides[current].classList.add('is-active');
        if (dots[current]) dots[current].classList.add('is-active');
        setText(titleEl, slides[current].dataset.title || baseTitle);
        setText(subtitleEl, slides[current].dataset.subtitle || baseSubtitle);
    }

    function next() {
        go((current + 1) % slides.length);
    }

    function prev() {
        go((current - 1 + slides.length) % slides.length);
    }

    function start() {
        if (slides.length <= 1) return;
        stop();
        timer = setInterval(next, interval);
    }

    function stop() {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }

    // Crear dots (solo si hay más de 1 slide)
    if (slides.length > 1 && dotsContainer) {
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
            dot.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
            dot.addEventListener('click', () => {
                go(i);
                start(); // reinicia el timer al interactuar
            });
            dotsContainer.appendChild(dot);
            dots.push(dot);
        });
    }

    // Flechas
    if (slides.length > 1) {
        if (prevBtn) {
            prevBtn.addEventListener('click', () => { prev(); start(); });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => { next(); start(); });
        }
    } else {
        // Si no hay rotación posible, escondé las flechas
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }

    // Activar primer slide y dar el control a JS
    slides[0].classList.add('is-active');
    slider.classList.add('is-ready');
    const firstTitle = slides[0].dataset.title;
    const firstSubtitle = slides[0].dataset.subtitle;
    if (firstTitle && titleEl) titleEl.textContent = firstTitle;
    if (firstSubtitle && subtitleEl) subtitleEl.textContent = firstSubtitle;

    // Pausar autoplay si la pestaña queda en background
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else start();
    });

    start();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSlider);
} else {
    initHeroSlider();
}
