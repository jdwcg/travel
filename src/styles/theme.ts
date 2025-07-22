// src/styles/theme.ts (예시)
// 기존 theme 파일 내용에 아래 colors 속성을 추가하거나 수정해주세요.

export const theme = {
    colors: {
        primary: '#4A90E2', // 예시 색상, 단의 기본 primary 색상으로 유지하세요
        secondary: '#50E3C2', // 예시 색상, 단의 기본 secondary 색상으로 유지하세요
        textDark: '#333333', // 텍스트 어두운 색상
        textBody: '#666666', // 텍스트 일반 색상
        background: '#F8F8F8', // 앱 전체 배경색
        white: '#FFFFFF', // 흰색
        lightGray: '#E0E0E0', // 연한 회색 (테두리, 그림자 등)
        borderGray: '#EEEEEE', // 더 연한 회색 (구분선 등)
        primaryLight: '#BBDEFB', // primary의 밝은 버전
        primaryDark: '#2196F3', // primary의 어두운 버전
        weekendBackground: '#FFF0F5', // 주말 배경색 (연한 분홍색) - 주말 TDDate에서 사용
        accentRed: '#FF4136', // 강조 빨간색 (주말 텍스트 등) - 주말 TDDate에서 사용

        // 추가로 필요한 색상도 여기서 정의할 수 있어요
        dateRangeColor1: '#F0F8FF', // 2~8일차 배경색 (연한 하늘색)
        dateRangeColor2: '#FFFBE6', // 9일차 배경색 (연한 노란색)
    },
    fontSizes: {
        small: '12px',
        medium: '16px',
        large: '20px',
        // ...
    },
    spacings: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        // ...
    },
    // ...
};

// theme 파일에 기존에 정의된 다른 속성(폰트 크기, 간격 등)은 그대로 유지하세요.
