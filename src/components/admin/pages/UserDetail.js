import React, { useState } from 'react';

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

  .activity-item {
    display: grid;
    grid-template-columns: 150px 1fr 200px;
    padding: 12px 16px;
    border-bottom: 1px solid #e2e8f0;
    transition: background-color 0.2s;
  }

  .activity-item:hover {
    background-color: #f8fafc;
  }

  .activity-item:last-child {
    border-bottom: none;
  }

  .activity-time {
    color: #64748b;
    font-size: 14px;
  }

  .activity-description {
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
  }

  .activity-detail {
    color: #64748b;
    font-size: 14px;
    text-align: right;
  }

  .contract-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
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
`;

const UserDetail = ({ onBack }) => {
  const [showModal, setShowModal] = useState(false);

  const userDetail = {
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    registerDate: '2024.03.15',
    status: '활성',
    lastAccess: '2024.03.28 14:23',
    contract: {
      number: '123-456-789',
      date: '2024.03.15',
      amount: '1,234,567원',
      status: '활성'
    },
    activities: [
      { time: '2024.03.28 14:23', description: '로그인', detail: 'IP: 123.456.789.0' },
      { time: '2024.03.28 11:45', description: '주문', detail: '삼성전자 10주 매수' },
      { time: '2024.03.27 16:30', description: '로그아웃', detail: '-' }
    ]
  };

  const handleTradeStop = () => {
    setShowModal(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="user-detail-container">
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
              <div className="info-value">{userDetail.name}</div>
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
              <div className="info-value">{userDetail.registerDate}</div>
            </div>
            <div className="info-item">
              <div className="info-label">마지막 로그인</div>
              <div className="info-value">{userDetail.lastAccess}</div>
            </div>
            <div className="info-item">
              <div className="info-label">회원 상태</div>
              <div className="info-value">
                <span className="status-badge">{userDetail.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">계약 정보</h2>
          <div className="activity-list">
            <div className="contract-item header">
              <div>계약번호</div>
              <div>계약일</div>
              <div>상태</div>
              <div>관리</div>
            </div>
            <div className="contract-item">
              <div>{userDetail.contract.number}</div>
              <div>{userDetail.contract.date}</div>
              <div>
                <span className="status-badge">{userDetail.contract.status}</span>
              </div>
              <div>
                <button className="delete-button" onClick={handleTradeStop}>
                  거래정지
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="section-title">활동 내역</h2>
          <div className="activity-list">
            {userDetail.activities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-time">{activity.time}</div>
                <div className="activity-description">{activity.description}</div>
                <div className="activity-detail">{activity.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-title">
                {userDetail.name}님의 계좌에 대한 거래정지를 완료하였습니다.
              </div>
              <button 
                className="modal-button"
                onClick={() => setShowModal(false)}
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