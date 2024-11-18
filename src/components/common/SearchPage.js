// SearchPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';

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
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // API 요청: '/api/search'로 검색어 쿼리 포함해서 요청 보내기
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 서버에서 results 배열을 반환한다고 가정하고, 결과 설정
        setResults(data.results || []);
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
          <ResultItem key={result.id}>
            <ResultTitle>{result.title}</ResultTitle>
            <ResultContent>{result.content}</ResultContent>
          </ResultItem>
        ))}
        {results.length === 0 && (
          <div>검색 결과가 없습니다.</div>
        )}
      </SearchResults>
    </SearchContainer>
  );
};

export default SearchPage;
