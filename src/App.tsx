// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SchedulePage from './pages/SchedulePage';
import ReservationPage from './pages/ReservationPage';
import DetailPage from './pages/DetailPage';

export default function AppRoutes() {
    return (
        <Routes>
            {/* 루트는 HomePage가 받아 재빨리 /schedule로 리다이렉트합니다 */}
            <Route path="/" element={<HomePage />} />

            {/* 탭 분리된 페이지 */}
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/reservation" element={<ReservationPage />} />

            {/* 기존에 주신 라우트들 (요청 기준으로 그대로 포함) */}
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/reservation-detail/:id" element={<DetailPage />} />
            <Route path="/full-schedule" element={<HomePage />} />

            {/* 찾을 수 없는 경로는 일정 페이지로 보내기 */}
            <Route path="*" element={<Navigate to="/schedule" replace />} />
        </Routes>
    );
}
