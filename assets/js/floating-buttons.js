/**
 * FLOATING BUTTONS - UI BEHAVIOR (Top & Scroll)
 * Desenvolvido para: Jose Izata Quinvula
 */
document.addEventListener('DOMContentLoaded', () => {
    
    /* --- VOLTAR AO TOPO --- */
    const backToTopBtn = document.getElementById('btn-top');

    window.addEventListener('scroll', () => {
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Nota: A logica de traducao agora reside em i18n.js
});