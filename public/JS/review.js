// Toggle Dark Mode
const toggleDarkMode = () => {
    document.body.classList.toggle("dark-mode");
    const theme = document.body.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
    alert(`You have switched to ${theme}`);
};

// Expanding Image Preview
const reviewPic = document.querySelector('.review-pic');

reviewPic.addEventListener('mouseover', () => {
    reviewPic.style.transform = 'scale(1.1)';
    reviewPic.style.transition = 'transform 0.3s';
});

reviewPic.addEventListener('mouseleave', () => {
    reviewPic.style.transform = 'scale(1)';
});

// Sidebar Navigation Click Animation
const navLinks = document.querySelectorAll('nav ul li a');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        link.classList.add('clicked');
        setTimeout(() => link.classList.remove('clicked'), 300);
    });
});

// Feedback Form Pop-up
const createFeedbackForm = () => {
    const formHtml = `
        <div id="feedback-form" class="form-popup">
            <h2>Submit Your Feedback</h2>
            <input type="text" id="user-name" placeholder="Enter your name">
            <textarea id="user-feedback" placeholder="Your feedback here..."></textarea>
            <button onclick="submitFeedback()">Submit</button>
            <button onclick="closeFeedbackForm()">Close</button>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', formHtml);
};

const openFeedbackForm = () => {
    document.getElementById('feedback-form').style.display = 'block';
};

const closeFeedbackForm = () => {
    document.getElementById('feedback-form').style.display = 'none';
};

const submitFeedback = () => {
    const name = document.getElementById('user-name').value;
    const feedback = document.getElementById('user-feedback').value;
    alert(`Thank you, ${name}! Your feedback: "${feedback}" has been received.`);
    closeFeedbackForm();
};

reviewPic.addEventListener('click', openFeedbackForm);

// Initialize Feedback Form
window.onload = () => {
    createFeedbackForm();
};


