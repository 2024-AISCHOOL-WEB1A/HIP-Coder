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
    // log('d')
    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    log(req.body)
    if (password !== passwordCheck) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    try {
        var idx = uuidv4()
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 정보를 DB에 삽입
        const sql = 'INSERT INTO USER (USER_ID, USER_PW, USER_NAME, EMAIL, PHONE, USER_IDX) VALUES (?, ?, ?, ?, ?, ?)';
        const emergency1 = `INSERT INTO EMG_CON (USER_IDX, CONTACT_INFO1, CONTACT_INFO2) VALUES (?, ?, ?)`
        await conn.promise().query(sql, [id, hashedPassword, name, email, phone, idx]);
        await conn.promise().query(emergency1, [idx, emergencyContact1, emergencyContact2])


        return res.status(200).json({ message: '회원가입 성공!' });

    } catch (error) {
        console.error('회원가입 처리 중 오류: ', error);
        return res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
    }
});

// 아이디 중복 확인 라우터
router.post('/idcheck', async (req, res) => {
    const { idck } = req.body;  // 프론트엔드와 동일하게 idck로 받아야 함
    try {
        // log('d')
        const sql = 'SELECT COUNT(*) AS CNT FROM USER WHERE USER_ID = ?';
        const [result] = await conn.promise().query(sql, [idck]);

        if (result[0].CNT > 0) {
            return res.status(200).json({ message: '중복' });  // 200 상태 코드로 반환
        } else {
            return res.status(200).json({ message: '가능' });  // 200 상태 코드로 반환
        }
    } catch (error) {
        console.error('DB Count Error: ', error);
        return res.status(500).json({ error: 'DB Count Error' });
    }
});

/** 마이페이지 정보 불러오기 */
router.post('/mypage', authenticateToken, (req, res) => {
    const userId = req.userId;

    log('마이페이지 요청, userId:', userId);

    var sql = `SELECT U.USER_NAME, U.PHONE, U.EMAIL, E.CONTACT_INFO1, E.CONTACT_INFO2
                FROM USER U INNER JOIN EMG_CON E
                ON U.USER_IDX = E.USER_IDX
                WHERE U.USER_IDX =  ?`

    conn.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('DB Count Error', err)
            return res.status(500).json({ error: 'DB Count Error' })
        } else if (results.length === 0) {
            return res.status(404).json({ error: '사용자 정보를 찾을 수 없습니다.' })
        } else {
            log(results)
            res.json({ message: results })
        }
    })
})

/** 비밀번호 찾기 요청 처리 */
router.post('/FindPw', async (req, res) => {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
        return res.status(400).json({ error: '모든 필드를 입력해주세요.' });
    }

    const pwsql = `SELECT USER_IDX, EMAIL FROM USER WHERE USER_ID = ? AND USER_NAME = ? AND EMAIL = ?`;

    conn.query(pwsql, [id, name, email], async (err, result) => {
        if (err) {
            console.error('DB Query Error:', err);
            return res.status(500).json({ error: 'DB Query Error' });
        } else if (result.length === 0) {
            return res.status(404).json({ error: '입력하신 정보에 해당하는 사용자를 찾을 수 없습니다.' });
        } else {
            const userIdx = result[0].USER_IDX;
            const userEmail = result[0].EMAIL;

            try {
                // 임시 비밀번호 생성 및 해싱
                const temporaryPassword = crypto.randomBytes(4).toString('hex'); // 8자리 임시 비밀번호
                const hashedPassword = await hashpw(temporaryPassword); // hashpw 함수 사용

                const expires = new Date(Date.now() + 3600000); // 1시간 후 만료 시간 설정

                // 데이터베이스에 임시 비밀번호와 만료 시간 저장
                const updatesql = `UPDATE USER SET USER_PW = ?, TEMP_PASSWORD_EXPIRES = ? WHERE USER_IDX = ?`;
                conn.query(updatesql, [hashedPassword, expires, userIdx], (updateErr) => {
                    if (updateErr) {
                        console.error('DB Update Error:', updateErr);
                        return res.status(500).json({ error: 'DB Update Error' });
                    } else {
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
                            text: `임시 비밀번호가 발급되었습니다. 다음 임시 비밀번호로 로그인하세요:\n ${temporaryPassword}\n\n임시 비밀번호는 1시간 동안 유효합니다. 로그인 후 반드시 비밀번호를 변경해 주세요.`
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
                    }
                });
            } catch (error) {
                console.error('Temporary Password Generation Error:', error);
                res.status(500).json({ error: '임시 비밀번호 생성 중 오류' });
            }
        }
    });
});

// 비밀번호 변경
router.post('/changePassword', authenticateToken, async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.userId;

    console.log('userId', userId);
    
    try {
        // 현재 비밀번호 확인하기
        const sql = 'SELECT USER_PW FROM USER WHERE USER_IDX = ?';
        const [rows] = await conn.promise().query(sql, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(currentPassword, user.USER_PW);

        if (!isMatch) {
            return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
        }

        // 새 비밀번호 변경 및 해싱
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const updateSql = 'UPDATE USER SET USER_PW = ?, TEMP_PASSWORD_EXPIRES = NULL WHERE USER_IDX = ?';
        await conn.promise().query(updateSql, [hashedNewPassword, userId]);

        res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
        console.log('비밀번호 변경 완료');
    } catch (error) {
        console.error('비밀번호 변경 오류', error);
        res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
    }
});


// 로그인 라우터
router.post('/handleLogin', async (req, res) => {
    const { id, password } = req.body;
    console.log('req : ', req.body);
    try {
        const sql = 'SELECT USER_IDX, USER_PW, TEMP_PASSWORD_EXPIRES FROM USER WHERE USER_ID = ?';
        const [rows] = await conn.promise().query(sql, [id]);

        if (rows.length === 0) {
            return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
        }

        const user = rows[0];
        console.log('user:', user);

        const currentTime = new Date();
        let isMatch = false;

        if (user.TEMP_PASSWORD_EXPIRES && new Date(user.TEMP_PASSWORD_EXPIRES) > currentTime) {
            isMatch = await verifypw(password, user.USER_PW);

            if (isMatch) {
                return res.status(200).json({
                    message: '임시 비밀번호로 로그인되었습니다. 비밀번호를 변경해 주세요.',
                    token: jwtoken.generateToken({ id: user.USER_IDX }),
                    temporaryPassword: true
                });
            }
        }

        isMatch = await verifypw(password, user.USER_PW);
        if (isMatch) {
            const token = jwtoken.generateToken({ id: user.USER_IDX });
            console.log('jwt 토큰 확인:', token);
            return res.status(200).json({ message: '로그인 성공!', token, temporaryPassword: false });
        } else {
            return res.status(400).json({ error: '아이디 또는 비밀번호가 일치하지 않습니다.' });
        }

    } catch (error) {
        console.error('로그인 처리 중 오류: ', error);
        return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
});

/** 아이디 찾기 */
router.post('/FindId', (req, res) => {
    log('아이디 찾기 요청', req.body)
    const { USER_NAME, EMAIL } = req.body

    const idsql = `SELECT USER_ID FROM USER WHERE USER_NAME = ? AND EMAIL = ?`

    conn.query(idsql, [USER_NAME, EMAIL], (err, r) => {
        if (err) {
            console.error('DB Query Error:', err);
            return res.status(500).json({ error: 'DB Query Error' });
        } else if (r.length === 0) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        } else {
            // 인증 토큰 생성 및 저장
            const verificationToken = crypto.randomBytes(32).toString('hex'); // 32바이트 토큰 생성
            verificationTokens[verificationToken] = { EMAIL, expires: Date.now() + 3600000 }; // 1시간 후 만료

            // 인증 링크 생성
            const verificationLink = `${process.env.BACK_URL}/user/verify-id/${verificationToken}`

            // 이메일 발송 설정
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.EMAIL_PASSWORD
                }
            })
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
                    background-color: #4CAF50;
                    text-decoration: none;
                    border-radius: 5px;
                ">아이디 찾기</a>
                <p>이 링크는 1시간 동안 유효합니다.</p>
            `
            }
            transporter.sendMail(mailOptions, (emailErr) => {
                if (emailErr) {
                    console.error('Email Send Error : ', emailErr)
                    return res.status(500).json({ error: '이메일 전송 실패' })
                } else {
                    res.status(200).json({ message: '인증 링크가 이메일로 전송되었습니다.' })
                }
            })
        }
    })
})

/** 아이디 찾기 - 인증 링크(토큰)확인 */
router.get('/verify-id/:token', (req, res) => {
    log('아이디 찾기 요청');
    const { token } = req.params;

    // 토큰 유효성 검사
    const tokenData = verificationTokens[token];
    if (!tokenData || tokenData.expires < Date.now()) {
        return res.status(400).send('<h2>유효하지 않거나 만료된 링크입니다.</h2>');
    }

    const { EMAIL } = tokenData;

    const idsql = `SELECT USER_ID FROM USER WHERE EMAIL = ?`;
    conn.query(idsql, [EMAIL], (err, r) => {
        if (err) {
            console.error('DB Query Error : ', err);
            return res.status(500).send('<h2>DB Query Error</h2>');
        } else if (r.length === 0) {
            return res.status(404).send('<h2>사용자를 찾을 수 없습니다.</h2>');
        } else {
            const user_id = r[0].USER_ID;

            // 인증 성공 후 토큰 삭제
            delete verificationTokens[token];

            // 인증 완료 후 사용자 ID를 HTML로 반환
            res.send(`
                <div style="width: 100%; display: flex; justify-content: center; align-items: center; height: 100vh;">
                    <div style="border: 1px solid #000; padding: 20px;">
                        <p>회원님의 아이디는 <strong>${user_id}</strong> 입니다.</p>
                    </div>
                </div>
            `);
        }
    });
});




module.exports = router;
