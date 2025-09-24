console.log("Script loaded")

const form = document.getElementById('search_movie')
const input = document.getElementById('movie_input')
const movieContainer = document.getElementById('movie_cont')
let movieList = []
let currentRenderIndex = 0

form.addEventListener('submit', handleFormSubmit)

const individualMovie = {
  "Title": "Iron Man",
  "Year": "2008",
  "Rated": "PG-13",
  "Released": "02 May 2008",
  "Runtime": "126 min",
  "Genre": "Action, Adventure, Sci-Fi",
  "Director": "Jon Favreau",
  "Writer": "Mark Fergus, Hawk Ostby, Art Marcum",
  "Actors": "Robert Downey Jr., Gwyneth Paltrow, Terrence Howard",
  "Plot": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.",
  "Language": "English, Persian, Urdu, Arabic, Kurdish, Hindi, Hungarian",
  "Country": "United States, Canada",
  "Awards": "Nominated for 2 Oscars. 24 wins & 73 nominations total",
  "Poster": "https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_SX300.jpg",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "7.9/10"
    },
    {
      "Source": "Rotten Tomatoes",
      "Value": "94%"
    },
    {
      "Source": "Metacritic",
      "Value": "79/100"
    }
  ],
  "Metascore": "79",
  "imdbRating": "7.9",
  "imdbVotes": "1,190,100",
  "imdbID": "tt0371746",
  "Type": "movie",
  "DVD": "N/A",
  "BoxOffice": "$319,034,126",
  "Production": "N/A",
  "Website": "N/A",
  "Response": "True"
}

// Access OMDB API key from Vite environment variable
const movieApiKey = import.meta.env.VITE_OMDB_API_KEY;

async function handleFormSubmit(e) {
    e.preventDefault();
    const movieName = input.value.trim();
    if (!movieName) return;
    console.log('Form submitted');

    // Fetch movie data from OMDB API
    const response = await fetch(`https://www.omdbapi.com/?apikey=${movieApiKey}&s=${encodeURIComponent(movieName)}`);
    const data = await response.json();
    console.log(data);

    if (!data.Search) {
        movieContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    // Fetch details for each movie in parallel
    const detailPromises = data.Search.map(movie =>
        fetch(`https://www.omdbapi.com/?apikey=${movieApiKey}&i=${movie.imdbID}`)
            .then(res => res.json())
    );
    const moviesWithDetails = await Promise.all(detailPromises);

    // Clear previous list and render new results
    movieList = moviesWithDetails;
    currentRenderIndex = 0;
    renderMovieList(movieList, true);
}

function renderMovieList(movies, reset = false) {
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
                <img src="${movie.Poster}" alt="${movie.Title}" class="movie_poster">
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
}
