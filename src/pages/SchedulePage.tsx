// src/pages/SchedulePage.tsx

import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    LodgingTagsContainer,
    BaseBtnWrap,
    LodgingTag,
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

import { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { Link } from 'react-router-dom';

import type { TravelItemType } from '../types/TravelTypes';
import TravelForm from '../components/TravelForm';
import styled from 'styled-components';
const Spacer = styled.div`
    margin-top: 80px;
`;
function ActivityIcon({ type }: { type: TravelItemType['type'] }) {
    const map: Record<TravelItemType['type'], string> = {
        '': '',
        camping: '🏕️',
        hotel: '🏨',
        activity: '🎒',
        food: '🍽️',
    };
    return <IconSpan aria-hidden>{map[type] ?? ''}</IconSpan>;
}

export default function SchedulePage() {
    const [travelDates, setTravelDates] = useState<TravelItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchTravelDates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosClient.get<TravelItemType[]>(
                '/api/travelDates',
            );
            setTravelDates(response.data);
        } catch (err) {
            console.error('여행 일정 데이터를 불러오는 데 실패했습니다:', err);
            setError(
                '여행 일정 데이터를 불러오는 데 실패했습니다. 서버를 확인해주세요.',
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravelDates();
    }, []);

    const handleAddClick = () => setShowAddForm(true);
    const handleCancelAdd = () => setShowAddForm(false);

    // ✨ 여기만 추가/수정
    const handleAddSuccess = (newTravel: TravelItemType) => {
        setTravelDates((prev) => {
            const updatedDates = [...prev, newTravel];
            return updatedDates.sort(
                (a, b) =>
                    (parseInt(a.date) || 0) - (parseInt(b.date) || 0) ||
                    a.id.localeCompare(b.id),
            );
        });
        setShowAddForm(false);
    };

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

    return (
        <Container>
            <PageHeader title="10월 제주 여행" />
            <Tabs />
            <Spacer></Spacer>
            <PageWrap>
                {!showAddForm && (
                    <div className="inner">
                        <LodgingTagsContainer>
                            <LodgingTag type="camping">🏕️ 캠핑장</LodgingTag>
                            <LodgingTag type="hotel">🏨 호텔</LodgingTag>
                        </LodgingTagsContainer>
                        <BaseBtnWrap>
                            <button onClick={handleAddClick}>일정추가</button>
                        </BaseBtnWrap>
                    </div>
                )}

                {showAddForm && (
                    // ✨ TravelForm에서 onAdd 호출 시 바로 목록 반영
                    <TravelForm
                        onAdd={handleAddSuccess}
                        onCancel={handleCancelAdd}
                    />
                )}

                <ListWrapper>
                    <ListHeader>
                        <HeaderCell basis={COL_WIDTH_DAY}>day</HeaderCell>
                        <HeaderCell basis={COL_WIDTH_DATE}>date</HeaderCell>
                        <HeaderContentCell>content</HeaderContentCell>
                    </ListHeader>

                    <ListBody>
                        {travelDates.length > 0
                            ? travelDates.map((item) => (
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
                                              item.day === '토' ||
                                              item.day === '일'
                                          }
                                      >
                                          {item.date}
                                      </ItemDateCell>
                                      <ItemContentCell title={item.content}>
                                          <ActivityIcon type={item.type} />
                                          <TextContent>
                                              {item.content}
                                          </TextContent>
                                      </ItemContentCell>
                                  </StyledLink>
                              ))
                            : !showAddForm && (
                                  <p>
                                      아직 등록된 여행 일정이 없습니다. 위에
                                      '일정추가' 버튼을 눌러 추가해보세요!
                                  </p>
                              )}
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
    font-size: 14px;
    text-align: center;
    background-color: #dfe6ee;
    border-radius: 12px;
    &:hover {
        background: #d2d9e0;
    }
`;
