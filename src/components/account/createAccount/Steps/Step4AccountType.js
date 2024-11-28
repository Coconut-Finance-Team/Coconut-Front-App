import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FormContainer,
  Title,
  Description,
  FormGroup,
  Label,
  Select,
  Input,
  ButtonContainer,
  ButtonRow,
  Button,
  Card,
  ErrorMessage,
} from '../styles/CommonStyles';

const purposes = [
  { value: '', label: '선택해주세요' },
  { value: 'investment', label: '투자' },
  { value: 'salary', label: '급여수령' },
  { value: 'savings', label: '저축' },
  { value: 'business', label: '사업자금' },
  { value: 'others', label: '기타' },
];

function Step4AccountType({ onNext, onPrev, formData, updateFormData }) {
  const location = useLocation();
  const navigate = useNavigate();
  const prevFormData = location.state || {};
  const [accountInfo, setAccountInfo] = useState({
    purpose: prevFormData.accountInfo?.purpose || '',
    alias: prevFormData.accountInfo?.alias || ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setAccountInfo(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!accountInfo.purpose) {
      newErrors.purpose = '계좌 사용 목적을 선택해주세요';
    }

    if (!accountInfo.alias) {
      newErrors.alias = '계좌 별칭을 입력해주세요';
    } else if (accountInfo.alias.length > 20) {
      newErrors.alias = '계좌 별칭은 20자를 초과할 수 없습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

// Step4AccountType.js에서 계좌 정보 처리
const handleNext = () => {
  if (validateForm()) {
    console.log('Updating account info:', accountInfo);
    updateFormData({
      accountInfo: accountInfo
    });
    onNext();
  }
};


  return (
    <FormContainer>
      <Title>계좌 정보 입력</Title>
      <Description>
        계좌 사용 목적과 구분을 위한<br />
        별칭을 입력해주세요
      </Description>

      <Card>
        <FormGroup>
          <Label>계좌 사용 목적</Label>
          <Select
            value={accountInfo.purpose}
            onChange={(e) => handleChange('purpose', e.target.value)}
            error={errors.purpose}
          >
            {purposes.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          {errors.purpose && <ErrorMessage>{errors.purpose}</ErrorMessage>}
        </FormGroup>

        <FormGroup style={{ marginBottom: 0 }}>
          <Label>계좌 별칭</Label>
          <Input
            type="text"
            value={accountInfo.alias}
            onChange={(e) => handleChange('alias', e.target.value)}
            placeholder="계좌 별칭을 입력해주세요 (최대 20자)"
            maxLength={20}
            error={errors.alias}
          />
          {errors.alias && <ErrorMessage>{errors.alias}</ErrorMessage>}
        </FormGroup>
      </Card>

      <ButtonContainer>
        <ButtonRow>
          <Button onClick={onPrev}>이전</Button>
          <Button 
            primary
            onClick={handleNext}
            disabled={!accountInfo.purpose || !accountInfo.alias}
          >
            다음
          </Button>
        </ButtonRow>
      </ButtonContainer>
    </FormContainer>
  );
}

export default Step4AccountType;