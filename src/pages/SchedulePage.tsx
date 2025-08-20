// src/pages/SchedulePage.tsx

import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    LodgingTagsContainer,
    LodgingTag,
    // ScheduleSection as _Unused, // 사용하지 않는 임포트는 제거하는 것이 좋아요!
    ListWrapper,
    ListHeader,
    ListBody,
    HeaderCell,
    HeaderContentCell,
    StyledLink,
    ItemCell,
    ItemDateCell,
    ItemContentCell,
    TextContent,
    IconSpan,
    COL_WIDTH_DAY,
    COL_WIDTH_DATE,
    PageWrap,
} from '../components/CommonLayout'; // 단의 CommonLayout에 맞게 확인하세요.

import { Link } from 'react-router-dom';
// import { travelDates } from '../data/travelDates'; // ❌ 이 줄은 이제 필요 없어요! 주석 처리하거나 삭제!

import { useEffect, useState } from 'react'; // ✨ useEffect와 useState 추가!
import axios from 'axios'; // ✨ axios 추가!

// 💡 TravelItemType 타입 정의 (백엔드에서 오는 데이터 구조와 맞춰야 해요!)
// models/TravelDate.js 에 정의한 스키마와 동일해야 합니다!
interface TravelItemType {
    id: string;
    date: string; // ISO: 'YYYY-MM-DD' 또는 '1', '2' 등
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일'; // 요일 타입은 백엔드에서 string으로 넘어옴
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    _id?: string; // MongoDB에서 자동 생성되는 _id도 타입에 추가해주면 좋아요!
    __v?: number; // Mongoose에서 자동 생성하는 버전 키
}

// TravelItem['type']을 그대로 사용하려면 원래 travelDates 타입이 필요하지만,
// 이제 TravelItemType을 직접 정의했으니 이 타입으로 사용
function ActivityIcon({ type }: { type: TravelItemType['type'] }) {
    const map: Record<TravelItemType['type'], string> = {
        camping: '🏕️',
        hotel: '🏨',
        activity: '🎒',
        food: '🍽️',
    };
    return <IconSpan aria-hidden>{map[type] ?? ''}</IconSpan>;
}

export default function SchedulePage() {
    // 💡 백엔드에서 가져온 여행 일정을 저장할 state
    const [travelDates, setTravelDates] = useState<TravelItemType[]>([]);
    // 💡 데이터 로딩 중인지 여부를 알려줄 state
    const [loading, setLoading] = useState(true);
    // 💡 에러 발생 시 에러 메시지를 저장할 state
    const [error, setError] = useState<string | null>(null);

    // 💡 컴포넌트가 처음 마운트될 때 (로딩될 때) 데이터를 가져오기 위한 useEffect
    useEffect(() => {
        const fetchTravelDates = async () => {
            try {
                setLoading(true);
                setError(null); // 혹시 이전 에러가 있다면 초기화

                // 백엔드 API로부터 데이터 가져오기!
                const response = await axios.get<TravelItemType[]>(
                    'http://localhost:5000/api/travelDates',
                );
                console.log('백엔드에서 받은 Raw 데이터:', response);
                console.log(
                    '백엔드에서 받은 데이터 (response.data):',
                    response.data,
                );
                // 가져온 데이터를 state에 저장
                setTravelDates(response.data);
            } catch (err) {
                // 에러 발생 시 에러 메시지 설정
                console.error(
                    '여행 일정 데이터를 불러오는 데 실패했습니다:',
                    err,
                );
                setError(
                    '여행 일정 데이터를 불러오는 데 실패했습니다. 서버를 확인해주세요.',
                );
                console.error(
                    '여행 일정 데이터를 불러오는 데 실패했습니다:',
                    err,
                );
                setError(
                    '여행 일정 데이터를 불러오는 데 실패했습니다. 서버를 확인해주세요.',
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTravelDates(); // 함수 호출하여 데이터 가져오기 시작
    }, []); // 💡 빈 배열은 컴포넌트가 처음 렌더링될 때만 이펙트가 실행됨을 의미!

    // 💡 로딩 중일 때 보여줄 UI
    if (loading) {
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p>여행 일정 데이터를 불러오는 중...</p>
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
    if (travelDates.length === 0) {
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p>아직 여행 일정 데이터가 없습니다.</p>
                </PageWrap>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader title="10월 제주 여행" />

            <Tabs />
            <PageWrap>
                <LodgingTagsContainer>
                    <LodgingTag type="camping">
                        <span className="icon">🏕️</span> 캠핑장
                    </LodgingTag>
                    <LodgingTag type="hotel">
                        <span className="icon">🏨</span> 호텔
                    </LodgingTag>
                </LodgingTagsContainer>

                <ListWrapper>
                    <ListHeader>
                        <HeaderCell basis={COL_WIDTH_DAY}>day</HeaderCell>
                        <HeaderCell basis={COL_WIDTH_DATE}>date</HeaderCell>
                        <HeaderContentCell>content</HeaderContentCell>
                    </ListHeader>

                    <ListBody>
                        {travelDates.map((item) => (
                            <StyledLink
                                key={item._id || item.id}
                                to={`/detail/travel/${item.id}`}
                                data-lodging={item.lodging}
                                data-date={item.date}
                                aria-label={`일정 ${item.date} 상세보기`}
                            >
                                <ItemCell basis={COL_WIDTH_DAY}>
                                    {item.day}
                                </ItemCell>
                                <ItemDateCell
                                    basis={COL_WIDTH_DATE}
                                    isWeekend={
                                        item.day === '토' || item.day === '일'
                                    }
                                >
                                    {item.date}
                                </ItemDateCell>
                                <ItemContentCell title={item.content}>
                                    <ActivityIcon type={item.type} />
                                    <TextContent>{item.content}</TextContent>
                                </ItemContentCell>
                            </StyledLink>
                        ))}
                    </ListBody>
                </ListWrapper>
            </PageWrap>

            <CalendarView>
                <CalendarLink to="/calendar" aria-label="달력으로 이동">
                    2025년 10월 달력 ↗
                </CalendarLink>
            </CalendarView>
        </Container>
    );
}

import styled from 'styled-components';
// 💡 SchedulePage.tsx 안에 직접 Styled-components가 정의되어 있네요.
// 만약 CommonLayout.tsx나 별도의 styled.ts 파일에 정의되어 있지 않다면, 이 부분은 그대로 유지하세요.
export const CalendarView = styled.div`
    margin-top: 20px;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
`;
export const CalendarLink = styled(Link)`
    padding: 14px 20px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    border-radius: 4px;
    /* width: 100%; */
    font-size: 14px;
    text-align: center;
    background-color: #dfe6ee;
    border-radius: 12px;
    &:hover {
        background: #d2d9e0;
    }
`;
