document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('togglePassword');
    const googleLoginButton = document.getElementById('googleLogin');
    const messageElement = document.getElementById('loginMessage');
    const submitButton = document.getElementById('loginButton');
    const nextPath = new URLSearchParams(window.location.search).get('next');

    if (!form || !usernameInput || !passwordInput) {
        return;
    }

    function showMessage(message, tone = 'error') {
        if (!messageElement) {
            window.alert(message);
            return;
        }

        messageElement.textContent = message;
        messageElement.style.color = tone === 'error' ? '#d93025' : '#188038';
    }

    togglePasswordButton?.addEventListener('click', () => {
        const shouldShowPassword = passwordInput.type === 'password';
        passwordInput.type = shouldShowPassword ? 'text' : 'password';
        togglePasswordButton.innerHTML = shouldShowPassword ? '&#128584;' : '&#128065;';
    });

    googleLoginButton?.addEventListener('click', () => {
        showMessage('Google login is not configured yet. Please use your username and password.', 'error');
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username.length < 3) {
            showMessage('Username must be at least 3 characters long.');
            usernameInput.focus();
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.');
            passwordInput.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = window.CookChill.createSpinnerLabel('Logging in...');
        showMessage('Logging in...', 'success');

        try {
            const data = await window.CookChill.fetchJson('/login', {
                method: 'POST',
                body: JSON.stringify({
                    USERNAME: username,
                    PASSWORD: password,
                }),
            });

            showMessage(data.message || 'Login successful.', 'success');
            window.setTimeout(() => {
                window.location.href = nextPath || data.redirectTo || '/profile';
            }, 350);
        } catch (error) {
            console.error('Login error:', error);
            showMessage(window.CookChill.normalizeErrorMessage(error, 'Unable to log in right now.'));
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'LOGIN';
        }
    });
});
