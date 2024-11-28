import React, { useState } from 'react';  // useState import 추가
import UserDetail from './UserDetail';

const styles = `
  .user-management-container {
    padding: 24px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .header-section {
    margin-bottom: 24px;
  }

  .header-section h1 {
    font-size: 20px;
    font-weight: 500;
    margin-bottom: 16px;
  }

  .search-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .search-filters input,
  .search-filters select {
    padding: 8px 12px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 14px;
  }

  .search-filters input {
    flex-grow: 1;
  }

  .search-filters input:focus,
  .search-filters select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  .table-container {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 16px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
    font-size: 14px;
  }

  th {
    font-weight: 500;
    color: #64748b;
  }

  th:nth-child(3) {
    color: #3b82f6;
  }

  th:nth-child(4) {
    color: #f97316;
  }

  tr:hover {
    background-color: #f8fafc;
  }

  .status-badge {
    background-color: #dcfce7;
    color: #15803d;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-badge.inactive {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .detail-button {
    color: #3b82f6;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 14px;
  }

  .detail-button:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 4px;
    margin-top: 24px;
  }

  .pagination button {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: #64748b;
  }

  .pagination button:hover {
    background-color: #f1f5f9;
  }

  .pagination button.active {
    background-color: #3b82f6;
    color: white;
  }
`;

const UserManagement = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
  
    const initialUsers = [
      { id: '사용자1', email: 'user1@example.com', phone: '010-1234-5670', date: '2024.03.11', status: '활성', role: '관리자' },
      { id: '사용자2', email: 'user2@example.com', phone: '010-1234-5671', date: '2024.03.12', status: '비활성', role: '일반' },
      { id: '사용자3', email: 'user3@example.com', phone: '010-1234-5672', date: '2024.03.13', status: '활성', role: '일반' },
      { id: '사용자4', email: 'user4@example.com', phone: '010-1234-5673', date: '2024.03.14', status: '비활성', role: '관리자' },
      { id: '사용자5', email: 'user5@example.com', phone: '010-1234-5674', date: '2024.03.15', status: '활성', role: '일반' },
    ];

  const filteredUsers = initialUsers.filter(user => {
    const matchesSearch = 
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  const handleDetailClick = (user) => {
    setSelectedUser(user);
  };

  if (selectedUser) {
    return <UserDetail 
      onBack={() => setSelectedUser(null)}
    />;
  }

  return (
    <>
      <style>{styles}</style>
      <div className="user-management-container">
        <div className="header-section">
          <h1>회원 관리</h1>
          <div className="search-filters">
            <input 
              type="text" 
              placeholder="이름, 이메일, 전화번호 검색" 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <select value={roleFilter} onChange={handleRoleChange}>
              <option value="all">전체 직책</option>
              <option value="관리자">관리자</option>
              <option value="일반">일반</option>
            </select>
            <select value={statusFilter} onChange={handleStatusChange}>
              <option value="all">전체 상태</option>
              <option value="활성">활성</option>
              <option value="비활성">비활성</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>가입일</th>
                <th>직책</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.date}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.status === '비활성' ? 'inactive' : ''}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="detail-button"
                      onClick={() => handleDetailClick(user)}
                    >
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="active">1</button>
          {[2, 3, 4, 5].map((page) => (
            <button key={page}>{page}</button>
          ))}
        </div>
      </div>
    </>
  );
};

export default UserManagement;