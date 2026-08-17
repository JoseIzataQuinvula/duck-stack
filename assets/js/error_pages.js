/**
 * 404.js - VersÃ£o Duck Stack Ultra (Clean URLs Corrigida)
 * Desenvolvido para: JosÃ© Izata Quinvula
 */

window.isRedirecting = false;
let isInteracting = false;

const extensoesVerificaveis = ['.zip', '.exe', '.pdf', '.rar', '.7z', '.html', '.php'];

/**
 * Remove visualmente o .html da barra de endereÃ§os
 * Corrigido: Se for index.html, limpa para a raiz "/" para evitar erro de Ã­ndice
 */
function cleanVisualURL() {
    // CORREÃ‡ÃƒO: Pulamos a manipulaÃ§Ã£o de histÃ³rico se estivermos no protocolo file://
    // pois o browser bloqueia replaceState em origens locais por seguranÃ§a.
    if (window.location.protocol === 'file:') return;

    const path = window.location.pathname;
    const hash = window.location.hash;

    let newUrl = path;
    if (path.endsWith('index.html') || path.endsWith('/index')) {
        newUrl = path.replace(/index(\.html)?$/, '');
    } else if (path.endsWith('.html')) {
        newUrl = path.replace(/\.html$/, '');
    }

    if (hash) {
        setTimeout(() => {
            window.history.replaceState(null, '', newUrl);
        }, 50);
    } else {
        window.history.replaceState(null, '', newUrl);
    }
}

/**
 * Redireciona para a pÃ¡gina 404 corrigindo o caminho para GitHub Pages
 */
function redirectToError(currentSectionId = null) {
    if (window.isRedirecting) return;
    window.isRedirecting = true;

    sessionStorage.setItem('voltandoDeErro', 'true');

    // ConstrÃ³i a URL de retorno com o hash da secÃ§Ã£o, se existir
    let returnUrl = window.location.href.split('#')[0];
    const sectionHash = currentSectionId ? `#${currentSectionId}` : window.location.hash;

    sessionStorage.setItem('url_retorno', returnUrl + sectionHash);

    const path = window.location.pathname;
    const isInsidePages = path.includes('/views/');

    if (isInsidePages) {
        window.location.href = "404.html";
    } else {
        window.location.href = "views/404.html";
    }
}

/* --- Listener de Cliques e ValidaÃ§Ã£o de Links --- */
document.addEventListener('click', async (e) => {
    const link = e.target.closest('a');

    if (!link) return;
    const href = link.getAttribute('href');

    if (!href || href.startsWith('javascript:')) return;
    if (link.id === 'goBackBtn' || link.classList.contains('btn-top')) return;

    isInteracting = true;

    // Encontra a secÃ§Ã£o atual para o caso de erro
    const secaoPai = link.closest('section[id], article[id]');
    const sectionId = secaoPai ? secaoPai.id : null;

    // Links Vazios
    if (href === "#" || href.trim() === "") {
        e.preventDefault();
        return redirectToError(sectionId);
    }

    // Ã‚ncoras
    if (href.startsWith('#')) {
        const targetExists = document.querySelector(href);
        if (!targetExists) {
            e.preventDefault();
            return redirectToError(sectionId);
        }
        return;
    }

    const ehLinkInterno = !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:');

    if (ehLinkInterno) {
        const ehPasta = href.endsWith('/') || href.includes('assets/projects');
        if (ehPasta) {
            e.preventDefault();
            return redirectToError(sectionId);
        }

        const temExtensao = extensoesVerificaveis.some(ext => href.toLowerCase().endsWith(ext));

        // CORREÃ‡ÃƒO: NÃ£o fazemos fetch se estivermos localmente (file://) ou se for um ficheiro .html direto
        if (temExtensao || !href.includes('.')) {
            if (window.location.protocol === 'file:' || href.endsWith('.html')) {
                return; // Deixa o browser seguir o link normalmente
            }

            e.preventDefault();
            try {
                const response = await fetch(href, { method: 'HEAD' });
                if (!response.ok) {
                    redirectToError(sectionId);
                } else {
                    window.location.href = href;
                }
            } catch (err) {
                redirectToError(sectionId);
            }
        }
    }

    setTimeout(() => { isInteracting = false; }, 1000);
});

/**
 * Valida links de download e redireciona para a pÃ¡gina apropriada
 * Chamada explicitamente pelo HTML (ex: onclick="validarLink(event, this)").
 */
window.validarLink = function (event, element) {
    if (!element) return;
    const href = element.getAttribute('href');

    // Se o link for nulo, apenas #, ou vazio
    if (!href || href === "#" || href.trim() === "") {
        event.preventDefault();
        event.stopPropagation();
        
        let type = 'conteÃºdo';
        const html = element.innerHTML.toLowerCase();
        const title = (element.getAttribute('title') || '').toLowerCase();
        
        if (html.includes('demo') || html.includes('fa-external-link-alt')) type = 'demo';
        else if (html.includes('cÃ³digo') || html.includes('c&oacute;digo') || html.includes('fa-github')) type = 'cÃ³digo';
        else if (html.includes('baixar') || html.includes('download') || html.includes('fa-download') || title.includes('baixar')) type = 'download';

        const secaoPai = element.closest('section[id], article[id]');
        redirectToUnavailable(secaoPai ? secaoPai.id : null, type);
    }
};

function redirectToUnavailable(currentSectionId, type) {
    if (window.isRedirecting) return;
    window.isRedirecting = true;
    sessionStorage.setItem('voltandoDeErro', 'true');

    let returnUrl = window.location.href.split('#')[0];
    const sectionHash = currentSectionId ? `#${currentSectionId}` : window.location.hash;
    sessionStorage.setItem('url_retorno', returnUrl + sectionHash);

    const path = window.location.pathname;
    const isInsidePages = path.includes('/views/');
    
    sessionStorage.setItem('tipo_indisponivel', type);

    if (isInsidePages) {
        window.location.href = `503.html?tipo=${type}`;
    } else {
        window.location.href = `views/503.html?tipo=${type}`;
    }
}

/* --- Observer para scroll (Atualiza URL sem .html e sem index) --- */
const sectionObserver = new IntersectionObserver((entries) => {
    const path = window.location.pathname;
    if (path.includes('todos-projetos') || path.includes('404') || window.isRedirecting || isInteracting) return;

    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const sectionId = entry.target.id;

            // CORREÃ‡ÃƒO: Garante que ao rolar a pÃ¡gina, o "index" nÃ£o volte para a URL
            // const cleanPath = window.location.pathname.replace(/index(\.html)?$/, '').replace(/\.html$/, '');
            // window.history.replaceState({ section: sectionId }, '', cleanPath + '#' + sectionId);

            // Salva a URL com o hash no sessionStorage, permitindo voltar exatamente para aqui
            const baseUrl = window.location.href.split('#')[0];
            sessionStorage.setItem('url_retorno', baseUrl + '#' + sectionId);
        }
    });
}, { rootMargin: '-20% 0px -20% 0px', threshold: [0.6] });

/* --- InicializaÃ§Ã£o --- */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Limpa a URL imediatamente
    cleanVisualURL();

    // 2. Configura o botÃ£o de voltar
    const goBackBtn = document.getElementById('goBackBtn');
    if (goBackBtn) {
        goBackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const urlSalva = sessionStorage.getItem('url_retorno');

            if (urlSalva && !urlSalva.includes('404')) {
                window.location.href = urlSalva;
            } else {
                const path = window.location.pathname;
                window.location.href = path.includes('/views/') ? "../" : "./";
            }
        });
    }

    // 3. Ativa o Observer apenas na Home
    const path = window.location.pathname;
    const isHome = !path.includes('todos-projetos') && !path.includes('404');

    if (isHome) {
        document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
    }
});

