import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  BarElement,
  Tooltip
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';

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

const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-sizing: border-box;
  overflow: hidden;
  padding-right: 5px;
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 4px;
  padding: 8px;
`;

const TimeButton = styled.button`
  padding: 6px 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  background-color: ${props => props.active ? '#f5f5f5' : '#fff'};
  color: ${props => props.active ? '#333' : '#666'};
  font-size: 13px;
  cursor: pointer;
`;

const CanvasContainer = styled.div`
  width: 100%;
  height: calc(100% - 44px);
  position: relative;
`;

const TIMEFRAMES = [
  { key: '1min', label: '1분', minutes: 1 },
  { key: '10min', label: '10분', minutes: 10 }
];

const StockChart = () => {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES[0]);
  const [data, setData] = useState([]);
  const [currentCandle, setCurrentCandle] = useState(null);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const containerRef = useRef(null);

  const basePrice = 33250;

  const handleResize = () => {
    if (containerRef.current && chartRef.current && chartInstance.current) {
      const container = containerRef.current;
      chartRef.current.width = container.clientWidth;
      chartRef.current.height = container.clientHeight;
      chartInstance.current.resize();
    }
  };

  const generatePrice = (lastPrice) => {
    const volatility = 0.002;
    const change = lastPrice * volatility * (Math.random() - 0.5);
    return Math.round(lastPrice + change);
  };

  const generateCandle = (lastClose = basePrice, time = new Date()) => {
    const open = generatePrice(lastClose);
    const close = generatePrice(open);
    const high = Math.max(open, close) + Math.round(Math.random() * 20);
    const low = Math.min(open, close) - Math.round(Math.random() * 20);
    
    return {
      time: time.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      open,
      high,
      low,
      close,
      timestamp: time.getTime()
    };
  };

  useEffect(() => {
    const now = new Date();
    const startTime = new Date(now.getTime() - (15 * timeframe.minutes * 60000));
    const initialData = [];
    let lastClose = basePrice;
    
    for (let i = 0; i < 15; i++) {
      const candleTime = new Date(startTime.getTime() + (i * timeframe.minutes * 60000));
      const candle = generateCandle(lastClose, candleTime);
      lastClose = candle.close;
      initialData.push(candle);
    }
    
    const currentCandleData = generateCandle(lastClose, now);
    setCurrentCandle(currentCandleData);
    setData(initialData);
  }, [timeframe]);

  useEffect(() => {
    const updateCurrentCandle = () => {
      setCurrentCandle(prev => {
        if (!prev) return prev;
        const newPrice = generatePrice(prev.close);
        return {
          ...prev,
          close: newPrice,
          high: Math.max(prev.high, newPrice),
          low: Math.min(prev.low, newPrice)
        };
      });
    };

    const createNewCandle = () => {
      const now = new Date();
      if (currentCandle) {
        const candleTime = new Date(currentCandle.timestamp);
        const currentMinutes = now.getMinutes();
        const candleMinutes = candleTime.getMinutes();
        
        if (Math.floor(currentMinutes / timeframe.minutes) !== 
            Math.floor(candleMinutes / timeframe.minutes)) {
          setData(prevData => [...prevData, currentCandle]);
          const newCandle = generateCandle(currentCandle.close, now);
          setCurrentCandle(newCandle);
        }
      }
    };

    const priceTimer = setInterval(updateCurrentCandle, 200);
    const candleTimer = setInterval(createNewCandle, 1000);

    return () => {
      clearInterval(priceTimer);
      clearInterval(candleTimer);
    };
  }, [currentCandle, timeframe]);

  const calculateMA = (data, period) => {
    return data.map((_, index) => {
      const start = Math.max(0, index - period + 1);
      const values = data.slice(start, index + 1).map(d => d.close);
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });
  };

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext('2d');

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const allData = currentCandle ? [...data, currentCandle] : data;
    const recentData = allData.slice(-15);
    
    const chartData = recentData.map(d => ({
      x: d.time,
      o: d.open,
      h: d.high,
      l: d.low,
      c: d.close
    }));

    const ma5 = calculateMA(recentData, 5);
    const ma10 = calculateMA(recentData, 10);
    const ma20 = calculateMA(recentData, 20);

    chartInstance.current = new Chart(ctx, {
      data: {
        labels: recentData.map(d => d.time),
        datasets: [
          {
            type: 'candlestick',
            data: chartData,
            backgroundColors: {
              up: 'rgb(244, 68, 84)',
              down: 'rgb(56, 132, 244)',
              unchanged: 'rgb(143, 143, 143)'
            },
            borderColors: {
              up: 'rgb(244, 68, 84)',
              down: 'rgb(56, 132, 244)',
              unchanged: 'rgb(143, 143, 143)'
            },
            borderWidth: 1
          },
          {
            type: 'line',
            data: ma5,
            borderColor: '#FF3333',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            data: ma10,
            borderColor: '#3333FF',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          },
          {
            type: 'line',
            data: ma20,
            borderColor: '#21C6B9',
            borderWidth: 1,
            pointRadius: 0,
            fill: false,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0  // 애니메이션 비활성화
        },
        interaction: {
          mode: 'nearest',
          axis: 'x',  // x축 기준으로만 탐지
          intersect: false  // 교차점 검사 비활성화
        },
        layout: {
          padding: {
            left: 10,
            right: 40,
            top: 20,
            bottom: 10
          }
        },
        scales: {
          x: {
            type: 'category',
            grid: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 8,
              font: {
                size: 11,
                family: 'Noto Sans KR'
              },
              color: '#666'
            },
            border: {
              color: '#eee'
            },
            offset: true
          },
          y: {
            position: 'right',
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            },
            ticks: {
              callback: value => value.toLocaleString() + '원',
              font: {
                size: 11,
                family: 'Noto Sans KR'
              },
              color: '#666',
              padding: 8,
              count: 7,
              align: 'end'
            },
            border: {
              display: false
            },
            min: Math.min(...recentData.map(d => d.low)) * 0.9995,
            max: Math.max(...recentData.map(d => d.high)) * 1.0005
          }
        },

        plugins: {
          tooltip: {
            enabled: true,
            position: 'nearest',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#333',
            bodyColor: '#666',
            borderColor: '#eee',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            titleFont: {
              family: 'Noto Sans KR',
              size: 12,
              weight: '500'
            },
            bodyFont: {
              family: 'Noto Sans KR',
              size: 12
            },
            caretSize: 6,
            cornerRadius: 8,
            yAlign: 'bottom',
            xAlign: 'center',
            titleMarginBottom: 8,
            boxPadding: 4,
            callbacks: {
              label: (context) => {
                const point = context.raw;
                if (context.datasetIndex === 0) {
                  return [
                    `시가: ${point.o?.toLocaleString()}원`,
                    `고가: ${point.h?.toLocaleString()}원`,
                    `저가: ${point.l?.toLocaleString()}원`,
                    `종가: ${point.c?.toLocaleString()}원`
                  ];
                }
                return '';
              },
              // 툴팁 제목 포맷
              title: (tooltipItems) => {
                return tooltipItems[0].label;
              }
            },
            // 툴팁 지연 시간과 애니메이션 설정
            animation: {
              duration: 100
            }
          },
          legend: {
            display: false
          }
        },
        hover: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
          animationDuration: 0
        },
        // 차트 전체 애니메이션 설정
        transitions: {
          active: {
            animation: {
              duration: 0
            }
          }
        }
      }
    });

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, currentCandle]);

  return (
    <ChartWrapper>
      <TimeframeContainer>
        {TIMEFRAMES.map((tf) => (
          <TimeButton
            key={tf.key}
            active={timeframe.key === tf.key}
            onClick={() => setTimeframe(tf)}
          >
            {tf.label}
          </TimeButton>
        ))}
      </TimeframeContainer>
      <CanvasContainer ref={containerRef}>
        <canvas 
          ref={chartRef}
          style={{ 
            width: '100%', 
            height: '100%'
          }}
        />
      </CanvasContainer>
    </ChartWrapper>
  );
};

export default StockChart;