document.addEventListener('DOMContentLoaded', () => {
    // Referências aos elementos do DOM
    const profilePic = document.getElementById('profile-pic');
    const profilePicUpload = document.getElementById('profile-pic-upload');
    const themeLightButton = document.getElementById('theme-light');
    const themeDarkButton = document.getElementById('theme-dark');
    const themeSystemButton = document.getElementById('theme-system');
    const currentUsernameDisplay = document.getElementById('current-username');
    const changeUsernameForm = document.getElementById('change-username-form');
    const newUsernameInput = document.getElementById('new-username');
    const changePasswordForm = document.getElementById('change-password-form');
    const oldPasswordInput = document.getElementById('old-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');

    // Funções de utilidade para localStorage
    const getStoredUser = () => {
        try {
            const users = JSON.parse(localStorage.getItem('user')) || [];
            const loggedInUser = JSON.parse(localStorage.getItem('login'));
            if (loggedInUser && loggedInUser.length > 0) {
                return users.find(u => u.userCad === loggedInUser[0].userLogin);
            }
        } catch (e) {
            console.error("Erro ao carregar usuário do localStorage:", e);
        }
        return null;
    };

    const updateStoredUser = (updatedUserData) => {
        try {
            let users = JSON.parse(localStorage.getItem('user')) || [];
            let loggedInUser = JSON.parse(localStorage.getItem('login'));

            if (loggedInUser && loggedInUser.length > 0) {
                const userLogin = loggedInUser[0].userLogin;
                const userIndex = users.findIndex(u => u.userCad === userLogin);

                if (userIndex !== -1) {
                    // Atualiza o usuário na lista 'user'
                    users[userIndex] = { ...users[userIndex], ...updatedUserData };
                    localStorage.setItem('user', JSON.stringify(users));

                    // Se o nome de usuário mudou, atualiza também no 'login'
                    if (updatedUserData.userCad && updatedUserData.userCad !== userLogin) {
                        loggedInUser[0].userLogin = updatedUserData.userCad;
                        localStorage.setItem('login', JSON.stringify(loggedInUser));
                    }
                    if (updatedUserData.nomeCad && updatedUserData.nomeCad !== loggedInUser[0].nomeLogin) {
                         loggedInUser[0].nomeLogin = updatedUserData.nomeCad;
                         localStorage.setItem('login', JSON.stringify(loggedInUser));
                    }

                    return true;
                }
            }
        } catch (e) {
            console.error("Erro ao atualizar usuário no localStorage:", e);
        }
        return false;
    };

    // --- Lógica de Foto de Perfil ---
    const loadProfilePicture = () => {
        const storedProfilePic = localStorage.getItem('profilePic');
        if (storedProfilePic) {
            profilePic.src = storedProfilePic;
        }
    };

    profilePicUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePic.src = e.target.result;
                localStorage.setItem('profilePic', e.target.result); // Salva a imagem como Data URL
                // showMessageModal é definido em script(cpaas).js, garantimos que esteja disponível
                if (typeof showMessageModal === 'function') {
                    showMessageModal('Sucesso!', 'Foto de perfil atualizada com sucesso!');
                } else {
                    console.warn("showMessageModal não está disponível.");
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Lógica de Tema do Site ---
    const applyTheme = (theme) => {
        document.body.classList.remove('dark'); // Remove o modo dark

        if (theme === 'dark-mode') {
            document.body.classList.add('dark');
        } else if (theme === 'system-mode') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark');
            }
        }
        localStorage.setItem('mode', theme);
        updateThemeButtons(theme);
    };

    const updateThemeButtons = (activeTheme) => {
        themeLightButton.classList.remove('active');
        themeDarkButton.classList.remove('active');
        themeSystemButton.classList.remove('active');

        if (activeTheme === 'light-mode') {
            themeLightButton.classList.add('active');
        } else if (activeTheme === 'dark-mode') {
            themeDarkButton.classList.add('active');
        } else if (activeTheme === 'system-mode') {
            themeSystemButton.classList.add('active');
        }
    };

    themeLightButton.addEventListener('click', () => applyTheme('light-mode'));
    themeDarkButton.addEventListener('click', () => applyTheme('dark-mode'));
    themeSystemButton.addEventListener('click', () => applyTheme('system-mode'));

    // Observa mudanças no tema do sistema para o modo "Sistema"
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        if (localStorage.getItem('mode') === 'system-mode') {
            if (event.matches) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        }
    });

    // --- Lógica de Alterar Nome de Usuário ---
    const loadUsername = () => {
        const user = getStoredUser();
        if (user) {
            currentUsernameDisplay.value = user.userCad;
        } else {
            // Redirecionar para login se não houver usuário logado
            window.location.href = 'login.html';
        }
    };

    changeUsernameForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newUsername = newUsernameInput.value.trim();
        const currentUser = getStoredUser();

        if (!currentUser) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Nenhum usuário logado. Por favor, faça login.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        if (newUsername === '') {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'O novo nome de usuário não pode estar vazio.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        // Validação de formato (reutiliza a função validarLogin do scripts.js)
        // Certifique-se de que scripts.js está carregado e validarLogin está globalmente acessível
        if (typeof validarLogin === 'function' && !validarLogin(newUsername)) {
             if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'O nome de usuário deve ter entre 3 e 20 caracteres e pode conter letras, números, underscores ou pontos.');
             } else { console.warn("showMessageModal não está disponível."); }
             return;
        }

        // Verifica se o novo nome de usuário já existe (excluindo o próprio usuário logado)
        let allUsers = JSON.parse(localStorage.getItem('user')) || [];
        const usernameExists = allUsers.some(u => u.userCad === newUsername && u.userCad !== currentUser.userCad);
        if (usernameExists) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Este nome de usuário já está em uso.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        if (updateStoredUser({ userCad: newUsername })) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Sucesso!', 'Nome de usuário alterado com sucesso!');
            } else { console.warn("showMessageModal não está disponível."); }
            currentUsernameDisplay.value = newUsername; // Atualiza o campo de exibição
            newUsernameInput.value = ''; // Limpa o campo de entrada
            // Recarrega a página para atualizar o nome na navbar, garantindo que o script(cpaas).js reflete a mudança
            location.reload();
        } else {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Falha ao alterar nome de usuário.');
            } else { console.warn("showMessageModal não está disponível."); }
        }
    });

    // --- Lógica de Alterar Senha ---
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;
        const currentUser = getStoredUser();

        if (!currentUser) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Nenhum usuário logado. Por favor, faça login.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        if (oldPassword === '' || newPassword === '' || confirmNewPassword === '') {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Por favor, preencha todos os campos.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        // Valida a senha antiga
        if (currentUser.senhaCad !== oldPassword) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Senha antiga incorreta.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        // Valida a nova senha (reutiliza validarSenha do scripts.js, se existir)
        if (typeof validarsenha === 'function' && !validarsenha(newPassword)) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'A nova senha deve ter pelo menos 8 caracteres.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        } else if (newPassword.length < 8) { // Fallback se validarsenha não estiver disponível ou não cobrir todos os casos
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'A nova senha deve ter pelo menos 8 caracteres.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        if (newPassword !== confirmNewPassword) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'A nova senha e a confirmação de senha não correspondem.');
            } else { console.warn("showMessageModal não está disponível."); }
            return;
        }

        if (updateStoredUser({ senhaCad: newPassword })) {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Sucesso!', 'Senha alterada com sucesso!');
            } else { console.warn("showMessageModal não está disponível."); }
            // Limpa os campos após a alteração
            oldPasswordInput.value = '';
            newPasswordInput.value = '';
            confirmNewPasswordInput.value = '';
        } else {
            if (typeof showMessageModal === 'function') {
                showMessageModal('Erro', 'Falha ao alterar senha.');
            } else { console.warn("showMessageModal não está disponível."); }
        }
    });


    // --- Inicialização da Página ---
    const initPage = () => {
        loadProfilePicture();
        loadUsername();
        // Ativar o botão de tema correto na inicialização
        const currentTheme = localStorage.getItem('mode') || 'light-mode';
        updateThemeButtons(currentTheme);
        // Aplica o tema imediatamente
        applyTheme(currentTheme);
    };

    initPage();
});
