import { fetchMovieLists, searchMovies } from "./api-fetch.js";

export function initScrollToTop() {
  const scrollBtn = document.getElementById("scroll-top");

  if (!scrollBtn) return; // Exit if button doesn't exist

  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Separate initialization for main page
export function initMainPage() {
  const mainContainer = document.querySelector(".main-container");
  if (!mainContainer) return; // Exit if not on main page

  displayMovies();
  initScrollToTop();
  initializeSearch();
}

// Separate initialization for product page
export function initProductPage() {
  initScrollToTop();
}

async function displayMovies() {
  const mainContainer = document.querySelector(".main-container");
  const movieLists = await fetchMovieLists();

  if (!movieLists || !mainContainer) return;

  const sections = [
    { title: "Popular Movies", movies: movieLists.popular },
    { title: "Top Rated Movies", movies: movieLists.topRated },
  ];

  sections.forEach((section) => {
    const sectionElement = document.createElement("section");
    sectionElement.classList.add("movie-section");

    const heading = document.createElement("h2");
    heading.textContent = section.title;
    sectionElement.appendChild(heading);

    const movieGrid = document.createElement("div");
    movieGrid.classList.add("movie-grid");

    section.movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");

      // Add click event listener to navigate to product page
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
      movieGrid.appendChild(movieCard);
    });

    sectionElement.appendChild(movieGrid);
    mainContainer.appendChild(sectionElement);
  });
}

function clearMainContainer() {
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";
}

function initializeSearch() {
  const searchInput = document.getElementById("movie-search");
  let debounceTimer;

  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
      const query = e.target.value.trim();

      if (query === "") {
        clearMainContainer();
        displayMovies();
        return;
      }

      const searchResults = await searchMovies(query);
      clearMainContainer();
      const mainContainer = document.querySelector(".main-container");

      const searchSection = document.createElement("section");
      searchSection.classList.add("movie-section");

      const heading = document.createElement("h2");
      heading.textContent = "Search Results";
      searchSection.appendChild(heading);

      if (!searchResults || searchResults.length === 0) {
        const noResults = document.createElement("p");
        noResults.textContent = "Hittade tyvärr inga filmer :(";
        noResults.style.textAlign = "center";
        noResults.style.fontSize = "1.2rem";
        noResults.style.marginTop = "2rem";
        searchSection.appendChild(noResults);
      } else {
        const movieGrid = document.createElement("div");
        movieGrid.classList.add("movie-grid");

        searchResults.forEach((movie) => {
          const movieCard = document.createElement("div");
          movieCard.classList.add("movie-card");

          // Add click event listener for search results
          movieCard.addEventListener("click", () => {
            window.location.href = `product-page.html?id=${movie.id}`;
          });

          const poster = document.createElement("img");
          poster.src = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "../images/no-poster.png";
          poster.alt = movie.title;

          const title = document.createElement("h3");
          title.textContent = movie.title;

          movieCard.appendChild(poster);
          movieCard.appendChild(title);
          movieGrid.appendChild(movieCard);
        });

        searchSection.appendChild(movieGrid);
      }

      mainContainer.appendChild(searchSection);
    }, 300);
  });
}

// Initialize based on current page
document.addEventListener("DOMContentLoaded", () => {
  // Check which page we're on
  if (document.querySelector(".main-container")) {
    initMainPage();
  }
});
