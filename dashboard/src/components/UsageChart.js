import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

function UsageChart({ stats, formatDuration }) {
  const chartData = useMemo(() => {
    const grouped = {};
    
    stats.forEach(stat => {
      const date = stat.date;
      if (!grouped[date]) {
        grouped[date] = { date, duration: 0, requests: 0 };
      }
      grouped[date].duration += stat.total_duration || 0;
      grouped[date].requests += stat.total_requests || 0;
    });
    
    return Object.values(grouped).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
  }, [stats]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.date}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Duration' 
                ? formatDuration(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h2>Usage Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="duration" 
            stroke="#667eea" 
            strokeWidth={2}
            name="Duration (seconds)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="requests" 
            stroke="#f093fb" 
            strokeWidth={2}
            name="Requests"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default UsageChart;
