// AccountManage.js
import React, { useState,useEffect } from 'react';
import styled from 'styled-components';
import RightsModal from './modal/RightModal';
import PasswordModal from './modal/PwChangeModal';
import TerminationModal from './modal/TerminationModal';
import axios from 'axios';
import dayjs from 'dayjs';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

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
  padding: 20px;
  margin: 12px 0;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #E5E8EB;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background: #F8F9FA;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ManageRowContent = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background: ${props => props.background || '#E5E8EB'};
`;

const Arrow = styled.div`
  font-size: 18px;
  color: #666;
  transition: transform 0.2s ease-in-out;
  
  ${ManageRow}:hover & {
    transform: translateX(4px);
  }
`;

function AccountManage() {
  const [isRightModalOpen, setIsRightModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAccountTerminationModalOpen, setIsAccountTerminationModalOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('jwtToken');
        console.log('Token exists:', !!token);
        
        if (!token) {
          setError('로그인이 필요합니다.');
          setLoading(false);
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // 1. 사용자 정보 가져오기
        console.log('Fetching user info...');
        const userResponse = await axios.get(`${API_BASE_URL}/users/me`, { headers });
        console.log('User info response:', userResponse.data);
        
        setUser(userResponse.data);
        const primaryAccountId = userResponse.data.primaryAccountId;
        console.log('Primary Account ID from user:', primaryAccountId);

        if (!primaryAccountId) {
          setError('주계좌 정보를 찾을 수 없습니다.');
          setLoading(false);
          return;
        }

        // 2. 계좌 정보 가져오기
        console.log('Fetching account info for account:', primaryAccountId);
        const accountResponse = await axios.get(`${API_BASE_URL}/account`, {
          headers,
          params: {
            accountId: primaryAccountId
          }
        });

        console.log('Account info response:', accountResponse.data);
        setAccountInfo(accountResponse.data);

      } catch (error) {
        console.error('API 호출 중 에러 발생:', error);
        console.error('Error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            headers: error.config?.headers,
            params: error.config?.params
          }
        });

        if (error.response?.status === 401) {
          setError('로그인이 만료되었습니다. 다시 로그인해주세요.');
          localStorage.removeItem('jwtToken');
        } else {
          setError(
            error.response?.data?.message ||
            '정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openRightModal = () => setIsRightModalOpen(true);
  const closeRightModal = () => setIsRightModalOpen(false);
  const openPasswordModal = () => setIsPasswordModalOpen(true);
  const closePasswordModal = () => setIsPasswordModalOpen(false);
  const openAccountTerminationModal = () => setIsAccountTerminationModalOpen(true);
  const closeAccountTerminationModal = () => setIsAccountTerminationModalOpen(false);

  const handleAccountTermination = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('로그인이 필요합니다.');
        return;
      }

      await axios.post(`${API_BASE_URL}/account/terminate`, {
        accountId: accountInfo.accountId
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      closeAccountTerminationModal();
      // 성공 후 필요한 처리 (예: 메인 페이지로 리다이렉트)
    } catch (error) {
      console.error('계좌 해지 중 오류 발생:', error);
      setError('계좌 해지에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          로딩중...
        </div>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return dayjs(dateString).format('YYYY년 MM월 DD일');
  };

  return (
    <Container>
      <Title>계좌 관리</Title>

      {error && (
        <div style={{ 
          color: '#dc3545', 
          padding: '16px', 
          margin: '0 40px 16px',
          background: '#ffebee', 
          borderRadius: '8px',
          border: '1px solid #dc3545' 
        }}>
          {error}
        </div>
      )}

      <SectionTitle>내 계좌 정보</SectionTitle>
      <InfoSection>
        <InfoRow>
          <div>계좌번호</div>
          <div>{accountInfo?.accountId || '-'}</div>
        </InfoRow>
        <InfoRow>
          <div>개설일</div>
          <div>{formatDate(accountInfo?.createdAt)}</div>
        </InfoRow>
        <InfoRow>
          <div>금리</div>
          <div>1.4%</div>
        </InfoRow>
      </InfoSection>

      <SectionTitle>내 계좌 관리</SectionTitle>
      <ManageSection>
        <ManageRow onClick={openRightModal}>
          <ManageRowContent>
            <IconWrapper background="#e3f2fd">
              <span role="img" aria-label="rights" style={{ fontSize: '20px' }}>📋</span>
            </IconWrapper>
            <div>내 권리</div>
          </ManageRowContent>
          <Arrow>{'›'}</Arrow>
        </ManageRow>
        {isRightModalOpen && <RightsModal onClose={closeRightModal} />}

        <ManageRow onClick={openPasswordModal}>
          <ManageRowContent>
            <IconWrapper background="#fff3e0">
              <span role="img" aria-label="password" style={{ fontSize: '20px' }}>🔒</span>
            </IconWrapper>
            <div>계좌 비밀번호 변경</div>
          </ManageRowContent>
          <Arrow>{'›'}</Arrow>
        </ManageRow>
        {isPasswordModalOpen && <PasswordModal onClose={closePasswordModal} accountInfo={accountInfo} />}

        <ManageRow onClick={openAccountTerminationModal} style={{ color: '#dc3545' }}>
          <ManageRowContent>
            <IconWrapper background="#ffebee">
              <span role="img" aria-label="terminate" style={{ fontSize: '20px' }}>⚠️</span>
            </IconWrapper>
            <div>계좌 해지</div>
          </ManageRowContent>
          <Arrow style={{ color: '#dc3545' }}>{'›'}</Arrow>
        </ManageRow>
        {isAccountTerminationModalOpen && (
          <TerminationModal
            onClose={closeAccountTerminationModal}
            onTerminate={handleAccountTermination}
            accountInfo={accountInfo}
          />
        )}
      </ManageSection>
    </Container>
  );
}

export default AccountManage;