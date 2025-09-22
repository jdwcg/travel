import { useState } from "react";
import type { FormEvent } from "react";
import type { ReservationItemType } from "../types/ReservationTypes";
import styled from "styled-components";
import { BaseBtnWrap } from "./CommonLayout";

interface ReservationFormProps {
  reservation?: ReservationItemType;
  onSubmit?: (data: ReservationItemType) => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function ReservationForm({
  reservation,
  onSubmit,
  onCancel,
}: ReservationFormProps) {
  const [title, setTitle] = useState(reservation?.title || "");
  const [date, setDate] = useState(reservation?.date || "");
  const [contentType, setContentType] = useState<
    ReservationItemType["contentType"]
  >(reservation?.contentType || "text");
  const [content, setContent] = useState(reservation?.content || "");
  const [headers, setHeaders] = useState<string[]>(
    reservation?.contentData?.headers || []
  );
  const [rows, setRows] = useState<string[][]>(
    reservation?.contentData?.rows || []
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data: ReservationItemType = {
      id: reservation?.id || `r${Date.now()}`,
      title,
      date,
      contentType,
      content: contentType === "text" ? content : undefined,
      contentData: contentType === "table" ? { headers, rows } : undefined,
    };

    onSubmit?.(data);
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value); // 'YYYY-MM-DD' 형식의 문자열이 들어옴
  };
  return (
    <FormWrapper onSubmit={handleSubmit}>
      <LabelBase>
        제목:
        <input value={title} onChange={(e) => setTitle(e.target.value)} />
      </LabelBase>
      <LabelBase>
        날짜:
        <input
          type="date" // ✨ 바로 이 부분이 핵심!
          value={date} // `useState`에 저장된 문자열 값을 넣어줘요
          onChange={handleDateChange} // 날짜가 변경될 때 호출될 함수
          style={{
            padding: "6px 8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            // 필요한 추가 스타일을 여기에 넣어주세요!
          }}
        />
      </LabelBase>
      <LabelBase>
        타입:
        <select
          value={contentType}
          onChange={(e) =>
            setContentType(e.target.value as ReservationItemType["contentType"])
          }
        >
          <option value="text">텍스트</option>
          <option value="table">테이블</option>
        </select>
      </LabelBase>

      {contentType === "text" && (
        <LabelBase>
          내용:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </LabelBase>
      )}

      {contentType === "table" && (
        <>
          <LabelBase>
            테이블 헤더 (쉼표로 구분):
            <input
              value={headers.join(",")}
              onChange={(e) => setHeaders(e.target.value.split(","))}
              placeholder="예) 항목, 내역"
            />
          </LabelBase>
          <LabelBase>
            테이블 행 (세미콜론으로 구분, 각 행은 쉼표로 구분):
            <textarea
              style={{ height: "200px", lineHeight: "2" }}
              value={rows.map((r) => r.join(",")).join(";")}
              onChange={(e) =>
                setRows(e.target.value.split(";").map((row) => row.split(",")))
              }
              placeholder="예) 예약번호, 1234; 투숙객명, 홍길동;"
            />
          </LabelBase>
        </>
      )}

      <ButtonGroup>
        <BaseBtnWrap>
          <button type="button" className="close" onClick={onCancel}>
            취소
          </button>
        </BaseBtnWrap>
        <BaseBtnWrap>
          <button type="submit" className="save">
            저장
          </button>
        </BaseBtnWrap>
      </ButtonGroup>
    </FormWrapper>
  );
}

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  /* gap: 12px; */
  input,
  select,
  textarea {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ddd;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  .save,
  .close {
    font-size: 16px;
  }
  .save {
    background-color: #4caf50;
    color: white;
    border: none;
    padding: 8px 16px;
  }
`;
export const LabelBase = styled.label`
  display: flex;
  flex-direction: column;
  margin-bottom: 14px;
  gap: 6px;
  textarea {
    height: 150px;
  }
`;
