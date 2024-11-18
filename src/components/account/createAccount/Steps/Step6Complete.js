import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
  padding: 40px 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 16px;
`;

const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const ImageContainer = styled.div`
  margin: 32px 0;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CompleteMark = styled.div`
  width: 80px;
  height: 80px;
  background: #4174f6;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 40px;
`;

const Button = styled.button`
  width: 100%;
  padding: 16px;
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #3461d9;
  }
`;

const AccountInfo = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
`;

function Step7Complete({ onClose }) {
  return (
    <Container>
      <Title>계좌 개설 완료!</Title>
      <Description>
        토스증권 계좌가 성공적으로 개설되었습니다.<br />
        이제 투자를 시작할 수 있어요.
      </Description>
      
      <AccountInfo>
        <InfoRow>
          <Label>계좌번호</Label>
          <Value>1234-56-7890</Value>
        </InfoRow>
        <InfoRow>
          <Label>계좌종류</Label>
          <Value>위탁종합계좌</Value>
        </InfoRow>
        <InfoRow>
          <Label>개설일시</Label>
          <Value>{new Date().toLocaleDateString()}</Value>
        </InfoRow>
      </AccountInfo>

      <ImageContainer>
        <CompleteMark>✓</CompleteMark>
      </ImageContainer>

      <Button onClick={onClose}>
        시작하기
      </Button>
    </Container>
  );
}

export default Step7Complete;