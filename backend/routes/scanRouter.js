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
    const url_check = 'vmedvsadvdsatsascdsac.com' // 임시 URL
    console.log(url_check)
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

    if (!user_idx) {
        return res.status(401).json({ success: false, error: '인증에 실패했습니다.' });
    }

    const sql = 'SELECT * FROM SCAN_QR WHERE USER_IDX = ? ORDER BY SCAN_DATE DESC';

    conn.query(sql, [user_idx], (err, r) => {
        if (err) {
            console.error('DB Count Error', err);
            return res.status(500).json({ success: false, error: 'DB Count Error' });
        } else if (r.length === 0) {
            return res.json({ success: true, message: [] });
        } else {
            res.json({ success: true, message: r });
        }
    });
});


/** 검사 내역 카운팅 */
router.get('/counting', (req, res) => {
    const sql = `SELECT TYPE, SUM(COUNT_VALUE) AS total_count
                 FROM COUNT_LOGS
                 GROUP BY TYPE`;

    conn.query(sql, (err, results) => {
        if (err) {
            console.error('집계 실패:', err);
            res.status(500).json({ message: '집계 실패', error: err });
        } else {
            // 집계 결과를 통해 URL과 QR 카운트를 구분합니다.
            let totalUrlCount = 0;
            let totalQrCount = 0;

            results.forEach(result => {
                if (result.TYPE === 'URL') {
                    totalUrlCount = result.total_count;
                } else if (result.TYPE === 'QR') {
                    totalQrCount = result.total_count;
                }
            });

            // 클라이언트에 JSON 응답으로 집계 결과 전송
            res.status(200).json({
                total_url_count: totalUrlCount,
                total_qr_count: totalQrCount
            });
        }
    });
});




module.exports = router;
