import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './UserMenu.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function UserMenu({ onProfileUpdate, onLogout }) {
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    loadProfile();
    
    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadProfile = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    
    try {
      const response = await axios.get(`${API_URL}/user/profile/${userId}`);
      setProfile(response.data);
    } catch (error) {
      // Profile doesn't exist - try to get from auth endpoint
      try {
        const authResponse = await axios.get(`${API_URL}/auth/user/${userId}`);
        setProfile(authResponse.data);
      } catch (authError) {
        // User not found
        console.log('User profile not found');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return '👤';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getAgeGroupColor = (age) => {
    if (!age) return '#667eea';
    if (age < 18) return '#f093fb';
    if (age < 30) return '#4facfe';
    if (age < 50) return '#43e97b';
    return '#fee140';
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your data will be saved.')) {
      if (onLogout) {
        onLogout();
      } else {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAge');
        window.location.reload();
      }
    }
  };

  const handleEditProfile = () => {
    setShowProfileModal(true);
    setShowMenu(false);
  };

  // Show menu with email if profile exists, or show placeholder
  const displayName = profile?.name || localStorage.getItem('userName') || localStorage.getItem('userEmail') || 'User';
  const displayAge = profile?.age || localStorage.getItem('userAge');

  return (
    <>
      <div className="user-menu-container" ref={menuRef}>
        <button 
          className="user-menu-button"
          onClick={() => setShowMenu(!showMenu)}
          aria-label="User menu"
        >
          <div 
            className="user-avatar-small"
            style={{ background: getAgeGroupColor(displayAge) }}
          >
            {getInitials(displayName)}
          </div>
          <span className="user-name">{displayName}</span>
          <svg 
            className={`menu-arrow ${showMenu ? 'open' : ''}`}
            width="12" 
            height="12" 
            viewBox="0 0 12 12"
          >
            <path d="M6 9L1 4h10z" fill="currentColor"/>
          </svg>
        </button>

        {showMenu && (
          <div className="user-menu-dropdown">
            <div className="user-menu-header">
              <div 
                className="user-avatar-large-menu"
                style={{ background: getAgeGroupColor(displayAge) }}
              >
                {getInitials(displayName)}
              </div>
              <div className="user-menu-info">
                <div className="user-menu-name">{displayName}</div>
                <div className="user-menu-email">
                  {displayAge ? `${displayAge} years old` : localStorage.getItem('userEmail') || 'No age set'}
                </div>
              </div>
            </div>

            <div className="user-menu-divider"></div>

            <button className="user-menu-item" onClick={handleEditProfile}>
              <span className="menu-icon">👤</span>
              <span>Edit Profile</span>
            </button>

            <button className="user-menu-item" onClick={() => {
              setShowMenu(false);
              window.location.hash = '#cognitive';
            }}>
              <span className="menu-icon">🧠</span>
              <span>Cognitive Health</span>
            </button>

            <button className="user-menu-item" onClick={() => {
              setShowMenu(false);
              window.location.hash = '#brain';
            }}>
              <span className="menu-icon">⚠️</span>
              <span>Brain Impact</span>
            </button>

            <button className="user-menu-item" onClick={() => {
              setShowMenu(false);
              window.location.hash = '#tasks';
            }}>
              <span className="menu-icon">💪</span>
              <span>Brain Tasks</span>
            </button>

            <div className="user-menu-divider"></div>

            <button className="user-menu-item" onClick={() => {
              setShowMenu(false);
              // Add settings functionality here
            }}>
              <span className="menu-icon">⚙️</span>
              <span>Settings</span>
            </button>

            <button className="user-menu-item logout" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {showProfileModal && (
        <UserProfileModal
          profile={profile}
          onClose={() => {
            setShowProfileModal(false);
            loadProfile();
            if (onProfileUpdate) {
              onProfileUpdate();
            }
          }}
        />
      )}
    </>
  );
}

function UserProfileModal({ profile, onClose }) {
  const [name, setName] = useState(profile?.name || '');
  const [age, setAge] = useState(profile?.age || '');
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    if (!age || parseInt(age) < 1 || parseInt(age) > 120) {
      alert('Please enter a valid age (1-120)');
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Not logged in');
      return;
    }

    try {
      await axios.post(`${API_URL}/user/profile`, {
        id: userId,
        name: name || null,
        age: age ? parseInt(age) : null
      });
      onClose();
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
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
              onClick={onClose}
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
  );
}

export default UserMenu;
