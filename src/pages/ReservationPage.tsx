// src/pages/ReservationPage.tsx
import React from 'react';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    ReservationSection,
    ReservationItem,
} from '../components/CommonLayout';
import { Link } from 'react-router-dom';

export default function ReservationPage() {
    return (
        <Container>
            <PageHeader title="10월 제주도 가족 여행" />
            <Tabs />

            <ReservationSection>
                <p>예약확인 탭 내용입니다. (추후 구현 예정)</p>
                <Link to="/reservation-detail/example-id">
                    <ReservationItem>배표 예약 (보기)</ReservationItem>
                </Link>
                <Link to="/reservation-detail/example-id-2">
                    <ReservationItem>캠핑장 예약 (보기)</ReservationItem>
                </Link>
            </ReservationSection>
        </Container>
    );
}
