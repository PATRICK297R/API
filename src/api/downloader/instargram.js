module.exports = function (app) {
    const { igDl } = require('../../lib/instagram');
    const fetch = require('node-fetch');

    app.get('/downloader/instagram', async (req, res) => {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "url" is required'
            });
        }

        try {
            const results = await igDl(url);
            const filtered = results.filter(item =>
                item.title === 'Download Video' || item.title === 'Download Image'
            );

            const finalResult = [];
            const sentUrls = new Set();

            for (let item of filtered) {
                if (!sentUrls.has(item.url)) {
                    try {
                        const response = await fetch(item.url);
                        const contentType = response.headers.get('content-type');
                        finalResult.push({
                            type: contentType?.includes('image') ? 'image' : 'video',
                            url: item.url
                        });
                        sentUrls.add(item.url);
                    } catch (e) {
                        console.warn(`Failed to fetch media from: ${item.url}`);
                    }
                }
            }

            return res.status(200).json({
                status: true,
                creator: 'Rasya',
                result: finalResult
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({
                status: false,
                error: 'Failed to fetch media. Pastikan URL tidak berasal dari akun private.'
            });
        }
    });
};