import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../../assets/logo.png';

const HeaderContainer = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #f2f2f2;
  padding: 0 40px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  min-width: 500px;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  min-width: 150px;
`;

const LogoImage = styled.img`
  height: 28px;
`;

const LogoText = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
`;

const NavItem = styled(Link)`
  color: ${props => props.$isActive ? '#333' : '#8b95a1'};
  text-decoration: none;
  font-size: 17px;
  font-weight: ${props => props.$isActive ? '600' : '400'};
  padding: 8px 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.$isActive ? '#333' : 'transparent'};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 350px;
  flex-wrap: nowrap;
`;

const SearchBox = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border-radius: 8px;
  padding: 8px 12px;
  margin-right: 8px;
  color: #8b95a1;
  width: 330px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;  // 16px에서 14px로 변경
  font-weight: 400;  // 추가
  font-family: inherit;  // 추가
  color: #666;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #8b95a1;
    font-size: 14px;  // placeholder 폰트 크기도 통일
    font-weight: 400;  // placeholder 폰트 무게도 통일
    font-family: inherit;  // placeholder 폰트도 통일
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const SearchIcon = styled.svg`
  width: 18px;
  height: 18px;
  fill: #8b95a1;
`;

const LoginButton = styled.button`
  background: #4174f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 400;  // 통일
  font-family: inherit;  // 통일
  cursor: pointer;
  white-space: nowrap;
`;

const ProfileButton = styled.button`
  padding: 8px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f3f4f6;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #666;
  }
`;

const DropdownCard = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 50;
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #f2f2f2;
`;

const DropdownUsername = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin: 0;
`;

const DropdownContent = styled.div`
  padding: 4px 0;
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 400;  // 기본 폰트 웨이트로 통일
  font-family: inherit;  // 부모 요소의 폰트 패밀리 상속
  color: #4b5563;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 8px 16px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 400;  // 기본 폰트 웨이트로 통일
  font-family: inherit;  // 부모 요소의 폰트 패밀리 상속
  color: #4174f6;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #f3f4f6;
  }
`;

const Header = ({ user, setUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const checkAndFetchUserInfo = async () => {
      const token = localStorage.getItem('jwtToken');
      console.log('저장된 토큰:', token);
  
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/v1/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log('받아온 사용자 정보:', data);
            setUser(data);
          } else {
            console.error('사용자 정보 가져오기 실패');
            localStorage.removeItem('jwtToken');
            setUser(null);
          }
        } catch (error) {
          console.error('API 호출 에러:', error);
          localStorage.removeItem('jwtToken');
          setUser(null);
        }
      }
    };
  
    checkAndFetchUserInfo();
  }, [setUser]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    const username = user?.username;
    localStorage.removeItem('jwtToken');
    setUser(null);
    setIsProfileOpen(false);
    alert(`${username}님, 코코넛증권은 언제나 고객님을 기다릴게요! 다음에 또 만나요 🌴`);
    navigate('/');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  return (
    <HeaderContainer>
      <LeftSection>
        <LogoContainer to="/">
          <LogoImage src={logo} alt="코코넛증권 로고" />
          <LogoText>코코넛증권</LogoText>
        </LogoContainer>
        
        <Nav>
          <NavItem to="/" $isActive={location.pathname === '/'}>
            홈
          </NavItem>
          <NavItem to="/subscription" $isActive={location.pathname.includes('subscription')}>
            공모주 청약
          </NavItem>
          <NavItem to="/account" $isActive={location.pathname.includes('account')}>
            내 계좌
          </NavItem>
        </Nav>
      </LeftSection>

      <RightSection>
        <SearchBox onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="종목을 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <SearchButton type="submit" aria-label="Search">
            <SearchIcon xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" />
            </SearchIcon>
          </SearchButton>
        </SearchBox>

        {user ? (
          <div className="profile-dropdown" style={{ position: 'relative' }}>
            <ProfileButton onClick={handleProfileClick}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </ProfileButton>
            
            {isProfileOpen && (
              <DropdownCard>
                <DropdownHeader>
                  <DropdownUsername>{user.username}님 안녕하세요</DropdownUsername>
                </DropdownHeader>
                <DropdownContent>
                  <DropdownLink to="/mypage" onClick={() => setIsProfileOpen(false)}>
                    내 정보 보기
                  </DropdownLink>
                  <DropdownButton onClick={handleLogoutClick}>
                    로그아웃
                  </DropdownButton>
                </DropdownContent>
              </DropdownCard>
            )}
          </div>
        ) : (
          <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
};

export default Header;