const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' });
const path = require('path');

// 환경변수에서 키 로드
const secretkey = process.env.JWT_KEY

// JWT 생성 (로그인 시)
const token = jwt.sign({ userId: '123' }, secretKey, { expiresIn: '1h' });
console.log(token);

// JWT 검증 (요청 시)
try {
  const decoded = jwt.verify(token, secretKey);
  console.log(decoded); // 검증된 사용자 정보
} catch (error) {
  console.error('토큰 검증 실패:', error);
}

// 나중에 수정필요