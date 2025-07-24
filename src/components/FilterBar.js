import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterSelect = styled.select`
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const FilterBar = ({ providers, onServiceChange, onTypeChange, onCenterChange }) => {
  const [services, setServices] = useState([]);
  const [types, setTypes] = useState([]);
  const [centers, setCenters] = useState([]);

  useEffect(() => {
    
    const uniqueServices = [...new Set(providers.map(p => p.provider_usertype))];
    const uniqueTypes = [...new Set(providers.map(p => (p.is_inhouse ? 'In-house' : 'External')))];
    const uniqueCenters = [...new Set(providers.map(p => p.clinic_details.name))];

    setServices(uniqueServices);
    setTypes(uniqueTypes);
    setCenters(uniqueCenters);
  }, [providers]);

  return (
    <FilterGroup>
      <FilterSelect onChange={(e) => onServiceChange(e.target.value)}>
        <option value="">All Services</option>
        {services.map((service, idx) => (
          <option key={idx} value={service}>{service}</option>
        ))}
      </FilterSelect>

      <FilterSelect onChange={(e) => onTypeChange(e.target.value)}>
        <option value="">All Types</option>
        {types.map((type, idx) => (
          <option key={idx} value={type}>{type}</option>
        ))}
      </FilterSelect>

      <FilterSelect onChange={(e) => onCenterChange(e.target.value)}>
        <option value="">All Centers</option>
        {centers.map((center, idx) => (
          <option key={idx} value={center}>{center}</option>
        ))}
      </FilterSelect>
    </FilterGroup>
  );
};

export default FilterBar;
