const { log } = require('console');
const express = require('express');
const router = express.Router();

// router.post('/urltest', (req, res) => {
//     const { url } = req.body;
//     log(`검사할 URL: ${url}`);

//     try {
//         // URL이 유효한지 확인
//         const parsedUrl = new URL(url);

//         let type = '';
//         let message = '';

//         if (parsedUrl.protocol === 'https:') {
//             type = 'good';
//             message = '이 URL은 안전합니다.';
//         } else if (parsedUrl.protocol === 'http:') {
//             type = 'bad';
//             message = '이 URL은 보안 위험이 있을 수 있습니다.';
//         }

//         res.json({ status, message });
//     } catch (err) {
//         res.status(400).json({ status: 'error', message: '잘못된 URL입니다.' });
//     }
// })

const axios = require('axios');

router.post('/urltest', async (req, res) => {
    const { url } = req.body;
    console.log(`검사할 URL: ${url}`);

    try {
        const response = await axios.post('/urltest', { url }); // Flask 서버로 요청
        res.json(response.data); // Flask 서버에서 온 응답을 그대로 반환
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'URL 분석 중 오류 발생' });
    }
});

module.exports = router
