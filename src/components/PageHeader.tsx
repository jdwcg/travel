// src/components/PageHeader.tsx
import styled from 'styled-components';

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    margin-top: 12px;
`;

const Title = styled.h1`
    font-size: 15px;
    margin: 0;
    color: green;
`;

export default function PageHeader({ title }: { title: string }) {
    return (
        <Header>
            <Title>{title}</Title>
        </Header>
    );
}
