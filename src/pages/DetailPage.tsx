// src/pages/DetailPage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TravelForm from '../components/TravelForm';
import styled from 'styled-components';
import { Container, BaseBtnWrap } from '../components/CommonLayout';
import type { Item, TravelItemType } from '../types/ItemTypes';

export default function ItemDetailPage() {
    const { itemType, id } = useParams<{ itemType: string; id: string }>();
    const navigate = useNavigate();

    const [item, setItem] = useState<Item | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false); // ✨ 수정 모드 상태

    // 데이터 fetch
    useEffect(() => {
        const fetchItem = async () => {
            if (!id || !itemType) return setError('아이템 정보가 없습니다.');
            setLoading(true);
            try {
                const endpoint =
                    itemType === 'travel' ? 'travelDates' : 'reservations';
                const res = await axios.get<Item>(
                    `http://localhost:5000/api/${endpoint}/${id}`,
                );
                setItem({ ...res.data, kind: itemType });
                console.log('아이템 불러오기:', res.data);
            } catch (err: any) {
                console.error('데이터 fetch 실패:', err.response || err);
                setError(err.response?.data?.message || '불러오기 실패');
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id, itemType]);

    if (loading) return <Container>데이터 로딩 중...</Container>;
    if (error) return <Container style={{ color: 'red' }}>{error}</Container>;
    if (!item) return <Container>해당 항목을 찾을 수 없습니다.</Container>;

    // 삭제 처리
    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        const password = prompt('관리자 비밀번호 입력');
        if (password !== '6948') return alert('비밀번호 불일치!');
        try {
            await axios.delete(
                `http://localhost:5000/api/travelDates/${item.id}`,
                {
                    headers: { 'x-admin-password': password },
                },
            );
            alert('삭제 완료!');
            navigate('/schedule');
        } catch (err: any) {
            console.error('삭제 실패:', err.response || err);
            alert(`삭제 실패! ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <Container>
            {!editing ? (
                <>
                    <h3>
                        {itemType === 'travel'
                            ? `${item.date}일째 여행`
                            : item.id}
                    </h3>
                    <p>{(item as TravelItemType).content}</p>

                    <ButtonsWrap>
                        <BaseBtnWrap>
                            <button onClick={() => setEditing(true)}>
                                수정
                            </button>
                        </BaseBtnWrap>
                        <BaseBtnWrap>
                            <button onClick={handleDelete}>삭제</button>
                        </BaseBtnWrap>
                        <BaseBtnWrap>
                            <button onClick={() => navigate('/schedule')}>
                                닫기
                            </button>
                        </BaseBtnWrap>
                    </ButtonsWrap>
                </>
            ) : (
                <TravelForm travelItem={item as TravelItemType} />
            )}
        </Container>
    );
}

// ✨ 버튼 스타일 유지
const ButtonsWrap = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 20px;
`;
