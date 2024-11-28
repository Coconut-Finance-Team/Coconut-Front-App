import React from 'react';

const styles = `
  .monitoring-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .back-navigation {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 24px;
  }

  .back-navigation svg {
    width: 16px;
    height: 16px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }

  .metric-card {
    padding: 16px;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }

  .metric-title {
    font-size: 13px;
    color: #64748b;
    margin-bottom: 8px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
  }

  .metric-trend {
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .trend-up {
    color: #dc2626;
  }

  .trend-down {
    color: #16a34a;
  }

  .trend-stable {
    color: #64748b;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .log-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
  }

  .log-table th {
    background-color: #f8fafc;
    padding: 12px 16px;
    text-align: left;
    font-weight: 500;
    color: #64748b;
    font-size: 14px;
  }

  .log-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
  }

  .log-table tr:hover {
    background-color: #f8fafc;
  }

  .status-code {
    font-family: monospace;
  }

  .status-200 {
    color: #16a34a;
  }

  .status-400, .status-404 {
    color: #dc2626;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-success {
    background-color: #dcfce7;
    color: #15803d;
  }

  .status-error {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .monospace {
    font-family: monospace;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 16px;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    background: white;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .back-button:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background-color: #f8fafc;
  }

  .back-button svg {
    width: 16px;
    height: 16px;
  }
`;

const ApiDetailMonitoring = ({ onBack, api }) => {
    const apiMetrics = {
      endpoint: api?.endpoint || '/api/v1/trade',
      callRate: {
        value: api?.requests || '824회/초',
        trend: '+20% ↑',
        isTrendUp: true
      },
      responseTime: {
        value: api?.responseTime || '180ms',
        trend: '안정',
        isTrendStable: true
      },
      errorRate: {
        value: api?.errorRate || '0.8%',
        trend: '안정',
        isTrendStable: true
      },
      throughput: {
        value: api?.details?.throughput || '2.4MB/s',
        trend: '-5% ↓',
        isTrendDown: true
      }
    };
  
    const apiLogs = [
      { time: '15:42:23', method: 'POST', status: 200, responseTime: '182ms', clientIp: '172.16.0.100', statusType: 'success' },
      { time: '15:42:22', method: 'GET', status: 404, responseTime: '95ms', clientIp: '172.16.0.101', statusType: 'error' },
      { time: '15:42:21', method: 'POST', status: 200, responseTime: '178ms', clientIp: '172.16.0.102', statusType: 'success' },
    ];
  
    return (
      <>
        <style>{styles}</style>
        <div className="monitoring-container">
          <button className="back-button" onClick={onBack}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            목록으로
          </button>
  
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-title">전체 호출량</div>
              <div className="metric-value">{apiMetrics.callRate.value}</div>
              <div className={`metric-trend ${apiMetrics.callRate.isTrendUp ? 'trend-up' : 'trend-stable'}`}>
                {apiMetrics.callRate.trend}
              </div>
            </div>
  
            <div className="metric-card">
              <div className="metric-title">평균 응답시간</div>
              <div className="metric-value">{apiMetrics.responseTime.value}</div>
              <div className={`metric-trend ${apiMetrics.responseTime.isTrendStable ? 'trend-stable' : ''}`}>
                {apiMetrics.responseTime.trend}
              </div>
            </div>
  
            <div className="metric-card">
              <div className="metric-title">에러율</div>
              <div className="metric-value">{apiMetrics.errorRate.value}</div>
              <div className={`metric-trend ${apiMetrics.errorRate.isTrendStable ? 'trend-stable' : ''}`}>
                {apiMetrics.errorRate.trend}
              </div>
            </div>
  
            <div className="metric-card">
              <div className="metric-title">트래픽 량</div>
              <div className="metric-value">{apiMetrics.throughput.value}</div>
              <div className={`metric-trend ${apiMetrics.throughput.isTrendDown ? 'trend-down' : ''}`}>
                {apiMetrics.throughput.trend}
              </div>
            </div>
          </div>
  
          <div className="section-title">API 호출 로그</div>
          <table className="log-table">
            <thead>
              <tr>
                <th>시간</th>
                <th>호출 유형</th>
                <th>응답코드</th>
                <th>응답시간</th>
                <th>호출 IP</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {apiLogs.map((log, index) => (
                <tr key={index}>
                  <td className="monospace">{log.time}</td>
                  <td>{log.method}</td>
                  <td className={`status-code status-${log.status}`}>{log.status}</td>
                  <td className="monospace">{log.responseTime}</td>
                  <td className="monospace">{log.clientIp}</td>
                  <td>
                    <span className={`status-badge status-${log.statusType}`}>
                      {log.statusType === 'success' ? '성공' : '실패'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };
  
  export default ApiDetailMonitoring;