// src/pages/DetailPage.tsx
import { useParams, useLocation, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import PageHeader from '../components/PageHeader';
import { Container } from '../components/CommonLayout';
import { travelDates } from '../data/travelDates';
import type { TravelItem } from '../data/travelDates';
import { reservations } from '../data/reservations';
import type { ReservationItem } from '../data/reservations';

// Item 타입: travel 또는 reservation 에 kind를 붙여 사용
type Item = (TravelItem | ReservationItem) & { kind: 'travel' | 'reservation' };

/**
 * 테이블 형태 데이터를 렌더링하는 컴포넌트
 * headers: string[], rows: string[][]
 */
function TableFromData({
    headers,
    rows,
}: {
    headers: string[];
    rows: string[][];
}) {
    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <caption
                    style={{
                        textAlign: 'left',
                        fontWeight: 600,
                        marginBottom: 8,
                    }}
                    aria-hidden
                >
                    상세 정보
                </caption>
                <thead>
                    <tr>
                        {headers.map((h, i) => (
                            <th
                                key={i}
                                style={{
                                    border: '1px solid #e6e6e6',
                                    padding: '8px 10px',
                                    background: '#fafafa',
                                    textAlign: 'left',
                                }}
                                scope="col"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rIndex) => (
                        <tr key={rIndex}>
                            {row.map((cell, cIndex) => (
                                <td
                                    key={cIndex}
                                    style={{
                                        border: '1px solid #eee',
                                        padding: '8px 10px',
                                        verticalAlign: 'top',
                                    }}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/**
 * item.contentType === 'table' 이면 구조화된 데이터로 렌더
 * item.content 가 HTML 문자열이면 DOMPurify로 정화 후 dangerouslySetInnerHTML 로 렌더
 * 그 외에는 일반 텍스트로 렌더
 */
function RenderContent({ item }: { item: Item }) {
    // 구조화된 테이블 데이터가 있으면 우선 처리
    // (contentType과 contentData 필드 구조는 데이터 설계에 맞춰 조정하세요)
    if ((item as any).contentType === 'table' && (item as any).contentData) {
        const cd = (item as any).contentData;
        const headers: string[] = cd.headers ?? [];
        const rows: string[][] = cd.rows ?? [];
        return <TableFromData headers={headers} rows={rows} />;
    }

    // content가 HTML 문자열인지 간단 검사
    const content = (item as any).content;
    if (typeof content === 'string') {
        // <table> 태그나 다른 HTML 태그가 포함되어 있는지 체크
        const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content);
        if (looksLikeHtml) {
            // DOMPurify로 정화 후 삽입 (XSS 방지)
            const clean = DOMPurify.sanitize(content, {
                USE_PROFILES: { html: true },
            });
            return <div dangerouslySetInnerHTML={{ __html: clean }} />;
        }

        // 기본 텍스트
        return <p>{content}</p>;
    }

    // 그 외 (예: content가 객체 등) -> JSON 형태로 표시 (디버그용)
    return (
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(content, null, 2)}
        </pre>
    );
}

export default function DetailPage() {
    const params = useParams<{ id: string }>();
    const location = useLocation();
    const id = params.id ?? '';

    // 먼저 두 데이터에서 찾음 (예약 먼저 검사하는 것이 UX상 자연스러우면 우선)
    const foundReservation = reservations.find(
        (r) => String(r.id) === String(id),
    );
    const foundTravel = travelDates.find((t) => String(t.id) === String(id));

    // 간단한 경로 판단: /reservation-detail/* 이면 reservation으로 간주
    const pathname = location.pathname || '';
    const source = pathname.startsWith('/reservation-detail')
        ? 'reservation'
        : 'travel';

    // item 구성: source 기준으로 found 결과를 사용(없으면 다른 쪽도 검사)
    let item: Item | undefined;
    if (source === 'reservation') {
        if (foundReservation)
            item = { ...foundReservation, kind: 'reservation' };
        else if (foundTravel) item = { ...foundTravel, kind: 'travel' };
    } else {
        if (foundTravel) item = { ...foundTravel, kind: 'travel' };
        else if (foundReservation)
            item = { ...foundReservation, kind: 'reservation' };
    }

    // 뒤로갈 경로 결정 (state로 전달된 from이 있으면 우선 사용)
    const backFromState = (location.state as any)?.from as string | undefined;
    const backTo =
        backFromState ??
        (item?.kind === 'reservation' ? '/reservation' : '/schedule');

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

    return (
        <>
            {/* 상단 고정 바 */}
            <TopBar role="banner" aria-hidden={false}>
                <TopBarInner>
                    <BarTitle>상세 보기</BarTitle>

                    {/* 우측 상단 닫기 (기존 backTo와 동일한 동작) */}
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
                            : ('title' in item
                                  ? item.title
                                  : `여행 ${(item as TravelItem).date}`) +
                              ' 일째'}
                    </h3>

                    <div>
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
import styled from 'styled-components';

const TOPBAR_HEIGHT = '64px';

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
