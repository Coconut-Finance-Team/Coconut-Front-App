import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

// 모달 기본 스타일
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

// 타이틀 및 카드 스타일
const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 32px;
  text-align: center;
  font-family: 'Noto Sans KR', sans-serif;
`;

const SubTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 24px 0 16px 0;
  font-family: 'Noto Sans KR', sans-serif;
`;

const InfoCard = styled.div`
  background: #fff;
  border: 1px solid #f2f2f2;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

// 정보 행 스타일
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f2;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Value = styled.span`
  color: #333;
  font-size: 14px;
  font-weight: 500;
  text-align: right;
  font-family: 'Noto Sans KR', sans-serif;
`;

// 라디오 버튼 스타일 개선
const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: #f8f9fa;
  border-radius: 12px;
  margin: 20px 0;
`;

const RadioQuestion = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: #333;
  font-family: 'Noto Sans KR', sans-serif;
`;

const RadioLabelContainer = styled.div`
  display: flex;
  gap: 16px;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  font-family: 'Noto Sans KR', sans-serif;

  input[type="radio"] {
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
  }
`;

// 체크박스 스타일
const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f2;

  &:last-child {
    border-bottom: none;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  flex: 1;
  font-family: 'Noto Sans KR', sans-serif;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: 2px solid #ddd;
  border-radius: 4px;
  
  &:checked {
    background-color: #4174f6;
    border-color: #4174f6;
  }
`;

const DownloadButton = styled.button`
  padding: 8px 16px;
  background: #f8f9fa;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
  font-family: 'Noto Sans KR', sans-serif;

  &:hover {
    background: #f0f0f0;
  }
`;

// 안내문구 스타일
const Notice = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  font-family: 'Noto Sans KR', sans-serif;
  text-align: center;
`;

// 버튼 컨테이너 및 버튼 스타일
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
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  
  ${props => props.primary ? `
    background: #4174f6;
    color: white;
    &:hover {
      background: #3461d9;
    }
  ` : `
    background: #f8f9fa;
    color: #333;
    &:hover {
      background: #f0f0f0;
    }
  `}
`;

function SubscriptionApply() {
  const navigate = useNavigate();
  const location = useLocation();
  const { company } = location.state || {};
  const [showForm, setShowForm] = useState(false);
  const [hasReadDescription, setHasReadDescription] = useState(null);
  const [agreements, setAgreements] = useState({
    investmentDescription: false,
    download1: false,
    download2: false,
    complete: false
  });
  const [quantity, setQuantity] = useState('');

  if (!company) {
    return <div>잘못된 접근입니다.</div>;
  }

  const handleRadioChange = (value) => {
    setHasReadDescription(value);
    if (value === 'no') {
      alert('"아니오" 선택 시, 청약신청에 제한이 있습니다.');
      setAgreements({
        investmentDescription: false,
        download1: false,
        complete: false
      });
    }
  };

  const handleAgreementChange = (key) => {
    setAgreements(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const validateFirst = () => {
    if (hasReadDescription === null) {
      alert('투자설명서 확인 여부를 선택해주세요.');
      return false;
    }
  
    if (hasReadDescription === 'no') {
      alert('투자설명서 확인이 필요합니다.');
      return false;
    }
    
    const requiredAgreements = {
      investmentDescription: agreements.investmentDescription,
      download1: agreements.download1,
      complete: agreements.complete
    };
    
    if (!Object.values(requiredAgreements).every(v => v)) {
      alert('모든 항목에 동의해주세요.');
      return false;
    }
    
    return true;
  };

  const validateQuantity = () => {
    const quantityNum = parseInt(quantity);
    if (!quantity || quantityNum <= 0) {
      alert('청약 수량을 입력해주세요.');
      return false;
    }
    if (quantityNum > 100) {
      alert('청약 가능 수량을 초과할 수 없습니다.');
      return false;
    }
    return true;
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || parseInt(value) >= 0) {
      setQuantity(value);
    }
  };

  const handleNext = () => {
    if (!showForm) {
      if (validateFirst()) {
        setShowForm(true);
      }
    } else {
      if (validateQuantity()) {
        navigate('/subscription/apply/confirm', {
          state: {
            company,
            applicationData: {
              quantity: parseInt(quantity),
              amount: parseInt(quantity) * 340000,
              fee: 2000,
              account: '46309613-01'
            }
          }
        });
      }
    }
  };

  return (
    <ModalOverlay onClick={() => navigate(-1)}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalContent>
          {!showForm ? (
            <>
              <Title>공모주 신청</Title>
              <InfoCard>
                <Row>
                  <Label>청약종목명</Label>
                  <Value>{company.companyName || '(주)회사1'}</Value>
                </Row>
                <Row>
                  <Label>청약기간</Label>
                  <Value>2024.01.07 - 2024.01.08</Value>
                </Row>
                <Row>
                  <Label>일반공모물량</Label>
                  <Value>540,000주</Value>
                </Row>
                <Row>
                  <Label>균등배정물량</Label>
                  <Value>270,000주</Value>
                </Row>
                <Row>
                  <Label>경쟁률</Label>
                  <Value>7.89:1</Value>
                </Row>
                <Row>
                  <Label>확정발행가</Label>
                  <Value>340,000원</Value>
                </Row>
              </InfoCard>

              <InfoCard>
                <SubTitle>설명서 교부 및 동의</SubTitle>
                <RadioGroup>
                  <RadioQuestion>투자설명서를 확인하셨습니까?</RadioQuestion>
                  <RadioLabelContainer>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="description"
                        onChange={() => handleRadioChange('yes')}
                      />
                      예
                    </RadioLabel>
                    <RadioLabel>
                      <input
                        type="radio"
                        name="description"
                        onChange={() => handleRadioChange('no')}
                      />
                      아니오
                    </RadioLabel>
                  </RadioLabelContainer>
                </RadioGroup>

                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      checked={agreements.investmentDescription}
                      onChange={() => handleAgreementChange('investmentDescription')}
                    />
                    전자문서에 의하여 투자설명서를 교부 받는 것에 동의합니다.
                  </CheckboxLabel>
                  <DownloadButton>투자설명서 다운로드</DownloadButton>
                </CheckboxGroup>

                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      checked={agreements.download1}
                      onChange={() => handleAgreementChange('download1')}
                    />
                    투자설명서를 내 PC에 다운로드 받겠습니다.
                  </CheckboxLabel>
                  <DownloadButton>투자설명서 다운로드</DownloadButton>
                </CheckboxGroup>

                <CheckboxGroup>
                  <CheckboxLabel>
                    <Checkbox
                      checked={agreements.complete}
                      onChange={() => handleAgreementChange('complete')}
                    />
                    전자문서에 의한 투자설명서 교부가 완료되었습니다.
                  </CheckboxLabel>
                </CheckboxGroup>

                <Notice>
                  ※ 투자설명서 교부 완료 후 청약이 가능합니다.
                </Notice>
              </InfoCard>
            </>
          ) : (
            <>
              <Title>청약 수량 입력</Title>
              <InfoCard>
                <Row>
                  <Label>계좌선택</Label>
                  <Value>46309613-01 위탁계좌</Value>
                </Row>
                <Row>
                  <Label>주문가능금액</Label>
                  <Value>1,000,000원</Value>
                </Row>
                <Row>
                  <Label>청약가능수량</Label>
                  <Value>100주</Value>
                </Row>
                <Row>
                  <Label>확정발행가</Label>
                  <Value>340,000원</Value>
                </Row>
              </InfoCard>

              <InfoCard>
                <SubTitle>청약 수량</SubTitle>
                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={handleQuantityChange}
                  placeholder="청약하실 수량을 입력해주세요"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #e5e8eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    marginTop: '8px',
                    fontFamily: 'Noto Sans KR',
                  }}
                />
                <Notice>
                  ※ 청약 가능 수량 내에서만 신청이 가능합니다.
                  <br />
                  ※ 청약증거금은 청약금액의 50%입니다.
                </Notice>
              </InfoCard>
            </>
          )}

          <ButtonContainer>
            <Button onClick={() => navigate(-1)}>이전</Button>
            <Button primary onClick={handleNext}>다음</Button>
          </ButtonContainer>
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
}

export default SubscriptionApply;
