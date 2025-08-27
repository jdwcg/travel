import { useNavigate } from 'react-router-dom';
import ReservationForm from '../components/ReservationForm';
import type { ReservationItemType } from '../types/ReservationTypes';
import axios from 'axios';
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import { Container, PageWrap } from '../components/CommonLayout';

export default function ReservationCreatePage() {
    const navigate = useNavigate();

    const handleSubmit = async (data: ReservationItemType) => {
        try {
            await axios.post('http://localhost:5000/api/reservations', data);
            alert('예약 등록 완료!');
            navigate('/reservation'); // 등록 후 목록 페이지 이동
        } catch (err) {
            console.error(err);
            alert('예약 등록 실패!');
        }
    };

    return (
        <Container>
            <PageHeader title="예약 등록" />
            <Tabs />
            <PageWrap>
                <ReservationForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/reservation')}
                />
            </PageWrap>
        </Container>
    );
}
