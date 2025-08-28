import { useNavigate } from 'react-router-dom';
import TravelForm from '../components/TravelForm';
import ReservationForm from '../components/ReservationForm';
import { Container } from '../components/CommonLayout';

interface ItemAddPageProps {
    itemType: 'travel' | 'reservation';
}

export default function ItemAddPage({ itemType }: ItemAddPageProps) {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(itemType === 'travel' ? '/schedule' : '/reservation');
    };

    return (
        <Container>
            <h2>{itemType === 'travel' ? '여행 일정 추가' : '예약 추가'}</h2>
            {itemType === 'travel' ? (
                <TravelForm onCancel={goBack} onSuccess={goBack} />
            ) : (
                <ReservationForm
                    onCancel={goBack}
                    onSuccess={goBack}
                    onSubmit={(data) => console.log('예약 제출', data)}
                />
            )}
        </Container>
    );
}
