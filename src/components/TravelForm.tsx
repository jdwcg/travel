// src/components/TravelForm.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// ✨ TravelItemType 정의 ✨ (SchedulePage.tsx나 DetailPage.tsx와 동일해야 합니다!)
interface TravelItemType {
    id: string;
    date: string;
    day: '월' | '화' | '수' | '목' | '금' | '토' | '일';
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    _id?: string;
    __v?: number;
}

// ✨ TravelForm Props 정의 ✨
interface TravelFormProps {
    initialData?: TravelItemType; // 수정 시 초기 데이터 (선택 사항)
    onSave: (savedTravel: TravelItemType) => void; // 저장 성공 시 호출될 콜백
    onCancel: () => void; // 취소 버튼 클릭 시 호출될 콜백
    isEditMode: boolean; // 수정 모드인지 (true) 추가 모드인지 (false) 구분
}

const TravelForm: React.FC<TravelFormProps> = ({
    initialData,
    onSave,
    onCancel,
    isEditMode,
}) => {
    // 폼 데이터 상태
    const [formData, setFormData] = useState<
        Omit<
            TravelItemType,
            '_id' | '__v' | 'contentData' | 'contentType' | 'lodging'
        >
    >({
        id: '',
        date: '',
        day: '월',
        type: 'activity',
        content: '',
    });
    const [adminPassword, setAdminPassword] = useState(''); // 비밀번호 상태

    // 수정 모드일 때 초기 데이터로 폼 채우기
    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                id: initialData.id,
                date: initialData.date,
                day: initialData.day,
                type: initialData.type,
                content: initialData.content,
            });
            // 수정 모드일 때 id는 수정 불가능하도록 막을 수 있어요 (옵션)
            // 예를 들어, Input 컴포넌트에 disabled={isEditMode} 속성 추가
        } else {
            // 추가 모드일 때는 폼 초기화
            setFormData({
                id: '',
                date: '',
                day: '월',
                type: 'activity',
                content: '',
            });
        }
    }, [isEditMode, initialData]); // isEditMode 또는 initialData가 변경될 때마다 실행

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAdminPassword(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 필수 필드 유효성 검사
        if (
            !formData.id ||
            !formData.date ||
            !formData.day ||
            !formData.type ||
            !formData.content
        ) {
            alert('모든 필수 정보를 입력해주세요.');
            return;
        }

        if (!adminPassword) {
            alert(
                '일정을 ' +
                    (isEditMode ? '수정' : '추가') +
                    '하려면 관리자 비밀번호를 입력해야 합니다.',
            );
            return;
        }

        try {
            let response;
            if (isEditMode) {
                // 수정 모드: PUT 요청
                response = await axios.put<TravelItemType>(
                    `http://localhost:5000/api/traveldates/${formData.id}`,
                    formData,
                    {
                        headers: { 'X-Admin-Password': adminPassword },
                    },
                );
                alert('일정이 성공적으로 수정되었습니다!');
            } else {
                // 추가 모드: POST 요청
                response = await axios.post<TravelItemType>(
                    'http://localhost:5000/api/traveldates',
                    formData,
                    {
                        headers: { 'X-Admin-Password': adminPassword },
                    },
                );
                alert('일정이 성공적으로 추가되었습니다!');
            }

            onSave(response.data); // 저장 성공 시 콜백 호출
            setAdminPassword(''); // 비밀번호 초기화
        } catch (error) {
            console.error(
                '여행 일정 ' + (isEditMode ? '수정' : '추가') + ' 실패:',
                error,
            );
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data.message || error.message;
                if (error.response.status === 401) {
                    alert(
                        '일정 ' +
                            (isEditMode ? '수정' : '추가') +
                            ' 실패: 잘못된 관리자 비밀번호입니다.',
                    );
                } else if (error.response.status === 409) {
                    alert('일정 추가 실패: ' + errorMessage); // ID 중복 등의 오류
                } else {
                    alert(
                        '일정 ' +
                            (isEditMode ? '수정' : '추가') +
                            ' 실패: ' +
                            errorMessage,
                    );
                }
            } else {
                alert(
                    '일정 ' + (isEditMode ? '수정' : '추가') + ' 실패했습니다.',
                );
            }
        }
    };

    return (
        <FormContainer>
            <h4 style={{ marginTop: 0 }}>
                {isEditMode ? '여행 일정 수정' : '새 여행 일정 추가'}
            </h4>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <Label htmlFor="id">ID:</Label>
                    <Input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="day1, day2 처럼 고유한 ID"
                        required
                        disabled={isEditMode} // 수정 모드일 때는 ID 수정 불가
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="date">날짜 (일):</Label>
                    <Input
                        type="text"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        placeholder="예: 1 (일자만)"
                        required
                    />
                </FormField>
                <FormField>
                    <Label htmlFor="day">요일:</Label>
                    <Select
                        id="day"
                        name="day"
                        value={formData.day}
                        onChange={handleChange}
                        required
                    >
                        <option value="월">월</option>
                        <option value="화">화</option>
                        <option value="수">수</option>
                        <option value="목">목</option>
                        <option value="금">금</option>
                        <option value="토">토</option>
                        <option value="일">일</option>
                    </Select>
                </FormField>
                <FormField>
                    <Label htmlFor="type">유형:</Label>
                    <Select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                    >
                        <option value="activity">활동 🎒</option>
                        <option value="camping">캠핑 🏕️</option>
                        <option value="hotel">호텔 🏨</option>
                        <option value="food">음식 🍽️</option>
                    </Select>
                </FormField>
                <FormField>
                    <Label htmlFor="content">내용:</Label>
                    <Input
                        type="text"
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="예: 제주도 도착"
                        required
                    />
                </FormField>

                <FormField>
                    <Label htmlFor="adminPassword">비밀번호:</Label>
                    <Input
                        type="password"
                        id="adminPassword"
                        name="adminPassword"
                        value={adminPassword}
                        onChange={handlePasswordChange}
                        placeholder="관리자 비밀번호"
                        required
                    />
                </FormField>

                <ButtonContainer>
                    <Button type="submit" primary>
                        {isEditMode ? '수정하기' : '추가하기'}
                    </Button>
                    <Button type="button" onClick={onCancel}>
                        취소
                    </Button>
                </ButtonContainer>
            </form>
        </FormContainer>
    );
};

export default TravelForm; // ✨ 컴포넌트 내보내기

// ✨ TravelForm 전용 Styled-components (SchedulePage.tsx에서 옮겨온 것) ✨
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
    label {
        flex: 0 0 80px;
        font-weight: 600;
        color: #555;
    }
    input,
    select {
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
    }
`;

export const ButtonContainer = styled.div`
    margin-top: 20px;
    text-align: right;
`;

export const Button = styled.button<{ primary?: boolean }>`
    padding: 10px 18px;
    border: none;
    border-radius: 5px;
    font-size: 15px;
    cursor: pointer;
    background-color: ${(props) => (props.primary ? '#5b9dff' : '#ccc')};
    color: ${(props) => (props.primary ? 'white' : '#333')};
    margin-left: 10px;
    transition: background-color 0.2s ease-in-out;
    &:hover {
        background-color: ${(props) => (props.primary ? '#4a8ee0' : '#bbb')};
    }
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
