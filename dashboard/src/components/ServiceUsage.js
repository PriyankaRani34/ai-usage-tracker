import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './Chart.css';

const COLORS = ['#667eea', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140', '#30cfd0', '#a8edea', '#fed6e3'];

function ServiceUsage({ stats, services, formatDuration }) {
  const chartData = useMemo(() => {
    const grouped = {};
    
    stats.forEach(stat => {
      const serviceName = stat.service_name;
      if (!grouped[serviceName]) {
        grouped[serviceName] = { 
          name: serviceName, 
          value: 0 
        };
      }
      grouped[serviceName].value += stat.total_duration || 0;
    });
    
    return Object.values(grouped)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10 services
  }, [stats]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p>Duration: {formatDuration(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      <h2>Usage by AI Service</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ServiceUsage;
