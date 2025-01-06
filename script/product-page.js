import { fetchMovieDetails } from "./api-fetch.js";
import { initProductPage } from "./dom-handling.js";

// Funktion för att ladda filmdetaljer
async function loadMovieDetails() {
  const movieId = new URLSearchParams(window.location.search).get("id");
  const movieData = await fetchMovieDetails(movieId);
  if (movieData) {
    displayMovieDetails(movieData);
  } else {
    console.error("Failed to load movie details");
  }
}

// Funktion för att visa filmdetaljer
function displayMovieDetails(movie) {
  document.title = movie.title;
  updateElementText(".movie-title", movie.title);
  updateElementText(".movie-description", movie.overview);
  updateElementHTML(
    ".main-poster",
    `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
             alt="${movie.title}">
    `
  );
  const trailer = movie.videos.find((video) => video.type === "Trailer");
  if (trailer) {
    updateElementHTML(
      ".trailer-section",
      `
            <h2>Trailer</h2>
            <div class="video-container">
                <iframe src="https://www.youtube.com/embed/${trailer.key}" 
                        frameborder="0" 
                        allowfullscreen>
                </iframe>
            </div>
        `
    );
  }
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

// Funktion för att uppdatera textinnehåll
function updateElementText(selector, text) {
  document.querySelector(selector).textContent = text;
}

// Funktion för att uppdatera HTML-innehåll
function updateElementHTML(selector, html) {
  document.querySelector(selector).innerHTML = html;
}

// Funktion för att initiera tillbaka-knappen
function initBackButton() {
  const backButton = document.querySelector(".back-button");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}

// Ladda filmdetaljer när sidan laddas
document.addEventListener("DOMContentLoaded", () => {
  loadMovieDetails();
  initProductPage();
  initBackButton();
});
