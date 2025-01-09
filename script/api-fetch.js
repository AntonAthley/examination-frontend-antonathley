import { displayErrorMessage } from "./dom-handling.js";

const API_KEY = "43ac502565e2855ce307337744abfc71";
const BASE_URL = "https://api.themoviedb.org/3/movie";

async function fetchFromEndpoint(endpoint) {
  // Hämtar data från en specifik API-endpoint
  try {
    const response = await fetch(`${BASE_URL}/${endpoint}?api_key=${API_KEY}`);
    if (!response.ok) {
      displayErrorMessage(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

async function fetchMovieLists() {
  // Hämtar listor över populära och topprankade filmer
  try {
    const endpoints = ["popular", "top_rated"];

    const results = await Promise.all(
      endpoints.map((endpoint) => fetchFromEndpoint(endpoint))
    );

    const [popular, topRated] = results;

    if (!popular || !topRated) {
      displayErrorMessage(500);
      return null;
    }

    return {
      popular,
      topRated,
    };
  } catch (error) {
    console.error("Error in fetchMovieLists:", error);
    displayErrorMessage(500);
    return null;
  }
}

async function searchMovies(query) {
  // Söker efter filmer baserat på en given fråga
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok) {
      displayErrorMessage(response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error searching movies:", error);
    return null;
  }
}

async function fetchMovieDetails(movieId) {
  // Hämtar detaljer för en specifik film baserat på filmens ID
  if (!movieId) {
    console.error("No movie ID provided");
    displayErrorMessage(400);
    return null;
  }

  try {
    const [movieResponse, creditsResponse, videosResponse] = await Promise.all([
      fetch(`${BASE_URL}/${movieId}?api_key=${API_KEY}&language=en-US`),
      fetch(`${BASE_URL}/${movieId}/credits?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/${movieId}/videos?api_key=${API_KEY}`),
    ]);

    // Kontrollera om något svar inte är OK
    if (!movieResponse.ok || !creditsResponse.ok || !videosResponse.ok) {
      const statusCode = Math.max(
        movieResponse.status,
        creditsResponse.status,
        videosResponse.status
      );
      displayErrorMessage(statusCode);
      return null;
    }

    const [movieData, creditsData, videosData] = await Promise.all([
      movieResponse.json(),
      creditsResponse.json(),
      videosResponse.json(),
    ]);

    return {
      ...movieData,
      cast: creditsData.cast,
      videos: videosData.results,
    };
  } catch (error) {
    console.error("Error fetching movie details:", error);
    displayErrorMessage(500);
    return null;
  }
}

export { fetchMovieLists, searchMovies, fetchMovieDetails };
