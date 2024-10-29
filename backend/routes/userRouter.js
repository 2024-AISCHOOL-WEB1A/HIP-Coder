const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')
const bcrypt = require('bcrypt')
const {v4 : uuidv4} = require('uuid')
const nodemailer = require('nodemailer')
const crypto = require('crypto')



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
    const { id, password, passwordCheck, name, email, phone } = req.body;
    // log('d')
    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (password !== passwordCheck) {
        return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    try {
        var idx = uuidv4()
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 정보를 DB에 삽입
        const sql = 'INSERT INTO USER (USER_ID, USER_PW, USER_NAME, EMAIL, PHONE, USER_IDX) VALUES (?, ?, ?, ?, ?, ?)';
        await conn.promise().query(sql, [id, hashedPassword, name, email, phone, idx]);

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
        log('d')
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
router.post('/mypage', (req, res) => {
    const {idx} = req.body
    var sql = `SELECT U.USER_NAME, U.PHONE, U.EMAIL, E.CONTACT_INFO
                FROM USER U INNER JOIN EMG_CON E
                ON U.USER_IDX = E.USER_IDX
                WHERE U.USER_IDX =  ?`

    conn.query(sql, [idx], (err, r) => {
        if (err) {
            console.error('DB Count Error', err)
            return res.status(500).json({error : 'DB Count Error'})
        } else {
            log(r)
            res.json({ message: r})
        }
    })
})

/** 비밀번호 찾기 요청 처리 */
router.get('/forgot-password', async (req, res) => {
    var idx = '5cfb4bbd-0c67-430e-8e81-7a888399728b' // 임시로 넣은 값
    var pwsql = `SELECT EMAIL 
                FROM USER
                WHERE USER_IDX = ?`
    conn.query(pwsql, [idx], (err, r) => {
        if (err) {
            console.error('DB Count Error', err)
            return res.status(500).json({error : 'DB Count Error'}) 
        } else if (r.length === 0) {
            return res.status(404).json({error : '사용자를 찾을 수 없습니다.'})
        } else {
            const email = r[0].EMAIL
            try {
                const token = crypto.randomBytes(32).toString('hex')
                const resetLink = `http://yourfrontend.com/reset-password/${token}`

                const updatesql = `UPDATE USER SET RESET_PASSWORD_TOKEN = ?, 
                                  RESET_PASSWORD_EXPIRES = ? 
                                  WHERE USER_IDX = ?`;

                const expires = new Date(Date.now() + 3600000) 
                
                conn.query(updatesql, [token, expires, idx], (err, r) => {
                    if (err) {
                        console.error('DB Count Error', err)
                        return res.status(500).json({error : 'DB Count Error'})
                    } else {
                        const transporter = nodemailer.createTransport({
                            service : 'Gmail',
                            auth : {
                                user : process.env.EMAIL,
                                pass : process.env.EMAIL_PASSWORD 
                            }
                        })
                        const  mailOptiones = {
                            to : email,
                            from : process.env.EMAIL,
                            subject : '비밀번호 재설정 요청',
                            text : `비밀번호를 재설정 하려면 다음 링크를 클릭하세요 : ${resetLink}
                            \n 이 링크는 1시간 동안 유효합니다.`
                        }
                        // 이메일 보내기
                        transporter.sendMail(mailOptiones, (emailErr) => {
                            if (emailErr) {
                                console.error('Email send Error', emailErr)
                                return res.status(500).json({error : '이메일 전송에 실패 했습니다.'})
                            } else {
                                res.status(200).json({message : '비밀번호 재설정 이메일이 전송되었습니다.'})
                            }
                        })
                    }
                })
            } catch (error) {
                console.error('Token Generation Error' , error)
                res.status(500).json({error : '토큰 생성 중 오류가 발생했습니다.'})
            }
        }
    })
})

// 로그인 라우터
router.post('/handleLogin', async (req, res) => {
    const { id, password } = req.body;

    try {
        // 사용자 정보를 데이터베이스에서 조회
        const sql = 'SELECT USER_PW FROM USER WHERE USER_ID = ?';
        const [rows] = await conn.promise().query(sql, [id]);


        // 사용자 ID가 존재하지 않으면 에러 반환
        if (rows.length === 0) {
            return res.status(400).json({ error: '존재하지 않는 사용자입니다.' });
        }

        const hashpassword = rows[0].USER_PW;

        // 비밀번호 검증
        const isMatch = await verifypw(password, hashpassword);

        if (isMatch) {
            // 비밀번호가 맞다면 성공 응답
            return res.status(200).json({ message: '로그인 성공!' });
        } else {
            // 비밀번호가 틀리면 에러 반환
            return res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
        }

    } catch (error) {
        console.error('로그인 처리 중 오류: ', error);
        return res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
    }
});

module.exports = router;
