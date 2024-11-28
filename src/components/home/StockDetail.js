import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import StockChart from './StockChart';
import skLogo from '../../assets/sk.png';
import samsungLogo from '../../assets/samsung.png';
import naverLogo from '../../assets/naver.png';

const mockChartData = [
  { time: '1', open: 17400, high: 17800, low: 17300, close: 17750, volume: 356971, buyVolume: 250000, sellVolume: 106971 },
  { time: '2', open: 17750, high: 18200, low: 17600, close: 18050, volume: 423452, buyVolume: 323452, sellVolume: 100000 },
  { time: '3', open: 18050, high: 18500, low: 17900, close: 18400, volume: 512345, buyVolume: 412345, sellVolume: 100000 },
  { time: '4', open: 18400, high: 18600, low: 18000, close: 18100, volume: 602345, buyVolume: 202345, sellVolume: 400000 },
  { time: '5', open: 18100, high: 18300, low: 17800, close: 17950, volume: 669234, buyVolume: 269234, sellVolume: 400000 },
  { time: '6', open: 17950, high: 18200, low: 17750, close: 18100, volume: 445532, buyVolume: 345532, sellVolume: 100000 },
  { time: '7', open: 18100, high: 18800, low: 18000, close: 18600, volume: 645742, buyVolume: 545742, sellVolume: 100000 },
  { time: '8', open: 18600, high: 19200, low: 18500, close: 19100, volume: 756742, buyVolume: 656742, sellVolume: 100000 },
  { time: '9', open: 19100, high: 19500, low: 18900, close: 19000, volume: 825742, buyVolume: 425742, sellVolume: 400000 },
  { time: '10', open: 19000, high: 19200, low: 18500, close: 18650, volume: 672345, buyVolume: 272345, sellVolume: 400000 },
  { time: '11', open: 18650, high: 19000, low: 18400, close: 18850, volume: 556742, buyVolume: 456742, sellVolume: 100000 },
  { time: '12', open: 18850, high: 19400, low: 18700, close: 19300, volume: 745652, buyVolume: 645652, sellVolume: 100000 },
  { time: '13', open: 19300, high: 20000, low: 19100, close: 19800, volume: 856345, buyVolume: 756345, sellVolume: 100000 },
  { time: '14', open: 19800, high: 20500, low: 19600, close: 20300, volume: 965234, buyVolume: 865234, sellVolume: 100000 },
  { time: '15', open: 20300, high: 20800, low: 20100, close: 20200, volume: 875742, buyVolume: 475742, sellVolume: 400000 },
  { time: '16', open: 20200, high: 20500, low: 19800, close: 20000, volume: 812345, buyVolume: 312345, sellVolume: 500000 },
  { time: '17', open: 20000, high: 20400, low: 19800, close: 20300, volume: 745600, buyVolume: 445600, sellVolume: 300000 },
  { time: '18', open: 20300, high: 21000, low: 20200, close: 20800, volume: 925700, buyVolume: 825700, sellVolume: 100000 },
  { time: '19', open: 20800, high: 21500, low: 20500, close: 21300, volume: 1056700, buyVolume: 956700, sellVolume: 100000 },
  { time: '20', open: 21300, high: 21800, low: 21000, close: 21200, volume: 987600, buyVolume: 487600, sellVolume: 500000 },
  { time: '21', open: 21200, high: 21400, low: 20800, close: 21000, volume: 856700, buyVolume: 356700, sellVolume: 500000 },
  { time: '22', open: 21000, high: 21600, low: 20900, close: 21500, volume: 876500, buyVolume: 676500, sellVolume: 200000 },
  { time: '23', open: 21500, high: 22000, low: 21400, close: 21800, volume: 945600, buyVolume: 845600, sellVolume: 100000 },
  { time: '24', open: 21800, high: 22500, low: 21600, close: 22300, volume: 1075600, buyVolume: 975600, sellVolume: 100000 },
  { time: '25', open: 22300, high: 23000, low: 22000, close: 22500, volume: 1156700, buyVolume: 956700, sellVolume: 200000 },
  { time: '26', open: 22500, high: 23200, low: 22300, close: 23000, volume: 1234500, buyVolume: 1045000, sellVolume: 190000 },
  { time: '27', open: 23000, high: 23500, low: 22700, close: 22800, volume: 987000, buyVolume: 487000, sellVolume: 500000 },
  { time: '28', open: 22800, high: 23000, low: 22400, close: 22500, volume: 945600, buyVolume: 445600, sellVolume: 500000 },
  { time: '29', open: 22500, high: 22800, low: 22000, close: 22200, volume: 876500, buyVolume: 376500, sellVolume: 500000 },
  { time: '30', open: 22200, high: 23000, low: 22100, close: 22900, volume: 1056700, buyVolume: 856700, sellVolume: 200000 },
  { time: '31', open: 22900, high: 23500, low: 22700, close: 23300, volume: 1156700, buyVolume: 1056700, sellVolume: 100000 },
];


const mockAskPrices = [
  { price: 84300, quantity: 2358 },
  { price: 84200, quantity: 1567 },
  { price: 84100, quantity: 3242 },
  { price: 84000, quantity: 4521 },
  { price: 83900, quantity: 2876 },
];

const mockBidPrices = [
  { price: 83800, quantity: 3654 },
  { price: 83700, quantity: 2987 },
  { price: 83600, quantity: 1876 },
  { price: 83500, quantity: 2543 },
  { price: 83400, quantity: 1932 },
];

const mockTradeData = [
  { price: 84000, quantity: 121, change: 1.98, volume: 1873750, time: '13:37:12' },
  { price: 83900, quantity: 235, change: 1.86, volume: 1873629, time: '13:37:08' },
  { price: 83900, quantity: 95, change: 1.86, volume: 1873394, time: '13:37:05' },
  { price: 84000, quantity: 178, change: 1.98, volume: 1873299, time: '13:37:01' },
  { price: 83800, quantity: 324, change: 1.74, volume: 1873121, time: '13:36:58' },
];

const Container = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 12px;
  }
`;

const StockInfoContainer = styled.div`
  flex: 3;
  background: #ffffff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const OrderBoxContainer = styled.div`
  flex: 1;
  min-width: 320px;
  background: #ffffff;
  border-radius: 24px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: #333;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const StockLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #e0e0e0;
  object-fit: cover;
`;

const StockInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const StockTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const StockCode = styled.span`
  font-size: 14px;
  color: #8b95a1;
`;

const StockPrice = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 16px 0;
`;

const Tags = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  font-size: 12px;
  padding: 4px 8px;
  background-color: #f2f2f2;
  border-radius: 12px;
  color: #8b95a1;
`;

const ChartContainer = styled.div`
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> f3846cd6b0455ab4c91ae1d4e6702747a7ab9e82
  width: 100%;
  height: 450px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 20px 0;
  padding: 16px;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    height: 350px;
    padding: 8px;
  }
<<<<<<< HEAD
=======
=======
>>>>>>> f3846cd6b0455ab4c91ae1d4e6702747a7ab9e82
  width: 95%;
  height: 100%;
  max-height: 400px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
<<<<<<< HEAD
  overflow: hidden; // 추가
  transform: translateZ(0); // 추가
  will-change: transform; // 추가
>>>>>>> 1cc253567d1629fabc555f9096879e703085832a
=======
  overflow: hidden;
  transform: translateZ(0); 
  will-change: transform; 
>>>>>>> f3846cd6b0455ab4c91ae1d4e6702747a7ab9e82
`;

const TableContainer = styled.div`
  margin-top: 20px;
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 16px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: ${(props) => props.align || 'left'};
  padding: 12px 8px;
  color: #8b95a1;
  font-weight: 400;
  font-size: 13px;
`;

const Td = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: ${(props) => props.color || '#333'};
  text-align: ${(props) => props.align || 'left'};
  border-top: 1px solid #f2f2f2;
`;

const OrderTypeContainer = styled.div`
  display: flex;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 4px;
  height: 48px;
`;

const OrderTypeButton = styled.button`
  flex: 1;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: ${(props) => (props.active ? '#333' : '#8B95A1')};
  cursor: pointer;
  box-shadow: ${(props) => (props.active ? '0px 1px 3px rgba(0, 0, 0, 0.1)' : 'none')};
  transition: all 0.2s ease;
`;

const PriceTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;

  button {
    flex: 1;
    height: 48px;
    padding: 0;
    border: none;
    border-radius: 14px;
    background: #F2F4F6;
    font-size: 15px;
    color: #8B95A1;
    cursor: pointer;

    &.active {
      color: #333;
    }
  }
`;

const PriceInput = styled.div`
  width: 90%;
  height: 48px;
  display: flex;
  align-items: center;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 0 16px;

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15px;
    text-align: right;
    color: #333;
    
    &:focus {
      outline: none;
    }
  }

  span {
    color: #333;
    margin-left: 4px;
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 48px;

  span {
    font-size: 15px;
    color: #333;
    min-width: 40px;
  }
`;

const QuantityInputContainer = styled.div`
  flex: 1;
  height: 48px;
  display: flex;
  align-items: center;
  background: #F2F4F6;
  border-radius: 14px;
  padding: 0 8px;

  input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 15px;
    text-align: right;
    color: #333;
    padding: 0 8px;
    
    &:focus {
      outline: none;
    }
  }

  button {
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    color: #8B95A1;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const PercentageContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

const PercentButton = styled.button`
  flex: 1;
  height: 48px;
  border: 1px solid #E5E8EB;
  border-radius: 10px;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #F8F9FA;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #F2F4F6;
  border-bottom: 1px solid #F2F4F6;
  
  div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #666;
  }
`;

const OrderButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: ${(props) => (props.buy ? '#FF4D4D' : '#4D4DFF')};
  color: white;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${(props) => (props.buy ? '#FF3B3B' : '#3B4DFF')};
  }
`;

function StockDetail() {
  const location = useLocation();
  const stock = location.state?.stock;
  const stockCode = stock?.code || '064350';

  const [orderType, setOrderType] = useState('buy');
  const [priceType, setPriceType] = useState('limit');
  const [orderPrice, setOrderPrice] = useState(stock?.price || 63300);
  const [quantity, setQuantity] = useState(0);
  const [account, setAccount] = useState({
    balance: 10000000, // 1천만원
    stocks: {
      [stockCode]: {
        quantity: 100,
        averagePrice: 83000,
      },
    },
  });

  const currentStock = account.stocks[stockCode];

  if (!stock) {
    return <div>주식 정보를 불러오는 중입니다...</div>;
  }

  // 주문 가능 수량 계산
  const getMaxQuantity = () => {
    return orderType === 'buy'
      ? Math.floor(account.balance / orderPrice)
      : currentStock.quantity;
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (value) => {
    const maxQty = getMaxQuantity();
    const newQty = Math.max(0, Math.min(value, maxQty));
    setQuantity(newQty);
  };

  // 퍼센트 버튼 핸들러
  const handlePercentage = (percent) => {
    const maxQty = getMaxQuantity();
    const newQty = Math.floor(maxQty * (percent / 100));
    setQuantity(newQty);
  };

  // 주문 처리
  const handleOrder = () => {
    if (quantity === 0) {
      alert('주문 수량을 입력해주세요.');
      return;
    }

    const totalAmount = orderPrice * quantity;

    if (orderType === 'buy') {
      if (totalAmount > account.balance) {
        alert('잔액이 부족합니다.');
        return;
      }

      // 구매 처리
      setAccount((prev) => {
        const newTotalQty = currentStock.quantity + quantity;
        const newAveragePrice =
          (currentStock.quantity * currentStock.averagePrice + quantity * orderPrice) / newTotalQty;

        return {
          ...prev,
          balance: prev.balance - totalAmount,
          stocks: {
            ...prev.stocks,
            [stockCode]: {
              quantity: newTotalQty,
              averagePrice: newAveragePrice,
            },
          },
        };
      });

      alert(`${quantity}주 매수 주문이 완료되었습니다.`);
    } else if (orderType === 'sell') {
      if (quantity > currentStock.quantity) {
        alert('보유 수량이 부족합니다.');
        return;
      }

      // 판매 처리
      setAccount((prev) => {
        const newQty = currentStock.quantity - quantity;

        return {
          ...prev,
          balance: prev.balance + totalAmount,
          stocks: {
            ...prev.stocks,
            [stockCode]: {
              quantity: newQty,
              averagePrice: newQty === 0 ? 0 : currentStock.averagePrice,
            },
          },
        };
      });

      alert(`${quantity}주 매도 주문이 완료되었습니다.`);
    }

    // 주문 완료 후 초기화
    setQuantity(0);
  };

  return (
    <Container>
      <StockInfoContainer>
      <Header>
      <StockLogo
        as="img"
        src={
          stock.name === 'SK하이닉스'
            ? skLogo
            : stock.name === '삼성전자'
            ? samsungLogo
            : naverLogo
        }
        alt={stock.name}
      />
      <StockInfo>
        <StockTitle>{stock.name}</StockTitle>
        <StockCode>{stock.code}</StockCode>
      </StockInfo>
    </Header>
        <StockPrice>{stock.price.toLocaleString()}원</StockPrice>
        <Tags>
          <Tag>차트</Tag>
          <Tag>호가</Tag>
          <Tag>종목정보</Tag>
        </Tags>

        <ChartContainer>
          <StockChart data={mockChartData} />
        </ChartContainer>

        {/* 호가 정보 */}
        <TableContainer>
          <TableHeader>
            <div>호가 정보</div>
          </TableHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <DataTable style={{ width: '48%' }}>
              <thead>
                <tr>
                  <Th>매도호가</Th>
                  <Th align="right">잔량</Th>
                </tr>
              </thead>
              <tbody>
                {mockAskPrices.map((item, i) => (
                  <tr key={i}>
                    <Td
                      color={orderPrice === item.price ? '#FF4D4D' : undefined}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOrderPrice(item.price)}
                    >
                      {item.price.toLocaleString()}원
                    </Td>
                    <Td align="right">{item.quantity.toLocaleString()}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
            <DataTable style={{ width: '48%' }}>
              <thead>
                <tr>
                  <Th>매수호가</Th>
                  <Th align="right">잔량</Th>
                </tr>
              </thead>
              <tbody>
                {mockBidPrices.map((item, i) => (
                  <tr key={i}>
                    <Td
                      color={orderPrice === item.price ? '#FF4D4D' : undefined}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setOrderPrice(item.price)}
                    >
                      {item.price.toLocaleString()}원
                    </Td>
                    <Td align="right">{item.quantity.toLocaleString()}</Td>
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>
        </TableContainer>

        {/* 체결 내역 */}
        <TableContainer>
          <TableHeader>
            <div>일별 · 실시간 시세</div>
            <div>실시간</div>
          </TableHeader>
          <DataTable>
            <thead>
              <tr>
                <Th>체결가</Th>
                <Th align="right">체결량(주)</Th>
                <Th align="right">등락률</Th>
                <Th align="right">거래량(주)</Th>
                <Th align="right">시간</Th>
              </tr>
            </thead>
            <tbody>
              {mockTradeData.map((trade, i) => (
                <tr key={i}>
                  <Td>{trade.price.toLocaleString()}원</Td>
                  <Td align="right">{trade.quantity}</Td>
                  <Td align="right" color={trade.change >= 0 ? '#FF4D4D' : '#4D4DFF'}>
                    {trade.change >= 0 ? '+' : ''}
                    {trade.change}%
                  </Td>
                  <Td align="right">{trade.volume.toLocaleString()}</Td>
                  <Td align="right">{trade.time}</Td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </TableContainer>
      </StockInfoContainer>

      <OrderBoxContainer>
        <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0' }}>주문하기</h3>

        <OrderTypeContainer>
          <OrderTypeButton
            active={orderType === 'buy'}
            onClick={() => {
              setOrderType('buy');
              setQuantity(0);
            }}
          >
            구매
          </OrderTypeButton>
          <OrderTypeButton
            active={orderType === 'sell'}
            onClick={() => {
              setOrderType('sell');
              setQuantity(0);
            }}
          >
            판매
          </OrderTypeButton>
        </OrderTypeContainer>

        <PriceTypeContainer>
          <button
            className={priceType === 'limit' ? 'active' : ''}
            onClick={() => setPriceType('limit')}
          >
            지정가
          </button>
          <button
            className={priceType === 'market' ? 'active' : ''}
            onClick={() => setPriceType('market')}
          >
            시장가
          </button>
        </PriceTypeContainer>

        <PriceInput>
          <input type="text" value={orderPrice.toLocaleString()} readOnly />
          <span>원</span>
        </PriceInput>

        <QuantityContainer>
          <span>수량</span>
          <QuantityInputContainer>
            <button onClick={() => handleQuantityChange(quantity - 1)}>-</button>
            <input
              type="number"
              value={quantity}
              min="0"
              step="1"
              onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 0)}
            />
            <button onClick={() => handleQuantityChange(quantity + 1)}>+</button>
          </QuantityInputContainer>
        </QuantityContainer>

        <PercentageContainer>
          <PercentButton onClick={() => handlePercentage(10)}>10%</PercentButton>
          <PercentButton onClick={() => handlePercentage(25)}>25%</PercentButton>
          <PercentButton onClick={() => handlePercentage(50)}>50%</PercentButton>
          <PercentButton onClick={() => handlePercentage(100)}>최대</PercentButton>
        </PercentageContainer>

        <InfoList>
          <div>
            <span>내 보유량</span>
            <span>{currentStock.quantity}주</span>
          </div>
          <div>
            <span>내 주식 평균가</span>
            <span>{currentStock.averagePrice.toLocaleString()}원</span>
          </div>
          <div>
            <span>{orderType === 'buy' ? '주문 가능 금액' : '보유 수량'}</span>
            <span>
              {orderType === 'buy'
                ? `${account.balance.toLocaleString()}원`
                : `${currentStock.quantity}주`}
            </span>
          </div>
          <div>
            <span>총 주문 금액</span>
            <span>{(orderPrice * quantity).toLocaleString()}원</span>
          </div>
        </InfoList>

        <OrderButton onClick={handleOrder} buy={orderType === 'buy'}>
          {orderType === 'buy' ? '구매하기' : '판매하기'}
        </OrderButton>
      </OrderBoxContainer>
    </Container>
  );
}

export default StockDetail;
