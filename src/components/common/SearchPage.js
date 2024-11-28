import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios'; // Axios 추가

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
  const query = searchParams.get('q'); // 검색 키워드 가져오기
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/stock/search`,
          {
            params: { keyword: query }, // 쿼리 파라미터 추가
          }
        );
        // 응답 데이터 설정
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

  if (loading) {
    return <SearchContainer>검색 중...</SearchContainer>;
  }

  return (
    <SearchContainer>
      <h2>"{query}" 검색 결과</h2>
      <SearchResults>
        {results.map((result) => (
          <ResultItem key={result.stockCode}>
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
