import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserDetail from './UserDetail';
import { useNavigate } from 'react-router-dom';

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

  .loading {
    text-align: center;
    padding: 20px;
    color: #64748b;
  }

  .error {
    text-align: center;
    padding: 20px;
    color: #dc2626;
    background-color: #fee2e2;
    border-radius: 6px;
    margin: 20px 0;
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAndFetchUsers = async () => {
      const token = localStorage.getItem('jwtToken');
      console.log('저장된 토큰:', token);

      if (token) {
        try {
          // JWT 토큰 디코딩
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          console.log('토큰 페이로드:', tokenPayload);

          // 사용자 정보 가져오기
          const userResponse = await fetch('http://localhost:8080/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!userResponse.ok) {
            console.error('사용자 정보 가져오기 실패');
            localStorage.removeItem('jwtToken');
            setCurrentUser(null);
            navigate('/login');
            return;
          }

          const userData = await userResponse.json();
          console.log('받아온 사용자 정보:', userData);
          setCurrentUser(userData);

          // 전체 사용자 목록 가져오기 시도
          const usersResponse = await fetch('http://localhost:8080/api/v1/admin/read/user/all', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            setUsers(usersData);
            setError(null);
          } else {
            // 관리자 API 접근이 실패하면 에러 메시지 표시
            throw new Error('관리자 권한이 필요한 페이지입니다.');
          }
        } catch (error) {
          console.error('API 호출 에러:', error);
          setError(error.message);
          if (error.message.includes('관리자 권한')) {
            navigate('/');  // 또는 다른 적절한 페이지로 리다이렉트
          }
        } finally {
          setLoading(false);
        }
      } else {
        navigate('/login');
      }
    };

    checkAndFetchUsers();
  }, [navigate]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '활성';
      case 'SUSPENDED':
        return '비활성';
      default:
        return status;
    }
  };

  const formatRole = (role) => {
    switch (role) {
      case 'ADMIN':
        return '관리자';
      case 'USER':
        return '일반';
      default:
        return role;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const statusValue = formatStatus(user.status);
    const roleValue = formatRole(user.role);

    const matchesStatus = statusFilter === 'all' || statusValue === statusFilter;
    const matchesRole = roleFilter === 'all' || roleValue === roleFilter;

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
      user={selectedUser}
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

        {loading ? (
          <div className="loading">데이터를 불러오는 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
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
                    <tr key={user.uuid}>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{formatDate(user.createTime)}</td>
                      <td>{formatRole(user.role)}</td>
                      <td>
                        <span className={`status-badge ${formatStatus(user.status) === '비활성' ? 'inactive' : ''}`}>
                          {formatStatus(user.status)}
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
          </>
        )}
      </div>
    </>
  );
};

export default UserManagement;