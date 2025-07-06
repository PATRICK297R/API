module.exports = function (app) {
    const { ytmp3 } = require('@vreden/youtube_scraper');

    app.get('/downloader/ytmp3', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" is required'
            });
        }

        try {
            const raw = await ytmp3(url);
            const meta = raw?.metadata || {};
            const dl = raw?.download || {};

            return res.status(200).json({
                status: true,
                creator: 'Rasya',
                result: {
                    title: meta.title,
                    thumbnail: meta.thumbnail,
                    duration: meta.duration?.timestamp,
                    channel: meta.author?.name,
                    views: meta.views,
                    url: dl.url,
                    size: dl.size || null,
                    filename: dl.filename
                }
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message || 'Something went wrong'
            });
        }
    });
};