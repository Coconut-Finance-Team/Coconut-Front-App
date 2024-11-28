// Header.js
import React, { useState } from 'react';
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
  color: ${props => props.isActive ? '#333' : '#8b95a1'};
  text-decoration: none;
  font-size: 17px;
  font-weight: ${props => props.isActive ? '600' : '400'};
  padding: 8px 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 2px;
    background: ${props => props.isActive ? '#333' : 'transparent'};
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
  font-size: 16px;
  color: #666;
  width: 100%;

  &:focus {
    outline: none;
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
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
`;

const WelcomeMessage = styled(Link)`
  font-size: 15px;
  color: #333;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  color: #8b95a1;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
`;

function Header({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/');
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <LogoContainer to="/">
          <LogoImage src={logo} alt="코코넛증권 로고" />
          <LogoText>코코넛증권</LogoText>
        </LogoContainer>
        
        <Nav>
          <NavItem to="/" isActive={location.pathname === '/'}>
            홈
          </NavItem>
          <NavItem to="/subscription" isActive={location.pathname.includes('subscription')}>
            공모주 청약
          </NavItem>
          <NavItem to="/account" isActive={location.pathname.includes('account')}>
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
          <>
            <WelcomeMessage to="/account">{user.username}님 반갑습니다!</WelcomeMessage>
            <LogoutButton onClick={handleLogoutClick}>로그아웃</LogoutButton>
          </>
        ) : (
          <LoginButton onClick={handleLoginClick}>로그인</LoginButton>
        )}
      </RightSection>
    </HeaderContainer>
  );
}

export default Header;
