import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const PageContainer = styled.div`
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #333;
`;

const InfoSection = styled.section`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;

const InfoItem = styled.div`
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
`;

const InfoLabel = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const InfoValue = styled.p`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 24px;
`;

const ErrorMessage = styled.p`
  color: #e53e3e;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: #2563eb;
  }
`;

const LoadingItem = styled.div`
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
  
  animation: pulse 1.5s infinite ease-in-out;
  background: #e2e8f0;
  height: 20px;
  border-radius: 4px;
  width: 80%;
`;

function MyPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetchUserInfo = async () => {
      const token = localStorage.getItem('jwtToken');
      console.log('저장된 토큰:', token);
      
      if (token) {
        setIsLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('받아온 사용자 정보:', data);
            setUser(data);
          } else {
            console.error('사용자 정보 가져오기 실패');
            localStorage.removeItem('jwtToken');
            setUser(null);
            setError('사용자 정보를 가져오는데 실패했습니다. 다시 로그인해주세요.');
            navigate('/login');
          }
        } catch (error) {
          console.error('API 호출 에러:', error);
          localStorage.removeItem('jwtToken');
          setUser(null);
          setError('서버 연결에 실패했습니다. 다시 시도해주세요.');
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError('로그인이 필요합니다.');
        navigate('/login');
      }
    };
    
    checkAndFetchUserInfo();
  }, [navigate]);

  const handleLogoutClick = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    navigate('/');
  };

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <Button onClick={() => navigate('/login')}>
          로그인하기
        </Button>
      </ErrorContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>내 정보</PageTitle>
      
      <InfoSection>
        <SectionTitle>기본 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>이름</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.username || '-')}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>이메일</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.email || '-')}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>전화번호</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.phone || '-')}
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>
      
      <InfoSection>
        <SectionTitle>투자 정보</SectionTitle>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>직업</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.job || '-')}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>성별</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.gender || '-')}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>투자 성향</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.investmentStyle || '-')}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>대표 계좌번호</InfoLabel>
            <InfoValue>
              {isLoading ? <LoadingItem /> : (user?.primaryAccountId || '-')}
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </InfoSection>
    </PageContainer>
  );
}

export default MyPage;