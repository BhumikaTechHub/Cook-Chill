document.addEventListener("DOMContentLoaded", () => {
    fetch("/api/chill1.json")
        .then(response => response.json())
        .then(data => {
            // Populate header section
            document.querySelector(".site-title").textContent = data.header.title;
          //  document.querySelector(".header").style.backgroundImage = url(${data.header.backgroundImage});

            const headerNav = document.querySelector(".header-nav");
            data.header.navigation.forEach(navItem => {
                const anchor = document.createElement("a");
                anchor.href = navItem.link;
                anchor.className = "header-button";
                anchor.textContent = navItem.label;
                headerNav.appendChild(anchor);
            });

            // Populate main content - Search Discover Box
            document.querySelector(".search-discover-box .content-part h2").textContent = data.mainContent.searchDiscoverBox.heading;
            document.querySelector(".search-discover-box .content-part p").textContent = data.mainContent.searchDiscoverBox.description;

            const searchDiscoverImage = document.querySelector(".search-discover-box .image-part img");
            searchDiscoverImage.src = data.mainContent.searchDiscoverBox.image.src;
            searchDiscoverImage.alt = data.mainContent.searchDiscoverBox.image.alt;
            searchDiscoverImage.closest("a").href = data.mainContent.searchDiscoverBox.image.link;
           

            // Populate Info Section
            document.querySelector(".info-section .info-text").textContent = data.mainContent.infoSection.text;

            const infoImage = document.querySelector(".info-section .image-placeholder img");
            infoImage.src = data.mainContent.infoSection.image.src;
            infoImage.alt = data.mainContent.infoSection.image.alt;
            infoImage.closest("a").href = data.mainContent.infoSection.image.link;

            // Populate footer
            document.querySelector(".footer p").textContent = data.footer.text;

            const footerLinks = document.querySelector(".footer-links");
            data.footer.links.forEach(linkItem => {
                const anchor = document.createElement("a");
                anchor.href = linkItem.link;
                anchor.textContent = linkItem.label;
                footerLinks.appendChild(anchor);
            });
        })
        
        .catch(error => console.error("Error fetching data:", error));
});
console.log("Data loaded successfully")