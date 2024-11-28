import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ModalOverlay from './ModalOverlay';

const PinModalContent = styled.div`
  width: 400px;
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 32px;
  font-family: 'Noto Sans KR', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-align: center;
  position: relative;
`;

const PasswordModalTitle = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 32px;
  word-break: keep-all;
  line-height: 1.5;
`;

const PasswordCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
`;

const PinInput = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
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
  gap: 8px;
  max-width: 300px;
  margin: 0 auto;
`;

const KeyButton = styled.button`
  width: 90px;
  height: 64px;
  font-size: 24px;
  font-weight: 500;
  background: ${props => props.isDelete ? '#F0F4F7' : '#F8F9FA'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: ${props => props.isDelete ? '#333' : '#333'};
  display: flex;
  align-items: center;
  justify-content: center;

  &:active {
    background: ${props => props.isDelete ? '#E5E9EC' : '#F0F4F7'};
  }
`;

const ConfirmButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  background-color: #333;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    background-color: #444;
  }
`;

const ErrorMessage = styled.div`
  font-size: 14px;
  color: red;
  margin-top: 16px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const AnimationCheck = styled.div`
  font-size: 50px;
  color: #3498db;
  animation: ${bounce} 1s ease;
  margin-bottom: 16px;
`;

const CompletionMessage = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 600;
`;

const PasswordModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleKeyPress = (number, setPinFunction) => {
    setPinFunction(prevPin => (prevPin.length < 4 ? prevPin + number : prevPin));
  };

  const handleDelete = (setPinFunction) => {
    setPinFunction(prevPin => prevPin.slice(0, -1));
  };

  const verifyCurrentPassword = async () => {
    const isPasswordCorrect = true; // 예시로 항상 true로 설정

    if (isPasswordCorrect) {
      setStep(1);
    } else {
      setErrorMessage('현재 비밀번호가 일치하지 않습니다.');
    }
  };

  const updatePassword = async () => {
    const isUpdateSuccessful = true; // 예시로 항상 true로 설정

    if (isUpdateSuccessful) {
      setStep(3);
    } else {
      setErrorMessage('비밀번호 변경에 실패했습니다.');
    }
  };

  const proceedToNewPassword = () => {
    if (pin.length === 4) {
      verifyCurrentPassword();
    } else {
      setErrorMessage('4자리의 현재 비밀번호를 입력해주세요.');
    }
  };

  const proceedToConfirmPassword = () => {
    if (newPin.length === 4) {
      setStep(2);
    } else {
      setErrorMessage('4자리의 새 비밀번호를 입력해주세요.');
    }
  };

  const proceedToPasswordChanged = () => {
    if (newPin === confirmPin) {
      updatePassword();
    } else {
      setErrorMessage('새 비밀번호가 일치하지 않습니다.');
    }
  };

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  return (
    <ModalOverlay>
      <PinModalContent>
        <PasswordCloseButton onClick={onClose}>×</PasswordCloseButton>

        {step === 0 && (
          <>
            <PasswordModalTitle>현재 비밀번호를 입력해주세요</PasswordModalTitle>
            <PinInput>
              {[...Array(4)].map((_, index) => (
                <PinDot key={index} filled={index < pin.length} />
              ))}
            </PinInput>
            <Keypad>
              {[8, 1, 6, 4, 5, 3, 9, 0, 2, 7].map((number) => (
                <KeyButton key={number} onClick={() => handleKeyPress(number, setPin)}>
                  {number}
                </KeyButton>
              ))}
              <KeyButton isDelete onClick={() => handleDelete(setPin)}>←</KeyButton>
            </Keypad>
            {pin.length === 4 && (
              <ConfirmButton onClick={proceedToNewPassword}>확인</ConfirmButton>
            )}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </>
        )}

        {step === 1 && (
          <>
            <PasswordModalTitle>새 비밀번호를 입력해주세요</PasswordModalTitle>
            <PinInput>
              {[...Array(4)].map((_, index) => (
                <PinDot key={index} filled={index < newPin.length} />
              ))}
            </PinInput>
            <Keypad>
              {[0, 1, 6, 3, 9, 4, 7, 5, 8, 2].map((number) => (
                <KeyButton key={number} onClick={() => handleKeyPress(number, setNewPin)}>
                  {number}
                </KeyButton>
              ))}
              <KeyButton isDelete onClick={() => handleDelete(setNewPin)}>←</KeyButton>
            </Keypad>
            {newPin.length === 4 && (
              <ConfirmButton onClick={proceedToConfirmPassword}>다음</ConfirmButton>
            )}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </>
        )}

        {step === 2 && (
          <>
            <PasswordModalTitle>비밀번호를 다시 입력해주세요</PasswordModalTitle>
            <PinInput>
              {[...Array(4)].map((_, index) => (
                <PinDot key={index} filled={index < confirmPin.length} />
              ))}
            </PinInput>
            <Keypad>
              {[3, 6, 1, 0, 9, 7, 2, 4, 8, 5].map((number) => (
                <KeyButton key={number} onClick={() => handleKeyPress(number, setConfirmPin)}>
                  {number}
                </KeyButton>
              ))}
              <KeyButton isDelete onClick={() => handleDelete(setConfirmPin)}>←</KeyButton>
            </Keypad>
            {confirmPin.length === 4 && (
              <ConfirmButton onClick={proceedToPasswordChanged}>확인</ConfirmButton>
            )}
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
          </>
        )}

        {step === 3 && (
          <>
            <AnimationCheck>✔</AnimationCheck>
            <CompletionMessage>비밀번호가 성공적으로 변경되었습니다!</CompletionMessage>
          </>
        )}
      </PinModalContent>
    </ModalOverlay>
  );
};

export default PasswordModal;
