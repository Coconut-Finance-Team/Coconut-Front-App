import React, { useState } from 'react';
import './SubscriptionCalendar.css';

function SubscriptionCalendar() {
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);

  const calendarData = {
    '2024-11': [
      { day: 5, label: '공모주\n(주)쓰리빌리언', type: '공모주' },
      { day: 6, label: '상장\n(주)더본코리아', type: '상장' },
      { day: 7, label: '공모주\n(주)엠오티', type: '공모주' },
      { day: 8, label: '환불\n(주)쓰리빌리언', type: '환불' },
      { day: 12, label: '환불\n(주)엠오티', type: '환불' },
      { day: 14, label: '상장\n(주)쓰리빌리언', type: '상장' },
      { day: 18, label: '상장\n(주)엠오티', type: '상장' },
    ]
  };

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDays = daysInMonth(currentMonth, currentYear);

  const eventsForMonth = calendarData[`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`] || [];

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="calendar-container">
      {/* Month and Year Selector */}
      <div className="calendar-header">
        <button onClick={handlePreviousMonth} className="nav-button">◀</button>
        <span className="calendar-title">
          {currentYear}.{String(currentMonth + 1).padStart(2, '0')}
        </span>
        <button onClick={handleNextMonth} className="nav-button">▶</button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div key={index} className="day-of-week">{day}</div>
        ))}
        
        {/* Render empty spaces for the first row to align the start day */}
        {[...Array(firstDayOfMonth)].map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {/* Render days of the month */}
        {[...Array(totalDays)].map((_, i) => {
          const day = i + 1;
          const event = eventsForMonth.find(event => event.day === day);
          const dayOfWeek = (firstDayOfMonth + i) % 7;
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <div key={day} className={`calendar-day ${isWeekend ? 'weekend' : 'weekday'}`}>
              <span className={`day-number ${isWeekend ? 'weekend' : 'weekday'}`}>{day}</span>
              {event && (
                <div className="event" data-type={event.type} style={{ backgroundColor: event.color }}>
                  <span className="event-title">{event.label.split('\n')[0]}</span>
                  <span className="event-company">{event.label.split('\n')[1]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubscriptionCalendar;
