import React from 'react';
import styled from 'styled-components';

const MonthlyReport = () => {
  return (
    <Container>
      <PageTitle>월간 리포트</PageTitle>
      <Content>
        <p>월간 리포트 내용이 들어갈 자리입니다.</p>
      </Content>
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

const Content = styled.div`
  padding: 20px;
`;

export default MonthlyReport;