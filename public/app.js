// 1. UTILITY
const parseHTML = html => new DOMParser().parseFromString(html, 'text/html');

// 2. SCRAPER SANKAVOLLEREI = Samehadaku + Animasu
function scrapeSankavollerei(doc) {
  const anime = [];
  doc.querySelectorAll('div.animposx').forEach(el => { 
    anime.push({
      title: el.querySelector('div.data h2.title')?.textContent.trim() || el.querySelector('a > h2')?.textContent.trim(),
      image: el.querySelector('img.ts-post-image')?.src || el.querySelector('img')?.src,
      link: el.querySelector('a')?.href,
      episode: el.querySelector('.epz')?.textContent.trim(),
      type: el.querySelector('.type')?.textContent.trim(),
    });
  });
  return anime;
}

// 3. SCRAPER OTAKUDESU
function scrapeOtakudesu(doc) {
  const anime = [];
  doc.querySelectorAll('div.rseries > a').forEach(el => { 
    anime.push({
      title: el.querySelector('.rapi > h2')?.textContent.trim(),
      image: el.querySelector('img')?.src,
      link: el.href,
      episode: el.querySelector('.epz')?.textContent.trim(),
      type: 'TV' 
    });
  });
  return anime;
}

// 4. SCRAPER SANKAVOI - Kalo return nya JSON langsung
function scrapeSankavoi(data) {
  return data.map(item => ({
    title: item.title,
    image: item.image,
    link: item.link,
    episode: item.episode,
    type: item.type
  }));
}

// 5. FETCH 4 API FALLBACK
async function getAnime(endpoint = 'ongoing', page = 1, query = '') {
  const apis = [
    { name: 'samehadaku', url: `/api/samehadaku/${endpoint}?page=${page}`, scraper: scrapeSankavollerei, isJson: false },
    { name: 'animasu',    url: `/api/animasu/${endpoint}?page=${page}`,   scraper: scrapeSankavollerei, isJson: false },
    { name: 'otakudesu',  url: `/api/otakudesu/${endpoint}`,              scraper: scrapeOtakudesu,     isJson: false },
    { name: 'sankavoi',   url: `/api/sankavoi?q=${query}`,                scraper: scrapeSankavoi,      isJson: true  } // Khusus search
  ];

  for (const api of apis) {
    try {
      console.log(`Coba: ${api.name}`);
      const res = await fetch(api.url);
      if (!res.ok) continue;
      
      let data;
      if(api.isJson) {
        data = api.scraper(await res.json()); // Sankavoi udah JSON
      } else {
        data = api.scraper(parseHTML(await res.text())); // Lainnya HTML
      }

      if (data.length > 0) {
        console.log(`✅ Sukses pake: ${api.name}`);
        return data;
      }
    } catch (e) {
      console.warn(`${api.name} gagal`);
    }
  }
  return []; // Zonk semua
}