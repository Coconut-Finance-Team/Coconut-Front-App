import React from 'react';
import LogoImage from '../../assets/logo.png'; // 로고 이미지 경로
import { Link, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { BsClockHistory } from 'react-icons/bs';
import { BiBarChartAlt2 } from 'react-icons/bi';

const AdminLayout = ({ children }) => {
  const location = useLocation();

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarTitle>관리자님 환영합니다!</SidebarTitle>
        <Nav>
          <CategoryTitle>코코넛 회원관리</CategoryTitle>
          <NavItem
            to="/admin/usermanagement"
            $isActive={location.pathname === '/admin/usermanagement'}
          >
            <IconWrapper>
              <HiOutlineDocumentReport />
            </IconWrapper>
            회원관리
          </NavItem>

          <CategoryTitle>코코넛 모니터링</CategoryTitle>
          <NavItem
            to="/admin/system"
            $isActive={location.pathname === '/admin/system'}
          >
            <IconWrapper>
              <BsClockHistory />
            </IconWrapper>
            시스템 모니터링
          </NavItem>

          <CategoryTitle>코코넛 이용고객</CategoryTitle>
          <NavItem
            to="/admin/dashboard"
            $isActive={location.pathname === '/admin/dashboard'}
          >
            <IconWrapper>
              <BiBarChartAlt2 size={20} />
            </IconWrapper>
            대시보드
          </NavItem>
        </Nav>
      </Sidebar>
      <Main>
        {location.pathname === '/admin' && (
          <CenterContainer>
            <FloatingLogoWrapper>
              <Logo src={LogoImage} alt="코코넛증권 로고" />
            </FloatingLogoWrapper>
            <LogoTitle>
              증권의 새로운 플랫폼,<br />
              코코넛 증권
            </LogoTitle>
          </CenterContainer>
        )}
        {children}
      </Main>
    </LayoutContainer>
  );
};

// 기존 스타일은 유지
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.aside`
  width: 200px;
  background-color: #ffffff;
  border-right: 1px solid #e0e0e0;
  padding: 20px 0;
`;

const SidebarTitle = styled.h1`
  padding: 0 20px;
  margin-bottom: 30px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const CategoryTitle = styled.div`
  padding: 8px 20px;
  font-size: 12px;
  color: #666;
  font-weight: 500;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const IconWrapper = styled.span`
  margin-right: 8px;
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const NavItem = styled(Link)`
  padding: 10px 20px;
  font-size: 14px;
  color: ${props => props.$isActive ? '#1a73e8' : '#666'};
  background-color: ${props => props.$isActive ? '#e8f0fe' : 'transparent'};
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.$isActive ? '#e8f0fe' : '#f5f5f5'};
    color: ${props => props.$isActive ? '#1a73e8' : '#333'};
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 24px;
  background-color: #f8f9fa;
  position: relative;
`;

// 새로 추가된 스타일
const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const CenterContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  text-align: center;
`;

const FloatingLogoWrapper = styled.div`
  animation: ${float} 3s ease-in-out infinite;
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
`;

const LogoTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  text-align: center;
  line-height: 1.5;
`;

export default AdminLayout;
