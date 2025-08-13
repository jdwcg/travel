import { Routes, Route } from 'react-router-dom';

// 필요한 페이지 컴포넌트들을 임포트
import HomePage from './pages/HomePage'; // 업데이트된 HomePage
import DetailPage from './pages/DetailPage'; // 새로 만든 DetailPage

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/reservation-detail/:id" element={<DetailPage />} />
            <Route path="/full-schedule" element={<HomePage />} />
        </Routes>
    );
}

export default App;
