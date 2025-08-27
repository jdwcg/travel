import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useLocation은 이 시점에선 필요 없어서 제거했어요!
import ReservationForm from '../components/ReservationForm'; // ReservationForm을 임포트합니다.
import type { ReservationItemType } from '../types/ReservationTypes';
import axios from 'axios';
// import PageHeader from '../components/PageHeader';
// import Tabs from '../components/Tabs';
import { Container, PageWrap, BaseBtnWrap } from '../components/CommonLayout';
import styled from 'styled-components';

export default function ReservationDetailPage() {
    const { id } = useParams<{ id: string }>(); // id 타입을 string으로 명확히!
    const navigate = useNavigate();

    const [reservation, setReservation] = useState<ReservationItemType | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false); // ✨ 수정 모드 상태 추가!

    useEffect(() => {
        const fetchReservation = async () => {
            if (!id) {
                // ID가 없으면 오류 처리
                setError('예약 ID가 없습니다.');
                setLoading(false); // 로딩 끝내고
                return;
            }
            setLoading(true);
            setError(null); // 에러 초기화

            try {
                // ✨ API에서 전체를 불러와 찾는 대신, 해당 ID의 예약만 직접 불러옵니다. (훨씬 효율적!)
                const res = await axios.get<ReservationItemType>(
                    `http://localhost:5000/api/reservations/${id}`,
                );
                setReservation(res.data);
            } catch (err: any) {
                // Axios 에러는 err.response 로 자세한 정보를 얻을 수 있어요.
                console.error(
                    '예약 정보를 불러오는데 실패했습니다:',
                    err.response || err,
                );
                setError(
                    err.response?.data?.message ||
                        '예약 정보를 불러오는데 실패했습니다.',
                );
            } finally {
                setLoading(false);
            }
        };
        fetchReservation();
    }, [id]); // id가 변경될 때마다 데이터를 다시 불러옵니다.

    // ✨ 예약 수정 처리 함수 추가!
    const handleUpdateSubmit = async (updatedData: ReservationItemType) => {
        const password = prompt('관리자 비밀번호를 입력해주세요:');
        if (password !== '6948') {
            alert('비밀번호가 일치하지 않습니다!');
            return;
        }

        try {
            // PUT 요청으로 예약 정보 업데이트
            // 백엔드 app.js의 PUT 라우트에 x-admin-password 헤더가 필요해요!
            await axios.put(
                `http://localhost:5000/api/reservations/${id}`,
                updatedData,
                { headers: { 'x-admin-password': password } },
            );
            alert('예약이 성공적으로 수정되었습니다!');
            setReservation(updatedData); // 화면의 데이터도 즉시 업데이트
            setEditing(false); // 수정 모드 종료
        } catch (err: any) {
            console.error('예약 수정 실패:', err.response || err);
            alert(
                `예약 수정 실패! ${err.response?.data?.message || err.message}`,
            );
        }
    };

    // ✨ 예약 삭제 처리 함수 추가! (기존의 TravelDetailPage 로직에서 가져옴)
    const handleDelete = async () => {
        if (!window.confirm('정말 이 예약을 삭제하시겠습니까?')) return;

        const password = prompt('관리자 비밀번호를 입력해주세요:');
        if (password !== '6948') {
            alert('비밀번호가 일치하지 않습니다!');
            return;
        }

        try {
            await axios.delete(
                `http://localhost:5000/api/reservations/${id}`, // reservations 엔드포인트 사용!
                { headers: { 'x-admin-password': password } },
            );
            alert('예약이 성공적으로 삭제되었습니다!');
            navigate('/reservation'); // 삭제 후 예약 목록 페이지로 이동
        } catch (err: any) {
            console.error('예약 삭제 실패:', err.response || err);
            alert(
                `예약 삭제 실패! ${err.response?.data?.message || err.message}`,
            );
        }
    };

    // 로딩 및 에러 화면
    if (loading)
        return (
            <Container>
                {/* <PageHeader title="예약 상세" /> */}
                {/* <Tabs /> */}

                <PageWrap>데이터를 불러오는 중...</PageWrap>
            </Container>
        );
    if (error)
        return (
            <Container>
                {/* <PageHeader title="예약 상세" /> */}
                {/* <Tabs /> */}
                <PageWrap style={{ color: 'red' }}>{error}</PageWrap>
            </Container>
        );
    if (!reservation) return null; // 데이터가 없으면 아무것도 렌더링하지 않음

    return (
        <Container>
            {/* <Tabs /> */}
            {/* <PageHeader title={reservation.title} /> */}
            <PageWrap>
                {!editing ? ( // 수정 모드가 아닐 때 (기존 상세 보기 화면)
                    <>
                        {/* ✨ 여기에 제목을 한번 더 넣어줄 수 있어요! ✨ */}
                        {/* <h1> 또는 <h2>, <h3> 등 원하시는 크기로 넣어주세요! */}
                        <PageTitle>{reservation.title}</PageTitle>{' '}
                        {/* 스타일드 컴포넌트 추가 */}
                        {/* 혹은 그냥 <h3>{reservation.title}</h3> 이렇게 넣어주셔도 돼요! */}
                        <ButtonsWrap>
                            <BaseBtnWrap>
                                <button onClick={() => setEditing(true)}>
                                    수정
                                </button>
                            </BaseBtnWrap>
                            <BaseBtnWrap>
                                <button onClick={handleDelete}>삭제</button>
                            </BaseBtnWrap>
                            <BaseBtnWrap>
                                <button
                                    onClick={() => navigate('/reservation')}
                                >
                                    닫기
                                </button>
                            </BaseBtnWrap>
                        </ButtonsWrap>
                        {/* 예약 내용 표시 */}
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
                                        {reservation.contentData.rows?.map(
                                            (row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ),
                                        )}
                                    </tbody>
                                </Table>
                            )}
                    </>
                ) : (
                    // ✨ 수정 모드일 때 (ReservationForm 표시)
                    <ReservationForm
                        reservation={reservation} // 기존 예약 데이터를 폼에 전달
                        onSubmit={handleUpdateSubmit} // 수정 완료 버튼 클릭 시 호출
                        onCancel={() => setEditing(false)} // 취소 버튼 클릭 시 수정 모드 종료
                    />
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
const PageTitle = styled.h2`
    margin-top: 0; // 필요에 따라 여백 조정
    margin-bottom: 20px;
    font-size: 16px; // 글자 크기 조정
    color: #333; // 색상 조정
    text-align: center; // 중앙 정렬 등
`;
const ButtonsWrap = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 20px; /* 버튼과 내용 사이에 간격 추가 */
`;
