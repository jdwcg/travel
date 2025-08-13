// src/pages/HomePage.tsx
import { Navigate } from 'react-router-dom';

export default function HomePage() {
    // 루트에서 바로 /schedule로 이동하게 처리합니다.
    return <Navigate to="/schedule" replace />;
}
