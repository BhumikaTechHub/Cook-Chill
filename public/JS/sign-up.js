document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageElement = document.getElementById('signupMessage');
    const submitButton = document.getElementById('signupButton');

    if (!form || !usernameInput || !emailInput || !passwordInput) {
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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (username.length < 3) {
            showMessage('Username must be at least 3 characters long.');
            usernameInput.focus();
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showMessage('Please enter a valid email address.');
            emailInput.focus();
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.');
            passwordInput.focus();
            return;
        }

        submitButton.disabled = true;
        submitButton.innerHTML = window.CookChill.createSpinnerLabel('Creating...');
        showMessage('Creating your account...', 'success');

        try {
            const data = await window.CookChill.fetchJson('/signup', {
                method: 'POST',
                body: JSON.stringify({
                    USERNAME: username,
                    EMAIL: email,
                    PASSWORD: password,
                }),
            });

            showMessage(data.message || 'User signed up successfully.', 'success');
            window.setTimeout(() => {
                window.location.href = data.redirectTo || '/login';
            }, 600);
        } catch (error) {
            console.error('Signup error:', error);
            showMessage(window.CookChill.normalizeErrorMessage(error, 'There was an error processing your request. Please try again.'));
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'SIGN UP';
        }
    });
});
