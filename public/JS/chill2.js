document.addEventListener('DOMContentLoaded', async () => {
    const searchInput = document.querySelector('.search-input');
    const filterButtons = document.querySelectorAll('.filter-buttons button');
    const movieSort = document.getElementById('movieSort');
    const clearFiltersButton = document.getElementById('clearMovieFilters');
    const movieResultsCount = document.getElementById('movieResultsCount');
    const pageStatus = document.getElementById('moviePageStatus');
    const movieImages = [...document.querySelectorAll('.movie-list img')];
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');

    if (!searchInput || movieImages.length === 0) {
        return;
    }

    const movies = [
        { title: 'Dhamaal', image: '/IMAGES/dhamaal.jpeg', tags: ['comedy', '2007', 'hindi', 'movie'] },
        { title: 'Little Man', image: '/IMAGES/little man.jpeg', tags: ['comedy', '2006', 'english', 'movie'] },
        { title: 'Panchayat', image: '/IMAGES/panchayat.jpeg', tags: ['comedy', '2020', 'hindi', 'tv show'] },
        { title: 'Andhadhun', image: '/IMAGES/andhadun.jpg', tags: ['action', '2018', 'hindi', 'movie'] },
        { title: 'Mirzapur', image: '/IMAGES/mirzapur.jpeg', tags: ['action', '2018', 'hindi', 'web series'] },
        { title: 'Behind Her Eyes', image: '/IMAGES/behind her eyes.jpeg', tags: ['thriller', '2021', 'english', 'tv show'] },
        { title: 'Puaada', image: '/IMAGES/puaada.jpeg', tags: ['romance', '2021', 'punjabi', 'movie'] },
        { title: 'Kill', image: '/IMAGES/kill.jpg', tags: ['action', '2023', 'english', 'movie'] },
        { title: 'Radhe', image: '/IMAGES/radhe.jpeg', tags: ['action', '2021', 'hindi', 'movie'] },
        { title: '3 Idiots', image: '/IMAGES/3 idiots.jpeg', tags: ['comedy', '2009', 'hindi', 'movie'] },
        { title: 'Bahubali 2', image: '/IMAGES/bahubali 2.jpeg', tags: ['action', '2017', 'telugu', 'movie'] },
        { title: 'Carry On Jatta 2', image: '/IMAGES/carry on jatta 2.jpeg', tags: ['comedy', '2018', 'punjabi', 'movie'] },
    ];

    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.hidden = true;
    emptyState.innerHTML = `
        <div>
            <h3>No titles matched</h3>
            <p>Try another keyword or reset the active filters.</p>
        </div>
    `;
    movieImages[movieImages.length - 1].closest('.movie-section')?.after(emptyState);

    const applyFilter = () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        movieImages.forEach((image, index) => {
            const movie = movies[index];
            const matches = !searchTerm
                || movie.title.toLowerCase().includes(searchTerm)
                || movie.tags.some((tag) => tag.includes(searchTerm));

            image.style.display = matches ? '' : 'none';
            if (matches) {
                visibleCount += 1;
            }
        });

        movieResultsCount.textContent = `${visibleCount} pick${visibleCount === 1 ? '' : 's'}`;
        emptyState.hidden = visibleCount !== 0;
    };

    const applySort = () => {
        const groups = [...document.querySelectorAll('.movie-list')];
        const entries = groups.flatMap((group) => [...group.querySelectorAll('img')].map((image) => ({
            image,
            metadata: movies[movieImages.indexOf(image)],
        })));

        const mode = movieSort?.value || 'featured';
        if (mode === 'az') {
            entries.sort((left, right) => left.metadata.title.localeCompare(right.metadata.title));
        } else if (mode === 'za') {
            entries.sort((left, right) => right.metadata.title.localeCompare(left.metadata.title));
        } else if (mode === 'newest') {
            entries.sort((left, right) => {
                const leftYear = Number(left.metadata.tags.find((tag) => /^\d{4}$/.test(tag)) || 0);
                const rightYear = Number(right.metadata.tags.find((tag) => /^\d{4}$/.test(tag)) || 0);
                return rightYear - leftYear;
            });
        }

        if (mode !== 'featured') {
            const primaryGroup = groups[0];
            entries.forEach(({ image }) => primaryGroup.appendChild(image));
        }
    };

    const debouncedFilter = window.CookChill.debounce(applyFilter, 200);

    searchInput.addEventListener('input', debouncedFilter);
    movieSort?.addEventListener('change', () => {
        applySort();
        applyFilter();
    });

    filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
            searchInput.value = button.textContent.trim();
            applyFilter();
        });
    });

    clearFiltersButton?.addEventListener('click', () => {
        searchInput.value = '';
        if (movieSort) {
            movieSort.value = 'featured';
        }
        applySort();
        applyFilter();
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth' });
        });
    });

    await Promise.all(movieImages.map((image, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'media-card';
        image.parentElement.insertBefore(wrapper, image);
        wrapper.appendChild(image);

        return window.CookChill.attachFavoriteButton(wrapper, {
            targetType: 'ENTERTAINMENT',
            targetTitle: movies[index].title,
            targetImage: movies[index].image,
        }, {
            onError(message) {
                window.CookChill.setStatus(pageStatus, message, 'error');
            },
        });
    }));

    applySort();
    applyFilter();
});
