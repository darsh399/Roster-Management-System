import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styled from 'styled-components';
import { useMediaQuery } from 'react-responsive';

const locales = {
  'en-US': require('date-fns/locale/en-US')
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${props => props.darkMode ? '#f0f0f0' : '#666'};
  z-index: 1001;
  &:hover {
    color: ${props => props.darkMode ? '#fff' : '#333'};
  }

  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    font-size: 20px;
  }
`;

const CalendarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.darkMode ? '#2d2d2d' : 'white'};
  z-index: 1000;
  overflow: auto;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 15px 10px;
  }
`;

const CalendarTitle = styled.h2`
  color: ${props => props.darkMode ? '#f0f0f0' : '#333'};
  margin-bottom: 20px;
  padding-right: 40px;

  @media (max-width: 768px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
`;

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  padding: 10px;
  background: ${props => props.darkMode ? '#3d3d3d' : '#f5f5f5'};
  border-radius: 5px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 15px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: ${props => props.darkMode ? '#f0f0f0' : '#333'};

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const ColorBox = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 6px;
  border-radius: 3px;
  background-color: ${props => props.color};
  border: 1px solid ${props => props.borderColor};

  @media (max-width: 768px) {
    width: 16px;
    height: 16px;
  }
`;

const CalendarStyles = styled.div`
  .rbc-time-view {
    .rbc-time-content {
      .rbc-time-gutter, 
      .rbc-time-content > * + * > * {
        height: 60px !important;
      }
      
      .rbc-day-slot .rbc-time-slot {
        height: 60px !important;
      }
    }
  }
  
  .rbc-day-slot .rbc-event {
    min-height: 58px !important;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: normal; /* Changed from bold to normal */
  }
`;

const CalendarView = ({ provider, onClose, darkMode }) => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [view, setView] = React.useState(isMobile ? 'day' : 'week');
  
  const events = [];
  
  if (provider?.availabilities) {
    provider.availabilities.forEach(avail => {
      avail.online_slots?.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(avail.date);
        start.setHours(hours, minutes, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);
        
        events.push({
          title: format(start, 'h:mm a'),
          start,
          end,
          status: 'online',
          resource: 'online'
        });
      });

      avail.offline_slots?.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(avail.date);
        start.setHours(hours, minutes, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);
        
        events.push({
          title: format(start, 'h:mm a'),
          start,
          end,
          status: 'offline',
          resource: 'offline'
        });
      });

      avail.both_slots?.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(avail.date);
        start.setHours(hours, minutes, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);
        
        events.push({
          title: format(start, 'h:mm a'),
          start,
          end,
          status: 'both',
          resource: 'both'
        });
      });

      avail.online_booked_slots?.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(avail.date);
        start.setHours(hours, minutes, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);
        
        events.push({
          title: format(start, 'h:mm a'),
          start,
          end,
          status: 'online-booked',
          resource: 'online-booked'
        });
      });

      avail.offline_booked_slots?.forEach(time => {
        const [hours, minutes] = time.split(':').map(Number);
        const start = new Date(avail.date);
        start.setHours(hours, minutes, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);
        
        events.push({
          title: format(start, 'h:mm a'),
          start,
          end,
          status: 'offline-booked',
          resource: 'offline-booked'
        });
      });

      avail.blocked_slots?.forEach(item => {
        const [hours, minutes] = item.slot.split(':').map(Number);
        const start = new Date(avail.date);
        start.setHours(hours, minutes, 0);
        const end = new Date(start);
        end.setMinutes(start.getMinutes() + 15);
        
        events.push({
          title: format(start, 'h:mm a'),
          start,
          end,
          status: 'blocked',
          resource: 'blocked'
        });
      });
    });
  }

  const getEventColors = (status) => {
    switch(status) {
      case 'online':
        return {
          backgroundColor: darkMode ? '#2e7d32' : '#e8f5e9',
          borderColor: darkMode ? '#4caf50' : '#4caf50'
        };
      case 'offline':
        return {
          backgroundColor: darkMode ? '#ff9800' : '#ffe0b2',
          borderColor: darkMode ? '#ff9800' : '#ff9800'
        };
      case 'both':
        return {
          backgroundColor: darkMode ? '#1565c0' : '#bbdefb',
          borderColor: darkMode ? '#2196f3' : '#2196f3'
        };
      case 'online-booked':
        return {
          backgroundColor: darkMode ? '#c62828' : '#ffcdd2',
          borderColor: darkMode ? '#f44336' : '#f44336'
        };
      case 'offline-booked':
        return {
          backgroundColor: darkMode ? '#b71c1c' : '#ffebee',
          borderColor: darkMode ? '#d32f2f' : '#d32f2f'
        };
      case 'blocked':
        return {
          backgroundColor: darkMode ? '#4e342e' : '#d7ccc8',
          borderColor: darkMode ? '#5d4037' : '#5d4037'
        };
      default:
        return {
          backgroundColor: darkMode ? '#424242' : '#f5f5f5',
          borderColor: darkMode ? '#616161' : '#9e9e9e'
        };
    }
  };

  const eventStyleGetter = (event) => {
    const { backgroundColor, borderColor } = getEventColors(event.status);
    
    return {
      style: {
        backgroundColor,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '4px',
        color: darkMode ? '#f0f0f0' : '#333',
        border: 'none',
        fontSize: isMobile ? '12px' : '14px',
        padding: isMobile ? '2px 4px' : '4px 8px',
        fontWeight: 'normal' // Ensure no bold text
      }
    };
  };

  const renderEvent = (event) => {
    return (
      <div style={{ fontWeight: 'normal' }}> {/* Remove bold from here too */}
        {event.title}
      </div>
    );
  };

  const legendItems = [
    { status: 'online', label: 'Online Available' },
    { status: 'offline', label: 'Offline Available' },
    { status: 'both', label: 'online + offline' },
    { status: 'online-booked', label: 'Online Booked' },
    { status: 'offline-booked', label: 'Offline Booked' },
    { status: 'blocked', label: 'Blocked' }
  ];

  return (
    <CalendarContainer darkMode={darkMode}>
      <CloseButton onClick={onClose} darkMode={darkMode}>×</CloseButton>
      <CalendarTitle darkMode={darkMode}>
        {provider?.name} - {provider?.clinic_details?.name}
      </CalendarTitle>
      
      <LegendContainer darkMode={darkMode}>
        {legendItems.map(item => {
          const colors = getEventColors(item.status);
          return (
            <LegendItem key={item.status} darkMode={darkMode}>
              <ColorBox color={colors.backgroundColor} borderColor={colors.borderColor} />
              {item.label}
            </LegendItem>
          );
        })}
      </LegendContainer>
      
      <CalendarStyles>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ 
            height: isMobile ? 'calc(100vh - 180px)' : 'calc(100vh - 160px)',
            color: darkMode ? '#f0f0f0' : '#333'
          }}
          defaultView={isMobile ? 'day' : 'week'}
          views={['week', 'day']}
          min={new Date(0, 0, 0, 8, 0, 0)}
          max={new Date(0, 0, 0, 20, 0, 0)}
          eventPropGetter={eventStyleGetter}
          onView={setView}
          view={view}
          toolbar={true}
          components={{
            event: renderEvent
          }}
          dayLayoutAlgorithm="no-overlap"
          timeslots={1}
        />
      </CalendarStyles>
    </CalendarContainer>
  );
};

export default CalendarView;