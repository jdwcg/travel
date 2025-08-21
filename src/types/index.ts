// src/types/index.ts (이 파일을 새로 만들고 아래 코드를 통째로 복사해서 붙여넣으세요!)

// 모든 Travel 관련 컴포넌트가 참조할 TravelItemType 정의
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

// 필요하다면 다른 공용 타입들도 여기에 추가할 수 있습니다.
// export interface MyOtherType { ... }
