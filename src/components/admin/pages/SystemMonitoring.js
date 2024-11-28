import React, { useState, useEffect } from 'react';
import ApiDetailMonitoring from './ApiDetailMonitoring';

const styles = `
  .monitoring-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .page-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
    color: #1e293b;
  }

  .section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .monitoring-table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .monitoring-table th {
    background-color: #f8fafc;
    padding: 12px 16px;
    text-align: left;
    font-weight: 500;
    color: #64748b;
    font-size: 14px;
    white-space: nowrap;
  }

  .monitoring-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
    color: #1e293b;
  }

  .monitoring-table tr:hover {
    background-color: #f8fafc;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-warning {
    background-color: #fef3c7;
    color: #b45309;
  }

  .status-success {
    background-color: #dcfce7;
    color: #15803d;
  }

  .status-error {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .metric {
    font-family: monospace;
    color: #6366f1;
  }

  .alert-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .clickable-row {
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .clickable-row:hover {
    background-color: #f1f5f9;
  }

  .api-link {
    color: #3b82f6;
    text-decoration: none;
  }

  .api-link:hover {
    text-decoration: underline;
  }

  .loading {
    text-align: center;
    padding: 20px;
    color: #64748b;
  }

  .error {
    color: #dc2626;
    padding: 20px;
    text-align: center;
    background-color: #fee2e2;
    border-radius: 8px;
    margin-bottom: 16px;
  }
`;

const SystemMonitoring = () => {
  const [selectedApi, setSelectedApi] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/api/v1/admin/system');
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다');
        }
        const data = await response.json();
        
        // API 메트릭 데이터 변환
        const formattedMetrics = data.apiMetrics.map(metric => ({
          endpoint: metric.path,
          requests: `${metric.requestsPerSecond}/초`,
          responseTime: `${metric.avgResponseTime}ms`,
          errorRate: `${(metric.errorRate * 100).toFixed(1)}%`,
          status: metric.errorRate > 0.05 ? '주의' : '정상',
          details: {
            throughput: `${metric.throughput}MB/s`,
            lastHourCalls: metric.lastHourCalls.toLocaleString(),
            avgLatency: `${metric.avgLatency}ms`
          }
        }));

        // 알림 데이터 변환
        const formattedAlerts = data.alerts.map(alert => ({
          time: new Date(alert.timestamp).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          endpoint: alert.apiPath,
          description: alert.description,
          threshold: alert.threshold,
          current: alert.currentValue,
          status: alert.resolved ? '조치완료' : '모니터링중'
        }));

        setMetrics(formattedMetrics);
        setAlerts(formattedAlerts);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // 30초마다 갱신

    return () => clearInterval(interval);
  }, []);

  const handleApiClick = (api) => {
    setSelectedApi(api);
  };

  if (selectedApi) {
    return <ApiDetailMonitoring api={selectedApi} onBack={() => setSelectedApi(null)} />;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="monitoring-container">
        <h1 className="page-title">시스템 모니터링</h1>

        {error && <div className="error">{error}</div>}

        {loading && !metrics ? (
          <div className="loading">데이터를 불러오는 중...</div>
        ) : (
          <>
            <div className="section">
              <h2 className="section-title">API 모니터링</h2>
              <table className="monitoring-table">
                <thead>
                  <tr>
                    <th>API 경로</th>
                    <th>호출량</th>
                    <th>응답시간</th>
                    <th>에러율</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics?.map((metric, index) => (
                    <tr 
                      key={index} 
                      className="clickable-row"
                      onClick={() => handleApiClick(metric)}
                    >
                      <td>
                        <span className="api-link">
                          {metric.endpoint}
                        </span>
                      </td>
                      <td className="metric">{metric.requests}</td>
                      <td className="metric">{metric.responseTime}</td>
                      <td className="metric">{metric.errorRate}</td>
                      <td>
                        <span className={`status-badge ${
                          metric.status === '주의' ? 'status-warning' : 'status-success'
                        }`}>
                          {metric.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="section">
              <h2 className="section-title">트래픽 이상 알림</h2>
              <table className="monitoring-table">
                <thead>
                  <tr>
                    <th>발생 시간</th>
                    <th>API 경로</th>
                    <th>이상 항목</th>
                    <th>임계치</th>
                    <th>측정값</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {alerts?.map((alert, index) => (
                    <tr key={index}>
                      <td>{alert.time}</td>
                      <td>
                        <span 
                          className="api-link"
                          onClick={() => handleApiClick(metrics?.find(api => api.endpoint === alert.endpoint))}
                        >
                          {alert.endpoint}
                        </span>
                      </td>
                      <td>{alert.description}</td>
                      <td className="metric">{alert.threshold}</td>
                      <td className="metric">{alert.current}</td>
                      <td>
                        <span className={`status-badge ${
                          alert.status === '모니터링중' ? 'status-warning' : 'status-success'
                        }`}>
                          {alert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SystemMonitoring;