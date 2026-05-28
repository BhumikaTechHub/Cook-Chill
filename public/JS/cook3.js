document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const ingredientsInput = document.getElementById('ingredients');
    const categorySelect = document.getElementById('category');
    const tagsInput = document.getElementById('tags');
    const addTagButton = document.querySelector('.add-tag');
    const uploadButton = document.getElementById('uploadButton');
    const recipeList = document.getElementById('recipeList');
    const recipeListLoading = document.getElementById('recipeListLoading');
    const recipeSort = document.getElementById('recipeSort');
    const statusElement = document.getElementById('recipeStatus');

    if (!titleInput || !descriptionInput || !ingredientsInput || !categorySelect || !tagsInput || !addTagButton || !uploadButton || !recipeList || !recipeListLoading) {
        return;
    }

    let tagsArray = [];
    let recipes = [];
    let editingRecipeId = null;

    function setStatus(message, tone = 'info') {
        window.CookChill.setStatus(statusElement, message, tone);
    }

    function renderTags() {
        const tagContainer = document.querySelector('.tags-input');
        if (!tagContainer) {
            return;
        }

        tagContainer.querySelectorAll('.tag-item').forEach((tag) => tag.remove());

        tagsArray.forEach((tag) => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'tag-item';
            tagSpan.textContent = tag;

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'delete-tag';
            deleteButton.textContent = 'x';
            deleteButton.addEventListener('click', () => {
                tagsArray = tagsArray.filter((existingTag) => existingTag !== tag);
                renderTags();
            });

            tagSpan.appendChild(deleteButton);
            tagContainer.insertBefore(tagSpan, addTagButton);
        });
    }

    function clearForm() {
        titleInput.value = 'UNTITLED RECIPE';
        descriptionInput.value = '';
        ingredientsInput.value = '';
        categorySelect.value = 'Breakfast';
        tagsInput.value = '';
        tagsArray = [];
        editingRecipeId = null;
        renderTags();
    }

    function getSortedRecipes(items) {
        const direction = recipeSort?.value || 'newest';
        const sortedItems = [...items];

        sortedItems.sort((a, b) => {
            const left = new Date(a.createdAt).getTime();
            const right = new Date(b.createdAt).getTime();
            return direction === 'oldest' ? left - right : right - left;
        });

        return sortedItems;
    }

    function renderRecipes() {
        recipeList.innerHTML = '';

        if (recipes.length === 0) {
            recipeList.innerHTML = `
                <div class="empty-state">
                    <div>
                        <h3>No recipes uploaded yet</h3>
                        <p>Create your first recipe to start building your collection.</p>
                    </div>
                </div>
            `;
            return;
        }

        getSortedRecipes(recipes).forEach((recipe) => {
            const recipeCard = document.createElement('div');
            recipeCard.className = 'recipe-card';

            recipeCard.innerHTML = `
                <div class="recipe-image"></div>
                <h3>${recipe.title}</h3>
                <p>${recipe.category}</p>
                <p>${recipe.tags.join(', ')}</p>
                <div class="recipe-actions">
                    <button type="button" class="secondary-button edit-action">Edit</button>
                    <button type="button" class="ghost-button delete-action">Delete</button>
                </div>
            `;

            recipeCard.querySelector('.edit-action')?.addEventListener('click', () => {
                titleInput.value = recipe.title;
                descriptionInput.value = recipe.description;
                ingredientsInput.value = recipe.ingredients;
                categorySelect.value = recipe.category;
                tagsArray = [...recipe.tags];
                editingRecipeId = recipe._id;
                renderTags();
                setStatus('Editing recipe. Update the fields and click Upload Recipe.', 'info');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            recipeCard.querySelector('.delete-action')?.addEventListener('click', async () => {
                try {
                    await window.CookChill.fetchJson(`/api/recipes/${recipe._id}`, {
                        method: 'DELETE',
                    });

                    recipes = recipes.filter((existingRecipe) => existingRecipe._id !== recipe._id);
                    renderRecipes();
                    setStatus('Recipe deleted successfully.', 'success');
                } catch (error) {
                    console.error('Delete recipe error:', error);
                    setStatus(window.CookChill.normalizeErrorMessage(error, 'Unable to delete recipe.'), 'error');
                }
            });

            recipeList.appendChild(recipeCard);
        });
    }

    function addTag() {
        const tagValue = tagsInput.value.trim();
        if (!tagValue || tagsArray.includes(tagValue)) {
            return;
        }

        tagsArray.push(tagValue);
        tagsInput.value = '';
        renderTags();
    }

    async function loadRecipes() {
        recipeListLoading.hidden = false;
        recipeListLoading.innerHTML = window.CookChill.createSpinnerLabel('Loading your recipes...');
        recipeList.innerHTML = '';

        try {
            const data = await window.CookChill.fetchJson('/api/recipes?mine=true&sort=newest');
            recipes = Array.isArray(data) ? data : [];
            renderRecipes();
        } catch (error) {
            console.error('Load recipes error:', error);
            recipeList.innerHTML = `
                <div class="empty-state">
                    <div>
                        <h3>Unable to load recipes</h3>
                        <p>${window.CookChill.normalizeErrorMessage(error, 'Please try again in a moment.')}</p>
                    </div>
                </div>
            `;
        } finally {
            recipeListLoading.hidden = true;
        }
    }

    async function saveRecipe(event) {
        event.preventDefault();

        const categoryValue = categorySelect.value === 'Select a Category' ? '' : categorySelect.value;
        const payload = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            ingredients: ingredientsInput.value.trim(),
            category: categoryValue,
            tags: [...tagsArray],
        };

        const requestUrl = editingRecipeId ? `/api/recipes/${editingRecipeId}` : '/api/recipes';
        const requestMethod = editingRecipeId ? 'PUT' : 'POST';

        uploadButton.disabled = true;
        uploadButton.innerHTML = window.CookChill.createSpinnerLabel(editingRecipeId ? 'Updating...' : 'Saving...');
        setStatus(editingRecipeId ? 'Updating recipe...' : 'Saving recipe...', 'info');

        try {
            const data = await window.CookChill.fetchJson(requestUrl, {
                method: requestMethod,
                body: JSON.stringify(payload),
            });

            if (editingRecipeId) {
                recipes = recipes.map((existingRecipe) => (
                    existingRecipe._id === data.recipe._id ? data.recipe : existingRecipe
                ));
            } else {
                recipes.unshift(data.recipe);
            }

            renderRecipes();
            clearForm();
            setStatus(data.message || 'Recipe saved successfully.', 'success');
        } catch (error) {
            console.error('Save recipe error:', error);
            setStatus(window.CookChill.normalizeErrorMessage(error, 'Unable to save recipe.'), 'error');
        } finally {
            uploadButton.disabled = false;
            uploadButton.textContent = 'Upload Recipe';
        }
    }

    addTagButton.addEventListener('click', addTag);
    tagsInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTag();
        }
    });
    uploadButton.addEventListener('click', saveRecipe);
    recipeSort?.addEventListener('change', renderRecipes);

    categorySelect.value = 'Breakfast';
    clearForm();
    loadRecipes();
});
