document.addEventListener('DOMContentLoaded', async () => {
    const favoritesGrid = document.getElementById('favoritesGrid');
    const favoritesLoading = document.getElementById('favoritesLoading');
    const favoritesEmpty = document.getElementById('favoritesEmpty');
    const favoritesStatus = document.getElementById('favoritesStatus');
    const refreshButton = document.getElementById('refreshFavoritesButton');

    if (!favoritesGrid || !favoritesLoading || !favoritesEmpty || !refreshButton) {
        return;
    }

    async function loadFavorites(forceRefresh = false) {
        favoritesLoading.hidden = false;
        favoritesLoading.innerHTML = window.CookChill.createSpinnerLabel('Loading your saved items...');
        favoritesGrid.hidden = true;
        favoritesEmpty.hidden = true;

        try {
            const favorites = await window.CookChill.loadFavorites(forceRefresh);

            if (!favorites.length) {
                favoritesEmpty.hidden = false;
                favoritesGrid.hidden = true;
                return;
            }

            favoritesGrid.innerHTML = favorites.map((favorite) => `
                <article class="favorite-item" data-favorite-id="${favorite._id}">
                    <img src="${favorite.targetImage || '/IMAGES/logo.png'}" alt="${favorite.targetTitle}">
                    <div class="favorite-card-body">
                        <span class="favorite-pill">${favorite.targetType}</span>
                        <h3>${favorite.targetTitle}</h3>
                        <div class="favorite-actions">
                            <button type="button" class="secondary-button remove-favorite-button">Remove</button>
                        </div>
                    </div>
                </article>
            `).join('');

            favoritesGrid.hidden = false;
            favoritesGrid.querySelectorAll('.remove-favorite-button').forEach((button) => {
                button.addEventListener('click', async () => {
                    const card = button.closest('[data-favorite-id]');
                    const favoriteId = card?.dataset.favoriteId;
                    if (!favoriteId) {
                        return;
                    }

                    button.disabled = true;
                    button.innerHTML = window.CookChill.createSpinnerLabel('Removing...');

                    try {
                        await window.CookChill.fetchJson(`/api/favorites/${favoriteId}`, {
                            method: 'DELETE',
                        });
                        window.CookChill.setStatus(favoritesStatus, 'Favorite removed successfully.', 'success');
                        await loadFavorites(true);
                    } catch (error) {
                        console.error('Favorite delete error:', error);
                        window.CookChill.setStatus(favoritesStatus, window.CookChill.normalizeErrorMessage(error, 'Unable to remove favorite.'), 'error');
                        button.disabled = false;
                        button.textContent = 'Remove';
                    }
                });
            });
        } catch (error) {
            console.error('Favorites load error:', error);
            window.CookChill.setStatus(favoritesStatus, window.CookChill.normalizeErrorMessage(error, 'Unable to load favorites.'), 'error');
            favoritesLoading.innerHTML = `
                <div class="empty-state">
                    <div>
                        <h2>Could not load favorites</h2>
                        <p>Please try again in a moment.</p>
                    </div>
                </div>
            `;
        } finally {
            favoritesLoading.hidden = false;
            if (!favoritesGrid.hidden || !favoritesEmpty.hidden) {
                favoritesLoading.hidden = true;
            }
        }
    }

    refreshButton.addEventListener('click', () => loadFavorites(true));

    await loadFavorites(true);
});
