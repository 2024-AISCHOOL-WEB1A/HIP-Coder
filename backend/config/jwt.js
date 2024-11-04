const express = require("express")
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' });
const path = require('path');

// 환경변수에서 키 로드
const SECRET_KEY = process.env.SECRET_KEY;
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY

// JWT 토큰 생성
function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY, { expiresIn : TOKEN_EXPIRY });
}

// JWT 토큰 검증 함수
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET_KEY);
  }catch (error) {
    return null; // 유요하지 않은 토큰일 경우 null 반환
  }
}

// 외부에서 사용할 수 있도록 함수 exports
module.exports = { generateToken, verifyToken }