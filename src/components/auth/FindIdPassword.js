import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
`;

const FormCard = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 0 0 1px #e5e8eb;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #191f28;
  margin-bottom: 32px;
  text-align: center;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
`;

const Step = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#4174f6' : '#e5e8eb'};
  margin: 0 6px;
  transition: all 0.2s ease;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #4174f6;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const PhoneInput = styled(Input)`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const VerificationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const VerificationInput = styled(Input)`
  flex: 1;
`;

const VerificationButton = styled.button`
  width: 100px;
  height: 48px;
  background-color: #f8f9fa;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f1f3f5;
  }
`;

const TimerText = styled.span`
  font-size: 14px;
  color: #ff4747;
  margin-left: 8px;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #4174f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  
  &:disabled {
    color: #adb5bd;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  width: 100%;
  height: 48px;
  background-color: #4174f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 16px;

  &:disabled {
    background-color: #e5e8eb;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #ff4747;
  font-size: 14px;
  margin-top: 8px;
`;

const Message = styled.p`
  color: #00c073;
  font-size: 14px;
  margin-top: 8px;
`;

function FindPassword() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      setIsVerificationSent(false);
      setMessage('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSendVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/send-verification-code`, {
        email: formData.email,
        phone: formData.phone
      });
      if (response.status === 200) {
        setIsVerificationSent(true);
        setTimeLeft(180);
        setTimerActive(true);
        setMessage('인증번호가 전송되었습니다.');
        setError('');
      }
    } catch (err) {
      setError('인증번호 전송에 실패했습니다.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/verify-code`, {
        email: formData.email,
        code: formData.verificationCode
      });
      if (response.status === 200) {
        setIsVerified(true);
        setStep(2);
        setMessage('인증이 완료되었습니다.');
        setError('');
      }
    } catch (err) {
      setError('잘못된 인증번호입니다.');
    }
  };

  const handleSubmitNewPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/update-password`, {
        email: formData.email,
        password: formData.newPassword
      });
      if (response.status === 200) {
        setStep(3);
        setMessage('비밀번호가 성공적으로 변경되었습니다.');
      }
    } catch (err) {
      setError('비밀번호 변경에 실패했습니다.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Form onSubmit={handleVerifyCode}>
            <InputGroup>
              <Label>휴대폰 번호</Label>
              <PhoneInput
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="휴대폰 번호를 입력하세요"
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>이메일</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="이메일 주소를 입력하세요"
                required
              />
            </InputGroup>
            {!isVerificationSent ? (
              <Button type="button" onClick={handleSendVerification}>
                인증번호 받기
              </Button>
            ) : (
              <InputGroup>
                <Label>인증번호</Label>
                <VerificationContainer>
                  <VerificationInput
                    type="text"
                    name="verificationCode"
                    value={formData.verificationCode}
                    onChange={handleChange}
                    placeholder="인증번호 6자리"
                    required
                  />
                  <VerificationButton type="submit">확인</VerificationButton>
                  {timerActive && (
                    <TimerText>{`${Math.floor(timeLeft / 60)}:${timeLeft % 60}`}</TimerText>
                  )}
                </VerificationContainer>
              </InputGroup>
            )}
          </Form>
        );
      case 2:
        return (
          <Form onSubmit={handleSubmitNewPassword}>
            <InputGroup>
              <Label>새 비밀번호</Label>
              <Input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
                required
              />
            </InputGroup>
            <InputGroup>
              <Label>비밀번호 확인</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="비밀번호를 다시 입력하세요"
                required
              />
            </InputGroup>
            <Button type="submit">비밀번호 변경</Button>
          </Form>
        );
      case 3:
        return (
          <div style={{ textAlign: 'center' }}>
            <Message>비밀번호가 성공적으로 변경되었습니다.</Message>
            <Button onClick={() => window.location.href = '/login'}>로그인하기</Button>
          </div>
        );
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <FormCard>
          <Title>비밀번호 찾기</Title>
          <StepIndicator>
            <Step active={step >= 1} />
            <Step active={step >= 2} />
            <Step active={step >= 3} />
          </StepIndicator>
          {renderStep()}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {message && <Message>{message}</Message>}
        </FormCard>
      </Container>
    </>
  );
}

export default FindPassword;
