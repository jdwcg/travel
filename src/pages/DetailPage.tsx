// src/pages/DetailPage.tsx
import { useParams, useLocation, Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { Container } from '../components/CommonLayout';
import { travelDates } from '../data/travelDates';
import type { TravelItem } from '../data/travelDates';
import { reservations } from '../data/reservations';
import type { ReservationItem } from '../data/reservations';
type Item = (TravelItem | ReservationItem) & { kind: 'travel' | 'reservation' };

export default function DetailPage() {
    const params = useParams<{ id: string }>();
    const location = useLocation();
    const id = params.id ?? '';

    // 경로로 출처 판단 (간단하고 안정적)
    const pathname = location.pathname || '';
    const source = pathname.startsWith('/reservation-detail')
        ? 'reservation'
        : 'travel';

    // 데이터 조회
    const item: Item | undefined =
        source === 'reservation'
            ? (reservations.find((r) => r.id === id) as
                  | ReservationItem
                  | undefined)
                ? {
                      ...(reservations.find(
                          (r) => r.id === id,
                      ) as ReservationItem),
                      kind: 'reservation',
                  }
                : undefined
            : (travelDates.find((t) => t.id === id) as TravelItem | undefined)
            ? {
                  ...(travelDates.find((t) => t.id === id) as TravelItem),
                  kind: 'travel',
              }
            : undefined;

    // 뒤로갈 경로 결정 (해당 탭 홈)
    const backTo = source === 'reservation' ? '/reservation' : '/schedule';

    if (!item) {
        return (
            <Container>
                <PageHeader title="상세 보기" />
                <p>해당 항목을 찾을 수 없습니다.</p>
                <p>
                    <Link to={backTo}>목록으로 돌아가기</Link>
                </p>
            </Container>
        );
    }

    // 렌더: travel과 reservation 구조가 다르면 조건부로 표시
    return (
        <Container>
            <PageHeader title="상세 보기" />
            <p>아이템 ID: {id}</p>
            <h3>
                {'title' in item
                    ? item.title
                    : `일정 (${(item as TravelItem).date})`}
            </h3>

            {/* 공통 내용 표시 */}
            <div>
                <p>{item.content}</p>
            </div>

            <p>
                <Link to={backTo} aria-label="목록으로 돌아가기">
                    목록으로 돌아가기
                </Link>
            </p>
        </Container>
    );
}
