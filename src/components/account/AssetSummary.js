import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Decimal from 'decimal.js';

// 필요한 이미지 import
import skImage from '../../assets/sk.png';
import samsungImage from '../../assets/samsung.png';
import naverImage from '../../assets/naver.png';
import lgImage from '../../assets/lg.png';

// styled-components 정의
const SummaryContainer = styled.div`
  background: #ffffff;
  border-left: 1px solid #eee;
  padding: 24px;
  box-sizing: border-box;
  height: calc(100vh - 64px);
  overflow-y: auto;
  position: sticky;
  top: 64px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e5e8eb;
    border-radius: 3px;
  }
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const Balance = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const BalanceChange = styled.div`
  font-size: 14px;
  color: ${props => (props.value < 0 ? '#4788ff' : '#ff4747')};
  margin-bottom: 24px;
`;

const StockList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StockItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: white;
  cursor: pointer;
  &:hover {
    background: #f8f9fa;
  }
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StockLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: contain;
`;

const StockDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const StockName = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const StockShares = styled.div`
  font-size: 13px;
  color: #666;
`;

const StockValues = styled.div`
  text-align: right;
`;

const StockPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const PriceChange = styled.div`
  font-size: 13px;
  color: ${props => (props.isPositive ? '#ff4747' : '#4788ff')};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`;

const LoadingItem = styled.div`
  height: 60px;
  background: #f8f9fa;
  border-radius: 12px;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4747;
  padding: 24px;
  text-align: center;
`;

// 주식 코드를 URL용 이름으로 매핑
const STOCK_CODE_TO_ID = {
  '000660': 'skhynix',    // SK하이닉스
  '005930': 'samsung',    // 삼성전자
  '035420': 'naver',      // 네이버
  '373220': 'lgenergyso', // LG에너지솔루션
  '003550': 'lgcorp',     // LG
  '051910': 'lgchem'      // LG화학
};

const InvestmentSummary = () => {
  const [investments, setInvestments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 이미지 매핑 객체
  const stockImages = {
    '000660': skImage,
    '005930': samsungImage,
    '035420': naverImage,
    '003550': lgImage,
  };

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');

        if (!token) {
          setError('로그인이 필요한 서비스입니다.');
          return;
        }

        const response = await fetch('http://localhost:8080/api/v1/account/investment', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('jwtToken');
            navigate('/login');
            return;
          }
          throw new Error('투자 정보를 불러오는데 실패했습니다');
        }

        const data = await response.json();
        
        const formattedInvestments = data.map(stock => {
          // 주식 코드를 URL용 이름으로 변환
          const urlId = STOCK_CODE_TO_ID[stock.stockCode] || stock.stockCode.toLowerCase();
          
          return {
            stockCode: stock.stockCode,        // 원본 주식 코드
            urlId: urlId,                      // URL에 사용할 ID
            name: stock.stockName,
            logo: stockImages[stock.stockCode] || skImage,
            shares: `${stock.quantity}주`,
            value: new Decimal(stock.price).times(stock.quantity).toNumber(),
            change: new Decimal(stock.profit).toNumber(),
            changePercent: new Decimal(stock.profitPercent).toNumber()
          };
        });

        setInvestments(formattedInvestments);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestments();
  }, [navigate]);

  const calculateTotal = () => {
    if (!investments.length) return { total: 0, change: 0, changePercent: 0 };
    
    const totalValue = investments.reduce((sum, stock) => sum + stock.value, 0);
    const totalChange = investments.reduce((sum, stock) => sum + stock.change, 0);
    const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

    return {
      total: totalValue,
      change: totalChange,
      changePercent: totalChangePercent
    };
  };

  if (isLoading) {
    return (
      <SummaryContainer>
        <LoadingContainer>
          <LoadingItem />
          <LoadingItem />
          <LoadingItem />
        </LoadingContainer>
      </SummaryContainer>
    );
  }

  if (error) {
    return (
      <SummaryContainer>
        <ErrorMessage>{error}</ErrorMessage>
      </SummaryContainer>
    );
  }

  const { total, change, changePercent } = calculateTotal();

  return (
    <SummaryContainer>
      <Title>내 투자</Title>
      <Balance>{total.toLocaleString()}원</Balance>
      <BalanceChange value={change}>
        {change > 0 ? '+' : ''}{change.toLocaleString()}원 
        ({change > 0 ? '+' : ''}{changePercent.toFixed(1)}%)
      </BalanceChange>
      
      <StockList>
        {investments.map(stock => (
          <StockItem 
            key={stock.stockCode} 
            onClick={() => navigate(`/stock/${stock.urlId}`)}
          >
            <StockInfo>
              <StockLogo src={stock.logo} alt={stock.name} />
              <StockDetails>
                <StockName>{stock.name}</StockName>
                <StockShares>{stock.shares}</StockShares>
              </StockDetails>
            </StockInfo>
            <StockValues>
              <StockPrice>{stock.value.toLocaleString()}원</StockPrice>
              <PriceChange isPositive={stock.change > 0}>
                {stock.change > 0 ? '+' : ''}
                {stock.change.toLocaleString()}원 
                ({stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%)
              </PriceChange>
            </StockValues>
          </StockItem>
        ))}
      </StockList>
    </SummaryContainer>
  );
};

export default InvestmentSummary;