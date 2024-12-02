document.addEventListener("DOMContentLoaded", function () {

  class FormElement {
    constructor(inputId) {
      this.inputElement = document.getElementById(inputId);
    }

    // Encapsulation: Private method to set border color
    _setBorderColor(color) {
      this.inputElement.style.borderColor = color;
    }

    // Public method to handle focus
    handleFocus() {
      this._setBorderColor("#007BFF");
    }

    // Public method to handle blur
    handleBlur() {
      this._setBorderColor("");
    }
  }

  // Child Class: ValidatableFormElement (Inheritance)
  class ValidatableFormElement extends FormElement {
    constructor(inputId) {
      super(inputId);
    }

    // Encapsulation: Validate the input
    validate(minLength, errorMessage) {
      const value = this.inputElement.value.trim();
      if (value === "" || value.length < minLength) {
        this.displayError(errorMessage);
        return false;
      }
      return true;
    }

    // Polymorphism: Display error (overrides FormElement behavior)
    displayError(message) {
      this.clearErrors(); // Clear previous errors
      const error = document.createElement("small");
      error.className = "error";
      error.style.color = "red";
      error.textContent = message;
      this.inputElement.parentElement.insertBefore(error, this.inputElement.nextSibling);
    }

    // Clear errors
    clearErrors() {
      const error = this.inputElement.parentElement.querySelector(".error");
      if (error) error.remove();
    }
  }

  // Main Application Class
  class LoginForm {
    /* constructor(usernameId, passwordId, submitBtnId, googleBtnId) {
       this.usernameField = new ValidatableFormElement(usernameId); // Abstraction
       this.passwordField = new ValidatableFormElement(passwordId);
       this.submitBtn = document.querySelector(`.${submitBtnId}`);
       this.googleBtn = document.querySelector(`.${googleBtnId}`); */
    constructor(usernameId, passwordId, submitBtnClass, googleBtnClass) {
      this.usernameField = new ValidatableFormElement(usernameId);
      this.passwordField = new ValidatableFormElement(passwordId);
      this.submitBtn = document.querySelector(`.${submitBtnClass}`);
      this.googleBtn = document.querySelector(`.${googleBtnClass}`);


      console.log("Submit Button:", this.submitBtn); // Debug log
      console.log("Google Button:", this.googleBtn); // Debug log

      if (!this.submitBtn || !this.googleBtn) {
        console.error("One or more elements are not found in the DOM!");
        return; // Exit early if elements are missing
      }

      // Initialize Event Listeners
      this.initListeners();
    }
    /*
        // Encapsulation: Initialize all event listeners
        initListeners() {
          // Focus and blur animations
          this.usernameField.inputElement.addEventListener("focus", () => this.usernameField.handleFocus());
          this.passwordField.inputElement.addEventListener("focus", () => this.passwordField.handleFocus());
          this.usernameField.inputElement.addEventListener("blur", () => this.usernameField.handleBlur());
          this.passwordField.inputElement.addEventListener("blur", () => this.passwordField.handleBlur());
    
          // Submit button listener
          this.submitBtn.addEventListener("click", (e) => this.handleSubmit(e));
    
          // Google login button listener
          this.googleBtn.addEventListener("click", (e) => this.handleGoogleLogin(e));
        }
    
    */

    initListeners() {
      if (this.usernameField.inputElement && this.passwordField.inputElement) {
        this.usernameField.inputElement.addEventListener("focus", () => this.usernameField.handleFocus());
        this.passwordField.inputElement.addEventListener("focus", () => this.passwordField.handleFocus());
        this.usernameField.inputElement.addEventListener("blur", () => this.usernameField.handleBlur());
        this.passwordField.inputElement.addEventListener("blur", () => this.passwordField.handleBlur());
      } else {
        console.error("Username or password field is missing.");
      }

      if (this.submitBtn) {
        this.submitBtn.addEventListener("click", (e) => this.handleSubmit(e));
      } else {
        console.error("Submit button is missing.");
      }

      if (this.googleBtn) {
        this.googleBtn.addEventListener("click", (e) => this.handleGoogleLogin(e));
      } else {
        console.error("Google button is missing.");
      }
    }



    // Abstraction: Handle submit logic
    async handleSubmit(e) {
      e.preventDefault(); // Prevent default form submission

      // Validate inputs
      const isUsernameValid = this.usernameField.validate(3, "Username must be at least 3 characters long.");
      const isPasswordValid = this.passwordField.validate(6, "Password must be at least 6 characters long.");

      if (isUsernameValid && isPasswordValid) {
        alert("Login successful!");
        console.log("Username:", this.usernameField.inputElement.value);
        console.log("Password:", this.passwordField.inputElement.value);

        try {
          // Send a POST request to the server
          const response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ USERNAME: username, PASSWORD: password }),
          });

          // Handle the server's response
          const data = await response.json();
          if (response.ok) {
            alert('Login successful!');
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.error('Error:', error);
          alert('An error occurred. Please try again.');
        }
      }
    }

    // Abstraction: Handle Google login
    handleGoogleLogin(e) {
      e.preventDefault();
      alert("Redirecting to Google login...");
    }
  }

  // Instantiate the LoginForm class
  const loginForm = new LoginForm("username", "password", "submit-btn", "google-btn");
});