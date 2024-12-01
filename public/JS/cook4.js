document.addEventListener('DOMContentLoaded', function () {
    // 1. Add interactivity to feedback chart (highlight bars on hover)
    const bars = document.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseover', function () {
            bar.style.backgroundColor = '#FFAA00'; // Change color on hover
        });
        bar.addEventListener('mouseout', function () {
            bar.style.backgroundColor = ''; // Reset color after hover
        });
    });

    // 2. Add interactivity to star rating system
    const stars = document.querySelectorAll('.stars input');
    stars.forEach(star => {
        star.addEventListener('change', function () {
            const rating = document.querySelector('input[name="rating"]:checked').value;
            alert(`You selected ${rating} stars!`); // Show the selected rating
        });
    });

    // 3. Handle form submission with validation and alert
    const form = document.querySelector('.review-form form');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent default form submission
            const comment = form.querySelector('textarea').value.trim();
            const selectedRating = form.querySelector('input[name="rating"]:checked');

            if (!selectedRating || comment === '') {
                alert('Please select a rating and provide a comment.');
            } else {
                alert('Thank you for your feedback!');
                form.reset(); // Reset the form
            }
        });
    }

    // 4. Make footer social media icons clickable with interaction
    const svgs = document.querySelectorAll('.svgs svg');
    svgs.forEach(svg => {
        svg.addEventListener('click', function () {
            alert('Thank you for connecting with us!'); // Simple interaction on click
        });
    });
});
