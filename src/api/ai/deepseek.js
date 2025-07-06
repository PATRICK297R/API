module.exports = function (app) {
    const { chat } = require('../../lib/chat');

    app.get('/ai/deepseek', async (req, res) => {
        const { text, websearch } = req.query;

        if (!text) {
            return res.status(400).json({
                status: false,
                error: 'Parameter "text" is required'
            });
        }

        const useWebSearch = websearch === 'true';

        try {
            const output = await chat(text, useWebSearch);

            return res.status(200).json({
                status: true,
                creator: 'Rasya',
                question: text,
                websearch: useWebSearch,
                result: output
            });
        } catch (error) {
            return res.status(500).json({
                status: false,
                error: error.message || 'Something went wrong'
            });
        }
    });
};