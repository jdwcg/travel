import { useNavigate } from 'react-router-dom';
import TravelForm from '../components/TravelForm';
import ReservationForm from '../components/ReservationForm';
import { Container } from '../components/CommonLayout';

interface ItemAddPageProps {
    itemType: 'travel' | 'reservation';
}

export default function ItemAddPage({ itemType }: ItemAddPageProps) {
    const navigate = useNavigate();

    return (
        <Container>
            <h2>{itemType === 'travel' ? '여행 일정 추가' : '예약 추가'}</h2>
            {itemType === 'travel' ? (
                <TravelForm
                    onCancel={() =>
                        navigate(
                            itemType === 'travel'
                                ? '/schedule'
                                : '/reservation',
                        )
                    }
                    onSuccess={() =>
                        navigate(
                            itemType === 'travel'
                                ? '/schedule'
                                : '/reservation',
                        )
                    }
                />
            ) : (
                <ReservationForm
                    onCancel={() =>
                        navigate(
                            itemType === 'travel'
                                ? '/schedule'
                                : '/reservation',
                        )
                    }
                    onSuccess={() =>
                        navigate(
                            itemType === 'travel'
                                ? '/schedule'
                                : '/reservation',
                        )
                    }
                />
            )}
        </Container>
    );
}
