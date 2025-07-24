import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { loadProviders } from './redux/action';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import SlotView from './components/SlotView';
import CalendarView from './components/CalenderView';
import { FaMoon, FaSun } from 'react-icons/fa';

const lightTheme = {
  background: '#f5f7fa',
  panelBackground: '#fff',
  rightPanelBackground: '#f9f9f9',
  text: '#333',
  cardBackground: '#fff',
  border: '#e0e0e0',
  primary: '#5b6ef5',
  hoverPrimary: '#4754c6',
  legendText: '#666',
};

const darkTheme = {
  background: '#1a1a1a',
  panelBackground: '#2d2d2d',
  rightPanelBackground: '#252525',
  text: '#f0f0f0',
  cardBackground: '#2d2d2d',
  border: '#444',
  primary: '#7c8df5',
  hoverPrimary: '#5b6ef5',
  legendText: '#aaa',
};

const AppHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const AppTitle = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ThemeToggle = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.hoverPrimary};
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 13px;
  }
`;

const AppContainer = styled.div`
  font-family: 'Segoe UI', sans-serif;
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
  background: ${props => props.theme.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const LeftPanel = styled.div`
  width: 300px;
  background: ${props => props.theme.panelBackground};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    width: auto;
    padding: 15px;
  }
`;

const RightPanel = styled.div`
  flex: 1;
  background: ${props => props.theme.rightPanelBackground};
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
    overflow-x: auto;
  }
`;

const DateNavigation = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;

  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;

const DateRange = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.text};

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const NavArrow = styled.button`
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;

  &:hover {
    background: ${props => props.theme.hoverPrimary};
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }
`;

const DateStrip = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateBox = styled.div`
  min-width: 80px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  background-color: ${props => props.selected ? props.theme.primary : 'transparent'};
  color: ${props => props.selected ? 'white' : props.theme.text};
  font-weight: ${props => props.selected ? '600' : '400'};
  border: 1px solid ${props => props.selected ? props.theme.primary : props.theme.border};
  transition: all 0.2s;

  &:hover {
    border-color: ${props => props.theme.primary};
  }

  @media (max-width: 480px) {
    min-width: 70px;
    padding: 6px;
  }
`;

const DayName = styled.div`
  font-size: 12px;
  text-transform: uppercase;
`;

const DayNumber = styled.div`
  font-size: 16px;
  margin-top: 2px;

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;

  > div:first-child {
    flex: 1;
    min-width: 200px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 14px;
  color: ${props => props.theme.legendText};
  margin: 0;
`;

const ColorLegend = styled.div`
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 10px;
  justify-content: end;
  margin-left: auto;
  max-width: 300px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, auto);
    max-width: 200px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: ${props => props.theme.legendText};
`;

const LegendColor = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${props => {
    switch(props.type) {
      case 'online': return '#28a745';
      case 'offline': return '#ff9800';
      case 'both': return '#2196f3';
      case 'online-booked': return '#007bff';
      case 'offline-booked': return '#673ab7';
      case 'blocked': return '#795548';
      default: return '#f0f0f0';
    }
  }};
`;

const ProviderCard = styled.div`
  margin-bottom: 20px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid ${props => 
    props.type === 'therapist' ? props.theme.primary : 
    props.type === 'psychiatrist' ? '#28a745' : props.theme.border};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  background: ${props => props.theme.cardBackground};
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const CardContent = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const LeftContent = styled.div`
  display: flex;
  gap: 15px;
  min-width: 250px;
`;

const RightContent = styled.div`
  flex: 1;
  min-width: 0;
  overflow-x: auto;
`;

const ProviderImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${props => props.theme.border};
`;

const ProviderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProviderName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const ProviderClinic = styled.div`
  font-size: 13px;
  color: ${props => props.theme.legendText};
`;

const ViewCalendarLink = styled.a`
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  margin-top: 5px;

  &:hover {
    text-decoration: underline;
  }
`;

const App = () => {
  const dispatch = useDispatch();
  const { providers } = useSelector((state) => state.slots);

  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [centerFilter, setCenterFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateRangeIndex, setDateRangeIndex] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    dispatch(loadProviders());
  }, [dispatch]);

  const filteredProviders = providers.filter((p) => {
    const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter ? p.provider_usertype === serviceFilter : true;
    const matchesType = typeFilter ? (p.is_inhouse ? "In-house" : "External") === typeFilter : true;
    const matchesCenter = centerFilter ? p.clinic_details.name === centerFilter : true;
    return matchesName && matchesService && matchesType && matchesCenter;
  });

  const getDateRange = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + dateRangeIndex * 7 + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDateRange();

  const formatDateRange = () => {
    if (dates.length === 0) return '';
    const first = dates[0];
    const last = dates[dates.length - 1];
    return `${first.getDate()} ${first.toLocaleString('default', { month: 'short' })} - ${last.getDate()} ${last.toLocaleString('default', { month: 'short' })} ${last.getFullYear()}`;
  };

  const handlePrevWeek = () => setDateRangeIndex(prev => prev - 1);
  const handleNextWeek = () => setDateRangeIndex(prev => prev + 1);
  const toggleTheme = () => setDarkMode(!darkMode);
  const handleClearAllFilters = () => {
    setSearchTerm("");
    setServiceFilter("");
    setCenterFilter("");
    setTypeFilter("");
  };

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <AppContainer>
        <AppHeader>
          <AppTitle>Provider Calendar</AppTitle>
          <ThemeToggle onClick={toggleTheme}>
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </ThemeToggle>
        </AppHeader>
        
        <ContentWrapper>
          <LeftPanel>
            <SearchBar onSearch={setSearchTerm} searchTerm={searchTerm} />
            <FilterBar
              providers={providers}
              onServiceChange={setServiceFilter}
              onTypeChange={setTypeFilter}
              onCenterChange={setCenterFilter}
              onClearAll={handleClearAllFilters}
            />
          </LeftPanel>

          <RightPanel>
            <DateNavigation>
              <NavArrow onClick={handlePrevWeek}>&lt;</NavArrow>
              <DateRange>{formatDateRange()}</DateRange>
              <NavArrow onClick={handleNextWeek}>&gt;</NavArrow>
            </DateNavigation>

            <DateStrip>
              {dates.map((date) => (
                <DateBox 
                  key={date.toString()}
                  selected={date.toDateString() === selectedDate.toDateString()}
                  onClick={() => setSelectedDate(date)}
                >
                  <DayName>{date.toLocaleString('default', { weekday: 'short' })}</DayName>
                  <DayNumber>{date.getDate()}</DayNumber>
                </DateBox>
              ))}
            </DateStrip>

            <SectionHeader>
              <div>
                <SectionTitle>
                  Schedules for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </SectionTitle>
                <SectionSubtitle>
                  Showing slots in the 8 am to 12 am window
                </SectionSubtitle>
              </div>
              
              <ColorLegend>
                <LegendItem>
                  <LegendColor type="online"/>
                  <span>Online</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor type="offline"/>
                  <span>Offline</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor type="both"/>
                  <span>Both</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor type="online-booked"/>
                  <span>Booked Online</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor type="offline-booked"/>
                  <span>Booked Offline</span>
                </LegendItem>
                <LegendItem>
                  <LegendColor type="blocked"/>
                  <span>Blocked</span>
                </LegendItem>
              </ColorLegend>
            </SectionHeader>

            {filteredProviders.map((provider) => {
              const todayAvailability = provider.availabilities.find(
                (a) => new Date(a.date).toDateString() === selectedDate.toDateString()
              );

              const slots = [];
              if (todayAvailability) {
                todayAvailability.online_slots?.forEach(time => slots.push({ time, status: 'online' }));
                todayAvailability.offline_slots?.forEach(time => slots.push({ time, status: 'offline' }));
                todayAvailability.both_slots?.forEach(time => slots.push({ time, status: 'both' }));
                todayAvailability.online_booked_slots?.forEach(time => slots.push({ time, status: 'online-booked' }));
                todayAvailability.offline_booked_slots?.forEach(time => slots.push({ time, status: 'offline-booked' }));
                todayAvailability.blocked_slots?.forEach(item => slots.push({ time: item.slot, status: 'blocked' }));
              }

              return (
                <ProviderCard key={provider.id} type={provider.provider_usertype}>
                  <CardContent>
                    <LeftContent>
                      <ProviderImage src={provider.image} alt={provider.name} />
                      <ProviderInfo>
                        <ProviderName>{provider.name}</ProviderName>
                        <ProviderClinic>{provider.clinic_details.name}</ProviderClinic>
                        <ViewCalendarLink onClick={() => {
                          setSelectedProvider(provider);
                          setShowCalendar(true);
                        }}>
                          View Calendar &gt;
                        </ViewCalendarLink>
                      </ProviderInfo>
                    </LeftContent>
                    
                    <RightContent>
                      <SlotView slots={slots} />
                    </RightContent>
                  </CardContent>
                </ProviderCard>
              );
            })}
          </RightPanel>
        </ContentWrapper>

        {showCalendar && (
          <CalendarView 
            provider={selectedProvider} 
            onClose={() => setShowCalendar(false)} 
            darkMode={darkMode}
          />
        )}
      </AppContainer>
    </ThemeProvider>
  );
};

export default App;