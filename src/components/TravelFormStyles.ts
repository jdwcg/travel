// src/components/TravelFormStyles.ts
import styled from 'styled-components';

export const FormContainer = styled.div`
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 8px;
    background-color: #fcfcfc;
    margin-bottom: 24px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

export const FormField = styled.div`
    margin-bottom: 12px;
    display: flex;
    align-items: center;
`;

export const Label = styled.label`
    flex: 0 0 80px;
    font-weight: 600;
    color: #555;
    text-align: right;
    padding-right: 15px;
`;

export const Input = styled.input`
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    &:focus {
        outline: none;
        border-color: #5b9dff;
        box-shadow: 0 0 0 2px rgba(91, 157, 255, 0.2);
    }
`;

export const Select = styled.select`
    flex: 1;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: white;
    &:focus {
        outline: none;
        border-color: #5b9dff;
        box-shadow: 0 0 0 2px rgba(91, 157, 255, 0.2);
    }
`;

export const ButtonContainer = styled.div`
    margin-top: 20px;
    text-align: right;
`;

export const Button = styled.button<{ primary?: boolean }>`
    padding: 8px 14px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    background-color: ${(props) => (props.primary ? 'dodgerblue' : '#ccc')};
    color: ${(props) => (props.primary ? 'white' : '#333')};
    margin-left: 10px;
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => (props.primary ? 'dodgerblue' : '#bbb')};
    }
`;
