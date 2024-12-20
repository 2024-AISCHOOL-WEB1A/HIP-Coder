const { log } = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const jwtoken = require('../config/jwt')
const authenticateToken = require('../config/middleWare');


// userRouter.js 파일 최상단에 추가
const verificationTokens = {}; // 인증 토큰을 저장할 빈 객체 정의

// 비밀번호 해싱 함수
async function hashpw(password) {
    const saltRounds = 10
    try {
        const hashpassword = await bcrypt.hash(password, saltRounds)
        return hashpassword
    } catch (error) {
        console.error('비밀번호 해싱 오류 : ', error)
    }
}

// 비밀번호 검증 함수
async function verifypw(password, hashpassword) {
    try {
        const match = await bcrypt.compare(password, hashpassword)
        if (match) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('비밀번호 검증오류 : ', error)
    }
}

// 회원가입 라우터
router.post('/handleJoin', async (req, res) => {
    const { id, password, passwordCheck, name, email, phone, emergencyContact1, emergencyContact2 } = req.body;

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== passwordCheck) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    try {
        // 고유 사용자 식별자 생성
        const idx = uuidv4();

        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 정보를 DB에 삽입하는 SQL 쿼리
        const sql = 'INSERT INTO USER (USER_ID, USER_PW, USER_NAME, EMAIL, PHONE, USER_IDX) VALUES (?, ?, ?, ?, ?, ?)';
        const emergency1 = `INSERT INTO EMG_CON (USER_IDX, CONTACT_INFO1, CONTACT_INFO2) VALUES (?, ?, ?)`;

        // 사용자 정보 삽입
        await conn.query(sql, [id, hashedPassword, name, email, phone, idx]);

        // 비상 연락처 삽입
        await conn.query(emergency1, [idx, emergencyContact1, emergencyContact2]);

        // 회원가입 성공 메시지 반환
        return res.status(200).json({ message: '회원가입 성공!' });

    } catch (error) {
        console.error('회원가입 처리 중 오류: ', error);
        return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
    }
});

// 아이디 중복 확인 라우터
router.post('/idcheck', async (req, res) => {
    const { idck } = req.body; // 프론트엔드와 동일하게 idck로 받아야 함
  
    try {
      // 아이디 중복 확인 SQL 쿼리
      const sql = 'SELECT COUNT(*) AS CNT FROM USER WHERE USER_ID = ?';
      const [rows] = await conn.query(sql, [idck]);
  
      // 결과 확인 및 응답
      if (rows[0].CNT > 0) {
        return res.status(200).json({ message: '중복' }); // 중복된 경우
      } else {
        return res.status(200).json({ message: '가능' }); // 사용 가능한 경우
      }
    } catch (error) {
      console.error('DB Count Error: ', error);
      return res.status(500).json({ error: 'DB Count Error' });
    }
  });

// 백엔드 마이페이지 데이터 요청 처리
router.post('/mypage', authenticateToken, async (req, res) => {
    const userId = req.userId; // 미들웨어에서 설정한 사용자 ID 사용
  
    const sql = `
      SELECT U.USER_NAME, U.PHONE, U.EMAIL, E.CONTACT_INFO1, E.CONTACT_INFO2
      FROM USER U
      INNER JOIN EMG_CON E ON U.USER_IDX = E.USER_IDX
      WHERE U.USER_IDX = ?
    `;
  
    try {
      // 쿼리 실행
      const [results] = await conn.query(sql, [userId]);
      
      // 사용자 정보가 없는 경우 처리
      if (results.length === 0) {
        return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
      }
  
      // 사용자 정보 반환
      res.json({ message: results });
    } catch (error) {
      // 에러 처리
      console.error('DB 조회 중 오류:', error);
      res.status(500).json({ error: '사용자 데이터를 불러오는 중 오류가 발생했습니다.' });
    }
  });

// 비상연락망 수정 라우터
router.post('/update', authenticateToken, async (req, res) => {
    const userId = req.userId; // 미들웨어에서 설정한 사용자 ID 사용
    const { emergencyContact1, emergencyContact2 } = req.body;
  
    console.log('userId:', userId);
  
    try {
      // 비상 연락망 업데이트 SQL 쿼리
      const sql = 'UPDATE EMG_CON SET CONTACT_INFO1 = ?, CONTACT_INFO2 = ? WHERE USER_IDX = ?';
  
      // 쿼리 실행
      const [results] = await conn.query(sql, [emergencyContact1, emergencyContact2, userId]);
  
      // 업데이트된 행이 없을 경우 처리
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
      }
  
      // 업데이트 성공 응답
      res.status(200).json({ message: '비상 연락망이 성공적으로 수정되었습니다.' });
      console.log('비상 연락망 수정 완료');
    } catch (error) {
      console.error('비상 연락망 수정 오류:', error);
      res.status(500).json({ error: '비상 연락망 수정 중 오류가 발생했습니다.' });
    }
  });

/** 비밀번호 찾기 요청 처리 */
router.post('/FindPw', async (req, res) => {
  const { id, name, email } = req.body;

  if (!id || !name || !email) {
    return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
  }

  const pwsql = `SELECT USER_IDX, EMAIL FROM USER WHERE USER_ID = ? AND USER_NAME = ? AND EMAIL = ?`;

  try {
    // 사용자 정보 조회 쿼리
    const [result] = await conn.query(pwsql, [id, name, email]);

    // 조회된 사용자가 없는 경우
    if (result.length === 0) {
      return res.status(404).json({ error: '입력하신 정보에 해당하는 사용자를 찾을 수 없습니다.' });
    }

    const userIdx = result[0].USER_IDX;
    const userEmail = result[0].EMAIL;

    // 임시 비밀번호 생성 및 해싱
    const temporaryPassword = crypto.randomBytes(4).toString('hex'); // 8자리 임시 비밀번호
    const hashedPassword = await hashpw(temporaryPassword); // hashpw 함수 사용
    const expires = new Date(Date.now() + 3600000); // 1시간 후 만료 시간 설정

    // 데이터베이스에 임시 비밀번호와 만료 시간 저장
    const updatesql = `UPDATE USER SET USER_PW = ?, TEMP_PASSWORD_EXPIRES = ? WHERE USER_IDX = ?`;
    const [updateResult] = await conn.query(updatesql, [hashedPassword, expires, userIdx]);

    // 업데이트 결과 확인
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ error: '사용자 정보를 업데이트할 수 없습니다.' });
    }

    // 이메일 발송 설정
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      to: userEmail,
      from: process.env.EMAIL,
      subject: '임시 비밀번호 발급',
      html: `
        <div>임시 비밀번호가 발급되었습니다.</div>
        <div>다음 임시 비밀번호로 로그인하세요:</div>
        <div style="font-weight: bold; color: #000000; font-size: 18px;">${temporaryPassword}</div>
        임시 비밀번호는 1시간 동안 유효합니다.
        로그인 후 반드시 비밀번호를 변경해 주세요.
      `
    };

    // 이메일 보내기
    transporter.sendMail(mailOptions, (emailErr) => {
      if (emailErr) {
        console.error('Email Send Error:', emailErr);
        return res.status(500).json({ error: '이메일 전송 실패' });
      } else {
        res.status(200).json({ message: '임시 비밀번호가 이메일로 전송되었습니다.' });
      }
    });

  } catch (error) {
    console.error('오류 발생:', error);
    res.status(500).json({ error: '비밀번호 찾기 처리 중 오류가 발생했습니다.' });
  }
});

// 비밀번호 변경
router.post('/changePassword', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;
  
    console.log('userId:', userId);
  
    // 새 비밀번호 확인: 새 비밀번호와 확인 비밀번호가 같은지 확인합니다.
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: '새 비밀번호가 일치하지 않습니다.' });
    }
  
    try {
      // 현재 비밀번호 확인하기
      const sql = 'SELECT USER_PW FROM USER WHERE USER_IDX = ?';
      const [rows] = await conn.query(sql, [userId]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
  
      const user = rows[0];
      const isMatch = await bcrypt.compare(currentPassword, user.USER_PW);
  
      // 현재 비밀번호가 일치하지 않는 경우 처리
      if (!isMatch) {
        return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
      }
  
      // 새 비밀번호 해싱
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // 데이터베이스에 새 비밀번호 저장
      const updateSql = 'UPDATE USER SET USER_PW = ?, TEMP_PASSWORD_EXPIRES = NULL WHERE USER_IDX = ?';
      const [updateResult] = await conn.query(updateSql, [hashedNewPassword, userId]);
  
      if (updateResult.affectedRows === 0) {
        return res.status(404).json({ error: '비밀번호 업데이트에 실패했습니다. 사용자 정보를 찾을 수 없습니다.' });
      }
  
      // 비밀번호 변경 성공 응답
      res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
      console.log('비밀번호 변경 완료');
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
    }
  });

// 로그인 라우터
router.post('/handleLogin', async (req, res) => {
    const { id, password } = req.body;
    console.log('req : ', req.body);
  
    try {
      const sql = 'SELECT USER_IDX, USER_NAME, USER_PW, TEMP_PASSWORD_EXPIRES FROM USER WHERE USER_ID = ?';
      const [rows] = await conn.query(sql, [id]);
  
      if (rows.length === 0) {
        return res.status(400).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
  
      const user = rows[0];
      console.log('user:', user);
  
      // 현재 시간 확인
      const currentTime = new Date();
      let isMatch = false;
  
      // 임시 비밀번호 유효성 검사
      if (user.TEMP_PASSWORD_EXPIRES && new Date(user.TEMP_PASSWORD_EXPIRES) > currentTime) {
        isMatch = await verifypw(password, user.USER_PW);
  
        if (isMatch) {
          // 토큰 생성
          const accessToken = jwtoken.generateToken({ id: user.USER_IDX, sub: user.USER_IDX });
          const refreshToken = jwtoken.generateRefreshToken({ id: user.USER_IDX, sub: user.USER_IDX });
  
          // 리프레시 토큰을 쿠키에 설정
          res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // production 환경일 때만 secure 설정
            sameSite: 'strict'
          });
  
          return res.status(200).json({
            message: '임시 비밀번호로 로그인되었습니다. 비밀번호를 변경해 주세요.',
            token: accessToken,
            userName: user.USER_NAME, // USER_NAME을 응답에 추가
            temporaryPassword: true
          });
        }
      }
  
      // 일반 비밀번호 유효성 검사
      isMatch = await verifypw(password, user.USER_PW);
      if (isMatch) {
        // 토큰 생성
        const accessToken = jwtoken.generateToken({ id: user.USER_IDX, sub: user.USER_IDX });
        const refreshToken = jwtoken.generateRefreshToken({ id: user.USER_IDX, sub: user.USER_IDX });
  
        // 리프레시 토큰을 쿠키에 설정
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict'
        });
  
        console.log('jwt 토큰 확인:', accessToken);
        console.log('refresh 토큰 확인(쿠키):', refreshToken);
  
        return res.status(200).json({ 
          message: '로그인 성공!', 
          token: accessToken, 
          userName: user.USER_NAME, 
          temporaryPassword: false 
        });
      } else {
        return res.status(400).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
      }
  
    } catch (error) {
      console.error('로그인 처리 중 오류:', error);
      return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
  });
  


/** 아이디 찾기 */
router.post('/FindId', async (req, res) => {
    const { USER_NAME, EMAIL } = req.body;
  
    log('아이디 찾기 요청:', req.body);
  
    const idsql = `SELECT USER_ID FROM USER WHERE USER_NAME = ? AND EMAIL = ?`;
  
    try {
      // 프라미스 기반으로 쿼리 실행
      const [rows] = await conn.query(idsql, [USER_NAME, EMAIL]);
  
      // 사용자가 없는 경우 처리
      if (rows.length === 0) {
        return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
      }
  
      // 인증 토큰 생성 및 저장
      const verificationToken = crypto.randomBytes(32).toString('hex'); // 32바이트 토큰 생성
      verificationTokens[verificationToken] = { EMAIL, expires: Date.now() + 3600000 }; // 1시간 후 만료
  
      // 인증 링크 생성
      const verificationLink = `${process.env.BACK_URL}/user/verify-id/${verificationToken}`;
  
      // 이메일 발송 설정
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });
  
      const mailOptions = {
        to: EMAIL,
        from: process.env.EMAIL,
        subject: '아이디 찾기 인증 링크',
        html: `
          <p>아이디를 찾으려면 아래 버튼을 클릭하세요:</p>
          <a href="${verificationLink}" target="_blank" rel="noopener noreferrer" style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: white;
            background-color: #3182f6;
            text-decoration: none;
            border-radius: 10px;
          ">아이디 찾기</a>
          <p>이 링크는 1시간 동안 유효합니다.</p>
        `
      };
  
      // 이메일 보내기
      transporter.sendMail(mailOptions, (emailErr) => {
        if (emailErr) {
          console.error('Email Send Error:', emailErr);
          return res.status(500).json({ error: '이메일 전송 실패' });
        }
        res.status(200).json({ message: '인증 링크가 이메일로 전송되었습니다.' });
      });
    } catch (err) {
      console.error('DB Query Error:', err);
      return res.status(500).json({ error: 'DB Query Error' });
    }
  });

/** 아이디 찾기 - 인증 링크(토큰)확인 */
router.get('/verify-id/:token', async (req, res) => {
  log('아이디 찾기 요청');
  const { token } = req.params;

  // 토큰 유효성 검사
  const tokenData = verificationTokens[token];
  if (!tokenData || tokenData.expires < Date.now()) {
    return res.status(400).send('<h2>유효하지 않거나 만료된 링크입니다.</h2>');
  }

  const { EMAIL } = tokenData;

  const idsql = `SELECT USER_ID FROM USER WHERE EMAIL = ?`;

  try {
    // 프라미스 기반으로 쿼리 실행
    const [rows] = await conn.query(idsql, [EMAIL]);

    // 사용자 정보가 없는 경우
    if (rows.length === 0) {
      return res.status(404).send('<h2>사용자를 찾을 수 없습니다.</h2>');
    }

    const user_id = rows[0].USER_ID;

    // 인증 성공 후 토큰 삭제
    delete verificationTokens[token];

    // 인증 완료 후 사용자 ID를 HTML로 반환
    res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              background-color: white;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              text-align: center;
            }
            h2 {
              color: #333;
              text-align: center;
            }
            p {
              color: #555;
              font-size: 16px;
            }
            .logo {
              width: 150px; /* 로고 크기 조정 */
              margin-bottom: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="https://jsh-1.s3.ap-northeast-2.amazonaws.com/KakaoTalk_20241115_153601709.png" alt="Thing Q" class="logo">
            <h2>아이디 찾기 인증 완료</h2>
            <p>회원님의 아이디는 <strong>${user_id}</strong> 입니다.</p>
          </div>
        </body>
      </html>
    `);

  } catch (err) {
    console.error('DB Query Error:', err);
    res.status(500).send('<h2>DB Query Error</h2>');
  }
});

// 회원 탈퇴 라우터
router.post('/withdrawal', authenticateToken, async (req, res) => {
    const userId = req.userId; // 미들웨어에서 설정한 사용자 ID 사용
  
    console.log('회원 탈퇴 요청 - userId:', userId);
  
    try {
      // 사용자 정보 및 비상 연락망 정보 삭제
      const deleteEmgConSql = 'DELETE FROM EMG_CON WHERE USER_IDX = ?';
      const deleteUserSql = 'DELETE FROM USER WHERE USER_IDX = ?';
  
      // 비상 연락망 정보 삭제
      await conn.query(deleteEmgConSql, [userId]);
  
      // 사용자 정보 삭제
      const [results] = await conn.query(deleteUserSql, [userId]);
  
      // 삭제된 사용자 정보가 없는 경우 처리
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' });
      }
  
      res.status(200).json({ message: '회원 탈퇴가 성공적으로 완료되었습니다.' });
      console.log('회원 탈퇴 완료');
    } catch (error) {
      console.error('회원 탈퇴 오류:', error);
      res.status(500).json({ error: '회원 탈퇴 중 오류가 발생했습니다.' });
    }
  });


module.exports = router;
