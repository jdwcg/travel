// src/types/ItemTypes.ts
export interface BaseItem {
    id: string;
    _id?: string;
    __v?: number;
}

export interface ReservationItemType extends BaseItem {
    date: string;
    title: string;
    contentType?: 'text' | 'html' | 'table';
    content?: string;
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    kind: 'reservation';
}

export interface TravelItemType extends BaseItem {
    date: string;
    day: string;
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    kind: 'travel';
}

export type Item = ReservationItemType | TravelItemType;
