document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/cook1.json")
        .then(response => response.json())
        .then(data => {
            updateHeader(data.header);
            updateSections(data.sections);
            updateFooter(data.footer);
        })
        .catch(error => console.error("Error loading JSON:", error));
});

function updateHeader(headerData) {
    const nav = document.querySelector(".header-nav");
    nav.innerHTML = headerData.links
        .map(link => `<a href="${link.href}" class="header-button">${link.name}</a>`)
        .join("");
}

function updateSections(sections) {
    const sectionContainer = document.querySelector("#dynamic-sections");
    sectionContainer.innerHTML = sections
        .map(
            section => `
            <section class="dynamic-section" style="background-color: ${section.bgColor};">
                <div class="content-part" style="font-size: ${section.fontSize}; color: ${section.textColor};">
                    <a href="${section.link}" style="color: ${section.textColor}; font-size: ${section.fontSize};">${section.text}</a>
                </div>
                <div class="image-part">
                    <img src="${section.image}" alt="${section.alt}" class="info-image">
                </div>
            </section>`
        )
        .join("");
}



function updateFooter(footerData) {
    document.querySelector(".footer-left .discover").textContent = footerData.discoverText;
    document.querySelector(".footer-left .email").textContent = footerData.email;

    const policies = footerData.policies
        .map(policy => `<a href="${policy.href}">${policy.name}</a>`)
        .join("");
    document.querySelector(".footer-right .policies").innerHTML = policies;

    const svgs = footerData.socialIcons
        .map(icon => `<img src="${icon.icon}" alt="social icon" onclick="window.open('${icon.link}', '_blank')" />`)
        .join("");
    document.querySelector(".footer-right .svgs").innerHTML = svgs;
}
