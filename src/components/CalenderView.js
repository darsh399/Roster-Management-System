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
.rbc-calendar {
color: ${props => props.darkMode ? '#f0f0f0' : '#333'};
}

.rbc-time-view {
.rbc-time-content {
.rbc-time-gutter,
.rbc-time-content > * + * > * {
height: 120px !important;
}

.rbc-day-slot .rbc-time-slot {
height: 30px !important; 
border-top: none !important; 
}

.rbc-timeslot-group {
min-height: 120px !important; 
height: 120px !important;
display: flex !important;
flex-direction: column !important;
}
}

.rbc-time-gutter .rbc-timeslot-group {
border-bottom: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};
}

.rbc-day-slot {
.rbc-event {
margin: 1px !important;
border-radius: 4px !important;
box-shadow: 0 1px 3px rgba(0,0,0,0.2) !important;
overflow: hidden !important;
width: calc(100% - 4px) !important;
left: 2px !important;

&:hover {
box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
z-index: 10 !important;
}
}

.rbc-event-content {
padding: 2px !important;
text-align: center !important;
font-weight: 500 !important;
white-space: nowrap !important;
overflow: hidden !important;
text-overflow: ellipsis !important;
height: 100% !important;
display: flex !important;
align-items: center !important;
justify-content: center !important;
font-size: 11px !important;
}
}
}

.rbc-header {
background: ${props => props.darkMode ? '#3d3d3d' : '#f8f9fa'};
color: ${props => props.darkMode ? '#f0f0f0' : '#333'};
border-bottom: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};
padding: 10px 5px;
font-weight: 600;
}

.rbc-time-header {
background: ${props => props.darkMode ? '#2d2d2d' : '#fff'};
}

.rbc-time-gutter .gutter-segment {
color: ${props => props.darkMode ? '#aaa' : '#666'};
}

.rbc-toolbar {
background: ${props => props.darkMode ? '#3d3d3d' : '#f8f9fa'};
padding: 15px;
border-radius: 8px;
margin-bottom: 20px;
border: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};

.rbc-toolbar-label {
color: ${props => props.darkMode ? '#f0f0f0' : '#333'};
font-weight: 600;
font-size: 18px;
}

.rbc-btn-group button {
background: ${props => props.darkMode ? '#4a5568' : '#fff'};
color: ${props => props.darkMode ? '#f0f0f0' : '#333'};
border: 1px solid ${props => props.darkMode ? '#555' : '#ddd'};
padding: 8px 16px;

&:hover {
background: ${props => props.darkMode ? '#5a6578' : '#f8f9fa'};
}

&.rbc-active {
background: #2196f3;
color: white;
border-color: #2196f3;
}
}
}
`;

const CalendarView = ({ provider, onClose, darkMode }) => {
const isMobile = useMediaQuery({ maxWidth: 768 });
const [view, setView] = React.useState(isMobile ? 'day' : 'week');

React.useEffect(() => {
const scrollToTop = () => {
const calendarElement = document.querySelector('.rbc-time-view .rbc-time-content');
if (calendarElement) {
calendarElement.scrollTop = 0;
}
};

const timer = setTimeout(scrollToTop, 100);

return () => clearTimeout(timer);
}, [provider]);

const events = [];

if (provider?.availabilities) {
provider.availabilities.forEach(avail => {
const slotMap = new Map();

avail.online_slots?.forEach(time => {
slotMap.set(time, { status: 'online', priority: 1 });
});

avail.offline_slots?.forEach(time => {
slotMap.set(time, { status: 'offline', priority: 1 });
});

avail.both_slots?.forEach(time => {
slotMap.set(time, { status: 'both', priority: 1 });
});

avail.online_booked_slots?.forEach(time => {
slotMap.set(time, { status: 'online-booked', priority: 2 });
});

avail.offline_booked_slots?.forEach(time => {
slotMap.set(time, { status: 'offline-booked', priority: 2 });
});

avail.blocked_slots?.forEach(item => {
slotMap.set(item.slot, { status: 'blocked', priority: 3, reason: item.reason });
});

slotMap.forEach((slotInfo, time) => {
const [hours, minutes] = time.split(':').map(Number);
const start = new Date(avail.date);
start.setHours(hours, minutes, 0, 0);
const end = new Date(start);
end.setMinutes(start.getMinutes() + 15);

const title = format(start, 'h:mm a');

events.push({
title,
start,
end,
status: slotInfo.status,
resource: slotInfo.status,
reason: slotInfo.reason,
allDay: false
});
});
});
}

const getEventColors = (status) => {
switch(status) {
case 'online':
return {
backgroundColor: '#4caf50', 
borderColor: '#388e3c',
textColor: '#fff'
};
case 'offline':
return {
backgroundColor: '#ff9800', 
borderColor: '#f57c00',
textColor: '#fff'
};
case 'both':
return {
backgroundColor: '#2196f3', 
borderColor: '#1976d2',
textColor: '#fff'
};
case 'online-booked':
return {
backgroundColor: '#2196f3', 
borderColor: '#1976d2',
textColor: '#fff'
};
case 'offline-booked':
return {
backgroundColor: '#9c27b0', 
borderColor: '#7b1fa2',
textColor: '#fff'
};
case 'blocked':
return {
backgroundColor: '#795548', 
borderColor: '#5d4037',
textColor: '#ffffff' 
};
default:
return {
backgroundColor: darkMode ? '#424242' : '#f5f5f5',
borderColor: darkMode ? '#616161' : '#9e9e9e',
textColor: darkMode ? '#f0f0f0' : '#333'
};
}
};

const eventStyleGetter = (event) => {
const { backgroundColor, borderColor, textColor } = getEventColors(event.status);
const isBlocked = event.status === 'blocked' && event.reason;

return {
style: {
backgroundColor,
border: `1px solid ${borderColor}`,
borderRadius: '5px',
color: textColor,
fontSize: isMobile ? '13px' : '14px', 
fontWeight: '500',
textAlign: 'center',
padding: isBlocked ? '6px 8px' : '5px 6px', 
margin: '1px',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
overflow: 'hidden',
boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
lineHeight: '1.3',
whiteSpace: isBlocked ? 'normal' : 'nowrap',
textOverflow: 'ellipsis',
width: 'calc(100% - 2px)',
minHeight: isBlocked ? '25px' : '22px' 
}
};
};

const renderEvent = (event) => {
const isBlocked = event.event.status === 'blocked' && event.event.reason;

if (isBlocked) {
return (
<div
style={{
fontWeight: '500',
textAlign: 'center',
fontSize: isMobile ? '13px' : '14px',
height: '100%',
width: '100%',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
padding: '2px',
overflow: 'hidden',
color: '#ffffff',
cursor: 'pointer'
}}
title={event.event.reason} 
>
<div style={{
fontSize: isMobile ? '12px' : '13px',
fontWeight: '600',
color: '#ffffff'
}}>
{event.event.title}
</div>
</div>
);
}

return (
<div
style={{
fontWeight: '500',
textAlign: 'center',
fontSize: isMobile ? '13px' : '14px',
height: '100%',
width: '100%',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
padding: '2px',
overflow: 'hidden',
cursor: 'pointer'
}}
title={event.event.reason || ''} 
>
<div style={{
fontSize: isMobile ? '12px' : '13px',
fontWeight: '600'
}}>
{event.event.title}
</div>
</div>
);
};

const legendItems = [
{ status: 'online', label: 'Online Available' },
{ status: 'offline', label: 'Offline Available' },
{ status: 'both', label: 'online + offline' },
{ status: 'online-booked', label: 'Booked Online' },
{ status: 'offline-booked', label: 'Booked Offline' },
{ status: 'blocked', label: 'Blocked' }
];

return (
<CalendarContainer darkMode={darkMode}>
<CloseButton onClick={onClose} darkMode={darkMode}>X</CloseButton>
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

<CalendarStyles darkMode={darkMode}>
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
step={15}
timeslots={4}
showMultiDayTimes={false}
formats={{
eventTimeRangeFormat: () => null,
eventTimeRangeStartFormat: () => null,
eventTimeRangeEndFormat: () => null
}}
/>
</CalendarStyles>
</CalendarContainer>
);
};

export default CalendarView;