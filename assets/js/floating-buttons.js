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

function copyText(text, event) {
    if (event) event.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
        const btn = event ? event.target.closest('button') : null;
        if (btn) {
            const icon = btn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-copy');
                icon.classList.add('fa-check');
                setTimeout(() => {
                    icon.classList.remove('fa-check');
                    icon.classList.add('fa-copy');
                }, 1500);
            }
        }
    });
}

function showPayTab(tab) {
    document.querySelectorAll('.pay-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.pay-tab').forEach(el => el.classList.remove('active'));
    document.getElementById('pay-' + tab).style.display = 'block';
    document.getElementById('tab-' + tab).classList.add('active');
}