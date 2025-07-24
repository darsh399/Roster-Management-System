import React from "react";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  display: grid;
  grid-template-columns: 100px repeat(7, 1fr); 
  border: 1px solid #ddd;
  font-size: 14px;
  width: 100%;
  height: 100%;
`;

const TimeCell = styled.div`
  background: #f5f5f5;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 12px;
`;

const DayHeader = styled.div`
  background: #eaeaea;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 12px;
`;

const DayCell = styled.div`
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 50px;
  background-color: ${({ status }) =>
    status === "online"
      ? "#28a745"
      : status === "offline"
      ? "#ff9800"
      : status === "both"
      ? "#2196f3"
      : status === "online-booked"
      ? "#007bff"
      : status === "offline-booked"
      ? "#673ab7"
      : status === "blocked"
      ? "#795548"
      : "#fff"};
  color: ${({ status }) => (status ? "#fff" : "#333")};
  transition: background-color 0.2s;
  &:hover {
    opacity: 0.85;
  }
`;

const formatAMPM = (hour) => {
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour} ${ampm}`;
};

const WeeklyCalendar = ({ provider, selectedWeekDates }) => {
  const hours = [];
  for (let i = 8; i <= 24; i++) {
    hours.push(i);
  }

  const getSlotStatus = (date, hour) => {
    const availability = provider.availabilities.find((a) => a.date === date);
    if (!availability) return null;

    const formattedHour = hour.toString().padStart(2, "0") + ":00";

    if (availability.blocked_slots?.some((s) => s.slot === formattedHour)) return "blocked";
    if (availability.online_booked_slots?.includes(formattedHour)) return "online-booked";
    if (availability.offline_booked_slots?.includes(formattedHour)) return "offline-booked";
    if (availability.both_slots?.includes(formattedHour)) return "both";
    if (availability.online_slots?.includes(formattedHour)) return "online";
    if (availability.offline_slots?.includes(formattedHour)) return "offline";
    return null;
  };

  return (
    <CalendarWrapper>
      <TimeCell>Time</TimeCell>
      {selectedWeekDates.map((date, idx) => {
        const dayName = new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
        return <DayHeader key={idx}>{dayName}</DayHeader>;
      })}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <TimeCell>{formatAMPM(hour)}</TimeCell>
          {selectedWeekDates.map((date, dayIdx) => (
            <DayCell key={`${dayIdx}-${hour}`} status={getSlotStatus(date, hour)} />
          ))}
        </React.Fragment>
      ))}
    </CalendarWrapper>
  );
};

export default WeeklyCalendar;