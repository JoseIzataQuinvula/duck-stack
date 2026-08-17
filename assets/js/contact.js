// --- FUNÇÕES DO MENU DE E-MAIL (MODAL DE CONTATO) ---
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// --- FUNÇÃO PARA COPIAR E-MAIL ---
function copyEmail(event) {
    if (event) event.preventDefault();

    const emailInput = document.getElementById('shareLinkInputEmail');

    if (emailInput) {
        emailInput.select();
        emailInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(emailInput.value);

        const btn = event.currentTarget;
        const iconOriginal = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-check"></i>';

        setTimeout(() => {
            btn.innerHTML = iconOriginal;
        }, 2000);
    }
}

// --- GERENCIADOR DE FECHAMENTO DE MODAIS ---
window.addEventListener('click', (event) => {
    const contactModal = document.getElementById('contactModal');
    const shareModal = document.getElementById('shareModal');

    if (event.target === contactModal) closeContactModal();
    if (event.target === shareModal) {
        if (typeof closeShareModal === 'function') closeShareModal();
        else shareModal.style.display = 'none';
    }
});

// --- LÓGICA DE ENVIO DO FORMULÁRIO (Feedback apenas no Botão + Ícones de Erro) ---
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        // Limpar erros ao digitar
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                input.parentElement.classList.remove('invalid');
            });
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = contactForm.querySelector('.btn-submit');
            if (btn.disabled) return; // Bloqueio imediato para evitar duplo clique
            
            const textoOriginal = btn.innerHTML;
            const corOriginal = getComputedStyle(btn).backgroundColor; 
            
            // 1. VALIDAÇÃO MANUAL
            let formValido = true;
            inputs.forEach(input => {
                if (input.required && !input.value.trim()) {
                    input.parentElement.classList.add('invalid');
                    formValido = false;
                } else {
                    input.parentElement.classList.remove('invalid');
                }
            });

            if (!formValido) {
                btn.disabled = true;
                btn.style.background = "#FFD700"; // Amarelo Gold
                btn.style.color = "#000";
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> PREENCHA OS CAMPOS';
                
                setTimeout(() => {
                    btn.disabled = false;
                    btn.style.background = corOriginal;
                    btn.style.color = "#000";
                    btn.innerHTML = textoOriginal;
                }, 3000);
                return;
            }
            
            // 2. Estado de CARREGAMENTO
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> ENVIANDO...';
            btn.style.background = "#666";
            btn.style.color = "#fff";
            
            const dados = new FormData(contactForm);
            
            try {
                const resposta = await fetch("https://formsubmit.co/ajax/8b9f62aa8c96f204196e3fe5b3657b53", {
                    method: 'POST',
                    body: dados,
                    headers: { 'Accept': 'application/json' }
                });
                
                if (resposta.ok) {
                    const result = await resposta.json();
                    
                    if (result.message && result.message.toLowerCase().includes('activate')) {
                        // Estado de ERRO GENÉRICO (Segurança)
                        btn.style.background = "#dc3545"; 
                        btn.style.color = "#fff";
                        btn.innerHTML = '<i class="fas fa-times-circle"></i> ERRO NO ENVIO';
                    } else {
                        // Estado de SUCESSO (Verde)
                        btn.style.background = "#28a745"; 
                        btn.style.color = "#fff";
                        btn.innerHTML = '<i class="fas fa-check-circle"></i> SUCESSO! ENVIADO';
                        contactForm.reset();
                    }
                } else {
                    btn.style.background = "#dc3545";
                    btn.style.color = "#fff";
                    btn.innerHTML = '<i class="fas fa-times-circle"></i> ERRO NO ENVIO';
                }
            } catch (erro) {
                btn.style.background = "#dc3545";
                btn.style.color = "#fff";
                btn.innerHTML = '<i class="fas fa-wifi"></i> FALHA DE CONEXÃO';
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.style.background = corOriginal;
                    btn.style.color = "#000";
                    btn.innerHTML = textoOriginal;
                }, 4000);
            }
        });
    }
});
