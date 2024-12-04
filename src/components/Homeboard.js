import React from 'react';
import styled from 'styled-components';
import IndexChart from './home/IndexChart';
import RealTimeChart from './home/RealTimeChart';

const Container = styled.div`
  padding: 40px;
  max-width: 1300px;
  margin: 0 auto;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  height: 100%;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const MarketCards = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  min-height: 0;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0;
`;

const indices = [
  {
    name: "코스피",
    isKospi: true,
  },
  {
    name: "코스닥",
    isKospi: false,
  },
];

function Homeboard() {
  return (
    <Container>
      <Wrapper>
        <Section>
          <Title>시장 동향</Title>
          <MarketCards>
            {indices.map((index, i) => (
              <ChartContainer key={i}>
                <IndexChart 
                  name={index.name} 
                  isKospi={index.isKospi}
                />
              </ChartContainer>
            ))}
          </MarketCards>
        </Section>

        <Section>
          <ChartContainer>
            <RealTimeChart />
          </ChartContainer>
        </Section>
      </Wrapper>
    </Container>
  );
}

export default Homeboard;