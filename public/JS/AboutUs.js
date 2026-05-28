document.addEventListener('DOMContentLoaded', () => {
    const joinButton = document.querySelector('.community button');

    if (!joinButton) {
        return;
    }

    joinButton.addEventListener('click', () => {
        alert("Thank you for joining our community! We're excited to have you.");
    });
});
