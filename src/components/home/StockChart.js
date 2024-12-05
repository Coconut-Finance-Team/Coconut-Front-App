import React, { useEffect, useRef, useState } from 'react';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  Tooltip,
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

// Chart.js 컴포넌트 등록
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  CandlestickController,
  CandlestickElement,
  Tooltip
);

const WS_BASE_URL = process.env.REACT_APP_WS_BASE_URL || 'ws://localhost:8080';

// 시간 프레임 옵션
const TIMEFRAMES = [
  { key: '1min', label: '1분', minutes: 1 },
  { key: '10min', label: '10분', minutes: 10 },
];

// 차트 기본 데이터 생성 함수
const generateInitialData = () => {
  const data = [];
  const basePrice = 175000;
  const now = new Date();

  for (let i = 0; i < 100; i++) {
    const time = new Date(now.getTime() - (99 - i) * 60000);
    const variation = (Math.random() - 0.5) * 1000;
    const open = basePrice + variation;
    const close = open + (Math.random() - 0.5) * 500;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;

    data.push({
      time: time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000),
      timestamp: time.getTime(),
    });
  }
  return data;
};

const StockChart = ({ stockId }) => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[0]); // 시간 프레임
  const [data, setData] = useState(generateInitialData()); // 기본 데이터
  const chartRef = useRef(null); // 차트 캔버스 참조
  const chartInstance = useRef(null); // Chart.js 인스턴스
  const containerRef = useRef(null); // 컨테이너 참조
  const wsRef = useRef(null); // WebSocket 참조

  // 창 크기 조정 핸들러
  const handleResize = () => {
    if (containerRef.current && chartRef.current && chartInstance.current) {
      const container = containerRef.current;
      chartRef.current.width = container.clientWidth;
      chartRef.current.height = container.clientHeight;
      chartInstance.current.resize();
    }
  };

  // WebSocket 연결
  const connectWebSocket = () => {
    if (!stockId) return;

    console.log(`Connecting WebSocket for stock ${stockId}...`);
    const ws = new WebSocket(`${WS_BASE_URL}/ws/stock/${stockId}`);

    ws.onopen = () => {
      console.log('WebSocket Connected Successfully');
    };

    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log('WebSocket message received:', newData);

      setData((prevData) => {
        const updatedData = [...prevData];
        const lastCandle = updatedData[updatedData.length - 1];

        if (lastCandle && isSameTimeframe(lastCandle.timestamp, newData.timestamp)) {
          // 기존 캔들 업데이트
          lastCandle.high = Math.max(lastCandle.high, newData.currentPrice);
          lastCandle.low = Math.min(lastCandle.low, newData.currentPrice);
          lastCandle.close = newData.currentPrice;
          lastCandle.volume += newData.contingentVol || 0;
        } else {
          // 새 캔들 추가
          updatedData.push({
            time: new Date(newData.timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            open: newData.currentPrice,
            high: newData.currentPrice,
            low: newData.currentPrice,
            close: newData.currentPrice,
            volume: newData.contingentVol || 0,
            timestamp: newData.timestamp,
          });

          // 최근 100개 데이터 유지
          if (updatedData.length > 100) {
            updatedData.shift();
          }
        }

        return updatedData;
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected, attempting to reconnect...');
      setTimeout(connectWebSocket, 3000);
    };

    wsRef.current = ws;
  };

  // 데이터 처리
  const isSameTimeframe = (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    const timeDiff = Math.abs(date1 - date2);
    return timeDiff < timeframe.minutes * 60000;
  };

  const calculateMA = (data, period) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const values = data.slice(start, index + 1).map((d) => d.close);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });
  };

  // 차트 업데이트
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const recentData = data.slice(-100);
    const chartData = recentData.map((d) => ({
      x: d.time,
      o: d.open,
      h: d.high,
      l: d.low,
      c: d.close,
    }));

    const ma5 = calculateMA(recentData, 5);
    const ma10 = calculateMA(recentData, 10);
    const ma20 = calculateMA(recentData, 20);

    chartInstance.current = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [
          {
            label: '주가',
            data: chartData,
            color: { up: '#00FF00', down: '#FF0000', unchanged: '#999999' },
          },
          {
            type: 'line',
            label: 'MA5',
            data: ma5,
            borderColor: '#FF3333',
            borderWidth: 1,
          },
          {
            type: 'line',
            label: 'MA10',
            data: ma10,
            borderColor: '#3333FF',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: 'category', grid: { display: false } },
          y: { position: 'right' },
        },
      },
    });
  }, [data]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, [stockId]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '400px' }}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default StockChart;
