// src/data/reservations.ts
export type ReservationItem = {
    id: string;
    date: string;
    title: string;
    content: string;
};

export const reservations: ReservationItem[] = [
    {
        id: 'r1',
        date: '2025-07-02',
        title: '비행기표',
        content: '왕복 항공권 3인',
    },
    {
        id: 'r2',
        date: '2025-07-02',
        title: '호텔 예약',
        content: '제주도 호텔 3박',
    },
    {
        id: 'r3',
        date: '2025-07-02',
        title: '렌터카 예약',
        content: '제주도 렌터카 3일',
    },
];
