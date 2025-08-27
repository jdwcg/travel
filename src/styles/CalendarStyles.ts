// src/styles/CalendarStyles.ts
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

export const FullCalendarGlobalStyle = createGlobalStyle`
  .fc .fc-toolbar-title {
    font-size: 18px;
    font-weight: 700;
  }
  .fc .fc-button {
    padding: 6px 10px;
    font-size: 12px;
    border-radius: 6px;
    background: #fff;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  .fc .fc-button.fc-today-button {
    background: #007bff;
    color: #fff;
    border-color: #007bff;
  }
  .fc .fc-button:hover {
    filter: brightness(0.95);
  }
  .fc-icon-chevron-left::before {
    color: silver;
  }
  .fc-icon-chevron-right::before {
    color: silver;
  }

`;

const TOPBAR_HEIGHT = '64px';

export const TopBar = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${TOPBAR_HEIGHT};
    background: #fff;
    border-bottom: 1px solid #eee;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const TopBarInner = styled.div`
    width: 100%;
    max-width: 980px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export const BarTitle = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #222;
`;

export const CloseLink = styled(Link)`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #333;
    background: #fff;
    border: 1px solid #eee;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    &:hover {
        background: #f6f6f6;
    }
`;

export const Page = styled.main`
    padding-top: ${TOPBAR_HEIGHT};
    min-height: calc(100vh - ${TOPBAR_HEIGHT});
    background: #fcfcfc;
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
    margin-top: 60px;
`;
