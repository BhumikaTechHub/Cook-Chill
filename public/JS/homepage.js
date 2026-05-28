document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/homepage');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to load homepage data.');
        }

        const aboutSection = document.querySelector('.text-content');
        if (aboutSection) {
            const titleElement = aboutSection.querySelector('h2');
            const descriptionElement = aboutSection.querySelector('.text1');

            if (titleElement) {
                titleElement.textContent = data.about.title;
            }

            if (descriptionElement) {
                descriptionElement.textContent = data.about.description;
            }
        }

        const featuredContainer = document.querySelectorAll('.box3, .boxbox4');
        featuredContainer.forEach((box, index) => {
            const featuredSection = data.featuredSections[index];
            if (!featuredSection) {
                return;
            }

            const image = box.querySelector('img');
            const text = box.querySelector('p');

            if (image) {
                image.src = `/IMAGES/${featuredSection.image}`;
                image.alt = featuredSection.text;
            }

            if (text) {
                text.textContent = featuredSection.text;
            }
        });

        const featureBoxes = document.querySelectorAll('.container .boxes1, .container .boxes2, .container .boxes3');
        featureBoxes.forEach((box, index) => {
            if (data.features[index]) {
                box.textContent = data.features[index];
            }
        });

        const reviewBoxes = document.querySelectorAll('.content-container .boxbox1, .content-container .boxbox2, .content-container .boxbox6');
        reviewBoxes.forEach((box, index) => {
            const paragraph = box.querySelector('p');
            if (paragraph && data.topReviews[index]) {
                paragraph.textContent = data.topReviews[index];
            }
        });

        const faqContainer = document.querySelector('.questions');
        if (faqContainer && Array.isArray(data.faqs)) {
            faqContainer.innerHTML = data.faqs
                .map((faq, index) => `<div class="ques${index + 1}">${faq}</div><hr>`)
                .join('');
        }

        const email = document.querySelector('.footer-left .email');
        const discover = document.querySelector('.footer-left .discover');

        if (email) {
            email.textContent = data.contact.email;
        }

        if (discover) {
            discover.textContent = data.contact.discoverText;
        }
    } catch (error) {
        console.error('Error loading homepage data:', error);
    }
});
