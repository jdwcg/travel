import PageHeader from "../components/PageHeader";
import Tabs from "../components/Tabs";
import {
  Container,
  //   ReservationSection,
  ReservationItem,
  PageWrap,
  BaseBtnWrap,
} from "../components/CommonLayout";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import type { ReservationItemType } from "../types/ReservationTypes";
import styled from "styled-components";

const Spacer = styled.div`
  margin-top: 80px;
`;

export default function ReservationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState<ReservationItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosClient.get<ReservationItemType[]>(
          "/api/reservations"
        );
        setReservations(res.data);
      } catch (err) {
        console.error(err);
        setError("예약 데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  if (loading)
    return (
      <Container>
        <PageHeader title="10월 제주 스마트 플랜" />
        <Tabs />
        <PageWrap>Loading...</PageWrap>
      </Container>
    );
  if (error)
    return (
      <Container>
        <PageHeader title="10월 제주 스마트 플랜" />
        <Tabs />
        <PageWrap style={{ color: "red" }}>{error}</PageWrap>
      </Container>
    );
  if (reservations.length === 0)
    return (
      <Container>
        <PageHeader title="10월 제주 스마트 플랜" />
        <Tabs />
        <PageWrap>예약 데이터가 없습니다.</PageWrap>
      </Container>
    );

  // ✨ 여기부터 추가될 부분이에요! ✨
  // 예약 목록을 날짜별로 정렬합니다 (가까운 날짜부터 먼저 보이게)
  const sortedReservations = [...reservations].sort((a, b) => {
    // a.date와 b.date는 'YYYY-MM-DD' 형태의 문자열이라고 가정합니다.
    // Date 객체로 변환하여 정확하게 날짜를 비교합니다.
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    // getTime()으로 밀리초 값을 얻어 비교하면 숫자로 비교할 수 있어요!
    // 작은 값(이른 날짜)이 먼저 오도록 정렬합니다.
    return dateA.getTime() - dateB.getTime();
  });
  // ✨ 추가될 부분 끝! ✨

  return (
    <Container>
      <PageHeader title="10월 제주 스마트 플랜" />
      <Tabs />
      <Spacer></Spacer>

      <PageWrap>
        <div style={{ paddingTop: "8px" }}></div>
        <ReservationSection>
          {/* ✨ 정렬된 배열을 사용합니다! ✨ */}
          {sortedReservations.map((r) => (
            <Link
              key={r._id || r.id}
              to={`/detail/reservation/${r.id}`}
              state={{ from: location.pathname }}
              aria-label={`${r.title} 상세보기`}
            >
              <span>{r.date && formatDateForDisplay(r.date)}</span>
              <ReservationItem>{r.title}</ReservationItem>
            </Link>
          ))}
        </ReservationSection>
        <BaseBtnWrap>
          <BaseBtnWrapInner>
            <button onClick={() => navigate("/reservation/create")}>
              예약 추가하기
            </button>
          </BaseBtnWrapInner>
        </BaseBtnWrap>
      </PageWrap>
    </Container>
  );
}

const formatDateForDisplay = (dateString: string) => {
  // dateString 타입 추가!
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");
  return `${year}년 ${month}월 ${day}일`;
};
export const ReservationSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
  div {
    margin-bottom: 4px;
  }
  a {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    span {
      font-size: 14px;
      text-align: left;
      color: #888;
      margin-bottom: 8px;
    }
  }
`;
export const BaseBtnWrapInner = styled.section`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin: 18px 0;
  button {
    padding: 8px 16px;
    font-size: 14px;
  }
`;
