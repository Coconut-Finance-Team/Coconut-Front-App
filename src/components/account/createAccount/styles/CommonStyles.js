import styled from 'styled-components';

// 모달 관련 공통 스타일
export const ModalOverlay = styled.div`
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

export const ModalContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 448px;
  height: 90vh;
  max-height: 720px;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  position: relative;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f2f2f2;
  flex-shrink: 0;
`;

export const HeaderTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  
  &::before {
    content: '×';
    font-size: 24px;
    line-height: 1;
  }
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 2px;
  background: #f2f2f2;
  flex-shrink: 0;

  &::after {
    content: '';
    display: block;
    width: ${props => (props.progress * 100)}%;
    height: 100%;
    background: #4174f6;
    transition: width 0.3s ease;
  }
`;

export const ModalContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// 폼 요소 관련 공통 스타일
export const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

export const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: center;
`;

export const Description = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
  line-height: 1.5;
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid ${props => props.error ? '#ff4747' : '#e5e8eb'};
  border-radius: 8px;
  font-size: 16px;
  background: white;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#ff4747' : '#4174f6'};
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 52px;
  padding: 0 16px;
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23666666' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;

  &:focus {
    outline: none;
    border-color: #4174f6;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff4747;
  font-size: 14px;
  margin-top: 8px;
`;

export const HelperText = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

// 버튼 관련 공통 스타일
export const ButtonContainer = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f2f2f2;
  background: white;
  flex-shrink: 0;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const Button = styled.button`
  flex: 1;
  height: 52px;
  padding: 0 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.primary ? `
    background: #4174f6;
    color: white;
    
    &:disabled {
      background: #e5e8eb;
      color: #adb5bd;
      cursor: not-allowed;
    }
    
    &:hover:not(:disabled) {
      background: #3461d9;
    }
  ` : `
    background: #f8f9fa;
    color: #333;
    
    &:hover {
      background: #e9ecef;
    }
  `}
`;

// 체크박스 관련 공통 스타일
export const CheckboxContainer = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 0;
`;

export const CheckboxInput = styled.input.attrs({ type: 'checkbox' })`
  width: 20px;
  height: 20px;
  margin: 0;
  cursor: pointer;
`;

export const CheckboxText = styled.span`
  font-size: 15px;
  color: #333;
`;

// 모달 섹션 관련 공통 스타일
export const Section = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

// 카드 스타일 컴포넌트
export const Card = styled.div`
  background: #fff;
  border: 1px solid #e5e8eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const RowLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

export const RowValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;