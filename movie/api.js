const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";

// 🔑 Add your TMDb API key here

const TMDB_KEY = "25c135a769dd510487b25f2900eff7aa";

// Search movies/TV shows
export async function searchTMDB(query) {
  const res = await fetch(
    `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results.filter(
    item => item.media_type === "movie" || item.media_type === "tv"
  );
}

// Get detailed info about a TV show (seasons, episodes)
export async function getTVDetails(id) {
  const res = await fetch(`${TMDB_BASE}/tv/${id}?api_key=${TMDB_KEY}`);
  return res.json();
}

// Poster base URL
export { IMG_BASE };


