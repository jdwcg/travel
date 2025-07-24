import styled from 'styled-components';

interface PageHeaderProps {
    title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
    return <Header>{title}</Header>;
};

const Header = styled.h1`
    width: 100%;
    padding: 12px 0;
    margin: 0;
    text-align: center;
    font-size: ${({ theme }) => theme.fontSizes.small};
    font-weight: 500;
    color: ${({ theme }) => theme.colors.background};
    background-color: #444;
`;

export default PageHeader;
