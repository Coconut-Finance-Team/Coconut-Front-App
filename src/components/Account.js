import React, { useState } from 'react';
import styled from 'styled-components';
import CreateAccountModal from './account/createAccount/CreateAccountModal';
import AccountSidebar from './account/AccountSidebar';
import AssetLog from './account/AssetLog';
import AssetSummary from './account/AssetSummary';
import TransactionLog from './account/TransactionLog';
import OrderLog from './account/OrderLog';
import Sales from './account/Sales';
import AccountManage from './account/AccountManage';
import SubscriptionHistory from './account/SubscriptionHistory';
import accountImage from '../assets/account.png';

const NoAccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: white;
  padding: 20px;
  padding-bottom: 120px;
`;

const MessageText = styled.p`
  font-size: 18px;
  color: #666;
  margin: 0;
  margin-bottom: 12px;
  margin-top: -40px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333;
  margin: 0;
  margin-bottom: 32px;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
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

  &:nth-child(1) { top: 10%; left: 0; animation-delay: 0s; }
  &:nth-child(2) { top: 20%; right: 0; animation-delay: 0.5s; }
  &:nth-child(3) { bottom: 20%; left: 0; animation-delay: 1s; }
  &:nth-child(4) { bottom: 10%; right: 0; animation-delay: 1.5s; }
`;

const CreateButton = styled.button`
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

const PageContainer = styled.div`
  min-height: 100vh;
  background: #ffffff;
`;

const MainLayout = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px;
  position: relative;
  margin: 0 auto;
  max-width: 1720px;
  gap: 24px;
`;

function Account() {
  const [hasAccount, setHasAccount] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activePage, setActivePage] = useState('assets');

  const handleCreateAccount = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setHasAccount(true);
  };

  if (!hasAccount) {
    return (
      <>
        <NoAccountContainer>
          <MessageText>아직 코코넛증권 계좌가 없어요</MessageText>
          <Title>지금 계좌를 만들까요?</Title>
          
          <ImageContainer>
            <AccountImageStyled src={accountImage} alt="계좌 이미지" />
            <StockIconContainer>
              <StockIcon delay={2}>📈</StockIcon>
              <StockIcon delay={2.5}>💰</StockIcon>
              <StockIcon delay={3}>📊</StockIcon>
              <StockIcon delay={3.5}>💸</StockIcon>
            </StockIconContainer>
          </ImageContainer>

          <CreateButton onClick={handleCreateAccount}>
            계좌 만들기
          </CreateButton>
        </NoAccountContainer>
        {showModal && <CreateAccountModal onClose={handleCloseModal} />}
      </>
    );
  }

  const renderContent = () => {
    switch (activePage) {
      case 'assets':
        return <AssetLog />;
      case 'transactions':
        return <TransactionLog />;
      case 'orders':
        return <OrderLog />;
      case 'subscriptions':
        return <SubscriptionHistory />;
      case 'sales':
        return <Sales />;
      case 'management':
        return <AccountManage />;
      default:
        return <AssetLog />;
    }
  };

  return (
    <PageContainer>
      <MainLayout>
        <AccountSidebar 
          activePage={activePage} 
          onMenuClick={setActivePage}
        />
        
        <div style={{ flex: '0 1 960px', minWidth: 0 }}>
          {renderContent()}
        </div>
        
        <div style={{ width: '320px', position: 'sticky', top: '24px', height: 'fit-content' }}>
          <AssetSummary />
        </div>
      </MainLayout>
    </PageContainer>
  );
}

export default Account;