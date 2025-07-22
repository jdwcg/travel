// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// 필요한 페이지 컴포넌트들을 임포트
import HomePage from './pages/HomePage'; // 업데이트된 HomePage
import DetailPage from './pages/DetailPage'; // 새로 만든 DetailPage

function App() {
    return (
        <Routes>
            {/* 홈 페이지 (10월 제주도 가족 여행 리스트) */}
            <Route path="/" element={<HomePage />} />

            {/* 일정 상세 페이지 (ID를 파라미터로 받음) */}
            <Route path="/detail/:id" element={<DetailPage />} />

            {/* 예약 상세 페이지 (임시 경로, 추후 1번 이미지 '보기' 버튼 클릭 시 구현 예정) */}
            <Route path="/reservation-detail/:id" element={<DetailPage />} />

            {/* 2번 이미지 '전체 일정 보기' 버튼 클릭 시 이동할 페이지
               -> 현재는 HomePage를 다시 띄우도록 설정했지만,
                  필요하면 별도의 주간 일정 페이지를 만들어 연결해도 좋습니다.
            */}
            <Route path="/full-schedule" element={<HomePage />} />

            {/* 나중에 필요한 다른 라우트들을 여기에 추가할 수 있어요 */}
        </Routes>
    );
}

export default App;
