import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

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
  margin-bottom: 32px;
  
  &::after {
    content: '▼';
    font-size: 10px;
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
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
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
  margin-bottom: 12px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: #666;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

function OrderLog() {
  const [activeTab, setActiveTab] = useState('전체');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: 'ao3r2kngd-39d-dsjen-398djfkjf'
        })
      });

      if (!response.ok) throw new Error('주문 내역 조회 실패');

      const data = await response.json();
      setOrders(data.transaction_history || []);
    } catch (error) {
      console.error('주문 내역 조회 중 오류 발생:', error);
    }
  };

  const fetchOrderDetail = async (orderId) => {
    try {
      const response = await fetch('/api/orders/detail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: 'ao3r2kngd-39d-dsjen-398djfkjf',
          order_id: orderId
        })
      });

      if (!response.ok) throw new Error('주문 상세 조회 실패');

      const data = await response.json();
      setOrderDetail(data);
    } catch (error) {
      console.error('주문 상세 조회 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]); // activeTab이 변경될 때마다 데이터 다시 조회

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
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>주문내역</Title>
        
        <TabsContainer>
          <TabList>
            <Tab active={activeTab === '전체'} onClick={() => setActiveTab('전체')}>전체</Tab>
            <Tab active={activeTab === '주간주문'} onClick={() => setActiveTab('주간주문')}>주간주문</Tab>
            <Tab active={activeTab === '예약주문'} onClick={() => setActiveTab('예약주문')}>예약주문</Tab>
          </TabList>
        </TabsContainer>
        
        <PeriodSelector>
          확인할 주문 2024년 1월
        </PeriodSelector>
        
        <OrderList>
          {orders.map((order, index) => (
            <OrderCard key={index} onClick={() => {
              setSelectedOrder(order);
              fetchOrderDetail(order.id);
            }}>
              <OrderInfo>
                <StockName>{order.date}</StockName>
                <OrderStatus color={getStatusColor(order.status)}>{order.status}</OrderStatus>
              </OrderInfo>
              <OrderDetail>
                <span>{order.name}</span>
                <span>{order.quantity}주</span>
              </OrderDetail>
            </OrderCard>
          ))}
        </OrderList>

        {selectedOrder && orderDetail && (
          <>
            <Overlay onClick={() => setSelectedOrder(null)} />
            <Modal>
              <DetailRow>
                <DetailLabel>종목명</DetailLabel>
                <DetailValue>{orderDetail.stock_name}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문유형</DetailLabel>
                <DetailValue>{orderDetail.type === 'purchase' ? '매수' : '매도'}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문상태</DetailLabel>
                <DetailValue>{orderDetail.order_status}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주당 가격</DetailLabel>
                <DetailValue>{formatNumber(orderDetail.price_per_one)}원</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>총 금액</DetailLabel>
                <DetailValue>{formatNumber(orderDetail.total_price)}원</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문 방식</DetailLabel>
                <DetailValue>{orderDetail.order_type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>주문 시간</DetailLabel>
                <DetailValue>{formatDateTime(orderDetail.order_time)}</DetailValue>
              </DetailRow>
              {orderDetail.filled_time && (
                <DetailRow>
                  <DetailLabel>체결 시간</DetailLabel>
                  <DetailValue>{formatDateTime(orderDetail.filled_time)}</DetailValue>
                </DetailRow>
              )}
            </Modal>
          </>
        )}
      </Container>
    </>
  );
}

export default OrderLog;