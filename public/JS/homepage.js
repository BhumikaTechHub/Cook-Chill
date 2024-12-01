// JavaScript code to fetch and update content based on JSON data

document.addEventListener("DOMContentLoaded", () => {
    // Load JSON data
    const data = {
        header: {
            title: "Cook & Chill",
            buttons: ["Home", "About", "Contact Us", "Login", "Sign Up"]
        },
        about: {
            title: "ABOUT US",
            description: "At Cook & Chill, our purpose is to showcase the best and most interesting aspects of arts and entertainment. We bring you the latest news, reviews, and features on everything from movies and TV shows."
        },
        featuredSections: [
            { image: "Cooking.webp", text: "Welcome to Delicious Cooking" },
            { image: "Korean Poetry.jpg", text: "Lights, Camera, Snack-tion" }
        ],
        features: [
            "Cook Whatever You Want, Anytime You Want!",
            "Upload Your Own Recipe and Share the Flavor!",
            "Give Reviews, Get Feedback, and Perfect Your Recipes!"
        ],
        topReviews: [
            "Top Reviews for All Your Entertainment Needs!",
            "Freely Share Your Thoughts on the Latest Movies!",
            "Genre-Specific Recommendations and More!"
        ],
        faqs: [
            "How can I upload my own recipe or review?",
            "How do I get feedback on my recipe or review?",
            "What types of recipes and entertainment reviews can I submit?",
            "How do you choose featured recipes or reviews?"
        ],
        contact: {
            email: "info@cookchill.com",
            discoverText: "Ready to Discover?"
        }
    };

   // Update header and navigation
   // Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.querySelector(".button-container");
    if (buttonContainer) {
        buttonContainer.innerHTML = data.header.buttons.map(
            (btn) => `<a href="${btn.toLowerCase().replace(/\s+/g, '')}.html" class="btn">${btn}</a>`
        ).join("");
    }

    // Attach event listeners to dynamically added buttons if necessary
    document.querySelectorAll(".btn").forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            const targetPage = button.getAttribute("href");
            window.location.href = targetPage;
        });
    });
});

 




    // Update About Us Section
    const aboutSection = document.querySelector(".text-content");
    aboutSection.querySelector("h2").textContent = data.about.title;
    aboutSection.querySelector(".text1").textContent = data.about.description;

    // Update Featured Sections
    const featuredContainer = document.querySelectorAll(".box3, .boxbox4");
    featuredContainer.forEach((box, index) => {
        box.querySelector("img").src = data.featuredSections[index].image;
        box.querySelector("p").textContent = data.featuredSections[index].text;
    });

    // Update Features
    const featureBoxes = document.querySelectorAll(".container .boxes1, .boxes2, .boxes3");
    featureBoxes.forEach((box, index) => {
        box.textContent = data.features[index];
    });

    // Update Top Reviews
    const reviewBoxes = document.querySelectorAll(".content-container .boxbox1, .boxbox2, .boxbox6");
    reviewBoxes.forEach((box, index) => {
        box.querySelector("p").textContent = data.topReviews[index];
    });

    // Update FAQs
    const faqContainer = document.querySelector(".questions");
    faqContainer.innerHTML = data.faqs.map(
        (faq, index) => `<div class="ques${index + 1}">${faq}</div><hr>`
    ).join("");

    // Update Footer Contact
    document.querySelector(".footer-left .email").textContent = data.contact.email;
    document.querySelector(".footer-left .discover").textContent = data.contact.discoverText;
});


