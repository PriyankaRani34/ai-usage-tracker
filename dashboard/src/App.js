import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import StatsCards from './components/StatsCards';
import DeviceUsage from './components/DeviceUsage';
import ServiceUsage from './components/ServiceUsage';
import UsageChart from './components/UsageChart';
import TimePeriodSelector from './components/TimePeriodSelector';
import UserProfile from './components/UserProfile';
import CognitiveHealth from './components/CognitiveHealth';
import BrainImpact from './components/BrainImpact';
import TaskSuggestions from './components/TaskSuggestions';
import UserMenu from './components/UserMenu';
import OverviewTab from './components/OverviewTab';
import CognitiveImpactTab from './components/CognitiveImpactTab';
import RecommendationsTab from './components/RecommendationsTab';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function App() {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileUpdated, setProfileUpdated] = useState(0);
  const [userProfile, setUserProfile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId') || null;
      const userIdParam = userId && userId !== 'default-user' ? `&userId=${userId}` : '';
      
      const [summaryRes, statsRes, devicesRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/usage/summary?period=${period}${userIdParam}`),
        axios.get(`${API_URL}/usage/stats?period=${period}${userIdParam}`),
        axios.get(`${API_URL}/devices`),
        axios.get(`${API_URL}/services`)
      ]);

      setSummary(summaryRes.data);
      setStats(statsRes.data);
      setDevices(devicesRes.data);
      setServices(servicesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      // Don't fail silently - show error to user
      if (error.message && error.message.includes('Network Error')) {
        console.warn('Backend not connected. Set REACT_APP_API_URL in Vercel environment variables.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    loadUserProfile();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds for more real-time updates
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const loadUserProfile = async () => {
    const userId = localStorage.getItem('userId') || 'default-user';
    if (userId && userId !== 'default-user') {
      try {
        const response = await axios.get(`${API_URL}/user/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error) {
        // Profile doesn't exist
      }
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="tracker-header">
          <div className="tracker-left">
            <span className="tracker-icon">🧠⚙️</span>
            <div className="tracker-title-section">
              <h1>AI Awareness Tracker</h1>
              {userProfile && userProfile.age && (
                <div className="age-display">
                  Age: {userProfile.age} years
                  <button className="change-age-btn" onClick={() => {
                    const menu = document.querySelector('.user-menu-button');
                    if (menu) menu.click();
                  }}>
                    ⚙️ Change Age
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="tracker-right">
            <UserMenu onProfileUpdate={() => {
              setProfileUpdated(prev => prev + 1);
              loadUserProfile();
            }} />
          </div>
        </div>
      </header>

      <div className="container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            {activeTab === 'overview' && <span className="tab-icon">🧠⚙️</span>}
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'cognitive-impact' ? 'active' : ''}`}
            onClick={() => setActiveTab('cognitive-impact')}
          >
            {activeTab === 'cognitive-impact' && <span className="tab-icon">🧠⚙️</span>}
            Cognitive Impact
          </button>
          <button 
            className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            Recommendations
          </button>
          <button 
            className={`tab ${activeTab === 'learn-more' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn-more')}
          >
            Learn More
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <OverviewTab 
                summary={summary} 
                stats={stats} 
                devices={devices} 
                formatDuration={formatDuration}
                userId={localStorage.getItem('userId') || 'default-user'}
              />
            )}
          </>
        )}

        {activeTab === 'cognitive-impact' && (
          <CognitiveImpactTab 
            userId={localStorage.getItem('userId') || 'default-user'}
            key={`${profileUpdated}-${summary?.total_duration || 0}`}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsTab 
            userId={localStorage.getItem('userId') || 'default-user'}
            key={profileUpdated}
          />
        )}

        {activeTab === 'learn-more' && (
          <TaskSuggestions key={profileUpdated} />
        )}
      </div>
    </div>
  );
}

export default App;
