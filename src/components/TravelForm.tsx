// src/components/TravelForm.tsx
import React, { useState } from 'react';
import axios from 'axios';
import {
    FormContainer,
    FormField,
    Label,
    Input,
    Select,
    ButtonContainer,
    Button,
} from './TravelFormStyles'; // 스타일은 따로 분리해서 import

// 💡 TravelItemType은 SchedulePage와 공유하므로 인터페이스는 SchedulePage에서 import 가능하게
export interface TravelItemType {
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

interface AddTravelFormProps {
    onAdd: (newTravel: TravelItemType) => void;
    onCancel: () => void;
}

export default function TravelForm({ onAdd, onCancel }: AddTravelFormProps) {
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
    const [adminPassword, setAdminPassword] = useState('');

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
            alert('일정을 추가하려면 관리자 비밀번호를 입력해야 합니다.');
            return;
        }

        try {
            const response = await axios.post<TravelItemType>(
                'http://localhost:5000/api/traveldates',
                formData,
                { headers: { 'X-Admin-Password': adminPassword } },
            );
            alert('일정이 성공적으로 추가되었습니다!');
            onAdd(response.data);

            // 폼 초기화
            setFormData({
                id: '',
                date: '',
                day: '월',
                type: 'activity',
                content: '',
            });
            setAdminPassword('');
        } catch (error) {
            console.error('여행 일정 추가 실패:', error);
            if (axios.isAxiosError(error) && error.response) {
                if (error.response.status === 401) {
                    alert('일정 추가 실패: 잘못된 관리자 비밀번호입니다.');
                } else {
                    alert(
                        '일정 추가에 실패했습니다: ' +
                            (error.response.data.message || error.message),
                    );
                }
            } else {
                alert('일정 추가에 실패했습니다.');
            }
        }
    };

    return (
        <FormContainer>
            <h4 style={{ marginTop: 0 }}>새 여행 일정 추가</h4>
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
                        추가하기
                    </Button>
                    <Button type="button" onClick={onCancel}>
                        취소
                    </Button>
                </ButtonContainer>
            </form>
        </FormContainer>
    );
}
