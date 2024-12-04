import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import koreaFlag from '../../assets/korea.png';

const ChartContainer = styled.div`
  background: #ffffff;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 40px;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
`;

const MarketHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const MarketName = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FlagImage = styled.img`
  width: 24px;
  height: 16px;
  margin-top: 4px;
`;

const Price = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const Change = styled.div`
  font-size: 14px;
  color: ${props => {
    if (props.value === 0) return '#333';
    return props.value > 0 ? '#ff4747' : '#4788ff';
  }};
  margin-top: 4px;
`;

const ChartSection = styled.div`
  flex: 1;
  height: 70px;
  position: relative;
  overflow: hidden;
`;

const IndexChart = ({ name, isKospi = true }) => {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [marketData, setMarketData] = useState({
    value: 0,
    change: 0,
    changePercent: 0
  });
  const wsRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);

  // 오늘 날짜의 데이터인지 확인하는 함수
  const isToday = (date) => {
    const today = new Date();
    const itemDate = new Date(date);
    return (
      itemDate.getDate() === today.getDate() &&
      itemDate.getMonth() === today.getMonth() &&
      itemDate.getFullYear() === today.getFullYear()
    );
  };

  // 장 마감 여부 확인
  const isMarketClosed = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return (hours > 15) || (hours === 15 && minutes >= 20);
  };

  // 과거 데이터 로드
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const stockCode = isKospi ? '0001' : '1001';
        const response = await fetch(`http://localhost:8080/api/v1/stock/${stockCode}/charts/1min`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          console.log('No data available');
          setIsLoading(false);
          return;
        }

        const todayData = data
          .filter(item => isToday(item.time))
          .map(item => ({
            time: new Date(item.time).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit'
            }),
            value: parseFloat(item.currentPrice)
          }))
          .sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
          });

        if (todayData.length > 0) {
          setChartData(todayData);
          const lastPrice = todayData[todayData.length - 1].value;
          
          if (isMarketClosed()) {
            setMarketData({
              value: lastPrice,
              change: 0,
              changePercent: 0
            });
          } else {
            const firstPrice = todayData[0].value;
            const change = lastPrice - firstPrice;
            const changePercent = (change / firstPrice) * 100;
            setMarketData({
              value: lastPrice,
              change,
              changePercent
            });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
    
    // 마감 시간 체크를 위한 interval 설정
    const checkMarketClose = () => {
      if (isMarketClosed() && !isClosed) {
        setIsClosed(true);
        if (wsRef.current) {
          wsRef.current.close();
        }
      }
    };

    const interval = setInterval(checkMarketClose, 1000);
    return () => clearInterval(interval);
  }, [isKospi, isClosed]);

  // WebSocket 연결
  useEffect(() => {
    if (isLoading || isMarketClosed()) return;

    const stockCode = isKospi ? '0001' : '1001';
    const connectWebSocket = () => {
      wsRef.current = new WebSocket(`ws://localhost:8080/ws/stock/${stockCode}`);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          const timeStr = newData.time;
          const formattedTime = `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`;
          const currentPrice = parseFloat(newData.currentPrice);

          setChartData(prevData => {
            const newPoint = {
              time: formattedTime,
              value: currentPrice
            };

            const updatedData = [...prevData];
            if (updatedData.length > 0 && updatedData[updatedData.length - 1].time === formattedTime) {
              updatedData[updatedData.length - 1] = newPoint;
            } else {
              updatedData.push(newPoint);
            }

            if (!isMarketClosed()) {
              const firstPrice = updatedData[0].value;
              const change = currentPrice - firstPrice;
              const changePercent = (change / firstPrice) * 100;
              setMarketData({
                value: currentPrice,
                change,
                changePercent
              });
            }

            return updatedData;
          });
        } catch (error) {
          console.error('Error processing WebSocket data:', error);
        }
      };

      wsRef.current.onclose = () => {
        if (!isMarketClosed()) {
          console.log('WebSocket Disconnected, attempting to reconnect...');
          setTimeout(connectWebSocket, 3000);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket Error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isLoading, isKospi]);

  const handleClick = () => {
    navigate(isKospi ? '/chart/kospi' : '/chart/kosdaq');
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'rgba(0, 0, 0, 0.8)',
          padding: '8px',
          borderRadius: '4px',
          color: 'white',
          fontSize: '12px'
        }}>
          <div style={{ color: '#999' }}>{payload[0].payload.time}</div>
          <div style={{ fontWeight: '600' }}>{payload[0].value.toFixed(2)}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <ChartContainer onClick={handleClick}>
      <InfoSection>
        <MarketHeader>
          <MarketName>
            {name}
            <FlagImage src={koreaFlag} alt="Korea Flag" />
          </MarketName>
        </MarketHeader>
        <Price>
          {marketData.value.toFixed(2)}
        </Price>
        <Change value={marketData.change}>
          {marketData.change > 0 ? '+' : ''}
          {marketData.change.toFixed(2)} ({marketData.changePercent.toFixed(2)}%)
        </Change>
      </InfoSection>

      <ChartSection>
        <ResponsiveContainer width="99%" height="99%" debounce={50}>
          <LineChart data={chartData}>
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={false}
            />
            <Line
              type="monotoneX"
              dataKey="value"
              stroke="#ff4747"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              connectNulls={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartSection>
    </ChartContainer>
  );
};

export default IndexChart;