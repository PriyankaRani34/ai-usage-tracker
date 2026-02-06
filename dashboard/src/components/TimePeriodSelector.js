import React from 'react';
import './TimePeriodSelector.css';

function TimePeriodSelector({ period, onPeriodChange }) {
  const periods = [
    { value: '1d', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'month', label: 'This Month' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="period-selector">
      {periods.map(p => (
        <button
          key={p.value}
          className={`period-btn ${period === p.value ? 'active' : ''}`}
          onClick={() => onPeriodChange(p.value)}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}

export default TimePeriodSelector;
