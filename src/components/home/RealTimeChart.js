import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import skImage from '../../assets/sk.png';
import samsungImage from '../../assets/samsung.png';
import naverImage from '../../assets/naver.png';


const GlobalStyle = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
 
 * {
   font-family: 'Noto Sans KR', sans-serif;
 }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const TimeStamp = styled.span`
  color: #8b95a1;
  font-size: 14px;
  font-weight: normal;
`;

const HideButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #4174f6;
  background: none;
  border: none;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;

  &:hover {
    background: rgba(65, 116, 246, 0.1);
  }

  &:before {
    content: '✓';
  }
`;

const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 16px;
`;

const Categories = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 16px;
  border-bottom: 1px solid #f2f2f2;
`;

const Category = styled.button`
  padding: 12px 4px;
  background: none;
  border: none;
  font-size: 14px;
  color: ${props => props.active ? '#333' : '#8b95a1'};
  font-weight: ${props => props.active ? '600' : '400'};
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.active ? '#333' : 'transparent'};
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: ${props => props.align || 'left'};
  padding: 12px 8px;
  color: #8b95a1;
  font-weight: 400;
  font-size: 13px;
`;

const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: ${props => props.color || '#333'};
  text-align: ${props => props.align || 'left'};
  border-top: 1px solid #f2f2f2;
`;

const RankNumber = styled.span`
  color: #4174f6;
  font-weight: 600;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }
`;

function RealTimeChart() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const stocks = [
    { rank: 1, name: 'SK하이닉스', image: skImage, price: 33250, change: 5450, changePercent: 19.6, volume: '15억원', shares: '46,379주' },
    { rank: 2, name: '삼성전자', image: samsungImage, price: 58000, change: 700, changePercent: 1.2, volume: '13억원', shares: '23,055주' },
    { rank: 3, name: '네이버', image: naverImage, price: 10750, change: 1050, changePercent: 10.8, volume: '6.2억원', shares: '58,274주' }
  ];

  const handleStockClick = (stock) => {
    navigate(`/stock/${stock.rank}`, { state: { stock } });
  };

  return (
    <Container>
      <HeaderWrapper>
        <TitleWrapper>
          <Title>실시간 차트</Title>
          <TimeStamp>오늘 {formatTime(currentTime)} 기준</TimeStamp>
        </TitleWrapper>
      </HeaderWrapper>

      <ChartContainer>
        <Categories>
          <Category active>코코넛증권 거래량</Category>
          <Category>급상승</Category>
          <Category>급하락</Category>
        </Categories>

        <Table>
          <thead>
            <tr>
              <Th>순위</Th>
              <Th>종목</Th>
              <Th align="right">현재가</Th>
              <Th align="right">등락률</Th>
              <Th align="right">거래대금</Th>
              <Th align="right">거래량</Th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.rank} onClick={() => handleStockClick(stock)}>
                <Td>
                  <RankNumber>{stock.rank}</RankNumber>
                </Td>
                <Td>
                  <StockInfo>
                    <img src={stock.image} alt={stock.name} />
                    <span>{stock.name}</span>
                  </StockInfo>
                </Td>
                <Td align="right">{stock.price.toLocaleString()}원</Td>
                <Td 
                  align="right"
                  color={stock.change > 0 ? '#f45e47' : '#4174f6'}
                >
                  {stock.change > 0 ? '+' : ''}{stock.change.toLocaleString()}원 
                  ({stock.change > 0 ? '+' : ''}{stock.changePercent}%)
                </Td>
                <Td align="right">{stock.volume}</Td>
                <Td align="right">{stock.shares}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </ChartContainer>
    </Container>
  );
}

export default RealTimeChart;
