// src/data/travelDates.ts
export type TravelItem = {
    id: string;
    date: string; // ISO: 'YYYY-MM-DD'
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
};

export const travelDates: TravelItem[] = [
    {
        id: 'day1',
        date: '1',
        day: '화',
        type: 'activity',
        content: '여행 준비 및 짐 싸기',
    },
    {
        id: 'day2',
        date: '2',
        day: '수',
        type: 'hotel',
        lodging: 'hotel',
        content: '제주도 도착 및 호텔(난타제주) 체크인',
    },
    {
        id: 'day3',
        date: '3',
        day: '목',
        type: 'camping',
        lodging: 'camping',
        content: '제주올레캠핑장 체크인(자리 12번)',
    },
    {
        id: 'day4',
        date: '4',
        day: '금',
        type: 'camping',
        lodging: 'camping',
        content: '캠핑장에서 바비큐 및 주변 산책',
    },
    {
        id: 'day5',
        date: '5',
        day: '토',
        type: 'camping',
        lodging: 'camping',
        content: '현지 맛집 브런치 및 자유 일정',
    },
    {
        id: 'day6',
        date: '6',
        day: '일',
        type: 'camping',
        lodging: 'camping',
        content: '해변 캠핑 및 근교 드라이브',
    },
    {
        id: 'day7',
        date: '7',
        day: '월',
        type: 'camping',
        lodging: 'camping',
        content: '근교 관광 및 캠핑 정리',
    },
    {
        id: 'day8',
        date: '8',
        day: '화',
        type: 'hotel',
        lodging: 'hotel',
        content: '캠핑장 체크아웃 / 완도(루미아 호텔) 체크인',
    },
    {
        id: 'day9',
        date: '9',
        day: '수',
        type: 'activity',
        content: '귀가 준비 및 안전운전',
    },
    {
        id: 'day10',
        date: '10',
        day: '목',
        type: 'activity',
        content: '남은 휴가',
    },
];
