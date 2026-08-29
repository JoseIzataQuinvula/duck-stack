/**
    * translate-adapter.js
    * Adaptador otimizado para alternância rápida entre PT e EN.
    */
   
   function googleTranslateElementInit() {
       try {
           new google.translate.TranslateElement({
               pageLanguage: 'pt',
               includedLanguages: 'pt,en',
               layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
               autoDisplay: false
           }, 'google_translate_element');
       } catch (e) {
           console.error("Translate init error:", e);
       }
   
       const savedLang = localStorage.getItem('duck-stack-lang') || 'pt';
       const select = document.querySelector('.goog-te-combo');
       if (select && select.value !== savedLang) {
           select.value = savedLang;
           select.dispatchEvent(new Event('change'));
       }
   }
   
   function changeLanguage(langCode) {
       const cookieValue = `/auto/${langCode}`;
       document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`;
       if (location.hostname && location.hostname !== 'localhost') {
           document.cookie = `googtrans=${cookieValue}; path=/; domain=.${location.hostname}; SameSite=Lax`;
       }
       localStorage.setItem('duck-stack-lang', langCode);
       
       // Reload imediato para máxima velocidade
       location.reload();
   }
   
   function toggleLanguage() {
       const currentLang = localStorage.getItem('duck-stack-lang') || 'pt';
       const nextLang = currentLang === 'pt' ? 'en' : 'pt';
       changeLanguage(nextLang);
   }
   
   document.addEventListener('DOMContentLoaded', () => {
       const btn = document.getElementById('custom-lang-btn');
       if (btn) {
           const currentLang = localStorage.getItem('duck-stack-lang') || 'pt';
           // Exibe o idioma para o qual vai mudar ou o atual (ex: se PT, mostra EN para mudar para Inglês)
           btn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
           btn.title = currentLang === 'pt' ? 'Mudar para Inglês (English)' : 'Mudar para Português';
           
           btn.addEventListener('click', (e) => {
               e.preventDefault();
               e.stopPropagation();
               toggleLanguage();
           });
       }
   });
   