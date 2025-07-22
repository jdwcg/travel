// src/pages/HomePage.tsx
import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ActivityIcon from '../components/ActivityIcon';

interface TravelDateItem {
    id: string;
    day: string;
    date: number;
    content: string;
    type: string;
}

const travelDates: TravelDateItem[] = [
    {
        id: 'day1',
        day: '수',
        date: 1,
        content: '휴가 시작! 여정의 설렘을 안고 떠나요!',
        type: 'plane',
    },
    {
        id: 'day2',
        day: '목',
        date: 2,
        content: '새벽 비행기 탑승 및 제주 도착, 렌터카 수령 후 서귀포 이동',
        type: 'car',
    },
    {
        id: 'day3',
        day: '금',
        date: 3,
        content: '카멜리아힐 방문, 동백꽃 구경 및 사진 촬영. 점심은 전복 요리!',
        type: 'flower',
    },
    {
        id: 'day4',
        day: '토',
        date: 4,
        content:
            '우도 배편 예약 및 관광, 땅콩 아이스크림 맛보기, 캠핑장 체크인',
        type: 'camping',
    },
    {
        id: 'day5',
        day: '일',
        date: 5,
        content:
            '아침 일찍 캠핑장 주변 산책, 성산일출봉 등반 및 해안도로 드라이브',
        type: 'camping',
    },
    {
        id: 'day6',
        day: '월',
        date: 6,
        content:
            '제주 시내 자유시간, 동문시장 구경 및 기념품 구매, 흑돼지 저녁 식사',
        type: 'city',
    },
    {
        id: 'day7',
        day: '화',
        date: 7,
        content:
            '협재 해변 방문, 에메랄드 빛 바다 감상. 근처 카페에서 휴식 즐기기',
        type: 'beach',
    },
    {
        id: 'day8',
        day: '수',
        date: 8,
        content:
            '서귀포 매일올레시장 방문, 신선한 해산물 구경. 올레길 일부 구간 산책',
        type: 'market',
    },
    {
        id: 'day9',
        day: '목',
        date: 9,
        content: '오전에 여유롭게 브런치, 오후 비행기로 집으로 귀환',
        type: 'plane',
    },
    {
        id: 'day10',
        day: '금',
        date: 10,
        content: '남은 휴가 정리 및 여행 추억 되새기기',
        type: 'home',
    },
];

// Grid 컬럼 정의 (재사용을 위해 상수화)
// 15% (요일), 15% (일자), 70% (내용)
const GRID_COLUMNS = '15% 15% 70%';

function HomePage() {
    const [activeTab, setActiveTab] = useState<'schedule' | 'reservation'>(
        'schedule',
    );

    return (
        <Container>
            <PageHeader title="10월 제주도 가족 여행" />

            <TabMenu>
                <TabButton
                    isActive={activeTab === 'schedule'}
                    onClick={() => setActiveTab('schedule')}
                >
                    일정
                </TabButton>
                <TabButton
                    isActive={activeTab === 'reservation'}
                    onClick={() => setActiveTab('reservation')}
                >
                    예약확인
                </TabButton>
            </TabMenu>

            {activeTab === 'schedule' ? (
                <ScheduleSection>
                    <ListContainer>
                        {' '}
                        {/* Grid 레이아웃의 최상위 컨테이너 */}
                        <ListHeader>
                            {' '}
                            {/* 헤더 로우 */}
                            <ThItem>요일</ThItem>
                            <ThItem>일자</ThItem>
                            <ThContentItem>내용</ThContentItem>
                        </ListHeader>
                        <ListBody>
                            {' '}
                            {/* 실제 데이터 로우 컨테이너 (스크롤 가능성 고려) */}
                            {travelDates.map((item) => (
                                <StyledLink
                                    to={`/detail/${item.id}`}
                                    key={item.id}
                                    date={item.date}
                                >
                                    <TdItem>{item.day}</TdItem>
                                    <TdDateItem
                                        isWeekend={
                                            item.day === '토' ||
                                            item.day === '일'
                                        }
                                    >
                                        {item.date}
                                    </TdDateItem>
                                    <TdContentItem title={item.content}>
                                        <ActivityIcon type={item.type} />
                                        {item.content.length > 30
                                            ? item.content.slice(0, 30) + '...'
                                            : item.content}
                                    </TdContentItem>
                                </StyledLink>
                            ))}
                        </ListBody>
                    </ListContainer>
                </ScheduleSection>
            ) : (
                <ReservationSection>
                    <p>예약확인 탭 내용입니다. (추후 구현 예정)</p>
                    <Link to="/reservation-detail/example-id">
                        <ReservationItem>
                            <span>배표 예약 (보기)</span>
                        </ReservationItem>
                    </Link>
                    <Link to="/reservation-detail/example-id-2">
                        <ReservationItem>
                            <span>캠핑장 예약 (보기)</span>
                        </ReservationItem>
                    </Link>
                </ReservationSection>
            )}
        </Container>
    );
}

// === 스타일 컴포넌트 정의 ===

const getDateRangeBackgroundColor = (date: number, theme: any) => {
    if (date >= 2 && date <= 8) {
        return theme.colors.dateRangeColor1 || '#F0F8FF';
    } else if (date === 9) {
        return theme.colors.dateRangeColor2 || '#FFFBE6';
    }
    return theme.colors.white;
};

const Container = styled.div`
    max-width: 480px;
    margin: 0 auto;
    padding: 0;
    font-family: 'Pretendard', sans-serif;
    min-height: 100vh;
    background-color: ${({ theme }) => theme.colors.background};
`;

const TabMenu = styled.div`
    display: flex;
    background-color: ${({ theme }) => theme.colors.lightGray};
    padding: 0;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0 0 8px 8px;
    overflow: hidden;
`;

const TabButton = styled.button<{ isActive: boolean }>`
    flex: 1;
    background-color: ${({ theme, isActive }) =>
        isActive ? theme.colors.tabActiveBg : theme.colors.tabInactiveBg};
    color: ${({ theme, isActive }) =>
        isActive ? theme.colors.tabActiveText : theme.colors.tabInactiveText};
    border: none;
    padding: 12px 0;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border-bottom: 3px solid
        ${({ theme, isActive }) =>
            isActive ? theme.colors.secondary : 'transparent'};

    &:hover {
        background-color: ${({ theme, isActive }) =>
            isActive ? theme.colors.tabActiveBg : theme.colors.lightGray};
        color: ${({ theme, isActive }) =>
            isActive
                ? theme.colors.tabActiveText
                : theme.colors.tabInactiveText};
    }
`;

const ScheduleSection = styled.div`
    /* 배경색, 그림자, 테두리 등은 ListContainer가 담당 */
    margin: 16px; /* 컨테이너 외부 여백 */
`;

const ReservationSection = styled(ScheduleSection)`
    background-color: ${({ theme }) =>
        theme.colors.white}; /* 배경색 다시 추가 */
    border-radius: 8px; /* 둥근 모서리 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 그림자 */
    border: 1px solid ${({ theme }) => theme.colors.lightGray}; /* 테두리 */
    padding: 20px;
    text-align: center;
    & > p {
        color: ${({ theme }) => theme.colors.textBody};
        margin-bottom: 20px;
    }
`;

const ReservationItem = styled.div`
    background-color: ${({ theme }) => theme.colors.lightGray};
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 10px;
    cursor: pointer;
    text-align: left;
    color: ${({ theme }) => theme.colors.primaryDark};
    &:hover {
        background-color: ${({ theme }) => theme.colors.borderGray};
    }
`;

// ✨ Grid 레이아웃을 위한 새로운 컨테이너들 ✨
const ListContainer = styled.div`
    display: flex; /* 헤더와 바디를 세로로 정렬 */
    flex-direction: column;
    background-color: ${({ theme }) =>
        theme.colors.white}; /* 리스트 전체 배경색 */
    border-radius: 8px;
    overflow: hidden; /* 내부 요소가 넘치지 않도록 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const ListHeader = styled.div`
    display: grid; /* 헤더 아이템들을 그리드로 정렬 */
    grid-template-columns: ${GRID_COLUMNS}; /* 공통 컬럼 정의 사용 */
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 700;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primaryDark};
`;

const ListBody = styled.div`
    /* overflow-y: auto; /* 스크롤이 필요하면 여기에 추가 */
    /* flex: 1; /* 부모가 flex container일 때 남은 공간 차지 */
`;

// 헤더 아이템의 공통 스타일 (요일, 일자, 내용)
const ThItem = styled.div`
    padding: 12px 8px;
    text-align: center;
    white-space: nowrap;
`;

const ThContentItem = styled(ThItem)`
    text-align: left; /* 내용은 좌측 정렬 */
`;

// StyledLink가 이제 Grid Row 역할
const StyledLink = styled(Link)<{ date: number }>`
    display: grid; /* 각 링크(리스트 항목)가 그리드 로우 */
    grid-template-columns: ${GRID_COLUMNS}; /* 공통 컬럼 정의 사용 */
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderGray};
    background-color: ${({ date, theme }) =>
        getDateRangeBackgroundColor(date, theme)};
    transition: background-color 0.2s ease-in-out;
    padding: 0 8px; /* Link 내부 아이템들의 좌우 패딩을 조절 */

    &:last-child {
        border-bottom: none;
    }
    &:hover {
        filter: brightness(0.95);
    }
`;

// Td는 div로 변경 (테이블 셀이 아닌 그리드 아이템 역할)
const TdItem = styled.div`
    padding: 10px 0; /* 좌우 패딩은 StyledLink에서 조절 */
    display: flex; /* 내부 요소(텍스트, 아이콘) 정렬 위해 flex 사용 */
    align-items: center; /* 세로 중앙 정렬 */
    justify-content: center; /* 기본은 가로 중앙 정렬 */
    font-size: 13px;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.textBody};
`;

// 일자 아이템
const TdDateItem = styled(TdItem)<{ isWeekend: boolean }>`
    font-weight: 600;
    color: ${({ isWeekend, theme }) =>
        isWeekend ? theme.colors.accentRed : theme.colors.textDark};
`;

// 내용 아이템
const TdContentItem = styled(TdItem)`
    justify-content: flex-start; /* 내용은 좌측 정렬 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* 아이콘이 포함되므로 이미 flex 처리되어 있음 */
`;

export default HomePage;
