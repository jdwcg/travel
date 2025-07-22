// src/pages/HomePage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ActivityIcon from '../components/ActivityIcon'; // 아이콘 컴포넌트 임포트

// travelDates 데이터에 type (활동 유형) 추가
const travelDates = [
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
        day: 7,
        content: '화',
        content:
            '협재 해변 방문, 에메랄드 빛 바다 감상. 근처 카페에서 휴식 즐기기',
        type: 'beach',
    },
    {
        id: 'day8',
        day: 8,
        content: '수',
        content:
            '서귀포 매일올레시장 방문, 신선한 해산물 구경. 올레길 일부 구간 산책',
        type: 'market',
    },
    {
        id: 'day9',
        day: 9,
        content: '목',
        content: '오전에 여유롭게 브런치, 오후 비행기로 집으로 귀환',
        type: 'plane',
    },
    {
        id: 'day10',
        day: 10,
        content: '남은 휴가 정리 및 여행 추억 되새기기',
        type: 'home',
    },
];

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
                    <ListTable>
                        <thead>
                            <tr>
                                <ThDay>요일</ThDay>
                                <ThDate>일자</ThDate>
                                <ThContent>내용</ThContent>
                            </tr>
                        </thead>
                        <tbody>
                            {travelDates.map((item) => (
                                <StyledLink
                                    to={`/detail/${item.id}`}
                                    key={item.id}
                                    date={item.date}
                                >
                                    {' '}
                                    {/* date prop 전달 */}
                                    <Tr>
                                        <TdDay>{item.day}</TdDay>
                                        <TdDate
                                            isWeekend={
                                                item.day === '토' ||
                                                item.day === '일'
                                            }
                                        >
                                            {item.date}
                                        </TdDate>
                                        <TdContent title={item.content}>
                                            <ActivityIcon type={item.type} />{' '}
                                            {/* 아이콘 추가 */}
                                            {item.content.length > 30
                                                ? item.content.slice(0, 30) +
                                                  '...'
                                                : item.content}
                                        </TdContent>
                                    </Tr>
                                </StyledLink>
                            ))}
                        </tbody>
                    </ListTable>
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

// 날짜 범위별 배경색을 결정하는 헬퍼 함수
const getDateRangeBackgroundColor = (date: number, theme: any) => {
    if (date >= 2 && date <= 8) {
        return theme.colors.dateRangeColor1 || '#F0F8FF'; // 2~8일차 (연한 하늘색)
    } else if (date === 9) {
        return theme.colors.dateRangeColor2 || '#FFFBE6'; // 9일차 (연한 노란색)
    }
    return theme.colors.white; // 그 외 (기본 흰색)
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
    justify-content: space-around;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.primary};
    padding: 10px 0;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 0 0 8px 8px;
`;

const TabButton = styled.button<{ isActive: boolean }>`
    flex: 1;
    background: none;
    border: none;
    padding: 12px 0;
    font-size: ${({ theme }) => theme.fontSizes.medium};
    font-weight: 600;
    cursor: pointer;
    color: ${({ theme, isActive }) =>
        isActive ? theme.colors.background : theme.colors.primaryDark};
    border-bottom: 3px solid
        ${({ theme, isActive }) =>
            isActive ? theme.colors.secondary : 'transparent'};
    transition: all 0.2s ease-in-out;

    &:hover {
        color: ${({ theme, isActive }) =>
            isActive ? theme.colors.background : theme.colors.primaryLight};
    }
`;

const ScheduleSection = styled.div`
    background-color: ${({ theme }) => theme.colors.white};
    margin: 16px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

const ReservationSection = styled(ScheduleSection)`
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

const ListTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
`;

const Th = styled.th`
    padding: 12px 8px;
    text-align: center;
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 700;
    border-bottom: 1px solid ${({ theme }) => theme.colors.primaryDark};
    white-space: nowrap;
`;

const ThDay = styled(Th)`
    width: 18%;
`;
const ThDate = styled(Th)`
    width: 18%;
`;
const ThContent = styled(Th)`
    width: 64%;
    text-align: left;
`;

// date prop을 받도록 타입 정의
const StyledLink = styled(Link)<{ date: number }>`
    display: table-row;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderGray};
    background-color: ${({ date, theme }) =>
        getDateRangeBackgroundColor(date, theme)}; /* 날짜별 배경색 동적 적용 */
    transition: background-color 0.2s ease-in-out;

    &:last-child {
        border-bottom: none;
    }
    &:hover {
        filter: brightness(0.95);
    }
`;

const Tr = styled.div`
    display: table-row;
`;

const Td = styled.td`
    padding: 10px 8px;
    vertical-align: middle;
    font-size: 13px;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.textBody};
`;

const TdDay = styled(Td)`
    text-align: center;
    font-weight: 500;
`;

const TdDate = styled(Td)<{ isWeekend: boolean }>`
    text-align: center;
    font-weight: 600;
    color: ${({ isWeekend, theme }) =>
        isWeekend ? theme.colors.accentRed : theme.colors.textDark};
    background-color: ${({ isWeekend, theme }) =>
        isWeekend ? theme.colors.weekendBackground : 'transparent'};
`;

const TdContent = styled(Td)`
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex; /* 아이콘과 텍스트를 인라인으로 정렬하기 위해 flex 사용 */
    align-items: center; /* 세로 중앙 정렬 */
`;

export default HomePage;
