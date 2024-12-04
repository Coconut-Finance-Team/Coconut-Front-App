import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 25px 50px 0 5px;
  background: #ffffff;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const TabsContainer = styled.div`
  margin-bottom: 24px;
  border-bottom: 1px solid #E5E8EB;
`;

const TabList = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
`;

const Tab = styled.button`
  padding: 12px 0;
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 15px;
  background: none;
  border: none;
  cursor: pointer;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? '#333' : 'transparent'};
  }
`;

const DatePickerContainer = styled.div`
  position: relative;
  margin-bottom: 32px;
`;

const PeriodSelector = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: #F8F9FA;
  border: 1px solid #E5E8EB;
  border-radius: 8px;
  padding: 8px 12px;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  
  &::after {
    content: '▼';
    font-size: 10px;
  }
`;

const DatePickerDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #E5E8EB;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px;
  z-index: 100;
  margin-top: 4px;
  width: 200px;
`;

const YearMonthButton = styled.button`
  width: 100%;
  padding: 8px 12px;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 14px;
  
  &:hover {
    background: #F8F9FA;
  }
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderCard = styled.div`
  background: #F8F9FA;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
`;

const OrderInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const StockName = styled.div`
  color: #333;
  font-size: 16px;
  font-weight: 500;
`;

const OrderStatus = styled.div`
  font-size: 14px;
  color: ${props => props.color || '#666'};
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  color: #666;
  font-size: 14px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 32px 24px 24px;  // 상단 패딩 조정
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 90%;
  max-width: 420px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 15px;
  padding: 8px 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: #666;
  font-weight: 400;
`;

const DetailValue = styled.span`
  color: #333;
  text-align: right;
  font-weight: 400;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;          // 위치 조정
  right: 12px;        // 위치 조정
  background: none;
  border: none;
  font-size: 20px;    // 크기 조정
  cursor: pointer;
  color: #666;
  width: 20px;        // 크기 조정
  height: 20px;       // 크기 조정
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1;
  z-index: 1001;
`;

function OrderLog() {
  const [activeTab, setActiveTab] = useState('전체');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth());
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);


// useEffect 수정
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('jwtToken');
      
      if (!token) {
        setError('로그인이 필요합니다.');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(`${API_BASE_URL}/account/orders`, {
        headers,
        params: {
          accountId: user?.primaryAccountId,
          type: activeTab !== '전체' ? activeTab : undefined,
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1
        }
      });

      // 선택된 월에 해당하는 주문만 필터링
      const filteredOrders = (response.data || []).filter(order => {
        const orderDate = new Date(order.orderTime);
        return orderDate.getFullYear() === selectedDate.getFullYear() &&
               orderDate.getMonth() === selectedDate.getMonth();
      });

      setOrders(filteredOrders);

    } catch (error) {
      // ... error handling
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [activeTab, selectedDate, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case '구매불가': return '#ff4747';
      case '매수가능': return '#4788ff';
      case '주문완료': return '#00c073';
      default: return '#666';
    }
  };

  const formatNumber = (num) => {
    return num?.toLocaleString('ko-KR') || '0';
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, '0')}. ${String(date.getDate()).padStart(2, '0')}. ${date.getHours() >= 12 ? '오후' : '오전'} ${String(date.getHours() % 12 || 12).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const generateYearMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    // 현재 월부터 이전 11개월
    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      months.push(date);
    }
    
    return months;
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>주문내역</Title>

        {error && (
          <div style={{ 
            color: '#dc3545', 
            padding: '16px', 
            marginBottom: '16px', 
            background: '#ffebee', 
            borderRadius: '8px',
            border: '1px solid #dc3545' 
          }}>
            {error}
          </div>
        )}
               
        <DatePickerContainer>
  <PeriodSelector onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}>
    확인할 주문 {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월
  </PeriodSelector>
  
  {isDatePickerOpen && (
    <DatePickerDropdown>
      {generateYearMonths().map((date, index) => (
        <YearMonthButton
          key={index}
          onClick={() => {
            setSelectedDate(date);
            setIsDatePickerOpen(false);
          }}
        >
          {date.getFullYear()}년 {date.getMonth() + 1}월
        </YearMonthButton>
      ))}
    </DatePickerDropdown>
  )}
</DatePickerContainer>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            로딩중...
          </div>
        ) : (
          <OrderList>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                주문내역이 없습니다.
              </div>
            ) : (
              orders.map((order, index) => (
                <OrderCard key={index} onClick={() => {
                  setSelectedOrder(order);
                  setOrderDetail(order);
                }}>
                  <OrderInfo>
                    <StockName>{order.stockName}</StockName>
                    <OrderStatus color={getStatusColor(order.status)}>
                      {order.status}
                    </OrderStatus>
                  </OrderInfo>
                  <OrderDetail>
                    <span>{formatDateTime(order.orderTime)}</span>
                    <span>{formatNumber(order.quantity)}주</span>
                  </OrderDetail>
                </OrderCard>
              ))
            )}
          </OrderList>
        )}

        {selectedOrder && orderDetail && (
          <>
            <Overlay onClick={() => setSelectedOrder(null)} />
            <Modal>
              <CloseButton onClick={() => setSelectedOrder(null)}>×</CloseButton>
              <DetailRow>
                <DetailLabel>종목명</DetailLabel>
                <DetailValue>{orderDetail.stockName}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문상태</DetailLabel>
                <DetailValue>{orderDetail.status}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문수량</DetailLabel>
                <DetailValue>{formatNumber(orderDetail.quantity)}주</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문가격</DetailLabel>
                <DetailValue>{formatNumber(orderDetail.price)}원</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문 방식</DetailLabel>
                <DetailValue>{orderDetail.type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문 시간</DetailLabel>
                <DetailValue>{formatDateTime(orderDetail.orderTime)}</DetailValue>
              </DetailRow>
            </Modal>
          </>
        )}
      </Container>
    </>
  );
}

export default OrderLog;