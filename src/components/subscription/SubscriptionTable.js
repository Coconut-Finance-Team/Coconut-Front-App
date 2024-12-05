import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API 요청/응답 로깅
api.interceptors.request.use(request => {
  console.log('API Request:', request);
  return request;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response);
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);


function SubscriptionTable() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('companyName'); // 기업명 기본값

  useEffect(() => {
    fetchSubscriptions();
  }, [currentPage]); // 페이지 변경 시 데이터 다시 로드

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${API_BASE_URL}/ipo/active`);
      console.log('Fetched subscriptions:', response.data);

      // API 응답 데이터 변환
      const formattedData = response.data.map(item => ({
        id: item.id,
        category: item.category || '코스닥시장',
        companyName: item.companyName,
        underwriter: item.leadUnderwriter,  // 수정된 부분
        applicationPeriod: `${new Date(item.subscriptionStartDate).toLocaleDateString()} - ${new Date(item.subscriptionEndDate).toLocaleDateString()}`,
        refundDate: new Date(item.refundDate).toLocaleDateString(),
        maxLimit: item.maxSubscriptionLimit ? `${item.maxSubscriptionLimit.toLocaleString()}주` : '-',  // 수정된 부분
        subscriptionPrice: item.finalOfferPrice ? `${item.finalOfferPrice.toLocaleString()}원` : '-'  // 수정된 부분
      }));

      setSubscriptions(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError('청약 정보를 불러오는데 실패했습니다.');
      
      // 에러 시 테스트용 데이터 사용
      if (process.env.NODE_ENV === 'development') {
        setSubscriptions([
          {
            id: 1,
            category: '코스닥시장',
            companyName: '(주)테스트기업',
            underwriter: '한국투자증권',
            applicationPeriod: '2024.01.07 - 2024.01.08',
            refundDate: '2024.01.12',
            maxLimit: '42,000주',
            subscriptionPrice: '5,000원',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (subscription) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      navigate('/login', {
        state: { 
          redirectUrl: '/subscription/apply',
          companyData: subscription 
        }
      });
    } else {
      navigate('/subscription/apply', { 
        state: { 
          company: {
            ...subscription,
            subscriptionPrice: subscription.subscriptionPrice,
            competitionRate: '7.89:1',
            publicOfferingVolume: '540,000주',
            equalDistributionVolume: '270,000주',
            subscriptionCount: '38,271건',
          }
        } 
      });
    }
  };

  // 검색 필터링
  const filteredSubscriptions = subscriptions.filter(item => {
    if (!searchTerm) return true;
    
    const searchValue = searchTerm.toLowerCase();
    if (searchType === 'companyName') {
      return item.companyName.toLowerCase().includes(searchValue);
    } else {
      return item.underwriter.toLowerCase().includes(searchValue);
    }
  });

  return (
    <Container>
      <FilterContainer>
        <SearchWrapper>
          <Select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="companyName">기업명</option>
            <option value="underwriter">대표주관회사</option>
          </Select>
          <SearchInput 
            placeholder="검색어를 입력하세요..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchWrapper>
      </FilterContainer>

      {loading ? (
        <LoadingMessage>데이터를 불러오는 중입니다...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : (
        <>
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
                {filteredSubscriptions.map((item) => (
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
        </>
      )}
    </Container>
  );
}

// 추가된 스타일 컴포넌트
const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #ff3b30;
  background-color: #fff2f0;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 14px;
`;

export default SubscriptionTable;