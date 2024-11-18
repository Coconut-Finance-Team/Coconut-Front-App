import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px 24px 0;
`;

const Bar = styled.div`
  width: 100%;
  height: 4px;
  background: #f2f2f2;
  border-radius: 2px;
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background: #4174f6;
  width: ${props => (props.currentStep / props.totalSteps) * 100}%;
  transition: width 0.3s ease;
`;

function ProgressBar({ currentStep, totalSteps }) {
  return (
    <Container>
      <Bar>
        <Progress 
          currentStep={currentStep} 
          totalSteps={totalSteps} 
        />
      </Bar>
    </Container>
  );
}

export default ProgressBar;