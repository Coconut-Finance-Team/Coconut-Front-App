import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #E5E8EB;
  font-size: 14px;
  color: #333;
  background: #ffffff;
  cursor: pointer;
  outline: none;
  min-width: 150px;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #E5E8EB;
  font-size: 14px;
  width: 100%;
  max-width: 400px; // 최대 크기를 제한
  outline: none;
  
  &::placeholder {
    color: #999;
  }

  &:focus {
    border-color: #007AFF;
    box-shadow: 0 0 5px rgba(0, 122, 255, 0.2);
  }
`;

const TableWrapper = styled.div`
  border-radius: 12px;
  border: 1px solid #E5E8EB;
  overflow: hidden;
  margin-bottom: 24px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;

  th, td {
    padding: 16px;
    text-align: center;
    border-bottom: 1px solid #E5E8EB;
    font-size: 14px;
    font-family: 'Noto Sans KR', sans-serif;
  }

  th {
    background: #F8F9FA;
    color: #333;
    font-weight: 600;
  }

  td {
    color: #666;
  }
`;

const ApplyButton = styled.button`
  padding: 8px 16px;
  background: #007AFF;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0056b3;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #E5E8EB;
  border-radius: 6px;
  background: ${props => props.active ? '#007AFF' : '#ffffff'};
  color: ${props => props.active ? '#ffffff' : '#666'};
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#F8F9FA'};
  }
`;

function SubscriptionTable() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const sampleData = [
    {
      id: 1,
      category: '코스닥시장',
      companyName: '(주)회사1',
      underwriter: '한국투자증권',
      applicationPeriod: '2024.01.07 - 2024.01.08',
      refundDate: '2024.01.12',
      maxLimit: '42,000주',
      issuingCompany: '발행회사',
      subscriptionPrice: '5,000원',
    },
    // ... 더 많은 샘플 데이터
  ];

  const handleApply = (company) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      // 로그인이 되어 있지 않으면 로그인 페이지로 리디렉션
      navigate('/Login');
    } else {
      // 로그인이 되어 있으면 신청 페이지로 이동
      navigate(`/subscription/apply/${company.id}`, { 
        state: { 
          company: {
            ...company,
            subscriptionPrice: '340,000원',
            competitionRate: '7.89:1',
            publicOfferingVolume: '540,000주',
            equalDistributionVolume: '270,000주',
            subscriptionCount: '38,271건',
          }
        } 
      });
    }
  };

  return (
    <Container>
      <FilterContainer>
        <SearchWrapper>
          <Select>
            <option>기업명</option>
            <option>대표주관회사</option>
          </Select>
          <SearchInput 
            placeholder="검색어를 입력하세요..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </FilterContainer>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>분류</th>
              <th>기업명</th>
              <th>대표주관회사</th>
              <th>청약기간</th>
              <th>환불일</th>
              <th>최고청약한도</th>
              <th>확정발행가</th>
              <th>신청</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.companyName}</td>
                <td>{item.underwriter}</td>
                <td>{item.applicationPeriod}</td>
                <td>{item.refundDate}</td>
                <td>{item.maxLimit}</td>
                <td>{item.subscriptionPrice}</td>
                <td>
                  <ApplyButton onClick={() => handleApply(item)}>
                    신청하기
                  </ApplyButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableWrapper>

      <Pagination>
        <PageButton>{'<'}</PageButton>
        {[1, 2, 3, 4, 5].map((page) => (
          <PageButton 
            key={page} 
            active={currentPage === page}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </PageButton>
        ))}
        <PageButton>{'>'}</PageButton>
      </Pagination>
    </Container>
  );
}

export default SubscriptionTable;
