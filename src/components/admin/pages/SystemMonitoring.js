import React, { useState } from 'react';
import ApiDetailMonitoring from './ApiDetailMonitoring';  // ApiDetailMonitoring 컴포넌트 import

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
`;

const SystemMonitoring = () => {
    const [selectedApi, setSelectedApi] = useState(null);
  
    const apiMetrics = [
      { 
        endpoint: '/api/v1/trade', 
        requests: '824/초', 
        responseTime: '180ms', 
        errorRate: '0.8%', 
        status: '주의',
        details: {
          throughput: '2.4MB/s',
          lastHourCalls: '2,964,000',
          avgLatency: '175ms'
        }
      },
      { 
        endpoint: '/api/v1/user', 
        requests: '245/초', 
        responseTime: '95ms', 
        errorRate: '0.1%', 
        status: '정상',
        details: {
          throughput: '1.2MB/s',
          lastHourCalls: '882,000',
          avgLatency: '92ms'
        }
      },
    ];
  
    const alerts = [
      { time: '15:42', endpoint: '/api/v1/trade', description: '트래픽 급증', threshold: '500/초', current: '824/초', status: '모니터링중' },
      { time: '15:30', endpoint: '/api/v1/user', description: '응답시간 지연', threshold: '200ms', current: '312ms', status: '조치완료' },
    ];
  
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
                {apiMetrics.map((metric, index) => (
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
                {alerts.map((alert, index) => (
                  <tr key={index}>
                    <td>{alert.time}</td>
                    <td>
                      <span 
                        className="api-link"
                        onClick={() => handleApiClick(apiMetrics.find(api => api.endpoint === alert.endpoint))}
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
        </div>
      </>
    );
  };
  
  export default SystemMonitoring;
  