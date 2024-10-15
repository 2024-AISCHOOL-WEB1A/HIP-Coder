const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')


// 메인
router.get('/', (req, res) => {
    log('test')
})


module.exports = router