// src/pages/CalendarPage.tsx
import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import styled, { createGlobalStyle } from 'styled-components';
// import '@fullcalendar/timegrid/main.css'; // 필요 시 활성화
import { travelDates } from '../data/travelDates'; // 경로 확인

const backTo = '/SchedulePage';

/* ========== 유틸 & 안전한 날짜 처리 ========== */
// function pad2(n: number) {
//     return String(n).padStart(2, '0');
// }

// function normalizeToISO(
//     dateRaw: string,
//     defaultYear = '2025',
//     defaultMonth = '10',
// ) {
//     if (!dateRaw) return null;
//     if (/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) return dateRaw;
//     if (/^\d{1,2}$/.test(dateRaw)) {
//         const day = pad2(Number(dateRaw)); // 이제 pad2를 찾을 수 있어요! ✨
//         return `${defaultYear}-${defaultMonth}-${day}`;
//     }
//     const parsed = new Date(dateRaw);
//     if (!isNaN(parsed.getTime())) {
//         return parsed.toISOString().slice(0, 10);
//     }
//     return null;
// }

function addOneDayIso(isoDate: string) {
    const [y, m, d] = isoDate.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() + 1);
    return dt.toISOString().slice(0, 10);
}

/* ========== CalendarPage 컴포넌트 (로직 전부 포함) ========== */
export default function CalendarPage() {
    const navigate = useNavigate();

    /* allEvents: 일반 이벤트 + background 이벤트 생성 (className + classNames 모두 포함) */
    const allEvents = useMemo(() => {
        const ev: any[] = [];
        travelDates.forEach((t) => {
            const iso = normalizeToISO(t.date);
            if (!iso) {
                console.warn(
                    '[CalendarPage] invalid date format in travelDates item:',
                    t,
                );
                return;
            }

            // 일반 이벤트
            ev.push({
                id: t.id,
                title: t.content,
                start: iso,
                allDay: true,
                extendedProps: { type: t.type, lodging: t.lodging },
                className: `evt-${t.id}`,
                classNames: [`evt-${t.id}`],
            });

            // lodging background 이벤트 추가 (하루 단위)
            if (t.lodging) {
                const bgEnd = addOneDayIso(iso);
                ev.push({
                    id: `bg-${t.id}`,
                    start: iso,
                    end: bgEnd,
                    display: 'background',
                    className: `lodging-${t.lodging}`,
                    classNames: [`lodging-${t.lodging}`],
                });
            }
        });
        return ev;
    }, []);

    /* 날짜 -> id 맵(빠른 조회) */
    const dateToId = useMemo(() => {
        const map = new Map<string, string>();
        travelDates.forEach((t) => {
            const iso = normalizeToISO(t.date);
            if (iso) map.set(iso, t.id);
        });
        return map;
    }, []);

    /* 이벤트 클릭 -> /detail/:id */
    const handleEventClick = (clickInfo: any) => {
        const id = clickInfo?.event?.id;
        if (id) navigate(`/detail/${id}`);
    };

    /* 날짜 클릭 -> 우선 map에서 찾고, 없으면 dayN 패턴 또는 ?date= 로 이동 */
    // (필요시) vacation 범위 정의 (ISO 문자열 비교 가능)
    const VACATION_START = '2025-07-02';
    const VACATION_END = '2025-07-08';

    function isVacationIso(isoDate: string) {
        if (!isoDate) return false;
        return isoDate >= VACATION_START && isoDate <= VACATION_END;
    }

    /* 기존에 normalizeToISO(dateRaw) 함수가 있으면 그대로 쓰시고,
   없다면 아래 간단 구현을 같이 붙여넣으세요.
*/
    function pad2(n: number) {
        return String(n).padStart(2, '0');
    }
    function normalizeToISO(
        dateRaw: string,
        defaultYear = '2025',
        defaultMonth = '10',
    ) {
        if (!dateRaw) return null;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) return dateRaw;
        if (/^\d{1,2}$/.test(dateRaw))
            return `${defaultYear}-${defaultMonth}-${pad2(Number(dateRaw))}`;
        const parsed = new Date(dateRaw);
        if (!isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
        return null;
    }

    /* dateToId: 이미 useMemo로 만들어 둔 맵을 사용 (dateToId.get(iso) 형태) */
    // dateToId 예: Map { '2025-10-02' => 't-102', ... }

    /* 새 handleDateClick */
    const handleDateClick = (dateInfo: any) => {
        // dateInfo.dateStr 은 보통 "YYYY-MM-DD" 포맷입니다.
        const raw =
            dateInfo.dateStr ??
            (dateInfo.date &&
                dateInfo.date.toISOString &&
                dateInfo.date.toISOString().slice(0, 10));
        const iso = normalizeToISO(raw);
        if (!iso) {
            // 포맷 문제면 원래 alert로 처리 (안정화)
            alert(`clicked on: ${raw}`);
            return;
        }

        // 휴가 범위가 아닌 경우: 원래대로 alert만 띄움
        if (!isVacationIso(iso)) {
            alert(`clicked on: ${iso}`);
            return;
        }

        // 휴가 범위인 경우: 기존의 상세 이동 로직 실행
        const matchedId = dateToId.get(iso);
        if (matchedId) {
            navigate(`/detail/${matchedId}`);
            return;
        }

        // fallback: 2025-10-02~09 같은 dayN 패턴 처리가 필요하면 아래처럼
        const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m && m[1] === '2025' && m[2] === '10') {
            navigate(`/detail/day${Number(m[3])}`);
            return;
        }

        // 기본 fallback
        navigate(`/detail?date=${iso}`);
    };

    return (
        <>
            <FullCalendarGlobalStyle />
            <TopBar role="banner" aria-hidden={false}>
                <TopBarInner>
                    <BarTitle>상세 보기</BarTitle>
                    <CloseLink to={backTo} aria-label="닫기">
                        ×
                    </CloseLink>
                </TopBarInner>
            </TopBar>

            <Page>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate="2025-10-01"
                    headerToolbar={{
                        left: 'today',
                        center: 'title',
                        right: 'prev,next',
                    }}
                    locales={[koLocale]}
                    locale="ko"
                    events={allEvents}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                    height="auto"
                    selectable={true}
                    dayMaxEvents={true}
                />
            </Page>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
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

/* ========== 전역 스타일: FullCalendar + Lodging 스타일 병합 ========== */
const FullCalendarGlobalStyle = createGlobalStyle`
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
.fc .fc-bg-event.lodging-hotel,
.fc .fc-daygrid-day .fc-bg-event.lodging-hotel,
.fc .fc-event.lodging-hotel,
.fc .fc-daygrid-day-frame .lodging-hotel {
    background: linear-gradient(90deg,#fff4e6,#fff0f0) !important;
    border-color: #7a3b0026 !important;
    color: #7a3b00 !important;
}

.fc .fc-bg-event.lodging-camping,
.fc .fc-daygrid-day .fc-bg-event.lodging-camping,
.fc .fc-event.lodging-camping,
.fc .fc-daygrid-day-frame .lodging-camping {
    background: linear-gradient(90deg,#e6f7ff,#e0fff4) !important;
    border-color: #005b8a26 !important;
    color: #005b8a !important;
}

/* 이벤트 텍스트 가독성 보정 (필요 시 조정) */
.fc .fc-event, .fc .fc-event .fc-event-title {
    color: inherit !important;
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
.fc .fc-daygrid-body-natural .fc-daygrid-day-events {
    margin-bottom: 0;
}
`; /* ========== 기본 레이아웃(최소 스타일) ========== */
const Page = styled.div`
    padding: 20px;
    margin-top: 74px;
`;

/* TopBar 스타일(기존 파일과 병행 시 중복 주의) */
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
    max-width: 980px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
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
