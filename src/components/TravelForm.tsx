// src/components/TravelForm.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { TravelItemType } from '../types/ItemTypes';

interface TravelFormProps {
    travelItem?: TravelItemType; // 수정 시 기존 데이터 전달
    onAdd?: (newItem: TravelItemType) => void; // 추가 성공 후 호출
    onCancel?: () => void;
}

export default function TravelForm({
    travelItem,
    onAdd,
    onCancel,
}: TravelFormProps) {
    const navigate = useNavigate();

    // form state 초기화
    const [formData, setFormData] = useState<TravelItemType>({
        id: '',
        date: '',
        day: '',
        type: '',
        content: '',
        lodging: undefined,
        contentType: 'text',
        contentData: { headers: [], rows: [] },
    });

    // 기존 데이터 반영 (수정용)
    useEffect(() => {
        if (travelItem) {
            setFormData(travelItem);
            console.log('기존 데이터 불러오기:', travelItem);
        }
    }, [travelItem]);

    // input 변경 핸들러
    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        console.log('변경된 값:', name, value);
    };

    // table data 변경 핸들러
    const handleTableCellChange = (
        rowIndex: number,
        colIndex: number,
        value: string,
    ) => {
        const newRows = formData.contentData?.rows
            ? [...formData.contentData.rows]
            : [];
        newRows[rowIndex][colIndex] = value;
        setFormData((prev) => ({
            ...prev,
            contentData: { ...prev.contentData, rows: newRows },
        }));
        console.log('테이블 변경:', newRows);
    };

    // submit 핸들러 (수정/추가 모두 처리)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const password = prompt('관리자 비밀번호 입력');
        if (password !== '6948') return alert('비밀번호 불일치!');

        console.log('서버로 전송할 데이터:', formData);

        try {
            let response;
            if (travelItem?.id) {
                // 수정
                response = await axios.put(
                    `http://localhost:5000/api/travelDates/${formData.id}`,
                    formData,
                    { headers: { 'x-admin-password': password } },
                );
            } else {
                // 신규 추가
                response = await axios.post(
                    `http://localhost:5000/api/travelDates`,
                    formData,
                    { headers: { 'x-admin-password': password } },
                );
            }

            alert('추가/수정 완료!');
            if (onAdd) onAdd(response.data); // SchedulePage에 전달
        } catch (err: any) {
            console.error(err.response || err);
            alert(`저장 실패! ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '500px',
                margin: '0 auto',
                padding: '12px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#f9f9f9',
            }}
        >
            <div>
                <label>ID:</label>
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    readOnly={!!travelItem}
                    placeholder="자동 생성"
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            <div>
                <label>날짜:</label>
                <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    placeholder="예: 2025-10-01"
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            <div>
                <label>요일:</label>
                <input
                    type="text"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    placeholder="예: 월"
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            <div>
                <label>활동 유형:</label>
                <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="예: camping / hotel / activity / food"
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            <div>
                <label>내용:</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="여행 내용 입력"
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        minHeight: '60px',
                    }}
                />
            </div>

            <div>
                <label>숙소:</label>
                <select
                    name="lodging"
                    value={formData.lodging || ''}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                    }}
                >
                    <option value="">선택</option>
                    <option value="camping">Camping</option>
                    <option value="hotel">Hotel</option>
                </select>
            </div>

            {/* table contentType일 경우 간단 예시 */}
            {formData.contentType === 'table' &&
                formData.contentData?.rows?.length > 0 && (
                    <div>
                        <h4>테이블 데이터</h4>
                        {formData.contentData.rows.map((row, rIdx) => (
                            <div
                                key={rIdx}
                                style={{ display: 'flex', gap: '4px' }}
                            >
                                {row.map((cell, cIdx) => (
                                    <input
                                        key={cIdx}
                                        value={cell}
                                        onChange={(e) =>
                                            handleTableCellChange(
                                                rIdx,
                                                cIdx,
                                                e.target.value,
                                            )
                                        }
                                        style={{
                                            flex: 1,
                                            padding: '4px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}

            <div style={{ display: 'flex', gap: '8px' }}>
                <button
                    type="submit"
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#4caf50',
                        color: '#fff',
                    }}
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#f44336',
                        color: '#fff',
                    }}
                >
                    취소
                </button>
            </div>
        </form>
    );
}
