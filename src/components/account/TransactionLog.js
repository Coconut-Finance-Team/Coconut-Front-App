import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Noto Sans KR', sans-serif;
  }
`;

const Container = styled.div`
  padding: 40px 40px 0 5px;
  background: #ffffff;
`;

const Title = styled.div`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 32px;
`;

const AvailableAmount = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E8EB;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

const FilterButton = styled.button`
  height: 34px;
  padding: 0 16px;
  border-radius: 17px;
  font-size: 14px;
  background: ${props => props.active ? '#F8F9FA' : '#ffffff'};
  border: 1px solid ${props => props.active ? '#E5E8EB' : '#E5E8EB'};
  color: ${props => props.active ? '#333' : '#666'};
  cursor: pointer;

  &:hover {
    background: #F8F9FA;
  }
`;

const TransactionList = styled.div`
  display: flex;
  flex-direction: column;
`;

const TransactionItem = styled.div`
  padding: 20px 0;
  border-bottom: 1px solid #E5E8EB;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const TransactionInfo = styled.div``;

const TransactionDate = styled.div`
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
`;

const TransactionTitle = styled.div`
  font-size: 15px;
  color: #333;
  margin-bottom: 4px;
`;

const TransactionDetail = styled.div`
  font-size: 13px;
  color: #666;
`;

const TransactionAmount = styled.div`
  text-align: right;
`;

const Amount = styled.div`
  font-size: 15px;
  color: ${props => props.isPositive ? '#4792ff' : '#666'};
  margin-bottom: 4px;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  width: 90%;
  max-width: 400px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  color: #666;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: 500;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
`;

const TransactionLog = () => {
  const [transactions, setTransactions] = useState([]);
  const [returnRate, setReturnRate] = useState(0);
  const [activeFilter, setActiveFilter] = useState('전체');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailData, setDetailData] = useState(null);

  const fetchTransactions = async (type = '전체') => {
    try {
      let endpoint = '';
      switch(type) {
        case '거래':
          endpoint = '/api/transactions/trade';
          break;
        case '입출금':
          endpoint = '/api/transactions/deposit';
          break;
        default:
          endpoint = '/api/transactions';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uuid: 'ao3r2kngd-39d-dsjen-398djfkjf'
        })
      });

      if (!response.ok) throw new Error('API 요청 실패');

      const data = await response.json();
      setReturnRate(data.return_rate);
      setTransactions(data.transaction_history || []);
    } catch (error) {
      console.error('거래내역 조회 중 오류 발생:', error);
    }
  };

  const fetchTransactionDetail = async (transaction) => {
    try {
      let endpoint = '';
      let body = {
        uuid: 'ao3r2kngd-39d-dsjen-398djfkjf'
      };

      if (transaction.type === '거래') {
        endpoint = '/api/transactions/trade/detail';
        body.trade_id = transaction.id;
      } else if (transaction.type === '입출금') {
        endpoint = '/api/transactions/deposit/detail';
        body.transaction_id = transaction.id;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('상세 정보 조회 실패');

      const data = await response.json();
      setDetailData(data);
    } catch (error) {
      console.error('상세 정보 조회 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchTransactions('전체');
  }, []);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    fetchTransactions(filter);
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    fetchTransactionDetail(transaction);
  };

  const formatDateTime = (timestamp) => {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderDetailContent = () => {
    if (!detailData) return null;

    if (selectedTransaction?.type === '거래') {
      return (
        <>
          <DetailRow>
            <DetailLabel>거래 종류</DetailLabel>
            <DetailValue>{detailData.type}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>종목명</DetailLabel>
            <DetailValue>{detailData.stock_name}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 가격</DetailLabel>
            <DetailValue>{detailData.total_price.toLocaleString()}원</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 수량</DetailLabel>
            <DetailValue>{detailData.quantity}주</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 시간</DetailLabel>
            <DetailValue>{formatDateTime(detailData.order_time)}</DetailValue>
          </DetailRow>
        </>
      );
    } else {
      return (
        <>
          <DetailRow>
            <DetailLabel>거래 종류</DetailLabel>
            <DetailValue>{detailData.type}</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>금액</DetailLabel>
            <DetailValue>{detailData.amount.toLocaleString()}원</DetailValue>
          </DetailRow>
          <DetailRow>
            <DetailLabel>거래 시간</DetailLabel>
            <DetailValue>{formatDateTime(detailData.time)}</DetailValue>
          </DetailRow>
        </>
      );
    }
  };

  return (
    <>
      <GlobalStyle />
      <Container>
        <Title>거래내역</Title>
        <AvailableAmount>수익률: {returnRate}%</AvailableAmount>

        <FilterContainer>
          <FilterButton 
            active={activeFilter === '전체'}
            onClick={() => handleFilterClick('전체')}
          >전체</FilterButton>
          <FilterButton 
            active={activeFilter === '거래'}
            onClick={() => handleFilterClick('거래')}
          >거래</FilterButton>
          <FilterButton 
            active={activeFilter === '환전'}
            onClick={() => handleFilterClick('환전')}
          >환전</FilterButton>
          <FilterButton 
            active={activeFilter === '입출금'}
            onClick={() => handleFilterClick('입출금')}
          >입출금</FilterButton>
        </FilterContainer>

        <TransactionList>
          {transactions.map((transaction, index) => (
            <TransactionItem 
              key={index}
              onClick={() => handleTransactionClick(transaction)}
            >
              <TransactionInfo>
                <TransactionDate>{transaction.date}</TransactionDate>
                <TransactionTitle>{transaction.name}</TransactionTitle>
                <TransactionDetail>{transaction.status}</TransactionDetail>
              </TransactionInfo>
              <TransactionAmount>
                <Amount isPositive={transaction.amount > 0}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount.toLocaleString()}원
                </Amount>
              </TransactionAmount>
            </TransactionItem>
          ))}
        </TransactionList>

        {selectedTransaction && (
          <>
            <Overlay onClick={() => setSelectedTransaction(null)} />
            <Modal>
              <CloseButton onClick={() => setSelectedTransaction(null)}>×</CloseButton>
              {renderDetailContent()}
            </Modal>
          </>
        )}
      </Container>
    </>
  );
};

export default TransactionLog;