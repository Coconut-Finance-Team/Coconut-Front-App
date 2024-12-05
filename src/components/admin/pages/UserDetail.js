import React, { useState, useEffect } from 'react';

const styles = `
  .user-detail-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
    margin-bottom: 16px;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    background: white;
    padding: 8px 16px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .back-button:hover {
    color: #3b82f6;
    border-color: #3b82f6;
    background-color: #f8fafc;
  }

  .back-button svg {
    width: 16px;
    height: 16px;
  }

  .page-title {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 24px;
    color: #1e293b;
  }

  .section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .info-item {
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
  }

  .info-label {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .info-value {
    font-size: 14px;
    color: #1e293b;
  }

  .status-badge {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background-color: #dcfce7;
    color: #15803d;
  }

  .status-badge.inactive {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .activity-list {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background-color: white;
  }

  .contract-item {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
  }

  .contract-item.header {
    font-weight: 500;
    color: #64748b;
    background-color: #f8fafc;
  }

  .delete-button {
    display: inline-block;
    padding: 6px 12px;
    color: #dc2626;
    background: none;
    border: 1px solid #dc2626;
    border-radius: 4px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .delete-button:hover {
    background-color: #fee2e2;
  }

  .delete-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
    text-align: center;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 500;
    margin-bottom: 16px;
    color: #1e293b;
  }

  .modal-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 16px;
    transition: background-color 0.2s;
  }

  .modal-button:hover {
    background-color: #2563eb;
  }

  .error-message {
    background-color: #fee2e2;
    color: #dc2626;
    padding: 12px;
    border-radius: 6px;
    margin-bottom: 16px;
    font-size: 14px;
  }

  .loading {
    text-align: center;
    padding: 24px;
    color: #64748b;
    font-size: 14px;
  }
`;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

const UserDetail = ({ user, onBack }) => {
  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [suspendLoading, setSuspendLoading] = useState(false);

  const fetchUserDetail = async () => {
    const token = localStorage.getItem('jwtToken');
    
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/read/user/${user.uuid}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('사용자 상세 정보를 불러오는데 실패했습니다.');
      }

      const data = await response.json();
      console.log('User Detail Response:', data);
      setUserDetail(data);
      setError(null);
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.uuid) {
      fetchUserDetail();
    }
  }, [user?.uuid]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatStatus = (status) => {
    switch (status?.toUpperCase()) {
      case 'SUSPENDED':
        return '비활성';
      case 'OPEN':
      case 'ACTIVE':
      default:
        return '활성';
    }
  };

  const handleTradeStop = async () => {
    const token = localStorage.getItem('jwtToken');
    setSuspendLoading(true);
  
    try {
      const response = await fetch(`${API_BASE_URL}/admin/suspend/user/${user.uuid}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || '거래정지 처리에 실패했습니다.';
        } catch (e) {
          errorMessage = '거래정지 처리에 실패했습니다.';
        }
        throw new Error(errorMessage);
      }
  
      await fetchUserDetail();
      setShowModal(true);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setSuspendLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">데이터를 불러오는 중...</div>;
  }

  if (!userDetail) {
    return <div className="error-message">사용자 정보를 찾을 수 없습니다.</div>;
  }

  // 계좌 및 상태 관련 데이터
  const accountInfo = userDetail.accountInfo || {};
  const userStatus = userDetail.status;
  const accountStatus = accountInfo.accountStatus;
  const isAccountSuspended = userStatus === 'SUSPENDED';
  const hasAccount = !!accountInfo.accountId;

  return (
    <>
      <style>{styles}</style>
      <div className="user-detail-container">
        {error && <div className="error-message">{error}</div>}
        
        <button className="back-button" onClick={onBack}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          목록으로
        </button>
        
        <h1 className="page-title">회원 상세 정보</h1>

        <div className="section">
          <h2 className="section-title">기본 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">이름</div>
              <div className="info-value">{userDetail.username}</div>
            </div>
            <div className="info-item">
              <div className="info-label">이메일</div>
              <div className="info-value">{userDetail.email}</div>
            </div>
            <div className="info-item">
              <div className="info-label">전화번호</div>
              <div className="info-value">{userDetail.phone}</div>
            </div>
            <div className="info-item">
              <div className="info-label">가입일</div>
              <div className="info-value">{formatDate(userDetail.createTime)}</div>
            </div>
            <div className="info-item">
              <div className="info-label">성별</div>
              <div className="info-value">{userDetail.gender === 'male' ? '남성' : '여성'}</div>
            </div>
            <div className="info-item">
              <div className="info-label">직장</div>
              <div className="info-value">{userDetail.job}</div>
            </div>
            <div className="info-item">
              <div className="info-label">투자 성향</div>
              <div className="info-value">{userDetail.investmentStyle}</div>
            </div>
            <div className="info-item">
              <div className="info-label">회원 상태</div>
              <div className="info-value">
                <span className={`status-badge ${isAccountSuspended ? 'inactive' : ''}`}>
                  {formatStatus(userStatus)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">계좌 정보</h2>
          <div className="activity-list">
            <div className="contract-item header">
              <div>계좌번호</div>
              <div>상태</div>
              <div>관리</div>
            </div>
            <div className="contract-item">
              <div>
                {hasAccount ? (
                  <>
                    {accountInfo.accountId}
                    {accountInfo.accountName && ` (${accountInfo.accountName})`}
                  </>
                ) : '계좌 정보 없음'}
              </div>
              <div>
                <span className={`status-badge ${isAccountSuspended ? 'inactive' : ''}`}>
                  {formatStatus(accountStatus)}
                </span>
              </div>
              <div>
                <button 
                  className="delete-button" 
                  onClick={handleTradeStop}
                  disabled={isAccountSuspended || suspendLoading || !hasAccount}
                >
                  {suspendLoading ? '처리중...' : 
                   isAccountSuspended ? '거래정지됨' : 
                   !hasAccount ? '계좌없음' : '거래정지'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                {userDetail.username}님의 계좌에 대한 거래정지를 완료하였습니다.
              </div>
              <button 
                className="modal-button"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetail;