document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        alert("Thank you for reaching out! We'll get back to you soon.");
        form.reset();
    });
});
