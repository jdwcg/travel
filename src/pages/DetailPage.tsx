// src/pages/DetailPage.tsx
import React from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Container } from '../components/CommonLayout';

export default function DetailPage() {
    const location = useLocation();
    const params = useParams<{ id: string }>();

    // 현재 경로로 복귀할 탭 결정 (가장 간단한 로직)
    const pathname = location.pathname || '';
    const backTo = pathname.startsWith('/reservation-detail')
        ? '/reservation'
        : pathname.startsWith('/detail')
        ? '/schedule'
        : '/schedule'; // 안전한 기본값

    return (
        <Container>
            <PageHeader title="상세 보기" />
            <p>아이템 ID: {params.id}</p>

            {/* 단순한 링크: 해당 탭의 홈으로 이동 */}
            <p>
                <Link to={backTo} aria-label="목록으로 돌아가기">
                    목록으로 돌아가기
                </Link>
            </p>
        </Container>
    );
}
