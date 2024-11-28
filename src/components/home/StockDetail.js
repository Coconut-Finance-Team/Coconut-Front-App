import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import * as S from './StockDetailStyles';
import skLogo from '../../assets/sk.png';

function StockDetail() {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('chart');
  const [timeframe, setTimeframe] = useState('1min');
  const [orderType, setOrderType] = useState('buy');
  const [orderPrice, setOrderPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [primaryAccountId, setPrimaryAccountId] = useState(null);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0 });
  
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const ma5SeriesRef = useRef(null);
  const ma10SeriesRef = useRef(null);
  const ma20SeriesRef = useRef(null);
  const wsRef = useRef(null);
  const currentCandleRef = useRef(null);

  const parseAndFormatData = (data) => ({
    time: data.time ? Math.floor(new Date(data.time).getTime() / 1000) : 
      Math.floor(new Date().getTime() / 1000),
    open: parseFloat(data.openPrice),
    high: parseFloat(data.highPrice),
    low: parseFloat(data.lowPrice),
    close: parseFloat(data.currentPrice),
    volume: parseFloat(data.contingentVol)
  });

  const parseWSData = (data) => {
    const [hours, minutes, seconds] = [
      data.time.slice(0, 2),
      data.time.slice(2, 4),
      data.time.slice(4, 6)
    ].map(Number);

    const now = new Date();
    now.setHours(hours, minutes, seconds, 0);

    return {
      time: Math.floor(now.getTime() / 1000),
      open: parseFloat(data.openPrice),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      close: parseFloat(data.currentPrice),
      volume: parseFloat(data.contingentVol)
    };
  };

  const processCandles = (data, interval) => {
    const periodSeconds = interval === '1min' ? 60 : 600;
    const groupedData = {};

    data.forEach(candle => {
      const periodTimestamp = Math.floor(candle.time / periodSeconds) * periodSeconds;
      
      if (!groupedData[periodTimestamp]) {
        groupedData[periodTimestamp] = {
          time: periodTimestamp,
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
          volume: candle.volume
        };
      } else {
        const existing = groupedData[periodTimestamp];
        existing.high = Math.max(existing.high, candle.high);
        existing.low = Math.min(existing.low, candle.low);
        existing.close = candle.close;
        existing.volume += candle.volume;
      }
    });

    return Object.values(groupedData).sort((a, b) => a.time - b.time);
  };

  const calculateMA = (data, period) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) continue;
      
      const sum = data.slice(i - period + 1, i + 1)
        .reduce((acc, cur) => acc + cur.close, 0);
      
      result.push({
        time: data[i].time,
        value: sum / period
      });
    }
    return result;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { color: '#ffffff' },
        textColor: '#333333',
        fontFamily: 'Noto Sans KR',
      },
      grid: {
        vertLines: { color: 'rgba(240, 243, 250, 0.5)' },
        horzLines: { color: 'rgba(240, 243, 250, 0.5)' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: '#C4C4C4',
          width: 0.5,
          style: 1,
        },
        horzLine: {
          color: '#C4C4C4',
          width: 0.5,
          style: 1,
        },
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        autoScale: true,  // 자동 스케일링
        mode: 2,  // 가격 스케일 모드
        alignLabels: true,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#ff4747',
      downColor: '#4788ff',
      borderUpColor: '#ff4747',
      borderDownColor: '#4788ff',
      wickUpColor: '#ff4747',
      wickDownColor: '#4788ff',
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 50,
      },
    });

    const volumeSeries = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const ma5Series = chart.addLineSeries({
      color: 'rgba(255, 82, 82, 0.8)',
      lineWidth: 1,
      title: 'MA5',
    });

    const ma10Series = chart.addLineSeries({
      color: 'rgba(66, 133, 244, 0.8)',
      lineWidth: 1,
      title: 'MA10',
    });

    const ma20Series = chart.addLineSeries({
      color: 'rgba(251, 188, 4, 0.8)',
      lineWidth: 1,
      title: 'MA20',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    ma5SeriesRef.current = ma5Series;
    ma10SeriesRef.current = ma10Series;
    ma20SeriesRef.current = ma20Series;

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/stock/${stockId}/charts/${timeframe}`);
        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
          setIsLoading(false);
          return;
        }

        const parsedData = data.map(parseAndFormatData);
        const processedData = processCandles(parsedData, timeframe);

        // 이동평균선 계산
        const ma5Data = calculateMA(processedData, 5);
        const ma10Data = calculateMA(processedData, 10);
        const ma20Data = calculateMA(processedData, 20);

        // 데이터 설정
        candleSeriesRef.current.setData(processedData);
        ma5SeriesRef.current.setData(ma5Data);
        ma10SeriesRef.current.setData(ma10Data);
        ma20SeriesRef.current.setData(ma20Data);

        // 거래량 데이터 설정
        const volumeData = processedData.map(d => ({
          time: d.time,
          value: d.volume,
          color: d.close >= d.open ? 'rgba(255, 71, 71, 0.3)' : 'rgba(71, 136, 255, 0.3)',
        }));
        volumeSeriesRef.current.setData(volumeData);

        // 현재가 및 변동률 설정
        if (processedData.length > 0) {
          const lastCandle = processedData[processedData.length - 1];
          const prevCandle = processedData[processedData.length - 2];
          
          setOrderPrice(lastCandle.close);
          if (prevCandle) {
            const change = lastCandle.close - prevCandle.close;
            const changePercent = (change / prevCandle.close) * 100;
            setPriceChange({ value: change, percent: changePercent });
          }
          
          currentCandleRef.current = lastCandle;
        }

        chartRef.current.timeScale().fitContent();
        setIsLoading(false);

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [stockId, timeframe]);

  // ... 이전 코드에 이어서

  useEffect(() => {
    if (isLoading) return;

    const connectWebSocket = () => {
      wsRef.current = new WebSocket(`ws://localhost:8080/ws/stock/${stockId}`);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
      };

      wsRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          const parsed = parseWSData(newData);
          const interval = timeframe === '1min' ? 60 : 600;
          const currentPeriodStart = Math.floor(parsed.time / interval) * interval;

          if (currentCandleRef.current && 
              Math.floor(currentCandleRef.current.time / interval) === Math.floor(currentPeriodStart / interval)) {
            // 현재 봉 업데이트
            const updatedCandle = {
              time: currentCandleRef.current.time,
              open: currentCandleRef.current.open,
              high: Math.max(currentCandleRef.current.high, parsed.high),
              low: Math.min(currentCandleRef.current.low, parsed.low),
              close: parsed.close,
              volume: currentCandleRef.current.volume + parsed.volume
            };

            candleSeriesRef.current.update(updatedCandle);
            volumeSeriesRef.current.update({
              time: updatedCandle.time,
              value: updatedCandle.volume,
              color: updatedCandle.close >= updatedCandle.open 
                ? 'rgba(255, 71, 71, 0.3)' 
                : 'rgba(71, 136, 255, 0.3)',
            });

            currentCandleRef.current = updatedCandle;

          } else {
            // 새로운 봉 생성
            const newCandle = {
              time: currentPeriodStart,
              open: parsed.close,
              high: parsed.close,
              low: parsed.close,
              close: parsed.close,
              volume: parsed.volume
            };

            candleSeriesRef.current.update(newCandle);
            volumeSeriesRef.current.update({
              time: currentPeriodStart,
              value: parsed.volume,
              color: 'rgba(255, 71, 71, 0.3)',
            });

            currentCandleRef.current = newCandle;
          }

          // 가격 변동 계산
          if (currentCandleRef.current) {
            const change = parsed.close - currentCandleRef.current.open;
            const changePercent = (change / currentCandleRef.current.open) * 100;
            setPriceChange({ value: change, percent: changePercent });
          }

          setOrderPrice(parsed.close);

        } catch (error) {
          console.error('Error processing WebSocket data:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket Disconnected');
        setTimeout(connectWebSocket, 3000);
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
  }, [isLoading, stockId, timeframe]);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const accountId = response.data.primaryAccountId;
      if (accountId) {
        setPrimaryAccountId(accountId);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      if (error.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('jwtToken');
      }
    }
  };

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!primaryAccountId) {
      alert('계좌 정보가 필요합니다.');
      return;
    }

    if (quantity <= 0) {
      alert('주문 수량을 입력해주세요.');
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const orderDTO = {
        stockCode: stockId,
        orderQuantity: Number(quantity),
        orderPrice: Number(orderPrice),
      };

      const response = await axios.post(
        `http://localhost:8080/api/v1/${orderType}-order`,
        orderDTO,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        alert(`${quantity}주 ${orderType === 'buy' ? '매수' : '매도'} 주문이 완료되었습니다.`);
        setQuantity(0);
      }
    } catch (error) {
      console.error('주문 처리 실패:', error);
      alert(error.response?.data?.message || '주문 처리 중 오류가 발생했습니다.');
    }
  };

  const handleQuantityPercent = (percent) => {
    // 최대 주문 가능 수량 계산 로직 추가 필요
    const maxQuantity = Math.floor(10000000 / orderPrice); // 예시: 1000만원 기준
    setQuantity(Math.floor(maxQuantity * (percent / 100)));
  };

  return (
    <S.Container>
      <S.StockInfoContainer>
        <S.Header>
          <S.StockInfo>
            <S.StockLogo src={skLogo} alt="SK하이닉스" />
            <S.StockTitleArea>
              <S.StockTitle>SK하이닉스</S.StockTitle>
              <S.StockCode>{stockId}</S.StockCode>
            </S.StockTitleArea>
          </S.StockInfo>
          <S.PriceArea>
            <S.CurrentPrice change={priceChange.value}>
              {orderPrice.toLocaleString()}
            </S.CurrentPrice>
            <S.PriceChange value={priceChange.value}>
              {priceChange.value > 0 ? '+' : ''}{priceChange.value.toLocaleString()}원 
              ({priceChange.value > 0 ? '+' : ''}{priceChange.percent.toFixed(2)}%)
            </S.PriceChange>
          </S.PriceArea>
        </S.Header>

        <S.TabContainer>
          <S.TabButton 
            active={activeTab === 'chart'} 
            onClick={() => setActiveTab('chart')}
          >
            차트
          </S.TabButton>
          <S.TabButton 
            active={activeTab === 'orderbook'} 
            onClick={() => setActiveTab('orderbook')}
          >
            호가
          </S.TabButton>
          <S.TabButton 
            active={activeTab === 'info'} 
            onClick={() => setActiveTab('info')}
          >
            종목정보
          </S.TabButton>
        </S.TabContainer>

        <S.TimeframeButtons>
          <S.TimeButton 
            active={timeframe === '1min'} 
            onClick={() => setTimeframe('1min')}
          >
            1분
          </S.TimeButton>
          <S.TimeButton 
            active={timeframe === '10min'} 
            onClick={() => setTimeframe('10min')}
          >
            10분
          </S.TimeButton>
        </S.TimeframeButtons>

        <S.ChartContainer ref={chartContainerRef} />
      </S.StockInfoContainer>

      <S.OrderBoxContainer>
        <S.OrderTypeContainer>
          <S.OrderTypeButton
            active={orderType === 'buy'}
            buy={true}
            onClick={() => {
              setOrderType('buy');
              setQuantity(0);
            }}
          >
            매수
          </S.OrderTypeButton>
          <S.OrderTypeButton
            active={orderType === 'sell'}
            buy={false}
            onClick={() => {
              setOrderType('sell');
              setQuantity(0);
            }}
          >
            매도
          </S.OrderTypeButton>
        </S.OrderTypeContainer>

        <S.InputContainer>
          <S.InputLabel>주문가격</S.InputLabel>
          <S.PriceInput>
            <input
              type="text"
              value={orderPrice.toLocaleString()}
              readOnly
            />
            <span>원</span>
          </S.PriceInput>
        </S.InputContainer>

        <S.InputContainer>
          <S.InputLabel>주문수량</S.InputLabel>
          <S.PriceInput>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              min="0"
            />
            <span>주</span>
          </S.PriceInput>
          <S.QuantityButtons>
            <S.QuantityButton onClick={() => handleQuantityPercent(10)}>10%</S.QuantityButton>
            <S.QuantityButton onClick={() => handleQuantityPercent(25)}>25%</S.QuantityButton>
            <S.QuantityButton onClick={() => handleQuantityPercent(50)}>50%</S.QuantityButton>
            <S.QuantityButton onClick={() => handleQuantityPercent(100)}>최대</S.QuantityButton>
          </S.QuantityButtons>
        </S.InputContainer>

        <S.OrderSummary>
          <div>
            <span>주문가능금액</span>
            <span>10,000,000원</span>
          </div>
          <div>
            <span>총 주문금액</span>
            <span>{(orderPrice * quantity).toLocaleString()}원</span>
          </div>
        </S.OrderSummary>

        <S.OrderButton 
          onClick={handleOrder}
          buy={orderType === 'buy'}
          disabled={quantity <= 0}
        >
          {orderType === 'buy' ? '매수하기' : '매도하기'}
        </S.OrderButton>
      </S.OrderBoxContainer>
    </S.Container>
  );
}

export default StockDetail;