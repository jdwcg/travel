// src/pages/ReservationPage.tsx

import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    ReservationSection,
    ReservationItem,
    PageWrap,
} from '../components/CommonLayout';
import { Link, useLocation } from 'react-router-dom';
// import { reservations } from '../data/reservations'; // ❌ 이 줄은 이제 필요 없어요! 주석 처리하거나 삭제!

import { useEffect, useState } from 'react'; // 💡 useEffect와 useState 추가!
import axios from 'axios'; // 💡 axios 추가!

// 💡 ReservationItem 타입 정의 (백엔드에서 오는 데이터 구조와 맞춰야 해요!)
// 만약 models/Reservation.js 에 정의한 스키마와 동일하다면 그대로 사용!
interface ReservationItemType {
    id: string;
    date: string;
    title: string;
    contentType?: 'text' | 'html' | 'table';
    content?: string; // content가 항상 없을 수도 있어서 ? 붙여요
    contentData?: {
        // contentData도 항상 없을 수도 있어서 ? 붙여요
        headers?: string[];
        rows?: string[][];
    };
    _id?: string; // MongoDB에서 자동 생성되는 _id도 타입에 추가해주면 좋아요!
    __v?: number; // Mongoose에서 자동 생성하는 버전 키
}

export default function ReservationPage() {
    const location = useLocation(); // 출처 전달(선택)

    // 💡 백엔드에서 가져온 예약 데이터를 저장할 state
    const [reservations, setReservations] = useState<ReservationItemType[]>([]);
    // 💡 데이터 로딩 중인지 여부를 알려줄 state
    const [loading, setLoading] = useState(true);
    // 💡 에러 발생 시 에러 메시지를 저장할 state
    const [error, setError] = useState<string | null>(null);

    // 💡 컴포넌트가 처음 마운트될 때 (로딩될 때) 데이터를 가져오기 위한 useEffect
    useEffect(() => {
        // 데이터를 비동기로 가져오는 함수 정의
        const fetchReservations = async () => {
            try {
                // 데이터를 가져오기 시작했으니 로딩 상태를 true로
                setLoading(true);
                setError(null); // 혹시 이전 에러가 있다면 초기화

                // 백엔드 API로부터 데이터 가져오기!
                const response = await axios.get<ReservationItemType[]>(
                    'http://localhost:5000/api/reservations',
                );

                // 가져온 데이터를 state에 저장
                setReservations(response.data);
            } catch (err) {
                // 에러 발생 시 에러 메시지 설정
                console.error('예약 데이터를 불러오는 데 실패했습니다:', err);
                setError(
                    '예약 데이터를 불러오는 데 실패했습니다. 서버를 확인해주세요.',
                );
            } finally {
                // 데이터 로딩이 끝났으니 로딩 상태를 false로
                setLoading(false);
            }
        };

        fetchReservations(); // 함수 호출하여 데이터 가져오기 시작
    }, []); // 💡 빈 배열은 컴포넌트가 처음 렌더링될 때만 이펙트가 실행됨을 의미!

    // 💡 로딩 중일 때 보여줄 UI
    if (loading) {
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p>예약 데이터를 불러오는 중...</p>
                </PageWrap>
            </Container>
        );
    }

    // 💡 에러 발생 시 보여줄 UI
    if (error) {
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p style={{ color: 'red' }}>{error}</p>
                    <p>서버가 실행 중인지 확인해주세요!</p>
                </PageWrap>
            </Container>
        );
    }

    // 💡 데이터가 없거나 로딩, 에러가 아닐 때 보여줄 UI
    if (reservations.length === 0) {
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p>아직 예약 데이터가 없습니다.</p>
                </PageWrap>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader title="10월 제주 여행" />

            <Tabs />
            <PageWrap>
                <ReservationSection>
                    {/* 기존 map 함수는 그대로 사용! */}
                    {reservations.map((r) => (
                        <Link
                            key={r._id || r.id}
                            to={`/detail/reservation/${r.id}`}
                            state={{ from: location.pathname }}
                            aria-label={`${r.title} 상세보기`}
                        >
                            <ReservationItem>{r.title} </ReservationItem>
                        </Link>
                    ))}
                </ReservationSection>
            </PageWrap>
        </Container>
    );
}
