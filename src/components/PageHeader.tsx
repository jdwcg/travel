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
    z-index: 2;
    height: 102px;
    width: 100%;
    background-color: #333;
`;

const Title = styled.h1`
    font-size: 15px;
    font-weight: 400;
    margin: 0;
    letter-spacing: -0.5px;
    color: #777;
    position: fixed;
    top: 24px;
`;

export default function PageHeader({ title }: { title: string }) {
    return (
        <Header>
            <Title>{title}</Title>
        </Header>
    );
}
