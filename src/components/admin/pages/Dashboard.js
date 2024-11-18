import React from 'react';
import styled from 'styled-components';

const Dashboard = () => {
  return (
    <Container>
      <PageTitle>대시보드</PageTitle>
      <Grid>
        <Card>
          <CardTitle>총 사용자</CardTitle>
          <CardValue>1,234</CardValue>
        </Card>
        <Card>
          <CardTitle>오늘의 방문자</CardTitle>
          <CardValue>56</CardValue>
        </Card>
        <Card>
          <CardTitle>신규 가입자</CardTitle>
          <CardValue>12</CardValue>
        </Card>
        <Card>
          <CardTitle>총 구독</CardTitle>
          <CardValue>789</CardValue>
        </Card>
      </Grid>
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

export default Dashboard;