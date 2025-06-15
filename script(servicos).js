document.addEventListener('DOMContentLoaded', () => {
    // DOM element references
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const contratarButtons = document.querySelectorAll('.btn-contratar');
    const modalPlano = document.getElementById('modal-plano');
    const closeModalButton = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const modalDetails = document.getElementById('modal-details');
    const btnConfirmarPlano = document.getElementById('btn-confirmar-plano');

    // New message modal elements
    const messageModal = document.getElementById('message-modal');
    const closeMessageModalButton = document.getElementById('close-message-modal');
    const messageModalTitle = document.getElementById('message-modal-title');
    const messageModalText = document.getElementById('message-modal-text');
    const messageModalCloseButton = document.getElementById('message-modal-close-button');

    // Plan details mapping
    const planos = {
        // Individual Plans
        essencial: {
            titulo: 'Plano Essencial',
            especificacoes: [
                '100 minutos de chamadas para qualquer operadora (fixo e móvel) no Brasil.',
                '5 GB de internet 4G/5G.',
                'SMS ilimitado para qualquer operadora.',
                'Acesso a aplicativos de mensagem sem descontar da franquia (WhatsApp, Telegram).',
                'Suporte técnico 24h por telefone e chat.',
                'Fidelidade de 12 meses.'
            ],
            preco: 'R$ 39,90/mês'
        },
        leve: {
            titulo: 'Plano Leve',
            especificacoes: [
                '200 minutos de chamadas para qualquer operadora (fixo e móvel) no Brasil.',
                '10 GB de internet 4G/5G.',
                'SMS ilimitado para qualquer operadora.',
                'Acesso a aplicativos de mensagem e redes sociais sem descontar da franquia (WhatsApp, Telegram, Facebook, Instagram).',
                'Suporte técnico prioritário 24h por telefone e chat.',
                'Fidelidade de 12 meses.'
            ],
            preco: 'R$ 59,90/mês'
        },
        conecta: {
            titulo: 'Plano Conecta',
            especificacoes: [
                '500 minutos de chamadas para qualquer operadora (fixo e móvel) no Brasil.',
                '20 GB de internet 4G/5G.',
                'SMS ilimitado para qualquer operadora.',
                'Acesso ilimitado a aplicativos de mensagem, redes sociais e vídeo (WhatsApp, Telegram, Facebook, Instagram, YouTube, Netflix).',
                'Suporte técnico premium 24h por telefone, chat e e-mail.',
                'Chamadas ilimitadas para Telecall fixo.',
                'Fidelidade de 12 meses.'
            ],
            preco: 'R$ 89,90/mês'
        },
        familia: {
            titulo: 'Plano Família',
            especificacoes: [
                'Minutos ilimitados para qualquer operadora (fixo e móvel) no Brasil.',
                '50 GB de internet 4G/5G para compartilhar com até 3 dependentes.',
                'SMS ilimitado para qualquer operadora.',
                'Acesso ilimitado a aplicativos de mensagem, redes sociais e vídeo.',
                'Suporte técnico exclusivo 24h.',
                'Chamadas ilimitadas para Telecall fixo e móvel.',
                'Fidelidade de 12 meses.'
            ],
            preco: 'R$ 129,90/mês'
        },
        ultra: {
            titulo: 'Plano Ultra',
            especificacoes: [
                'Minutos ilimitados para qualquer operadora (fixo e móvel) no Brasil.',
                '100 GB de internet 4G/5G de alta velocidade.',
                'SMS ilimitado para qualquer operadora.',
                'Roaming Internacional (5GB) em países selecionados.',
                'Prioridade na rede.',
                'Suporte técnico VIP 24h com atendimento personalizado.',
                'Fidelidade de 12 meses.'
            ],
            preco: 'R$ 199,90/mês'
        },
        supremo: {
            titulo: 'Plano Supremo',
            especificacoes: [
                'Minutos e SMS ilimitados para qualquer operadora (fixo e móvel) no Brasil e em viagens internacionais.',
                'Internet ilimitada 4G/5G com velocidade máxima.',
                'Roaming Internacional (10GB) em diversos países.',
                'Assinatura de streaming premium inclusa (ex: Netflix, Spotify).',
                'Atendimento exclusivo com gerente de contas dedicado.',
                'Fidelidade de 24 meses.'
            ],
            preco: 'R$ 299,90/mês'
        },
        // New Business Plans
        business_basico: {
            titulo: 'Plano Business Básico',
            especificacoes: [
                'Minutos ilimitados para fixo e móvel (nacional).',
                '20 GB de internet 4G/5G para uso empresarial.',
                'SMS ilimitado para comunicação interna e externa.',
                'Até 5 ramais virtuais para sua equipe.',
                'IP Fixo dedicado.',
                'Suporte técnico especializado em horário comercial.',
                'Contrato de 12 meses.'
            ],
            preco: 'R$ 149,90/mês'
        },
        business_intermediario: {
            titulo: 'Plano Business Intermediário',
            especificacoes: [
                'Minutos ilimitados para fixo e móvel (nacional).',
                '50 GB de internet 4G/5G de alta performance.',
                'SMS ilimitado para todas as operadoras.',
                'Até 15 ramais virtuais com gerenciamento flexível.',
                'Atendimento prioritário e suporte técnico 24/7.',
                'Ferramentas de colaboração (ex: videoconferência).',
                'Contrato de 24 meses.'
            ],
            preco: 'R$ 299,90/mês'
        },
        business_ultra: {
            titulo: 'Plano Business Ultra',
            especificacoes: [
                'Minutos ilimitados para fixo e móvel (nacional e internacional).',
                '100 GB de internet 4G/5G com prioridade de rede.',
                'SMS ilimitado e ilimitado para uso de APIs de comunicação.',
                'Ramais virtuais ilimitados e personalizados.',
                'Gerente de contas dedicado e suporte VIP 24/7.',
                'Soluções de segurança avançada e VPN empresarial.',
                'Contrato de 36 meses.'
            ],
            preco: 'R$ 499,90/mês'
        }
    };

    // Function to show the plan tab
    function showTab(tabId) {
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');

        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        document.querySelector(`.tab-button[data-tab="${tabId}"]`).classList.add('active');
    }

    // Initialize the "pf" (Pessoa Física) tab as active
    showTab('pf');

    // Add event listeners to tab buttons
    tabButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const tabId = event.target.dataset.tab;
            showTab(tabId);
        });
    });

    // Add event listeners to "Contratar Plano" buttons
    contratarButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const planKey = event.target.dataset.plan;
            const plano = planos[planKey];

            if (plano) {
                modalTitle.textContent = plano.titulo;
                modalDetails.innerHTML = ''; // Clear previous details
                plano.especificacoes.forEach(spec => {
                    const p = document.createElement('p');
                    p.textContent = `• ${spec}`;
                    modalDetails.appendChild(p);
                });
                const precoP = document.createElement('p');
                precoP.innerHTML = `<strong>Preço: ${plano.preco}</strong>`;
                modalDetails.appendChild(precoP);

                modalPlano.style.display = 'flex'; // Display the modal
            }
        });
    });

    // Event listener to close the plan modal
    closeModalButton.addEventListener('click', () => {
        modalPlano.style.display = 'none';
    });

    // Close the plan modal if clicked outside of it
    window.addEventListener('click', (event) => {
        if (event.target == modalPlano) {
            modalPlano.style.display = 'none';
        }
    });

    // Function to show the custom message modal
    function showMessageModal(title, message) {
        messageModalTitle.textContent = title;
        messageModalText.textContent = message;
        messageModal.style.display = 'flex';
    }

    // Event listener for the confirm plan button
    btnConfirmarPlano.addEventListener('click', () => {
        // Here you can add the logic to actually hire the plan
        // For example, send data to a server, display a success message, etc.
        modalPlano.style.display = 'none'; // Close the plan modal first
        showMessageModal('Sucesso!', 'Plano contratado com sucesso! Em breve entraremos em contato para finalizar os detalhes.');
    });

    // Event listener to close the message modal
    closeMessageModalButton.addEventListener('click', () => {
        messageModal.style.display = 'none';
    });

    // Event listener for the "OK" button in the message modal
    messageModalCloseButton.addEventListener('click', () => {
        messageModal.style.display = 'none';
    });

    // Close the message modal if clicked outside of it
    window.addEventListener('click', (event) => {
        if (event.target == messageModal) {
            messageModal.style.display = 'none';
        }
    });

    // Check login to display username in navbar, if applicable
    // (reuses the function from script(cpaas).js)
    try {
        let JsonLogin = JSON.parse(localStorage.getItem("login"));
        if (JsonLogin && JsonLogin.length > 0 && JsonLogin[0].nomeLogin) {
            var nomeLogin = JsonLogin[0].nomeLogin;
            const usuarioElement = document.querySelector(".nav-links .usuario");
            const deslogarElement = document.querySelector(".nav-links .deslogar");

            if (nomeLogin.length > 0) {
                deslogarElement.classList.add("ativo");
                usuarioElement.textContent = nomeLogin;
                usuarioElement.querySelector('a').href = '#';
            }
        }
    } catch (e) {
        console.error("Erro ao carregar dados de login do localStorage:", e);
    }
});

// The deslogar() function must be available globally or in script(cpaas).js
// as per the original design, so that onclick in HTML works.
// If not in script(cpaas).js, add it here:
// function deslogar() {
//     localStorage.removeItem("login"); // Clears login
//     window.location.href = "login.html";
// }
