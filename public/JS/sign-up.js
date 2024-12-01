// JavaScript code for your sign-up page

// Password visibility toggle
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');

togglePassword.addEventListener('click', () => {
    // Toggle the input type between 'password' and 'text'
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        togglePassword.textContent = '👁️'; // Change icon to monkey (hide)
    } else {
        passwordInput.type = 'password';
        togglePassword.textContent = '🙈'; // Change icon to eye (show)
    }
});

// Form validation on click of sign-up button
const signUpButton = document.querySelector('.submit-btn');
signUpButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent form submission for demo purposes

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value.trim();

    // Basic validation checks
    if (!username || !email || !password) {
        alert('Please fill in all fields.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    alert('Sign-up successful!');
});

// Google sign-up button demo click
const googleSignUpButton = document.getElementById('googleSignUp');
googleSignUpButton.addEventListener('click', () => {
    window.open('https://accounts.google.com/signin', '_blank');
});