import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
        if (!response.ok) {
          throw new Error('데이터를 불러오는데 실패했습니다');
        }
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    // 1분마다 데이터 갱신
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !dashboardData) {
    return (
      <Container>
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>대시보드</PageTitle>
      <Grid>
        <Card>
          <CardTitle>총 사용자</CardTitle>
          <CardValue>{dashboardData?.totalUsers?.toLocaleString() ?? '-'}</CardValue>
          {dashboardData?.totalUsersChange && (
            <CardChange type={dashboardData.totalUsersChange > 0 ? 'increase' : 'decrease'}>
              {dashboardData.totalUsersChange > 0 ? '+' : ''}{dashboardData.totalUsersChange}%
            </CardChange>
          )}
        </Card>
        <Card>
          <CardTitle>오늘의 방문자</CardTitle>
          <CardValue>{dashboardData?.todayVisitors?.toLocaleString() ?? '-'}</CardValue>
          {dashboardData?.todayVisitorsChange && (
            <CardChange type={dashboardData.todayVisitorsChange > 0 ? 'increase' : 'decrease'}>
              {dashboardData.todayVisitorsChange > 0 ? '+' : ''}{dashboardData.todayVisitorsChange}%
            </CardChange>
          )}
        </Card>
        <Card>
          <CardTitle>신규 가입자</CardTitle>
          <CardValue>{dashboardData?.newUsers?.toLocaleString() ?? '-'}</CardValue>
          {dashboardData?.newUsersChange && (
            <CardChange type={dashboardData.newUsersChange > 0 ? 'increase' : 'decrease'}>
              {dashboardData.newUsersChange > 0 ? '+' : ''}{dashboardData.newUsersChange}%
            </CardChange>
          )}
        </Card>
      </Grid>
      <UpdateInfo>마지막 업데이트: {new Date().toLocaleTimeString()}</UpdateInfo>
    </Container>
  );
};

const Container = styled.div`
  padding: 24px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const PageTitle = styled.h1`
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  padding: 24px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h3`
  margin: 0;
  color: #666;
  font-size: 14px;
`;

const CardValue = styled.div`
  margin-top: 8px;
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
`;

const CardChange = styled.div`
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.type === 'increase' ? '#52c41a' : '#f5222d'};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #f5222d;
  background-color: #fff2f0;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const UpdateInfo = styled.div`
  text-align: right;
  margin-top: 16px;
  color: #999;
  font-size: 12px;
`;

export default Dashboard;