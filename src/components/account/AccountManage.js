// AccountManage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import RightsModal from './modal/RightModal';
import PasswordModal from './modal/PwChangeModal';
import TerminationModal from './modal/TerminationModal';

const Container = styled.div`
  padding: 40px 0;
  background: #ffffff;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  padding-left: 40px;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-left: 40px;
`;

const InfoSection = styled.div`
  margin-bottom: 32px;
  border-bottom: 1px solid #E5E8EB;
  padding-left: 40px;
  padding-right: 40px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #E5E8EB;
  font-size: 15px;
  color: #333;

  &:last-child {
    border-bottom: none;
  }
`;

const ManageSection = styled.div`
  padding-left: 40px;
  padding-right: 40px;
`;

const ManageRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  border-bottom: 1px solid #E5E8EB;

  &:last-child {
    border-bottom: none;
  }
`;

const Arrow = styled.div`
  font-size: 18px;
  color: #666;
`;

function AccountManage() {
  const [isRightModalOpen, setIsRightModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAccountTerminationModalOpen, setIsAccountTerminationModalOpen] = useState(false);

  const openRightModal = () => {
    setIsRightModalOpen(true);
  };

  const closeRightModal = () => {
    setIsRightModalOpen(false);
  };

  const openPasswordModal = () => {
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
  };

  const openAccountTerminationModal = () => {
    setIsAccountTerminationModalOpen(true);
  };

  const closeAccountTerminationModal = () => {
    setIsAccountTerminationModalOpen(false);
  };

  const handleAccountTermination = () => {
    console.log("Account termination confirmed.");
    closeAccountTerminationModal();
  };

  return (
    <Container>
      <Title>계좌 관리</Title>

      <SectionTitle>내 계좌 정보</SectionTitle>
      <InfoSection>
        <InfoRow>
          <div>계좌번호</div>
          <div>110-184-4569</div>
        </InfoRow>
        <InfoRow>
          <div>개설일</div>
          <div>2024년 3월 12일</div>
        </InfoRow>
        <InfoRow>
          <div>금리</div>
          <div>2.5%</div>
        </InfoRow>
      </InfoSection>

      <SectionTitle>내 계좌 관리</SectionTitle>
      <ManageSection>
        <ManageRow onClick={openRightModal}>
          <div>내 권리</div>
          <Arrow>{'>'}</Arrow>
        </ManageRow>
        {isRightModalOpen && <RightsModal onClose={closeRightModal} />}

        <ManageRow onClick={openPasswordModal}>
          <div>계좌 비밀번호 변경</div>
          <Arrow>{'>'}</Arrow>
        </ManageRow>
        {isPasswordModalOpen && <PasswordModal onClose={closePasswordModal} />}

        <ManageRow onClick={openAccountTerminationModal}>
          <div>계좌 해지</div>
          <Arrow>{'>'}</Arrow>
        </ManageRow>
        {isAccountTerminationModalOpen && (
          <TerminationModal 
            onClose={closeAccountTerminationModal} 
            onTerminate={handleAccountTermination} 
          />
        )}
      </ManageSection>
    </Container>
  );
}

export default AccountManage;
