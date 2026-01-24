import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BrainImpact.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function BrainImpact() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem('userId') || 'default-user');

  useEffect(() => {
    loadImpact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload when profile updates
  useEffect(() => {
    if (userId && userId !== 'default-user') {
      loadImpact();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadImpact = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/brain-impact/${userId}?period=7d`);
      setImpact(response.data);
    } catch (error) {
      console.error('Error loading brain impact:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (level) => {
    switch(level) {
      case 'high': return '#fa709a';
      case 'medium': return '#fee140';
      case 'low': return '#43e97b';
      default: return '#667eea';
    }
  };

  const getImpactIcon = (level) => {
    switch(level) {
      case 'high': return '⚠️';
      case 'medium': return '⚡';
      case 'low': return '✅';
      default: return '📊';
    }
  };

  if (loading) {
    return (
      <div className="brain-impact">
        <div className="loading">Analyzing brain impact...</div>
      </div>
    );
  }

  if (!impact) {
    return (
      <div className="brain-impact">
        <div className="no-data">
          <p>No data available. Please set up your profile and start tracking usage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="brain-impact">
      <h2>🧠 Brain Impact Analysis</h2>
      
      <div className="impact-overview">
        <div className="impact-level" style={{ borderColor: getImpactColor(impact.impact_level) }}>
          <div className="impact-icon">{getImpactIcon(impact.impact_level)}</div>
          <div className="impact-info">
            <h3>Impact Level: <span style={{ color: getImpactColor(impact.impact_level) }}>
              {impact.impact_level.toUpperCase()}
            </span></h3>
            <p>Based on your age ({impact.age} years) and AI usage patterns</p>
          </div>
        </div>

        <div className="usage-stats">
          <div className="stat-item">
            <div className="stat-value">{impact.avg_daily_hours?.toFixed(1) || 0}</div>
            <div className="stat-label">Hours/Day</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{impact.total_ai_hours?.toFixed(1) || 0}</div>
            <div className="stat-label">Total Hours (7 days)</div>
          </div>
        </div>
      </div>

      {impact.age_specific_notes && (
        <div className="age-notes">
          <h4>📋 Age-Specific Insights</h4>
          <p>{impact.age_specific_notes}</p>
        </div>
      )}

      {impact.risk_factors && impact.risk_factors.length > 0 && (
        <div className="risk-factors">
          <h4>⚠️ Risk Factors</h4>
          <ul>
            {impact.risk_factors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>
      )}

      {impact.recommendations && impact.recommendations.length > 0 && (
        <div className="recommendations">
          <h4>💡 Recommendations</h4>
          <ul>
            {impact.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BrainImpact;
