import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'; // createGlobalStyle 추가
import dayjs from 'dayjs';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px 40px 0 5px;
  background: #ffffff;
`;

// Transaction.js와 동일한 헤더 스타일
const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 18px;
  color: #666;
  margin-top: -12px;
  padding-left: 0;

  span {
    cursor: pointer;
    margin: 0 16px;
    padding: 4px 8px;
    background: #f1f3f5;
    border-radius: 4px;
    transition: background 0.3s ease;

    &:hover {
      background: #e1e3e5;
    }
  }
`;

const AvailableAmount = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E8EB;
`;

const ProfitLabel = styled.div`
  font-size: 18px;
  color: ${props => props.profit >= 0 ? 'red' : '#4788ff'};
  margin-bottom: 32px;
  text-align: left;
  padding-left: 0px;
`;

const OrderList = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0px;
`;

const OrderCard = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #E5E8EB;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const OrderInfo = styled.div``;

const OrderDate = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const OrderTitle = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
`;

const OrderDetail = styled.div`
  font-size: 13px;
  color: #666;
`;

const OrderStatus = styled.div`
  text-align: right;
`;

const Amount = styled.div`
  font-size: 15px;
  color: ${props => props.isPositive ? 'red' : '#4788ff'};
  margin-bottom: 4px;
`;

function Sales({ uuid }) {
  const [activeMonth, setActiveMonth] = useState(dayjs());
  const [orders, setOrders] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalesHistory = async () => {
      try {
        const response = await axios.get(`/api/sales/${uuid}`);
        const salesHistory = response.data.sales_history || [];
        setOrders(salesHistory);

        const total = salesHistory.reduce((acc, order) => acc + order.profit, 0);
        setTotalProfit(total);
        setError(null);
      } catch (error) {
        setError('판매 기록을 불러오는 데 실패했습니다.');
        console.error(error);
      }
    };

    fetchSalesHistory();
  }, [uuid, activeMonth]);

  const changeMonth = (direction) => {
    if (direction === 'previous') {
      setActiveMonth(prev => prev.subtract(1, 'month'));
    } else if (direction === 'next') {
      setActiveMonth(prev => prev.add(1, 'month'));
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>판매 수익</Title>

        <MonthSelector>
          <span onClick={() => changeMonth('previous')}>{'<'}</span>
          {activeMonth.format('YYYY년 MM월')}
          <span onClick={() => changeMonth('next')}>{'>'}</span>
        </MonthSelector>

        <AvailableAmount>주문 가능 원화: 6,630원</AvailableAmount>

        <ProfitLabel profit={totalProfit}>
          금액 (수익률): {totalProfit >= 0 ? `+${totalProfit.toLocaleString()}원` : `${totalProfit.toLocaleString()}원`}
        </ProfitLabel>

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <OrderList>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderInfo>
                <OrderDate>{order.date}</OrderDate>
                <OrderTitle>{order.name} {order.quantity}주</OrderTitle>
                <OrderDetail>수익률: {order.profit_rate}%</OrderDetail>
              </OrderInfo>
              <OrderStatus>
                <Amount isPositive={order.profit > 0}>
                  {order.profit > 0 ? `+${order.profit.toLocaleString()}원` : `${order.profit.toLocaleString()}원`}
                </Amount>
              </OrderStatus>
            </OrderCard>
          ))}
        </OrderList>
      </Container>
    </>
  );
}

export default Sales;