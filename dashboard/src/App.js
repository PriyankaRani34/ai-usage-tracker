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
import LoginPage from './components/LoginPage';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState([]);
  const [devices, setDevices] = useState([]);
  const [services, setServices] = useState([]);
  const [period, setPeriod] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileUpdated, setProfileUpdated] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      // Validate session
      axios.get(`${API_URL}/auth/user/${userId}`)
        .then(response => {
          setUser(response.data);
          setIsAuthenticated(true);
          setUserProfile(response.data);
        })
        .catch(() => {
          // Session invalid, clear storage
          localStorage.removeItem('userId');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          localStorage.removeItem('userAge');
        });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setUserProfile(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAge');
    setUser(null);
    setIsAuthenticated(false);
    setUserProfile(null);
    setSummary(null);
    setStats([]);
    setDevices([]);
    setServices([]);
  };

  const fetchData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      setApiError(null);
      const userId = localStorage.getItem('userId');
      if (!userId) return;
      
      const userIdParam = `&userId=${userId}`;
      
      const [summaryRes, statsRes, devicesRes, servicesRes] = await Promise.allSettled([
        axios.get(`${API_URL}/usage/summary?period=${period}${userIdParam}`),
        axios.get(`${API_URL}/usage/stats?period=${period}${userIdParam}`),
        axios.get(`${API_URL}/devices`),
        axios.get(`${API_URL}/services`)
      ]);

      // Handle each response, using defaults if failed
      setSummary(summaryRes.status === 'fulfilled' ? summaryRes.value.data : null);
      setStats(statsRes.status === 'fulfilled' ? statsRes.value.data : []);
      setDevices(devicesRes.status === 'fulfilled' ? devicesRes.value.data : []);
      setServices(servicesRes.status === 'fulfilled' ? servicesRes.value.data : []);

      // Check if all requests failed
      const allFailed = [summaryRes, statsRes, devicesRes, servicesRes].every(
        res => res.status === 'rejected'
      );
      
      if (allFailed) {
        const firstError = [summaryRes, statsRes, devicesRes, servicesRes].find(
          res => res.status === 'rejected'
        )?.reason;
        
        if (firstError) {
          if (firstError.message && firstError.message.includes('Network Error')) {
            setApiError('Backend not connected. Please check your REACT_APP_API_URL environment variable.');
          } else if (firstError.response) {
            setApiError(`API Error: ${firstError.response.status} ${firstError.response.statusText}`);
          } else {
            setApiError('Unable to connect to the backend API.');
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setApiError('An unexpected error occurred while loading data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
      loadUserProfile();
      const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds for more real-time updates
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period, isAuthenticated]);

  const loadUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      try {
        const response = await axios.get(`${API_URL}/user/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error) {
        // Profile doesn't exist - this is expected for new users
        console.log('User profile not found, will be created on first save');
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

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

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
            <UserMenu 
              onProfileUpdate={() => {
                setProfileUpdated(prev => prev + 1);
                loadUserProfile();
              }}
              onLogout={handleLogout}
            />
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
            ) : apiError ? (
              <div className="api-error">
                <div className="api-error-content">
                  <h2>⚠️ Connection Issue</h2>
                  <p>{apiError}</p>
                  <p className="api-error-hint">
                    Make sure your backend is running and the <code>REACT_APP_API_URL</code> environment variable is set correctly.
                  </p>
                  <button onClick={fetchData} className="retry-button">
                    Retry Connection
                  </button>
                </div>
              </div>
            ) : (
              <OverviewTab 
                summary={summary} 
                stats={stats} 
                devices={devices} 
                formatDuration={formatDuration}
                userId={localStorage.getItem('userId')}
                period={period}
              />
            )}
          </>
        )}

        {activeTab === 'cognitive-impact' && (
          <CognitiveImpactTab 
            userId={localStorage.getItem('userId')}
            key={`${profileUpdated}-${summary?.total_duration || 0}`}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsTab 
            userId={localStorage.getItem('userId')}
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
