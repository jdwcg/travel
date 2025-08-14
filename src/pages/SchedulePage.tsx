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
                    달력 보기
                </CalendarLink>
            </CalendarView>
        </Container>
    );
}
export const CalendarView = styled.div`
    margin-top: 40px;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #eee;
    border-radius: 4px;
`;
export const CalendarLink = styled(Link)`
    padding: 14px 20px;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    border: 1px solid #eee;
    border-radius: 4px;
    width: 100%;
    text-align: center;
    &:hover {
        background: #fbfbff;
    }
`;
