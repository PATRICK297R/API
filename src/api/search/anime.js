const malScraper = require('mal-scraper');

module.exports = function (app) {
  app.get('/search/anime', async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: false,
        error: 'Parameter "q" (judul anime) dibutuhkan.'
      });
    }

    try {
      const result = await malScraper.getInfoFromName(q);

      res.json({
        status: true,
        creator: 'Rasya',
        result
      });

    } catch (error) {
      res.status(500).json({
        status: false,
        error: 'Anime tidak ditemukan atau terjadi kesalahan.',
        message: error.message
      });
    }
  });
};