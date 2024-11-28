import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 40px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 40px;
`;

const PinInput = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const PinDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => (props.filled ? '#333' : '#DFE4EA')};
`;

const Keypad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-width: 360px;
  margin: 0 auto;
`;

const KeyButton = styled.button`
  width: 100%;
  height: 64px;
  font-size: 24px;
  font-weight: 500;
  background: ${props => props.isDelete ? '#F0F4F7' : '#F8F9FA'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.isDelete ? '#E5E9EC' : '#F0F4F7'};
  }
`;

const ErrorMessage = styled.p`
  color: #ff4747;
  font-size: 14px;
  margin-top: 16px;
`;

const Step5Password = ({ onNext, onPrev, formData, updateFormData }) => {
  const [pin, setPin] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const prevFormData = location.state || {};
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState('create'); // create or confirm
  const [error, setError] = useState('');
  const [keypadNumbers, setKeypadNumbers] = useState([]);

  useEffect(() => {
    // 키패드 숫자 랜덤 배치
    const shuffleNumbers = () => {
      const numbers = Array.from({ length: 10 }, (_, i) => i);
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }
      return numbers;
    };
    setKeypadNumbers(shuffleNumbers());
  }, [step]); // step이 변경될 때마다 키패드 재배치

  const handleNumberClick = (number) => {
    if (step === 'create' && pin.length < 4) {
      setPin(prev => prev + number);
    } else if (step === 'confirm' && confirmPin.length < 4) {
      setConfirmPin(prev => prev + number);
    }
  };

  const handleDelete = () => {
    if (step === 'create') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

// Step5Password.js에서 비밀번호 처리
useEffect(() => {
  if (pin.length === 4 && step === 'create') {
    setStep('confirm');
  } else if (confirmPin.length === 4 && step === 'confirm') {
    if (pin === confirmPin) {
      console.log('Updating password:', pin);
      updateFormData({
        password: pin
      });
      onNext();
    } else {
      setError('비밀번호가 일치하지 않습니다.');
      setConfirmPin('');
      setTimeout(() => setError(''), 3000);
    }
  }
}, [pin, confirmPin, step]);

  return (
    <Container>
      <Title>
        {step === 'create' 
          ? '계좌 비밀번호 4자리를 입력해주세요' 
          : '비밀번호를 한번 더 입력해주세요'}
      </Title>

      <PinInput>
        {[...Array(4)].map((_, index) => (
          <PinDot 
            key={index} 
            filled={step === 'create' 
              ? index < pin.length 
              : index < confirmPin.length}
          />
        ))}
      </PinInput>

      <Keypad>
        {keypadNumbers.map((number) => (
          <KeyButton
            key={number}
            onClick={() => handleNumberClick(number)}
          >
            {number}
          </KeyButton>
        ))}
        <KeyButton isDelete onClick={handleDelete}>←</KeyButton>
      </Keypad>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default Step5Password;