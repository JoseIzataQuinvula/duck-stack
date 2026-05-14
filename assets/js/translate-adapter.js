/**
 * translate-adapter.js
 * Adaptador profissional para o Google Translate Widget (Versão Cookie + Toggle)
 */

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');

    // Nudge: Garante que o widget interno acompanhe a escolha do usuário após o carregamento
    const savedLang = localStorage.getItem('duck-stack-lang') || 'pt';
    const checkInterval = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            if (select.value !== savedLang) {
                select.value = savedLang;
                select.dispatchEvent(new Event('change'));
            }
            clearInterval(checkInterval);
        }
    }, 400);
    setTimeout(() => clearInterval(checkInterval), 4000);
}

// Função para mudar o idioma programaticamente
function changeLanguage(langCode) {
    // 1. Método por Cookie (Mais estável para o Google Translate)
    // Usamos /auto/ para permitir que o Google detecte a origem ou force a partir de qualquer estado
    const cookieValue = `/auto/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`;
    
    // Tenta também sem o path se estivermos num ambiente específico
    document.cookie = `googtrans=${cookieValue}; SameSite=Lax`;

    // 2. Tenta mudar o seletor se já existir (para feedback imediato antes do reload)
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    }

    // 3. Guarda a preferência
    localStorage.setItem('duck-stack-lang', langCode);

    // 4. Recarrega para aplicar a tradução em todo o DOM (Padrão de Robustez)
    location.reload();
}

// Função de Alternância (Toggle)
function toggleLanguage() {
    const currentLang = localStorage.getItem('duck-stack-lang') || 'pt';
    const nextLang = currentLang === 'pt' ? 'en' : 'pt';
    changeLanguage(nextLang);
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('custom-lang-btn');
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleLanguage();
        });
        
        // Sincroniza o texto do botão com o estado atual
        const savedLang = localStorage.getItem('duck-stack-lang') || 'pt';
        btn.textContent = savedLang.toUpperCase();
    }
});
