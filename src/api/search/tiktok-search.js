const axios = require('axios');

async function tiktoks(query) {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: {
        keywords: query,
        count: 10,
        cursor: 0,
        HD: 1
      }
    });

    const videos = response.data.data.videos;
    if (videos.length === 0) {
      throw new Error("Tidak ada video ditemukan.");
    }

    // Kembalikan semua video (bukan 1 random aja)
    return videos.map(video => ({
      title: video.title,
      cover: video.cover,
      origin_cover: video.origin_cover,
      no_watermark: video.play,
      watermark: video.wmplay,
      music: video.music
    }));

  } catch (error) {
    throw error;
  }
}

module.exports = function(app) {
  app.get('/search/tiktok', async (req, res) => {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ status: false, error: 'Query is required' });
    }

    try {
      const result = await tiktoks(q);
      res.status(200).json({
        status: true,
        result
      });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  });
};