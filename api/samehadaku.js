export default async function handler(request) {
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/samehadaku', ''); 
  const targetUrl = `https://www.sankavollerei.web.id/anime/samehadaku${path}${url.search}`;

  const res = await fetch(targetUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.sankavollerei.web.id/' }
  });
  
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 's-maxage=300' }
  });
}