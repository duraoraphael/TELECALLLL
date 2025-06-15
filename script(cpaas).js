const body = document.querySelector("body"),
  nav = document.querySelector("nav"),
  modeToggle = document.querySelector(".dark-light"),
  searchToggle = document.querySelector(".searchToggle"),
  sidebarOpen = document.querySelector(".sidebarOpen"),
  siderbarClose = document.querySelector(".siderbarClose");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark");
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

// pegando o Login do usuario no localstorage

let JsonLogin = JSON.parse(localStorage.login);
var nomeLogin = JsonLogin[0].nomeLogin;
verificarLogin();

function verificarLogin() {
  if (nomeLogin.length > 5) {
    const usuario = document.querySelector(".usuario");
    const Deslogarativo = document.querySelector(".deslogar");

    Deslogarativo.classList.add("ativo");
    usuario.textContent = nomeLogin;
  }
}

function deslogar() {
        localStorage.removeItem("login"); // Limpa o login do localStorage
        window.location.href = "login.html";
      }

      // Verifica o estado de login ao carregar a página
      document.addEventListener("DOMContentLoaded", () => {
        const usuarioElement = document.querySelector(".nav-links .usuario");
        const deslogarElement = document.querySelector(".nav-links .deslogar");
        const cadastrarLinkElement = document.querySelector(".nav-links .cadastrar-link"); // Seleciona o link de cadastrar

        if (usuarioElement && deslogarElement && cadastrarLinkElement) { // Garante que todos os elementos existam
            try {
                let JsonLogin = JSON.parse(localStorage.getItem("login"));
                if (JsonLogin && JsonLogin.length > 0 && JsonLogin[0].nomeLogin) {
                    // Usuário logado: exibe o nome de usuário e o botão de deslogar
                    usuarioElement.innerHTML = JsonLogin[0].nomeLogin; // Define o texto diretamente
                    deslogarElement.style.display = "block";
                    cadastrarLinkElement.style.display = "none"; // Esconde o link de cadastrar
                } else {
                    // Nenhum usuário logado: exibe o link de Login e esconde o botão de deslogar
                    usuarioElement.innerHTML = '<a href="./login.html">Login</a>'; // Garante que o link de login esteja presente
                    deslogarElement.style.display = "none";
                    cadastrarLinkElement.style.display = "block"; // Mostra o link de cadastrar
                }
            } catch (e) {
                console.error("Erro ao processar estado de login:", e);
                // Em caso de erro, garante que o link de Login seja exibido e o Cadastrar também
                usuarioElement.innerHTML = '<a href="./login.html">Login</a>';
                deslogarElement.style.display = "none";
                cadastrarLinkElement.style.display = "block";
            }
        }
        // Verifica se há um plano selecionado no localStorage ao carregar a página
        const storedPlan = localStorage.getItem('selectedPlan');
        if (storedPlan) {
            selectedPlanDisplay.value = storedPlan;
            selectedPlanDisplayContainer.style.display = 'block';
            localStorage.removeItem('selectedPlan'); // Limpa após exibir
        }
      });
