const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')
const bcrypt = require('bcrypt')

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



module.exports = router