import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    ReservationSection,
    ReservationItem,
    PageWrap,
} from '../components/CommonLayout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { ReservationItemType } from '../types/ReservationTypes';

export default function ReservationPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [reservations, setReservations] = useState<ReservationItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get<ReservationItemType[]>(
                    'http://localhost:5000/api/reservations',
                );
                setReservations(res.data);
            } catch (err) {
                console.error(err);
                setError('예약 데이터를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchReservations();
    }, []);

    if (loading)
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>Loading...</PageWrap>
            </Container>
        );
    if (error)
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap style={{ color: 'red' }}>{error}</PageWrap>
            </Container>
        );
    if (reservations.length === 0)
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>예약 데이터가 없습니다.</PageWrap>
            </Container>
        );

    return (
        <Container>
            <PageHeader title="10월 제주 여행" />
            <Tabs />
            <PageWrap>
                <button onClick={() => navigate('/reservation/create')}>
                    예약 등록
                </button>
                <ReservationSection>
                    {reservations.map((r) => (
                        <Link
                            key={r._id || r.id}
                            to={`/detail/reservation/${r.id}`}
                            state={{ from: location.pathname }}
                            aria-label={`${r.title} 상세보기`}
                        >
                            <ReservationItem>{r.title}</ReservationItem>
                        </Link>
                    ))}
                </ReservationSection>
            </PageWrap>
        </Container>
    );
}
