// JavaScript code for your sign-up page
/*
// Password visibility toggle
const passwordInput = document.getElementById('password');
// const togglePassword = document.getElementById('togglePassword');

// togglePassword.addEventListener('click', () => {
//     // Toggle the input type between 'password' and 'text'
//     if (passwordInput.type === 'password') {
//         passwordInput.type = 'text';
//         togglePassword.textContent = '👁️'; // Change icon to monkey (hide)
//     } else {
//         passwordInput.type = 'password';
//         togglePassword.textContent = '🙈'; // Change icon to eye (show)
//     }
// });


document.addEventListener('DOMContentLoaded', () => {
    const signUpForm = document.getElementById('signup-form');
// Form validation on click of sign-up button

if (signUpForm) {
signUpForm.addEventListener('submit',async (event) => {
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

    try {
        // Send a POST request to the server
        const response = await fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ USERNAME:username, EMAIL:email, PASSWORD:password}),
        });

        // Handle the server's response
        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            window.location.href = '/login'; // Redirect to login page
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
    
});
}

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
if (togglePassword) {
    togglePassword.addEventListener('click', () => {
        const passwordInput = document.getElementById('password');
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;

        // Update icon or text for visibility toggle
        togglePassword.textContent = type === 'text' ? '🙈' : '👁️';
    });
}

// Google sign-up button demo click
const googleSignUpButton = document.getElementById('googleSignUp');
if (googleSignUpButton) {
googleSignUpButton.addEventListener('click', () => {
    window.open('https://accounts.google.com/signin', '_blank');
});
}
});

*/



document.addEventListener("DOMContentLoaded", function() {

class SignUpForm {
    constructor(formId, usernameId, emailId, passwordId) {
        this.form = document.getElementById(formId);
        this.usernameInput = document.getElementById(usernameId);
        this.emailInput = document.getElementById(emailId);
        this.passwordInput = document.getElementById(passwordId);

        // Bind methods
        this.bindEvents();
    }

    bindEvents() {
        // Listen for form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(e) {
        e.preventDefault();

        const username = this.usernameInput.value;
        const email = this.emailInput.value;
        const password = this.passwordInput.value;

        // Simple validation
        if (!username || !email || !password) {
            alert('All fields are required!');
            return;
        }

        try {
            const response = await this.submitForm(username, email, password);
            const data = await response.json();
            console.log("Response data:", data);  // Log the response for debugging

            if (response.ok) {
                alert(data.message);
                window.location.href = 'login.html'; // Redirect to login after successful sign-up
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
            alert('There was an error processing your request. Please try again.');
        }
    }

    async submitForm(username, email, password) {
        return fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ USERNAME: username, EMAIL: email, PASSWORD: password }),
        });
    }
}

// Initialize the sign-up form
const signUpForm = new SignUpForm('signup-form', 'username', 'email', 'password');
});