/**
    * translate-adapter.js
    * Adaptador otimizado para alternância rápida entre PT e EN.
    */
   
   function googleTranslateElementInit() {
       try {
           new google.translate.TranslateElement({
               pageLanguage: 'pt',
               includedLanguages: 'en',
               layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
               autoDisplay: false
           }, 'google_translate_element');
       } catch (e) {
           console.error("Translate init error:", e);
       }
   
       const savedLang = localStorage.getItem('duck-stack-lang') || 'pt';
       
       if (savedLang === 'en') {
           const select = document.querySelector('.goog-te-combo');
           if (select && select.value !== 'en') {
               select.value = 'en';
               select.dispatchEvent(new Event('change'));
           }
       }
   }
   
   function changeLanguage(langCode) {
       if (langCode === 'pt') {
           document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
           if (location.hostname && location.hostname !== 'localhost') {
               document.cookie = `googtrans=; path=/; domain=.${location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
           }
           localStorage.setItem('duck-stack-lang', 'pt');
           location.reload();
       } else {
           const cookieValue = `/auto/${langCode}`;
           document.cookie = `googtrans=${cookieValue}; path=/; SameSite=Lax`;
           if (location.hostname && location.hostname !== 'localhost') {
               document.cookie = `googtrans=${cookieValue}; path=/; domain=.${location.hostname}; SameSite=Lax`;
           }
           localStorage.setItem('duck-stack-lang', langCode);
           location.reload();
       }
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
           btn.textContent = currentLang === 'pt' ? 'EN' : 'PT';
           btn.title = currentLang === 'pt' ? 'Mudar para Inglês (English)' : 'Mudar para Português';
           
           btn.addEventListener('click', (e) => {
               e.preventDefault();
               e.stopPropagation();
               toggleLanguage();
           });
       }
   });
   