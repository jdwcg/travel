// src/components/Tabs.tsx
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const TabMenu = styled.nav`
    display: flex;
    margin: 22px 0 12px;
    position: fixed;
    width: calc(100% - 40px);
`;

const TabButton = styled(NavLink)`
    padding: 12px 20px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    text-decoration: none;
    color: #333;
    background: #f6f6f6;
    width: 100%;
    text-align: center;
    &.active {
        background: #222;
        color: #fff;
    }
`;

export default function Tabs() {
    return (
        <TabMenu aria-label="여행 탭">
            <TabButton to="/schedule">여행 일정</TabButton>
            <TabButton to="/reservation">예약 확인</TabButton>
        </TabMenu>
    );
}
