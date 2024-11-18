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
  min-height: 0; /* 중요: 그리드 아이템이 부모 높이를 초과하지 않도록 함 */
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 0; /* 차트가 컨테이너 안에서 적절히 조절되도록 함 */
`;

const indices = [
  {
    name: "코스피",
    value: 2571.86,
    change: -5.02,
    changePercent: -0.10,
  },
  {
    name: "코스닥",
    value: 746.31,
    change: -5.50,
    changePercent: -0.70,
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
                <IndexChart {...index} />
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