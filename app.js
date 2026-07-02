const API_PROXY = '/api'; // PENTING: Jangan pake https:// kalo udah di Vercel
let currentHls = null;

// === HALAMAN UTAMA ===
async function loadAnime(){
  try{
    const res = await fetch(`${API_PROXY}/unlimited`);
    const data = await res.json();
    document.getElementById('populer').innerHTML = data.map(a=>`
      <div class="card" onclick="location.href='detail.html?url=${encodeURIComponent(a.url)}'">
        <img src="${a.image}" onerror="this.src='https://placehold.co/200x300/1a1d24/fff?text=No+Img'" loading="lazy">
        <div class="info"><div class="title">${a.title}</div></div>
      </div>
    `).join('');
  }catch(e){ document.getElementById('populer').innerHTML = 'Gagal load. Cek Vercel.' }
}

// === HALAMAN DETAIL ===
async function loadDetail(){
  const url = new URLSearchParams(window.location.search).get('url');
  if(!url) return document.getElementById('detail').innerHTML = 'URL kosong';

  const res = await fetch(`${API_PROXY}/anime?url=${encodeURIComponent(url)}`);
  const data = await res.json();

  document.getElementById('detail').innerHTML = `
    <div id="playerWrap"><video id="player" controls playsinline><track id="subTrack" kind="subtitles" srclang="id" label="Indonesia" default></video></div>
    <h1>${data.title}</h1>
    <div class="ep-list" id="epList"></div>
  `;

  const epList = document.getElementById('epList');
  data.episodes.forEach(ep => {
    const btn = document.createElement('button');
    btn.className = 'ep-btn';
    btn.textContent = 'Ep ' + ep.number;
    btn.onclick = () => play(ep.episode_url, btn);
    epList.appendChild(btn);
  });
  if(data.episodes[0]) epList.querySelector('.ep-btn').click();
}

async function play(episodeUrl, btnEl){
  document.querySelectorAll('.ep-btn').forEach(b=>b.classList.remove('active')); btnEl.classList.add('active');
  btnEl.textContent = 'Loading...';

  const epData = await (await fetch(`${API_PROXY}/play?url=${encodeURIComponent(episodeUrl)}`)).json();
  btnEl.textContent = 'Ep ' + btnEl.textContent.split(' ')[1];

  if(!epData.m3u8) return alert('Link video gak ketemu. Server diblok.');
  const video = document.getElementById('player');
  if(currentHls) currentHls.destroy();
  currentHls = new Hls();
  currentHls.loadSource(epData.m3u8);
  currentHls.attachMedia(video);
  if(epData.vtt) document.getElementById('subTrack').src = epData.vtt;
  video.play().catch(()=>alert('Gagal play'));
}

if(location.pathname.includes('detail.html')) loadDetail();
else loadAnime();
