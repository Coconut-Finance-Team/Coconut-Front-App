import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SubscriptionTable from './SubscriptionTable';
import SubscriptionCalendar from './SubscriptionCalendar';
import SubscriptionApply from './SubscriptionApply';

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#ffffff',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto 20px',
  },
  titleLeft: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#333D4B',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
  tabContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  activeTab: {
    borderBottom: '3px solid #333D4B',
    fontWeight: '700',
    color: '#333D4B',
    fontFamily: '"Noto Sans KR", sans-serif',
    transition: 'color 0.2s ease, transform 0.2s ease',
  },
  inactiveTab: {
    flex: 1,
    textAlign: 'center',
    padding: '15px 0',
    color: '#8B95A1',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'color 0.2s ease, transform 0.2s ease',
    fontFamily: '"Noto Sans KR", sans-serif',
  },
};

function Subscription() {
  const [selectedTab, setSelectedTab] = useState('table');
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    navigate(tab === 'table' ? '/subscription/table' : '/subscription/calendar');
  };

  // showTabs 변수가 중복 선언되어 있었으므로 하나만 남김
  const showTabs = location.pathname === '/subscription/table' || 
                   location.pathname === '/subscription/calendar';

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <h2 style={styles.titleLeft}>공모주 청약안내</h2>
      </div>

      {showTabs && (
        <div style={styles.tabContainer}>
          <span
            onClick={() => handleTabClick('table')}
            onMouseEnter={(e) => {
              e.target.style.color = '#333D4B';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = selectedTab === 'table' ? '#333D4B' : '#8B95A1';
              e.target.style.transform = 'scale(1)';
            }}
            style={selectedTab === 'table' ? { ...styles.inactiveTab, ...styles.activeTab } : styles.inactiveTab}
          >
            청약종목안내
          </span>
          <span
            onClick={() => handleTabClick('calendar')}
            onMouseEnter={(e) => {
              e.target.style.color = '#333D4B';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = selectedTab === 'calendar' ? '#333D4B' : '#8B95A1';
              e.target.style.transform = 'scale(1)';
            }}
            style={selectedTab === 'calendar' ? { ...styles.inactiveTab, ...styles.activeTab } : styles.inactiveTab}
          >
            청약일정조회
          </span>
        </div>
      )}

      <Routes>
        <Route path="table" element={<SubscriptionTable />} />
        <Route path="calendar" element={<SubscriptionCalendar />} />
        <Route path="apply" element={<SubscriptionApply />} />
      </Routes>
    </div>
  );
}

export default Subscription;