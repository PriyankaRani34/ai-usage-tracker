const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dashboard/build')));

// Initialize database
const dbPath = path.join(__dirname, '../data/ai_usage.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database schema
function initializeDatabase() {
  db.serialize(() => {
    // Devices table
    db.run(`CREATE TABLE IF NOT EXISTS devices (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      user_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES user_profiles(id)
    )`);

    // Add user_id column if it doesn't exist (migration)
    db.run(`ALTER TABLE devices ADD COLUMN user_id TEXT`, (err) => {
      // Ignore error if column already exists
    });

    // AI services table
    db.run(`CREATE TABLE IF NOT EXISTS ai_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Usage logs table
    db.run(`CREATE TABLE IF NOT EXISTS usage_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT NOT NULL,
      service_id INTEGER NOT NULL,
      duration_seconds INTEGER DEFAULT 0,
      request_count INTEGER DEFAULT 1,
      metadata TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (device_id) REFERENCES devices(id),
      FOREIGN KEY (service_id) REFERENCES ai_services(id)
    )`);

    // Insert default AI services if they don't exist
    const defaultServices = [
      { name: 'ChatGPT', category: 'Chat' },
      { name: 'Claude', category: 'Chat' },
      { name: 'GitHub Copilot', category: 'Code' },
      { name: 'Cursor', category: 'Code' },
      { name: 'Midjourney', category: 'Image' },
      { name: 'DALL-E', category: 'Image' },
      { name: 'Stable Diffusion', category: 'Image' },
      { name: 'Google Bard', category: 'Chat' },
      { name: 'Perplexity', category: 'Search' },
      { name: 'Other', category: 'General' }
    ];

    const stmt = db.prepare('INSERT OR IGNORE INTO ai_services (name, category) VALUES (?, ?)');
    defaultServices.forEach(service => {
      stmt.run(service.name, service.category);
    });
    stmt.finalize();

    // User profiles table
    db.run(`CREATE TABLE IF NOT EXISTS user_profiles (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      age INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add email and password columns if they don't exist (migration)
    db.run(`ALTER TABLE user_profiles ADD COLUMN email TEXT`, (err) => {
      // Ignore error if column already exists
    });
    db.run(`ALTER TABLE user_profiles ADD COLUMN password TEXT`, (err) => {
      // Ignore error if column already exists
    });

    // Cognitive health metrics table
    db.run(`CREATE TABLE IF NOT EXISTS cognitive_health (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date DATE NOT NULL,
      ai_usage_hours REAL DEFAULT 0,
      brain_activity_score INTEGER DEFAULT 100,
      cognitive_load_score INTEGER DEFAULT 0,
      memory_usage_score INTEGER DEFAULT 100,
      critical_thinking_score INTEGER DEFAULT 100,
      creativity_score INTEGER DEFAULT 100,
      notes TEXT,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES user_profiles(id)
    )`);

    // Brain impact analysis table
    db.run(`CREATE TABLE IF NOT EXISTS brain_impact (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      date DATE NOT NULL,
      total_ai_hours REAL DEFAULT 0,
      impact_level TEXT DEFAULT 'low',
      risk_factors TEXT,
      recommendations TEXT,
      UNIQUE(user_id, date),
      FOREIGN KEY (user_id) REFERENCES user_profiles(id)
    )`);

    // Task suggestions table
    db.run(`CREATE TABLE IF NOT EXISTS task_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT,
      difficulty TEXT,
      age_group TEXT,
      video_url TEXT,
      duration_minutes INTEGER,
      cognitive_benefits TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Insert default task suggestions
    const defaultTasks = [
      {
        title: 'Mental Math Practice',
        description: 'Practice arithmetic without a calculator to strengthen mental calculation',
        category: 'Mathematics',
        difficulty: 'Easy',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 15,
        cognitive_benefits: 'Improves working memory, number sense, and mental agility'
      },
      {
        title: 'Memory Palace Technique',
        description: 'Learn to use spatial memory to remember information',
        category: 'Memory',
        difficulty: 'Medium',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 20,
        cognitive_benefits: 'Enhances memory encoding, spatial reasoning, and recall'
      },
      {
        title: 'Creative Writing Exercise',
        description: 'Write a short story without AI assistance to boost creativity',
        category: 'Writing',
        difficulty: 'Medium',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 30,
        cognitive_benefits: 'Stimulates creativity, language processing, and narrative thinking'
      },
      {
        title: 'Puzzle Solving',
        description: 'Solve crosswords, sudoku, or logic puzzles',
        category: 'Problem Solving',
        difficulty: 'Medium',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 20,
        cognitive_benefits: 'Improves problem-solving, pattern recognition, and logical thinking'
      },
      {
        title: 'Learn a New Language',
        description: 'Practice vocabulary and grammar without translation tools',
        category: 'Language',
        difficulty: 'Hard',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 30,
        cognitive_benefits: 'Enhances cognitive flexibility, memory, and executive function'
      },
      {
        title: 'Meditation and Mindfulness',
        description: 'Practice focused attention and awareness exercises',
        category: 'Wellness',
        difficulty: 'Easy',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 15,
        cognitive_benefits: 'Reduces cognitive load, improves focus, and enhances mental clarity'
      },
      {
        title: 'Physical Exercise',
        description: 'Engage in aerobic exercise to boost brain function',
        category: 'Physical',
        difficulty: 'Medium',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 30,
        cognitive_benefits: 'Increases BDNF, improves blood flow to brain, enhances neuroplasticity'
      },
      {
        title: 'Reading Complex Texts',
        description: 'Read challenging books without summaries or AI assistance',
        category: 'Reading',
        difficulty: 'Medium',
        age_group: 'all',
        video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        duration_minutes: 45,
        cognitive_benefits: 'Strengthens comprehension, vocabulary, and critical thinking'
      }
    ];

    const taskStmt = db.prepare(`INSERT OR IGNORE INTO task_suggestions 
      (title, description, category, difficulty, age_group, video_url, duration_minutes, cognitive_benefits) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    defaultTasks.forEach(task => {
      taskStmt.run(
        task.title,
        task.description,
        task.category,
        task.difficulty,
        task.age_group,
        task.video_url,
        task.duration_minutes,
        task.cognitive_benefits
      );
    });
    taskStmt.finalize();
  });
}

// API Routes

// Register or update device
app.post('/api/devices', (req, res) => {
  const { id, name, type, userId } = req.body;
  
  if (!id || !name || !type) {
    return res.status(400).json({ error: 'Missing required fields: id, name, type' });
  }

  db.run(
    `INSERT INTO devices (id, name, type, user_id, last_seen) 
     VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET 
       name = excluded.name,
       type = excluded.type,
       user_id = COALESCE(excluded.user_id, user_id),
       last_seen = CURRENT_TIMESTAMP`,
    [id, name, type, userId || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, deviceId: id, userId: userId || null });
    }
  );
});

// Link device to user
app.post('/api/devices/:deviceId/link-user', (req, res) => {
  const { deviceId } = req.params;
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'Missing required field: userId' });
  }

  db.run(
    'UPDATE devices SET user_id = ? WHERE id = ?',
    [userId, deviceId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, message: 'Device linked to user' });
    }
  );
});

// Log AI usage
app.post('/api/usage', (req, res) => {
  const { deviceId, serviceName, durationSeconds, requestCount, metadata, userId } = req.body;

  if (!deviceId || !serviceName) {
    return res.status(400).json({ error: 'Missing required fields: deviceId, serviceName' });
  }

  // If userId is provided, link device to user
  if (userId) {
    db.run(
      'UPDATE devices SET user_id = ? WHERE id = ?',
      [userId, deviceId],
      (err) => {
        if (err) {
          console.error('Error linking device to user:', err);
        }
      }
    );
  }

  // Get or create service
  db.get('SELECT id FROM ai_services WHERE name = ?', [serviceName], (err, service) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let serviceId;
    if (service) {
      serviceId = service.id;
      insertUsageLog();
    } else {
      // Create new service
      db.run('INSERT INTO ai_services (name, category) VALUES (?, ?)', 
        [serviceName, 'General'], 
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          serviceId = this.lastID;
          insertUsageLog();
        }
      );
    }

    function insertUsageLog() {
      const metadataStr = metadata ? JSON.stringify(metadata) : null;
      db.run(
        `INSERT INTO usage_logs (device_id, service_id, duration_seconds, request_count, metadata)
         VALUES (?, ?, ?, ?, ?)`,
        [deviceId, serviceId, durationSeconds || 0, requestCount || 1, metadataStr],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          
          // Update device last_seen
          db.run('UPDATE devices SET last_seen = CURRENT_TIMESTAMP WHERE id = ?', [deviceId]);
          
          res.json({ success: true, logId: this.lastID });
        }
      );
    }
  });
});

// Get all devices
app.get('/api/devices', (req, res) => {
  db.all('SELECT * FROM devices ORDER BY last_seen DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get usage statistics
app.get('/api/usage/stats', (req, res) => {
  const { period = '7d', deviceId, serviceId, userId } = req.query;
  
  let dateFilter = '';
  switch(period) {
    case '1d':
      dateFilter = "timestamp >= datetime('now', '-1 day')";
      break;
    case '7d':
      dateFilter = "timestamp >= datetime('now', '-7 days')";
      break;
    case '30d':
      dateFilter = "timestamp >= datetime('now', '-30 days')";
      break;
    case 'all':
      dateFilter = '1=1';
      break;
    default:
      dateFilter = "timestamp >= datetime('now', '-7 days')";
  }

  let whereClause = `WHERE ${dateFilter}`;
  if (userId) {
    whereClause += ` AND d.user_id = '${userId}'`;
  }
  if (deviceId) {
    whereClause += ` AND ul.device_id = '${deviceId}'`;
  }
  if (serviceId) {
    whereClause += ` AND ul.service_id = ${serviceId}`;
  }

  const query = `
    SELECT 
      d.name as device_name,
      d.type as device_type,
      s.name as service_name,
      s.category as service_category,
      SUM(ul.duration_seconds) as total_duration,
      SUM(ul.request_count) as total_requests,
      COUNT(*) as session_count,
      DATE(ul.timestamp) as date
    FROM usage_logs ul
    JOIN devices d ON ul.device_id = d.id
    JOIN ai_services s ON ul.service_id = s.id
    ${whereClause}
    GROUP BY d.id, s.id, DATE(ul.timestamp)
    ORDER BY date DESC, total_duration DESC
  `;

  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get summary statistics
app.get('/api/usage/summary', (req, res) => {
  const { period = '7d', userId } = req.query;
  
  let dateFilter = '';
  switch(period) {
    case '1d':
      dateFilter = "timestamp >= datetime('now', '-1 day')";
      break;
    case '7d':
      dateFilter = "timestamp >= datetime('now', '-7 days')";
      break;
    case '30d':
      dateFilter = "timestamp >= datetime('now', '-30 days')";
      break;
    case 'month':
      dateFilter = "timestamp >= datetime('now', 'start of month')";
      break;
    case 'all':
      dateFilter = '1=1';
      break;
    default:
      dateFilter = "timestamp >= datetime('now', '-7 days')";
  }

  let joinClause = '';
  let whereClause = `WHERE ${dateFilter}`;
  if (userId) {
    joinClause = 'JOIN devices d ON ul.device_id = d.id';
    whereClause += ` AND d.user_id = '${userId}'`;
  }

  const query = `
    SELECT 
      COUNT(DISTINCT ul.device_id) as device_count,
      COUNT(DISTINCT ul.service_id) as service_count,
      SUM(ul.duration_seconds) as total_duration,
      SUM(ul.request_count) as total_requests,
      COUNT(*) as total_sessions
    FROM usage_logs ul
    ${joinClause}
    ${whereClause}
  `;

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row);
  });
});

// Get monthly usage breakdown by day
app.get('/api/usage/monthly', (req, res) => {
  const { userId, year, month } = req.query;
  
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const targetYear = year || new Date().getFullYear();
  const targetMonth = month || (new Date().getMonth() + 1);

  const query = `
    SELECT 
      DATE(ul.timestamp) as date,
      SUM(ul.duration_seconds) / 3600.0 as total_hours,
      SUM(ul.request_count) as total_requests,
      COUNT(DISTINCT ul.device_id) as device_count,
      COUNT(DISTINCT ul.service_id) as service_count
    FROM usage_logs ul
    JOIN devices d ON ul.device_id = d.id
    WHERE d.user_id = ?
      AND strftime('%Y', ul.timestamp) = ?
      AND strftime('%m', ul.timestamp) = ?
    GROUP BY DATE(ul.timestamp)
    ORDER BY date ASC
  `;

  db.all(query, [userId, targetYear.toString(), targetMonth.toString().padStart(2, '0')], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get services list
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM ai_services ORDER BY name', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// ========== AUTHENTICATION ENDPOINTS ==========

// Helper function to hash password
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Register new user
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, age } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  const userId = crypto.randomUUID();
  const hashedPassword = hashPassword(password);

  db.run(
    `INSERT INTO user_profiles (id, email, password, name, age) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, email, hashedPassword, name || null, age || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already registered' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true, 
        userId: userId,
        email: email,
        message: 'User registered successfully'
      });
    }
  );
});

// Login user
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const hashedPassword = hashPassword(password);

  db.get(
    'SELECT id, email, name, age FROM user_profiles WHERE email = ? AND password = ?',
    [email, hashedPassword],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      res.json({
        success: true,
        userId: user.id,
        email: user.email,
        name: user.name,
        age: user.age
      });
    }
  );
});

// Get user by ID (for session validation)
app.get('/api/auth/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  db.get(
    'SELECT id, email, name, age, created_at FROM user_profiles WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// ========== USER PROFILE ENDPOINTS ==========

// Create or update user profile
app.post('/api/user/profile', (req, res) => {
  const { id, name, age } = req.body;
  
  if (!id) {
    return res.status(400).json({ error: 'Missing required field: id' });
  }

  db.run(
    `INSERT INTO user_profiles (id, name, age, updated_at) 
     VALUES (?, ?, ?, CURRENT_TIMESTAMP)
     ON CONFLICT(id) DO UPDATE SET 
       name = COALESCE(excluded.name, name),
       age = COALESCE(excluded.age, age),
       updated_at = CURRENT_TIMESTAMP`,
    [id, name || null, age || null],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, userId: id });
    }
  );
});

// Get user profile
app.get('/api/user/profile/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM user_profiles WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    res.json(row);
  });
});

// ========== COGNITIVE HEALTH ENDPOINTS ==========

// Calculate and save cognitive health metrics
app.post('/api/cognitive-health', (req, res) => {
  const { userId, date } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'Missing required field: userId' });
  }

  const targetDate = date || new Date().toISOString().split('T')[0];
  
  // Calculate AI usage hours for the day
  const startOfDay = `${targetDate} 00:00:00`;
  const endOfDay = `${targetDate} 23:59:59`;
  
  // Get AI usage from all devices linked to this user
  // If no devices linked, get all usage (for backward compatibility)
  db.get(
    `SELECT COALESCE(SUM(ul.duration_seconds), 0) / 3600.0 as hours
     FROM usage_logs ul
     JOIN devices d ON ul.device_id = d.id
     WHERE (d.user_id = ? OR (d.user_id IS NULL AND NOT EXISTS (SELECT 1 FROM devices WHERE user_id = ?)))
     AND ul.timestamp >= ? AND ul.timestamp <= ?`,
    [userId, userId, startOfDay, endOfDay],
    (err, usageRow) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const aiHours = usageRow.hours || 0;
      
      // Calculate cognitive health scores based on AI usage
      // Higher AI usage = lower scores (more dependency)
      const brainActivityScore = Math.max(0, Math.min(100, 100 - (aiHours * 10)));
      const cognitiveLoadScore = Math.min(100, aiHours * 15);
      const memoryUsageScore = Math.max(0, Math.min(100, 100 - (aiHours * 8)));
      const criticalThinkingScore = Math.max(0, Math.min(100, 100 - (aiHours * 12)));
      const creativityScore = Math.max(0, Math.min(100, 100 - (aiHours * 10)));

      // Check if record exists
      db.get(
        'SELECT id FROM cognitive_health WHERE user_id = ? AND date = ?',
        [userId, targetDate],
        (err, existing) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          if (existing) {
            // Update existing record
            db.run(
              `UPDATE cognitive_health SET
               ai_usage_hours = ?,
               brain_activity_score = ?,
               cognitive_load_score = ?,
               memory_usage_score = ?,
               critical_thinking_score = ?,
               creativity_score = ?
               WHERE user_id = ? AND date = ?`,
              [aiHours, brainActivityScore, cognitiveLoadScore,
               memoryUsageScore, criticalThinkingScore, creativityScore,
               userId, targetDate],
              function(updateErr) {
                if (updateErr) {
                  return res.status(500).json({ error: updateErr.message });
                }
                res.json({
                  success: true,
                  metrics: {
                    ai_usage_hours: aiHours,
                    brain_activity_score: brainActivityScore,
                    cognitive_load_score: cognitiveLoadScore,
                    memory_usage_score: memoryUsageScore,
                    critical_thinking_score: criticalThinkingScore,
                    creativity_score: creativityScore
                  }
                });
              }
            );
          } else {
            // Insert new record
            db.run(
              `INSERT INTO cognitive_health 
               (user_id, date, ai_usage_hours, brain_activity_score, cognitive_load_score, 
                memory_usage_score, critical_thinking_score, creativity_score)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [userId, targetDate, aiHours, brainActivityScore, cognitiveLoadScore,
               memoryUsageScore, criticalThinkingScore, creativityScore],
              function(insertErr) {
                if (insertErr) {
                  return res.status(500).json({ error: insertErr.message });
                }
                res.json({
                  success: true,
                  metrics: {
                    ai_usage_hours: aiHours,
                    brain_activity_score: brainActivityScore,
                    cognitive_load_score: cognitiveLoadScore,
                    memory_usage_score: memoryUsageScore,
                    critical_thinking_score: criticalThinkingScore,
                    creativity_score: creativityScore
                  }
                });
              }
            );
          }
        }
      );
    }
  );
});

// Get cognitive health metrics
app.get('/api/cognitive-health/:userId', (req, res) => {
  const { userId } = req.params;
  const { period = '7d' } = req.query;
  
  let dateFilter = '';
  switch(period) {
    case '1d':
      dateFilter = "date >= date('now', '-1 day')";
      break;
    case '7d':
      dateFilter = "date >= date('now', '-7 days')";
      break;
    case '30d':
      dateFilter = "date >= date('now', '-30 days')";
      break;
    case 'all':
      dateFilter = '1=1';
      break;
    default:
      dateFilter = "date >= date('now', '-7 days')";
  }

  db.all(
    `SELECT * FROM cognitive_health 
     WHERE user_id = ? AND ${dateFilter}
     ORDER BY date DESC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    }
  );
});

// ========== BRAIN IMPACT ENDPOINTS ==========

// Calculate brain impact analysis
app.get('/api/brain-impact/:userId', (req, res) => {
  const { userId } = req.params;
  const { period = '7d' } = req.query;
  
  // Get user age
  db.get('SELECT age FROM user_profiles WHERE id = ?', [userId], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const age = user?.age || 30; // Default age if not set
    
    // Calculate total AI usage
    let dateFilter = '';
    switch(period) {
      case '1d':
        dateFilter = "timestamp >= datetime('now', '-1 day')";
        break;
      case '7d':
        dateFilter = "timestamp >= datetime('now', '-7 days')";
        break;
      case '30d':
        dateFilter = "timestamp >= datetime('now', '-30 days')";
        break;
      default:
        dateFilter = "timestamp >= datetime('now', '-7 days')";
    }

    // Get AI usage from all devices linked to this user
    // If no devices linked, get all usage (for backward compatibility)
    db.get(
      `SELECT COALESCE(SUM(ul.duration_seconds), 0) / 3600.0 as total_hours
       FROM usage_logs ul
       JOIN devices d ON ul.device_id = d.id
       WHERE (d.user_id = ? OR (d.user_id IS NULL AND NOT EXISTS (SELECT 1 FROM devices WHERE user_id = ?)))
       AND ${dateFilter}`,
      [userId, userId],
      (err, usageRow) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        const totalHours = usageRow.total_hours || 0;
        const avgDailyHours = period === '1d' ? totalHours : totalHours / (period === '7d' ? 7 : 30);
        
        // Calculate impact level based on age and usage
        let impactLevel = 'low';
        let riskFactors = [];
        let recommendations = [];

        // Age-specific impact thresholds
        let highThreshold, mediumThreshold;
        if (age < 18) {
          highThreshold = 2; // 2 hours/day for children/teens
          mediumThreshold = 1;
        } else if (age < 30) {
          highThreshold = 4; // 4 hours/day for young adults
          mediumThreshold = 2;
        } else if (age < 50) {
          highThreshold = 3; // 3 hours/day for middle-aged
          mediumThreshold = 1.5;
        } else {
          highThreshold = 2; // 2 hours/day for older adults
          mediumThreshold = 1;
        }

        if (avgDailyHours >= highThreshold) {
          impactLevel = 'high';
          riskFactors.push('Excessive AI dependency may reduce cognitive engagement');
          riskFactors.push('Potential decline in problem-solving skills');
          riskFactors.push('Reduced memory formation and retention');
          if (age < 18) {
            riskFactors.push('Critical: May impact brain development in adolescents');
          } else if (age >= 50) {
            riskFactors.push('Higher risk of cognitive decline in older adults');
          }
        } else if (avgDailyHours >= mediumThreshold) {
          impactLevel = 'medium';
          riskFactors.push('Moderate AI dependency detected');
          riskFactors.push('May affect critical thinking abilities');
        } else {
          impactLevel = 'low';
        }

        // Generate recommendations
        if (avgDailyHours > 0) {
          recommendations.push(`Limit AI usage to ${mediumThreshold} hours per day`);
          recommendations.push('Engage in daily brain exercises (see suggested tasks)');
          recommendations.push('Practice tasks manually before using AI assistance');
        }
        
        if (age < 18) {
          recommendations.push('Prioritize learning fundamentals without AI');
          recommendations.push('Balance AI use with traditional learning methods');
        } else if (age >= 50) {
          recommendations.push('Focus on activities that maintain cognitive reserve');
          recommendations.push('Regular physical exercise to support brain health');
        }

        // Save analysis
        const targetDate = new Date().toISOString().split('T')[0];
        db.get(
          'SELECT id FROM brain_impact WHERE user_id = ? AND date = ?',
          [userId, targetDate],
          (err, existing) => {
            if (err) {
              console.error('Error checking brain impact:', err);
            } else if (existing) {
              // Update existing
              db.run(
                `UPDATE brain_impact SET
                 total_ai_hours = ?,
                 impact_level = ?,
                 risk_factors = ?,
                 recommendations = ?
                 WHERE user_id = ? AND date = ?`,
                [totalHours, impactLevel, JSON.stringify(riskFactors), 
                 JSON.stringify(recommendations), userId, targetDate]
              );
            } else {
              // Insert new
              db.run(
                `INSERT INTO brain_impact (user_id, date, total_ai_hours, impact_level, risk_factors, recommendations)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, targetDate, totalHours, impactLevel, 
                 JSON.stringify(riskFactors), JSON.stringify(recommendations)]
              );
            }
          }
        );

        res.json({
          userId,
          age,
          period,
          total_ai_hours: totalHours,
          avg_daily_hours: avgDailyHours,
          impact_level: impactLevel,
          risk_factors: riskFactors,
          recommendations: recommendations,
          age_specific_notes: age < 18 
            ? 'Children and adolescents are more vulnerable to cognitive dependency'
            : age >= 50
            ? 'Older adults should prioritize cognitive maintenance activities'
            : 'Maintain balance between AI assistance and independent thinking'
        });
      }
    );
  });
});

// ========== TASK SUGGESTIONS ENDPOINTS ==========

// Get task suggestions
app.get('/api/tasks/suggestions', (req, res) => {
  const { age, difficulty, category } = req.query;
  
  let query = 'SELECT * FROM task_suggestions WHERE 1=1';
  const params = [];
  
  if (age) {
    const ageNum = parseInt(age);
    if (ageNum < 18) {
      query += " AND (age_group = 'all' OR age_group = 'young')";
    } else if (ageNum >= 50) {
      query += " AND (age_group = 'all' OR age_group = 'senior')";
    } else {
      query += " AND age_group = 'all'";
    }
  }
  
  if (difficulty) {
    query += ' AND difficulty = ?';
    params.push(difficulty);
  }
  
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY RANDOM() LIMIT 5';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
  db.all('SELECT * FROM task_suggestions ORDER BY category, title', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard/build/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`AI Usage Tracker server running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
