import { fetchMovieLists, searchMovies } from "./api-fetch.js";
import { addFavoriteIcons } from "./handle-favourites.js";

// Funktion för att initiera scroll till toppen
export function initScrollToTop() {
  const scrollBtn = document.getElementById("scroll-top");
  if (!scrollBtn) return;

  window.addEventListener("scroll", () => {
    scrollBtn.classList.toggle("visible", window.scrollY > 100);
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Funktion för att initiera huvudsidan
export function initMainPage() {
  const mainContainer = document.querySelector(".main-container");
  if (!mainContainer) return;

  displayMovies();
  initScrollToTop();
  initializeSearch();
}

// Funktion för att initiera produkt sidan
export function initProductPage() {
  initScrollToTop();
}

// Funktion för att visa filmer
async function displayMovies() {
  const mainContainer = document.querySelector(".main-container");
  const movieLists = await fetchMovieLists();
  if (!movieLists || !mainContainer) return;

  const sections = [
    { title: "Populära filmer", movies: movieLists.popular },
    { title: "Högst rankade filmer", movies: movieLists.topRated },
  ];

  sections.forEach((section) => {
    const sectionElement = createMovieSection(section);
    mainContainer.appendChild(sectionElement);
  });

  addFavoriteIcons();
}

// Funktion för att skapa en filmsektion
function createMovieSection(section) {
  const sectionElement = document.createElement("section");
  sectionElement.classList.add("movie-section");

  const heading = document.createElement("h2");
  heading.textContent = section.title;
  sectionElement.appendChild(heading);

  const movieGrid = document.createElement("div");
  movieGrid.classList.add("movie-grid");

  section.movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieGrid.appendChild(movieCard);
  });

  sectionElement.appendChild(movieGrid);
  return sectionElement;
}

// Funktion för att skapa ett filmkort
function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");
  movieCard.dataset.movieId = movie.id;

  movieCard.addEventListener("click", () => {
    window.location.href = `product-page.html?id=${movie.id}`;
  });

  const poster = document.createElement("img");
  poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  poster.alt = movie.title;

  const title = document.createElement("h3");
  title.textContent = movie.title;

  movieCard.appendChild(poster);
  movieCard.appendChild(title);
  return movieCard;
}

// Funktion för att rensa huvudcontainern
function clearMainContainer() {
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";
}

// Funktion för att initiera sökningen
function initializeSearch() {
  const searchInput = document.getElementById("movie-search");
  let debounceTimer;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => handleSearch(e.target.value.trim()), 300);
  });
}

// Funktion för att hantera sökningen
async function handleSearch(query) {
  if (query === "") {
    clearMainContainer();
    displayMovies();
    return;
  }

  const searchResults = await searchMovies(query);
  clearMainContainer();
  const mainContainer = document.querySelector(".main-container");
  const searchSection = createSearchSection(searchResults);
  mainContainer.appendChild(searchSection);
}

// Funktion för att skapa en söksektion
function createSearchSection(searchResults) {
  const searchSection = document.createElement("section");
  searchSection.classList.add("movie-section");

  const heading = document.createElement("h2");
  heading.textContent = "Sökresultat";
  searchSection.appendChild(heading);

  if (!searchResults || searchResults.length === 0) {
    const noResults = document.createElement("p");
    noResults.textContent = "Hittade tyvärr inga filmer med den namnet :(";
    noResults.style.textAlign = "center";
    noResults.style.fontSize = "1.2rem";
    noResults.style.marginTop = "2rem";
    searchSection.appendChild(noResults);
  } else {
    const movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");

    searchResults.forEach((movie) => {
      const movieCard = createMovieCard(movie);
      movieGrid.appendChild(movieCard);
    });

    searchSection.appendChild(movieGrid);
  }

  return searchSection;
}

// Initiera baserat på aktuell sida
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".main-container")) {
    initMainPage();
  }
});
