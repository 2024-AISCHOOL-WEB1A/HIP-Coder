const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// CSRF 보호 설정 (쿠키 기반)
const csrfProtection = csrf({ cookie: true });

function applyCsrfProtection(app) {
    app.use(cookieParser());  // 쿠키 파서 적용
    app.use(csrfProtection);  // CSRF 보호 적용

    // 에러 핸들링 미들웨어 추가 (CSRF 토큰 오류 발생 시 처리)
    app.use((err, req, res, next) => {
        if (err.code === 'EBADCSRFTOKEN') {
            // CSRF 토큰이 유효하지 않은 경우 처리
            return res.status(403).json({ message: 'Invalid CSRF token' });
        }
        next(err);
    });
}

module.exports = applyCsrfProtection;
