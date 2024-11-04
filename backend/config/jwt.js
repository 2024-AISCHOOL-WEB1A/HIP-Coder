const express = require("express")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' });
const path = require('path');

const app = express();

// 환경변수에서 키 로드
const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY

// 본문 데이터 요청 미들웨어
app.use(bodyParser.json());


app.post("/Login", (req, res) => {
  const { id, password } = req.body;
})