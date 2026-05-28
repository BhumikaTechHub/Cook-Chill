document.addEventListener('DOMContentLoaded', () => {
    const reviewPic = document.querySelector('.review-pic');
    const navLinks = document.querySelectorAll('nav ul li a');

    if (reviewPic) {
        reviewPic.addEventListener('mouseover', () => {
            reviewPic.style.transform = 'scale(1.1)';
            reviewPic.style.transition = 'transform 0.3s';
        });

        reviewPic.addEventListener('mouseleave', () => {
            reviewPic.style.transform = 'scale(1)';
        });

        reviewPic.addEventListener('click', openFeedbackForm);
    }

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            link.classList.add('clicked');
            setTimeout(() => link.classList.remove('clicked'), 300);
        });
    });

    createFeedbackForm();
});

function createFeedbackForm() {
    if (document.getElementById('feedback-form')) {
        return;
    }

    const popup = document.createElement('div');
    popup.id = 'feedback-form';
    popup.className = 'form-popup';
    popup.style.display = 'none';
    popup.innerHTML = `
        <h2>Submit Your Feedback</h2>
        <input type="text" id="user-name" placeholder="Enter your name">
        <textarea id="user-feedback" placeholder="Your feedback here..."></textarea>
        <p id="feedbackStatus" class="status-message" hidden></p>
        <button type="button" id="submitFeedbackBtn">Submit</button>
        <button type="button" id="closeFeedbackBtn">Close</button>
    `;

    document.body.appendChild(popup);

    document.getElementById('submitFeedbackBtn')?.addEventListener('click', submitFeedback);
    document.getElementById('closeFeedbackBtn')?.addEventListener('click', closeFeedbackForm);
}

function openFeedbackForm() {
    const popup = document.getElementById('feedback-form');
    if (popup) {
        popup.style.display = 'block';
    }
}

function closeFeedbackForm() {
    const popup = document.getElementById('feedback-form');
    if (popup) {
        popup.style.display = 'none';
    }
}

async function submitFeedback() {
    const name = document.getElementById('user-name')?.value.trim();
    const feedback = document.getElementById('user-feedback')?.value.trim();
    const submitButton = document.getElementById('submitFeedbackBtn');
    const status = document.getElementById('feedbackStatus');

    if (!name || !feedback) {
        window.CookChill.setStatus(status, 'Please enter your name and feedback before submitting.', 'error');
        return;
    }

    try {
        submitButton.disabled = true;
        submitButton.innerHTML = window.CookChill.createSpinnerLabel('Sending...');
        await window.CookChill.fetchJson('/api/reviews', {
            method: 'POST',
            body: JSON.stringify({
                targetType: 'GENERAL',
                targetTitle: `Account feedback from ${name}`,
                comment: feedback,
            }),
        });

        window.CookChill.setStatus(status, `Thank you, ${name}! Your feedback has been saved.`, 'success');
        document.getElementById('user-name').value = '';
        document.getElementById('user-feedback').value = '';
        window.setTimeout(closeFeedbackForm, 600);
    } catch (error) {
        if (error.status === 401) {
            window.CookChill.redirectToLogin('/review');
            return;
        }

        console.error('Feedback error:', error);
        window.CookChill.setStatus(status, window.CookChill.normalizeErrorMessage(error, 'We could not save your feedback right now.'), 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Submit';
    }
}
