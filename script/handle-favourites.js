// Funktion för att hämta favoriter från localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

// Funktion för att spara favoriter till localStorage
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Funktion för att växla favoritstatus
function toggleFavorite(movieId, movieTitle, moviePoster) {
  let favorites = getFavorites();
  const existingIndex = favorites.findIndex((movie) => movie.id === movieId);

  if (existingIndex > -1) {
    favorites.splice(existingIndex, 1);
  } else {
    favorites.push({ id: movieId, title: movieTitle, poster: moviePoster });
  }

  saveFavorites(favorites);
  updateFavoriteIcon(movieId);
  renderFavoritesDropdown();
}

// Funktion för att uppdatera favoritikonen
function updateFavoriteIcon(movieId) {
  const heartIcon = document.querySelector(
    `[data-movie-id='${movieId}'] .heart-icon`
  );
  if (!heartIcon) return;

  const favorites = getFavorites();
  const isFavorite = favorites.some((movie) => movie.id === movieId);

  heartIcon.classList.toggle("fas", isFavorite);
  heartIcon.classList.toggle("far", !isFavorite);
  heartIcon.style.color = isFavorite ? "red" : "black";
}

// Funktion för att rendera favoritdropdown
function renderFavoritesDropdown() {
  const dropdown = document.querySelector("#favorites-dropdown");
  if (!dropdown) return;

  const favorites = getFavorites();
  dropdown.innerHTML = "";

  if (favorites.length === 0) {
    dropdown.innerHTML = "<p>No favorites yet.</p>";
    return;
  }

  favorites.forEach((movie) => {
    const item = createFavoriteItem(movie);
    dropdown.appendChild(item);
  });
}

// Funktion för att skapa ett favoritobjekt
function createFavoriteItem(movie) {
  const item = document.createElement("div");
  item.classList.add("favorite-item");
  item.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster}" alt="${movie.title}" />
    <span>${movie.title}</span>
    <button class="remove-favorite" data-movie-id="${movie.id}" aria-label="Remove from favorites">X</button>
  `;

  const removeButton = item.querySelector(".remove-favorite");
  removeButton.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(movie.id, movie.title, movie.poster);
  });

  return item;
}

// Funktion för att lägga till hjärtikoner till filmkort
export function addFavoriteIcons() {
  document.querySelectorAll(".movie-card").forEach((card) => {
    const movieId = card.dataset.movieId;
    const movieTitle = card.querySelector("h3").innerText;
    const moviePoster = card.querySelector("img").src;

    const heartIcon = document.createElement("i");
    heartIcon.classList.add("heart-icon", "far", "fa-heart");
    heartIcon.style.position = "absolute";
    heartIcon.style.top = "10px";
    heartIcon.style.right = "10px";
    heartIcon.style.cursor = "pointer";

    heartIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(movieId, movieTitle, moviePoster);
    });

    card.appendChild(heartIcon);
    updateFavoriteIcon(movieId);
  });
}

// Funktion för att växla synlighet av favoritdropdown
document.getElementById("favorites-toggle").addEventListener("click", (e) => {
  e.stopPropagation();
  const dropdown = document.querySelector("#favorites-dropdown");

  if (dropdown) {
    dropdown.style.display =
      dropdown.style.display === "none" ? "block" : "none";
    renderFavoritesDropdown();
  } else {
    console.error("Dropdown element not found.");
  }
});

// Funktion för att stänga dropdown när man klickar utanför
document.addEventListener("click", () => {
  const dropdown = document.querySelector("#favorites-dropdown");
  if (dropdown) {
    dropdown.style.display = "none";
  }
});

// Initiera rendering av dropdown vid sidladdning
document.addEventListener("DOMContentLoaded", () => {
  renderFavoritesDropdown();
});
