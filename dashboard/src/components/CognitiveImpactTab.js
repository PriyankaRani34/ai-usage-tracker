import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CognitiveImpactTab.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function CognitiveImpactTab({ userId }) {
  const [profile, setProfile] = useState(null);
  const [impact, setImpact] = useState(null);
  const [cognitiveHealth, setCognitiveHealth] = useState(null);
  const [usageSummary, setUsageSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds to sync with usage data
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load profile
      const profileRes = await axios.get(`${API_URL}/user/profile/${userId}`).catch(() => ({ data: null }));
      setProfile(profileRes.data);

      if (!profileRes.data || !profileRes.data.age) {
        setLoading(false);
        return;
      }

      // Get usage summary first to show actual hours
      const summaryRes = await axios.get(`${API_URL}/usage/summary?period=7d&userId=${userId}`).catch(() => ({ data: null }));
      setUsageSummary(summaryRes.data);

      // Calculate cognitive health based on actual usage (for today)
      const today = new Date().toISOString().split('T')[0];
      const healthRes = await axios.post(`${API_URL}/cognitive-health`, {
        userId,
        date: today
      }).catch(() => ({ data: null }));

      // Get brain impact analysis (uses actual usage data from last 7 days)
      const impactRes = await axios.get(`${API_URL}/brain-impact/${userId}?period=7d`).catch(() => ({ data: null }));

      setCognitiveHealth(healthRes.data?.metrics);
      setImpact(impactRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAgeGroup = (age) => {
    if (!age) return 'General';
    if (age < 18) return 'Youth (Under 18)';
    if (age < 30) return 'Young Adult (18-30)';
    if (age < 50) return 'Adult (30-50)';
    return 'Senior (50+)';
  };

  const getRiskLevel = (impactLevel, age, avgHours) => {
    if (!impactLevel) {
      // Calculate based on hours if no impact level
      if (age < 18) {
        if (avgHours >= 2) return { label: 'High Risk', color: '#ef4444' };
        if (avgHours >= 1) return { label: 'Moderate Risk', color: '#f59e0b' };
      } else if (age < 30) {
        if (avgHours >= 4) return { label: 'High Risk', color: '#ef4444' };
        if (avgHours >= 2) return { label: 'Moderate Risk', color: '#f59e0b' };
      } else if (age < 50) {
        if (avgHours >= 3) return { label: 'High Risk', color: '#ef4444' };
        if (avgHours >= 1.5) return { label: 'Moderate Risk', color: '#f59e0b' };
      } else {
        if (avgHours >= 2) return { label: 'High Risk', color: '#ef4444' };
        if (avgHours >= 1) return { label: 'Moderate Risk', color: '#f59e0b' };
      }
      return { label: 'Low Risk', color: '#10b981' };
    }

    if (age < 18 && impactLevel !== 'low') {
      return { label: 'High Risk', color: '#ef4444' };
    }
    if (impactLevel === 'high') {
      return { label: 'High Risk', color: '#ef4444' };
    }
    if (impactLevel === 'medium') {
      return { label: 'Moderate Risk', color: '#f59e0b' };
    }
    return { label: 'Low Risk', color: '#10b981' };
  };

  const getConcernsBasedOnUsage = (cognitiveHealth, avgHours, age) => {
    const concerns = [];

    if (!cognitiveHealth) return concerns;

    // Critical Thinking concerns
    if (cognitiveHealth.critical_thinking_score < 70) {
      concerns.push({
        type: 'Critical Thinking',
        icon: '🧠',
        color: '#8b5cf6',
        text: age < 18 
          ? 'Heavy AI reliance during formative years may impact development of problem-solving and analytical skills.'
          : 'Excessive AI dependency may reduce your ability to solve problems independently and think critically.'
      });
    }

    // Memory concerns
    if (cognitiveHealth.memory_usage_score < 70) {
      concerns.push({
        type: 'Memory',
        icon: '⚡',
        color: '#64748b',
        text: age < 18
          ? 'Outsourcing information retention to AI tools can affect long-term memory development and recall abilities.'
          : 'Over-reliance on AI for information may weaken your memory formation and retention capabilities.'
      });
    }

    // Creativity concerns
    if (cognitiveHealth.creativity_score < 70) {
      concerns.push({
        type: 'Creativity',
        icon: '💡',
        color: '#64748b',
        text: age < 18
          ? 'Over-dependence on AI-generated content may limit creative thinking and original idea generation.'
          : 'Relying too heavily on AI for creative tasks may reduce your ability to generate original ideas.'
      });
    }

    // Age-specific concerns
    if (age < 18 && avgHours >= 2) {
      concerns.push({
        type: 'Development',
        icon: '⚠️',
        color: '#ef4444',
        text: 'Critical: High AI usage during adolescence may impact brain development and cognitive skill formation.'
      });
    }

    return concerns;
  };

  if (loading) {
    return (
      <div className="cognitive-impact-tab">
        <div className="loading">Loading cognitive impact analysis...</div>
      </div>
    );
  }

  // Show default content if no profile
  if (!profile || !profile.age) {
    return (
      <div className="cognitive-impact-tab">
        <div className="age-group-card">
          <div className="card-header">
            <h2>General</h2>
            <span className="risk-tag" style={{ background: '#10b981' }}>
              Low Risk
            </span>
          </div>
          <p className="card-subtitle">Please set up your profile with your age to see personalized cognitive impact analysis.</p>
        </div>
        <div className="no-profile-message">
          <p>Click on your profile in the top right corner to set your age and get personalized insights.</p>
        </div>
      </div>
    );
  }

  const ageGroup = getAgeGroup(profile.age);
  
  // Calculate average daily hours from usage summary (7 days)
  const totalHours = usageSummary?.total_duration ? (usageSummary.total_duration / 3600) : 0;
  const avgDailyHours = totalHours / 7;
  
  // Use impact data if available, otherwise calculate from usage
  const avgHours = impact?.avg_daily_hours || avgDailyHours;
  const riskLevel = getRiskLevel(impact?.impact_level, profile.age, avgHours);
  
  // Get concerns based on actual cognitive health scores
  const concerns = cognitiveHealth 
    ? getConcernsBasedOnUsage(cognitiveHealth, avgHours, profile.age)
    : (impact?.risk_factors || []).map(rf => ({
        type: 'General',
        icon: '⚠️',
        color: '#64748b',
        text: rf
      }));

  return (
    <div className="cognitive-impact-tab">
      <div className="age-group-card">
        <div className="card-header">
          <h2>{ageGroup}</h2>
          <span className="risk-tag" style={{ background: riskLevel.color }}>
            {riskLevel.label}
          </span>
        </div>
        <p className="card-subtitle">Cognitive impact analysis for your age group based on your AI usage.</p>
        {avgHours > 0 && (
          <div className="usage-info">
            <p><strong>Your Average Daily AI Usage:</strong> {avgHours.toFixed(1)} hours</p>
            {cognitiveHealth && (
              <div className="health-scores-summary">
                <span>Brain Activity: {cognitiveHealth.brain_activity_score}/100</span>
                <span>Memory: {cognitiveHealth.memory_usage_score}/100</span>
                <span>Critical Thinking: {cognitiveHealth.critical_thinking_score}/100</span>
                <span>Creativity: {cognitiveHealth.creativity_score}/100</span>
              </div>
            )}
          </div>
        )}
      </div>

      {concerns.length > 0 && (
        <div className="concerns-section">
          <div className="section-header">
            <span className="warning-icon">⚠️</span>
            <h3>Potential Concerns</h3>
          </div>
          <div className="concerns-grid">
            {concerns.map((concern, index) => (
              <div key={index} className="concern-card">
                <div className="concern-icon" style={{ color: concern.color }}>
                  {concern.icon}
                </div>
                <div className="concern-content">
                  <h4>{concern.type} {concern.type === 'Critical Thinking' ? 'Development' : concern.type === 'Memory' ? 'Formation' : concern.type === 'Creativity' ? '& Originality' : ''}</h4>
                  <p>{concern.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="beneficial-section">
        <div className="section-header">
          <span className="benefit-icon">🛡️</span>
          <h3>Beneficial Uses</h3>
        </div>
        <div className="benefits-list">
          <div className="benefit-item">
            <span className="benefit-dot"></span>
            <p>Enhanced learning opportunities when used as a supplementary tool</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-dot"></span>
            <p>Access to diverse perspectives and information sources</p>
          </div>
          <div className="benefit-item">
            <span className="benefit-dot"></span>
            <p>Efficient problem-solving assistance for complex tasks</p>
          </div>
          {avgHours > 0 && avgHours < 2 && (
            <div className="benefit-item">
              <span className="benefit-dot"></span>
              <p>Your current usage level is within healthy limits for your age group</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CognitiveImpactTab;
