import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';

// API 클라이언트 생성
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 액세스 토큰 추가
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken'); // 액세스 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization 헤더에 추가된 JWT 토큰:', config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 액세스 토큰 만료 시 자동으로 리프레시
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // 액세스 토큰이 만료되었고, originalRequest가 아직 재시도된 적이 없을 경우
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log('액세스 토큰 만료, 리프레시 토큰 사용해 새 액세스 토큰 요청 중');

        // withCredentials 설정으로 쿠키 전달 활성화
        const refreshResponse = await api.post('/config/refresh', {}, { withCredentials: true });
        const newAccessToken = refreshResponse.data.accessToken;

        // 새 액세스 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem('accessToken', newAccessToken);
        console.log('새로운 액세스 토큰이 AsyncStorage에 저장되었습니다:', newAccessToken);

        // 저장된 이후 올바르게 저장되었는지 확인
        const savedToken = await AsyncStorage.getItem('accessToken');
        console.log('AsyncStorage에서 가져온 액세스 토큰:', savedToken);

        // 저장된 토큰을 사용하여 원래 요청의 Authorization 헤더를 업데이트
        originalRequest.headers.Authorization = `Bearer ${savedToken}`;
        console.log('갱신된 액세스 토큰을 사용한 원래 요청 재시도:', originalRequest.headers.Authorization);

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        console.error('리프레시 토큰을 통한 액세스 토큰 갱신 실패:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
