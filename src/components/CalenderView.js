import React from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  font-family: 'Segoe UI', sans-serif;
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e0e0e0;
  h1 {
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #333;
  }
  .provider-name {
    font-size: 16px;
    color: #555;
  }
`;

const WeekHeader = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  div {
    padding: 10px;
    text-align: center;
    font-weight: 500;
    color: #333;
    &:not(:last-child) {
      border-right: 1px solid #e0e0e0;
    }
    .day-name {
      font-size: 14px;
      text-transform: uppercase;
    }
    .date {
      font-size: 16px;
      margin-top: 4px;
    }
  }
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: 80px repeat(7, 1fr);
  grid-template-rows: repeat(24, 40px);
  overflow-y: auto;
`;

const TimeColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(24, 40px);
  background: #f8f9fa;
  div {
    padding-right: 10px;
    text-align: right;
    font-size: 12px;
    color: #70757a;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

const DayColumn = styled.div`
  display: grid;
  grid-template-rows: repeat(24, 40px);
  div {
    border-right: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    position: relative;
    &:hover {
      background: #f5f5f5;
    }
  }
`;

const TimeSlot = styled.div`
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  border-radius: 4px;
  background-color: ${props => {
    switch(props.status) {
      case 'online': return '#e8f5e9'; 
      case 'offline': return '#ffe0b2'; 
      case 'both': return '#bbdefb'; 
      case 'online-booked': return '#ffcdd2';
      case 'offline-booked': return '#ffebee';
      case 'blocked': return '#d7ccc8'; 
      default: return '#f5f5f5'; 
    }
  }};
  border-left: 4px solid ${props => {
    switch(props.status) {
      case 'online': return '#4caf50'; 
      case 'offline': return '#ff9800'; 
      case 'both': return '#2196f3'; 
      case 'online-booked': return '#f44336';
      case 'offline-booked': return '#d32f2f';
      case 'blocked': return '#5d4037'; 
      default: return '#9e9e9e'; 
    }
  }};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  z-index: 1001;
  &:hover {
    color: #333;
  }
`;

const CalendarView = ({ provider, onClose }) => {
  
  const today = new Date('2025-07-24'); 
  const currentDay = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - currentDay); 
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dates = [];
  const dateStrings = [];
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
    dateStrings.push(date.toISOString().split('T')[0]);
  }

  
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    timeSlots.push({
      display: `${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}:00 ${hour < 12 ? 'AM' : 'PM'}`,
      hour,
      timeString: `${hour.toString().padStart(2, '0')}:00`
    });
  }

  
  const getSlotStatus = (dateString, hour) => {
    if (!provider?.availabilities) return null;
    
    const availability = provider.availabilities.find(a => a.date === dateString);
    if (!availability) return 'available'; 
    
    const timeString = `${hour.toString().padStart(2, '0')}:00`;
    
    if (availability.online_booked_slots?.includes(timeString)) return 'online-booked';
    if (availability.offline_booked_slots?.includes(timeString)) return 'offline-booked';
    if (availability.blocked_slots?.some(s => s.slot === timeString)) return 'blocked';
    if (availability.online_slots?.includes(timeString)) return 'online';
    if (availability.offline_slots?.includes(timeString)) return 'offline';
    if (availability.both_slots?.includes(timeString)) return 'both';
    
    return 'available'; 
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      zIndex: 1000,
      overflow: 'auto'
    }}>
      <CloseButton onClick={onClose}>×</CloseButton>

      <CalendarContainer>
        <Header>
          <h1>
            {dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
            {dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </h1>
          <div className="provider-name">{provider?.name} - {provider?.clinic_details?.name}</div>
        </Header>

        <WeekHeader>
          <div></div> 
          {weekDays.map((day, index) => (
            <div key={index}>
              <div className="day-name">{day}</div>
              <div className="date">{dates[index].getDate()}</div>
            </div>
          ))}
        </WeekHeader>

        <CalendarGrid>
          <TimeColumn>
            {timeSlots.map((time) => (
              <div key={time.display}>{time.display}</div>
            ))}
          </TimeColumn>

          {dates.map((date, dayIndex) => (
            <DayColumn key={dayIndex}>
              {timeSlots.map((time, hourIndex) => {
                const status = getSlotStatus(dateStrings[dayIndex], time.hour);
                return (
                  <div key={hourIndex}>
                    <TimeSlot status={status} />
                  </div>
                );
              })}
            </DayColumn>
          ))}
        </CalendarGrid>
      </CalendarContainer>
    </div>
  );
};

export default CalendarView;