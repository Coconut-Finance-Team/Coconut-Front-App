// CreateAccountModal.js
import React, { useState } from 'react';
import styled from 'styled-components';
import Step1Welcome from './Steps/Step1Welcome';
import Step2Terms from './Steps/Step2Terms';
import Step3Identity from './Steps/Step3Identity';
import Step4AccountType from './Steps/Step4AccountType';
import Step5Password from './Steps/Step5Password';
import Step6Complete from './Steps/Step6Complete';

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
  width: 100%;
  max-width: 448px;
  height: 680px; // 고정 높이로 변경
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const ModalHeader = styled.div`
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f2f2f2;
`;

const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 2px;
  background: #f2f2f2;

  &::after {
    content: '';
    display: block;
    width: ${props => (props.progress * 100)}%;
    height: 100%;
    background: #4174f6;
    transition: width 0.3s ease;
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const TOTAL_STEPS = 6;

const STEP_TITLES = {
  1: '계좌 만들기',
  2: '약관 동의',
  3: '본인 확인',
  4: '계좌 정보',
  5: '비밀번호 설정',
  6: '완료'
};

function CreateAccountModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    termsAgreed: [],
    identityInfo: {},
    accountInfo: {},
    password: ''
  });

  const getStepTitle = () => {
    return STEP_TITLES[currentStep] || '';
  };

  console.log('Current Form Data in Modal:', formData);

  const updateFormData = (newData) => {
    console.log('Updating form data with:', newData);
    setFormData(prev => {
      const updated = { ...prev, ...newData };
      console.log('Updated form data:', updated);
      return updated;
    });
  };

  const handleNext = () => {
    console.log(`Moving from step ${currentStep} to ${currentStep + 1}`);
    console.log('Form data at step transition:', formData);
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStep = () => {
    const props = {
      onNext: handleNext,
      onPrev: handlePrev,
      formData,
      updateFormData,
    };

    console.log(`Rendering step ${currentStep} with props:`, props);

    switch (currentStep) {
      case 1:
        return <Step1Welcome {...props} />;
      case 2:
        return <Step2Terms {...props} />;
      case 3:
        return <Step3Identity {...props} />;
      case 4:
        return <Step4AccountType {...props} />;
      case 5:
        return <Step5Password {...props} />;
      case 6:
        return <Step6Complete onClose={onClose} formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <HeaderTitle>{getStepTitle()}</HeaderTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ProgressBar progress={currentStep / TOTAL_STEPS} />
        
        <ModalContent>
          {renderStep()}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default CreateAccountModal;