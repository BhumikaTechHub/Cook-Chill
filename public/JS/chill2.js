document.addEventListener('DOMContentLoaded', function () {
    // Movie class representing individual movie objects
    class Movie {
        constructor(title, genre, year, language, type, src) {
            this.title = title;
            this.genre = genre;
            this.year = year;
            this.language = language;
            this.type = type;
            this.src = src;
        }
    }


    // Subclass for FeaturedMovie (Inheritance)
    class FeaturedMovie extends Movie {
        constructor(title, genre, year, language, type, src, isTopRated) {
            super(title, genre, year, language, type, src); // Reusing the Movie class constructor
            this.isTopRated = isTopRated; // Additional property specific to FeaturedMovie
        }

        // Method to display additional details for FeaturedMovie
        displayFeature() {
            return `${this.title} is one of the top-rated movies in the ${this.genre} genre!`;
        }
    }

    // MovieList class for managing the movie collection and operations
    class MovieList {
        constructor() {
            this.movies = [];
        }

        addMovie(movie) {
            this.movies.push(movie);
        }
        // Polymorphism: Overloaded methods for filtering movies
        filterMovies(filterKey, filterValue) {
            // General filtering method
            return this.movies.filter(movie => movie[filterKey].toLowerCase() === filterValue.toLowerCase());
        }

        filterMovies(filterKey, minValue, maxValue) {
            // Overloaded method for range-based filtering (e.g., years or ratings)
            if (filterKey === 'year') {
                return this.movies.filter(movie => movie.year >= minValue && movie.year <= maxValue);
            }
            return [];
        }

        searchMovies(searchTerm) {
            return this.movies.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm)
            );
        }

        filterMovies(filterTerm) {
            return this.movies.filter(movie =>
                movie.genre.toLowerCase() === filterTerm ||
                movie.year === filterTerm ||
                movie.language.toLowerCase() === filterTerm ||
                movie.type.toLowerCase() === filterTerm
            );
        }
    }

    // UI class for handling DOM manipulations
    class UI {
        static displayMovies(movieContainer, movies) {
            movieContainer.innerHTML = ''; // Clear previous movies

            if (movies.length === 0) {
                const noResult = document.createElement('p');
                noResult.textContent = 'No movies found';
                movieContainer.appendChild(noResult);
                return;
            }

            movies.forEach(movie => {
                const img = document.createElement('img');
                img.src = `/images/${movie.src}`;
                img.alt = movie.title;
                img.classList.add('movie-item');
                movieContainer.appendChild(img);
            });
        }
    }
     // Initialize movie list and add movie data
     const movieList = new MovieList();
     const movieData = [
         new Movie("Dhamaal", "Comedy", "2007", "Hindi", "Movie", "dhamaal.jpeg"),
         new Movie("Little Man", "Comedy", "2006", "English", "Movie", "little man.jpeg"),
         new Movie("Panchayat", "Comedy", "2020", "Hindi", "TV Show", "panchayat.jpeg"),
         new Movie("Andhadhun", "Action", "2018", "Hindi", "Movie", "andhadun.jpg"),
         new Movie("Mirzapur", "Action", "2018", "Hindi", "Web Series", "mirzapur.jpeg"),
         new Movie("Behind Her Eyes", "Thriller", "2021", "English", "TV Show", "behind her eyes.jpeg"),
         new Movie("Puaada", "Romance", "2021", "Punjabi", "Movie", "puaada.jpeg"),
         new Movie("Kill", "Action", "2023", "English", "Movie", "kill.jpg"),
         new Movie("Radhe", "Action", "2021", "Hindi", "Movie", "radhe.jpeg"),
         new Movie("3 Idiots", "Comedy", "2009", "Hindi", "Movie", "3 idiots.jpeg"),
         new Movie("Bahubali 2", "Action", "2017", "Telugu", "Movie", "bahubali 2.jpeg"),
         new Movie("Carry On Jatta 2", "Comedy", "2018", "Punjabi", "Movie", "carry on jatta 2.jpeg")
     ];
 
     movieData.forEach(movie => movieList.addMovie(movie));
 
     // Select DOM elements
     const searchInput = document.querySelector('.search-input');
     const movieListContainer = document.querySelector('.movieList');
     const filterButtons = document.querySelectorAll('.filter-buttons button');
 
     // Initial display of all movies
     UI.displayMovies(movieListContainer, movieList.movies);
 
     // Filtering featured movies (additional property isTopRated)
     const featuredMovies = movieList.movies.filter(movie => movie instanceof FeaturedMovie && movie.isTopRated);
     featuredMovies.forEach(movie => console.log(movie.displayFeature()));
 
     // Filtering movies by year range (Polymorphism)
     const recentMovies = movieList.filterMovies('year', 2010, 2020);
     UI.displayMovies(movieListContainer, recentMovies);
 
     // Search functionality
     searchInput.addEventListener('input', function () {
         const searchTerm = searchInput.value.toLowerCase();
         const filteredMovies = movieList.searchMovies(searchTerm);
         UI.displayMovies(movieListContainer, filteredMovies);
     });
 
     // Filter functionality
     filterButtons.forEach(button => {
         button.addEventListener('click', function () {
             const filterTerm = button.textContent.toLowerCase();
             const filteredMovies = movieList.filterMovies(filterTerm);
             UI.displayMovies(movieListContainer, filteredMovies);
         });
     });
 
     // Smooth scroll for navigation links
     document.querySelectorAll('.nav a').forEach(link => {
         link.addEventListener('click', function (e) {
             e.preventDefault();
             const targetSection = document.querySelector(link.getAttribute('href'));
             if (targetSection) {
                 targetSection.scrollIntoView({ behavior: 'smooth' });
             }
         });
     });
 });