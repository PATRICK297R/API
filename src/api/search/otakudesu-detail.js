const { otakuDetail } = require('../../lib/otakudesu');

module.exports = function (app) {
  app.get('/anime/otakudesu/detail', async (req, res) => {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        status: false,
        error: 'Parameter "url" dibutuhkan.'
      });
    }

    try {
      const result = await otakuDetail(url);
      if (!result) throw new Error('Anime tidak ditemukan');

      res.json({
        status: true,
        creator: 'Rasya',
        result
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message || 'Terjadi kesalahan'
      });
    }
  });
};