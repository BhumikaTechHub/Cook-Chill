document.addEventListener('DOMContentLoaded', async () => {
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const fullNameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const dobInput = document.getElementById('dob');
    const profileStatus = document.getElementById('profileStatus');
    const passwordStatus = document.getElementById('passwordStatus');
    const usernameBadge = document.getElementById('profileUsernameBadge');
    const favoritesCount = document.getElementById('favoritesCount');
    const recipesCount = document.getElementById('recipesCount');
    const reviewsCount = document.getElementById('reviewsCount');
    const profileRecipes = document.getElementById('profileRecipes');
    const profileSaveButton = document.getElementById('profileSaveButton');
    const passwordSaveButton = document.getElementById('passwordSaveButton');

    if (!profileForm || !passwordForm || !fullNameInput || !emailInput || !phoneInput || !dobInput) {
        return;
    }

    function formatDate(value) {
        if (!value) {
            return '';
        }

        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return '';
        }

        return date.toISOString().slice(0, 10);
    }

    function renderManagedRecipes(recipes) {
        if (!profileRecipes) {
            return;
        }

        if (!recipes || recipes.length === 0) {
            profileRecipes.innerHTML = `
                <div class="empty-state">
                    <div>
                        <h3>No recipes uploaded yet</h3>
                        <p>Your recipe studio is ready when you are.</p>
                    </div>
                </div>
            `;
            return;
        }

        profileRecipes.innerHTML = recipes.map((recipe) => `
            <article class="managed-card">
                <div>
                    <h3>${recipe.title}</h3>
                    <p>${recipe.category}</p>
                    <p>${recipe.tags.join(', ')}</p>
                </div>
                <a class="secondary-button" href="/cook/upload">Manage</a>
            </article>
        `).join('');
    }

    try {
        const data = await window.CookChill.fetchJson('/api/profile');
        const profile = data.profile;

        usernameBadge.textContent = profile.USERNAME || 'Member';
        fullNameInput.value = profile.FULLNAME || '';
        emailInput.value = profile.EMAIL || '';
        phoneInput.value = profile.PHONE || '';
        dobInput.value = formatDate(profile.DATE_OF_BIRTH);

        favoritesCount.textContent = String((profile.favorites || []).length);
        recipesCount.textContent = String((profile.recipes || []).length);
        reviewsCount.textContent = String((profile.reviews || []).length);

        renderManagedRecipes(profile.recipes || []);
    } catch (error) {
        console.error('Profile load error:', error);
        window.CookChill.setStatus(profileStatus, window.CookChill.normalizeErrorMessage(error, 'Unable to load profile data.'), 'error');
    }

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        profileSaveButton.disabled = true;
        profileSaveButton.innerHTML = window.CookChill.createSpinnerLabel('Saving...');

        try {
            const data = await window.CookChill.fetchJson('/api/profile', {
                method: 'PUT',
                body: JSON.stringify({
                    FULLNAME: fullNameInput.value.trim(),
                    PHONE: phoneInput.value.trim(),
                    DATE_OF_BIRTH: dobInput.value,
                }),
            });

            emailInput.value = data.profile.EMAIL || emailInput.value;
            window.CookChill.setStatus(profileStatus, data.message || 'Profile updated successfully.', 'success');
        } catch (error) {
            console.error('Profile update error:', error);
            window.CookChill.setStatus(profileStatus, window.CookChill.normalizeErrorMessage(error, 'Unable to update profile.'), 'error');
        } finally {
            profileSaveButton.disabled = false;
            profileSaveButton.textContent = 'Save Profile';
        }
    });

    passwordForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const currentPassword = document.getElementById('currentPassword');
        const newPassword = document.getElementById('newPassword');

        passwordSaveButton.disabled = true;
        passwordSaveButton.innerHTML = window.CookChill.createSpinnerLabel('Updating...');

        try {
            const data = await window.CookChill.fetchJson('/api/profile/password', {
                method: 'PATCH',
                body: JSON.stringify({
                    CURRENT_PASSWORD: currentPassword.value,
                    NEW_PASSWORD: newPassword.value,
                }),
            });

            passwordForm.reset();
            window.CookChill.setStatus(passwordStatus, data.message || 'Password updated successfully.', 'success');
        } catch (error) {
            console.error('Password update error:', error);
            window.CookChill.setStatus(passwordStatus, window.CookChill.normalizeErrorMessage(error, 'Unable to update password.'), 'error');
        } finally {
            passwordSaveButton.disabled = false;
            passwordSaveButton.textContent = 'Update Password';
        }
    });
});
