document.addEventListener('DOMContentLoaded', function () {
    // 1. Star Rating Selection
    const stars = document.querySelectorAll('.stars input');
    let selectedRating = 0;

    stars.forEach(star => {
        star.addEventListener('change', function (event) {
            selectedRating = event.target.value;
            updateStarStyles(selectedRating);
        });
    });

    function updateStarStyles(rating) {
        stars.forEach(star => {
            const label = star.nextElementSibling;
            if (star.value <= rating) {
                label.style.color = '#FFD700'; // Highlight selected stars in gold
            } else {
                label.style.color = '#ccc'; // Unselected stars are grey
            }
        });
    }

    // 2. Real-Time Feedback Chart Update
    const chartBars = document.querySelectorAll('.bar');
    const feedbackData = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    function updateFeedbackChart(rating) {
        feedbackData[rating]++;
        chartBars.forEach(bar => {
            const starCount = bar.getAttribute('data-stars');
            bar.style.width = `${feedbackData[starCount] * 20}%`;
        });
    }

    // 3. Form Submission and Validation
    const form = document.querySelector('.review-form form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const comment = form.querySelector('textarea').value.trim();

        if (selectedRating === 0) {
            alert('Please select a star rating.');
        } else if (comment === '') {
            alert('Please leave a comment.');
        } else {
            alert('Thank you for your feedback!');
            updateFeedbackChart(selectedRating);
            form.reset();
            updateStarStyles(0); // Reset star colors
        }
    });

    // 4. Smooth Scroll Navigation
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
