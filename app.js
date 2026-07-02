// app.js - Versi Cloudflare Pages
const API_URL = "/api"; // <-- Paling penting: biar auto nyambung ke domain sendiri

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingText = document.getElementById('loading');

searchBtn.addEventListener('click', searchAnime);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchAnime();
});

async function searchAnime() {
  const query = searchInput.value.trim();
  if (!query) return alert('Isi judul anime dulu bro');

  loadingText.style.display = 'block';
  resultsDiv.innerHTML = '';

  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    
    if (!res.ok) throw new Error('API error: ' + res.status);
    
    const data = await res.json();

    loadingText.style.display = 'none';

    if (data.length === 0) {
      resultsDiv.innerHTML = '<p>Anime gak ketemu 😢</p>';
      return;
    }

    data.forEach(anime => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${anime.image}" alt="${anime.title}">
        <h3>${anime.title}</h3>
        <a href="detail.html?id=${anime.id}">Lihat Detail</a>
      `;
      resultsDiv.appendChild(card);
    });

  } catch (err) {
    loadingText.style.display = 'none';
    resultsDiv.innerHTML = `<p>Gagal load. Cek Cloudflare.</p>`;
    console.error(err);
  }
}