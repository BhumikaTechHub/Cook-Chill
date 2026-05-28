document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.querySelector('.search-input');
    const tags = document.querySelectorAll('.tag');
    const recipeSort = document.getElementById('recipeSort');
    const clearFiltersButton = document.getElementById('clearRecipeFilters');
    const recipeResultsCount = document.getElementById('recipeResultsCount');
    const pageStatus = document.getElementById('recipePageStatus');
    const recipeCards = [
        ...document.querySelectorAll('.recipe-card'),
        ...document.querySelectorAll('.recipeCard'),
    ];

    if (!searchInput || recipeCards.length === 0) {
        return;
    }

    const recipeMetadata = [
        { title: 'Pumpkin Soup', image: '/IMAGES/pumpkin soup.jpeg', tags: ['vegetarian', 'dinner', 'beginner', 'creamy'] },
        { title: 'Coleslaw Dressing', image: '/IMAGES/colesaw dressing.jpeg', tags: ['vegetarian', 'lunch', 'quick', 'dairy-free'] },
        { title: 'Brulle Cheese Cake', image: '/IMAGES/brulle cheese cake.jpeg', tags: ['dessert', 'vegetarian', 'advanced', 'creamy'] },
        { title: 'Dum Aloo', image: '/IMAGES/dum aloo.jpeg', tags: ['vegetarian', 'dinner', 'middle', 'spicy'] },
        { title: 'Ghugni', image: '/IMAGES/ghuguni.jpeg', tags: ['vegan', 'lunch', 'beginner', 'quick'] },
        { title: 'Dahi Vada', image: '/IMAGES/dahi vada.jpeg', tags: ['vegetarian', 'snack', 'middle', 'creamy'] },
        { title: 'Chicken Salad', image: '/IMAGES/chicken salad.jpeg', tags: ['non-vegetarian', 'lunch', 'beginner', 'quick'] },
        { title: 'Shrimp Pasta', image: '/IMAGES/shrimp pasta.jpeg', tags: ['non-vegetarian', 'dinner', 'advanced', 'creamy'] },
        { title: 'Butter Chicken', image: '/IMAGES/butter chicken.jpg', tags: ['non-vegetarian', 'dinner', 'middle', 'spicy'] },
        { title: 'Creamy Pasta', image: '/IMAGES/creamy pasta.jpeg', tags: ['vegetarian', 'dinner', 'middle', 'creamy'] },
        { title: 'Ras Malai', image: '/IMAGES/Rasmalai.jpeg', tags: ['dessert', 'vegetarian', 'advanced', 'creamy'] },
        { title: 'Pav Bhaji', image: '/IMAGES/pav bhaji.jpeg', tags: ['vegetarian', 'snack', 'beginner', 'spicy'] },
    ];

    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.hidden = true;
    emptyState.innerHTML = `
        <div>
            <h3>No recipe cards matched</h3>
            <p>Try a different keyword or clear the current filters.</p>
        </div>
    `;
    recipeCards[recipeCards.length - 1].parentElement?.after(emptyState);

    const applyFilter = () => {
        const filterValue = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        recipeCards.forEach((card, index) => {
            const metadata = recipeMetadata[index];
            if (!metadata) {
                return;
            }

            const matches = !filterValue
                || metadata.title.toLowerCase().includes(filterValue)
                || metadata.tags.some((tag) => tag.includes(filterValue));

            card.style.display = matches ? '' : 'none';
            if (matches) {
                visibleCount += 1;
            }
        });

        recipeResultsCount.textContent = `${visibleCount} recipe${visibleCount === 1 ? '' : 's'}`;
        emptyState.hidden = visibleCount !== 0;
    };

    const applySort = () => {
        const sortedEntries = [...recipeCards].map((card, index) => ({
            card,
            metadata: recipeMetadata[index],
        }));

        const mode = recipeSort?.value || 'featured';
        if (mode === 'az') {
            sortedEntries.sort((left, right) => left.metadata.title.localeCompare(right.metadata.title));
        } else if (mode === 'za') {
            sortedEntries.sort((left, right) => right.metadata.title.localeCompare(left.metadata.title));
        }

        sortedEntries.forEach(({ card }) => {
            card.parentElement?.appendChild(card);
        });
    };

    const debouncedFilter = window.CookChill.debounce(applyFilter, 200);

    searchInput.addEventListener('input', debouncedFilter);
    recipeSort?.addEventListener('change', () => {
        applySort();
        applyFilter();
    });

    tags.forEach((tag) => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent.trim();
            applyFilter();
        });
    });

    clearFiltersButton?.addEventListener('click', () => {
        searchInput.value = '';
        if (recipeSort) {
            recipeSort.value = 'featured';
        }
        applySort();
        applyFilter();
    });

    await Promise.all(recipeCards.map((card, index) => window.CookChill.attachFavoriteButton(card, {
        targetType: 'RECIPE',
        targetTitle: recipeMetadata[index].title,
        targetImage: recipeMetadata[index].image,
    }, {
        onError(message) {
            window.CookChill.setStatus(pageStatus, message, 'error');
        },
    })));

    applySort();
    applyFilter();
});
