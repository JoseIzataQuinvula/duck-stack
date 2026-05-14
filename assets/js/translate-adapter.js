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

    // Watchdog: Força a sincronização repetidamente nos primeiros 10 segundos
    const savedLang = localStorage.getItem('duck-stack-lang') || 'pt';
    let attempts = 0;
    const watchdog = setInterval(() => {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            if (select.value !== savedLang) {
                select.value = savedLang;
                select.dispatchEvent(new Event('change'));
            }
            // Não paramos no primeiro sucesso, tentamos garantir por 5 segundos
            if (attempts > 20) clearInterval(watchdog);
        }
        attempts++;
        if (attempts > 50) clearInterval(watchdog); // Timeout de 10s
    }, 200);
}

// Função para mudar o idioma programaticamente
function changeLanguage(langCode) {
    // 1. Método por Cookie (Mais estável para o Google Translate)
    const cookieValue = `/auto/${langCode}`; 
    
    // Define o cookie de várias formas para garantir que o browser o aceite (especialmente em file://)
    const cookieOptions = "path=/; SameSite=Lax";
    document.cookie = `googtrans=${cookieValue}; ${cookieOptions}`;
    
    // Se estiver num servidor (não file://), tenta também com o domínio
    if (location.hostname && location.hostname !== 'localhost') {
        document.cookie = `googtrans=${cookieValue}; path=/; domain=.${location.hostname}; SameSite=Lax`;
    }

    // 2. Tenta mudar o seletor se já existir para feedback visual imediato
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event('change'));
    }

    // 3. Guarda a preferência
    localStorage.setItem('duck-stack-lang', langCode);

    // 4. Recarrega para aplicar
    setTimeout(() => {
        location.reload();
    }, 100);
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
