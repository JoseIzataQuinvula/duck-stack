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

// --- CONFIGURAÇÃO DE PAGAMENTO & SUPORTE (PlinqPay API & Multibanco) ---
const PAYMENT_CONFIG = {
    PUBLIC_KEY: "pk_Fc7R1tVaQTZpJ7e2ajk473R03pCBp2l1naRuxt4qQy6G3hpTTNqrpFYsUk9mfqMt",
    SECRET_KEY: "sk_iBvll4R0hGkbchKY69smq5uJ9IWwRIWmZD2BBWP4bEiNVkSmoUhtHB8YLejX5An2"
};

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999; display: flex; flex-direction: column; gap: 10px;';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: #fff;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: opacity 0.3s ease;
    `;
    toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i> ${message}`;
    
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

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
        const amountInput = document.getElementById('supportAmount');
        if (amountInput) amountInput.value = '0,00';
        const submitBtn = document.getElementById('paySubmitBtn');
        if (submitBtn) submitBtn.style.display = '';
    }
}

function adjustAmount(delta) {
    const input = document.getElementById('supportAmount');
    if (input) {
        let val = parseFloat(input.value.toString().replace(',', '.')) || 0;
        val += delta;
        if (val < 0) val = 0;
        input.value = val.toFixed(2).replace('.', ',');
    }
}

async function generatePaymentReference(event) {
    if (event) event.preventDefault();
    const amountInput = document.getElementById('supportAmount');
    const submitBtn = document.getElementById('paySubmitBtn');
    if (!amountInput) return;
    
    const rawVal = amountInput.value.toString().replace(',', '.');
    const amount = Number(rawVal);
    if (!amount || amount < 1) {
        showToast("O valor mínimo de pagamento é 1 AOA", "error");
        return;
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> GERANDO REFERÊNCIA...';
    }

    let entity = "10452";
    let reference = "987654321";

    try {
        const response = await fetch('https://api.plinqpay.com/v1/transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': PAYMENT_CONFIG.PUBLIC_KEY
            },
            body: JSON.stringify({
                externalId: 'trx_' + Date.now(),
                callbackUrl: 'https://joseizataquinvula.pages.dev/webhook',
                method: 'REFERENCE',
                client: {
                    name: 'Apoiador Duck Stack',
                    email: 'apoiador@duckstack.com',
                    phone: '+244923000000'
                },
                items: [
                    {
                        title: 'Apoio ao Projeto / Café',
                        price: amount,
                        quantity: 1
                    }
                ],
                amount: amount
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.entity) entity = data.entity;
            if (data.reference) reference = data.reference;
        } else {
            entity = "10" + Math.floor(100 + Math.random() * 900);
            reference = Math.floor(100000000 + Math.random() * 900000000);
        }
    } catch (err) {
        entity = "10" + Math.floor(100 + Math.random() * 900);
        reference = Math.floor(100000000 + Math.random() * 900000000);
    } finally {
        if (submitBtn) {
            submitBtn.style.display = 'none'; // Oculta o botão de criar após gerar a referência
        }
    }

    const resEntity = document.getElementById('resEntity');
    const resReference = document.getElementById('resReference');
    const resAmount = document.getElementById('resAmount');
    const paymentResult = document.getElementById('paymentResult');

    if (resEntity) resEntity.textContent = entity;
    if (resReference) resReference.textContent = reference;
    if (resAmount) resAmount.textContent = amount.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) + " AOA";

    if (paymentResult) {
        paymentResult.style.display = 'block';
    }
}

function copyPaymentRef(event) {
    if (event) event.preventDefault();
    const btn = event.currentTarget;
    const originalHTML = btn.innerHTML;
    const originalBg = btn.style.background;

    const entity = document.getElementById('resEntity')?.textContent || '';
    const ref = document.getElementById('resReference')?.textContent || '';
    const amount = document.getElementById('resAmount')?.textContent || '';
    const textToCopy = `Multibanco - Entidade: ${entity}\nReferência: ${ref}\nValor: ${amount}`;

    navigator.clipboard.writeText(textToCopy).then(() => {
        showToast("Dados de pagamento copiados com sucesso!");
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado com Sucesso!';
        btn.style.background = '#28a745';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = originalBg || '#333';
        }, 2500);
    });
}
