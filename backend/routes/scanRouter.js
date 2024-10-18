const { log } = require('console');
const express = require('express');
const router = express.Router();

router.post('/urltest', (req, res) => {
    const { url } = req.body;
    log(`검사할 URL: ${url}`);

    try {
        // URL이 유효한지 확인
        const parsedUrl = new URL(url);

        if (parsedUrl.protocol === 'https:') {
            res.json({ message: '안전' });
        } else if (parsedUrl.protocol === 'http:') {
            res.json({ message: '위험' });
        } else {
            res.json({ message: '잘못된 url 형식입니다.' });
        }
    } catch (err) {
        res.status(400).json({ message: '잘못된 URL입니다.' });
    }
});

module.exports = router
