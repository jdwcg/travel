// src/types/ReservationTypes.ts
export interface ReservationItemType {
    id: string;
    date: string;
    title: string;
    contentType?: 'text' | 'html' | 'table';
    content?: string;
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    _id?: string;
    __v?: number;
}
