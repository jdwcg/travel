import styled from 'styled-components';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    return <Header>{title}</Header>;
};

const Header = styled.h1`
    width: 100%;
    padding: 16px 0;
    margin: 0;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.large};
    font-weight: 700;
    color: ${({ theme }) => theme.colors.background};
    background-color: ${({ theme }) => theme.colors.primary};

    /* 상단 보더와 라운드 처리 */
    border-top: 4px solid ${({ theme }) => theme.colors.secondary};
    border-radius: 8px 8px 0 0;

    /* 그림자 효과로 입체감 추가 가능 (선택사항) */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export default PageHeader;
