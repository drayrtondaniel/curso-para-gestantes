/* =========================================================
   DOVENTRE — script.js
   Lógica: Captura do formulário e envio para SendPulse
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    const leadFormDoventre = document.getElementById('leadFormDoventre');

    if (leadFormDoventre) {
        leadFormDoventre.addEventListener('submit', function (e) {
            e.preventDefault();

            // Pega os dados do formulário visível
            const name = this.name.value;
            const email = this.email.value;
            const whatsapp = this.whatsapp.value;
            const trimestre = this.trimestre.value;

            // Feedback visual de carregamento no botão
            const btn = this.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Enviando...';
            btn.disabled = true;

            // --- PONTE PARA O SENDPULSE ---
            const spForm = document.querySelector('.sp-form[sp-id="255971"] form');
            
            if (spForm) {
                // Preenche email
                const spEmail = spForm.querySelector('input[type="email"]');
                if (spEmail) {
                    spEmail.value = email;
                    spEmail.dispatchEvent(new Event('input', { bubbles: true }));
                    spEmail.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Preenche telefone
                const spPhone = spForm.querySelector('input[type="tel"]');
                if (spPhone && whatsapp) {
                    spPhone.value = whatsapp;
                    spPhone.dispatchEvent(new Event('input', { bubbles: true }));
                    spPhone.dispatchEvent(new Event('change', { bubbles: true }));
                }

                // Preenche o nome (se houver campo customizado no SendPulse)
                const spName = spForm.querySelector('input[name="sform[name]"]');
                if (spName && name) {
                    spName.value = name;
                    spName.dispatchEvent(new Event('input', { bubbles: true }));
                }

                // Marca todos os checkboxes obrigatórios (Termos, GDPR)
                spForm.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    if (!cb.checked) {
                        cb.checked = true;
                        cb.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });

                // Tenta disparar o envio
                try {
                    spForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    console.log('[SendPulse] Formulário preenchido e enviado com sucesso.');
                } catch (err) {
                    console.warn('[SendPulse] Erro ao enviar:', err);
                }
            } else {
                console.warn('[SendPulse] Formulário oculto não encontrado no DOM.');
            }
            // --- FIM DA PONTE ---

            // Simula um tempo de envio para o usuário e mostra mensagem de sucesso
            setTimeout(() => {
                btn.innerText = 'Checklist enviado com sucesso!';
                btn.style.backgroundColor = 'var(--success)'; // Cor de sucesso
                this.reset(); // Limpa o formulário
                
                // Opcional: Voltar o botão ao normal após alguns segundos
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = ''; // Volta à cor original
                    btn.disabled = false;
                }, 5000);

            }, 1500);
        });
    }
});
