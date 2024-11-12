const express = require('express');
const jwtoken = require('../config/jwt')
const authenticateToken = require('../config/middleWare');
const router = express.Router();

// CSRF 토큰 발급 라우트
router.get('/get-csrf-token', (req, res) => {
    console.log('토큰요청')
    const csrfToken = req.csrfToken();  // CSRF 토큰 생성
    res.status(200).json({ message: 'CSRF 토큰 발급 완료', csrfToken });
});


// CSRF 보호된 POST 요청 라우트 예시
router.post('/protected-route', (req, res) => {
    res.status(200).send('CSRF 보호된 요청 성공');
});

router.post('/refresh', (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        console.error('리프레시 토큰이 없습니다.');
        return res.status(401).json({ error: '리프레시 토큰이 필요합니다.' });
    }

    jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('리프레시 토큰 검증 실패:', err);
            return res.status(403).json({ error: '유효하지 않은 리프레시 토큰입니다.' });
        }

        // 새로운 access 토큰 발급
        const newAccessToken = jwtoken.generateToken({ id: decoded.id });
        console.log('새로 발급된 액세스 토큰:', newAccessToken);

        res.status(200).json({ accessToken: newAccessToken });
    });
});


module.exports = router;
