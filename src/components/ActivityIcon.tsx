// src/components/ActivityIcon.tsx
import React from 'react';
import styled from 'styled-components';

interface ActivityIconProps {
    type: string;
}

const IconWrapper = styled.span`
    margin-right: 6px;
    font-size: 1.1em; /* 아이콘 크기 조절 */
    vertical-align: middle; /* 텍스트와 세로 정렬 */
`;

const ActivityIcon: React.FC<ActivityIconProps> = ({ type }) => {
    let icon: string = '📍'; // 기본 아이콘 (핀)

    switch (type) {
        case 'plane':
            icon = '✈️'; // 비행기
            break;
        case 'car':
            icon = '🚗'; // 자동차
            break;
        case 'flower':
            icon = '🌸'; // 꽃 (카멜리아힐)
            break;
        case 'camping':
            icon = '🏕️'; // 캠핑 텐트
            break;
        case 'city':
            icon = '🏙️'; // 도시 (제주 시내)
            break;
        case 'beach':
            icon = '🏖️'; // 해변
            break;
        case 'market':
            icon = '🛍️'; // 시장
            break;
        case 'home':
            icon = '🏡'; // 집
            break;
        // 필요한 만큼 더 추가할 수 있어요
    }
    return (
        <IconWrapper role="img" aria-label={type}>
            {icon}
        </IconWrapper>
    );
};

export default ActivityIcon;
