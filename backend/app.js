const express = require('express')
const path = require('path')
require('dotenv').config()
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')

const applyCsrfProtection = require('./config/csrf')
const applySessionManagement = require('./config/session');

// 라우터 설정
const mainRouter = require('./routes/mainRouter')
const userRouter = require('./routes/userRouter')
const configRouter = require('./routes/configRouter')

// 미들웨어 설정
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 세션 관리 적용
applySessionManagement(app);

// CSRF 보호 적용
applyCsrfProtection(app);

app.use('/', mainRouter)
app.use('/user', userRouter)
app.use('/config', configRouter)

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
})