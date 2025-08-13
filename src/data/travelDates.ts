// src/data/travelDates.ts
export type TravelItem = {
    id: string;
    date: string; // 예: "2025-07-01" 또는 "7/01" (프로젝트 규칙으로 통일 권장)
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
};

export const travelDates: TravelItem[] = [
    {
        id: 'day1',
        day: '수',
        date: 1,
        lodging: undefined,
        content: '여행준비 짐싸기',
        type: 'plane',
    },
    {
        id: 'day2',
        day: '목',
        date: 2,
        lodging: 'hotel',
        content: '제주도(호텔난타제주) 체크인',
        type: 'hotel',
    },
    {
        id: 'day3',
        day: '금',
        date: 3,
        lodging: 'camping',
        content: '제주올레캠핑장 체크인(자리 12번)',
        type: 'camping',
    },
    {
        id: 'day4',
        day: '토',
        date: 4,
        lodging: 'camping',
        content: '제주도에서 할일 적기',
        type: 'camping',
    },
    {
        id: 'day5',
        day: '일',
        date: 5,
        lodging: 'camping',
        content: '제주도에서 할일 적기',
        type: 'camping',
    }, // content 중복 확인하여 수정
    {
        id: 'day6',
        day: '월',
        date: 6,
        lodging: 'camping',
        content: '제주도에서 할일 적기',
        type: 'camping',
    },
    {
        id: 'day7',
        day: '화',
        date: 7,
        lodging: 'camping',
        content: '제주도에서 할일 적기',
        type: 'camping',
    },
    {
        id: 'day8',
        day: '수',
        date: 8,
        lodging: 'hotel',
        content: '캠핑장 체크아웃 / 완도(루미아 호텔) 체크인',
        type: 'hotel',
    },
    {
        id: 'day9',
        day: '목',
        date: 9,
        lodging: undefined,
        content: '집까지 안전운전',
        type: undefined,
    },
    {
        id: 'day10',
        day: '금',
        date: 10,
        lodging: undefined,
        content: '남은 휴가',
        type: undefined,
    },
];
