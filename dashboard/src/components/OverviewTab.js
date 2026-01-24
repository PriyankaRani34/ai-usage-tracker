import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OverviewTab.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function OverviewTab({ summary, stats, devices, formatDuration, userId }) {
  const [usageByDevice, setUsageByDevice] = useState([]);
  const [topTools, setTopTools] = useState([]);

  useEffect(() => {
    calculateUsageBreakdown();
  }, [stats]);

  const calculateUsageBreakdown = () => {
    // Calculate usage by device
    const deviceUsage = {};
    const toolUsage = {};

    stats.forEach(stat => {
      // Device usage
      if (!deviceUsage[stat.device_name]) {
        deviceUsage[stat.device_name] = {
          name: stat.device_name,
          type: stat.device_type,
          duration: 0
        };
      }
      deviceUsage[stat.device_name].duration += stat.total_duration || 0;

      // Tool usage
      if (!toolUsage[stat.service_name]) {
        toolUsage[stat.service_name] = {
          name: stat.service_name,
          duration: 0
        };
      }
      toolUsage[stat.service_name].duration += stat.total_duration || 0;
    });

    const totalDeviceDuration = Object.values(deviceUsage).reduce((sum, d) => sum + d.duration, 0);
    const totalToolDuration = Object.values(toolUsage).reduce((sum, t) => sum + t.duration, 0);

    setUsageByDevice(
      Object.values(deviceUsage)
        .map(d => ({
          ...d,
          hours: d.duration / 3600,
          percentage: totalDeviceDuration > 0 ? (d.duration / totalDeviceDuration) * 100 : 0
        }))
        .sort((a, b) => b.duration - a.duration)
    );

    setTopTools(
      Object.values(toolUsage)
        .map(t => ({
          ...t,
          percentage: totalToolDuration > 0 ? (t.duration / totalToolDuration) * 100 : 0
        }))
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 5)
    );
  };

  const getAverageDailyHours = () => {
    if (!summary || !summary.total_duration) return 0;
    // Assuming 7 days period
    return (summary.total_duration / 3600) / 7;
  };

  const getUsageLevel = (hours) => {
    if (hours >= 4) return { label: 'High', color: '#ef4444' };
    if (hours >= 2) return { label: 'Moderate', color: '#f59e0b' };
    return { label: 'Low', color: '#10b981' };
  };

  const avgHours = getAverageDailyHours();
  const usageLevel = getUsageLevel(avgHours);

  return (
    <div className="overview-tab">
      <div className="prototype-notice">
        <span className="notice-icon">ℹ️</span>
        <span>Prototype Notice: The data shown below is simulated for demonstration purposes. In the full app, this would track actual AI usage across synced devices.</span>
      </div>

      <div className="metrics-cards">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">⏰</span>
            <span className="metric-tag" style={{ background: usageLevel.color }}>
              {usageLevel.label}
            </span>
          </div>
          <div className="metric-value">{avgHours.toFixed(1)}h</div>
          <div className="metric-label">Average Daily AI Usage</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📈</span>
          </div>
          <div className="metric-value positive">+12%</div>
          <div className="metric-label">Change from Last Week</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-icon">📱</span>
          </div>
          <div className="metric-value">{summary?.device_count || 0}</div>
          <div className="metric-label">Synced Devices</div>
        </div>
      </div>

      <div className="usage-section">
        <div className="section-header">
          <h3>Usage by Device</h3>
          <span className="preview-tag">Preview</span>
        </div>
        <div className="device-list">
          {usageByDevice.map((device, index) => (
            <div key={index} className="device-item">
              <div className="device-info">
                <span className="device-icon">
                  {device.type === 'mobile' ? '📱' : device.type === 'tablet' ? '📱' : '💻'}
                </span>
                <span className="device-name">{device.name}</span>
              </div>
              <div className="device-usage">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${device.percentage}%`,
                      background: device.percentage > 50 
                        ? 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                        : '#6366f1'
                    }}
                  />
                </div>
                <span className="device-hours">{device.hours.toFixed(1)}h</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="usage-section">
        <div className="section-header">
          <h3>Top AI Tools</h3>
        </div>
        <div className="tools-list">
          {topTools.map((tool, index) => (
            <div key={index} className="tool-item">
              <span className="tool-name">{tool.name}</span>
              <div className="tool-usage">
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar"
                    style={{ 
                      width: `${tool.percentage}%`,
                      background: '#6366f1'
                    }}
                  />
                </div>
                <span className="tool-percentage">{tool.percentage.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
