import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FormContainer,
  Title,
  Description,
  CheckboxContainer,
  CheckboxLabel,
  CheckboxInput,
  CheckboxText,
  ButtonContainer,
  ButtonRow,
  Button,
  Card,
} from '../styles/CommonStyles';
import styled from 'styled-components';

const AllAgreeBox = styled(CheckboxContainer)`
  margin-bottom: 24px;
  background: #f0f7ff;
`;

const TermsCard = styled(Card)`
  padding: 0;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TermHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

const ViewButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

function Step2Terms({ onNext, onPrev, formData, updateFormData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [allChecked, setAllChecked] = useState(false);
  const prevFormData = location.state || {};
  
  const terms = [
    { id: 'term1', title: '코코넛증권 종합약관', required: true },
    { id: 'term2', title: '전자금융거래 이용약관', required: true },
    { id: 'term3', title: '개인정보 수집 및 이용 동의', required: true },
    { id: 'term4', title: '마케팅 정보 수신 동의', required: false },
  ];

  const handleAllCheck = (e) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    updateFormData({
      termsAgreed: checked ? terms.map(term => term.id) : []
    });
  };

  const handleSingleCheck = (termId) => {
    const newTermsAgreed = formData.termsAgreed.includes(termId)
      ? formData.termsAgreed.filter(id => id !== termId)
      : [...(formData.termsAgreed || []), termId];
    
    console.log('Updating terms:', newTermsAgreed);
    
    updateFormData({
      termsAgreed: newTermsAgreed
    });
    setAllChecked(newTermsAgreed.length === terms.length);
  };

  const canProceed = terms
    .filter(term => term.required)
    .every(term => formData.termsAgreed.includes(term.id));

    const handleNext = () => {
      if (canProceed) {
        const newFormData = {
          ...prevFormData,
          termsAgreed: formData.termsAgreed
        };
        updateFormData(newFormData);
        onNext();
      }
    };

  return (
    <FormContainer>
      <Title>약관 동의</Title>
      <Description>서비스 이용을 위해 약관 동의가 필요합니다</Description>

      <AllAgreeBox>
        <CheckboxLabel>
          <CheckboxInput
            checked={allChecked}
            onChange={handleAllCheck}
          />
          <CheckboxText>모든 약관에 동의합니다</CheckboxText>
        </CheckboxLabel>
      </AllAgreeBox>

      {terms.map(term => (
        <TermsCard key={term.id}>
          <TermHeader>
            <CheckboxLabel>
              <CheckboxInput
                checked={formData.termsAgreed.includes(term.id)}
                onChange={() => handleSingleCheck(term.id)}
              />
              <CheckboxText>
                {term.title}
                {term.required && <span style={{ color: '#ff4747' }}> (필수)</span>}
              </CheckboxText>
            </CheckboxLabel>
            <ViewButton>보기</ViewButton>
          </TermHeader>
        </TermsCard>
      ))}

      <ButtonContainer>
        <ButtonRow>
          <Button onClick={onPrev}>이전</Button>
          <Button 
            primary 
            onClick={onNext}
            disabled={!canProceed}
          >
            다음
          </Button>
        </ButtonRow>
      </ButtonContainer>
    </FormContainer>
  );
}

export default Step2Terms;