function joinCommunity() {
    alert("Thank you for joining our community! We're excited to have you.");
}


// Base class representing a Section on the About Page
class AboutSection {
    constructor(title, content, sectionId) {
        this.title = title;
        this.content = content;
        this.sectionId = sectionId;
    }

    // Abstraction: Display content for the section
    displaySection() {
        const section = document.getElementById(this.sectionId);
        section.innerHTML = `
            <h2>${this.title}</h2>
            <p>${this.content}</p>
        `;
    }
}

// Inheritance: A subclass for Key Features Section with specific content
class FeaturesSection extends AboutSection {
    constructor(title, featuresList, sectionId) {
        super(title, "", sectionId); // Call the parent constructor
        this.featuresList = featuresList;
    }

    // Polymorphism: Override the displaySection to handle specific features format
    displaySection() {
        const section = document.getElementById(this.sectionId);
        let featuresContent = '<ul>';
        this.featuresList.forEach(feature => {
            featuresContent += <li><strong>${feature.name}:</strong> ${feature.description}</li>;
        });
        featuresContent += '</ul>';
        section.innerHTML = `
            <h2>${this.title}</h2>
            ${featuresContent}
        `;
    }
}

// Class representing the Mission Section
class MissionSection extends AboutSection {
    constructor(title, content, sectionId) {
        super(title, content, sectionId);
    }

    // Polymorphism: You can override this method if specific behavior for Mission section is needed.
    displaySection() {
        super.displaySection(); // Use the base class behavior for now
    }
}

// Class representing the Community Section
class CommunitySection extends AboutSection {
    constructor(title, content, sectionId) {
        super(title, content, sectionId);
    }

    // Additional functionality for Community Section
    displaySection() {
        super.displaySection(); // Use the base class behavior
    }

    // Encapsulation: Method to handle the "Join Us" button click event
    joinCommunity() {
        alert("Thank you for joining our community! We're excited to have you.");
    }
}

// Class to represent the entire About Page
class AboutPage {
    constructor(mission, features, community) {
        this.missionSection = new MissionSection("Our Mission", mission, "missionSection");
        this.featuresSection = new FeaturesSection("Key Features", features, "featuresSection");
        this.communitySection = new CommunitySection("Join the Community", community, "communitySection");
    }

    // Method to initialize all sections of the page
    initializePage() {
        this.missionSection.displaySection();
        this.featuresSection.displaySection();
        this.communitySection.displaySection();
        document.querySelector('.community button').addEventListener("click", () => this.communitySection.joinCommunity());
    }
}

// Content for the sections
const missionContent = "At Cook and Chill, our mission is to create a fun and interactive space where food lovers and entertainment enthusiasts can connect, discover, and enjoy the latest trends in recipes, movies, shows, and books.";

const featuresContent = [
    { name: "Browse and Search", description: "Easily browse and search for recipes, movies, and more." },
    { name: "Submit and Review", description: "Share your favorite recipes or review movies, shows, and books." },
    { name: "Rate and Comment", description: "Engage with other users by rating and commenting on their submissions." }
];

const communityContent = "We believe in building a community where everyone has a voice. Whether you're a foodie, movie buff, or just looking for something new, Cook and Chill is here for you!";

// Initialize the AboutPage with content
const aboutPage = new AboutPage(missionContent, featuresContent, communityContent);
aboutPage.initializePage();