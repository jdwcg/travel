// src/pages/CalendarPage.tsx
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { EventInput } from '@fullcalendar/core';
import koLocale from '@fullcalendar/core/locales/ko';

import { useNavigate } from 'react-router-dom';

// 👉 분리한 스타일 불러오기
import {
    FullCalendarGlobalStyle,
    TopBar,
    TopBarInner,
    BarTitle,
    CloseLink,
    Page,
} from '../styles/CalendarStyles';

interface TravelItemType {
    id: string;
    date: string;
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: { headers?: string[]; rows?: string[][] };
    _id?: string;
    __v?: number;
}

export default function CalendarPage() {
    const navigate = useNavigate();
    const [travelDates, setTravelDates] = useState<TravelItemType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const allEvents: EventInput[] = useMemo(() => {
        return travelDates.map((item) => {
            const fullDate = `2025-10-${String(item.date).padStart(2, '0')}`;
            return {
                id: item.id,
                title: `${item.day}일차: ${item.content}`,
                date: fullDate,
                extendedProps: { originalData: item },
                classNames: item.lodging ? [`lodging-${item.lodging}`] : [],
            };
        });
    }, [travelDates]);

    useEffect(() => {
        const fetchTravelDates = async () => {
            try {
                setLoading(true);
                const response = await axios.get<TravelItemType[]>(
                    'http://localhost:5000/api/travelDates',
                );
                setTravelDates(response.data);
            } catch (err) {
                setError('캘린더 이벤트를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchTravelDates();
    }, []);

    const handleEventClick = (clickInfo: {
        event: { extendedProps: { originalData: TravelItemType } };
    }) => {
        const originalData = clickInfo.event.extendedProps.originalData;
        if (originalData?.id) {
            navigate(`/detail/travel/${originalData.id}`);
        }
    };

    const handleDateClick = (info: DateClickArg) => {
        const iso = info.dateStr;
        const m = iso.match(/(\d{4})-(\d{2})-(\d{2})/);
        if (m && m[1] === '2025' && m[2] === '10') {
            const dayNum = Number(m[3]);
            const itemId = `day${dayNum}`;
            const existingItem = travelDates.find((item) => item.id === itemId);
            if (existingItem) navigate(`/detail/travel/${itemId}`);
            else alert(`${dayNum}일에는 등록된 일정이 없습니다.`);
        }
    };

    if (loading) return <p>캘린더 데이터를 불러오는 중...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <FullCalendarGlobalStyle />

            {/* 상단 바 */}
            <TopBar>
                <TopBarInner>
                    <BarTitle>10월 제주 여행 캘린더</BarTitle>
                    <CloseLink to="/schedule">×</CloseLink>
                </TopBarInner>
            </TopBar>

            {/* 캘린더 */}
            <Page>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    initialDate="2025-10-01"
                    headerToolbar={{
                        left: 'today', // ← 좌상단 "오늘" 버튼
                        center: 'title', // ← 중앙에 제목
                        right: 'prev,next', // ← 우상단 이전/다음 월 버튼
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
        </>
    );
}
