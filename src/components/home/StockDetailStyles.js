import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  gap: 24px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 16px;
  font-family: 'Noto Sans KR', sans-serif;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 8px;
    gap: 12px;
  }
`;

export const StockInfoContainer = styled.div`
  flex: 3;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
`;

export const StockInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const StockLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
`;

export const StockTitleArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const StockTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #222222;
  margin: 0;
`;

export const StockCode = styled.span`
  font-size: 15px;
  color: #888888;
`;

export const PriceArea = styled.div`
  margin-top: -4px;
`;

export const CurrentPrice = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.change > 0 ? '#ff4747' : props.change < 0 ? '#4788ff' : '#222222'};
  text-align: right;
`;

export const PriceChange = styled.div`
  font-size: 15px;
  color: ${props => props.value > 0 ? '#ff4747' : props.value < 0 ? '#4788ff' : '#222222'};
  text-align: right;
  margin-top: 4px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 2px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
`;

export const TabButton = styled.button`
  padding: 12px 24px;
  border: none;
  background: none;
  font-size: 15px;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? '#222222' : '#888888'};
  border-bottom: 2px solid ${props => props.active ? '#222222' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #222222;
  }
`;

export const TimeframeButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

export const TimeButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.active ? 'transparent' : '#e0e0e0'};
  background: ${props => props.active ? '#2b2b2b' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#666666'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? '#2b2b2b' : '#f8f8f8'};
  }
`;

export const ChartContainer = styled.div`
  width: 100%;
  height: 450px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    height: 350px;
  }
`;

export const OrderBoxContainer = styled.div`
  flex: 1;
  min-width: 320px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const OrderTypeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

export const OrderTypeButton = styled.button`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  background: ${props => props.active ? (props.buy ? '#ff4747' : '#4788ff') : '#f8f8f8'};
  color: ${props => props.active ? '#ffffff' : '#666666'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 
      (props.buy ? '#ff3b3b' : '#3b7bff') : 
      '#f0f0f0'};
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InputLabel = styled.div`
  font-size: 14px;
  color: #666666;
`;

export const PriceInput = styled.div`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  background: #f8f8f8;
  border-radius: 8px;
  padding: 0 16px;
  box-sizing: border-box;

  input {
    flex: 1;
    border: none;
    background: none;
    font-size: 15px;
    font-weight: 500;
    text-align: right;
    color: #222222;
    
    &:focus {
      outline: none;
    }
  }

  span {
    margin-left: 8px;
    color: #666666;
  }
`;

export const QuantityButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

export const QuantityButton = styled.button`
  flex: 1;
  height: 36px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: #ffffff;
  color: #666666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f8f8;
  }
`;

export const OrderSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    
    span:first-child {
      color: #666666;
    }
    
    span:last-child {
      color: #222222;
      font-weight: 500;
    }
  }
`;

export const OrderButton = styled.button`
  width: 100%;
  height: 52px;
  border: none;
  border-radius: 8px;
  background: ${props => props.disabled ? '#e0e0e0' : (props.buy ? '#ff4747' : '#4788ff')};
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.disabled ? '#e0e0e0' : (props.buy ? '#ff3b3b' : '#3b7bff')};
  }
`;