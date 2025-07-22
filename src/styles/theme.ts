// src/styles/theme.ts (예시)
// 기존 theme 파일 내용에 아래 colors 속성을 추가하거나 수정해주세요.

export const theme = {
    colors: {
        // ... 기존 색상들 ...
        primary: '#4A90E2',
        secondary: '#50E3C2',
        textDark: '#333333',
        textBody: '#666666',
        background: '#F8F8F8', // 앱 전체 배경색
        white: '#FFFFFF', // 흰색 (활성 탭 배경색 등으로 사용)
        lightGray: '#E0E0E0', // 연한 회색 (비활성 탭 배경색 등으로 사용)
        borderGray: '#EEEEEE',
        primaryLight: '#BBDEFB',
        primaryDark: '#2196F3',
        weekendBackground: '#FFF0F5',
        accentRed: '#FF4136',
        dateRangeColor1: '#F0F8FF',
        dateRangeColor2: '#FFFBE6',

        // ✨ 탭 메뉴를 위한 새로운 색상 정의 ✨
        tabActiveBg: '#FFFFFF', // 활성 탭 배경색 (흰색)
        tabActiveText: '#4A90E2', // 활성 탭 글자색 (primary와 유사하게)
        tabInactiveBg: '#EFEFEF', // 비활성 탭 배경색 (연한 회색)
        tabInactiveText: '#999999', // 비활성 탭 글자색 (비활성 회색)
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
