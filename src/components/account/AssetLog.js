import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import AssetSummary from './AssetSummary';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px 40px 0 10px;
  background: #ffffff;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0x;
`;

const AccountNumber = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MainContent = styled.div`
  margin-top: 32px;
`;

const Balance = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const BalanceChange = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
`;

const TimePeriod = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

const TimeButton = styled.button`
  padding: 8px 16px;
  border-radius: 20px;
  background: ${props => props.active ? '#F8F9FA' : 'transparent'};
  border: 1px solid ${props => props.active ? '#E5E8EB' : '#E5E8EB'};
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 14px;
  cursor: pointer;
`;

function AssetLog() {
  const [accountData, setAccountData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1주');

  // API로부터 데이터를 가져오는 함수
  const fetchAccountData = async () => {
    try {
      const response = await fetch('/api/account-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: 'ao3r2kngd-39d-dsjen-398djfkjf'
        })
      });

      if (!response.ok) {
        throw new Error('API 요청 실패');
      }

      const data = await response.json();
      setAccountData(data);
    } catch (error) {
      console.error('데이터 조회 중 오류 발생:', error);
    }
  };

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchAccountData();
  }, []);

  // 금액을 원화 형식으로 포맷팅하는 함수
  const formatKRW = (amount) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount).replace('₩', '') + '원';
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>자산</Title>
        
        <AccountNumber>
          {accountData?.account_alias} {accountData?.account_id}
        </AccountNumber>

        <MainContent>
          <Balance>
            {accountData ? formatKRW(accountData.total_assets) : '0원'}
          </Balance>
          <BalanceChange>지난주보다 0원 (0%)</BalanceChange>

          <TimePeriod>
            {['1주', '1달', '3달', '1년'].map((period) => (
              <TimeButton
                key={period}
                active={selectedPeriod === period}
                onClick={() => setSelectedPeriod(period)}
              >
                {period}
              </TimeButton>
            ))}
          </TimePeriod>

          {accountData && (
            <div style={{ fontSize: '14px', color: '#666' }}>
              <div>주문 가능 금액: {formatKRW(accountData.deposit)}</div>
              <div>투자중인 금액: {formatKRW(accountData.invested_amount)}</div>
            </div>
          )}

          <AssetSummary
            krwBalance={accountData ? formatKRW(accountData.deposit) : '0원'}
            usdBalance={'$0.00'}
          />
        </MainContent>
      </Container>
    </>
  );
}

export default AssetLog;