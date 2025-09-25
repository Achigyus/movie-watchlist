const movieContainer = document.getElementById('movie_cont')
let movieList = []
let currentRenderIndex = 0

document.addEventListener('DOMContentLoaded', () => {
    try {
        loadWatchlist()
    } catch (error) {
        console.error('Error initializing watchlist:', error);
        movieContainer.innerHTML = '<p>Failed to load watchlist. Please refresh the page.</p>';
    }
})

function loadWatchlist() {
    try {
        const storedMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
        movieList = storedMovies;
        renderMovieList(movieList, true);
    } catch (error) {
        console.error('Error loading watchlist:', error);
        movieContainer.innerHTML = '<p>Failed to load watchlist. Please try again.</p>';
    }
}

function renderMovieList(movies, reset = false) {
    try {
        if (reset) {
            movieContainer.innerHTML = '';
            currentRenderIndex = 0;
        }
        if (movies.length === 0) {
            movieContainer.innerHTML = `
                <p>Your watchlist is looking a little empty...</p>
                <a href="index.html"><img src="assets/icons/plus.svg" alt="Go to search page"> Let’s add some movies!</a>
            `;
            return;
        }
        
        // Remove existing "View More" button before rendering
        const existingBtn = document.getElementById('view_more_btn');

        if (existingBtn) existingBtn.remove();
        // Render next 5 movies
        const moviesToRender = movies.slice(currentRenderIndex, currentRenderIndex + 5);
        moviesToRender.forEach(movie => {
            const movieCard = document.createElement('div')
            movieCard.classList.add('movie_card')
            movieCard.innerHTML = `
                <div class="movie_poster_wrap">
                    <img src="${movie.Poster}" alt="${movie.Title} poster" class="movie_poster">
                </div>
                <div class="movie_info">
                    <div class="movie_title_rating">
                        <h2 class="movie_title">${movie.Title}</h2>
                        <p class="movie_rating">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="movie">
                        <p class="movie_runtime">${movie.Runtime}</p>
                        <p class="movie_genre">${movie.Genre}</p>
                        <button class="remove_watchlist_btn"><img src="assets/icons/minus.svg" alt="Remove from Watchlist"> Remove</button>
                    </div>
                    <p class="movie_plot">${movie.Plot}</p>
                </div>
            `
            movieCard.querySelector('.remove_watchlist_btn').addEventListener('click', async () => {
                try {
                    let movieInLocalStorage = JSON.parse(localStorage.getItem('watchlist')) || [];
                    if (!movieInLocalStorage.some(m => m.imdbID === movie.imdbID)) {
                        alert('Movie not found in watchlist');
                        return;
                    }
                    movieInLocalStorage = movieInLocalStorage.filter(m => m.imdbID !== movie.imdbID);
                    localStorage.setItem('watchlist', JSON.stringify(movieInLocalStorage));
                    movieList = movieInLocalStorage;
                    renderMovieList(movieList, true);
                    alert('Movie removed from watchlist');
                } catch (error) {
                    console.error('Error removing from watchlist:', error);
                    alert('Failed to remove movie from watchlist.');
                }
            })
            movieContainer.appendChild(movieCard)
        })
        currentRenderIndex += moviesToRender.length;

        // Add "View More" button if there are more movies to show
        if (currentRenderIndex < movies.length) {
            const viewMoreBtn = document.createElement('button');
            viewMoreBtn.id = 'view_more_btn';
            viewMoreBtn.textContent = 'View More';
            viewMoreBtn.className = 'view_more_btn';
            viewMoreBtn.onclick = () => renderMovieList(movies);
            movieContainer.appendChild(viewMoreBtn);
        }
    } catch (error) {
        console.error('Error rendering watchlist:', error);
        movieContainer.innerHTML = '<p>Failed to render watchlist. Please try again.</p>';
    }
}

