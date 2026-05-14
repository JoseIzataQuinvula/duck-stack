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
}

// Função para mudar o idioma programaticamente
function changeLanguage(langCode) {
    // 1. Método por Cookie (Mais estável para o Google Translate)
    document.cookie = "googtrans=/pt/" + langCode + "; path=/";
    document.cookie = "googtrans=/pt/" + langCode + "; path=/; domain=." + window.location.hostname;
    
    // 2. Tenta mudar o seletor se já existir (para feedback imediato)
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    }

    // 3. Atualiza o texto do botão principal
    const btn = document.getElementById('custom-lang-btn');
    if (btn) btn.textContent = langCode.toUpperCase();
    
    // 4. Guarda a preferência
    localStorage.setItem('duck-stack-lang', langCode);

    // 5. Recarrega para garantir a tradução (Padrão Profissional)
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
            e.stopPropagation();
            toggleLanguage();
        });
        
        // Aplica o idioma guardado ao carregar a página (sem loop de reload)
        const savedLang = localStorage.getItem('duck-stack-lang');
        const btnText = document.getElementById('custom-lang-btn');
        if (savedLang && btnText) {
            btnText.textContent = savedLang.toUpperCase();
        }
    }
});
