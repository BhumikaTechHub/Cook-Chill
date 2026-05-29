document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('site-feedback-form');
    const like = document.getElementById('like');
    const dislike = document.getElementById('dislike');
    const improve = document.getElementById('improve');
    const messageEl = document.getElementById('feedbackMessage');
    const submitBtn = document.getElementById('feedback-submit');

    if (!form) return;

    function setMessage(text, tone = 'error') {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.style.color = tone === 'error' ? '#c94141' : '#186a38';
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = window.CookChill.createSpinnerLabel('Submitting...');
        setMessage('Submitting your feedback...', 'success');

        const liked = like.value.trim();
        const disliked = dislike.value.trim();
        const suggested = improve.value.trim();

        if (!liked && !disliked && !suggested) {
            setMessage('Please provide at least one response.', 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Feedback';
            return;
        }

        const comment = `Feedback - Likes:\n${liked}\n\nDislikes:\n${disliked}\n\nSuggestions:\n${suggested}`;

        try {
            const data = await window.CookChill.fetchJson('/api/reviews', {
                method: 'POST',
                body: JSON.stringify({
                    comment,
                    targetTitle: 'Site feedback',
                    targetType: 'GENERAL',
                }),
            });

            setMessage(data.message || 'Thanks — feedback submitted!', 'success');
            form.reset();
        } catch (err) {
            console.error('Feedback submit error', err);
            setMessage(window.CookChill.normalizeErrorMessage(err, 'Unable to submit feedback right now.'), 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Feedback';
        }
    });
});
