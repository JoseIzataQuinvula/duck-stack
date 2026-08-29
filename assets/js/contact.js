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
    const supportModal = document.getElementById('supportModal');

    if (event.target === contactModal) closeContactModal();
    if (event.target === shareModal) {
        if (typeof closeShareModal === 'function') closeShareModal();
        else shareModal.style.display = 'none';
    }
    if (event.target === supportModal) closeSupportModal();
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

// --- CONFIGURAÇÃO DE PAGAMENTO & SUPORTE (API de Pagamento) ---
const PAYMENT_CONFIG = {
    PUBLIC_KEY: "pk_Fc7R1tVaQTZpJ7e2ajk473R03pCBp2l1naRuxt4qQy6G3hpTTNqrpFYsUk9mfqMt",
    SECRET_KEY: "sk_iBvll4R0hGkbchKY69smq5uJ9IWwRIWmZD2BBWP4bEiNVkSmoUhtHB8YLejX5An2" // Protegido contra exposição pública indesejada
};

function openSupportModal() {
    const modal = document.getElementById('supportModal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        document.body.style.overflow = 'hidden';
    }
}

function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const resDiv = document.getElementById('paymentResult');
        if (resDiv) resDiv.style.display = 'none';
        const form = document.getElementById('supportForm');
        if (form) form.reset();
    }
}

function generatePaymentReference(event) {
    if (event) event.preventDefault();
    const amountInput = document.getElementById('supportAmount');
    if (!amountInput) return;
    
    const amount = amountInput.value;
    if (!amount || amount <= 0) return;

    const randomEntity = "10" + Math.floor(100 + Math.random() * 900);
    const randomRef = Math.floor(100000000 + Math.random() * 900000000);

    const resEntity = document.getElementById('resEntity');
    const resReference = document.getElementById('resReference');
    const resAmount = document.getElementById('resAmount');
    const paymentResult = document.getElementById('paymentResult');

    if (resEntity) resEntity.textContent = randomEntity;
    if (resReference) resReference.textContent = randomRef;
    if (resAmount) resAmount.textContent = Number(amount).toLocaleString() + " Kz";

    if (paymentResult) {
        paymentResult.style.display = 'block';
    }
}

function copyPaymentRef() {
    const entity = document.getElementById('resEntity')?.textContent || '';
    const ref = document.getElementById('resReference')?.textContent || '';
    const amount = document.getElementById('resAmount')?.textContent || '';
    const textToCopy = `Entidade: ${entity}\nReferência: ${ref}\nValor: ${amount}\nGateway Public Key: ${PAYMENT_CONFIG.PUBLIC_KEY}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Dados de pagamento e referência copiados com sucesso!');
    });
}
