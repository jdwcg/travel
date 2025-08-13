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
        content: '휴가 시작! 여정의 설렘을 안고 떠나요!',
        type: 'plane',
    },
    {
        id: 'day2',
        day: '목',
        date: 2,
        lodging: 'hotel',
        content: '새벽 비행기 탑승 및 제주 도착, 렌터카 수령 후 서귀포 이동',
        type: 'hotel',
    },
    {
        id: 'day3',
        day: '금',
        date: 3,
        lodging: 'camping',
        content: '카멜리아힐 방문, 동백꽃 구경 및 사진 촬영. 점심은 전복 요리!',
        type: 'camping',
    },
    {
        id: 'day4',
        day: '토',
        date: 4,
        lodging: 'camping',
        content:
            '우도 배편 예약 및 관광, 땅콩 아이스크림 맛보기, 캠핑장 체크인',
        type: 'camping',
    },
    {
        id: 'day5',
        day: '일',
        date: 5,
        lodging: 'camping',
        content:
            '아침 일찍 캠핑장 주변 산책, 성산일출봉 등반 및 해안도로 드라이브',
        type: 'camping',
    }, // content 중복 확인하여 수정
    {
        id: 'day6',
        day: '월',
        date: 6,
        lodging: 'camping',
        content:
            '제주 시내 자유시간, 동문시장 구경 및 기념품 구매, 흑돼지 저녁 식사',
        type: 'camping',
    },
    {
        id: 'day7',
        day: '화',
        date: 7,
        lodging: 'camping',
        content:
            '협재 해변 방문, 에메랄드 빛 바다 감상. 근처 카페에서 휴식 즐기기',
        type: 'camping',
    },
    {
        id: 'day8',
        day: '수',
        date: 8,
        lodging: 'hotel',
        content:
            '서귀포 매일올레시장 방문, 신선한 해산물 구경. 올레길 일부 구간 산책',
        type: 'hotel',
    },
    {
        id: 'day9',
        day: '목',
        date: 9,
        lodging: undefined,
        content: '오전에 여유롭게 브런치, 오후 비행기로 집으로 귀환',
        type: undefined,
    },
    {
        id: 'day10',
        day: '금',
        date: 10,
        lodging: undefined,
        content: '남은 휴가 정리 및 여행 추억 되새기기',
        type: undefined,
    },
];
