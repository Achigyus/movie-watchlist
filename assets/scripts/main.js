console.log("Script loaded")

const form = document.getElementById('search_movie')
const input = document.getElementById('movie_input')

form.addEventListener('submit', handleFormSubmit)

// Access OMDB API key from Vite environment variable
const movieApiKey = import.meta.env.VITE_OMDB_API_KEY;

async function handleFormSubmit(e) {
    e.preventDefault()
    const movieName = input.value.trim()
    if (!movieName) return
    console.log('Form submitted')


    // Fetch movie data from OMDB API
    const response = await fetch(`https://www.omdbapi.com/?apikey=${movieApiKey}&s=${encodeURIComponent(movieName)}`);
    const data = await response.json();
    console.log(data);

    // Display movie data
}
