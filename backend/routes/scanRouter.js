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

import axios from 'axios';

const API_URL = 'http://<your-flask-server-url>'; // Flask 서버 URL

//qr코드 스캔 시 테스트 용
router.post('/scan', async (req, res) => {
    try {
        const response = await axios.post(`${API_URL}/scan`, {
            image: req.body.image, // 이미지 데이터를 전달
        });

        res.json(response.data); // Flask 서버로부터 받은 응답을 클라이언트에 전달
    } catch (error) {
        console.error('Error during QR scan:', error);
        res.status(500).json({ status: 'error', message: 'QR 코드 스캔 중 오류 발생' });
    }
});

export default router;