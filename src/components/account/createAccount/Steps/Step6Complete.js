import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

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

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
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

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-bottom: 16px;
  font-size: 14px;
`;

function Step6Complete({ onClose, formData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // 현재 사용자 정보 조회
  const getCurrentUser = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) throw new Error('인증이 필요합니다.');

      const response = await axios.get('http://localhost:8080/api/v1/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Current user:', {
        ...response.data,
        phone: '***-****-****' // 민감정보 마스킹
      });

      return response.data;
      
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw new Error('사용자 정보를 불러올 수 없습니다.');
    }
  };

  const createAccount = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('인증이 필요합니다. 다시 로그인해주세요.');
      }

      // 현재 사용자 정보 조회
      const userInfo = await getCurrentUser();
      
      // 입력 정보와 사용자 정보 비교
      if (!userInfo) {
        throw new Error('사용자 정보를 찾을 수 없습니다.');
      }

      // AccountCreationRequest DTO 형식에 맞춘 데이터
      const registerRequest = {
        username: userInfo.username,  // 현재 로그인한 사용자 이름 사용
        phone: userInfo.phone,        // 현재 로그인한 사용자 전화번호 사용
        socialSecurityNumber: formData.identityInfo.socialSecurityNumber.replace(/-/g, ''), // 하이픈 제거
        accountPurpose: formData.accountInfo.purpose,
        accountAlias: formData.accountInfo.alias,
        accountPassword: formData.password
      };

      // 요청 데이터 로깅 (민감정보 마스킹)
      console.log('Sending account creation request:', {
        ...registerRequest,
        socialSecurityNumber: '******-*******',
        accountPassword: '****',
        phone: '###-####-####'
      });

      const response = await axios.post(
        'http://localhost:8080/api/v1/account/create',
        registerRequest,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Server response:', response.data);

      if (response.data?.accountId) {
        setAccountNumber(response.data.accountId);
      } else {
        throw new Error('계좌번호를 받지 못했습니다.');
      }

    } catch (err) {
      console.error('Account creation failed:', err);
      
      if (err.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || '입력하신 정보를 다시 확인해주세요.');
      } else if (err.message.includes('사용자 정보를 찾을 수 없습니다')) {
        setError('로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.');
        navigate('/login');
      } else if (err.response?.status === 500) {
        if (err.response.data?.message?.includes('사용자 정보가 일치하지 않습니다')) {
          setError('입력하신 정보가 가입 시 등록한 정보와 일치하지 않습니다.');
        } else {
          setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
      } else {
        setError('계좌 생성 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      createAccount();
    }
  }, []);


  // UI 부분은 동일
  return (
    <Container>
      <Title>계좌 개설 {loading ? '진행 중...' : (error ? '실패' : '완료!')}</Title>
      
      {error ? (
        <>
          <ErrorMessage>{error}</ErrorMessage>
          <Button onClick={createAccount}>다시 시도</Button>
        </>
      ) : (
        <>
          <Description>
            {loading ? '계좌를 생성하고 있습니다...' : '코코넛증권 계좌가 성공적으로 개설되었습니다.'}
            <br />
            {!loading && '이제 투자를 시작할 수 있어요.'}
          </Description>
          
          {!loading && accountNumber && (
            <AccountInfo>
              <InfoRow>
                <Label>계좌번호</Label>
                <Value>{accountNumber}</Value>
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
          )}

          <ImageContainer>
            {loading ? (
              <CompleteMark>⟳</CompleteMark>
            ) : (
              <CompleteMark>✓</CompleteMark>
            )}
          </ImageContainer>

          <Button onClick={onClose} disabled={loading}>
            {loading ? '처리중...' : '시작하기'}
          </Button>
        </>
      )}
    </Container>
  );
}

export default Step6Complete;

