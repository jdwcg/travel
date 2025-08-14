// src/pages/HomePage.tsx
import { createGlobalStyle } from 'styled-components';
import koLocale from '@fullcalendar/core/locales/ko';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar'; // 구글 연동 시 사용
import { Link } from 'react-router-dom';

const Page = styled.div`
    padding: 20px;
    margin-top: 74px;
`;

const backTo = '/SchedulePage';

export default function CalendarPage() {
    return (
        <>
            <TopBar role="banner" aria-hidden={false}>
                <TopBarInner>
                    <BarTitle>상세 보기</BarTitle>

                    {/* 우측 상단 닫기 (기존 backTo와 동일한 동작) */}
                    <CloseLink to={backTo} aria-label="닫기">
                        ×
                    </CloseLink>
                </TopBarInner>
            </TopBar>
            <Page>
                <FullCalendarGlobalStyle />
                <FullCalendar
                    plugins={[
                        dayGridPlugin,
                        interactionPlugin,
                        googleCalendarPlugin,
                    ]}
                    initialView="dayGridMonth"
                    initialDate="2025-10-01"
                    headerToolbar={{
                        left: 'today',
                        center: 'title',
                        right: 'prev,next',
                    }}
                    locales={[koLocale]}
                    // events: [] // 로컬 이벤트 배열을 추가할 수 있음
                    // 아래 googleCalendar 관련 props는 키 발급 후 주석 해제해서 사용하세요
                    // googleCalendarApiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                    // events={{ googleCalendarId: 'ko.south_korea#holiday@group.v.calendar.google.com' }}
                    height="auto"
                    selectable={true}
                    dayMaxEvents={true}
                    // 날짜 클릭 등 상호작용 예시
                    dateClick={(info) => {
                        alert(`clicked on: ${info.dateStr}`);
                    }}
                />
            </Page>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <p
                    style={{
                        marginTop: 24,
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
import styled from 'styled-components';

const TOPBAR_HEIGHT = '64px';

const TopBar = styled.header`
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

const TopBarInner = styled.div`
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

const BarTitle = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #222;
    text-align: center;
`;

const CloseLink = styled(Link)`
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
// 달력 전역 스타일 오버라이드
const FullCalendarGlobalStyle = createGlobalStyle`
  /* 헤더 타이틀 크기/색상 */
  .fc .fc-toolbar-title {
    font-size: 18px;      /* 크기 조절 */
    font-weight: 700;
    color: #222;
    letter-spacing: -0.2px;
  }

  /* 모든 툴바 버튼 기본 스타일 (크기/패딩) */
  .fc .fc-button {
    padding: 6px 10px;    /* 버튼 크기 조절 */
    font-size: 12px;
    border-radius: 6px;
    border: 1px solid #e6e6e6;
    background: #fff;
    color: #333;
    height: 30px;

  }

  /* primary 계열(예: today 버튼) 색상 변경 */
  .fc .fc-button.fc-button-primary {
    background: #74787e;
    color: #fff;
    border-color: #74787e;
  }

  /* hover/active */
  .fc .fc-button:hover {
    filter: brightness(0.98);
  }

  /* prev/next 버튼만 크기 다르게 (선택자 우선순위로 타겟) */
  .fc .fc-prev-button, .fc .fc-next-button {
    width: 30px;
    height: 30px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* view 전환 버튼 (month/week/day) 그룹 스타일 */
  .fc .fc-dayGridMonth-button,
  .fc .fc-timeGridWeek-button,
  .fc .fc-timeGridDay-button {
    padding: 6px 12px;
    margin-left: 4px;
  }

  /* 툴바 전체 높이 조정 */
  .fc .fc-toolbar {
    gap: 4px;
  }
`;
