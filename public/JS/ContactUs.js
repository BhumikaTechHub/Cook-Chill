class ContactForm {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.name = this.form.querySelector("#name");
        this.email = this.form.querySelector("#email");
        this.message = this.form.querySelector("#message");
    }

    submitForm(event) {
        event.preventDefault();
        alert("Thank you for reaching out! We'll get back to you soon.");
        this.resetForm();
    }

    resetForm() {
        this.form.reset();
    }
}

// Inheritance: Creating a subclass for a "Featured Contact Form" with additional properties
class FeaturedContactForm extends ContactForm {
    constructor(formId, specialMessage) {
        super(formId); // Call the parent class constructor
        this.specialMessage = specialMessage; // New property for Featured Contact Form
    }

    // Overriding the parent method (Polymorphism)
    submitForm(event) {
        super.submitForm(event); // Call the parent method
        this._displaySpecialMessage();
    }

    // Additional functionality for Featured Contact Form
    _displaySpecialMessage() {
        alert(this.specialMessage);
    }
}


// Class representing the Contact Information section
class ContactInfo {
    constructor(address, email, phone, socialLinks) {
        this.address = address;
        this.email = email;
        this.phone = phone;
        this.socialLinks = socialLinks;
    }

    displayInfo() {
        const infoSection = document.getElementById("contactInfoSection");
        infoSection.innerHTML = `
            <h2>Contact Information</h2>
            <p><strong>Address:</strong> ${this.address}</p>
            <p><strong>Email:</strong> ${this.email}</p>
            <p><strong>Phone:</strong> ${this.phone}</p>
            <div class="social-links">
                <h3>Follow Us</h3>
                ${this.socialLinks.map(link => <a href="${link.href}" target="_blank">${link.name}</a>).join(' ')}
            </div>
        `;
    }
}

// Class representing the Contact Us Page
class ContactUsPage {
    constructor(formId, address, email, phone, socialLinks) {
        this.contactForm = new ContactForm(formId);
        this.contactInfo = new ContactInfo(address, email, phone, socialLinks);
    }

    initializePage() {
        this.contactForm.form.addEventListener("submit", (event) => this.contactForm.submitForm(event));
        this.contactInfo.displayInfo();
    }
}

// Initialize the page with the given contact info
const socialLinks = [
    { name: "Facebook", href: "https://facebook.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "Twitter", href: "https://twitter.com" }
];

const contactUsPage = new ContactUsPage("contactForm", "123 Cook Street, Flavor Town", "support@cookandchill.com", "+123-456-7890", socialLinks);
contactUsPage.initializePage();