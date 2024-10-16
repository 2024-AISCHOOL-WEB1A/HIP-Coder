require('dotenv').config({ path: '../.env' });
const mysql = require('mysql2/promise');
const path = require('path');

// 데이터베이스 연결 코드
async function dbCon() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    console.log('데이터베이스에 연결되었습니다.');
    return conn;
  } catch (err) {
    console.error('MySQL 연결 오류:', err);
    throw err; // 연결 오류를 상위 함수로 전달
  }
}

// 데이터베이스 관리 함수
async function getDbCursor(callback) {
  const connection = await dbCon();
  try {
    await callback(connection);
  } finally {
    await connection.end();
    console.log('데이터베이스 연결이 종료되었습니다.');
  }
}

module.exports = { dbCon, getDbCursor };
