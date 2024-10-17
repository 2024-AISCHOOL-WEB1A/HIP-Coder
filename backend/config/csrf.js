const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// CSRF 보호 설정 (쿠키 기반)
const csrfProtection = csrf({ cookie: true });

function applyCsrfProtection(app) {
    app.use(cookieParser());  // 쿠키 파서 적용
    app.use(csrfProtection);  // CSRF 보호 적용
}

module.exports = applyCsrfProtection;
