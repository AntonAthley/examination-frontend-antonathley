import { fetchMovieDetails } from "./api-fetch.js";
import { initProductPage } from "./dom-handling.js";

async function loadMovieDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

  const movieData = await fetchMovieDetails(movieId);
  if (movieData) {
    displayMovieDetails(movieData);
  } else {
    console.error("Failed to load movie details");
  }
}

function displayMovieDetails(movie) {
  // Set page title
  document.title = movie.title;

  // Populate main content
  document.querySelector(".movie-title").textContent = movie.title;
  document.querySelector(".movie-description").textContent = movie.overview;

  // Set main poster (using TMDB image URL)
  document.querySelector(".main-poster").innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
             alt="${movie.title}">
    `;

  // Add trailer (if available)
  const trailer = movie.videos.find((video) => video.type === "Trailer");
  if (trailer) {
    document.querySelector(".trailer-section").innerHTML = `
            <h2>Trailer</h2>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${trailer.key}" 
                        frameborder="0" 
                        allowfullscreen>
                </iframe>
            </div>
        `;
  }

  // Add cast members (limit to first 10)
  const castGallery = document.querySelector(".cast-gallery");
  movie.cast.slice(0, 10).forEach((actor) => {
    if (actor.profile_path) {
      castGallery.innerHTML += `
                <div class="cast-member">
                    <img src="https://image.tmdb.org/t/p/w185${actor.profile_path}" 
                         alt="${actor.name}">
                    <h3>${actor.name}</h3>
                    <p>${actor.character}</p>
                </div>
            `;
    }
  });
}

// Add back button functionality
function initBackButton() {
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// Load movie details when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadMovieDetails();
  initProductPage();
  initBackButton(); // Initialize back button
});
