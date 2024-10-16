import axios, { AxiosInstance } from 'axios';
import { API_BASE_URL } from '@env'; // 반드시 '@env'로 가져와야 함

// API 클라이언트 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // 환경 변수를 사용
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
