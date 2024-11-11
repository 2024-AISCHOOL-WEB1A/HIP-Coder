const express = require('express');
const router = express.Router();
const axios = require('axios');
const authenticateToken = require('../config/middleWare');
const { log } = require('console')
const conn = require('../config/db')

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
        const response = await axios.post(`${API_URL}/scan`, { url }); // 여기 오류나면 FLASK_URL -> API_URL로

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

/** 구글 세이프 브라우저 API 테스트 코드 */
router.get('/checkurl', async (req, res) => {

    const API_KEY = process.env.SAFE_API_KEY;
    const url_check = 'http://example.com/malicious' // 임시 URL

    const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;
    const payload = {
        client: {
            clientId: 'HIP-CODER',
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [
                { url: url_check }
            ]
        }
    };

    try {
        const response = await axios.post(apiUrl, payload);
        const result = response.data;

        if (result.matches) {
            res.json({ safe: false, message: '위험한 URL 입니다.' });
        } else {
            res.json({ safe: true, message: '안전한 URL 입니다.' });
        }
    } catch (error) {
        console.error('API 요청 오류', error);
        res.status(500).json({ error: 'URL 검사 중 오류가 발생했습니다.' });
    }

});

/** 검사내역 불러오기 */
router.post('/scanlist', authenticateToken, (req, res) => {
    const user_idx = req.userId;
    log(user_idx)
    const sql = 'SELECT * FROM SCAN_QR WHERE USER_IDX = ?'

    conn.query(sql, [user_idx], (err, r) => {
        if (err) {
            console.error('DB Count Error', err)
            return res.status(500).json({ error: 'DB Count Error' })
        } else if (r.length === 0) {
            return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' })
        } else {
            log(r)
            res.json({ message: r })
        }
    })
})




module.exports = router;
