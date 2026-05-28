document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/chill1');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to load chill landing data.');
        }

        const siteTitle = document.querySelector('.site-title');
        if (siteTitle) {
            siteTitle.textContent = data.header.title;
        }

        const headerNav = document.querySelector('.header-nav');
        if (headerNav) {
            headerNav.innerHTML = data.header.navigation
                .map((navItem) => `<a href="${navItem.link}" class="header-button">${navItem.label}</a>`)
                .join('');
        }

        const discoverHeading = document.querySelector('.search-discover-box .content-part h2');
        const discoverDescription = document.querySelector('.search-discover-box .content-part p');
        const discoverImage = document.querySelector('.search-discover-box .image-part img');

        if (discoverHeading) {
            discoverHeading.textContent = data.mainContent.searchDiscoverBox.heading;
        }

        if (discoverDescription) {
            discoverDescription.textContent = data.mainContent.searchDiscoverBox.description;
        }

        if (discoverImage) {
            discoverImage.src = data.mainContent.searchDiscoverBox.image.src;
            discoverImage.alt = data.mainContent.searchDiscoverBox.image.alt;
            const discoverLink = discoverImage.closest('a');
            if (discoverLink) {
                discoverLink.href = data.mainContent.searchDiscoverBox.image.link;
            }
        }

        const infoText = document.querySelector('.info-section .info-text');
        const infoImage = document.querySelector('.info-section .image-placeholder img');

        if (infoText) {
            infoText.textContent = data.mainContent.infoSection.text;
        }

        if (infoImage) {
            infoImage.src = data.mainContent.infoSection.image.src;
            infoImage.alt = data.mainContent.infoSection.image.alt;
            const infoLink = infoImage.closest('a');
            if (infoLink) {
                infoLink.href = data.mainContent.infoSection.image.link;
            }
        }

        const footerText = document.querySelector('.footer p');
        const footerLinks = document.querySelector('.footer-links');

        if (footerText) {
            footerText.textContent = data.footer.text;
        }

        if (footerLinks) {
            footerLinks.innerHTML = data.footer.links
                .map((linkItem) => `<a href="${linkItem.link}">${linkItem.label}</a>`)
                .join('');
        }
    } catch (error) {
        console.error('Error fetching chill landing data:', error);
    }
});
