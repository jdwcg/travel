// src/pages/DetailPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Container } from '../components/CommonLayout';

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    return (
        <Container>
            <PageHeader title="상세 보기" />
            <p>아이템 ID: {id}</p>
            <p>여기에 상세 내용 표시하세요.</p>
            <Link to="/schedule">목록으로 돌아가기</Link>
        </Container>
    );
}
