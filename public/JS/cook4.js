document.addEventListener('DOMContentLoaded', () => {
    const bars = document.querySelectorAll('.bar');
    const stars = document.querySelectorAll('.stars input');
    const form = document.getElementById('cookReviewForm');
    const status = document.getElementById('cookReviewStatus');
    const submitButton = document.getElementById('cookReviewButton');
    let selectedRating = 0;

    bars.forEach((bar) => {
        bar.addEventListener('mouseover', () => {
            bar.style.backgroundColor = '#FFAA00';
        });
        bar.addEventListener('mouseout', () => {
            bar.style.backgroundColor = '';
        });
    });

    stars.forEach((star) => {
        star.addEventListener('change', () => {
            selectedRating = Number(star.value);
        });
    });

    form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const comment = form.querySelector('textarea').value.trim();

        if (!selectedRating || !comment) {
            window.CookChill.setStatus(status, 'Please select a rating and provide a comment.', 'error');
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.innerHTML = window.CookChill.createSpinnerLabel('Submitting...');
            await window.CookChill.requireAuthenticatedUser();
            await window.CookChill.fetchJson('/api/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    targetType: 'GENERAL',
                    targetTitle: 'Cook Community Feedback',
                    comment,
                }),
            });

            await window.CookChill.fetchJson('/api/ratings', {
                method: 'POST',
                body: JSON.stringify({
                    targetType: 'RECIPE',
                    targetTitle: 'Cook Community Feedback',
                    value: selectedRating,
                }),
            });

            window.CookChill.setStatus(status, 'Thank you for your feedback!', 'success');
            form.reset();
            selectedRating = 0;
        } catch (error) {
            if (error.status === 401) {
                window.CookChill.redirectToLogin('/cook/reviews');
                return;
            }

            console.error('Cook review error:', error);
            window.CookChill.setStatus(status, window.CookChill.normalizeErrorMessage(error, 'Unable to submit feedback right now.'), 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });

    document.querySelectorAll('.svgs svg').forEach((svg) => {
        svg.addEventListener('click', () => {
            window.CookChill.setStatus(status, 'Thanks for exploring Cook and Chill with us.', 'info');
        });
    });
});
