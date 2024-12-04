import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import skImage from '../../assets/sk.png';
import samsungImage from '../../assets/samsung.png';
import bumyangImage from '../../assets/bumyang.png';
import daedongImage from '../../assets/daedong.png';
import kumhoImage from '../../assets/kumho.png';
import bitnineImage from '../../assets/bitnine.png';
import mgameImage from '../../assets/mgame.png';
import lgImage from '../../assets/lg.png';
import rfmaterialsImage from '../../assets/rfmaterials.png';

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
  vertical-align: middle;
`;

const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: ${props => props.color || '#333'};
  text-align: ${props => props.align || 'left'};
  border-top: 1px solid #f2f2f2;
  vertical-align: middle;
`;

const RankNumber = styled.span`
  color: #333;
  font-weight: 600;
  display: block;
  text-align: center;
`;

const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 36px;  /* 로고 크기 수정 */
    height: 36px;  /* 로고 크기 수정 */
    border-radius: 12px;  /* 로고 모서리 약간만 둥글게 */
  }
`;
const RealTimeChart = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeCategory, setActiveCategory] = useState('volume');

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

  const volumeStocks = [
    { 
      id: 'skhynix', 
      code: '000660',  // 종목코드 추가
      rank: 1, 
      name: 'SK하이닉스', 
      image: skImage, 
      price: 33250, 
      change: 5450, 
      changePercent: 19.6, 
      volume: '15억원', 
      shares: '1,546,379주' 
    },
    { 
      id: 'samsung', 
      code: '005930',  // 종목코드 추가
      rank: 2, 
      name: '삼성전자', 
      image: samsungImage, 
      price: 58000, 
      change: 700, 
      changePercent: 1.2, 
      volume: '13억원', 
      shares: '1,223,055주' 
    },
    { 
      id: 'lg', 
      code: '066570',  // 종목코드 추가
      rank: 3, 
      name: 'LG전자', 
      image: lgImage, 
      price: 10750, 
      change: 1050, 
      changePercent: 10.8, 
      volume: '6.2억원', 
      shares: '858,274주' 
    },
  ];

  const risingStocks = [
    { id: 'kumho', rank: 1, name: '금호건설우', image: kumhoImage, price: 9710, change: 2240, changePercent: 29.9, volume: '1.5억원', shares: '15,416주' },
    { id: 'bumyang', rank: 2, name: '범양건영', image: bumyangImage, price: 3165, change: 730, changePercent: 29.9, volume: '343억원', shares: '11,797,183주' },
    { id: 'daedong', rank: 3, name: '대동기어', image: daedongImage, price: 10800, change: 2490, changePercent: 29.9, volume: '605억원', shares: '6,325,739주' },
 ];

  const fallingStocks = [
    { id: 'bitnine', rank: 1, name: '비트나인', image: bitnineImage, price: 2730, change: -575, changePercent: -17.3, volume: '175억원', shares: '6,079,107주' },
    { id: 'mgame', rank: 2, name: '엠게임', image: mgameImage, price: 5690, change: -1090, changePercent: -16.0, volume: '88억원', shares: '1,451,491주' },
    { id: 'rfmaterials', rank: 3, name: 'RF머트리얼즈', image: rfmaterialsImage, price: 5380, change: -950, changePercent: -15.0, volume: '9.1억원', shares: '159,938주' },
 ];

  const getStocksForCategory = () => {
    switch (activeCategory) {
      case 'volume':
        return volumeStocks;
      case 'rising':
        return risingStocks;
      case 'falling':
        return fallingStocks;
      default:
        return volumeStocks;
    }
  };

  const handleStockClick = (stock) => {
    navigate(`/stock/${stock.code}`, { state: { stock } });
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
          <Category 
            active={activeCategory === 'volume'} 
            onClick={() => setActiveCategory('volume')}
          >
            코코넛증권 거래량
          </Category>
          <Category 
            active={activeCategory === 'rising'} 
            onClick={() => setActiveCategory('rising')}
          >
            급상승
          </Category>
          <Category 
            active={activeCategory === 'falling'} 
            onClick={() => setActiveCategory('falling')}
          >
            급하락
          </Category>
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
            {getStocksForCategory().map((stock) => (
              <tr key={stock.id}>
                <Td>
                  <RankNumber>{stock.rank}</RankNumber>
                </Td>
                <Td>
                  <StockInfo onClick={() => handleStockClick(stock)}>
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
};

export default RealTimeChart;