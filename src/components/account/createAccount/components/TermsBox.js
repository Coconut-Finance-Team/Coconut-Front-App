import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  border: 1px solid #e5e8eb;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const Header = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Title = styled.span`
  font-size: 15px;
  color: #333;
`;

const Required = styled.span`
  font-size: 13px;
  color: #ff4747;
  margin-left: 4px;
`;

const ViewButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
`;

function TermsBox({ id, title, required, checked, onChange }) {
  return (
    <Container>
      <Header>
        <CheckboxLabel>
          <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
          />
          <Title>
            {title}
            {required && <Required>(필수)</Required>}
          </Title>
        </CheckboxLabel>
        <ViewButton>보기</ViewButton>
      </Header>
    </Container>
  );
}

export default TermsBox;