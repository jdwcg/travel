// src/pages/CalendarPage.tsx
import { useState, useEffect, useMemo } from "react";
import axiosClient from "../api/axiosClient";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DateClickArg } from "@fullcalendar/interaction";
import type { EventInput } from "@fullcalendar/core";
import koLocale from "@fullcalendar/core/locales/ko";
import type { EventClickArg } from "@fullcalendar/core";
import { useNavigate } from "react-router-dom";

// 👉 분리한 스타일 불러오기
import {
  FullCalendarGlobalStyle,
  TopBar,
  TopBarInner,
  BarTitle,
  CloseLink,
  Page,
} from "../styles/CalendarStyles";

interface TravelItemType {
  id: string;
  date: string; // ⭐ 이 date 필드가 'YYYY-MM-DD' 형식이라고 전제합니다!
  day: "월" | "화" | "수" | "목" | "금" | "토" | "일";
  type: "camping" | "hotel" | "activity" | "food";
  content: string;
  lodging?: "camping" | "hotel";
  contentType?: "text" | "html" | "table";
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
      // ⭐ 이전에 `padStart` 사용했던 부분을 `item.date`를 그대로 사용하도록 변경했습니다.
      const fullDate = item.date;
      return {
        id: item.id,
        title: `${item.day}일차: ${item.content}`,
        date: fullDate,
        extendedProps: { originalData: item },
        classNames: item.lodging ? [`lodging-event-${item.lodging}`] : [],
      };
    });
  }, [travelDates]);

  // ⭐ 이전에 `padStart` 사용했던 부분을 `item.date`를 그대로 사용하도록 변경했습니다.
  const dayLodgingMap = useMemo(() => {
    const map = new Map<string, "camping" | "hotel">();
    travelDates.forEach((item) => {
      // 캘린더 날짜 형식과 일치하게 'YYYY-MM-DD' 형태로 변환 (2025년 10월로 고정)
      const fullDate = item.date;
      if (item.lodging) {
        map.set(fullDate, item.lodging);
      }
    });
    return map;
  }, [travelDates]);

  useEffect(() => {
    const fetchTravelDates = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get<TravelItemType[]>(
          "/api/travelDates"
        );
        setTravelDates(response.data);
      } catch (err) {
        setError("캘린더 이벤트를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchTravelDates();
  }, []);

  const handleEventClick = (arg: EventClickArg) => {
    const originalData = (
      arg.event.extendedProps as { originalData: TravelItemType }
    ).originalData;

    if (originalData?.id) {
      navigate(`/detail/travel/${originalData.id}`);
    }
  };

  const handleDateClick = (info: DateClickArg) => {
    const iso = info.dateStr;
    const m = iso.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (m && m[1] === "2025" && m[2] === "10") {
      const dayNum = Number(m[3]);
      const itemId = `day${dayNum}`;
      const existingItem = travelDates.find((item) => item.id === itemId);
      if (existingItem) navigate(`/detail/travel/${itemId}`);
      else alert(`${dayNum}일에는 등록된 일정이 없습니다.`);
    }
  };

  if (loading) return <p>캘린더 데이터를 불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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
            left: "today", // ← 좌상단 "오늘" 버튼
            center: "title", // ← 중앙에 제목
            right: "prev,next", // ← 우상단 이전/다음 월 버튼
          }}
          locales={[koLocale]}
          locale="ko"
          events={allEvents}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="auto"
          selectable={true}
          dayMaxEvents={true}
          // ⭐ `dayCellClassNames`는 이전에 드렸던 코드 그대로 사용합니다.
          // 여기서 `dateString`을 `dayLodgingMap`의 키(`YYYY-MM-DD`)와 맞추는 것이 중요합니다.
          dayCellClassNames={(arg) => {
            const dateString = arg.date.toISOString().split("T")[0]; // '2025-10-03' 형식으로 날짜 추출
            const lodgingType = dayLodgingMap.get(dateString); // 해당 날짜의 숙소 유형 확인

            if (lodgingType === "camping") {
              return ["day-has-camping"]; // 'camping' 숙소가 있는 날짜 칸에 클래스 추가
            } else if (lodgingType === "hotel") {
              return ["day-has-hotel"]; // 'hotel' 숙소가 있는 날짜 칸에 클래스 추가
            }
            return []; // 숙소가 없으면 클래스 추가 안 함
          }}
        />
      </Page>
    </>
  );
}
