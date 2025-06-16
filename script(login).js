const form = document.getElementById("form");
const username = document.getElementById("username");
const senha = document.getElementById("senha");
limparLocalStorageLogin(); // Certifica que qualquer login anterior seja limpo ao carregar a página de login

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Impede o envio padrão do formulário

  // A função checkInputs agora também lida com a verificação de credenciais
  if (checkInputs()) {
    // Se checkInputs retornar true, o login foi bem-sucedido e os dados já foram salvos em localStorage.login
    setTimeout(() => {
      // Redireciona para a página inicial após um breve atraso
      window.location.href = "index.html";
    }, 500); // Reduzido para 0.5 segundos para uma experiência mais fluida
  }
});

function limparLocalStorageLogin() {
  // Mantém os dados de registro, apenas limpa a sessão de login ativa
  localStorage.removeItem("login");
}

// Função que checa se todos os inputs estão devidamente preenchidos e verifica as credenciais
function checkInputs() {
  const usernameValue = username.value;
  const senhaValue = senha.value;
  let allInputsAreValid = true; // Assume que os inputs são válidos inicialmente

  // Validação do campo de Nome de Usuário
  if (usernameValue === "") {
    setErrorFor(username, "Nome de usuário vazio");
    allInputsAreValid = false;
  } else if (!validarLogin(usernameValue)) {
    // Mensagem de erro para o formato do nome de usuário
    setErrorFor(username, "O nome de usuário deve ter entre 3 e 20 caracteres (letras, números, . ou _)");
    allInputsAreValid = false;
  } else {
    setSuccessFor(username);
  }

  // Validação do campo de Senha
  if (senhaValue === "") {
    setErrorFor(senha, "A senha é obrigatória");
    allInputsAreValid = false;
  } else if (!validarSenha(senhaValue)) {
    // Mensagem de erro para o comprimento da senha
    setErrorFor(senha, "A senha deve ter no mínimo 8 caracteres");
    allInputsAreValid = false;
  } else {
    setSuccessFor(senha);
  }

  // --- LÓGICA DE VERIFICAÇÃO DE CREDENCIAIS ---
  // A verificação de login só ocorre se as validações de formato dos inputs passarem
  if (allInputsAreValid) {
    let registeredUsers = JSON.parse(localStorage.getItem("user") || "[]"); // Busca usuários cadastrados

    // Procura por um usuário que corresponda ao nome de usuário e senha digitados
    const foundUser = registeredUsers.find(user =>
      user.userCad === usernameValue && user.senhaCad === senhaValue
    );

    if (foundUser) {
      // Se o usuário for encontrado, o login é bem-sucedido.
      // Salva os detalhes do usuário logado no localStorage na chave "login".
      // A estrutura salva é um array contendo um objeto com userLogin e nomeLogin (que é o userCad)
      // para compatibilidade com script(cpaas).js e script(usuario).js.
      localStorage.setItem("login", JSON.stringify([{ nomeLogin: foundUser.userCad, userLogin: foundUser.userCad, senhaLoggin: foundUser.senhaCad }]));
      setSuccessFor(username); // Define o status de sucesso para os campos
      setSuccessFor(senha);
      return true; // Indica que o login foi bem-sucedido
    } else {
      // Se o usuário não for encontrado, exibe mensagem de erro e falha no login
      setErrorFor(username, "Usuário ou senha incorretos");
      setErrorFor(senha, "Usuário ou senha incorretos");
      allInputsAreValid = false; // Define como false para impedir o redirecionamento
    }
  }

  return allInputsAreValid; // Retorna o status final da validação/verificação
}

// Funções de Validação (reutilizadas de scripts.js ou definidas localmente)
function validarLogin(login) {
  // Regex para validar letras (maiúsculas e minúsculas), números, underscores e pontos, com 3 a 20 caracteres
  const regex = /^[a-zA-Z0-9._]{3,20}$/;
  return regex.test(login);
}

function validarSenha(senha) {
  // Verifica se a senha tem pelo menos 8 caracteres
  return senha.length >= 8;
}

// Funções para exibir mensagens de erro/sucesso nos campos do formulário
function setErrorFor(input, message) {
  const formControl = input.parentElement; // Pega o elemento pai (div.form-control)
  const small = formControl.querySelector("small"); // Encontra o elemento small

  small.innerText = message; // Adiciona a mensagem de erro
  formControl.className = "form-control error"; // Adiciona a classe de erro para estilização
}

function setSuccessFor(input) {
  const formControl = input.parentElement; // Pega o elemento pai (div.form-control)
  formControl.className = "form-control success"; // Adiciona a classe de sucesso para estilização
}

// Lógica de Dark Mode (mantida, pois é independente da lógica de login principal)
const body = document.querySelector("body"),
  container = document.querySelector(".container"),
  modeToggle = document.querySelector(".dark-light"),
  header = document.querySelector(".header");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark");
  container.classList.add("dark");
  header.classList.add("dark");
}

modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark");
  container.classList.add("dark");
  header.classList.add("dark");
  if (!body.classList.contains("dark")) {
    container.classList.remove("dark");
    header.classList.remove("dark");
    localStorage.setItem("mode", "light-mode");
  } else {
    localStorage.setItem("mode", "dark-mode");
  }
});
