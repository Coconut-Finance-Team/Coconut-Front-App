import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const SearchContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ResultItem = styled.div`
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ResultTitle = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

const ResultContent = styled.p`
  margin: 0;
  color: #666;
`;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/stock/search`,
          {
            params: { keyword: query },
          }
        );
        setResults(response.data || []);
      } catch (error) {
        console.error('검색 중 오류 발생:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  // 종목 클릭 시 상세 페이지로 이동하는 핸들러
  const handleStockClick = (stockCode) => {
    navigate(`/stock/${stockCode}`);
  };

  if (loading) {
    return <SearchContainer>검색 중...</SearchContainer>;
  }

  return (
    <SearchContainer>
      <h2>"{query}" 검색 결과</h2>
      <SearchResults>
        {results.map((result) => (
          <ResultItem 
            key={result.stockCode}
            onClick={() => handleStockClick(result.stockCode)}
          >
            <ResultTitle>{result.stockName}</ResultTitle>
            <ResultContent>종목코드: {result.stockCode}</ResultContent>
          </ResultItem>
        ))}
        {results.length === 0 && <div>검색 결과가 없습니다.</div>}
      </SearchResults>
    </SearchContainer>
  );
};

export default SearchPage;