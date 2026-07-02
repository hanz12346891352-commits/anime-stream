export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 1. API Search Pake Jikan
    if (path === '/api/search') {
      const q = url.searchParams.get('q') || '';
      if (!q) return new Response('[]', {headers: {'Content-Type': 'application/json'}});

      try {
        const jikanRes = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=12`);
        const jikanData = await jikanRes.json();
        
        const results = jikanData.data.map(a => ({
          mal_id: a.mal_id,
          title: a.title,
          image: a.images.jpg.image_url
        }));
        
        return new Response(JSON.stringify(results), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*' 
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({error: e.message}), {status: 500});
      }
    }

    return new Response('Not Found', { status: 404 });
  }
}