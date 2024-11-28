import React from 'react';
import styled from 'styled-components';
import accountImage from '../../../../assets/account.png';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  padding-bottom: 60px;
  min-height: 600px;
  height: 100%;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-bottom: 12px;
  margin-top: -20px;
  text-align: center;
`;

const Description = styled.p`
  font-size: 18px;
  color: #666;
  margin: 0;
  margin-bottom: 24px;
  text-align: center;
  line-height: 1.5;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 280px;
  height: 240px;
  margin: 20px 0 32px;
  margin-bottom: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AccountImageStyled = styled.img`
  width: 160px;
  height: auto;
  object-fit: contain;
  position: relative;
  z-index: 1;
`;

const StockIconContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
`;

const StockIcon = styled.div`
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 24px;
  position: absolute;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 2;
  animation: float ${props => props.delay}s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  &:nth-child(1) { top: 15%; left: 5%; }
  &:nth-child(2) { top: 25%; right: 5%; }
  &:nth-child(3) { bottom: 25%; left: 5%; }
  &:nth-child(4) { bottom: 15%; right: 5%; }
`;

const StartButton = styled.button`
  padding: 0 40px;
  height: 56px;
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 28px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3461d9;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

function Step1Welcome({ onNext }) {
  return (
    <Container>
      <Title>코코넛증권 계좌 만들기</Title>
      <Description>
        간단한 정보 입력으로<br />
        몇 분 만에 계좌를 만들 수 있어요
      </Description>
      
      <ImageContainer>
        <AccountImageStyled src={accountImage} alt="계좌 이미지" />
        <StockIconContainer>
          <StockIcon delay={2}>📈</StockIcon>
          <StockIcon delay={2.5}>💰</StockIcon>
          <StockIcon delay={3}>📊</StockIcon>
          <StockIcon delay={3.5}>💸</StockIcon>
        </StockIconContainer>
      </ImageContainer>

      <StartButton onClick={onNext}>
        시작하기
      </StartButton>
    </Container>
  );
}

export default Step1Welcome;