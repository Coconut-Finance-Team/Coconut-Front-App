// TerminationModal.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import ModalOverlay from './ModalOverlay';

const TerminationModalContent = styled.div`
  width: 440px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  font-family: 'Noto Sans KR', sans-serif;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  text-align: center;
`;

const TerminationModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  line-height: 1.4;
`;

const TerminationContent = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  text-align: left;
  padding: 0 4px;
  margin-bottom: 24px;
  white-space: pre-line;
`;

const TerminationFooter = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const TerminationCancelButton = styled.button`
  background: #f8f9fa;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:hover {
    background: #f3f4f5;
  }
`;

const TerminationConfirmButton = styled.button`
  background: #ff5d5d;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #ffffff;

  &:hover {
    background: #ff4c4c;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 16px;
  color: #666;
  cursor: pointer;
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
  max-width: 240px;
  margin: 0 auto;
`;

const KeyButton = styled.button`
  width: 80px;
  height: 56px;
  font-size: 20px;
  font-weight: 500;
  background: ${props => props.isDelete ? '#F0F4F7' : '#F8F9FA'};
  border: none;
  border-radius: 12px;
  cursor: pointer;
  color: #333;

  &:active {
    background: ${props => props.isDelete ? '#E5E9EC' : '#F0F4F7'};
  }
`;

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const wave = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-15deg); }
  40% { transform: rotate(10deg); }
  60% { transform: rotate(-10deg); }
  80% { transform: rotate(5deg); }
`;

const CheckAnimation = styled.div`
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

const WaveHand = styled.span`
  display: inline-block;
  font-size: 32px;
  margin-left: 8px;
  animation: ${wave} 1.5s infinite;
`;

const TerminationModal = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState('');

  const handleKeyPress = (number) => {
    if (pin.length < 4) setPin(pin + number);
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const proceedToNextStep = () => {
    setStep(prevStep => prevStep + 1);
  };

  // step === 3일 때 2초 후에 모달을 닫음
  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(onClose, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, onClose]);

  return (
    <ModalOverlay>
      <TerminationModalContent>
        <CloseButton onClick={onClose}>×</CloseButton>

        {step === 0 && (
          <>
            <TerminationModalTitle>
              코코넛증권 계좌 및 서비스를 해지하시겠어요?
            </TerminationModalTitle>
            <TerminationContent>
              • 주식정보 서비스와 관련된 모든 정보가 삭제되고 복구할 수 없습니다.{"\n\n"}
              • 서비스 해지 후에도 주식관련정보 확인은 계속 사용 가능합니다.{"\n\n"}
              • 반복적으로 계좌를 폐쇄하는 경우 신규 계좌 개설이 제한될 수 있습니다.
            </TerminationContent>
            <TerminationFooter>
              <TerminationCancelButton onClick={onClose}>
                취소
              </TerminationCancelButton>
              <TerminationConfirmButton onClick={proceedToNextStep}>
                네, 해지할게요
              </TerminationConfirmButton>
            </TerminationFooter>
          </>
        )}

        {step === 1 && (
          <>
            <TerminationModalTitle>
              코코넛증권 계좌를 먼저 해지하고 서비스를 해지할게요
            </TerminationModalTitle>
            <TerminationContent>
              미수된 금액이나 미납 세금 등이 있는 경우, 이메일을 통해 통지됩니다.{"\n\n"}
              동의하지 않을 시 계좌를 해지할 수 없습니다.
            </TerminationContent>
            <TerminationFooter>
              <TerminationCancelButton onClick={onClose}>
                취소
              </TerminationCancelButton>
              <TerminationConfirmButton onClick={proceedToNextStep}>
                계좌 해지
              </TerminationConfirmButton>
            </TerminationFooter>
          </>
        )}

        {step === 2 && (
          <>
            <TerminationModalTitle>계좌를 해지하려면<br />계좌 비밀번호를 입력해주세요</TerminationModalTitle>
            <PinInput>
              {[...Array(4)].map((_, index) => (
                <PinDot key={index} filled={index < pin.length} />
              ))}
            </PinInput>
            <Keypad>
              {[...Array(10).keys()].map((number) => (
                <KeyButton key={number} onClick={() => handleKeyPress(number)}>
                  {number}
                </KeyButton>
              ))}
              <KeyButton isDelete onClick={handleDelete}>←</KeyButton>
            </Keypad>
            {pin.length === 4 && (
              <TerminationConfirmButton onClick={proceedToNextStep} style={{ marginTop: '20px' }}>
                확인
              </TerminationConfirmButton>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <CheckAnimation>✔</CheckAnimation>
            <CompletionMessage>
              계좌 해지가 완료되었습니다.<br />
        코코넛은 당신을 언제나 기다릴게요!<WaveHand>🖐</WaveHand>
            </CompletionMessage>
          </>
        )}
      </TerminationModalContent>
    </ModalOverlay>
  );
};

export default TerminationModal;
