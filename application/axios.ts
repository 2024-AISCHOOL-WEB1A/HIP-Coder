import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env'; // 반드시 '@env'로 가져와야 함

// API 클라이언트 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL, // 환경 변수를 사용
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// api 모든 요청에 토큰 자동으로 추가
api.interceptors.request.use(
  async (config) => { // config => axios 실제 요청 객체
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // 헤드에 토큰 저장
    }
    return config;
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default api;
