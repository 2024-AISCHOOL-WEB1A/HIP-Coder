const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')

router.get('/tt', (req, res) => {
    log('ta')
})

/** 회원가입 */
router.post('/joindata', (req, res) => {
    const { ID, PW, EMAIL, BIR_DATE, GEN } = req.body
})

module.exports = router