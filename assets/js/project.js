/**
 * 3. PARTILHA E MODAL PERSONALIZADO
 * Sincronizado com Clean URLs e caminhos do GitHub Pages
 */

// Função para abrir e configurar os links do modal
// Função para abrir e configurar os links do modal
function openShareModal(title, url) {
    const modal = document.getElementById('shareModal');
    if (!modal) return;

    const titleEl = document.getElementById('shareProjectName');
    const inputEl = document.getElementById('shareLinkInput');
    if (titleEl) titleEl.innerText = title;

    // CORREÇÃO: Garante que o link no input também esteja sem .html
    const cleanUrl = url.replace(/\.html/g, '');
    if (inputEl) inputEl.value = cleanUrl;

    const encodedUrl = encodeURIComponent(cleanUrl);

    // Mensagens profissionais personalizadas (sem emojis)
    const msgWhatsApp = encodeURIComponent(`Olá. Convido-o a conhecer este projeto desenvolvido por José Quinvula: ${title}. Trata-se de uma solução focada em design e implementação técnica de qualidade.\n\nLink: `);
    const msgX = encodeURIComponent(`Conheça o projeto "${title}" desenvolvido por José Quinvula. Design otimizado e código limpo. Confira no link: `);

    const setLink = (id, href) => {
        const el = document.getElementById(id);
        if (el) el.href = href;
    };

    setLink('shareWhatsApp', `https://api.whatsapp.com/send?text=${msgWhatsApp}${encodedUrl}`);
    setLink('shareLinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`);
    setLink('shareX', `https://twitter.com/intent/tweet?text=${msgX}&url=${encodedUrl}`);
    setLink('shareFacebook', `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`);

    // Instagram não suporta partilha direta de links via URL nos posts/stories do navegador
    const instaLink = document.getElementById('shareInstagram');
    if (instaLink) {
        instaLink.style.display = 'none'; // Esconde o botão do Instagram para evitar confusão
    }

    modal.style.display = 'flex';
}

function closeShareModal() {
    const modal = document.getElementById('shareModal');
    if (modal) modal.style.display = 'none';
}

// Copiar link com feedback
function copyShareLink(event) {
    const input = document.getElementById('shareLinkInput');
    if (!input) return;

    const btn = event ? event.currentTarget : document.getElementById('copyBtn');
    input.select();
    input.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(input.value).then(() => {
        if (btn) {
            const icon = btn.querySelector('i');
            const originalIconClass = icon ? icon.className : '';
            if (icon) icon.className = 'fas fa-check';
            btn.style.backgroundColor = '#28a745';

            setTimeout(() => {
                if (icon) icon.className = originalIconClass;
                btn.style.backgroundColor = '';
            }, 2000);
        }
    }).catch(err => console.error("Erro ao copiar:", err));
}

/**
 * FUNÇÃO DE PARTILHA PRINCIPAL
 */
async function shareProject(event, title, anchor) {
    event.stopPropagation();
    event.preventDefault();

    const btnElement = event.currentTarget;
    const secaoPai = btnElement.closest('section');

    // CORREÇÃO: Detecta se é a página de projetos removendo o .html da verificação
    const currentPath = window.location.pathname;
    const isRepo = currentPath.includes('todos-projetos');

    // CORREÇÃO GITHUB PAGES & CLEAN URL:
    let baseUrl = window.location.href.split('#')[0].replace(/\.html$/, '');

    // Garante que se a URL terminar em / e o anchor começar com #, não duplique barras
    const shareUrl = baseUrl + anchor;

    // SINCRONIZAÇÃO COM 404.JS
    if (secaoPai && secaoPai.id) {
        sessionStorage.setItem('url_retorno', shareUrl);
    }

    try {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (navigator.share && isMobile) {
            await navigator.share({
                title: `José Quinvula | ${title}`,
                text: `Conheça o projeto inovador "${title}". Rigor técnico e design de excelência.`,
                url: shareUrl
            });
        } else {
            openShareModal(title, shareUrl);
        }
    } catch (err) {
        if (err.name !== 'AbortError') {
            openShareModal(title, shareUrl);
        }
    }
}

// Fechar modal ao clicar fora
window.addEventListener('click', (e) => {
    const modal = document.getElementById('shareModal');
    if (e.target === modal) closeShareModal();
});

/**
 * VALIDAÇÃO DE LINKS (REDICIONA PARA 503 SE VAZIO)
 */
function validarLink(event, element) {
    const href = element.getAttribute('href');
    if (!href || href === '#' || href === '') {
        event.preventDefault();
        
        // Verifica se estamos na pasta /views/ para ajustar o caminho do 503.html
        const isRepo = window.location.pathname.includes('/views/');
        const errorPage = isRepo ? '503.html' : 'views/503.html';
        
        window.location.href = errorPage;
    }
}
