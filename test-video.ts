import fetch from 'node-fetch';

async function testVideo() {
  try {
    const res = await fetch('http://localhost:3000/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'vid1',
        url: 'https://tiktok.com',
        title: 'test',
        platform: 'TikTok',
        date: '2023-01-01T00:00:00Z'
      })
    });
    console.log(res.status);
    console.log(await res.text());
  } catch (e) {
    console.error(e);
  }
}
testVideo();
