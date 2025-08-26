// src/components/TravelForm.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import type { TravelItemType } from '../types/ItemTypes';

interface TravelFormProps {
    travelItem: TravelItemType; // 기존 데이터 전달
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

        console.log('서버로 전송할 데이터:', formData);

        try {
            const response = await axios.put(
                `http://localhost:5000/api/travelDates/${formData.id}`,
                formData,
                { headers: { 'x-admin-password': password } },
            );
            console.log('저장 성공:', response.data);
            alert('저장 완료!');
            navigate('/schedule'); // 목록으로 이동
        } catch (err: any) {
            console.error('저장 실패 에러:', err.response || err);
            alert(`저장 실패! ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>ID:</label>
                <input
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    readOnly
                />
            </div>

            <div>
                <label>날짜:</label>
                <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>요일:</label>
                <input
                    type="text"
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>활동 유형:</label>
                <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>내용:</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                />
            </div>

            <div>
                <label>숙소:</label>
                <select
                    name="lodging"
                    value={formData.lodging || ''}
                    onChange={handleChange}
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
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                )}

            <button type="submit">저장</button>
            <button type="button" onClick={() => navigate('/schedule')}>
                취소
            </button>
        </form>
    );
}
