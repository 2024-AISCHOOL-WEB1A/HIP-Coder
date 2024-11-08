const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

// JWT 검증 미들웨어
function authenticateToken(req, res, next) {
  // 요청 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>" 형태에서 토큰만 추출

  console.log('전달된 토큰:', token); // 토큰이 제대로 전달되었는지 확인


  // 토큰이 없는 경우 400 응답
  if (!token) {
    console.log('토큰이 없습니다.');
    return res.status(400).json({ error: '토큰이 필요합니다.' });
  }

  // 토큰 검증
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('토큰 검증 실패:', err.message); // 검증 실패 메시지 출력
      // 토큰이 잘못되었다면 400 응
      return res.status(400).json({ error: '유효하지 않은 토큰입니다.' });
    }
    // 해당 토큰의 userId를 추출하여 요청 객체에 추가
    req.userId = decoded.id; 

    // 토큰이 해당 유저를 제대로 가져왔는지 체크
    console.log('JWT 검증 완료, userId:', req.userId);

    next(); // 다음 미들웨어 또는 라우트로 이동
  });
}

module.exports = authenticateToken;
