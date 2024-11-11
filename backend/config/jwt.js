const express = require("express")
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' });
const path = require('path');

// 환경변수에서 키 로드
const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

// JWT 토큰 생성
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn : TOKEN_EXPIRY });
}

// REFRESH 토큰 생성
function generateRefreshToken(payload) {
  console.log('리프레시 발급')
  return jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: REFRESH_TOKEN_EXPIRY });
}

// 외부에서 사용할 수 있도록 함수 exports
module.exports = { generateToken, generateRefreshToken }