// src/pages/ItemDetailPage.tsx (가칭. 상세 페이지 컴포넌트 파일 이름에 맞춰주세요!)
import { useEffect, useState } from 'react'; // ✨ 추가
import axios from 'axios'; // ✨ 추가
import { useParams, Link, useLocation } from 'react-router-dom'; // useParams 추가!
import PageHeader from '../components/PageHeader';
import {
    Container,
    // PageContent,
    // TopBar,
    // TopBarInner,
    // BarTitle,
    // CloseLink,
} from '../components/CommonLayout';

// 💡 백엔드에서 오는 데이터 구조와 맞춰야 해요!
interface BaseItem {
    id: string;
    _id?: string;
    __v?: number;
    // ... 공통적으로 포함될 필드들 (title, content, contentType, contentData 등)
}

interface ReservationItemType extends BaseItem {
    // Reservation specific fields
    date: string;
    title: string;
    contentType?: 'text' | 'html' | 'table';
    content?: string;
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    kind: 'reservation'; // 어떤 타입의 아이템인지 구별하기 위한 필드
}

interface TravelItemType extends BaseItem {
    // Travel specific fields
    date: string; // ISO: 'YYYY-MM-DD' 또는 '1', '2'
    day: string;
    type: 'camping' | 'hotel' | 'activity' | 'food';
    content: string;
    lodging?: 'camping' | 'hotel';
    contentType?: 'text' | 'html' | 'table';
    contentData?: {
        headers?: string[];
        rows?: string[][];
    };
    kind: 'travel'; // 어떤 타입의 아이템인지 구별하기 위한 필드
}

type Item = ReservationItemType | TravelItemType;

export default function ItemDetailPage() {
    // 컴포넌트 이름은 실제 파일 이름에 맞춰주세요!
    // ✨ useParams로 URL에서 id 가져오기!
    // 라우트가 /reservation-detail/:id 라면 { id } = useParams<{ id: string }>();
    // 라우트가 /detail/:type/:id 라면 { type, id } = useParams<{ type: string; id: string }>();
    const { itemType, id } = useParams<{ itemType: string; id: string }>();

    // 💡 초기 데이터를 불러올 state
    const [item, setItem] = useState<Item | undefined>(undefined);
    // 💡 로딩 상태 관리
    const [loading, setLoading] = useState(true);
    // 💡 에러 상태 관리
    const [error, setError] = useState<string | null>(null);

    const location = useLocation(); // 뒤로갈 경로 결정을 위한 useLocation

    // 💡 데이터 불러오는 useEffect
    useEffect(() => {
        const fetchItemDetail = async () => {
            if (!id || !itemType) {
                // ID 또는 ItemType이 없으면 에러 처리
                setError('아이템 정보가 불완전합니다.');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // ✨ 여기가 핵심! itemType 에 따라 백엔드의 정확한 API 경로를 매핑합니다. ✨
            let endpointType = '';
            if (itemType === 'reservation') {
                endpointType = 'reservations'; // 'reservation' 타입일 때는 'reservations' 컬렉션 사용
            } else if (itemType === 'travel') {
                endpointType = 'traveldates'; // 'travel' 타입일 때는 'traveldates' 컬렉션 사용!
            } else {
                setError('알 수 없는 아이템 유형입니다.'); // 'reservation'이나 'travel'이 아닌 다른 값이 넘어오면
                setLoading(false);
                return;
            }

            const apiUrl = `http://localhost:5000/api/${endpointType}/${id}`;

            try {
                const response = await axios.get<Item>(apiUrl);
                // 가져온 데이터에 kind 필드를 추가하여 타입 구별 (기존 코드 로직 유지)
                setItem({ ...response.data, kind: itemType } as Item); // itemType을 그대로 kind로 사용
            } catch (err) {
                console.error(
                    '아이템 상세 정보를 불러오는 데 실패했습니다:',
                    err,
                );
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    setError('해당 아이템을 찾을 수 없습니다.');
                } else {
                    setError('상세 정보를 불러오는 데 실패했습니다.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchItemDetail();
    }, [id, itemType]);

    // ... (뒤로갈 경로 결정 로직은 기존 코드 유지)
    const backFromState = (location.state as any)?.from as string | undefined;
    // 💡 item.kind를 사용하여 동적으로 backTo 결정
    const backTo =
        backFromState ??
        (itemType === 'reservation' ? '/reservation' : '/schedule');

    // 💡 로딩 중일 때 UI
    if (loading) {
        return (
            <Container>
                <PageHeader title="상세 보기" />
                <p>데이터를 불러오는 중입니다...</p>
            </Container>
        );
    }

    // 💡 에러 발생 시 UI
    if (error) {
        return (
            <Container>
                <PageHeader title="상세 보기" />
                <p style={{ color: 'red' }}>{error}</p>
                <p>
                    <Link to={backTo}>닫기</Link>
                </p>
            </Container>
        );
    }

    // 💡 데이터가 없거나 로딩, 에러가 아닐 때 (즉, 404 Not Found)
    if (!item) {
        return (
            <Container>
                <PageHeader title="상세 보기" />
                <p>해당 항목을 찾을 수 없습니다.</p>
                <p>
                    <Link to={backTo}>닫기</Link>
                </p>
            </Container>
        );
    }

    // 💡 RenderContent 컴포넌트는 해당 컴포넌트에 정의되어 있을 것으로 가정
    // RenderContent 컴포넌트 내부에서 item의 kind에 따라 다르게 렌더링되도록 구현 필요

    return (
        <>
            {/* 상단 고정 바 */}
            <TopBar role="banner" aria-hidden={false}>
                <TopBarInner>
                    <BarTitle>상세 보기</BarTitle>
                    <CloseLink to={backTo} aria-label="닫기">
                        ×
                    </CloseLink>
                </TopBarInner>
            </TopBar>

            {/* 페이지 본문: TopBar 높이만큼 패딩 주기 */}
            <PageContent>
                <Container>
                    <h3>
                        {item.kind === 'reservation'
                            ? `${'title' in item ? item.title : '예약'}`
                            : ('title' in item && 'date' in item // travel item 일 경우 date 속성 접근 대비
                                  ? item.title || `여행 ${item.date}`
                                  : `여행 ${'date' in item ? item.date : ''}`) +
                              ' 일째'}
                    </h3>

                    <div>
                        {/* 💡 RenderContent 컴포넌트는 그대로 사용하되, item을 prop으로 넘김 */}
                        {/* 💡 RenderContent 컴포넌트가 item.kind에 따라 다른 데이터를 표시하도록 구현되어야 합니다. */}
                        {/* 예를 들어, RenderContent 안에서 item.kind === 'reservation' 일 때 ReservationItemType을, 'travel'일 때 TravelItemType을 예상 */}
                        <RenderContent item={item} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <p
                            style={{
                                marginTop: 24,
                                border: '1px solid #ddd',
                                textAlign: 'center',
                                borderRadius: 4,
                                display: 'inline-block',
                            }}
                        >
                            <Link
                                to={backTo}
                                aria-label="닫기"
                                style={{ padding: 12, display: 'block' }}
                            >
                                닫기
                            </Link>
                        </p>
                    </div>
                </Container>
            </PageContent>
        </>
    );
}

// 💡 RenderContent 컴포넌트 예시 (만약 기존 코드가 없었다면)
// 이 컴포넌트가 Item 타입을 받아서 ReservationItemType이나 TravelItemType에 따라 다른 내용을 렌더링하도록 정의해야 합니다.
interface RenderContentProps {
    item: Item;
}
function RenderContent({ item }: RenderContentProps) {
    if (item.kind === 'reservation') {
        // 예약 아이템 상세 렌더링
        const reservation = item as ReservationItemType;
        return (
            <DetailContentWrap>
                {/* <h4>{reservation.title}</h4> */}
                <p className="reservation_date">날짜: {reservation.date}</p>
                {reservation.content && <p>내용: {reservation.content}</p>}
                {reservation.contentType === 'table' &&
                    reservation.contentData && (
                        <Table>
                            <thead>
                                <tr>
                                    {reservation.contentData.headers?.map(
                                        (header, i) => (
                                            <th key={i}>{header}</th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {reservation.contentData.rows?.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td key={j}>{cell}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
            </DetailContentWrap>
        );
    } else if (item.kind === 'travel') {
        // 여행 아이템 상세 렌더링
        const travel = item as TravelItemType;
        return (
            <div>
                <h4>{travel.content}</h4>
                {/* <p>
                    날짜: {travel.date}일 ({travel.day})
                </p>
                <p>유형: {travel.type}</p> */}
                {travel.lodging && <p>숙소: {travel.lodging}</p>}
                {travel.contentType === 'table' && travel.contentData && (
                    <Table>
                        <colgroup>
                            <col style={{ width: '20%' }} />
                            <col style={{ width: '40%' }} />
                        </colgroup>
                        <thead>
                            <tr>
                                {travel.contentData.headers?.map(
                                    (header, i) => (
                                        <th key={i}>{header}</th>
                                    ),
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {travel.contentData.rows?.map((row, i) => (
                                <tr key={i}>
                                    {row.map((cell, j) => (
                                        <td key={j}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </div>
        );
    }
    return <p>알 수 없는 아이템 유형입니다.</p>;
}
import styled from 'styled-components';

const TOPBAR_HEIGHT = '64px';

const DetailContentWrap = styled.div`
    .reservation_date {
        padding: 14px 0 8px 24px;
        font-size: 14px;
    }
`;
const TopBar = styled.header`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${TOPBAR_HEIGHT};
    background: #ffffff;
    border-bottom: 1px solid #ececec;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
`;

const TopBarInner = styled.div`
    width: 100%;
    max-width: 980px; /* Container와 동일하게 맞춤 */
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative; /* CloseLink 절대 위치 기준 */
    box-sizing: border-box;
`;

const BarTitle = styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #222;
    text-align: center;
`;

const CloseLink = styled(Link)`
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 36px;
    height: 36px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: #333;
    background: #fff;
    border: 1px solid #eee;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;

    &:hover {
        background: #f6f6f6;
    }
    /* &:focus {
        outline: 2px solid #5b9dff;
        outline-offset: 2px;
    } */
`;

/* 실제 본문 영역: TopBar 높이만큼 여유를 둠 */
const PageContent = styled.main`
    padding-top: ${TOPBAR_HEIGHT};
    /* 필요 시 전체 너비 제한은 내부 Container에서 처리 */
    /* min-height: calc(100vh - ${TOPBAR_HEIGHT}); */
    min-height: 100vh;
    background: #fcfcfc; /* 필요하면 제거 */
`;
const Table = styled.table`
    width: 100%;
    td,
    th {
        padding: 10px 8px;
        border-top: 1px solid #ddd;
    }
    tr:last-child {
        border-bottom: 1px solid #ddd;
    }
`;
