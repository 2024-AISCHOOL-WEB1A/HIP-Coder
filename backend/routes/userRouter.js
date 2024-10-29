const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')
const bcrypt = require('bcrypt')
const {v4 : uuidv4} = require('uuid')
const nodemailer = require('nodemailer')
const crypto = require('crypto')

/** 회원가입 */
router.post('/handleJoin', (req, res) => {
    const { ID, PW, EMAIL, BIR_DATE, GEN } = req.body

    let sql = "INSERT INTO USER VALUES ()"
})

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

/** 아이디 중복확인 */ 
router.post('/idcheck', (req, res) => {
    const {idck} = req.body
    
    var sql = `SELECT COUNT(*) as CNT
                FROM USER
                WHERE USER_ID = ?`

    conn.query(sql, [idck], (err, r) => {
        if (err) {
            console.error('DB Count Error: ', err);
            return res.status(500).json({ error: 'DB Count Error' });
        } else {
            const idck = r[0].CNT

            if (idck > 0) {
                res.json({message : '중복'})
            } else {
                res.json({message : '가능'})
            }
        }
    }) 
})

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


router.get('/test' , (req, res) => {
    log(uuidv4())
})

module.exports = router