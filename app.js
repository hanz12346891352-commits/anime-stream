const API_URL = "/api";

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsDiv = document.getElementById('results');
const loadingText = document.getElementById('loading');

// JANGAN ADA searchAnime() di sini. Cuma pas klik doang
searchBtn.addEventListener('click', searchAnime);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchAnime();
});

async function searchAnime() {
  const query = searchInput.value.trim();
  if (!query) return alert('Isi judul anime dulu bro'); // <-- Kalo kosong, stop. Jangan loading

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

    // ... kode nampilin card ...

  } catch (err) {
    loadingText.style.display = 'none'; // <-- Matiiin loading kalo error
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}