(function attachCookAndChillCore(window, document) {
    const favoriteCache = {
        loaded: false,
        items: [],
    };

    function normalizeErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
        if (!error) {
            return fallback;
        }

        if (typeof error === 'string') {
            return error;
        }

        return error.message || fallback;
    }

    async function fetchJson(url, options = {}) {
        const response = await fetch(url, {
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            ...options,
        });

        const text = await response.text();

        console.log("STATUS:", response.status);
        console.log("RESPONSE:", text);

        let data = null;

        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        if (!response.ok) {
            const error = new Error(
                (data && data.message) ||
                text ||
                'Request failed.'
            );

            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    }

    function redirectToLogin(nextPath) {
        const next = nextPath || `${window.location.pathname}${window.location.search}`;
        window.location.href = `/login?next=${encodeURIComponent(next)}`;
    }

    async function requireAuthenticatedUser(options = {}) {
        const { redirectOnUnauthorized = true, forceRefresh = false } = options;

        if (!forceRefresh && window.__cookChillUser) {
            return window.__cookChillUser;
        }

        try {
            const data = await fetchJson('/api/profile');
            window.__cookChillUser = data.profile;
            return data.profile;
        } catch (error) {
            if (error.status === 401 && redirectOnUnauthorized) {
                redirectToLogin();
                return null;
            }

            throw error;
        }
    }

    async function logout() {
        await fetchJson('/logout', {
            method: 'POST',
        });

        window.__cookChillUser = null;
        favoriteCache.loaded = false;
        favoriteCache.items = [];
        window.location.href = '/login';
    }

    function setStatus(target, message, tone = 'info') {
        if (!target) {
            return;
        }

        target.textContent = message;
        target.dataset.tone = tone;
        target.hidden = !message;
    }

    function debounce(callback, wait = 250) {
        let timeoutId = null;

        return (...args) => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => callback(...args), wait);
        };
    }

    function createSpinnerLabel(label = 'Loading...') {
        return `
            <span class="inline-loader">
                <span class="spinner" aria-hidden="true"></span>
                <span>${label}</span>
            </span>
        `;
    }

    async function loadFavorites(forceRefresh = false) {
        if (favoriteCache.loaded && !forceRefresh) {
            return favoriteCache.items;
        }

        const data = await fetchJson('/api/favorites');
        favoriteCache.items = Array.isArray(data.favorites) ? data.favorites : [];
        favoriteCache.loaded = true;
        return favoriteCache.items;
    }

    function isFavoriteMatch(favorite, item) {
        return favorite.recipeId
            ? favorite.recipeId === item.recipeId
            : favorite.targetType === item.targetType && favorite.targetTitle === item.targetTitle;
    }

    async function saveFavorite(item) {
        const data = await fetchJson('/api/favorites', {
            method: 'POST',
            body: JSON.stringify(item),
        });

        favoriteCache.items = [data.favorite, ...favoriteCache.items.filter((favorite) => favorite._id !== data.favorite._id)];
        favoriteCache.loaded = true;
        return data.favorite;
    }

    async function removeFavorite(favoriteId) {
        await fetchJson(`/api/favorites/${favoriteId}`, {
            method: 'DELETE',
        });

        favoriteCache.items = favoriteCache.items.filter((favorite) => favorite._id !== favoriteId);
        favoriteCache.loaded = true;
    }

    function updateFavoriteButton(button, isActive) {
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
        button.innerHTML = isActive ? '&#10084;' : '&#9825;';
    }

    async function attachFavoriteButton(container, item, options = {}) {
        if (!container) {
            return;
        }

        container.style.position = container.style.position || 'relative';

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'favorite-toggle';
        button.setAttribute('aria-label', `Save ${item.targetTitle}`);
        button.innerHTML = '&#9825;';
        container.appendChild(button);

        let existingFavorite = null;

        try {
            const favorites = await loadFavorites();
            existingFavorite = favorites.find((favorite) => isFavoriteMatch(favorite, item)) || null;
            updateFavoriteButton(button, Boolean(existingFavorite));
        } catch (error) {
            if (error.status === 401) {
                button.addEventListener('click', () => redirectToLogin());
                return;
            }

            if (options.onError) {
                options.onError(normalizeErrorMessage(error));
            }
        }

        button.addEventListener('click', async () => {
            button.disabled = true;

            try {
                await requireAuthenticatedUser();
                if (existingFavorite) {
                    await removeFavorite(existingFavorite._id);
                    existingFavorite = null;
                } else {
                    existingFavorite = await saveFavorite(item);
                }

                updateFavoriteButton(button, Boolean(existingFavorite));
                if (options.onToggle) {
                    options.onToggle(Boolean(existingFavorite));
                }
            } catch (error) {
                if (error.status === 401) {
                    redirectToLogin();
                    return;
                }

                if (options.onError) {
                    options.onError(normalizeErrorMessage(error));
                }
            } finally {
                button.disabled = false;
            }
        });
    }

    window.CookChill = {
        attachFavoriteButton,
        createSpinnerLabel,
        debounce,
        fetchJson,
        loadFavorites,
        logout,
        normalizeErrorMessage,
        redirectToLogin,
        requireAuthenticatedUser,
        setStatus,
    };

    document.addEventListener('DOMContentLoaded', () => {
        const logoutButton = document.getElementById('logoutButton');
        if (logoutButton) {
            logoutButton.addEventListener('click', async () => {
                logoutButton.disabled = true;
                logoutButton.textContent = 'Logging Out...';

                try {
                    await logout();
                } catch (error) {
                    logoutButton.disabled = false;
                    logoutButton.textContent = 'Log Out';
                    window.alert(normalizeErrorMessage(error, 'Unable to log out right now.'));
                }
            });
        }
    });
}(window, document));
