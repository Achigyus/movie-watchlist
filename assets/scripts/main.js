console.log("Script loaded")

const form = document.getElementById('search_movie')
const input = document.getElementById('movie_input')
const movieContainer = document.getElementById('movie_cont')
let movieList = []
let currentRenderIndex = 0

form.addEventListener('submit', handleFormSubmit)

// Access OMDB API key from Vite environment variable
const movieApiKey = import.meta.env.VITE_OMDB_API_KEY;

async function handleFormSubmit(e) {
    e.preventDefault();
    const movieName = input.value.trim();
    if (!movieName) {
        movieContainer.innerHTML = '<p>Unable to find what you’re looking for. Please try another search.</p>'
        return;
    }
    console.log('Form submitted');
    movieContainer.innerHTML = '<p>Loading...</p>';
    try {
        await fetchMovieDetails(movieName);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        movieContainer.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

async function fetchMovieDetails(movieName) {
    try {
        // Fetch movie data from OMDB API
        const response = await fetch(`https://www.omdbapi.com/?apikey=${movieApiKey}&s=${encodeURIComponent(movieName)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log(data);

        if (!data.Search) {
            movieContainer.innerHTML = '<p>No movies found.</p>';
            return;
        }

        // Fetch details for each movie in parallel
        const detailPromises = data.Search.map(movie =>
            fetch(`https://www.omdbapi.com/?apikey=${movieApiKey}&i=${movie.imdbID}`)
                .then(res => {
                    if (!res.ok) throw new Error('Network response was not ok');
                    return res.json();
                })
                .catch(err => {
                    console.error(`Error fetching details for ${movie.imdbID}:`, err);
                    return null;
                })
        );
        let moviesWithDetails = await Promise.all(detailPromises);
        moviesWithDetails = moviesWithDetails.filter(Boolean);

        // Clear previous list and render new results
        movieList = moviesWithDetails;
        currentRenderIndex = 0;
        renderMovieList(movieList, true);
    } catch (error) {
        console.error('Error in fetchMovieDetails:', error);
        movieContainer.innerHTML = '<p>Failed to fetch movies. Please check your connection or try again later.</p>';
    }
}

function renderMovieList(movies, reset = false) {
    try {
        if (reset) {
            movieContainer.innerHTML = '';
            currentRenderIndex = 0;
        }
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
                        <button class="add_watchlist_btn"><img src="assets/icons/plus.svg" alt="Add to Watchlist"> Watchlist</button>
                    </div>
                    <p class="movie_plot">${movie.Plot}</p>
                </div>
            `
            movieCard.querySelector('.add_watchlist_btn').addEventListener('click', async () => {
                try {
                    let movieInLocalStorage = JSON.parse(localStorage.getItem('watchlist')) || [];
                    if (movieInLocalStorage.some(m => m.imdbID === movie.imdbID)) {
                        alert('Movie already in watchlist');
                        return;
                    }
                    movieInLocalStorage.push(movie);
                    localStorage.setItem('watchlist', JSON.stringify(movieInLocalStorage));
                    alert('Movie added to watchlist');
                } catch (error) {
                    console.error('Error adding to watchlist:', error);
                    alert('Failed to add movie to watchlist.');
                }
            })
            movieContainer.appendChild(movieCard)
        })
        currentRenderIndex += moviesToRender.length;

        // Add "View More" button if there are more movies to show
        const existingBtn = document.getElementById('view_more_btn');
        if (currentRenderIndex < movies.length) {
            if (!existingBtn) {
                const viewMoreBtn = document.createElement('button');
                viewMoreBtn.id = 'view_more_btn';
                viewMoreBtn.textContent = 'View More';
                viewMoreBtn.className = 'view_more_btn';
                viewMoreBtn.onclick = () => renderMovieList(movies);
                movieContainer.appendChild(viewMoreBtn);
            }
        } else if (existingBtn) {
            existingBtn.remove();
        }
    } catch (error) {
        console.error('Error rendering movie list:', error);
        movieContainer.innerHTML = '<p>Failed to render movies. Please try again.</p>';
    }
}
