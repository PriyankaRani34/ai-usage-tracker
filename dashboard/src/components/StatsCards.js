import React from 'react';
import './StatsCards.css';

function StatsCards({ summary, formatDuration }) {
  if (!summary) return null;

  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">📱</div>
        <div className="stat-content">
          <div className="stat-value">{summary.device_count || 0}</div>
          <div className="stat-label">Devices</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🔧</div>
        <div className="stat-content">
          <div className="stat-value">{summary.service_count || 0}</div>
          <div className="stat-label">AI Services</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">⏱️</div>
        <div className="stat-content">
          <div className="stat-value">{formatDuration(summary.total_duration || 0)}</div>
          <div className="stat-label">Total Time</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-value">{summary.total_requests || 0}</div>
          <div className="stat-label">Total Requests</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">💬</div>
        <div className="stat-content">
          <div className="stat-value">{summary.total_sessions || 0}</div>
          <div className="stat-label">Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
