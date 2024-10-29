const { log } = require('console');
const express = require('express');
const router = express.Router();
const conn = require('../config/db');
const bcrypt = require('bcrypt');

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
        var a = '1'
        // 비밀번호 해싱
        const hashedPassword = await bcrypt.hash(password, 10);

        // 사용자 정보를 DB에 삽입
        const sql = 'INSERT INTO USER (USER_ID, USER_PW, USER_NAME, EMAIL, PHONE, USER_IDX) VALUES (?, ?, ?, ?, ?, ?)';
        await conn.promise().query(sql, [id, hashedPassword, name, email, phone, a]);

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
