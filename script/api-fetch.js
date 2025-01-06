const API_KEY = "43ac502565e2855ce307337744abfc71";
const BASE_URL = "https://api.themoviedb.org/3/movie";

async function fetchFromEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

async function fetchMovieLists() {
  try {
    const endpoints = ["popular", "top_rated"];

    const results = await Promise.all(
      endpoints.map((endpoint) => fetchFromEndpoint(endpoint))
    );

    const [popular, topRated] = results;

    // console.log({
    //   popular,
    //   topRated,
    // });

    return {
      popular,
      topRated,
    };
  } catch (error) {
    console.error("Error in fetchMovieLists:", error);
    return null;
  }
}

async function searchMovies(query) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return null;
  }
}

async function fetchMovieDetails(movieId) {
  if (!movieId) {
    console.error("No movie ID provided");
    return null;
  }

  try {
    // Fetch all movie data in parallel
    const [movieData, creditsData, videosData] = await Promise.all([
      fetch(`${BASE_URL}/${movieId}?api_key=${API_KEY}&language=en-US`).then(
        (res) => res.json()
      ),
      fetch(`${BASE_URL}/${movieId}/credits?api_key=${API_KEY}`).then((res) =>
        res.json()
      ),
      fetch(`${BASE_URL}/${movieId}/videos?api_key=${API_KEY}`).then((res) =>
        res.json()
      ),
    ]);

    return {
      ...movieData,
      cast: creditsData.cast,
      videos: videosData.results,
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// fetchMovieLists();

export { fetchMovieLists, searchMovies, fetchMovieDetails };
