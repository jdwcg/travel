import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

// 임시 데이터 (HomePage와 동일하게 설정하여 id로 찾아볼 수 있게 함)
const travelDates = [
    {
        id: 'day1',
        day: '수',
        date: 1,
        content: '휴가 시작! 여정의 설렘을 안고 떠나요!',
    },
    {
        id: 'day2',
        day: '목',
        date: 2,
        content: '새벽 비행기 탑승 및 제주 도착, 렌터카 수령 후 서귀포 이동',
    },
    {
        id: 'day3',
        day: '금',
        date: 3,
        content: '카멜리아힐 방문, 동백꽃 구경 및 사진 촬영. 점심은 전복 요리!',
    },
    {
        id: 'day4',
        day: '토',
        date: 4,
        content:
            '우도 배편 예약 및 관광, 땅콩 아이스크림 맛보기, 캠핑장 체크인',
    },
    {
        id: 'day5',
        day: '일',
        date: 5,
        content:
            '아침 일찍 캠핑장 주변 산책, 성산일출봉 등반 및 해안도로 드라이브',
    },
    {
        id: 'day6',
        day: '월',
        date: 6,
        content:
            '제주 시내 자유시간, 동문시장 구경 및 기념품 구매, 흑돼지 저녁 식사',
    },
    {
        id: 'day7',
        day: '화',
        date: 7,
        content:
            '협재 해변 방문, 에메랄드 빛 바다 감상. 근처 카페에서 휴식 즐기기',
    },
    {
        id: 'day8',
        day: 8,
        content:
            '서귀포 매일올레시장 방문, 신선한 해산물 구경. 올레길 일부 구간 산책',
    },
    {
        id: 'day9',
        day: 9,
        content: '오전에 여유롭게 브런치, 오후 비행기로 집으로 귀환',
    },
    { id: 'day10', day: 10, content: '남은 휴가 정리 및 여행 추억 되새기기' },
];

function DetailPage() {
    const { id } = useParams<{ id: string }>(); // URL에서 id 파라미터 가져오기
    const selectedItem = travelDates.find((item) => item.id === id); // id로 데이터 찾기

    if (!selectedItem) {
        return (
            <Container>
                <PageHeader title="일정 상세" />
                <ContentSection>
                    <p>해당 일정을 찾을 수 없습니다. ㅠㅠ</p>
                    <BackButton to="/">홈으로 돌아가기</BackButton>
                </ContentSection>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader title="일정 상세" />
            <ContentSection>
                <DetailTitle>
                    {selectedItem.date}일차 ({selectedItem.day}) -{' '}
                    {selectedItem.content}
                </DetailTitle>
                <DetailContent>
                    선택된 일정의 더 상세한 내용을 여기에 표시합니다!
                    <br />
                    (예: 방문 장소, 시간, 준비물 등)
                </DetailContent>
                <BackButton to="/">홈으로 돌아가기</BackButton>
            </ContentSection>
        </Container>
    );
}

const Container = styled.div`
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
`;

const ContentSection = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    margin: 16px;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    text-align: center;
`;

const DetailTitle = styled.h2`
    color: ${({ theme }) => theme.colors.primaryDark};
    font-size: ${({ theme }) => theme.fontSizes.large};
    margin-bottom: 15px;
`;

// src/pages/DetailPage.tsx
// ... (이전 코드 동일)

const DetailContent = styled.p`
    color: ${({ theme }) => theme.colors.textBody};
    font-size: ${({ theme }) => theme.fontSizes.medium};
    line-height: 1.6;
    margin-bottom: 30px;
`; // <<< 여기에 백틱 하나만 추가하면 됩니다!

const BackButton = styled(Link)`
    display: inline-block;
    padding: 10px 20px;
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.background};
    border-radius: 5px;
    text-decoration: none;
    font-weight: 600;
    transition: background-color 0.2s ease-in-out;

    &:hover {
        background-color: ${({ theme }) => theme.colors.secondaryDark};
    }
`;

export default DetailPage;
