// src/components/PageHeader.tsx
import React from 'react';
import styled from 'styled-components';

const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
`;

const Title = styled.h1`
    font-size: 18px;
    margin: 0;
    color: #222;
`;

export default function PageHeader({ title }: { title: string }) {
    return (
        <Header>
            <Title>{title}</Title>
        </Header>
    );
}
