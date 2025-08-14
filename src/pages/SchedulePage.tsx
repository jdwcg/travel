// src/pages/SchedulePage.tsx
import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    LodgingTagsContainer,
    LodgingTag,
    ScheduleSection as _Unused, // placeholder if needed
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
} from '../components/CommonLayout';
import { travelDates } from '../data/travelDates';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
type TravelItem = (typeof travelDates)[number];

function ActivityIcon({ type }: { type: TravelItem['type'] }) {
    const map: Record<TravelItem['type'], string> = {
        camping: '🏕️',
        hotel: '🏨',
        activity: '🎒',
        food: '🍽️',
    };
    return <IconSpan aria-hidden>{map[type] ?? ''}</IconSpan>;
}

export default function SchedulePage() {
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
                                to={`/detail/${item.id}`}
                                key={item.id}
                                data-lodging={item.lodging}
                                date={item.date}
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
                    📅 2025년 10월 달력
                </CalendarLink>
            </CalendarView>
        </Container>
    );
}
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
