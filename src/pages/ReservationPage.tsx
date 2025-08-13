// src/pages/ReservationPage.tsx
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    ReservationSection,
    ReservationItem,
} from '../components/CommonLayout';
import { Link, useLocation } from 'react-router-dom';
import { reservations } from '../data/reservations'; // 실제 데이터 경로 확인

export default function ReservationPage() {
    const location = useLocation(); // 출처 전달(선택)

    return (
        <Container>
            <PageHeader title="10월 제주도 가족 여행" />
            <Tabs />

            <ReservationSection>
                {/* <p>예약확인 탭 내용입니다.</p> */}
                {reservations.map((r) => (
                    <Link
                        key={r.id}
                        to={`/reservation-detail/${r.id}`}
                        // state로 출처 전달하면 상세에서 정확히 복귀 가능
                        state={{ from: location.pathname }}
                        aria-label={`${r.title} 상세보기`}
                    >
                        <ReservationItem>{r.title} </ReservationItem>
                    </Link>
                ))}
            </ReservationSection>
        </Container>
    );
}
