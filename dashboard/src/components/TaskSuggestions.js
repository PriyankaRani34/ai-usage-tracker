import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TaskSuggestions.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

function TaskSuggestions() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(localStorage.getItem('userId') || 'default-user');
  const [userAge, setUserAge] = useState(null);

  const loadUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/user/profile/${userId}`);
      if (response.data && response.data.age) {
        setUserAge(response.data.age);
      }
    } catch (error) {
      // Profile doesn't exist, that's okay
    }
  };

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks/suggestions`, {
        params: { age: userAge }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userAge !== null) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAge]);

  const openVideo = (url) => {
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="task-suggestions">
        <div className="loading">Loading task suggestions...</div>
      </div>
    );
  }

  return (
    <div className="task-suggestions">
      <h2>💪 Brain-Boosting Tasks</h2>
      <p className="subtitle">
        Engage in these activities to maintain cognitive health and reduce AI dependency
      </p>

      {tasks.length === 0 ? (
        <div className="no-tasks">
          <p>No tasks available. Check back later for suggestions.</p>
        </div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`difficulty-badge difficulty-${task.difficulty?.toLowerCase()}`}>
                  {task.difficulty}
                </span>
              </div>
              
              <p className="task-description">{task.description}</p>
              
              <div className="task-meta">
                <span className="meta-item">
                  <strong>Category:</strong> {task.category}
                </span>
                <span className="meta-item">
                  <strong>Duration:</strong> {task.duration_minutes} min
                </span>
              </div>

              <div className="task-benefits">
                <strong>🧠 Cognitive Benefits:</strong>
                <p>{task.cognitive_benefits}</p>
              </div>

              {task.video_url && (
                <button 
                  className="watch-video-btn"
                  onClick={() => openVideo(task.video_url)}
                >
                  📺 Watch Tutorial Video
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="task-info">
        <p>
          <strong>💡 Tip:</strong> Try to complete at least one brain-boosting task daily 
          to maintain cognitive health and reduce over-reliance on AI tools.
        </p>
      </div>
    </div>
  );
}

export default TaskSuggestions;
