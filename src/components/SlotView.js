import React, { useState } from 'react';
import styled from 'styled-components';

const SlotsContainer = styled.div`
  position: relative;
  margin-top: 15px;
`;

const SlotsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  overflow: hidden;
`;

const TimeColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SlotCell = styled.div`
  padding: 8px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
  background-color: ${props => {
    switch(props.status) {
      case 'online': return '#28a745';
      case 'offline': return '#ff9800';
      case 'both': return '#2196f3';
      case 'online-booked': return '#007bff';
      case 'offline-booked': return '#673ab7';
      case 'blocked': return '#795548';
      default: return '#f0f0f0';
    }
  }};
  color: ${props => props.status ? 'white' : '#333'};
  border: 1px solid ${props => props.status ? 'transparent' : '#ddd'};
`;

const NavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #5b6ef5;
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
  z-index: 1;
  transition: background 0.2s;

  &:hover {
    background: #4754c6;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavButton)`
  left: -40px;
`;

const NextButton = styled(NavButton)`
  right: -40px;
`;

const SlotView = ({ slots }) => {
  const [columnOffset, setColumnOffset] = useState(0);
  const columnsPerPage = 4;

  
  const allColumns = [];
  for (let hour = 8; hour < 24; hour++) {
    const columnSlots = [
      { time: `${hour}:00`, status: null },
      { time: `${hour}:15`, status: null },
      { time: `${hour}:30`, status: null },
      { time: `${hour}:45`, status: null }
    ];
    
    
    slots.forEach(slot => {
      const [slotHour, slotMinute] = slot.time.split(':').map(Number);
      if (slotHour === hour) {
        const quarter = Math.floor(slotMinute / 15);
        columnSlots[quarter] = slot;
      }
    });
    
    allColumns.push(columnSlots);
  }

  const totalColumns = allColumns.length;
  const visibleColumns = allColumns.slice(columnOffset, columnOffset + columnsPerPage);
  const canGoPrev = columnOffset > 0;
  const canGoNext = columnOffset + columnsPerPage < totalColumns;

  return (
    <SlotsContainer>
      <PrevButton 
        onClick={() => setColumnOffset(Math.max(0, columnOffset - columnsPerPage))}
        disabled={!canGoPrev}
      >
        &lt;
      </PrevButton>
      
      <SlotsGrid>
        {visibleColumns.map((column, colIndex) => (
          <TimeColumn key={colIndex}>
            {column.map((slot, slotIndex) => (
              <SlotCell key={`${colIndex}-${slotIndex}`} status={slot.status}>
                {slot.time}
              </SlotCell>
            ))}
          </TimeColumn>
        ))}
      </SlotsGrid>

      <NextButton 
        onClick={() => setColumnOffset(Math.min(totalColumns - columnsPerPage, columnOffset + columnsPerPage))}
        disabled={!canGoNext}
      >
        &gt;
      </NextButton>
    </SlotsContainer>
  );
};

export default SlotView;