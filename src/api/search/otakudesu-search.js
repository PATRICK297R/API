const { otakuDesu } = require('../../lib/otakudesu');

module.exports = function (app) {
  app.get('/anime/otakudesu/search', async (req, res) => {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        status: false,
        error: 'Parameter "q" (search) dibutuhkan.'
      });
    }

    try {
      const results = await otakuDesu(q);
      res.json({
        status: true,
        creator: 'Rasya',
        query: q,
        results
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message || 'Terjadi kesalahan'
      });
    }
  });
};