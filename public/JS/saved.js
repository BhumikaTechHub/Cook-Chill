// Get the container of favorite items
const favoriteItemsContainer = document.querySelector(".favorites");

// Initialize the saved favorites array from localStorage
let savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Function to create the heart icon
function createHeartIcon(isSaved) {
    const heartIcon = document.createElement("span");
    heartIcon.className = "remove-btn";
    heartIcon.textContent = isSaved ? "💔" : "❤️"; // Show broken heart if saved, else heart icon
    return heartIcon;
}

// Initialize the favorite items with heart icons and saved status
function initializeFavorites() {
    // Get all the favorite items dynamically to avoid issues
    const favoriteItems = favoriteItemsContainer.querySelectorAll(".favorite-item");

    favoriteItems.forEach((item, index) => {
        // Check if the heart icon is already added to avoid duplicates
        if (!item.querySelector(".remove-btn")) {
            const isSaved = savedFavorites.includes(index);
            const heartIcon = createHeartIcon(isSaved);

            // Append the heart icon to the favorite item
            item.appendChild(heartIcon);

            // Mark the item as saved if it's in localStorage
            if (isSaved) {
                item.classList.add("saved");
            }

            // Add click event to toggle the favorite status
            heartIcon.addEventListener("click", () => toggleFavorite(item, index));
        }
    });
}

// Function to toggle favorite state
function toggleFavorite(item, index) {
    const heartIcon = item.querySelector(".remove-btn");

    if (item.classList.contains("saved")) {
        // Remove from saved status
        item.classList.remove("saved");
        heartIcon.textContent = "❤️"; // Set to heart icon
        // Remove index from localStorage array
        savedFavorites = savedFavorites.filter((fav) => fav !== index);
    } else {
        // Mark as saved
        item.classList.add("saved");
        heartIcon.textContent = "💔"; // Set to broken heart icon
        // Add index to localStorage array
        savedFavorites.push(index);
    }

    // Update localStorage
    localStorage.setItem("favorites", JSON.stringify(savedFavorites));
}

// Clear all saved favorites
function clearAllFavorites() {
    savedFavorites = [];
    localStorage.setItem("favorites", JSON.stringify(savedFavorites));
    const favoriteItems = favoriteItemsContainer.querySelectorAll(".favorite-item");
    favoriteItems.forEach((item) => {
        item.classList.remove("saved");
        const heartIcon = item.querySelector(".remove-btn");
        if (heartIcon) heartIcon.textContent = "❤️";
    });
}

// Initialize favorites on page load
initializeFavorites();

// Optional: Clear all favorites button
const clearButton = document.createElement("button");
clearButton.textContent = "Clear All Favorites";
clearButton.className = "clear-btn";
document.querySelector(".content").appendChild(clearButton);

clearButton.addEventListener("click", clearAllFavorites);

