/**
 * components-loader.js
 * Carregador modular de componentes para o Duck Stack.
 */
document.addEventListener('DOMContentLoaded', async () => {
    const isInsidePages = window.location.pathname.includes('/views/');
    const prefix = isInsidePages ? '../../' : './';

    const components = [
        { id: 'component-header', file: 'src/components/header.html' },
        { id: 'component-sobre', file: 'src/components/sobre.html' },
        { id: 'component-skills', file: 'src/components/skills.html' },
        { id: 'component-projects', file: 'src/components/projects.html' },
        { id: 'component-trajetoria', file: 'src/components/trajetoria.html' },
        { id: 'component-contact', file: 'src/components/contact.html' },
        { id: 'component-footer', file: 'src/components/footer.html' },
        { id: 'component-modals', file: 'src/components/modals.html' }
    ];

    for (const comp of components) {
        const el = document.getElementById(comp.id);
        if (el) {
            try {
                const res = await fetch(prefix + comp.file);
                if (res.ok) {
                    el.innerHTML = await res.text();
                }
            } catch (e) {
                // Fallback local file://
            }
        }
    }

    if (isInsidePages) {
        const headerEl = document.getElementById('component-header');
        if (headerEl) {
            const logo = headerEl.querySelector('.logo');
            if (logo) {
                logo.href = '../../index.html';
                const logoImg = logo.querySelector('.logo-img');
                if (logoImg) logoImg.src = '../../duck-favicon.png';
            }
            headerEl.querySelectorAll('.nav-links a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    link.href = '../../index.html' + href;
                } else if (href === 'src/views/certificados.html') {
                    link.href = 'certificados.html';
                }
            });
        }
    }

    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (menuBtn && navLinks) {
        const icon = menuBtn.querySelector('i');

        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });
    }

    const sobreImg = document.querySelector('.sobre-img');
    const sobreGrid = document.querySelector('.sobre-grid');
    if (sobreImg && sobreGrid) {
        sobreImg.addEventListener('mouseenter', () => sobreGrid.classList.add('img-hovered'));
        sobreImg.addEventListener('mouseleave', () => sobreGrid.classList.remove('img-hovered'));
    }
});

function openLightbox(img) {
    const lightbox = document.getElementById('imgLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('imgLightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});
