module.exports = function (app) {
    const { FFAcount } = require('../../lib/freefire'); // pastikan fungsi ini diekspor dari src/lib/freefire.js

    app.get('/stalk/freefire', async (req, res) => {
        const { uid } = req.query;

        if (!uid || !/^\d+$/.test(uid)) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "uid" harus berupa angka.'
            });
        }

        try {
            const data = await FFAcount(uid);

            return res.status(200).json({
                status: true,
                creator: 'Rasya',
                result: data
            });
        } catch (e) {
            return res.status(500).json({
                status: false,
                error: e.message || 'Gagal mengambil data Free Fire'
            });
        }
    });
};