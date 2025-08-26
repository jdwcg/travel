// src/types/TravelTypes.ts
export interface TravelItemType {
    id: string;
    date: string;
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    _id?: string;
    __v?: number;
}
