import React from 'react';
import styled from 'styled-components';

const SummaryContainer = styled.aside`
  background: #ffffff;
  border: 1px solid #E5E8EB;
  border-radius: 12px;
  padding: 24px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
`;

const AssetCard = styled.div`
  background: #F8F9FA;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

const AssetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  span {
    color: #666;
    font-size: 14px;
  }
`;

const AssetValue = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const SmallText = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 4px;
`;

function AssetSummary({ krwBalance, usdBalance }) {
  return (
    <SummaryContainer>
      <Title>내 투자</Title>
      <AssetCard>
        <AssetHeader>
          <span>원화</span>
          <span>출금가능</span>
        </AssetHeader>
        <AssetValue>{krwBalance}</AssetValue>
        <SmallText>{krwBalance} 출금가능</SmallText>
      </AssetCard>
  
      <AssetCard>
        <AssetHeader>
          <span>달러</span>
          <span>출금가능</span>
        </AssetHeader>
        <AssetValue>{usdBalance}</AssetValue>
        <SmallText>{usdBalance} 출금가능</SmallText>
      </AssetCard>
    </SummaryContainer>
  );
}

export default AssetSummary;
