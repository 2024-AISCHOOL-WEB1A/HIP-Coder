const express = require('express');
const { csrfTokenResponse } = require('../config/csrf'); // CSRF 관련 설정 가져오기

const router = express.Router();

// CSRF 토큰 발급 라우트
router.get('/get-csrf-token', (req, res) => {
    res.cookie('csrf_token', req.csrfToken(), { httpOnly: true });
    res.status(200).json({ message: 'CSRF 토큰 발급 완료' });
});

// CSRF 보호된 POST 요청 라우트 예시
router.post('/protected-route', (req, res) => {
    res.status(200).send('CSRF 보호된 요청 성공');
});

module.exports = router;
