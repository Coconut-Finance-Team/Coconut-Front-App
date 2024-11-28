import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-family: 'Noto Sans KR', sans-serif;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalContent = styled.div`
  padding: 40px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
`;

const InfoCard = styled.div`
  background: #fff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Th = styled.th`
  padding: 16px;
  color: #666;
  font-weight: 500;
  text-align: left;
  width: 35%;
  background: #f9fafb;
`;

const Td = styled.td`
  padding: 16px;
  color: #333;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 16px 48px;
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    background-color: #3461d9;
  }
`;

function SubscriptionComplete() {
  const navigate = useNavigate();

  return (
    <ModalOverlay onClick={() => navigate('/')}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalContent>
          <Title>청약신청이 완료되었습니다!</Title>

          <InfoCard>
            <Table>
              <tbody>
                <tr>
                  <Th>청약계좌</Th>
                  <Td>46309613-01 위탁계좌</Td>
                </tr>
                <tr>
                  <Th>종목</Th>
                  <Td>주식회사 에이펙스</Td>
                </tr>
                <tr>
                  <Th>청약수량</Th>
                  <Td>50주</Td>
                </tr>
                <tr>
                  <Th>청약증거금</Th>
                  <Td>400,000원</Td>
                </tr>
                <tr>
                  <Th>청약수수료</Th>
                  <Td>2,000원</Td>
                </tr>
              </tbody>
            </Table>
          </InfoCard>

          <InfoCard>
            <Table>
              <tbody>
                <tr>
                  <Th>환불일</Th>
                  <Td>2024.10.28</Td>
                </tr>
                <tr>
                  <Th>환불금 이체계좌</Th>
                  <Td>46309613-01 위탁계좌</Td>
                </tr>
                <tr>
                  <Th>상장일</Th>
                  <Td>2024.11.01</Td>
                </tr>
              </tbody>
            </Table>
          </InfoCard>

          <ButtonContainer>
            <Button onClick={() => navigate('/')}>확인</Button>
            <Button onClick={() => navigate('/subscription/inquiry')}>신청청약 조회</Button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default SubscriptionComplete;
