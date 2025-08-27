import { useLayoutEffect, useRef } from 'react';
import {
    Routes,
    Route,
    Navigate,
    useLocation,
    useNavigationType,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import CalendarPage from './pages/CalendarPage';
import SchedulePage from './pages/SchedulePage';
import ReservationPage from './pages/ReservationPage';
import ItemDetailPage from './pages/DetailPage';
import ReservationDetailPage from './pages/ReservationDetailPage';
import ReservationCreatePage from './pages/ReservationCreatePage';
/**
 * ScrollManager
 * - location.key (또는 pathname)을 키로 스크롤 위치를 저장/복원함
 * - PUSH/REPLACE: 새 페이지로 이동하면 scrollTop을 0으로
 * - POP (뒤로/앞으로): 저장된 위치가 있으면 복원
 */
function ScrollManager() {
    const location = useLocation();
    const navType = useNavigationType(); // 'PUSH' | 'POP' | 'REPLACE'
    const positions = useRef<Map<string, number>>(new Map());

    // 컴포넌트 언마운트(또는 location 변경 직전)에 현재 스크롤 위치 저장
    // useLayoutEffect의 cleanup은 다음 렌더 사이클 직전에 실행되므로 안전하게 저장 가능
    useLayoutEffect(() => {
        return () => {
            const key = location.key ?? location.pathname;
            positions.current.set(key, window.scrollY);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    // 마운트/location 변경 시 복원 로직
    useLayoutEffect(() => {
        const key = location.key ?? location.pathname;
        const saved = positions.current.get(key);

        if (navType === 'POP' && saved != null) {
            // 뒤로/앞으로 복원 시 saved 값으로 복원
            window.scrollTo(0, saved);
        } else {
            // 새 네비게이션인 경우 상단으로 이동
            window.scrollTo({ top: 0, left: 0 });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location, navType]);

    return null;
}

export default function AppRoutes() {
    const location = useLocation();
    return (
        <>
            <ScrollManager />

            <Routes>
                {/* 루트는 HomePage가 받아 재빨리 /schedule로 리다이렉트합니다 */}
                <Route path="/" element={<HomePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                {/* 탭 분리된 페이지 */}
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/reservation" element={<ReservationPage />} />
                <Route
                    path="/reservation/create"
                    element={<ReservationCreatePage />}
                />
                {/* 기존에 주신 라우트들 (요청 기준으로 그대로 포함) */}
                <Route
                    path="/detail/travel/:id"
                    element={<ItemDetailPage key={location.key} />}
                />
                {/* 2. 예약 상세 (ReservationDetailPage가 담당) */}
                {/* 이 경로가 바로 ReservationDetailPage로 가도록 해야 해요! */}
                <Route
                    path="/detail/reservation/:id"
                    element={<ReservationDetailPage key={location.key} />} // 👈 여기에 ReservationDetailPage!!!
                />
                <Route
                    path="/reservation-detail/:id"
                    element={<ItemDetailPage key={location.key} />}
                />{' '}
                // 이전 라우트 (삭제하거나 redirect 처리)
                <Route
                    path="/travel-detail/:id"
                    element={<ItemDetailPage key={location.key} />}
                />{' '}
                // 이전 라우트 (삭제하거나 redirect 처리)
                <Route path="/full-schedule" element={<HomePage />} />
                {/* 찾을 수 없는 경로는 일정 페이지로 보내기 */}
                <Route path="*" element={<Navigate to="/schedule" replace />} />
            </Routes>
        </>
    );
}
