document.addEventListener('DOMContentLoaded', () => {
    const stars = document.querySelectorAll('.stars input');
    const chartBars = document.querySelectorAll('.bar');
    const form = document.getElementById('chillReviewForm');
    const navLinks = document.querySelectorAll('.nav-links a');
    const status = document.getElementById('chillReviewStatus');
    const submitButton = document.getElementById('chillReviewButton');
    const feedbackData = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let selectedRating = 0;

    const updateStarStyles = (rating) => {
        stars.forEach((star) => {
            const label = star.nextElementSibling;
            label.style.color = Number(star.value) <= rating ? '#FFD700' : '#ccc';
        });
    };

    const updateFeedbackChart = (rating) => {
        feedbackData[rating] += 1;
        chartBars.forEach((bar) => {
            const starCount = bar.getAttribute('data-stars');
            bar.style.width = `${Math.max(feedbackData[starCount] * 18, 8)}%`;
        });
    };

    stars.forEach((star) => {
        star.addEventListener('change', (event) => {
            selectedRating = Number(event.target.value);
            updateStarStyles(selectedRating);
        });
    });

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const comment = form.querySelector('textarea').value.trim();

        if (!selectedRating) {
            window.CookChill.setStatus(status, 'Please select a star rating.', 'error');
            return;
        }

        if (!comment) {
            window.CookChill.setStatus(status, 'Please leave a comment.', 'error');
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.innerHTML = window.CookChill.createSpinnerLabel('Submitting...');
            await window.CookChill.requireAuthenticatedUser();
            await window.CookChill.fetchJson('/api/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    targetType: 'ENTERTAINMENT',
                    targetTitle: 'Chill Community Feedback',
                    comment,
                }),
            });

            await window.CookChill.fetchJson('/api/ratings', {
                method: 'POST',
                body: JSON.stringify({
                    targetType: 'ENTERTAINMENT',
                    targetTitle: 'Chill Community Feedback',
                    value: selectedRating,
                }),
            });

            updateFeedbackChart(selectedRating);
            window.CookChill.setStatus(status, 'Thank you for your feedback!', 'success');
            form.reset();
            selectedRating = 0;
            updateStarStyles(0);
        } catch (error) {
            if (error.status === 401) {
                window.CookChill.redirectToLogin('/chill/reviews');
                return;
            }

            console.error('Chill review error:', error);
            window.CookChill.setStatus(status, window.CookChill.normalizeErrorMessage(error, 'Unable to submit your review right now.'), 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            if (!link.getAttribute('href').startsWith('#')) {
                return;
            }

            event.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            targetSection?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});
