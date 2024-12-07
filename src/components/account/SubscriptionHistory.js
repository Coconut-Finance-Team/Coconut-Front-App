import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';
import axios from 'axios';
import "react-datepicker/dist/react-datepicker.css";

// 한글 로케일 등록
registerLocale('ko', ko);

// API 관련 설정
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Error:', error);
    return Promise.reject(error);
  }
);

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px 0;
  background: #ffffff;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
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

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #666;
  font-size: 16px;
`;

const LoadingState = styled(EmptyState)`
  color: #4174f6;
`;

const ErrorState = styled(EmptyState)`
  color: #cc0000;
  background-color: #fff2f0;
  border-radius: 8px;
  margin: 20px 0;
  padding: 16px;
`;

const SubscribeButton = styled.button`
  margin-top: 16px;
  padding: 12px 24px;
  background-color: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2855d1;
  }

  &:disabled {
    background-color: #e5e8eb;
    cursor: not-allowed;
  }
`;

function SubscriptionHistory() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [activeIPOs, setActiveIPOs] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login', { 
        state: { 
          redirectUrl: '/subscription/history',
          message: '청약 내역 조회를 위해 로그인이 필요합니다.'
        }
      });
      return;
    }

    try {
      setLoading(true);
      
      // 1. 현재 진행중인 모든 공모주 정보 조회
      const activeIPOsResponse = await api.get(`${API_BASE_URL}/ipo/active`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // 2. 내가 신청한 공모주 ID 목록 조회
      const mySubscriptionsResponse = await api.get(`${API_BASE_URL}/account/ipo`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      console.log('Active IPOs:', activeIPOsResponse.data);
      console.log('My Subscriptions:', mySubscriptionsResponse.data);

      // 내가 신청한 공모주 ID 목록 (id 필드 사용)
      const mySubscriptionIds = mySubscriptionsResponse.data.map(sub => sub.id);
      console.log('My Subscription IDs:', mySubscriptionIds);

      // 구독 정보를 Map으로 변환하여 쉽게 찾을 수 있도록 함
      const subscriptionMap = new Map(
        mySubscriptionsResponse.data.map(sub => [sub.id, sub])
      );

      // 모든 공모주 정보에 신청 정보 추가
      const formattedData = activeIPOsResponse.data.map(ipo => {
        const ipoId = ipo.id || ipo.IPOId;
        const mySubscription = subscriptionMap.get(ipoId);
        
        return {
          IPOId: ipoId,
          category: ipo.category,
          companyName: ipo.companyName,
          leadUnderwriter: ipo.leadUnderwriter,
          subscriptionStartDate: ipo.subscriptionStartDate,
          subscriptionEndDate: ipo.subscriptionEndDate,
          refundDate: ipo.refundDate,
          listingDate: ipo.listingDate,
          maxSubscriptionLimit: ipo.maxSubscriptionLimit,
          finalOfferPrice: ipo.finalOfferPrice,
          status: determineStatus(ipo),
          isSubscribed: mySubscriptionIds.includes(ipoId),
          // 내가 신청한 정보 추가
          quantity: mySubscription?.quantity,
          totalPrice: mySubscription?.totalPrice,
          myRefundDate: mySubscription?.refundDate,
        };
      });

      console.log('Formatted IPO data with subscription status:', formattedData);
      setActiveIPOs(formattedData);
      setMySubscriptions(mySubscriptionIds);
      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || '정보를 불러오는데 실패했습니다.');
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const determineStatus = (item) => {
    const today = new Date();
    const subscriptionEndDate = item.subscriptionEndDate ? new Date(item.subscriptionEndDate) : null;
    const subscriptionStartDate = item.subscriptionStartDate ? new Date(item.subscriptionStartDate) : null;
    
    if (subscriptionStartDate > today) {
      return '청약예정';
    } else if (subscriptionStartDate <= today && today <= subscriptionEndDate) {
      return '청약중';
    } else {
      return '청약마감';
    }
  };

  // 필터링된 공모주 목록 (내가 신청한 것만)
  const myIPOs = activeIPOs.filter(ipo => ipo.isSubscribed);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>나의 청약신청 내역</Title>

        <DatePickerWrapper>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
              console.log('Date range updated:', update);
            }}
            dateFormat="yyyy.MM.dd"
            locale="ko"
            isClearable={true}
            placeholderText="조회할 기간을 선택해주세요"
            monthsShown={2}
          />
        </DatePickerWrapper>

        <SubscriptionList>
          {loading ? (
            <LoadingState>정보를 불러오는 중입니다...</LoadingState>
          ) : error ? (
            <ErrorState>{error}</ErrorState>
          ) : myIPOs.length > 0 ? (
            myIPOs.map(ipo => (
              <SubscriptionCard key={ipo.IPOId}>
                <CardHeader>
                  <CompanyName>{ipo.companyName}</CompanyName>
                  <Status status={ipo.status}>{ipo.status}</Status>
                </CardHeader>
                <CardContent>
                  <InfoRow>
                    <span>기업분류</span>
                    <span>{ipo.category || '-'}</span>
                  </InfoRow>
                  <InfoRow>
                    <span>청약수량</span>
                    <span>{ipo.quantity?.toLocaleString() || 0}주</span>
                  </InfoRow>
                  <InfoRow>
                    <span>청약금액</span>
                    <span>{ipo.totalPrice?.toLocaleString() || 0}원</span>
                  </InfoRow>
                  <InfoRow>
                    <span>청약기간</span>
                    <span>
                      {ipo.subscriptionStartDate ? new Date(ipo.subscriptionStartDate).toLocaleDateString() : '-'} ~ 
                      {ipo.subscriptionEndDate ? new Date(ipo.subscriptionEndDate).toLocaleDateString() : '-'}
                    </span>
                  </InfoRow>
                  <InfoRow>
                    <span>청약한도</span>
                    <span>{ipo.maxSubscriptionLimit?.toLocaleString() || 0}주</span>
                  </InfoRow>
                  <InfoRow>
                    <span>확정발행가</span>
                    <span>{ipo.finalOfferPrice ? Number(ipo.finalOfferPrice).toLocaleString() : 0}원</span>
                  </InfoRow>
                  <InfoRow>
                    <span>상장예정일</span>
                    <span>{ipo.listingDate ? new Date(ipo.listingDate).toLocaleDateString() : '-'}</span>
                  </InfoRow>
                  {ipo.myRefundDate && (
                    <InfoRow>
                      <span>환불예정일</span>
                      <span>{new Date(ipo.myRefundDate).toLocaleDateString()}</span>
                    </InfoRow>
                  )}
                  <InfoRow>
                    <span>대표주관회사</span>
                    <span>{ipo.leadUnderwriter || '-'}</span>
                  </InfoRow>
                </CardContent>
              </SubscriptionCard>
            ))
          ) : (
            <EmptyState>
              조회된 청약신청 내역이 없습니다
            </EmptyState>
          )}
        </SubscriptionList>
      </Container>
    </>
  );
}

export default SubscriptionHistory;