import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import * as S from './StockDetailStyles';
import skImage from '../../assets/sk.png';
import samsungImage from '../../assets/samsung.png';
import lgImage from '../../assets/lg.png';

const STOCK_INFO = {
  '005930': {
    name: '삼성전자',
    logo: samsungImage  // 로고 이미지 import 필요
  },
  '000660': {
    name: 'SK하이닉스',
    logo: skImage
  },
  '066570': {
    name: 'LG전자',
    logo: lgImage  // 로고 이미지 import 필요
  }
};

function StockDetail() {
  const { stockId } = useParams();
  // 현재 종목 정보 가져오기
  const currentStock = STOCK_INFO[stockId] || { name: '알 수 없음', logo: null };
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
  const volumeContainerRef = useRef(null);
  const priceChartRef = useRef(null);
  const volumeChartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const volumeSeriesRef = useRef(null);
  const ma5SeriesRef = useRef(null);
  const ma10SeriesRef = useRef(null);
  const ma20SeriesRef = useRef(null);
  const wsRef = useRef(null);
  const currentCandleRef = useRef(null);
  const syncingChartsRef = useRef(false);
  const resizeObserverRef = useRef(null);
  const retriesRef = useRef(0);
  const lastUpdateRef = useRef(null);

  const isMarketOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;
    return currentTime >= 540 && currentTime <= 930;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const isValidCandle = (candle) => {
    return candle &&
      typeof candle.time === 'number' &&
      typeof candle.open === 'number' &&
      typeof candle.high === 'number' &&
      typeof candle.low === 'number' &&
      typeof candle.close === 'number' &&
      typeof candle.volume === 'number';
  };

  const parseAndFormatData = (data) => {
    if (!data || !data.time) return null;
    
    const timestamp = new Date(data.time).getTime() / 1000;
    
    return {
      time: timestamp,
      open: parseFloat(data.openPrice) || 0,
      high: parseFloat(data.highPrice) || 0,
      low: parseFloat(data.lowPrice) || 0,
      close: parseFloat(data.currentPrice) || 0,
      volume: parseFloat(data.contingentVol) || 0
    };
  };

  const parseWSData = (data) => {
    if (!data || !data.time) return null;

    // time format: "HHMMSS" -> timestamp
    const hours = data.time.slice(0, 2);
    const minutes = data.time.slice(2, 4);
    const seconds = data.time.slice(4, 6);
    
    const now = new Date();
    now.setHours(Number(hours));
    now.setMinutes(Number(minutes));
    now.setSeconds(Number(seconds));
    
    return {
      time: Math.floor(now.getTime() / 1000),
      open: parseFloat(data.openPrice) || 0,
      high: parseFloat(data.highPrice) || 0,
      low: parseFloat(data.lowPrice) || 0,
      close: parseFloat(data.currentPrice) || 0,
      volume: parseFloat(data.contingentVol) || 0
    };
  };

  const processCandles = (data, interval) => {
    const periodMinutes = interval === '1min' ? 1 : 10;
    const periodSeconds = periodMinutes * 60;
    const groupedData = new Map();

    data.forEach(candle => {
      const parsed = parseAndFormatData(candle);
      if (!parsed) return;

      const date = new Date(parsed.time * 1000);
      date.setSeconds(0, 0);
      if (periodMinutes === 10) {
        date.setMinutes(Math.floor(date.getMinutes() / 10) * 10);
      }
      const periodTimestamp = Math.floor(date.getTime() / 1000);
      
      if (!groupedData.has(periodTimestamp)) {
        groupedData.set(periodTimestamp, {
          time: periodTimestamp,
          open: parsed.open,
          high: parsed.high,
          low: parsed.low,
          close: parsed.close,
          volume: parsed.volume
        });
      } else {
        const existing = groupedData.get(periodTimestamp);
        existing.high = Math.max(existing.high, parsed.high);
        existing.low = Math.min(existing.low, parsed.low);
        existing.close = parsed.close;
        existing.volume += parsed.volume;
      }
    });

    return Array.from(groupedData.values()).sort((a, b) => a.time - b.time);
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

  const handleNewData = (parsed) => {
    if (!isMarketOpen() || !parsed || !candleSeriesRef.current) return;
    
    if (lastUpdateRef.current === parsed.time) return;
    
    if (!isValidCandle(parsed)) {
      console.error('Invalid candle data received:', parsed);
      return;
    }

    const date = new Date(parsed.time * 1000);
    date.setSeconds(0, 0);
    const currentMinute = date.getMinutes();
    
    if (timeframe === '10min') {
      date.setMinutes(Math.floor(currentMinute / 10) * 10);
    }
    const currentPeriodStart = Math.floor(date.getTime() / 1000);

    if (!currentCandleRef.current || 
        currentCandleRef.current.time < currentPeriodStart) {
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
        color: 'rgba(255, 71, 71, 0.3)'
      });

      currentCandleRef.current = newCandle;
    } else {
      const updatedCandle = {
        ...currentCandleRef.current,
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
          : 'rgba(71, 136, 255, 0.3)'
      });

      currentCandleRef.current = updatedCandle;
    }

    lastUpdateRef.current = parsed.time;
  };

  const fetchData = async () => {
    if (!candleSeriesRef.current) return;

    try {
      const response = await fetch(`http://localhost:8080/api/v1/stock/${stockId}/charts/${timeframe}`);
      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        setOrderPrice(0);
        setPriceChange({ value: 0, percent: 0 });
        setIsLoading(false);
        return;
      }

      const processedData = processCandles(data, timeframe);

      if (!processedData.length) {
        setIsLoading(false);
        return;
      }

      const ma5Data = calculateMA(processedData, 5);
      const ma10Data = calculateMA(processedData, 10);
      const ma20Data = calculateMA(processedData, 20);

      candleSeriesRef.current.setData(processedData);
      ma5SeriesRef.current.setData(ma5Data);
      ma10SeriesRef.current.setData(ma10Data);
      ma20SeriesRef.current.setData(ma20Data);

      const volumeData = processedData.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close >= d.open 
          ? 'rgba(255, 71, 71, 0.3)' 
          : 'rgba(71, 136, 255, 0.3)',
      }));
      volumeSeriesRef.current.setData(volumeData);

      const lastCandle = processedData[processedData.length - 1];
      const prevCandle = processedData[processedData.length - 2];
      
      setOrderPrice(lastCandle.close);
      currentCandleRef.current = lastCandle;

      if (prevCandle) {
        const change = lastCandle.close - prevCandle.close;
        const changePercent = (change / prevCandle.close) * 100;
        setPriceChange({ value: change, percent: changePercent });
      }

      if (priceChartRef.current && volumeChartRef.current && processedData.length > 0) {
        const timeRange = {
          from: processedData[0].time,
          to: processedData[processedData.length - 1].time + (timeframe === '1min' ? 60 : 600),
        };

        setTimeout(() => {
          priceChartRef.current?.timeScale().setVisibleRange(timeRange);
          volumeChartRef.current?.timeScale().setVisibleRange(timeRange);
        }, 100);
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeCharts = () => {
      if (!chartContainerRef.current || !volumeContainerRef.current) return;

      const priceChart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333333',
          fontFamily: 'Noto Sans KR',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        crosshair: {
          mode: 'magnet',
          vertLine: {
            width: 1,
            color: 'rgba(51, 51, 51, 0.2)',
            style: 1,
          },
          horzLine: {
            visible: true,
            labelVisible: true,
            width: 1,
            color: 'rgba(51, 51, 51, 0.2)',
            style: 1,
          },
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: {
            top: 0.05,
            bottom: 0.05,
          },
          ticksVisible: true,
          borderColor: 'rgba(51, 51, 51, 0.2)',
          autoScale: true,
          mode: 0,
          alignLabels: true,
          entireTextOnly: true,
          priceFormat: {
            type: 'price',
            precision: 0,
            minMove: 100,
          },
        },
        timeScale: {
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: formatTime,
          fixLeftEdge: true,
          fixRightEdge: true,
          barSpacing: 2,
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: false,
        },
        handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
          pinch: false,
        },
      });

      const volumeChart = createChart(volumeContainerRef.current, {
        width: volumeContainerRef.current.clientWidth,
        height: volumeContainerRef.current.clientHeight,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333333',
          fontFamily: 'Noto Sans KR',
        },
        grid: {
          vertLines: { visible: false },
          horzLines: { visible: false },
        },
        rightPriceScale: {
          borderVisible: false,
          scaleMargins: {
            top: 0.05,
            bottom: 0.05,
          },
          ticksVisible: true,
          borderColor: 'rgba(51, 51, 51, 0.2)',
          autoScale: true,
          priceFormat: {
            type: 'volume',
            precision: 0,
          },
        },
        timeScale: {
          visible: true,
          borderVisible: false,
          timeVisible: true,
          secondsVisible: false,
          tickMarkFormatter: formatTime,
          fixLeftEdge: true,
          fixRightEdge: true,
          barSpacing: 5,
        },
        handleScroll: {
          mouseWheel: false,
          pressedMouseMove: true,
          horzTouchDrag: true,
          vertTouchDrag: false,
        },
        handleScale: {
          axisPressedMouseMove: false,
          mouseWheel: false,
          pinch: false,
        },
      });

      const candleSeries = priceChart.addCandlestickSeries({
        upColor: '#ff4747',
        downColor: '#4788ff',
        borderUpColor: '#ff4747',
        borderDownColor: '#4788ff',
        wickUpColor: '#ff4747',
        wickDownColor: '#4788ff',
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 100,
        },
      });

      const volumeSeries = volumeChart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {
          type: 'volume',
        },
        priceScaleId: 'volume',
      });

      const ma5Series = priceChart.addLineSeries({
        color: '#ff5252',
        lineWidth: 1,
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 100,
        },
        crosshairMarkerVisible: false,
      });

      const ma10Series = priceChart.addLineSeries({
        color: '#4285f4',
        lineWidth: 1,
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 100,
        },
        crosshairMarkerVisible: false,
      });

      const ma20Series = priceChart.addLineSeries({
        color: '#fbbc04',
        lineWidth: 1,
        priceFormat: {
          type: 'price',
          precision: 0,
          minMove: 100,
        },
        crosshairMarkerVisible: false,
      });

      priceChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!syncingChartsRef.current && range !== null && volumeChart) {
          syncingChartsRef.current = true;
          volumeChart.timeScale().setVisibleRange(range)
            .finally(() => {
              syncingChartsRef.current = false;
            });
        }
      });

      volumeChart.timeScale().subscribeVisibleTimeRangeChange((range) => {
        if (!syncingChartsRef.current && range !== null && priceChart) {
          syncingChartsRef.current = true;
          priceChart.timeScale().setVisibleRange(range)
            .finally(() => {
              syncingChartsRef.current = false;
            });
        }
      });

      priceChartRef.current = priceChart;
      volumeChartRef.current = volumeChart;
      candleSeriesRef.current = candleSeries;
      volumeSeriesRef.current = volumeSeries;
      ma5SeriesRef.current = ma5Series;
      ma10SeriesRef.current = ma10Series;
      ma20SeriesRef.current = ma20Series;

      const resizeObserver = new ResizeObserver(() => {
        if (chartContainerRef.current && volumeContainerRef.current) {
          const width = chartContainerRef.current.clientWidth;
          const priceHeight = chartContainerRef.current.clientHeight;
          const volumeHeight = volumeContainerRef.current.clientHeight;

          priceChart.applyOptions({ width, height: priceHeight });
          volumeChart.applyOptions({ width, height: volumeHeight });

          // 차트가 리사이즈될 때 시간 범위 유지
          if (currentCandleRef.current) {
            const timeRange = {
              from: currentCandleRef.current.time - (timeframe === '1min' ? 60 * 30 : 600 * 6),
              to: currentCandleRef.current.time + (timeframe === '1min' ? 60 * 5 : 600),
            };
            priceChart.timeScale().setVisibleRange(timeRange);
            volumeChart.timeScale().setVisibleRange(timeRange);
          }
        }
      });

      resizeObserver.observe(chartContainerRef.current);
      resizeObserver.observe(volumeContainerRef.current);
      resizeObserverRef.current = resizeObserver;

      return () => {
        resizeObserver.disconnect();
        priceChart.remove();
        volumeChart.remove();
      };
    };

    const charts = initializeCharts();
    fetchData();

    return () => {
      if (charts) {
        charts();
      }
    };
  }, []);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    
    if (candleSeriesRef.current) {
      priceChartRef.current?.timeScale().resetTimeScale();
      volumeChartRef.current?.timeScale().resetTimeScale();
      
      candleSeriesRef.current.setData([]);
      volumeSeriesRef.current.setData([]);
      ma5SeriesRef.current.setData([]);
      ma10SeriesRef.current.setData([]);
      ma20SeriesRef.current.setData([]);
      
      fetchData();
    }
  };

  useEffect(() => {
    if (isLoading) return;

    const connectWebSocket = () => {
      if (wsRef.current) {
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(`ws://localhost:8080/ws/stock/${stockId}`);
      
      wsRef.current.onopen = () => {
        console.log('WebSocket Connected');
        retriesRef.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const newData = JSON.parse(event.data);
          if (!newData) return;

          const parsed = parseWSData(newData);
          if (!parsed) return;

          handleNewData(parsed);
          
          setOrderPrice(parsed.close);
          const change = parsed.close - parsed.open;
          const changePercent = (change / parsed.open) * 100;
          setPriceChange({ value: change, percent: changePercent });
        } catch (error) {
          console.error('Error processing WebSocket data:', error);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket Disconnected');
        const retryDelay = Math.min(1000 * Math.pow(2, retriesRef.current), 10000);
        retriesRef.current++;
        setTimeout(connectWebSocket, retryDelay);
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
    const maxQuantity = Math.floor(10000000 / orderPrice);
    setQuantity(Math.floor(maxQuantity * (percent / 100)));
  };

  return (
    <S.Container>
      <S.StockInfoContainer>
        <S.Header>
          <S.StockInfo>
              <S.StockLogo 
              src={currentStock.logo} 
              alt={currentStock.name} 
            />
            <S.StockTitleArea>
              <S.StockTitle>{currentStock.name}</S.StockTitle>
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
            onClick={() => handleTimeframeChange('1min')}
          >
            1분
          </S.TimeButton>
          <S.TimeButton 
            active={timeframe === '10min'} 
            onClick={() => handleTimeframeChange('10min')}
          >
            10분
          </S.TimeButton>
        </S.TimeframeButtons>

        <S.ChartsContainer>
          <S.PriceChartContainer ref={chartContainerRef} />
          <S.VolumeChartContainer ref={volumeContainerRef} />
        </S.ChartsContainer>
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
