require('dotenv').config({ path: '.env' });
const mysql = require('mysql2');
const express = require('express');
const router = express.Router();

// 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 프라미스 기반 연결 풀 사용
const conn = pool.promise();

// 연결 확인 (옵션: 필요시 사용)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL 연결 실패:', err);
    return;
  }
  console.log('MySQL에 성공적으로 연결되었습니다.');
  connection.release(); // 연결을 반환
});

module.exports = pool.promise();