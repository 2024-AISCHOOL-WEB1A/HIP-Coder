const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')


// 메인
router.get('/', (req, res) => {
    log('test')
})

router.get('/test', (req, res) => {
    res.json({ message: '서버로부터 응답입니다!' })
})

router.post('/submit', (req, res) => {
    const { data } = req.body; // 프론트엔드에서 전송된 데이터
    log('받은 데이터:', data); // 서버 콘솔에 입력된 값 출력
    res.json({ message: `서버로부터 받은 값: ${data}` }); // 클라이언트로 응답 전송
})


module.exports = router