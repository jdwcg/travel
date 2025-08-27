// ReservationCreatePage.tsx
import { useNavigate } from 'react-router-dom';
import ReservationForm from '../components/ReservationForm';
import type { ReservationItemType } from '../types/ReservationTypes';
import axiosClient from '../api/axiosClient';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import { Container, PageWrap } from '../components/CommonLayout';
import styled from 'styled-components';
const Spacer = styled.div`
    margin-top: 80px;
`;
export default function ReservationCreatePage() {
    const navigate = useNavigate();

    const handleSubmit = async (data: ReservationItemType) => {
        const password = prompt('관리자 비밀번호를 입력해주세요:');
        if (password !== '6948') {
            alert('비밀번호가 일치하지 않습니다!');
            return; // 비밀번호가 다르면 함수를 여기서 종료합니다.
        }
        try {
            // ✨ axios.post 대신 axiosClient.post 사용!
            // 그리고 백엔드 authenticateAdmin 미들웨어에 'x-admin-password' 헤더 필요 시 추가!
            await axiosClient.post(
                '/api/reservations', // ✨ `http://localhost:5000` 부분 제거!
                data,
                // ✨ 백엔드의 예약 생성 라우트(`app.post('/api/reservations', ...`)에
                //    `authenticateAdmin` 미들웨어가 있다면 이 헤더를 추가해야 합니다.
                //    현재 app.js에는 예약 생성에 authenticateAdmin이 없습니다.
                //    만약 나중에 필요하다면 이 주석을 풀고 사용하세요!
                // { headers: { 'x-admin-password': password } }
            );
            alert('예약 등록 완료!');
            navigate('/reservation'); // 등록 후 목록 페이지 이동
        } catch (err: any) {
            // 에러 타입은 `any`보다는 `AxiosError`가 더 정확할 수 있어요.
            console.error('예약 등록 실패:', err.response || err);
            alert(
                `예약 등록 실패! ${err.response?.data?.message || err.message}`,
            );
        }
    };

    return (
        <Container>
            <PageHeader title="예약 등록" />
            <Tabs />
            <PageWrap>
                <Spacer></Spacer>
                <ReservationForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/reservation')}
                />
            </PageWrap>
        </Container>
    );
}
