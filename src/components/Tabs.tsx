// src/components/Tabs.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const TabMenu = styled.nav`
    display: flex;
    gap: 8px;
    margin: 12px 0;
`;

const TabButton = styled(NavLink)`
    padding: 8px 12px;
    border-radius: 8px;
    text-decoration: none;
    color: #333;
    background: #f6f6f6;

    &.active {
        background: #222;
        color: #fff;
    }
`;

export default function Tabs() {
    return (
        <TabMenu aria-label="여행 탭">
            <TabButton to="/schedule">일정</TabButton>
            <TabButton to="/reservation">예약확인</TabButton>
        </TabMenu>
    );
}
