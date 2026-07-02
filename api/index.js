export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { url } = req.query;
  const path = req.url.split('?')[0].replace('/api', '');

  try {
    // 1. Ambil list anime dari /unlimited
    if(path === '/unlimited'){
      const html = await fetch('https://www.sankavollerei.web.id/anime/unlimited').then(r=>r.text());
      const data = [...html.matchAll(/<div class="posttitle">.*?<a href="([^"]+)".*?>([^<]+)<\/a>.*?<img src="([^"]+)"/gs)]
     .map(m=>({url:m[1].replace('https://www.sankavollerei.web.id',''), title:m[2].trim(), image:m[3]}));
      return res.json(data.slice(0,30));
    }

    // 2. Ambil detail + list episode
    if(path === '/anime'){
      const html = await fetch('https://www.sankavollerei.web.id' + url).then(r=>r.text());
      const title = html.match(/<h1[^>]*>([^<]+)<\/h1>/)?.[1]?.replace('Sub Indo','')?.trim() || 'Anime';
      const episodes = [...html.matchAll(/<a href="(\/anime\/episode\/[^"]+)">([^<]+)<\/a>/g)]
     .map(m=>({number:m[2].match(/\d+/)?.[0] || '?', episode_url:m[1]})).reverse();
      return res.json({title, episodes});
    }

    // 3. Ambil link m3u8 dari dalam iframe
    if(path === '/play'){
      const html = await fetch('https://www.sankavollerei.web.id' + url).then(r=>r.text());
      const iframe = html.match(/<iframe[^>]+src="([^"]+)"/)?.[1];
      if(!iframe) return res.json({m3u8:null, vtt:null});

      const iframeHtml = await fetch(iframe, {headers:{'Referer':'https://www.sankavollerei.web.id'}}).then(r=>r.text());
      const m3u8 = iframeHtml.match(/(https:[^"']+\.m3u8)/)?.[1];
      const vtt = iframeHtml.match(/(https:[^"']+\.vtt)/)?.[1];
      return res.json({m3u8, vtt});
    }
    return res.status(404).json({error:'Not found'});
  } catch(e){ return res.status(500).json({error:e.message}); }
        }
