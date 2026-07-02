const API_URL = "/api";

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingText = document.getElementById('loading');

// Cuma jalan pas klik tombol atau Enter. GAK AUTO JALAN PAS LOAD
searchBtn.addEventListener('click', searchAnime);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchAnime();
});

async function searchAnime() {
  const query = searchInput.value.trim();

  // Kalo input kosong, langsung stop. Jangan loading
  if (!query) { 
    loadingText.style.display = 'none';
    return alert('Ketik judul anime dulu bro 🔍');
  }

  loadingText.style.display = 'block';
  resultsDiv.innerHTML = '';

  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    loadingText.style.display = 'none'; // Matiin loading kalo sukses

    if (data.length === 0) {
      resultsDiv.innerHTML = '<p>Anime gak ketemu 😢 Coba kata kunci lain</p>';
      return;
    }

    // Nampilin hasil
    data.forEach(anime => {
      const card = document.createElement('div');
      card.className = 'anime-card';
      card.innerHTML = `
        <img src="${anime.image}" alt="${anime.title}">
        <h3>${anime.title}</h3>
      `;
      resultsDiv.appendChild(card);
    });

  } catch (err) {
    loadingText.style.display = 'none'; // Matiin loading kalo error
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    console.error(err);
  }
}