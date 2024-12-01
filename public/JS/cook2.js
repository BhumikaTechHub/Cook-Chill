document.addEventListener('DOMContentLoaded', function () {
    // Recipe data
    const recipes = [
        { title: "Butter Chicken", tags: ["Non-Vegetarian", "Dinner", "Advanced", "Spicy"], src: "butter-chicken.jpg" },
        { title: "Vegan Tacos", tags: ["Vegan", "Lunch", "Beginner", "Quick"], src: "vegan-tacos.jpg" },
        { title: "Spaghetti Carbonara", tags: ["Non-Vegetarian", "Lunch", "Middle", "Creamy"], src: "spaghetti-carbonara.jpg" },
        { title: "Vegetable Stir Fry", tags: ["Vegan", "Dinner", "Beginner", "Quick"], src: "vegetable-stir-fry.jpg" },
        { title: "French Toast", tags: ["Vegetarian", "Breakfast", "Beginner", "Creamy"], src: "french-toast.jpg" },
        { title: "Sushi", tags: ["Non-Vegetarian", "Lunch", "Advanced", "Time-consuming"], src: "sushi.jpg" },
        { title: "Guacamole", tags: ["Vegan", "Snack", "Beginner", "Quick"], src: "guacamole.jpg" },
        { title: "Pav Bhaji", tags: ["Vegetarian", "Dinner", "Middle", "Spicy"], src: "pav-bhaji.jpg" },
        { title: "Crepes", tags: ["Vegetarian", "Breakfast", "Middle", "Dessert"], src: "crepes.jpg" },
        { title: "Paneer Butter Masala", tags: ["Vegetarian", "Lunch", "Middle", "Creamy"], src: "paneer-butter-masala.jpg" }
    ];

    const searchInput = document.querySelector('.search-input');
    const recipeListContainer = document.querySelector('.recipeList');
    const tags = document.querySelectorAll('.tag');

    // Function to display filtered recipes
    function displayRecipes(filteredRecipes) {
        // Clear the recipe container to avoid duplication
        recipeListContainer.innerHTML = '';

        // Add filtered recipes to the container
        filteredRecipes.forEach(recipe => {
            const img = document.createElement('img');
            img.src = `/images/${recipe.src}`;
            img.alt = recipe.title;
            img.classList.add('recipe-item');
            recipeListContainer.appendChild(img);
        });
    }

    // Display all recipes initially
    displayRecipes(recipes);

    // Filter recipes based on search input
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredRecipes = recipes.filter(recipe => recipe.title.toLowerCase().includes(searchTerm));
        displayRecipes(filteredRecipes);
    });

    // Filter recipes based on tags
    tags.forEach(tag => {
        tag.addEventListener('click', function () {
            const filterTerm = tag.textContent.toLowerCase();
            const filteredRecipes = recipes.filter(recipe =>
                recipe.tags.some(tag => tag.toLowerCase() === filterTerm)
            );
            displayRecipes(filteredRecipes);
        });
    });
});
