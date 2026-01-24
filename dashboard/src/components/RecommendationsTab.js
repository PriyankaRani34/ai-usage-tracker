import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RecommendationsTab.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function RecommendationsTab({ userId }) {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/brain-impact/${userId}?period=7d`).catch(() => ({ data: null }));
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recommendations-tab">
        <div className="loading">Loading recommendations...</div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="recommendations-tab">
        <div className="recommendations-header">
          <h2>Personalized Recommendations</h2>
          <p>Evidence-based strategies for mindful AI usage tailored to your age group.</p>
        </div>
        <div className="no-profile-message">
          <p>Please set up your profile with your age to see personalized recommendations.</p>
          <p>Click on your profile in the top right corner to set your age.</p>
        </div>
      </div>
    );
  }

  const dailyLimits = recommendations.recommendations?.filter(r => 
    r.toLowerCase().includes('limit') || 
    r.toLowerCase().includes('hour') ||
    r.toLowerCase().includes('break') ||
    r.toLowerCase().includes('ai-free')
  ) || [];

  const skillBuilding = recommendations.recommendations?.filter(r => 
    r.toLowerCase().includes('solve') ||
    r.toLowerCase().includes('write') ||
    r.toLowerCase().includes('practice') ||
    r.toLowerCase().includes('engage') ||
    r.toLowerCase().includes('manual')
  ) || [];

  return (
    <div className="recommendations-tab">
      <div className="recommendations-header">
        <h2>Personalized Recommendations</h2>
        <p>Evidence-based strategies for mindful AI usage tailored to your age group.</p>
      </div>

      <div className="recommendation-card">
        <div className="card-icon">⏰</div>
        <h3>Daily Limits</h3>
        <ul className="recommendations-list">
          {dailyLimits.length > 0 ? (
            dailyLimits.map((rec, index) => (
              <li key={index}>
                <span className="check-icon">✓</span>
                <span>{rec}</span>
              </li>
            ))
          ) : (
            <>
              <li>
                <span className="check-icon">✓</span>
                <span>Limit AI usage to 2-3 hours per day</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Take 10-minute breaks every hour when using AI tools</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Designate "AI-free" study hours for critical thinking exercises</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Use AI as a learning aid, not a replacement for understanding</span>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="recommendation-card">
        <div className="card-icon">🎯</div>
        <h3>Skill Building</h3>
        <ul className="recommendations-list">
          {skillBuilding.length > 0 ? (
            skillBuilding.map((rec, index) => (
              <li key={index}>
                <span className="check-icon">✓</span>
                <span>{rec}</span>
              </li>
            ))
          ) : (
            <>
              <li>
                <span className="check-icon">✓</span>
                <span>Solve math problems manually before checking with AI</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Write first drafts without AI assistance to develop writing skills</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Practice research skills using traditional methods alongside AI</span>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <span>Engage in creative projects that require original thinking</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

export default RecommendationsTab;
