// ========================
// INIT — DOMContentLoaded
// ========================
document.addEventListener('DOMContentLoaded', () => {

// ========================
// THEME TOGGLE — DARK / LIGHT MODE
// ========================
const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ========================
// NAVBAR — SCROLL + HAMBURGER
// ========================
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
}

hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') && !navbar.contains(e.target)) closeMenu();
});

// ========================
// SMOOTH SCROLL WITH OFFSET
// ========================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

// ========================
// ACTIVE LINK ON SCROLL
// ========================
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinkEls.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(section => sectionObserver.observe(section));

// ========================
// SCROLL REVEAL
// ========================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ========================
// SCROLL REVEAL — STAGGERED GROUPS
// ========================
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            staggerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal-group').forEach(group => {
    group.querySelectorAll('.reveal-item').forEach((item, i) => {
        item.style.setProperty('--stagger', i);
    });
    staggerObserver.observe(group);
});

// ========================
// STATS COUNTER
// ========================
const counters     = document.querySelectorAll('.stat-number');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCounter(el) {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
        el.textContent = target + suffix;
        return;
    }
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => statsObserver.observe(c));

}); // end DOMContentLoaded
