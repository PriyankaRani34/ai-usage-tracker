import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function UserProfile({ onProfileUpdate }) {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    loadProfile();
    loadDevices();
  }, []);

  const loadProfile = async () => {
    const userId = localStorage.getItem('userId') || 'default-user';
    try {
      const response = await axios.get(`${API_URL}/user/profile/${userId}`);
      setProfile(response.data);
      setName(response.data.name || '');
      setAge(response.data.age || '');
      if (!response.data.age) {
        setShowModal(true);
      }
    } catch (error) {
      // Profile doesn't exist yet
      setShowModal(true);
      const userId = localStorage.getItem('userId') || 'default-user';
      localStorage.setItem('userId', userId);
    }
  };

  const loadDevices = async () => {
    try {
      const response = await axios.get(`${API_URL}/devices`);
      setDevices(response.data);
    } catch (error) {
      console.error('Error loading devices:', error);
    }
  };

  const saveProfile = async () => {
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      alert('Please enter a valid age (1-120)');
      return;
    }

    setLoading(true);
    setSaved(false);
    const userId = localStorage.getItem('userId') || 'default-user';
    localStorage.setItem('userId', userId);

    try {
      await axios.post(`${API_URL}/user/profile`, {
        id: userId,
        name: name || null,
        age: age ? parseInt(age) : null
      });

      // Link all existing devices to this user
      for (const device of devices) {
        if (!device.user_id) {
          try {
            await axios.post(`${API_URL}/devices/${device.id}/link-user`, {
              userId: userId
            });
          } catch (e) {
            console.error('Error linking device:', e);
          }
        }
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowModal(false);
      }, 2000);
      loadProfile();
      loadDevices();
      if (onProfileUpdate) {
        onProfileUpdate();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getAgeGroup = (age) => {
    if (!age) return 'Unknown';
    if (age < 18) return 'Adolescent';
    if (age < 30) return 'Young Adult';
    if (age < 50) return 'Adult';
    return 'Senior';
  };

  const getAgeGroupColor = (age) => {
    if (!age) return '#667eea';
    if (age < 18) return '#f093fb';
    if (age < 30) return '#4facfe';
    if (age < 50) return '#43e97b';
    return '#fee140';
  };

  if (showModal && !profile?.age) {
    return (
      <div className="profile-modal-overlay" onClick={() => {}}>
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
          <div className="profile-modal-header">
            <h2>👤 Create Your Profile</h2>
            <p>Set up your profile to get personalized cognitive health insights</p>
          </div>
          
          <div className="profile-modal-body">
            <div className="profile-avatar-section">
              <div className="profile-avatar" style={{ background: getAgeGroupColor(parseInt(age) || 30) }}>
                {name ? name.charAt(0).toUpperCase() : '👤'}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-name">
                <span className="label-icon">✏️</span>
                Name (Optional)
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="profile-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-age">
                <span className="label-icon">🎂</span>
                Age <span className="required">*</span>
              </label>
              <input
                id="profile-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
                min="1"
                max="120"
                className="profile-input"
              />
              <small className="form-hint">
                Your age helps us provide age-specific cognitive health insights and recommendations
              </small>
            </div>

            {age && (
              <div className="age-preview">
                <div className="age-badge" style={{ background: getAgeGroupColor(parseInt(age)) }}>
                  {getAgeGroup(parseInt(age))}
                </div>
                <p className="age-info">
                  {parseInt(age) < 18 
                    ? 'Children and adolescents need special attention to cognitive development'
                    : parseInt(age) >= 50
                    ? 'Maintaining cognitive health is especially important at this age'
                    : 'We\'ll track your cognitive health based on your AI usage patterns'}
                </p>
              </div>
            )}

            <div className="profile-actions">
              <button 
                onClick={saveProfile} 
                disabled={loading || !age || parseInt(age) < 1 || parseInt(age) > 120}
                className="profile-save-btn"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Profile...
                  </>
                ) : saved ? (
                  <>
                    <span>✓</span>
                    Profile Created!
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Create Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-card">
      <div className="profile-header">
        <div className="profile-avatar-large" style={{ background: getAgeGroupColor(profile?.age || 30) }}>
          {profile?.name ? profile.name.charAt(0).toUpperCase() : '👤'}
        </div>
        <div className="profile-info-section">
          <h3>{profile?.name || 'User'}</h3>
          <div className="profile-badges">
            <span className="age-badge-small" style={{ background: getAgeGroupColor(profile?.age || 30) }}>
              {profile?.age ? `${profile.age} years` : 'Age not set'}
            </span>
            <span className="group-badge">
              {getAgeGroup(profile?.age)}
            </span>
          </div>
        </div>
        <button className="edit-profile-btn" onClick={() => setShowModal(true)}>
          ✏️ Edit
        </button>
      </div>

      {showModal && profile && (
        <div className="profile-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h2>✏️ Edit Profile</h2>
            </div>
            
            <div className="profile-modal-body">
              <div className="form-group">
                <label htmlFor="edit-name">
                  <span className="label-icon">✏️</span>
                  Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="profile-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-age">
                  <span className="label-icon">🎂</span>
                  Age <span className="required">*</span>
                </label>
                <input
                  id="edit-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  className="profile-input"
                />
              </div>

              <div className="profile-actions">
                <button 
                  onClick={() => setShowModal(false)}
                  className="profile-cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveProfile} 
                  disabled={loading || !age}
                  className="profile-save-btn"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
