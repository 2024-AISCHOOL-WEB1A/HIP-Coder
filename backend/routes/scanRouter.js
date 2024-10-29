const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_URL = process.env.FLASK_API_URL || 'http://127.0.0.1:5000';

// URL 유효성 검사 함수
const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;  
    }
};

// QR 코드 스캔 요청 처리
router.post('/upload', async (req, res) => {
    try {
        const { url } = req.body;

        // URL 유효성 검사
        if (!url || !isValidUrl(url)) {
            return res.status(400).json({ status: 'error', message: '유효하지 않은 URL입니다.' });
        }

        // 여기서 필요한 처리를 수행할 수 있습니다.
        // 예: URL을 기반으로 데이터베이스 검색, 추가적인 API 요청 등

        // Flask 서버에 URL 데이터 전송
        const response = await axios.post(`${API_URL}/scan`, { url });

        // Flask 서버의 응답 확인 및 처리
        if (response.data) {
            return res.json(response.data); // Flask가 { recognized: true/false } 형태로 응답한다고 가정
        } else {
            return res.status(500).json({ status: 'error', message: 'Flask 서버 응답이 없습니다.' });
        }
    } catch (error) {
        console.error('Error during QR scan:', error.response ? error.response.data : error.message);
        res.status(500).json({ status: 'error', message: 'QR 코드 스캔 중 오류 발생' });
    }
});

module.exports = router;
