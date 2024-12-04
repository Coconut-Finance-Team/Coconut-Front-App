import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
import dayjs from 'dayjs';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

// Keeping your existing styled components...
const Container = styled.div`
  padding: 40px 40px 0 5px;
  background: #ffffff;
`;

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

function Sales() {
  const [activeMonth, setActiveMonth] = useState(dayjs());
  const [orders, setOrders] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Transform API data to match component's expected format
  const transformSalesData = (salesData) => {
    return salesData.map(sale => ({
      id: sale.id,
      date: dayjs(sale.saleDate).format('YYYY-MM-DD HH:mm:ss'),
      name: sale.stockName,
      quantity: sale.quantity,
      profit: (sale.salePricePerShare - sale.purchasePricePerShare) * sale.quantity,
      profit_rate: ((sale.salePricePerShare - sale.purchasePricePerShare) / sale.purchasePricePerShare * 100).toFixed(2)
    }));
  };

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

        // 1. 사용자 정보 가져오기
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
        setUser(userResponse.data);
        const primaryAccountId = userResponse.data.primaryAccountId;

        if (!primaryAccountId) {
          setError('주계좌 정보를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        // 2. 판매 수익 정보 가져오기
        const response = await axios.get(`${API_BASE_URL}/account/sales-profit`, {
          headers,
          params: {
            accountId: primaryAccountId,
            year: activeMonth.year(),
            month: activeMonth.month() + 1
          }
        });

        // Transform the data to match your component's expected format
        const transformedOrders = transformSalesData(response.data);
        setOrders(transformedOrders);
        
        // Calculate total profit
        const total = transformedOrders.reduce((acc, order) => acc + order.profit, 0);
        setTotalProfit(total);

      } catch (error) {
        console.error('API 호출 중 에러 발생:', error);
        
        if (error.response?.status === 401) {
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('jwtToken');
        } else {
          setError(
            error.response?.data?.message ||
            '정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeMonth]);

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

        <MonthSelector>
          <span onClick={() => changeMonth('previous')}>{'<'}</span>
          {activeMonth.format('YYYY년 MM월')}
          <span onClick={() => changeMonth('next')}>{'>'}</span>
        </MonthSelector>

        {user?.deposit && (
          <AvailableAmount>
            주문 가능 원화: {user.deposit.toLocaleString()}원
          </AvailableAmount>
        )}

        <ProfitLabel profit={totalProfit}>
          금액 (수익률): {totalProfit >= 0 ? `+${totalProfit.toLocaleString()}원` : `${totalProfit.toLocaleString()}원`}
        </ProfitLabel>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            로딩중...
          </div>
        ) : (
          <OrderList>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                판매 내역이 없습니다.
              </div>
            ) : (
              orders.map(order => (
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
              ))
            )}
          </OrderList>
        )}
      </Container>
    </>
  );
}

export default Sales;