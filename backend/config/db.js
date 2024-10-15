require('dotenv').config();
const mysql = require('mysql2/promise');

// 데이터베이스 연결 코드
async function dbCon() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
}

// 데이터베이스 관리 함수
async function getDbCursor(callback) {
  const connection = await dbCon();
  try {
    await callback(connection);
  } finally {
    await connection.end();
  }
}

// // 예시 사용 코드
// getDbCursor(async (db) => {
//   const [rows, fields] = await db.execute('SELECT * FROM your_table_name');
//   console.log(rows);
// }).catch((err) => {
//   console.error('Error:', err);
// });