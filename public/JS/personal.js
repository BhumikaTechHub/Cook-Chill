// Real-time validation for email and phone number
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const fullNameInput = document.getElementById("fullname");

// Regex patterns for validation
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;

// Function to validate email
emailInput.addEventListener("input", () => {
    if (emailPattern.test(emailInput.value)) {
        emailInput.style.borderColor = "#4CAF50"; // Green border for valid email
    } else {
        emailInput.style.borderColor = "#F44336"; // Red border for invalid email
    }
});

// Function to validate phone number
phoneInput.addEventListener("input", () => {
    if (phonePattern.test(phoneInput.value)) {
        phoneInput.style.borderColor = "#4CAF50"; // Green border for valid phone
    } else {
        phoneInput.style.borderColor = "#F44336"; // Red border for invalid phone
    }
});

// Dynamic welcome message
const welcomeMessage = document.createElement("h2");
const contentArea = document.querySelector(".content");
fullNameInput.addEventListener("blur", () => {
    const userName = fullNameInput.value.trim();
    if (userName) {
        welcomeMessage.textContent = `Welcome, ${userName}! Let's get started with your account.`;
        welcomeMessage.style.color = "#4CAF50";
        contentArea.insertBefore(welcomeMessage, contentArea.children[2]);
    }
});

// Highlight the active navigation section
const navLinks = document.querySelectorAll(".sidebar nav ul li a");

navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        navLinks.forEach((link) => link.parentElement.classList.remove("active"));
        event.target.parentElement.classList.add("active");
    });
});

// Tooltip for input fields
const inputFields = document.querySelectorAll(".input-field");
inputFields.forEach((input) => {
    input.addEventListener("focus", (event) => {
        const tooltip = document.createElement("span");
        tooltip.classList.add("tooltip");
        tooltip.textContent = `Please enter your ${event.target.placeholder.toLowerCase()}`;
        tooltip.style.position = "absolute";
        tooltip.style.backgroundColor = "#333";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "5px 10px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.top = `${event.target.getBoundingClientRect().top - 30}px`;
        tooltip.style.left = `${event.target.getBoundingClientRect().left}px`;
        tooltip.style.fontSize = "12px";
        tooltip.style.zIndex = "1000";
        tooltip.style.opacity = "0.8";
        document.body.appendChild(tooltip);

        input.addEventListener("blur", () => {
            tooltip.remove();
        });
    });
});
