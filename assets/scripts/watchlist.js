const movieContainer = document.getElementById('movie_cont')
let movieList = []
let currentRenderIndex = 0
let minusIcon = 'assets/images/minus-light.svg' // Default icon
let plusIcon = 'assets/images/plus-light.svg' // Default icon


document.addEventListener('DOMContentLoaded', () => {
    try {
        loadWatchlist()
    } catch (error) {
        console.error('Error initializing watchlist:', error);
        movieContainer.innerHTML = '<p class="text-center font-bold text-lg leading-[1.1] text-[#DFDDDD] dark:text-[#787878]">Failed to load watchlist. Please refresh the page.</p>';
    }
})

function loadWatchlist() {
    try {
        const storedMovies = JSON.parse(localStorage.getItem('watchlist')) || [];
        movieList = storedMovies;
        renderMovieList(movieList, true);
    } catch (error) {
        console.error('Error loading watchlist:', error);
        movieContainer.innerHTML = '<p class="text-center font-bold text-lg leading-[1.1] text-[#DFDDDD] dark:text-[#787878]">Failed to load watchlist. Please try again.</p>';
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
                <p class="text-center mb-3.5 font-bold text-lg leading-[1.1] text-[#DFDDDD] dark:text-[#787878]">Your watchlist is looking a little empty...</p>
                <a href="index.html" class="flex items-center gap-2 font-bold"><img src="${plusIcon}" alt="Go to search page"> Let’s add some movies!</a>
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
            movieCard.classList.add('movie_card', 'flex', 'gap-5', 'border-b-[1.5px]', 'border-[#E5E7EB]', 'py-[25px]', 'items-center')
            movieCard.innerHTML = `
                <div class="movie_poster_wrap w-[100px] min-w-[100px] max-w-[100px]">
                    <img src="${movie.Poster}" alt="${movie.Title} poster" class="movie_poster block h-auto w-[100px] min-w-[100px] max-w-[100px]">
                </div>
                <div class="movie_info flex flex-col gap-[9px]">
                    <div class="movie_title_rating flex gap-2 items-center">
                        <h2 class="movie_title text-lg text-black font-medium dark:text-white leading-[1.1]">${movie.Title}</h2>
                        <p class="movie_rating text-xs leading-[1.67] font-normal text-[#111827] dark:text-white">⭐ ${movie.imdbRating}</p>
                    </div>
                    <div class="movie flex gap-6 items-center">
                        <p class="movie_runtime text-xs leading-[1.67] font-normal text-[#111827] dark:text-white">${movie.Runtime}</p>
                        <p class="movie_genre text-xs leading-[1.67] font-normal text-[#111827] dark:text-white">${movie.Genre}</p>
                        <button class="remove_watchlist_btn text-xs cursor-pointer leading-[1.67] flex gap-[5px] items-center font-normal text-[#111827] dark:text-white"><img src="${minusIcon}" alt="Remove from Watchlist"> Remove</button>
                    </div>
                    <p class="movie_plot text-sm text-[#6B7280] font-normal dark:text-[#A5A5A5]">${movie.Plot}</p>
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
            viewMoreBtn.className = 'view_more_btn mt-3 cursor-pointer';
            viewMoreBtn.onclick = () => renderMovieList(movies);
            movieContainer.appendChild(viewMoreBtn);
        }
    } catch (error) {
        console.error('Error rendering watchlist:', error);
        movieContainer.innerHTML = '<p>Failed to render watchlist. Please try again.</p>';
    }
}

function setThemePlaceholder() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    minusIcon = isDark ? 'assets/images/minus-dark.svg' : 'assets/images/minus-light.svg';
    plusIcon = isDark ? 'assets/images/plus-dark.svg' : 'assets/images/plus-light.svg';
}
setThemePlaceholder();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setThemePlaceholder);