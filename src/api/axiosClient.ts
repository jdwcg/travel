// src/api/axiosClient.ts

import axios from 'axios'; // axios 라이브러리를 임포트합니다.

// 현재 웹사이트의 호스트 이름을 기반으로 백엔드 API의 기본 URL을 설정합니다.
const API_BASE_URL = `http://${window.location.hostname}:5000`; // 백엔드 포트 5000

// ✨✨✨ axios 인스턴스 생성 및 초기화 부분을 인터셉터보다 위로! ✨✨✨
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

// ✨✨✨ 이제 인터셉터 부분을 axiosClient 선언 이후로 옮깁니다! ✨✨✨

// 요청 인터셉터 (선택 사항: 요청 전 로깅, 토큰 추가 등을 할 때 유용)
axiosClient.interceptors.request.use(
    (config) => {
        // console.log(`[Axios Request] URL: ${config.url}, Method: ${config.method}`);
        // 여기에 인증 토큰 등을 헤더에 추가할 수 있습니다.
        return config;
    },
    (error) => {
        console.error('[Axios Request Error]:', error);
        return Promise.reject(error);
    },
);

// 응답 인터셉터 (선택 사항: 응답 후 에러 처리, 로딩바 숨기기 등을 할 때 유용)
axiosClient.interceptors.response.use(
    (response) => {
        // console.log('[Axios Response]:', response);
        return response;
    },
    (error) => {
        console.error(
            '[Axios Response Error]:',
            error.response || error.message,
        );
        // 예: 401 에러 시 로그인 페이지로 리다이렉트
        // if (error.response && error.response.status === 401) {
        //   window.location.href = '/login';
        // }
        return Promise.reject(error);
    },
);

export default axiosClient; // 다른 파일에서 사용할 수 있도록 내보내기
