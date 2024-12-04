import React from 'react';

const styles = `
  .monitoring-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .grafana-container {
    margin-bottom: 32px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .grafana-iframe {
    border: none;
    width: 100%;
    height: 800px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
    color: #1e293b;
  }
`;

const SystemMonitoring = () => {
  const grafanaUrl = 'http://af09f59680ac947daa55253ebecdee73-1757876400.ap-northeast-2.elb.amazonaws.com/d/4b545447f/1-kubernetes-all-in-one-cluster-monitoring-kr?var-duration=5m&orgId=1&from=2024-12-03T00:09:10.873Z&to=2024-12-03T03:09:10.873Z&var-node=&var-instance=10.0.9.167:9100&var-namespace=&var-pod=&refresh=5s&theme=light';

  return (
    <>
      <style>{styles}</style>
      <div className="monitoring-container">
        <div className="grafana-container">
          <iframe 
            src={grafanaUrl}
            className="grafana-iframe"
            title="Grafana Dashboard"
            frameBorder="0"
            allowFullScreen={true}
            referrerPolicy="no-referrer"
            loading="lazy"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      </div>
    </>
  );
};

export default SystemMonitoring;