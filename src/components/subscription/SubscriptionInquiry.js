import React, { useState } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale';
import "react-datepicker/dist/react-datepicker.css";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const AccountSelect = styled.select`
  width: 100%;
  padding: 16px;
  font-size: 16px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  margin-bottom: 24px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23666666' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-color: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4174f6;
  }
`;

const DatePickerWrapper = styled.div`
  margin-bottom: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    border: 1px solid #e5e8eb;
    border-radius: 12px;
    font-family: 'Noto Sans KR', sans-serif;
  }

  .react-datepicker__header {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e5e8eb;
    border-top-right-radius: 12px;
    border-top-left-radius: 12px;
  }

  .react-datepicker__day--selected {
    background-color: #4174f6;
    border-radius: 20px;
  }

  .react-datepicker__day--in-range {
    background-color: rgba(65, 116, 246, 0.1);
  }

  .react-datepicker__day--in-selecting-range {
    background-color: rgba(65, 116, 246, 0.2);
  }

  .react-datepicker__input-container input {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    border: 1px solid #e5e8eb;
    border-radius: 8px;
    text-align: center;
    cursor: pointer;
  }
`;

const SubscriptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SubscriptionCard = styled.div`
  background: white;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  padding: 24px;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CompanyName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const Status = styled.div`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case '청약완료': return '#e6f3ff';
      case '배정확정': return '#e6ffe6';
      case '환불완료': return '#ffe6e6';
      default: return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case '청약완료': return '#0066cc';
      case '배정확정': return '#00cc00';
      case '환불완료': return '#cc0000';
      default: return '#666666';
    }
  }};
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  
  span:first-child {
    color: #666;
  }
  
  span:last-child {
    color: #333;
    font-weight: 500;
  }
`;

function SubscriptionInquiry() {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  
  const subscriptions = [
    {
      id: 1,
      companyName: '(주)에이펙스',
      applicationDate: '2024.01.24',
      status: '청약완료',
      quantity: 50,
      amount: 400000,
      refundDate: '2024.01.28',
      listingDate: '2024.02.01'
    },
    {
      id: 2,
      companyName: '(주)쓰리빌리언',
      applicationDate: '2024.01.15',
      status: '배정확정',
      quantity: 30,
      amount: 300000,
      refundDate: '2024.01.19',
      listingDate: '2024.01.25'
    }
  ];

  return (
    <Container>
      <Title>청약 내역 조회</Title>

      <AccountSelect defaultValue="default">
        <option value="default">46309613-01 위탁계좌</option>
      </AccountSelect>

      <DatePickerWrapper>
        <DatePicker
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update) => {
            setDateRange(update);
          }}
          dateFormat="yyyy.MM.dd"
          locale={ko}
          isClearable={true}
          placeholderText="조회할 기간을 선택해주세요"
          monthsShown={2}
        />
      </DatePickerWrapper>

      <SubscriptionList>
        {subscriptions.map(subscription => (
          <SubscriptionCard key={subscription.id}>
            <CardHeader>
              <CompanyName>{subscription.companyName}</CompanyName>
              <Status status={subscription.status}>{subscription.status}</Status>
            </CardHeader>
            <CardContent>
              <InfoRow>
                <span>청약일자</span>
                <span>{subscription.applicationDate}</span>
              </InfoRow>
              <InfoRow>
                <span>청약수량</span>
                <span>{subscription.quantity}주 / {subscription.amount.toLocaleString()}원</span>
              </InfoRow>
              <InfoRow>
                <span>환불일자</span>
                <span>{subscription.refundDate}</span>
              </InfoRow>
              <InfoRow>
                <span>상장일자</span>
                <span>{subscription.listingDate}</span>
              </InfoRow>
            </CardContent>
          </SubscriptionCard>
        ))}
      </SubscriptionList>
    </Container>
  );
}

export default SubscriptionInquiry;