module.exports = function (app) {
    const { downloadTikTok } = require('../../lib/tiktok');

    app.get('/downloader/tiktok', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" diperlukan'
            });
        }

        try {
            const result = await downloadTikTok(url);

            // Response dinamis berdasarkan type
            let responseData = {
                status: true,
                creator: 'Rasya',
                type: result.type,
                title: result.title,
                result: {}
            };

            if (result.type === 'video') {
                responseData.result.mp4 = result.mp4Links;
                if (result.mp3Link) responseData.result.mp3 = result.mp3Link;
            } else if (result.type === 'image') {
                responseData.result.images = result.images;
                if (result.mp3Link) responseData.result.mp3 = result.mp3Link;
            }

            return res.status(200).json(responseData);

        } catch (e) {
            return res.status(500).json({
                status: false,
                error: e.message || 'Gagal memproses permintaan.'
            });
        }
    });
};