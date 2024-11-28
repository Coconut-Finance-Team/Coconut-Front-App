import styled from 'styled-components';

export const ChartWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const TimeframeContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
`;

export const TimeButton = styled.button`
  padding: 6px 12px;
  border: 1px solid ${props => props.active ? '#1890ff' : '#d9d9d9'};
  background: ${props => props.active ? '#1890ff' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#666666'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    border-color: #1890ff;
    color: ${props => props.active ? '#ffffff' : '#1890ff'};
  }
`;

export const CanvasContainer = styled.div`
  width: 100%;
  height: 400px;
  position: relative;
`;