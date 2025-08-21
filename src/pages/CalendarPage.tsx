// src/pages/CalendarPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// ✨ DateClickArg와 interactionPlugin을 @fullcalendar/interaction에서 올바르게 임포트! ✨
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction'; // 타입만 가져올 때는 'type' 키워드 사용

// ✨ EventInput과 FullCalendar 관련 타입들을 @fullcalendar/core에서 올바르게 임포트! ✨
import type { EventInput } from '@fullcalendar/core'; // 타입만 가져올 때는 'type' 키워드 사용
import koLocale from '@fullcalendar/core/locales/ko';

import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

// 💡 CommonLayout에서 가져오는 컴포넌트들을 여기에 직접 정의합니다.
// 만약 단의 CommonLayout.tsx에 이미 정의되어 있다면,
// 여기의 TopBar, Page 등의 Styled-components 정의는 삭제하고 CommonLayout에서 import 하세요!
// (현재는 이 CalendarPage.tsx 파일 내부에 정의된 것으로 가정합니다.)
// import { Container } from '../components/CommonLayout'; // CommonLayout에 정의되어 있다면 이 줄 사용

// ✨ 백엔드에서 가져올 TravelItemType 정의 (models/TravelDate.js와 일치해야 합니다!)
interface TravelItemType {
    id: string; // "1", "2" 와 같은 일자 (문자열), 백엔드 모델에서 unique: true
    date: string; // FullCalendar의 date는 "YYYY-MM-DD" 형식이지만, 여기서는 일자 "1", "2" 등을 저장.
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel'; // 선택 사항
    contentType?: 'text' | 'html' | 'table'; // 선택 사항
    contentData?: {
        // 선택 사항
        headers?: string[];
        rows?: string[][];
    };
    _id?: string; // MongoDB 자동 생성 ID (백엔드에서 추가됨)
    __v?: number; // Mongoose 버전 키 (백엔드에서 추가됨)
}

// ✨ CalendarPage 컴포넌트 시작! ✨
export default function CalendarPage() {
    const navigate = useNavigate();
    const location = useLocation(); // '닫기' 버튼 경로 설정을 위해 사용

    // 백엔드에서 불러온 travelDates 데이터를 저장할 상태
    const [travelDates, setTravelDates] = useState<TravelItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✨ allEvents 상태는 travelDates를 FullCalendar 이벤트 형식으로 변환하여 저장
    const allEvents: EventInput[] = useMemo(() => {
        return travelDates.map((item) => {
            // FullCalendar 이벤트의 'date'는 'YYYY-MM-DD' 형식이어야 합니다.
            // item.date가 "1", "2"와 같은 문자열 일자이므로, 2025년 10월을 기준으로 변환
            const fullDate = `2025-10-${String(item.date).padStart(2, '0')}`;
            return {
                id: item.id, // FullCalendar 이벤트 ID는 고유해야 합니다. (day1, day2...)
                title: `${item.day}일차: ${item.content}`, // 캘린더에 표시될 내용
                date: fullDate, // 이벤트 날짜 (2025-10-01, 2025-10-02...)
                extendedProps: {
                    // 추가 정보 (원본 travel item 데이터)
                    originalData: item, // 원본 TravelItemType 객체를 그대로 저장
                },
                // lodging 타입에 따라 클래스 추가하여 스타일 적용 (FullCalendarGlobalStyle에서 이 클래스를 사용)
                classNames: item.lodging ? [`lodging-${item.lodging}`] : [],
            };
        });
    }, [travelDates]); // travelDates 데이터가 변경될 때마다 allEvents를 다시 계산 (useMemo 사용)

    // ✨ 컴포넌트 마운트 시 백엔드에서 travelDates 데이터 불러오기 ✨
    useEffect(() => {
        const fetchTravelDates = async () => {
            try {
                setLoading(true);
                setError(null);
                // 백엔드 API로부터 travelDates 데이터 가져오기
                const response = await axios.get<TravelItemType[]>(
                    'http://localhost:5000/api/travelDates',
                ); // 'travelDates' 대소문자 주의!
                setTravelDates(response.data); // 가져온 데이터를 state에 저장
            } catch (err) {
                console.error(
                    '캘린더 이벤트 데이터를 불러오는 중 오류 발생:',
                    err,
                );
                setError(
                    '캘린더 이벤트를 불러오는 데 실패했습니다. 서버를 확인해주세요.',
                );
            } finally {
                setLoading(false);
            }
        };
        fetchTravelDates(); // 함수 호출하여 데이터 가져오기 시작
    }, []); // 빈 배열: 컴포넌트가 처음 마운트될 때(로딩될 때) 한 번만 실행

    // ✨ 이벤트 클릭 핸들러 (캘린더의 이미 존재하는 이벤트 항목 클릭 시)
    // 클릭된 이벤트의 originalData (원본 travel item 데이터)를 사용하여 상세 페이지로 이동
    const handleEventClick = (clickInfo: {
        event: { extendedProps: { originalData: TravelItemType } };
    }) => {
        const originalData = clickInfo.event.extendedProps.originalData; // originalData 속성 접근
        if (originalData && originalData.id) {
            navigate(`/detail/travel/${originalData.id}`); // '/detail/travel/day1' 형식으로 이동
        } else {
            alert('이벤트 상세 정보를 찾을 수 없습니다.');
        }
    };

    // ✨ 날짜 클릭 핸들러 (캘린더의 빈 날짜 또는 날짜 숫자 클릭 시)
    const handleDateClick = (info: DateClickArg) => {
        // 'DateClickArg' 타입 사용
        const iso = info.dateStr; // "YYYY-MM-DD" 형식 (예: "2025-10-01")
        const m = iso.match(/(\d{4})-(\d{2})-(\d{2})/); // 정규식으로 YYYY, MM, DD 추출

        // 현재 예제는 2025년 10월 데이터만 다루므로 해당 날짜만 처리
        if (m && m[1] === '2025' && m[2] === '10') {
            const dayNum = Number(m[3]); // 클릭한 날짜의 '일' (예: 1, 10, 25)
            const itemId = `day${dayNum}`; // travelDates의 ID 형식 (예: 'day1', 'day2')

            // 클릭한 날짜에 해당하는 데이터가 travelDates 배열에 실제로 존재하는지 확인
            const existingItem = travelDates.find((item) => item.id === itemId);

            if (existingItem) {
                // 데이터가 존재하면 해당 항목의 상세 페이지로 이동
                navigate(`/detail/travel/${itemId}`);
            } else {
                // 데이터가 없으면 알림 메시지 표시
                alert(
                    `2025년 ${m[2]}월 ${dayNum}일에는 등록된 여행 일정이 없습니다.`,
                );
                // 필요하다면 여기에서 새 일정을 추가하는 폼으로 이동시키는 로직을 추가할 수 있습니다.
            }
            return; // 처리했으니 함수 종료
        }

        // 2025년 10월 외의 날짜 클릭 시 처리 (현재는 데이터가 없음)
        alert('현재 2025년 10월 일정만 지원됩니다.');
    };

    // '닫기' 버튼이 돌아갈 경로 (SchedulePage로 돌아가는 것이 일반적)
    const backTo = '/schedule';

    // ✨ 로딩 및 에러 처리 UI (FullCalendar 렌더링 전에 표시) ✨
    // Container 컴포넌트는 CommonLayout.tsx에서 임포트했다고 가정합니다.
    // 만약 CommonLayout에 없다면 div 등으로 대체하거나 여기에 정의해주세요.
    if (loading)
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>캘린더 데이터를 불러오는 중...</p>
            </div>
        );
    if (error)
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p style={{ color: 'red' }}>{error}</p>
            </div>
        );
    if (travelDates.length === 0)
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>2025년 10월에 등록된 여행 일정이 없습니다.</p>
                <p>일정은 '/schedule' 페이지에서 추가할 수 있습니다.</p>
            </div>
        );

    // ✨ 메인 렌더링 부분 ✨
    return (
        <>
            <FullCalendarGlobalStyle />{' '}
            {/* ✨ FullCalendar의 전역 스타일 적용 */}
            {/* ✨ 상단 고정바 (TopBar, TopBarInner, BarTitle, CloseLink는 이 파일 하단에 정의됨) */}
            <TopBar role="banner" aria-hidden={false}>
                <TopBarInner>
                    <BarTitle>10월 제주 여행 캘린더</BarTitle>
                    <CloseLink to={backTo} aria-label="닫기">
                        ×
                    </CloseLink>
                </TopBarInner>
            </TopBar>
            {/* ✨ 캘린더를 감싸는 페이지 본문 영역 (Page는 이 파일 하단에 정의됨) */}
            <Page>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]} // 필요한 플러그인
                    initialView="dayGridMonth" // 초기 캘린더 뷰 (월 단위)
                    initialDate="2025-10-01" // 캘린더 초기 날짜 (2025년 10월로 고정)
                    headerToolbar={{
                        // 캘린더 헤더에 표시될 버튼들
                        left: 'today', // 오늘 날짜로 이동 버튼
                        center: 'title', // 현재 보고 있는 월/년도 제목
                        right: 'prev,next', // 이전/다음 월로 이동 버튼
                    }}
                    locales={[koLocale]} // 한국어 로케일 설정
                    locale="ko" // 캘린더 언어를 한국어로
                    events={allEvents} // ✨ 캘린더에 표시될 이벤트 데이터 (allEvents)
                    eventClick={handleEventClick} // ✨ 이벤트 클릭 시 호출될 함수
                    dateClick={handleDateClick} // ✨ 날짜 클릭 시 호출될 함수
                    height="auto" // 캘린더 높이 자동 조절
                    selectable={true} // 드래그로 날짜 범위 선택 가능
                    dayMaxEvents={true} // 하루에 너무 많은 이벤트가 있으면 "더보기" 링크 생성
                />
            </Page>
            {/* ✨ '닫기' 버튼 영역 (캘린더 아래) */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '20px',
                }}
            >
                <p
                    style={{
                        marginTop: 0,
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        borderRadius: 4,
                        display: 'inline-block',
                    }}
                >
                    <Link
                        to={backTo}
                        aria-label="닫기"
                        style={{ padding: 12, display: 'block' }}
                    >
                        닫기
                    </Link>
                </p>
            </div>
        </>
    );
}

// ✨ 이 아래에 필요한 Styled-components 정의 (CalendarPage.tsx 안에 직접 정의) ✨
// 만약 CommonLayout.tsx나 다른 Styled-components 파일에 이미 정의되어 있다면,
// 이 파일에서는 아래 정의들을 삭제하고 해당 파일에서 import 하여 사용해야 합니다!
// (현재는 CalendarPage.tsx 파일 내부에 정의된 것으로 가정합니다.)

// ✨ FullCalendar의 전역 스타일 (주로 class 이름 선택자 사용)
export const FullCalendarGlobalStyle = createGlobalStyle`
    /* FullCalendar 툴바 / 버튼 기본 스타일 */
    .fc .fc-toolbar-title {
        font-size: 18px;
        font-weight: 700;
        color: #222;
        letter-spacing: -0.2px;
    }

    .fc .fc-button {
        padding: 6px 10px;
        font-size: 12px;
        border-radius: 6px;
        border: 1px solid #e6e6e6;
        background: #fff;
        color: #333;
        height: 30px;
    }

    .fc .fc-button.fc-button-primary {
        background: #74787e;
        color: #fff;
        border-color: #74787e;
    }

    .fc .fc-button:hover {
        filter: brightness(0.98);
    }

    .fc .fc-prev-button, .fc .fc-next-button {
        width: 30px;
        height: 30px;
        padding: 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .fc .fc-dayGridMonth-button,
    .fc .fc-timeGridWeek-button,
    .fc .fc-timeGridDay-button {
        padding: 6px 12px;
        margin-left: 4px;
    }

    .fc .fc-toolbar {
        gap: 4px;
    }

    /* ================= Lodging 색상 규칙 (호텔 / 캠핑) ================= */
    /* 배경 이벤트(.fc-bg-event)와 day cell 클래스 모두 커버하도록 선택자 확장 */
    /* .lodging-hotel 배경과 텍스트 색상 */
    .fc .fc-bg-event.lodging-hotel,
    .fc .fc-daygrid-day .fc-bg-event.lodging-hotel,
    .fc .fc-event.lodging-hotel,
    .fc .fc-daygrid-day-frame .lodging-hotel {
        background: pink !important;
        border-color: #7a3b0026 !important;
        color: #7a3b00 !important;
    }

    /* .lodging-camping 배경과 텍스트 색상 */
    .fc .fc-bg-event.lodging-camping,
    .fc .fc-daygrid-day .fc-bg-event.lodging-camping,
    .fc .fc-event.lodging-camping,
    .fc .fc-daygrid-day-frame .lodging-camping {
        background: skyblue !important;
        border-color: #005b8a26 !important;
        color: #005b8a !important;
    }

    /* 이벤트 텍스트 가독성 보정 (필요 시 조정) */
    .fc .fc-event, .fc .fc-event .fc-event-title {
        color: inherit !important; /* 상위 요소로부터 색상을 상속받도록 */
    }

    /* 1) 이벤트 내부 영역(패딩/높이/정렬) 키우기 */
    .fc .fc-daygrid-event .fc-event-main-frame {
        padding: 3px 2px !important;       /* 세로/가로 여백 증가 */
        min-height: 34px !important;         /* 이벤트 블록 최소 높이 확보 */
        display: flex !important;
        align-items: center !important;      /* 중앙 정렬로 텍스트가 가운데 위치 */
    }

    /* 2) 이벤트 제목 폰트 키우기 / 줄바꿈 허용 */
    .fc .fc-daygrid-event .fc-event-title {
        font-size: 14px !important;
        font-weight: 600 !important;
        line-height: 1.1 !important;
    }

    /* 3) harness(래퍼) 마진/간격 보정(원하면) */
    .fc .fc-daygrid-event-harness {
        margin-top: 4px !important;
        margin-bottom: 4px !important;
    }

    /* 4) (선택) 내부에 태그/아이콘을 넣었다면 그 태그의 스타일 */
    .fc .fc-event .fc-event-tag,
    .fc .fc-event .lodging-hotel,
    .fc .fc-event .lodging-camping {
        padding: 6px 10px !important;
        font-size: 13px !important;
        border-radius: 6px !important;
        margin-right: 8px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
    }

    /* 주말 날짜 숫자 색상 */
    .fc-day-sat { color: blue; }
    .fc-day-sun { color: red; }

    /* DayGridEvents가 너무 많을 때 생기는 "more" 링크 주변의 마진 조정 */
    .fc .fc-daygrid-body-natural .fc-daygrid-day-events {
        margin-bottom: 0;
    }
`;

// 💡 CommonLayout에 있을 수도 있는 스타일 컴포넌트들을 여기에 직접 정의합니다.
// 만약 CommonLayout에서 임포트한다면 이 부분들은 삭제해야 합니다.
const TOPBAR_HEIGHT = '64px';

export const TopBar = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${TOPBAR_HEIGHT};
    background: #ffffff;
    border-bottom: 1px solid #ececec;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

export const TopBarInner = styled.div`
    width: 100%;
    max-width: 980px; /* Container와 동일하게 맞춤 */
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative; /* CloseLink 절대 위치 기준 */
    box-sizing: border-box;
`;

export const BarTitle = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #222;
    text-align: center;
`;

export const CloseLink = styled(Link)`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #333;
    background: #fff;
    border: 1px solid #eee;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;

    &:hover {
        background: #f6f6f6;
    }
`;

export const Page = styled.main`
    padding-top: ${TOPBAR_HEIGHT};
    min-height: calc(100vh - ${TOPBAR_HEIGHT});
    background: #fcfcfc;
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
`;

// ✨ Container 스타일 컴포넌트 추가: CommonLayout에서 import 하지 않는다면 필요
// export const Container = styled.div`
//     width: 100%;
//     max-width: 980px;
//     margin: 0 auto;
//     padding: 20px;
//     box-sizing: border-box;
// `;
