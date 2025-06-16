const body = document.querySelector("body"),
  nav = document.querySelector("nav"),
  modeToggle = document.querySelector(".dark-light"),
  searchToggle = document.querySelector(".searchToggle"),
  sidebarOpen = document.querySelector(".sidebarOpen"),
  siderbarClose = document.querySelector(".siderbarClose");

// Inicializa o modo de tema ao carregar a página
let getMode = localStorage.getItem("mode");
if (getMode === "dark-mode") {
  body.classList.add("dark");
} else if (getMode === "system-mode") {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
} else { // Padrão para modo claro se nenhuma preferência ou modo claro explícito
  body.classList.remove("dark");
}


//alternar para modo escuro ou claro
modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark");
  //usando localstorage para continuar o modo selecionado pelo usuario mesmo apos recarregar ou reabrir o site
  if (!body.classList.contains("dark")) {
    localStorage.setItem("mode", "light-mode");
  } else {
    localStorage.setItem("mode", "dark-mode");
  }
});

//alternar para modo escuro ou claro barra de pesquisa
searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

// alternar para barra lateral
sidebarOpen.addEventListener("click", () => {
  nav.classList.add("active");
});

body.addEventListener("click", (e) => {
  let clickedElm = e.target;

  if (
    !clickedElm.classList.contains("sidebarOpen") &&
    !clickedElm.classList.contains("menu")
  ) {
    nav.classList.remove("active");
  }
});

// A função deslogar() deve estar disponível globalmente para que o onclick no HTML funcione.
function deslogar() {
  localStorage.removeItem("login"); // Limpa o login do localStorage
  localStorage.removeItem("profilePic"); // Remove a foto de perfil também
  localStorage.removeItem("mode"); // Remove a preferência de tema
  window.location.href = "login.html"; // Redireciona para a página de login
}

// Função para exibir mensagens modais (reutilizável)
function showMessageModal(title, message) {
    const messageModal = document.getElementById('message-modal');
    const messageModalTitle = document.getElementById('message-modal-title');
    const messageModalText = document.getElementById('message-modal-text');
    const messageModalCloseButton = document.getElementById('message-modal-close-button');
    const closeMessageModalButton = document.getElementById('close-message-modal');

    if (messageModal && messageModalTitle && messageModalText) {
        messageModalTitle.textContent = title;
        messageModalText.textContent = message;
        messageModal.style.display = 'flex';

        // Adiciona event listeners se ainda não estiverem anexados
        if (!messageModalCloseButton._hasClickListener) {
            messageModalCloseButton.addEventListener('click', () => {
                messageModal.style.display = 'none';
            });
            messageModalCloseButton._hasClickListener = true;
        }
        if (!closeMessageModalButton._hasClickListener) {
            closeMessageModalButton.addEventListener('click', () => {
                messageModal.style.display = 'none';
            });
            closeMessageModalButton._hasClickListener = true;
        }
        if (!window._messageModalGlobalClickListener) {
            window._messageModalGlobalClickListener = (event) => {
                if (event.target == messageModal) {
                    messageModal.style.display = 'none';
                }
            };
            window.addEventListener('click', window._messageModalGlobalClickListener);
        }
    } else {
        console.warn("Elementos do modal de mensagem não encontrados.");
        alert(message); // Fallback para alert se os elementos do modal estiverem faltando
    }
}


// Verifica o estado de login ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  const usuarioElement = document.querySelector(".nav-links .usuario");
  const deslogarElement = document.querySelector(".nav-links .deslogar");
  const cadastrarLinkElement = document.querySelector(".nav-links .cadastrar-link");

  console.log("[DEBUG] Estado do Login: Verificando o localStorage...");

  if (usuarioElement && deslogarElement) { // Garante que os elementos essenciais existam
    try {
      let JsonLogin = JSON.parse(localStorage.getItem("login"));
      console.log("[DEBUG] JsonLogin:", JsonLogin);

      if (JsonLogin && JsonLogin.length > 0 && JsonLogin[0].nomeLogin) {
        console.log("[DEBUG] Usuário Logado. Nome:", JsonLogin[0].nomeLogin);
        // Usuário logado: exibe o nome de usuário e o botão de deslogar
        let userLink = usuarioElement.querySelector('a');
        if (!userLink) { // Se não houver um link <a> dentro, crie um
            userLink = document.createElement('a');
            usuarioElement.innerHTML = ''; // Limpa o conteúdo existente
            usuarioElement.appendChild(userLink);
        }
        userLink.href = './usuario.html'; // Caminho correto para usuario.html
        userLink.textContent = JsonLogin[0].nomeLogin; // Define o nome de usuário como texto do link

        deslogarElement.style.display = "block"; // Exibe o botão de deslogar
        if (cadastrarLinkElement) { // Esconde o link de cadastrar se ele existir
          cadastrarLinkElement.style.display = "none";
        }
      } else {
        console.log("[DEBUG] Nenhum usuário logado ou dados incompletos.");
        // Nenhum usuário logado: exibe o link de Login e esconde o botão de deslogar
        // Garante que o link de login esteja configurado corretamente
        let loginLink = usuarioElement.querySelector('a');
        if (!loginLink) {
            loginLink = document.createElement('a');
            usuarioElement.innerHTML = '';
            usuarioElement.appendChild(loginLink);
        }
        loginLink.href = './login.html';
        loginLink.textContent = 'Login';

        deslogarElement.style.display = "none"; // Esconde o botão de deslogar
        if (cadastrarLinkElement) { // Mostra o link de cadastrar se ele existir
          cadastrarLinkElement.style.display = "block";
        }
      }
    } catch (e) {
      console.error("[DEBUG] Erro ao processar estado de login:", e);
      // Em caso de erro, garante que o link de Login seja exibido e o Cadastrar também
      let loginLink = usuarioElement.querySelector('a');
      if (!loginLink) {
          loginLink = document.createElement('a');
          usuarioElement.innerHTML = '';
          usuarioElement.appendChild(loginLink);
      }
      loginLink.href = './login.html';
      loginLink.textContent = 'Login';
      deslogarElement.style.display = "none";
      if (cadastrarLinkElement) {
        cadastrarLinkElement.style.display = "block";
      }
    }
  } else {
      console.log("[DEBUG] Elementos 'usuarioElement' ou 'deslogarElement' não encontrados na DOM.");
  }


  // Verifica se há um plano selecionado no localStorage ao carregar a página
  // Esta parte do código parece ser específica da página de serviços, mas está em cpaas.js.
  // Se 'selectedPlanDisplay' e 'selectedPlanDisplayContainer' não existirem na página atual,
  // isso pode causar um erro. É ideal que esta lógica esteja no script específico da página de serviços.
  const selectedPlanDisplay = document.getElementById('selectedPlanDisplay');
  const selectedPlanDisplayContainer = document.getElementById('selectedPlanDisplayContainer');

  if (selectedPlanDisplay && selectedPlanDisplayContainer) {
      const storedPlan = localStorage.getItem('selectedPlan');
      if (storedPlan) {
          selectedPlanDisplay.value = storedPlan;
          selectedPlanDisplayContainer.style.display = 'block';
          localStorage.removeItem('selectedPlan'); // Limpa após exibir
      }
  }
});
