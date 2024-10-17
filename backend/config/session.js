const session = require('express-session');
const FileStore = require('session-file-store')(session);

// 세션 미들웨어 설정 (파일 스토리지 사용)
function applySessionManagement(app) {
    app.use(session({
        store: new FileStore(),  // 파일에 세션 저장
        secret: process.env.SESSION_SECRET || 'yourSecretKey',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,  // 클라이언트에서 쿠키에 접근하지 못하도록 설정
            secure: false,   // HTTPS를 사용하지 않으므로 false로 설정 (HTTP 허용)
            maxAge: 1000 * 60 * 60  // 세션 유지 시간 (1시간)
        }
    }));
}

module.exports = applySessionManagement;
