// src/pages/DetailPage.tsx (이제 TravelDetailPage.tsx로 파일 이름도 바꾸는 것을 추천해요!)
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TravelForm from '../components/TravelForm';
import styled from 'styled-components';
import { Container, BaseBtnWrap } from '../components/CommonLayout';
// TravelItemType만 불러오면 돼요! Item은 더 이상 필요 없을 거예요.
import type { TravelItemType } from '../types/ItemTypes';

export default function TravelDetailPage() {
    // ✨ itemType은 더 이상 필요 없어요! 라우팅에서 이미 'travel'로 특정될 테니까요!
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // ✨ item 상태의 타입도 TravelItemType으로 명확하게 지정해요!
    const [item, setItem] = useState<TravelItemType | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false); // 수정 모드 상태

    // 데이터 fetch - 이제 travelDates만 신경 쓰면 돼요!
    useEffect(() => {
        const fetchItem = async () => {
            // ✨ id만 검사하면 돼요!
            if (!id) return setError('여행 일정 정보가 없습니다.');
            setLoading(true);
            try {
                // ✨ endpoint를 'travelDates'로 고정!
                const endpoint = 'travelDates';
                // ✨ axios.get<TravelItemType>으로 명확히!
                const res = await axios.get<TravelItemType>(
                    `http://localhost:5000/api/${endpoint}/${id}`,
                );
                // ✨ setItem({ ...res.data, kind: itemType }); 이거 삭제!
                setItem(res.data);
                console.log('여행 일정 아이템 불러오기:', res.data);
            } catch (err: any) {
                console.error('데이터 fetch 실패:', err.response || err);
                setError(err.response?.data?.message || '불러오기 실패');
            } finally {
                setLoading(false);
            }
        };
        // ✨ id만 의존성 배열에 넣어요!
        fetchItem();
    }, [id]);

    // 메시지도 '여행 일정'에 맞게 수정!
    if (loading) return <Container>여행 일정 데이터 로딩 중...</Container>;
    if (error) return <Container style={{ color: 'red' }}>{error}</Container>;
    if (!item) return <Container>해당 여행 일정을 찾을 수 없습니다.</Container>;

    // 삭제 처리 로직은 기존과 동일하게 유지
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
                    {/* ✨ itemType === 'travel' 조건문 제거! 바로 item 사용! */}
                    <h3>{item.date}일째 여행</h3>
                    <p>{item.content}</p>{' '}
                    {/* ✨ item이 TravelItemType이므로 as TravelItemType 필요 없어요! */}
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
                // ✨ item이 TravelItemType이므로 as TravelItemType 필요 없어요!
                <TravelForm travelItem={item} />
            )}
        </Container>
    );
}

// 버튼 스타일은 그대로 유지
const ButtonsWrap = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 20px;
`;
