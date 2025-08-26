// src/components/TravelForm.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { TravelItemType } from '../types/TravelTypes';

interface TravelFormProps {
    travelItem?: TravelItemType; // 수정 시 기존 데이터, 신규일 땐 undefined
}

export default function TravelForm({ travelItem }: TravelFormProps) {
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

    // 기존 데이터 반영
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

    // table data 변경 핸들러 예시
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

    // submit 핸들러
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const password = prompt('관리자 비밀번호 입력');
        if (password !== '6948') return alert('비밀번호 불일치!');

        try {
            const submitData = { ...formData };

            // 신규인 경우 id 생성
            if (!submitData.id) submitData.id = Date.now().toString();

            if (travelItem?.id) {
                // 수정
                await axios.put(
                    `http://localhost:5000/api/travelDates/${submitData.id}`,
                    submitData,
                    { headers: { 'x-admin-password': password } },
                );
                alert('수정 완료!');
            } else {
                // 신규
                await axios.post(
                    `http://localhost:5000/api/travelDates`,
                    submitData,
                    { headers: { 'x-admin-password': password } },
                );
                alert('추가 완료!');
            }

            navigate(`/detail/travel/${submitData.id}`);
        } catch (err: any) {
            console.error('저장 실패:', err.response || err);
            alert(`저장 실패! ${err.response?.data?.message || err.message}`);
        }
    };

    // 취소 버튼 핸들러
    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxWidth: '400px',
                margin: '0 auto',
            }}
        >
            <div>
                <label>ID:</label>
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    readOnly
                    placeholder="자동 생성됩니다"
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
                    placeholder="예: camping, hotel, activity, food"
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
                    placeholder="일정 내용을 입력하세요"
                    style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        minHeight: '80px',
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

            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button
                    type="submit"
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        background: '#4caf50',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    저장
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        background: '#f44336',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    취소
                </button>
            </div>
        </form>
    );
}
