// src/components/ReservationForm.tsx
import { useState } from 'react';
import styled from 'styled-components';
import type { ReservationItemType } from '../types/ItemTypes';
import axios from 'axios';

interface ReservationFormProps {
    initialData?: ReservationItemType;
    adminPassword: string;
    onCancel: () => void;
    onSuccess: (updatedItem: ReservationItemType) => void;
}

export default function ReservationForm({
    initialData,
    adminPassword,
    onCancel,
    onSuccess,
}: ReservationFormProps) {
    const [form, setForm] = useState<ReservationItemType>({
        id: initialData?.id || '',
        date: initialData?.date || '',
        title: initialData?.title || '',
        content: initialData?.content || '',
        contentType: initialData?.contentType || 'text',
        contentData: initialData?.contentData || { headers: [], rows: [] },
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                // 수정
                const res = await axios.put(
                    `http://localhost:5000/api/reservations/${form.id}`,
                    form,
                    {
                        headers: { 'x-admin-password': adminPassword },
                    },
                );
                onSuccess(res.data);
            } else {
                // 신규
                const res = await axios.post(
                    `http://localhost:5000/api/reservations`,
                    form,
                    {
                        headers: { 'x-admin-password': adminPassword },
                    },
                );
                onSuccess(res.data);
            }
        } catch (err) {
            console.error('저장 실패:', err);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <FormWrap onSubmit={handleSubmit}>
            <FormRow>
                <label>날짜</label>
                <input
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                />
            </FormRow>

            <FormRow>
                <label>제목</label>
                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
            </FormRow>

            <FormRow>
                <label>내용 타입</label>
                <select
                    name="contentType"
                    value={form.contentType}
                    onChange={handleChange}
                >
                    <option value="text">Text</option>
                    <option value="html">HTML</option>
                    <option value="table">Table</option>
                </select>
            </FormRow>

            <FormRow>
                <label>내용</label>
                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={3}
                />
            </FormRow>

            {/* table일 경우 headers/rows 추가 UI 필요시 확장 가능 */}

            <FormButtons>
                <button type="submit">저장</button>
                <button type="button" onClick={onCancel}>
                    취소
                </button>
            </FormButtons>
        </FormWrap>
    );
}

// =================================================
// Styled Components
// =================================================
const FormWrap = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const FormRow = styled.div`
    display: flex;
    flex-direction: column;

    label {
        font-weight: 600;
        margin-bottom: 4px;
    }

    input,
    select,
    textarea {
        padding: 6px 8px;
        font-size: 14px;
        border: 1px solid #ddd;
        border-radius: 4px;
    }
`;

const FormButtons = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 12px;

    button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        &:first-child {
            background: #0077ff;
            color: #fff;
        }
        &:last-child {
            background: #eee;
        }
    }
`;
