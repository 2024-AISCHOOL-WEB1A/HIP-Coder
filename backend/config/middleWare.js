// authMiddleware.js
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

// JWT 검증 미들웨어
function authenticateToken(req, res, next) {
  // 요청 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>" 형태에서 토큰만 추출

  // 토큰이 없는 경우 401 Unauthorized 응답
  if (!token) {
    return res.status(401).json({ error: '토큰이 필요합니다.' });
  }

  // 토큰 검증
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      // 토큰이 유효하지 않을 경우 403 Forbidden 응답
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    // 검증된 토큰의 payload에서 userId를 추출하여 요청 객체에 추가
    req.userId = decoded.userId; 
    next(); // 다음 미들웨어 또는 라우트로 이동
  });
}

module.exports = authenticateToken;
