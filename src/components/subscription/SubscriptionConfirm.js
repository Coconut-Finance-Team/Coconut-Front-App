import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

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
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: 'Noto Sans KR', sans-serif;
  opacity: ${props => props.disabled ? 0.7 : 1};
  
  ${props => props.primary ? `
    background: #4174f6;
    color: white;
    &:hover {
      background: ${props.disabled ? '#4174f6' : '#3461d9'};
    }
  ` : `
    background: #f8f9fa;
    color: #333;
    &:hover {
      background: ${props.disabled ? '#f8f9fa' : '#f0f0f0'};
    }
  `}
`;

// API 설정
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 요청 인터셉터에 토큰 추가
api.interceptors.request.use(request => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    request.headers['Authorization'] = `Bearer ${token}`;
  }
  console.log('Request:', request);
  return request;
});

// 응답 인터셉터 상세 로깅
api.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: error.config
    });
    return Promise.reject(error);
  }
);

function SubscriptionConfirm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { company, applicationData } = location.state || {};
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!company || !applicationData) {
    return <div>잘못된 접근입니다.</div>;
  }

  const handleClose = () => {
    navigate(-1);
  };

  // 데이터 유효성 검사
  const validateSubscriptionData = (data) => {
    const errors = [];
    
    if (!data.IPOId) errors.push('종목 정보가 없습니다.');
    if (!data.quantity || data.quantity <= 0) errors.push('청약 수량이 유효하지 않습니다.');
    if (!data.accountNumber) errors.push('계좌번호가 없습니다.');
    if (!data.depositAmount || data.depositAmount <= 0) errors.push('청약증거금이 유효하지 않습니다.');
    
    return errors;
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);
      
      // DTO에 맞게 데이터 구조 단순화
      const subscriptionData = {
        ipoId: company.id,  // IPO ID
        quantity: parseInt(applicationData.quantity) // 청약 수량
      };
  
      // 데이터 유효성 검사 단순화
      const validateSubscriptionData = (data) => {
        const errors = [];
        
        if (!data.ipoId) errors.push('종목 정보가 없습니다.');
        if (!data.quantity || data.quantity <= 0) errors.push('청약 수량이 유효하지 않습니다.');
        
        return errors;
      };
  
      // 데이터 유효성 검사
      const validationErrors = validateSubscriptionData(subscriptionData);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('\n'));
      }
  
      console.log('Request payload:', subscriptionData);
  
      const token = localStorage.getItem('jwtToken');
      const response = await api.post('/ipo/subscription', subscriptionData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
  
      console.log('API Response structure:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
  
      navigate('/subscription/apply/complete', {
        state: {
          company,
          applicationData,
          subscriptionResult: response.data
        }
      });
    } catch (error) {
      console.error('Subscription error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.config?.data
      });
      
      let errorMessage = '청약 신청 중 오류가 발생했습니다.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 500) {
        errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else if (error.response?.status === 401) {
        errorMessage = '인증이 만료되었습니다. 다시 로그인해주세요.';
        navigate('/login');
        return;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
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
            <Button 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              이전
            </Button>
            <Button 
              primary 
              onClick={handleConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? '처리중...' : '확인'}
            </Button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default SubscriptionConfirm;