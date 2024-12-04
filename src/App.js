import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Homeboard from './components/Homeboard';
import Account from './components/Account';
import Subscription from './components/subscription/Subscription';
import SubscriptionApply from './components/subscription/SubscriptionApply';
import SubscriptionConfirm from './components/subscription/SubscriptionConfirm';
import SubscriptionComplete from './components/subscription/SubscriptionComplete';
import SubscriptionInquiry from './components/subscription/SubscriptionInquiry';
import Login from './components/auth/Login';
import Signin from './components/auth/Signin';
import SigninUserInfo from './components/auth/SigninUserInfo';
import SigninAddInfo from './components/auth/SigninAddInfo';
import FindIdPassword from './components/auth/FindIdPassword';
import RealTimeChart from './components/home/RealTimeChart';
import StockDetail from './components/home/StockDetail';
import MarketChart from './components/home/MarketChart';
import SearchPage from './components/common/SearchPage';
import AdminPage from './components/admin/AdminPage';
import MyPage from './components/mypage';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Noto Sans KR', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

function App() {
  const [user, setUser] = useState(null);
  const isAdminPath = window.location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <>
        <GlobalStyle />
        <Routes>
          <Route path="/admin/*" element={<AdminPage />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <GlobalStyle />
      <div>
        <Header user={user} setUser={setUser} />
        <main>
          <Routes>
            <Route path="/" element={<Homeboard />} />
            <Route
              path="/account/*"
              element={<Account user={user} setUser={setUser} />}
            />

            {/* Subscription 관련 라우트 정리 */}
            <Route path="/subscription/apply/confirm" element={<SubscriptionConfirm />} />
            <Route path="/subscription/apply/complete" element={<SubscriptionComplete />} />
            <Route path="/subscription/apply" element={<SubscriptionApply />} />
            <Route path="/subscription/inquiry" element={<SubscriptionInquiry />} />
            <Route path="/subscription" element={<Navigate to="/subscription/table" replace />} />
            <Route path="/subscription/*" element={<Subscription />} />

            {/* Auth 관련 라우트 */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup/userinfo" element={<SigninUserInfo />} />
            <Route path="/signup/signinaddinfo" element={<SigninAddInfo />} />
            <Route path="/findidpassword" element={<FindIdPassword />} />
            <Route path="/chart" element={<RealTimeChart />} />

            {/* 주식 상세 페이지 라우트 */}
            <Route path="/stock/:stockId" element={<StockDetail />} />
            
            {/* /stock으로 시작하는 기존 URL을 /stocks로 리다이렉트 */}
            <Route
              path="/stock/:stockId"
              element={<Navigate to={location => `/stock/${location.pathname.split('/')[2]}`} replace />}
            />

            {/* MarketChart로 변경된 코스피/코스닥 차트 라우트 */}
            <Route path="/chart/kospi" element={<MarketChart />} />
            <Route path="/chart/kosdaq" element={<MarketChart />} />
            
            <Route path="/search" element={<SearchPage />} />
            <Route path="/mypage" element={<MyPage user={user} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;