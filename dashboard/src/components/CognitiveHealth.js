import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './CognitiveHealth.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function CognitiveHealth() {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem('userId') || 'default-user');

  useEffect(() => {
    loadMetrics();
    // Calculate metrics for today
    calculateTodayMetrics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recalculate when profile updates
  useEffect(() => {
    if (userId && userId !== 'default-user') {
      calculateTodayMetrics();
      loadMetrics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const calculateTodayMetrics = async () => {
    try {
      await axios.post(`${API_URL}/cognitive-health`, {
        userId,
        date: new Date().toISOString().split('T')[0]
      });
      loadMetrics();
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/cognitive-health/${userId}?period=30d`);
      setMetrics(response.data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#43e97b';
    if (score >= 60) return '#fee140';
    return '#fa709a';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Attention';
  };

  const latestMetrics = metrics[0] || {};
  const avgMetrics = metrics.length > 0 
    ? metrics.reduce((acc, m) => ({
        brain_activity_score: acc.brain_activity_score + m.brain_activity_score,
        memory_usage_score: acc.memory_usage_score + m.memory_usage_score,
        critical_thinking_score: acc.critical_thinking_score + m.critical_thinking_score,
        creativity_score: acc.creativity_score + m.creativity_score
      }), { brain_activity_score: 0, memory_usage_score: 0, critical_thinking_score: 0, creativity_score: 0 })
    : {};

  if (metrics.length > 0) {
    Object.keys(avgMetrics).forEach(key => {
      avgMetrics[key] = Math.round(avgMetrics[key] / metrics.length);
    });
  }

  const chartData = metrics.slice(0, 7).reverse().map(m => ({
    date: m.date,
    'Brain Activity': m.brain_activity_score,
    'Memory': m.memory_usage_score,
    'Critical Thinking': m.critical_thinking_score,
    'Creativity': m.creativity_score
  }));

  return (
    <div className="cognitive-health">
      <h2>🧠 Cognitive Health Dashboard</h2>
      
      {loading ? (
        <div className="loading">Loading cognitive health data...</div>
      ) : metrics.length === 0 ? (
        <div className="no-data">
          <p>No cognitive health data yet. Start using AI services to see your metrics.</p>
          <button onClick={calculateTodayMetrics}>Calculate Today's Metrics</button>
        </div>
      ) : (
        <>
          <div className="health-scores">
            <div className="score-card">
              <div className="score-header">
                <h3>Brain Activity</h3>
                <span className="score-badge" style={{ background: getScoreColor(latestMetrics.brain_activity_score) }}>
                  {latestMetrics.brain_activity_score}/100
                </span>
              </div>
              <p className="score-label">{getScoreLabel(latestMetrics.brain_activity_score)}</p>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${latestMetrics.brain_activity_score}%`,
                    background: getScoreColor(latestMetrics.brain_activity_score)
                  }}
                />
              </div>
            </div>

            <div className="score-card">
              <div className="score-header">
                <h3>Memory Usage</h3>
                <span className="score-badge" style={{ background: getScoreColor(latestMetrics.memory_usage_score) }}>
                  {latestMetrics.memory_usage_score}/100
                </span>
              </div>
              <p className="score-label">{getScoreLabel(latestMetrics.memory_usage_score)}</p>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${latestMetrics.memory_usage_score}%`,
                    background: getScoreColor(latestMetrics.memory_usage_score)
                  }}
                />
              </div>
            </div>

            <div className="score-card">
              <div className="score-header">
                <h3>Critical Thinking</h3>
                <span className="score-badge" style={{ background: getScoreColor(latestMetrics.critical_thinking_score) }}>
                  {latestMetrics.critical_thinking_score}/100
                </span>
              </div>
              <p className="score-label">{getScoreLabel(latestMetrics.critical_thinking_score)}</p>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${latestMetrics.critical_thinking_score}%`,
                    background: getScoreColor(latestMetrics.critical_thinking_score)
                  }}
                />
              </div>
            </div>

            <div className="score-card">
              <div className="score-header">
                <h3>Creativity</h3>
                <span className="score-badge" style={{ background: getScoreColor(latestMetrics.creativity_score) }}>
                  {latestMetrics.creativity_score}/100
                </span>
              </div>
              <p className="score-label">{getScoreLabel(latestMetrics.creativity_score)}</p>
              <div className="score-bar">
                <div 
                  className="score-fill" 
                  style={{ 
                    width: `${latestMetrics.creativity_score}%`,
                    background: getScoreColor(latestMetrics.creativity_score)
                  }}
                />
              </div>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="health-chart">
              <h3>7-Day Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Brain Activity" stroke="#667eea" strokeWidth={2} />
                  <Line type="monotone" dataKey="Memory" stroke="#43e97b" strokeWidth={2} />
                  <Line type="monotone" dataKey="Critical Thinking" stroke="#f093fb" strokeWidth={2} />
                  <Line type="monotone" dataKey="Creativity" stroke="#fee140" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="ai-usage-info">
            <p><strong>Today's AI Usage:</strong> {
              latestMetrics.ai_usage_hours 
                ? `${Math.floor(latestMetrics.ai_usage_hours * 60)}m ${Math.round((latestMetrics.ai_usage_hours * 60) % 60)}s`
                : '0m 0s'
            }</p>
            <p><strong>Total Hours:</strong> {latestMetrics.ai_usage_hours?.toFixed(2) || '0.00'} hours</p>
            <p><strong>Cognitive Load Score:</strong> {latestMetrics.cognitive_load_score || 0}/100</p>
          </div>
        </>
      )}
    </div>
  );
}

export default CognitiveHealth;
