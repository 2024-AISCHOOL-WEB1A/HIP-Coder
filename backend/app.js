const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000

// 라우터 설정
const mainRouter = require('./routes/mainRouter')


// body-parser 미들웨어 설정(POST 허용)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', mainRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})