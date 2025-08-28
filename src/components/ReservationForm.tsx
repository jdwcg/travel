import { useState } from 'react';
import type { FormEvent } from 'react';
import type { ReservationItemType } from '../types/ReservationTypes';
import styled from 'styled-components';
import { BaseBtnWrap } from './CommonLayout';

interface ReservationFormProps {
    reservation?: ReservationItemType;
    onSubmit?: (data: ReservationItemType) => void;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export default function ReservationForm({
    reservation,
    onSubmit,
    onCancel,
}: ReservationFormProps) {
    const [title, setTitle] = useState(reservation?.title || '');
    const [date, setDate] = useState(reservation?.date || '');
    const [contentType, setContentType] = useState<
        ReservationItemType['contentType']
    >(reservation?.contentType || 'text');
    const [content, setContent] = useState(reservation?.content || '');
    const [headers, setHeaders] = useState<string[]>(
        reservation?.contentData?.headers || [],
    );
    const [rows, setRows] = useState<string[][]>(
        reservation?.contentData?.rows || [],
    );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const data: ReservationItemType = {
            id: reservation?.id || `r${Date.now()}`,
            title,
            date,
            contentType,
            content: contentType === 'text' ? content : undefined,
            contentData:
                contentType === 'table' ? { headers, rows } : undefined,
        };

        onSubmit?.(data);
    };

    return (
        <FormWrapper onSubmit={handleSubmit}>
            <label>
                제목:
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </label>
            <label>
                날짜:
                <input value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label>
                타입:
                <select
                    value={contentType}
                    onChange={(e) =>
                        setContentType(
                            e.target
                                .value as ReservationItemType['contentType'],
                        )
                    }
                >
                    <option value="text">텍스트</option>
                    <option value="table">테이블</option>
                </select>
            </label>

            {contentType === 'text' && (
                <label>
                    내용:
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </label>
            )}

            {contentType === 'table' && (
                <>
                    <p>테이블 헤더 (쉼표로 구분):</p>
                    <input
                        value={headers.join(',')}
                        onChange={(e) => setHeaders(e.target.value.split(','))}
                    />
                    <p>테이블 행 (세미콜론으로 구분, 각 행은 쉼표로 구분):</p>
                    <textarea
                        value={rows.map((r) => r.join(',')).join(';')}
                        onChange={(e) =>
                            setRows(
                                e.target.value
                                    .split(';')
                                    .map((row) => row.split(',')),
                            )
                        }
                    />
                </>
            )}

            <ButtonGroup>
                <BaseBtnWrap>
                    <button type="submit">저장</button>
                </BaseBtnWrap>
                <BaseBtnWrap>
                    <button type="button" onClick={onCancel}>
                        닫기
                    </button>
                </BaseBtnWrap>
            </ButtonGroup>
        </FormWrapper>
    );
}

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    gap: 12px;
    input,
    select,
    textarea {
        width: 100%;
        padding: 6px 8px;
    }
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`;
