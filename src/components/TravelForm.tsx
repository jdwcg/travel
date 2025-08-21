// src/pages/SchedulePage.tsx (이전 내용을 모두 지우고 이 코드를 통째로 복사해서 붙여넣으세요!)

import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    LodgingTagsContainer,
    BaseBtnWrap, // CommonLayout에서 가져온 BaseBtnWrap (없다면 여기에 정의해주세요)
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
} from '../components/CommonLayout'; // 단의 CommonLayout에 맞게 확인하세요!

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styled from 'styled-components'; // SchedulePage 자체에 필요한 스타일 컴포넌트 정의용

// ✨ 새로 생성한 TravelForm 컴포넌트 임포트! (여기서 문제가 나고 있었으므로 정확히 확인!) ✨
import TravelForm from '../components/TravelForm'; // ✨ default export인 TravelForm만 임포트!
import { TravelItemType } from '../types'; // ✨ TravelItemType은 이제 src/types에서 임포트! (1단계) ✨

// ActivityIcon 컴포넌트는 SchedulePage에 남겨둡니다.
function ActivityIcon({ type }: { type: TravelItemType['type'] }) {
    const map: Record<TravelItemType['type'], string> = {
        camping: '🏕️',
        hotel: '🏨',
        activity: '🎒',
        food: '🍽️',
    };
    return <IconSpan aria-hidden>{map[type] ?? ''}</IconSpan>;
}

// SchedulePage 컴포넌트 시작!
export default function SchedulePage() {
    const [travelDates, setTravelDates] = useState<TravelItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false); // 폼 표시 여부 상태

    // 데이터를 가져오는 함수
    const fetchTravelDates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<TravelItemType[]>(
                'http://localhost:5000/api/traveldates',
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
        fetchTravelDates(); // 컴포넌트 마운트 시 데이터 로딩
    }, []);

    // "일정추가" 버튼 클릭 핸들러
    const handleAddClick = () => {
        setShowAddForm(true); // 폼 보여주기
    };

    // 폼 취소 버튼 클릭 핸들러
    const handleCancelAdd = () => {
        setShowAddForm(false); // 폼 숨기기
    };

    // 폼 제출 후 추가 성공 시 핸들러
    // TravelForm의 onSave prop으로 전달됩니다.
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

    // 로딩, 에러 처리 UI
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
    // 데이터가 없고, 폼이 안 보일 때 (초기 상태에서 '일정추가' 버튼 노출)
    if (travelDates.length === 0 && !showAddForm) {
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p>아직 여행 일정 데이터가 없습니다.</p>
                    <BaseBtnWrap>
                        <button onClick={handleAddClick}>일정추가</button>
                    </BaseBtnWrap>
                </PageWrap>
            </Container>
        );
    }

    return (
        <Container>
            <PageHeader title="10월 제주 여행" />
            <Tabs />
            <PageWrap>
                {/* "일정추가" 버튼과 폼을 조건부 렌더링 */}
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

                {/* ✨ TravelForm 컴포넌트 사용! ✨ */}
                {showAddForm && (
                    <TravelForm
                        onSave={handleAddSuccess}
                        onCancel={handleCancelAdd}
                        isEditMode={false} // 추가 모드
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

// ✨ SchedulePage.tsx에 남아있어야 할 Styled-components ✨
// TravelForm 관련 Styled-components (FormContainer, FormField, ButtonContainer, Button, Label, Input, Select)는
// src/components/TravelForm.tsx 파일로 옮겨갔으므로 여기서는 삭제!

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
