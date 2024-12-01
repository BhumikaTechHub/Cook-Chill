// Wait for the document to fully load
document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const ingredientsInput = document.getElementById('ingredients');
    const categorySelect = document.getElementById('category');
    const tagsInput = document.getElementById('tags');
    const addTagButton = document.querySelector('.add-tag');
    const currentRecipesSection = document.querySelector('.current-recipes-section');

    let tagsArray = [];
    let recipes = [];

    // Function to add a tag to the list
    function addTag() {
        const tagValue = tagsInput.value.trim();
        if (tagValue && !tagsArray.includes(tagValue)) {
            tagsArray.push(tagValue);
            displayTags();
            tagsInput.value = ''; // Clear the input
        }
    }

    // Display tags below the input box
    function displayTags() {
        const tagContainer = document.querySelector('.tags-input');
        const existingTags = tagContainer.querySelectorAll('.tag-item');
        existingTags.forEach(tag => tag.remove());

        tagsArray.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.classList.add('tag-item');
            tagSpan.textContent = tag;

            // Add a delete button for each tag
            const deleteTagBtn = document.createElement('span');
            deleteTagBtn.textContent = ' ×';
            deleteTagBtn.classList.add('delete-tag');
            deleteTagBtn.addEventListener('click', () => removeTag(tag));

            tagSpan.appendChild(deleteTagBtn);
            tagContainer.insertBefore(tagSpan, addTagButton);
        });
    }

    // Function to remove a tag
    function removeTag(tag) {
        tagsArray = tagsArray.filter(t => t !== tag);
        displayTags();
    }

    // Handle tag addition on button click
    addTagButton.addEventListener('click', addTag);

    // Handle tag addition on pressing 'Enter'
    tagsInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
    });

    // Function to save a new recipe
    function saveRecipe() {
        const recipe = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            ingredients: ingredientsInput.value.trim(),
            category: categorySelect.value,
            tags: [...tagsArray]
        };

        if (validateRecipe(recipe)) {
            recipes.push(recipe);
            clearForm();
            displayRecipes();
        } else {
            alert('Please fill in all fields.');
        }
    }

    // Validate recipe inputs
    function validateRecipe(recipe) {
        return recipe.title && recipe.description && recipe.ingredients && recipe.category !== 'Select a Category' && recipe.tags.length > 0;
    }

    // Clear the form after saving a recipe
    function clearForm() {
        titleInput.value = 'UNTITLED RECIPE';
        descriptionInput.value = '';
        ingredientsInput.value = '';
        categorySelect.value = 'Select a Category';
        tagsArray = [];
        displayTags();
    }

    // Display the current recipes
    function displayRecipes() {
        const recipeContainer = currentRecipesSection;
        recipeContainer.innerHTML = '';

        if (recipes.length === 0) {
            recipeContainer.innerHTML = '<p>No recipes uploaded yet.</p>';
        } else {
            recipes.forEach((recipe, index) => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');

                const recipeImage = document.createElement('div');
                recipeImage.classList.add('recipe-image');
                recipeImage.innerHTML = `<img src="path/to/recipe-image.jpg" alt="${recipe.title}">`;
                recipeCard.appendChild(recipeImage);

                const recipeTitle = document.createElement('h3');
                recipeTitle.textContent = recipe.title;
                recipeCard.appendChild(recipeTitle);

                const recipeActions = document.createElement('div');
                recipeActions.classList.add('recipe-actions');
                const editButton = document.createElement('p');
                editButton.innerHTML = `Edit <span class="icon">&#9998;</span>`;
                editButton.addEventListener('click', () => editRecipe(index));

                const deleteButton = document.createElement('p');
                deleteButton.innerHTML = `Delete <span class="icon">&#10006;</span>`;
                deleteButton.addEventListener('click', () => deleteRecipe(index));

                recipeActions.appendChild(editButton);
                recipeActions.appendChild(deleteButton);
                recipeCard.appendChild(recipeActions);

                recipeContainer.appendChild(recipeCard);
            });
        }
    }

    // Function to delete a recipe
    function deleteRecipe(index) {
        recipes.splice(index, 1);
        displayRecipes();
    }

    // Function to edit a recipe
    function editRecipe(index) {
        const recipe = recipes[index];
        titleInput.value = recipe.title;
        descriptionInput.value = recipe.description;
        ingredientsInput.value = recipe.ingredients;
        categorySelect.value = recipe.category;
        tagsArray = [...recipe.tags];
        displayTags();

        // Remove the recipe from the list to update it after editing
        recipes.splice(index, 1);
    }

    // Attach event listener to the upload section
    const uploadSection = document.querySelector('.upload-section');
    uploadSection.addEventListener('click', saveRecipe);
});
