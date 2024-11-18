import React, { useState } from 'react';
import {
  FormContainer,
  Title,
  Description,
  FormGroup,
  Label,
  Input,
  ErrorMessage,
  ButtonContainer,
  ButtonRow,
  Button,
  Card,
} from '../styles/CommonStyles';

function Step3Identity({ onNext, onPrev, formData, updateFormData }) {
  const [identity, setIdentity] = useState({
    username: formData.identityInfo?.username || '',
    socialSecurityNumber: formData.identityInfo?.socialSecurityNumber || '',
    phone: formData.identityInfo?.phone || ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    let formattedValue = value;

    if (name === 'socialSecurityNumber') {
      formattedValue = value
        .replace(/[^\d]/g, '')
        .slice(0, 13)
        .replace(/(\d{6})(\d{0,7})/, (_, a, b) => b ? `${a}-${b}` : a);
    }
    
    if (name === 'phone') {
      formattedValue = value
        .replace(/[^\d]/g, '')
        .slice(0, 11)
        .replace(/(\d{3})(\d{0,4})(\d{0,4})/, (_, a, b, c) => {
          if (b && c) return `${a}-${b}-${c}`;
          if (b) return `${a}-${b}`;
          return a;
        });
    }

    setIdentity(prev => ({
      ...prev,
      [name]: formattedValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!identity.username) {
      newErrors.username = '이름을 입력해주세요';
    }

    const ssnRegex = /^\d{6}-[1-4]\d{6}$/;
    if (!ssnRegex.test(identity.socialSecurityNumber)) {
      newErrors.socialSecurityNumber = '올바른 주민등록번호 형식이 아닙니다';
    }

    const phoneRegex = /^\d{3}-\d{4}-\d{4}$/;
    if (!phoneRegex.test(identity.phone)) {
      newErrors.phone = '올바른 휴대폰 번호 형식이 아닙니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      updateFormData({ identityInfo: identity });
      onNext();
    }
  };

  return (
    <FormContainer>
      <Title>본인확인</Title>
      <Description>
        실명확인을 위해 정보를 입력해주세요<br />
        입력하신 정보는 실명확인용으로만 사용됩니다
      </Description>

      <Card>
        <FormGroup>
          <Label>이름</Label>
          <Input
            type="text"
            value={identity.username}
            onChange={(e) => handleChange('username', e.target.value)}
            placeholder="실명을 입력해주세요"
            error={errors.username}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </FormGroup>

        <FormGroup>
          <Label>주민등록번호</Label>
          <Input
            type="text"
            value={identity.socialSecurityNumber}
            onChange={(e) => handleChange('socialSecurityNumber', e.target.value)}
            placeholder="000000-0000000"
            error={errors.socialSecurityNumber}
          />
          {errors.socialSecurityNumber && (
            <ErrorMessage>{errors.socialSecurityNumber}</ErrorMessage>
          )}
        </FormGroup>

        <FormGroup style={{ marginBottom: 0 }}>
          <Label>휴대폰 번호</Label>
          <Input
            type="tel"
            value={identity.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="010-0000-0000"
            error={errors.phone}
          />
          {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
        </FormGroup>
      </Card>

      <ButtonContainer>
        <ButtonRow>
          <Button onClick={onPrev}>이전</Button>
          <Button 
            primary
            onClick={handleNext}
            disabled={!identity.username || !identity.socialSecurityNumber || !identity.phone}
          >
            다음
          </Button>
        </ButtonRow>
      </ButtonContainer>
    </FormContainer>
  );
}

export default Step3Identity;