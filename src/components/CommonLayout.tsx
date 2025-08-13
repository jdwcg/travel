// src/components/CommonLayout.tsx
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const COL_WIDTH_DAY = '56px';
export const COL_WIDTH_DATE = '42px';
// src/components/CommonLayout.tsx (추가할 부분)
export const ScheduleSection = styled.section`
    margin-top: 8px;
`;
export const Container = styled.main`
    width: 100%;
    max-width: 980px;
    margin: 0 auto;
    padding: 20px;
    box-sizing: border-box;
`;

/* Lodging tags */
export const LodgingTagsContainer = styled.div`
    margin: 12px 0 20px;
    display: flex;
    gap: 8px;
`;

export const LodgingTag = styled.span<{ type: 'camping' | 'hotel' }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 14px;
    cursor: default;
    ${({ type }) =>
        type === 'camping'
            ? css`
                  background: linear-gradient(90deg, #e6f7ff, #e0fff4);
                  color: #005b8a;
              `
            : css`
                  background: linear-gradient(90deg, #fff4e6, #fff0f0);
                  color: #7a3b00;
              `}
`;

/* Reservation */
export const ReservationSection = styled.section`
    margin-top: 20px;
    padding: 12px 0;

    & > p {
        color: #444;
        margin-bottom: 20px;
    }
`;

export const ReservationItem = styled.div`
    background-color: #f5f5f5;
    padding: 12px;
    margin-bottom: 10px;
    cursor: pointer;
    text-align: left;
    color: #333;
    &:hover {
        background-color: #ececec;
    }
`;

/* List / Table 스타일 */
export const ListWrapper = styled.div`
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #eee;
    background: #fff;
`;

export const ListHeader = styled.div`
    display: flex;
    align-items: center;
    background: #fafafa;
    padding: 12px 16px;
    font-weight: 600;
    border-bottom: 1px solid #f1f1f1;
`;

export const ListBody = styled.div``;

export const HeaderCell = styled.div<{ basis?: string }>`
    flex: 0 0 ${({ basis }) => basis || 'auto'};
    font-size: 13px;
    color: #666;
    padding: 0 8px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const HeaderContentCell = styled.div`
    flex: 1 1 auto;
    font-size: 13px;
    color: #666;
    padding-left: 8px;
`;

/* Styled link row */
export const StyledLink = styled(Link)<{ date?: string }>`
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 12px 16px;
    text-decoration: none;
    color: inherit;
    border-bottom: 1px solid #f5f5f5;
    transition: background 0.12s ease;
    background-color: ${({ date }) => (date ? 'transparent' : 'transparent')};

    &:hover {
        background: #fbfbff;
    }

    &:last-child {
        border-bottom: none;
    }
    &[data-lodging='hotel'] {
        background: linear-gradient(
            90deg,
            rgba(255, 244, 230, 0.6),
            rgba(255, 240, 240, 0.6)
        );
    }
    &[data-lodging='camping'] {
        background: linear-gradient(
            90deg,
            rgba(230, 247, 255, 0.6),
            rgba(224, 255, 244, 0.6)
        );
    }
`;

export const ItemCell = styled.div<{ basis?: string }>`
    flex: 0 0 ${({ basis }) => basis || 'auto'};
    font-size: 14px;
    color: #333;
    min-width: 0;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const ItemDateCell = styled(ItemCell)<{ isWeekend?: boolean }>`
    font-weight: 600;
    color: ${({ isWeekend }) => (isWeekend ? '#d9534f' : '#333')};
    justify-content: center;
    padding-left: 4px;
`;

export const ItemContentCell = styled(ItemCell)`
    flex: 1 1 auto;
    justify-content: flex-start;
    gap: 10px;
    min-width: 0;
`;

export const TextContent = styled.span`
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    min-width: 0;
`;

export const IconSpan = styled.span`
    font-size: 18px;
    line-height: 1;
    width: 22px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
`;
