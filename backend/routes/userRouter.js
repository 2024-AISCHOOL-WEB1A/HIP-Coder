const  {log} = require('console')
const express = require('express')
const router = express.Router()
const conn = require('../config/db')

router.get('/tt', (req, res) => {
    log('ta')
})

module.exports = router