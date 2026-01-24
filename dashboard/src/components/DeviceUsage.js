import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Chart.css';

function DeviceUsage({ stats, devices, formatDuration }) {
  const chartData = useMemo(() => {
    const grouped = {};
    
    stats.forEach(stat => {
      const deviceName = stat.device_name;
      if (!grouped[deviceName]) {
        grouped[deviceName] = { 
          device: deviceName, 
          type: stat.device_type,
          duration: 0, 
          requests: 0 
        };
      }
      grouped[deviceName].duration += stat.total_duration || 0;
      grouped[deviceName].requests += stat.total_requests || 0;
    });
    
    return Object.values(grouped).sort((a, b) => b.duration - a.duration);
  }, [stats]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].payload.device}</p>
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
      <h2>Usage by Device</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="device" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="duration" fill="#667eea" name="Duration (seconds)" />
          <Bar dataKey="requests" fill="#f093fb" name="Requests" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DeviceUsage;
