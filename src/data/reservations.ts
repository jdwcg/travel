// src/data/reservations.ts
export type ReservationItem = {
    id: string;
    date: string;
    title: string;
    // 기존 content는 유지(단순 텍스트 또는 HTML 문자열)
    content?: string;

    // 추가: 렌더링 타입 명시 (옵션)
    contentType?: 'text' | 'html' | 'table';

    // table 형식일 때 사용할 구조화된 데이터 (옵션)
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
};
export const reservations: ReservationItem[] = [
    {
        id: 'r1',
        date: '2025-10-02',
        title: '배표 예약(완도 → 제주)',
        contentType: 'table',
        contentData: {
            headers: ['항목', '내역'],
            rows: [
                ['주문번호', '202503250728087303'],
                ['경로', '완도 → 제주'],
                ['날짜', '10월 2일(목)'],
                ['선박명', '실버클라우드(1등침대4인실)'],
                ['인원', '3인'],
                ['운항시간', '15시(출발), 17시 40분(도착)'],
            ],
        },
    },

    {
        id: 'r3',
        date: '202510-02',
        title: '호텔 예약(난타제주)',
        contentType: 'table',
        contentData: {
            headers: ['항목', '내역'],
            rows: [
                ['예약번호', '1639097554'],
                ['투숙객명', 'daewoon cho'],
                ['숙소연락처', '8218776200'],
                ['체크인', '14시'],
                ['체크아웃', '11시'],
                ['객실종류', '디럭스 트윈'],
                ['결제금액', '132,012원'],
            ],
        },
    },
    {
        id: 'r4',
        date: '2025-10-03',
        title: '캠핑장 예약(제주올레캠핑장)',
        contentType: 'text',
        content: '제주올레캠핑장(자리 12번)',
    },
    {
        id: 'r2',
        date: '2025-10-08',
        title: '배표 예약(제주 → 완도)',
        contentType: 'table',
        contentData: {
            headers: ['항목', '내역'],
            rows: [
                ['주문번호', '202503250728087303'],
                ['경로', '제주 → 완도'],
                ['날짜', '10월 8일(수)'],
                ['선박명', '골드스텔라'],
                ['인원', '3인'],
                ['운항시간', '15시 30분(출발), 19시10분(도착)'],
            ],
        },
    },
    {
        id: 'r5',
        date: '2025-10-08',
        title: '호텔 예약(루미아호텔) ',
        contentType: 'table',
        contentData: {
            headers: ['항목', '내역'],
            rows: [
                ['예약번호', '1639080248'],
                ['투숙객명', 'daewoon cho'],
                ['숙소연락처', '82615541000'],
                ['체크인', '15시'],
                ['체크아웃', '11시'],
                ['객실종류', '디럭스 트윈'],
                ['결제금액', '132,012원'],
            ],
        },
    },
];
