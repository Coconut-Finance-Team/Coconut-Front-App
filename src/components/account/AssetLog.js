import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AssetSummary from './AssetSummary';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

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

const AccountAlias = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const AccountTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  letter-spacing: -0.5px;
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
  background: ${props => (props.active ? '#F8F9FA' : 'transparent')};
  border: 1px solid #E5E8EB;
  color: ${props => (props.active ? '#333' : '#666')};
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: ${props => (props.active ? '#F8F9FA' : '#f8f9fa50')};
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  padding: 16px;
  background: #ffebee;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
`;

const LoadingText = styled.div`
  font-size: 14px;
  color: #666;
`;

function AssetLog() {
  const navigate = useNavigate();
  const [accountData, setAccountData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('1주');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('jwtToken');
        console.log('Token exists:', !!token);
        
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // 1. 사용자 정보 가져오기
        console.log('Fetching user info...');
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
        console.log('User info response:', userResponse.data);
        
        const userData = userResponse.data;
        setUser(userData);
        
        const primaryAccountId = userData.primaryAccountId;
        console.log('Primary Account ID from user:', primaryAccountId);

        if (!primaryAccountId) {
          console.log('계좌 없음, 계좌 생성 페이지로 이동');
          navigate('/account');
          return;
        }

        // 2. 계좌 자산 정보 가져오기
        console.log('Fetching account assets for account:', primaryAccountId);
        const assetsResponse = await axios.get(`${API_BASE_URL}/account/assets`, {
          headers,
          params: {
            accountId: primaryAccountId
          }
        });

        console.log('Assets response:', assetsResponse.data);
        
        if (assetsResponse.data) {
          setAccountData({
            ...assetsResponse.data,
            accountId: primaryAccountId
          });
        } else {
          setError('자산 정보를 찾을 수 없습니다.');
        }

      } catch (error) {
        console.error('API 호출 중 에러 발생:', error);
        if (error.response?.status === 401) {
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('jwtToken');
          navigate('/login');
        } else if (error.response?.status === 404) {
          console.log('계좌 없음, 계좌 생성 페이지로 이동');
          navigate('/account');
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
  }, [navigate]);

  const formatKRW = amount => {
    if (!amount && amount !== 0) return '0원';
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW'
    }).format(amount).replace('₩', '') + '원';
  };

  const formatAccountNumber = (accountId) => {
    return `코코넛증권 ${accountId}`;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <LoadingText>로딩중...</LoadingText>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {accountData && (
          <>
            <AccountAlias>{accountData.accountAlias || '계좌'}</AccountAlias>
            <AccountTitle>{formatAccountNumber(accountData.accountId)}</AccountTitle>

            <MainContent>
              <Balance>{formatKRW(accountData.total_assets)}</Balance>
              <BalanceChange>지난주보다 0원 (0%)</BalanceChange>

              <TimePeriod>
                {['1주', '1달', '3달', '1년'].map(period => (
                  <TimeButton
                    key={period}
                    active={selectedPeriod === period}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </TimeButton>
                ))}
              </TimePeriod>

              <div style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                <div>주문 가능 금액: {formatKRW(accountData.deposit)}</div>
                <div>투자중인 금액: {formatKRW(accountData.invested_amount)}</div>
              </div>

              <AssetSummary
                krwBalance={formatKRW(accountData.deposit)}
                usdBalance="$0.00"
                onStockClick={stockId => navigate(`/stock/${stockId}`)}
              />
            </MainContent>
          </>
        )}
      </Container>
    </>
  );
}

export default AssetLog;