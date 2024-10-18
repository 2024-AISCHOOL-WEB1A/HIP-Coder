const express = require('express');

const router = express.Router();

// CSRF 토큰 발급 라우트
router.get('/get-csrf-token', (req, res) => {
    const csrfToken = req.csrfToken();  // CSRF 토큰 생성
    res.status(200).json({ message: 'CSRF 토큰 발급 완료', csrfToken });
});


// CSRF 보호된 POST 요청 라우트 예시
router.post('/protected-route', (req, res) => {
    res.status(200).send('CSRF 보호된 요청 성공');
});

module.exports = router;
