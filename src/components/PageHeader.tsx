// src/components/PageHeader.tsx
import styled from 'styled-components';

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    position: fixed;
    top: 0;
    left: 0;
    height: 34px;
    width: 100%;
    background-color: #e1ebee;
`;

const Title = styled.h1`
    font-size: 13px;
    font-weight: regular;
    margin: 0;
    letter-spacing: -0.5px;
    color: #7f8e92;
`;

export default function PageHeader({ title }: { title: string }) {
    return (
        <Header>
            <Title>{title}</Title>
        </Header>
    );
}
