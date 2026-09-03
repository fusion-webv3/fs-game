import { searchTMDB, getTVDetails, IMG_BASE } from "./api.js";

const rowsContainer = document.getElementById("rows-container");
const search = document.getElementById("search");
const playerContainer = document.getElementById("player-container");
const player = document.getElementById("player");

let cards = [];
let currentFocus = 0;
let columns = 6;

// TV Show overlay elements
let overlay = null;
let overlaySeasons = [];
let overlayEpisodes = [];
let overlaySeasonFocus = 0;
let overlayEpisodeFocus = 0;
let overlayTVData = null;

// TMDb API key
const TMDB_KEY = "25c135a769dd510487b25f2900eff7aa";

// 🔧 Detect if user is typing in an input (CRITICAL FIX)
function isTypingInInput() {
  const el = document.activeElement;
  return el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA");
}

// --- LOAD TRENDING ON START ---
async function loadTrending() {
  const res = await fetch(
    `https://api.themoviedb.org/3/trending/all/day?api_key=${TMDB_KEY}`
  );
  const data = await res.json();
  const trendingItems = data.results.filter(
    item => item.media_type === "movie" || item.media_type === "tv"
  );
  renderRows([{ title: "Trending Now", items: trendingItems }]);
}
loadTrending();

// --- SEARCH ---
search.addEventListener("keydown", async e => {
  if (e.key === "Enter") {
    const results = await searchTMDB(search.value);
    renderRows([{ title: "Search Results", items: results }]);
    currentFocus = 0;
    focusCard(currentFocus);
  }
});

// --- RENDER ROWS ---
function renderRows(rows) {
  rowsContainer.innerHTML = "";
  playerContainer.hidden = true;
  cards = [];

  rows.forEach(rowData => {
    const rowTitle = document.createElement("h2");
    rowTitle.className = "row-title";
    rowTitle.textContent = rowData.title;
    rowsContainer.appendChild(rowTitle);

    const row = document.createElement("div");
    row.className = "row";

    rowData.items.forEach(item => {
      const card = document.createElement("div");
      card.className = "card";
      card.tabIndex = 0; // 🔥 Fire TV requires focusable elements
      card.dataset.idx = cards.length;
      card.dataset.mediaType = item.media_type;
      card.dataset.id = item.id;

      card.innerHTML = `
        <img src="${IMG_BASE}${item.poster_path}">
        <p>${item.title || item.name}</p>
      `;

      card.onclick = () => openItem(item);
      row.appendChild(card);
      cards.push(card);
    });

    rowsContainer.appendChild(row);
  });

  currentFocus = 0;
  focusCard(currentFocus);
}

// --- FOCUS MANAGEMENT ---
function focusCard(idx) {
  cards.forEach(c => c.classList.remove("focused"));
  if (cards[idx]) {
    cards[idx].classList.add("focused");
    cards[idx].focus();
    cards[idx].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
}

// --- OPEN ITEM ---
async function openItem(item) {
  if (item.media_type === "movie") {
    playMovie(item.id);
  } else {
    overlayTVData = await getTVDetails(item.id);
    showTVOverlay(item);
  }
}

// --- PLAY FUNCTIONS ---
function playMovie(id) {
  player.src = `https://vidlink.pro/movie/${id}`;
  playerContainer.hidden = false;
}

function playEpisode(id, season, episode) {
  player.src = `https://vidlink.pro/tv/${id}/${season}/${episode}`;
  playerContainer.hidden = false;
}

// --- TV SHOW OVERLAY ---
function showTVOverlay(item) {
  // Reset overlay if exists
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "tv-overlay";
    overlay.style.position = "fixed";
    overlay.style.inset = 0;
    overlay.style.background = "rgba(0,0,0,0.95)";
    overlay.style.backdropFilter = "blur(20px)";
    overlay.style.zIndex = 1000;
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.padding = "40px";
    overlay.style.overflow = "hidden";
    document.body.appendChild(overlay);
  }

  overlay.style.display = "flex";
  overlay.innerHTML = "";

  const topContainer = document.createElement("div");
  topContainer.style.display = "flex";
  topContainer.style.gap = "40px";
  overlay.appendChild(topContainer);

  const poster = document.createElement("img");
  poster.src = `${IMG_BASE}${item.poster_path}`;
  poster.style.width = "300px";
  poster.style.borderRadius = "16px";
  poster.style.boxShadow = "0 10px 40px rgba(0,0,0,0.8)";
  topContainer.appendChild(poster);

  const infoContainer = document.createElement("div");
  infoContainer.style.display = "flex";
  infoContainer.style.flexDirection = "column";
  topContainer.appendChild(infoContainer);

  const title = document.createElement("h2");
  title.textContent = item.name;
  title.style.color = "#fff";
  title.style.fontSize = "40px";
  title.style.marginBottom = "20px";
  infoContainer.appendChild(title);

  // Setup seasons
  overlaySeasons = overlayTVData.seasons.filter(s => s.season_number > 0);
  overlaySeasonFocus = 0;

  const seasonRow = document.createElement("div");
  seasonRow.id = "season-row";
  seasonRow.style.display = "flex";
  seasonRow.style.gap = "16px";
  infoContainer.appendChild(seasonRow);

  overlaySeasons.forEach(season => {
    const btn = document.createElement("div");
    btn.className = "season-card";
    btn.tabIndex = 0;
    btn.textContent = `Season ${season.season_number}`;
    seasonRow.appendChild(btn);
  });

  updateEpisodesForSeason(overlaySeasonFocus);
  updateOverlayFocus();
}

// --- Update Episodes ---
function updateEpisodesForSeason(seasonIdx) {
  overlayEpisodeFocus = 0;
  overlayEpisodes = Array.from(
    { length: overlayTVData.seasons[seasonIdx].episode_count },
    (_, i) => i + 1
  );

  overlay.querySelector("#episode-row")?.remove();

  const episodeRow = document.createElement("div");
  episodeRow.id = "episode-row";
  episodeRow.style.display = "flex";
  episodeRow.style.gap = "12px";

  overlayEpisodes.forEach(ep => {
    const btn = document.createElement("div");
    btn.className = "episode-card";
    btn.tabIndex = 0;
    btn.textContent = `E${ep}`;
    episodeRow.appendChild(btn);
  });

  overlay.appendChild(episodeRow);
}

// --- Overlay Focus ---
function updateOverlayFocus() {
  overlay.querySelectorAll(".season-card").forEach((c, i) => {
    c.style.background = i === overlaySeasonFocus ? "#00d4ff" : "#222";
    c.style.transform = i === overlaySeasonFocus ? "scale(1.1)" : "scale(1)";
  });
  overlay.querySelectorAll(".episode-card").forEach((c, i) => {
    c.style.background = i === overlayEpisodeFocus ? "#e50914" : "#333";
    c.style.transform = i === overlayEpisodeFocus ? "scale(1.1)" : "scale(1)";
  });
}

// --- REMOTE + KEYBOARD NAVIGATION ---
window.addEventListener("keydown", e => {
  const BACK_KEYS = [
    "Back",
    "Escape",
    "Backspace",
    "BrowserBack",
    "GoBack",
    "XF86Back",
    "4"
  ];

  if (isTypingInInput()) {
    if (e.key === "ArrowDown" && cards.length) {
      e.preventDefault();
      currentFocus = 0;
      focusCard(currentFocus);
    }
    return;
  }

  // --- OVERLAY NAVIGATION ---
  if (overlay && overlay.style.display !== "none") {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
      e.preventDefault();

    switch (e.key) {
      case "ArrowRight":
        if (overlayEpisodeFocus < overlayEpisodes.length - 1)
          overlayEpisodeFocus++;
        break;
      case "ArrowLeft":
        if (overlayEpisodeFocus > 0) overlayEpisodeFocus--;
        break;
      case "ArrowDown":
        if (overlaySeasonFocus < overlaySeasons.length - 1) {
          overlaySeasonFocus++;
          updateEpisodesForSeason(overlaySeasonFocus);
        }
        break;
      case "ArrowUp":
        if (overlaySeasonFocus > 0) {
          overlaySeasonFocus--;
          updateEpisodesForSeason(overlaySeasonFocus);
        }
        break;
      case "Enter":
        playEpisode(
          overlayTVData.id,
          overlaySeasons[overlaySeasonFocus].season_number,
          overlayEpisodeFocus + 1
        );
        overlay.style.display = "none";
        focusCard(currentFocus);
        break;
      default:
        if (BACK_KEYS.includes(e.key)) {
          overlay.style.display = "none";
          focusCard(currentFocus);
        }
    }
    updateOverlayFocus();
    return;
  }

  // --- MAIN GRID NAVIGATION ---
  if (!cards.length) return;
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
    e.preventDefault();

  switch (e.key) {
    case "ArrowRight":
      if ((currentFocus + 1) % columns !== 0 && currentFocus < cards.length - 1)
        currentFocus++;
      break;
    case "ArrowLeft":
      if (currentFocus % columns !== 0) currentFocus--;
      break;
    case "ArrowDown":
      currentFocus = Math.min(currentFocus + columns, cards.length - 1);
      break;
    case "ArrowUp":
      if (currentFocus - columns >= 0) {
        currentFocus -= columns;
      } else {
        search.focus();
        return;
      }
      break;
    case "Enter":
      cards[currentFocus]?.click();
      return;
    default:
      if (BACK_KEYS.includes(e.key) && !playerContainer.hidden) {
        player.src = "";
        playerContainer.hidden = true;
      }
  }

  focusCard(currentFocus);
});
