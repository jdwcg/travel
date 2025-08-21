// src/pages/SchedulePage.tsx (수정된 전체 코드)

import PageHeader from '../components/PageHeader';
import Tabs from '../components/Tabs';
import {
    Container,
    LodgingTagsContainer,
    BaseBtnWrap,
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
} from '../components/CommonLayout';

import React, { useEffect, useState } from 'react'; // React, useEffect, useState
import axios from 'axios'; // axios
import { Link } from 'react-router-dom'; // Link for CalendarLink and StyledLink
import styled from 'styled-components'; // styled-components for local styles

// 💡 TravelItemType 인터페이스 재사용 (models/TravelDate.js 와 동일하게)
interface TravelItemType {
    id: string;
    date: string;
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    _id?: string;
    __v?: number;
}

// ActivityIcon 컴포넌트
function ActivityIcon({ type }: { type: TravelItemType['type'] }) {
    const map: Record<TravelItemType['type'], string> = {
        camping: '🏕️',
        hotel: '🏨',
        activity: '🎒',
        food: '🍽️',
    };
    return <IconSpan aria-hidden>{map[type] ?? ''}</IconSpan>;
}

// ✨ 일정 추가 폼 컴포넌트 ✨
// ✨ 일정 추가 폼 컴포넌트 ✨ (수정)
interface AddTravelFormProps {
    onAdd: (newTravel: TravelItemType) => void;
    onCancel: () => void;
}

function AddTravelForm({ onAdd, onCancel }: AddTravelFormProps) {
    const [formData, setFormData] = useState<
        Omit<
            TravelItemType,
            '_id' | '__v' | 'contentData' | 'contentType' | 'lodging'
        >
    >({
        id: '',
        date: '',
        day: '월',
        type: 'activity',
        content: '',
    });
    const [adminPassword, setAdminPassword] = useState(''); // ✨ 비밀번호 상태 추가!

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        console.log(`Input changed - Name: ${name}, Value: ${value}`); // ✨ 이 로그로 각 필드에 입력된 값 확인
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ✨ 비밀번호 변경 핸들러
        setAdminPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('--- 전송될 formData ---', formData);
        console.log('--- 전송될 adminPassword ---', adminPassword);
        if (
            !formData.id ||
            !formData.date ||
            !formData.day ||
            !formData.type ||
            !formData.content
        ) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        if (!adminPassword) {
            // ✨ 비밀번호가 비어있으면
            alert('일정을 추가하려면 관리자 비밀번호를 입력해야 합니다.');
            return;
        }

        try {
            // 백엔드 POST API 호출 시 헤더에 비밀번호 추가!
            const response = await axios.post<TravelItemType>(
                'http://localhost:5000/api/traveldates',
                formData,
                {
                    headers: {
                        'X-Admin-Password': adminPassword, // ✨ 중요! 백엔드에서 설정한 헤더 이름과 동일해야 함
                    },
                },
            );

            alert('일정이 성공적으로 추가되었습니다!');
            onAdd(response.data);

            // 폼 초기화 및 비밀번호도 초기화
            setFormData({
                id: '',
                date: '',
                day: '월',
                type: 'activity',
                content: '',
            });
            setAdminPassword(''); // ✨ 비밀번호 필드도 초기화
        } catch (error) {
            console.error('여행 일정 추가 실패:', error);
            if (axios.isAxiosError(error) && error.response) {
                // 백엔드에서 보낸 401 Unauthorized 에러 메시지 확인
                if (error.response.status === 401) {
                    alert('일정 추가 실패: 잘못된 관리자 비밀번호입니다.');
                } else {
                    alert(
                        '일정 추가에 실패했습니다: ' +
                            (error.response.data.message || error.message),
                    );
                }
            } else {
                alert('일정 추가에 실패했습니다.');
            }
        }
    };

    return (
        <FormContainer>
            <h4 style={{ marginTop: 0 }}>새 여행 일정 추가</h4>
            <form onSubmit={handleSubmit}>
                {/* 기존 폼 필드들 */}
                <FormField>
                    <Label htmlFor="id">ID:</Label>
                    <Input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="day1, day2 처럼 고유한 ID"
                        required
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="date">날짜 (일):</Label>
                    <Input
                        type="text"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="예: 1 (일자만)"
                        required
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="day">요일:</Label>
                    <Select
                        id="day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        required
                    >
                        <option value="월">월</option>
                        <option value="화">화</option>
                        <option value="수">수</option>
                        <option value="목">목</option>
                        <option value="금">금</option>
                        <option value="토">토</option>
                        <option value="일">일</option>
                    </Select>
                </FormField>
                <FormField>
                    <Label htmlFor="type">유형:</Label>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="activity">활동 🎒</option>
                        <option value="camping">캠핑 🏕️</option>
                        <option value="hotel">호텔 🏨</option>
                        <option value="food">음식 🍽️</option>
                    </Select>
                </FormField>
                <FormField>
                    <Label htmlFor="content">내용:</Label>
                    <Input
                        type="text"
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="예: 제주도 도착"
                        required
                    />
                </FormField>

                {/* ✨ 비밀번호 입력 필드 추가! ✨ */}
                <FormField>
                    <Label htmlFor="adminPassword">비밀번호:</Label>
                    <Input
                        type="password"
                        id="adminPassword"
                        name="adminPassword"
                        value={adminPassword}
                        onChange={handlePasswordChange}
                        placeholder="관리자 비밀번호"
                        required
                    />
                </FormField>

                <ButtonContainer>
                    <Button type="submit" primary>
                        추가하기
                    </Button>
                    <Button type="button" onClick={onCancel}>
                        취소
                    </Button>
                </ButtonContainer>
            </form>
        </FormContainer>
    );
}
export default function SchedulePage() {
    const [travelDates, setTravelDates] = useState<TravelItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false); // ✨ 폼 표시 여부 상태 추가

    // 데이터를 가져오는 함수 (초기 로딩 및 새 항목 추가 후 재호출용)
    const fetchTravelDates = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get<TravelItemType[]>(
                'http://localhost:5000/api/traveldates',
            );
            setTravelDates(response.data); // 데이터 설정
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

    // ✨ "일정추가" 버튼 클릭 핸들러
    const handleAddClick = () => {
        setShowAddForm(true); // 폼 보여주기
    };

    // ✨ 폼 취소 버튼 클릭 핸들러
    const handleCancelAdd = () => {
        setShowAddForm(false); // 폼 숨기기
    };

    // ✨ 폼 제출 후 추가 성공 시 핸들러
    const handleAddSuccess = (newTravel: TravelItemType) => {
        // Option 1: 새로고침 없이 바로 UI에 반영 (더 부드러움)
        setTravelDates((prev) => {
            const updatedDates = [...prev, newTravel];
            // 날짜 또는 ID 기준으로 정렬이 필요할 수 있어요 (예: day1, day2 순서)
            return updatedDates.sort(
                (a, b) =>
                    (parseInt(a.date) || 0) - (parseInt(b.date) || 0) ||
                    a.id.localeCompare(b.id),
            );
        });
        setShowAddForm(false); // 폼 숨기기
        // Option 2: 모든 데이터를 다시 불러오는 방법 (간단하지만 성능 저하 가능)
        // fetchTravelDates();
        // setShowAddForm(false);
    };

    // 로딩, 에러, 데이터 없음 UI
    if (loading) {
        /* ... 기존 로딩 UI ... */ return (
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
        /* ... 기존 에러 UI ... */ return (
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
    if (travelDates.length === 0 && !showAddForm) {
        // 폼이 띄워져있을 때는 이 메시지 안 뜨게!
        return (
            <Container>
                <PageHeader title="10월 제주 여행" />
                <Tabs />
                <PageWrap>
                    <p>아직 여행 일정 데이터가 없습니다.</p>
                    <BaseBtnWrap>
                        {' '}
                        {/* ✨ 버튼 랩도 여기 가져옴 */}
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
                {/* ✨ "일정추가" 버튼과 폼을 조건부 렌더링 */}
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
                    <AddTravelForm
                        onAdd={handleAddSuccess}
                        onCancel={handleCancelAdd}
                    />
                )}
                {/* ✨ 폼 컴포넌트 추가 */}
                <ListWrapper>
                    <ListHeader>
                        <HeaderCell basis={COL_WIDTH_DAY}>day</HeaderCell>
                        <HeaderCell basis={COL_WIDTH_DATE}>date</HeaderCell>
                        <HeaderContentCell>content</HeaderContentCell>
                    </ListHeader>

                    <ListBody>
                        {travelDates.length > 0 // 데이터가 있을 때만 map 돌기
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
                            : // 데이터는 없지만 폼이 보이는 중이 아닐 때 이 메시지 표시
                              !showAddForm && (
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

// ✨ 일정 추가 폼을 위한 Styled-components ✨
export const FormContainer = styled.div`
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    background-color: #fcfcfc;
    margin-bottom: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const FormField = styled.div`
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    label {
        flex: 0 0 80px;
        font-weight: 600;
        color: #555;
    }
    input,
    select {
        flex: 1;
        padding: 8px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 14px;
        &:focus {
            outline: none;
            border-color: #5b9dff;
            box-shadow: 0 0 0 2px rgba(91, 157, 255, 0.2);
        }
    }
`;

export const ButtonContainer = styled.div`
    margin-top: 20px;
    text-align: right;
`;

export const Button = styled.button<{ primary?: boolean }>`
    padding: 8px 14px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    background-color: ${(props) => (props.primary ? 'dodgerblue' : '#ccc')};
    color: ${(props) => (props.primary ? 'white' : '#333')};
    margin-left: 10px;
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => (props.primary ? 'dodgerblue' : '#bbb')};
    }
`;

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
export const Label = styled.label`
    /* label 태그용 스타일 */
    flex: 0 0 80px; /* 이 flex 속성도 FormField에 정의된 flex-direction에 따라 다르게 작용 */
    font-weight: 600;
    color: #555;
    text-align: right; /* 라벨 텍스트 오른쪽 정렬 */
    padding-right: 15px; /* 입력 필드와의 간격 */
`;

export const Input = styled.input`
    /* input 태그용 스타일 */
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #5b9dff;
        box-shadow: 0 0 0 2px rgba(91, 157, 255, 0.2);
    }
`;

export const Select = styled.select`
    /* select 태그용 스타일 */
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: white; /* select 기본 스타일 제거 */
    &:focus {
        outline: none;
        border-color: #5b9dff;
        box-shadow: 0 0 0 2px rgba(91, 157, 255, 0.2);
    }
`;
