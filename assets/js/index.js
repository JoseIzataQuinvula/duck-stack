const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const icon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');

        // Fecha o menu mobile se estiver aberto independentemente do link
        navLinks.classList.remove('active');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');

        // Se o link for APENAS uma âncora para a mesma página (ex: "#sobre")
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault(); // Previne a mudança do URL

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
        // CASO CONTRÁRIO (ex: "../index.html#sobre"):
        // O navegador segue o link normalmente para a outra página
    });
});

/* --- LÓGICA DE CARROSSEL PARA MOBILE (Empresas & Projetos) --- */
function setupMobileCarousel(gridSelector, paginationId, cardSelector, dotClass, maxItems) {
    const grid = document.querySelector(gridSelector);
    const pagination = document.getElementById(paginationId);
    
    // Como a secção de projetos pode estar noutra página, if (!grid) cancelamos
    if (!grid || !pagination) return;
    
    // NOTA: Para projetos a classe base na listagem do index.html é .projects-grid > .project-card
    // Porém nos repositórios também existe .project-card
    // Podemos selecionar apenas os cartões DENTRO da grid específica
    const cards = grid.querySelectorAll(cardSelector);
    if (cards.length === 0) return;

    function initCarousel() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            pagination.style.display = 'flex';
            pagination.innerHTML = '';
            
            const numDots = Math.min(cards.length, maxItems);
            
            for (let i = 0; i < numDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add(dotClass);
                dot.setAttribute('aria-label', `Ir para item ${i+1}`);
                if (i === 0) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    const scrollPos = cards[i].offsetLeft - grid.offsetLeft - 15;
                    grid.scrollTo({ left: scrollPos, behavior: 'smooth' });
                });
                
                pagination.appendChild(dot);
            }

            grid.addEventListener('scroll', () => {
                const scrollCenter = grid.scrollLeft + (grid.clientWidth / 2);
                let closestIndex = 0;
                let closestDist = Infinity;

                for (let i = 0; i < numDots; i++) {
                    const cardCenter = (cards[i].offsetLeft - grid.offsetLeft) + (cards[i].offsetWidth / 2);
                    const dist = Math.abs(scrollCenter - cardCenter);
                    if (dist < closestDist) {
                        closestDist = dist;
                        closestIndex = i;
                    }
                }

                const dots = pagination.querySelectorAll('.' + dotClass);
                dots.forEach((d, idx) => {
                    d.classList.toggle('active', idx === closestIndex);
                });
            });
        } else {
            pagination.style.display = 'none';
            pagination.innerHTML = '';
        }
    }

    initCarousel();
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initCarousel, 150);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Carrossel de Empresas
    setupMobileCarousel('.companies-grid', 'companiesPagination', '.company-card', 'company-dot', 2);
    
    // 2. Carrossel de Projetos
    setupMobileCarousel('.projects-grid', 'projectsPagination', '.project-card', 'project-dot', 3);

    // 3. Hover na imagem → troca o nome para DUCK STACK
    const sobreImg = document.querySelector('.sobre-img');
    const sobreGrid = document.querySelector('.sobre-grid');
    if (sobreImg && sobreGrid) {
        sobreImg.addEventListener('mouseenter', () => sobreGrid.classList.add('img-hovered'));
        sobreImg.addEventListener('mouseleave', () => sobreGrid.classList.remove('img-hovered'));
    }
});