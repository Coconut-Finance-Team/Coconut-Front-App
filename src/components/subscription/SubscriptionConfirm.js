import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  font-family: 'Noto Sans KR', sans-serif;
`;

const ModalContent = styled.div`
  padding: 40px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  font-family: 'Noto Sans KR', sans-serif;
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
`;

const Th = styled.th`
  padding: 16px;
  background: #f9fafb;
  font-weight: 500;
  color: #666;
  text-align: left;
  border: 1px solid #f2f2f2;
  width: 25%;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Td = styled.td`
  padding: 16px;
  color: #333;
  border: 1px solid #f2f2f2;
  font-family: 'Noto Sans KR', sans-serif;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
`;

const Button = styled.button`
  flex: 1;
  padding: 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  
  ${props => props.primary ? `
    background: #4174f6;
    color: white;
  ` : `
    background: #f8f9fa;
    color: #333;
  `}
`;

function SubscriptionConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { company, applicationData } = location.state || {};

  if (!company || !applicationData) {
    return <div>잘못된 접근입니다.</div>;
  }

  const handleClose = () => {
    navigate(-1);
  };

  const handleConfirm = () => {
    navigate('/subscription/apply/complete');
  };

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalContent>
          <Title>청약 신청 확인</Title>

          <Section>
            <SectionTitle>종목 정보</SectionTitle>
            <InfoCard>
              <Table>
                <tbody>
                  <tr>
                    <Th>청약종목명</Th>
                    <Td>{company.companyName}</Td>
                    <Th>확정발행가</Th>
                    <Td>{company.subscriptionPrice}</Td>
                  </tr>
                  <tr>
                    <Th>청약기간</Th>
                    <Td>{company.applicationPeriod}</Td>
                    <Th>경쟁률</Th>
                    <Td>{company.competitionRate}</Td>
                  </tr>
                </tbody>
              </Table>
            </InfoCard>
          </Section>

          <Section>
            <SectionTitle>청약 정보</SectionTitle>
            <InfoCard>
              <Table>
                <tbody>
                  <tr>
                    <Th>청약계좌</Th>
                    <Td>{applicationData.account}</Td>
                    <Th>청약수량</Th>
                    <Td>{applicationData.quantity}주</Td>
                  </tr>
                  <tr>
                    <Th>청약증거금</Th>
                    <Td>{applicationData.amount.toLocaleString()}원</Td>
                    <Th>청약수수료</Th>
                    <Td>{applicationData.fee.toLocaleString()}원</Td>
                  </tr>
                </tbody>
              </Table>
            </InfoCard>
          </Section>

          <ButtonContainer>
            <Button onClick={handleClose}>이전</Button>
            <Button primary onClick={handleConfirm}>확인</Button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default SubscriptionConfirm;
