import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import type { ReservationItemType } from '../types/ReservationTypes';
import axios from 'axios';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import { Container, PageWrap } from '../components/CommonLayout';
import styled from 'styled-components';

export default function ReservationDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [reservation, setReservation] = useState<ReservationItemType | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReservation = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get<ReservationItemType[]>(
                    `http://localhost:5000/api/reservations`,
                );
                const item = res.data.find((r) => r.id === id);
                if (!item) throw new Error('존재하지 않는 예약입니다.');
                setReservation(item);
            } catch (err) {
                console.error(err);
                setError('예약 정보를 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [id]);

    if (loading)
        return (
            <Container>
                <PageHeader title="예약 상세" />
                <Tabs />
                <PageWrap>Loading...</PageWrap>
            </Container>
        );
    if (error)
        return (
            <Container>
                <PageHeader title="예약 상세" />
                <Tabs />
                <PageWrap style={{ color: 'red' }}>{error}</PageWrap>
            </Container>
        );
    if (!reservation) return null;

    return (
        <Container>
            <PageHeader title={reservation.title} />
            <Tabs />
            <PageWrap>
                <button onClick={() => navigate('/reservation')}>닫기</button>

                {reservation.contentType === 'text' && (
                    <p>{reservation.content}</p>
                )}

                {reservation.contentType === 'table' &&
                    reservation.contentData && (
                        <Table>
                            <thead>
                                <tr>
                                    {reservation.contentData.headers?.map(
                                        (h, i) => (
                                            <th key={i}>{h}</th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {reservation.contentData.rows?.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
            </PageWrap>
        </Container>
    );
}

const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    margin-top: 16px;
    th,
    td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
    }
`;
