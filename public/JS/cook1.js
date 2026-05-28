document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/cook1');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to load cook landing data.');
        }

        updateHeader(data.header);
        updateSections(data.sections);
        updateFooter(data.footer);
    } catch (error) {
        console.error('Error loading cook landing data:', error);
    }
});

function updateHeader(headerData) {
    const nav = document.querySelector('.header-nav');

    if (!nav || !Array.isArray(headerData?.links)) {
        return;
    }

    nav.innerHTML = headerData.links
        .map((link) => `<a href="${link.href}" class="header-button">${link.name}</a>`)
        .join('');
}

function updateSections(sections) {
    const sectionContainer = document.querySelector('#dynamic-sections');

    if (!sectionContainer || !Array.isArray(sections)) {
        return;
    }

    sectionContainer.innerHTML = sections
        .map((section) => `
            <section class="dynamic-section" style="background-color: ${section.bgColor};">
                <div class="content-part" style="font-size: ${section.fontSize}; color: ${section.textColor};">
                    <a href="${section.link}" style="color: ${section.textColor}; font-size: ${section.fontSize};">${section.text}</a>
                </div>
                <div class="image-part">
                    <img src="${section.image}" alt="${section.alt}" class="info-image">
                </div>
            </section>
        `)
        .join('');
}

function updateFooter(footerData) {
    if (!footerData) {
        return;
    }

    const discover = document.querySelector('.footer-left .discover');
    const email = document.querySelector('.footer-left .email');
    const policies = document.querySelector('.footer-right .policies');

    if (discover) {
        discover.textContent = footerData.discoverText;
    }

    if (email) {
        email.textContent = footerData.email;
    }

    if (policies && Array.isArray(footerData.policies)) {
        policies.innerHTML = footerData.policies
            .map((policy) => `<a href="${policy.href}">${policy.name}</a>`)
            .join('');
    }
}
