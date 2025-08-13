// src/pages/HomePage.tsx
import { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ActivityIcon from '../components/ActivityIcon';
import { travelDates } from '../data/travelDates';

// ✨ Flexbox 컬럼 너비 정의 (헤더와 아이템에 공통 적용) ✨
// Flex-basis: flex 컨테이너 내에서 아이템의 기본 크기를 지정
const COL_WIDTH_DAY = '15%'; // 요일 컬럼 너비
const COL_WIDTH_DATE = '15%'; // 일자 컬럼 너비

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
            <LodgingTagsContainer>
                {/* 캠핑장 태그 */}
                <LodgingTag type="camping">
                    <span className="icon">🏕️</span>{' '}
                    {/* 캠핑 아이콘 (이모지로 대체했어요!) */}
                    캠핑장
                </LodgingTag>

                {/* 호텔 태그 */}
                <LodgingTag type="hotel">
                    <span className="icon">🏨</span>{' '}
                    {/* 호텔 아이콘 (이모지로 대체했어요!) */}
                    호텔
                </LodgingTag>
            </LodgingTagsContainer>
            {activeTab === 'schedule' ? (
                <ScheduleSection>
                    <ListWrapper>
                        {' '}
                        {/* 리스트 전체를 감싸는 Wrapper (정돈된 외형) */}
                        <ListHeader>
                            {' '}
                            {/* Flexbox 헤더 */}
                            <HeaderCell basis={COL_WIDTH_DAY}>요일</HeaderCell>
                            <HeaderCell basis={COL_WIDTH_DATE}>일자</HeaderCell>
                            <HeaderContentCell>내용</HeaderContentCell>{' '}
                            {/* 내용은 flex: 1로 나머지 공간 차지 */}
                        </ListHeader>
                        <ListBody>
                            {travelDates.map((item) => (
                                <StyledLink
                                    to={`/detail/${item.id}`}
                                    key={item.id}
                                    date={item.date}
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
                            ))}
                        </ListBody>
                    </ListWrapper>
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
// 🏕️ 숙박 태그들을 담을 컨테이너 스타일이에요!
const LodgingTagsContainer = styled.div`
    display: flex;
    gap: 10px;
    padding: 0 20px;
    background-color: #f8f8f8;
    border-radius: 12px;
`;

// 🌟 여기에요! LodgingTag가 받을 props의 타입을 정의해주는 인터페이스예요.
// 'type'이라는 prop이 있고, 그 값은 'camping'이거나 'hotel'만 가능하다고 알려주는 거죠!
interface LodgingTagProps {
    type: 'camping' | 'hotel';
}

// 🏷️ 개별 숙박 태그 스타일이에요!
// LodgingTagProps 인터페이스를 styled.span 뒤에 <LodgingTagProps> 이렇게 넣어주세요!
const LodgingTag = styled.span<LodgingTagProps>`
    display: flex;
    align-items: center;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    color: #333;
    white-space: nowrap;

    // 🎨 이제 props.type을 TypeScript가 잘 이해할 거예요!
    background-color: ${(props) => {
        // styled-components는 `theme` 객체를 `props`를 통해 전달해줍니다.
        // 따라서 `props.theme.colors` 와 같이 접근해야 해요!
        if (props.type === 'camping') {
            return props.theme.colors.dateRangeColor1;
        } else if (props.type === 'hotel') {
            return props.theme.colors.dateRangeColor2;
        }
        // 모든 'type' 케이스가 정의되어 있으므로 여기는 실제로 도달하지 않아요.
        // 하지만 만약을 대비해서 남겨둘게요.
        return '#eee';
    }};

    /* 아이콘에 대한 추가 스타일 */
    & .icon {
        margin-right: 6px;
        font-size: 18px;
    }
`;
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
    background-color: transparent;
    padding: 20px;
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
    font-size: ${({ theme }) => theme.fontSizes.small};
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

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
    margin: 16px;
`;

const ReservationSection = styled(ScheduleSection)`
    background-color: ${({ theme }) => theme.colors.white};

    border: 1px solid ${({ theme }) => theme.colors.lightGray};
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

    margin-bottom: 10px;
    cursor: pointer;
    text-align: left;
    color: ${({ theme }) => theme.colors.primaryDark};
    &:hover {
        background-color: ${({ theme }) => theme.colors.borderGray};
    }
`;

// ✨ Flexbox 기반 리스트 컨테이너들 ✨

const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.colors.white};

    overflow: hidden;
`;

const ListHeader = styled.div`
    display: flex; /* Flexbox로 헤더 아이템들을 정렬 */
    background-color: ${({ theme }) => theme.colors.primaryLight};
    color: ${({ theme }) => theme.colors.textDark};
    font-weight: 700;
`;

const ListBody = styled.div`
    /* 스크롤 기능이 필요하면 여기에 overflow-y: auto; 추가 */
`;

// 헤더 셀 공통 스타일
const HeaderCell = styled.div<{ basis?: string }>`
    font-size: 12px;
    padding: 12px 8px;
    text-align: center;
    white-space: nowrap;
    flex: 0 0 ${({ basis }) => basis || 'auto'}; /* 기본 크기 고정 (grow/shrink 방지) */
    display: flex;
    align-items: center;
    justify-content: center;
`;

const HeaderContentCell = styled(HeaderCell)`
    flex: 1; /* 남은 공간을 모두 차지 (내용 셀) */
    text-align: left;
    justify-content: flex-start;
`;

// StyledLink (각 리스트 항목) - Flexbox 행 역할
const StyledLink = styled(Link)<{ date: number }>`
    display: flex; /* Flexbox로 아이템들을 정렬 */
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderGray};
    background-color: ${({ date, theme }) =>
        getDateRangeBackgroundColor(date, theme)};
    transition: background-color 0.2s ease-in-out;
    padding: 10px 8px; /* 내부 아이템의 전체 패딩 (상하, 좌우) */
    min-height: 40px; /* 최소 높이 지정 (내용이 짧아도 일관된 높이 유지) */

    &:last-child {
        border-bottom: none;
    }
    &:hover {
        filter: brightness(0.95);
    }
`;

// 리스트 아이템 셀 공통 스타일
const ItemCell = styled.div<{ basis?: string; isWeekend?: boolean }>`
    flex: 0 0 ${({ basis }) => basis || 'auto'}; /* 헤더 셀과 동일한 크기 고정 */
    display: flex;
    align-items: center;
    justify-content: center; /* 기본은 가로 중앙 정렬 */
    font-size: 13px;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.textBody};
    white-space: nowrap; /* 셀 내용 줄바꿈 방지 */
`;

const ItemDateCell = styled(ItemCell)`
    font-weight: 600;
    color: ${({ isWeekend, theme }) =>
        isWeekend ? theme.colors.accentRed : theme.colors.textDark};
`;

// 내용 아이템 셀
const ItemContentCell = styled(ItemCell)`
    flex: 1; /* 남은 공간을 모두 차지 (내용 셀) */
    justify-content: flex-start; /* 내용은 좌측 정렬 */
    min-width: 0; /* ✨ 중요: Flex 아이템이 내부 콘텐츠로 인해 컨테이너를 확장하지 않도록 설정 ✨ */
    /* border: 1px solid red;  디버깅용 테두리는 이제 제거 (원하시면 다시 추가) */
    /* white-space, overflow, text-overflow는 TextContent로 이동 */
`;

// ✨ 한 줄 엘립시스를 위한 텍스트 Wrapper ✨
const TextContent = styled.span`
    flex-grow: 1; /* 남은 공간을 모두 차지 */
    flex-shrink: 1; /* 필요하면 줄어들기 */
    white-space: nowrap; /* 텍스트 줄바꿈 방지 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    text-overflow: ellipsis; /* 넘치는 내용에 ... 표시 */
    display: block; /* 엘립시스를 위해 블록 레벨처럼 작동 */
    min-width: 0; /* ✨ 중요: 텍스트 자체가 줄어들 수 있도록 설정 ✨ */
`;

export default HomePage;
