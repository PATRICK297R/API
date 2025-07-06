module.exports = function (app) {
    const { ytmp4 } = require('@vreden/youtube_scraper');

    app.get('/downloader/ytmp4', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" is required'
            });
        }

        try {
            const result = await ytmp4(url);

            // result biasanya berisi informasi video + download link
            // pastikan isi object-nya sesuai struktur dari @vreden/youtube_scraper
            return res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message || 'Something went wrong'
            });
        }
    });
};