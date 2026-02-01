# Cognitive Health Calculation Formulas

This document explains the mathematical functions used to calculate cognitive health impact based on AI usage.

## 1. Cognitive Health Scores Calculation

**Location:** `/server/index.js` - `POST /api/cognitive-health` endpoint

### Input
- `aiHours`: Total AI usage hours for the day (calculated from `usage_logs` table)

### Formulas

All scores are calculated on a **0-100 scale**, where:
- **100** = Best (no negative impact)
- **0** = Worst (maximum negative impact)

#### 1. Brain Activity Score
```javascript
brainActivityScore = Math.max(0, Math.min(100, 100 - (aiHours * 10)))
```
- **Formula:** `100 - (AI Hours × 10)`
- **Impact:** Each hour of AI usage reduces brain activity by 10 points
- **Example:** 
  - 0 hours = 100 (perfect)
  - 1 hour = 90
  - 5 hours = 50
  - 10+ hours = 0 (minimum)

#### 2. Cognitive Load Score
```javascript
cognitiveLoadScore = Math.min(100, aiHours * 15)
```
- **Formula:** `AI Hours × 15` (capped at 100)
- **Impact:** Measures cognitive dependency/load
- **Example:**
  - 0 hours = 0 (no load)
  - 1 hour = 15
  - 5 hours = 75
  - 6.67+ hours = 100 (maximum load)

#### 3. Memory Usage Score
```javascript
memoryUsageScore = Math.max(0, Math.min(100, 100 - (aiHours * 8)))
```
- **Formula:** `100 - (AI Hours × 8)`
- **Impact:** Each hour reduces memory engagement by 8 points
- **Example:**
  - 0 hours = 100
  - 1 hour = 92
  - 5 hours = 60
  - 12.5+ hours = 0

#### 4. Critical Thinking Score
```javascript
criticalThinkingScore = Math.max(0, Math.min(100, 100 - (aiHours * 12)))
```
- **Formula:** `100 - (AI Hours × 12)`
- **Impact:** Each hour reduces critical thinking engagement by 12 points
- **Example:**
  - 0 hours = 100
  - 1 hour = 88
  - 5 hours = 40
  - 8.33+ hours = 0

#### 5. Creativity Score
```javascript
creativityScore = Math.max(0, Math.min(100, 100 - (aiHours * 10)))
```
- **Formula:** `100 - (AI Hours × 10)`
- **Impact:** Each hour reduces creativity engagement by 10 points
- **Example:**
  - 0 hours = 100
  - 1 hour = 90
  - 5 hours = 50
  - 10+ hours = 0

### Summary Table

| Score | Formula | Impact Rate | Max Impact (hours) |
|-------|---------|-------------|-------------------|
| Brain Activity | `100 - (hours × 10)` | -10/hour | 10 hours |
| Cognitive Load | `hours × 15` | +15/hour | 6.67 hours |
| Memory Usage | `100 - (hours × 8)` | -8/hour | 12.5 hours |
| Critical Thinking | `100 - (hours × 12)` | -12/hour | 8.33 hours |
| Creativity | `100 - (hours × 10)` | -10/hour | 10 hours |

---

## 2. Brain Impact Analysis

**Location:** `/server/index.js` - `GET /api/brain-impact/:userId` endpoint

### Input
- `totalHours`: Total AI usage hours for the period (7d, 30d, etc.)
- `age`: User's age from profile
- `period`: Time period (1d, 7d, 30d)

### Calculation

#### Average Daily Hours
```javascript
avgDailyHours = period === '1d' 
  ? totalHours 
  : totalHours / (period === '7d' ? 7 : 30)
```

#### Age-Specific Impact Thresholds

The system uses different thresholds based on user age:

| Age Group | High Threshold | Medium Threshold | Rationale |
|-----------|---------------|------------------|-----------|
| **< 18 years** (Children/Teens) | 2 hours/day | 1 hour/day | Brain development phase - more vulnerable |
| **18-29 years** (Young Adults) | 4 hours/day | 2 hours/day | Higher cognitive reserve |
| **30-49 years** (Middle-Aged) | 3 hours/day | 1.5 hours/day | Moderate cognitive reserve |
| **50+ years** (Older Adults) | 2 hours/day | 1 hour/day | Higher risk of cognitive decline |

#### Impact Level Determination

```javascript
if (avgDailyHours >= highThreshold) {
  impactLevel = 'high'
} else if (avgDailyHours >= mediumThreshold) {
  impactLevel = 'medium'
} else {
  impactLevel = 'low'
}
```

### Risk Factors (Generated Based on Impact Level)

#### High Impact (≥ highThreshold)
- "Excessive AI dependency may reduce cognitive engagement"
- "Potential decline in problem-solving skills"
- "Reduced memory formation and retention"
- **Age < 18:** "Critical: May impact brain development in adolescents"
- **Age ≥ 50:** "Higher risk of cognitive decline in older adults"

#### Medium Impact (≥ mediumThreshold, < highThreshold)
- "Moderate AI dependency detected"
- "May affect critical thinking abilities"

#### Low Impact (< mediumThreshold)
- No specific risk factors (healthy usage level)

### Recommendations (Generated Based on Usage and Age)

**General Recommendations:**
- `Limit AI usage to {mediumThreshold} hours per day`
- `Engage in daily brain exercises (see suggested tasks)`
- `Practice tasks manually before using AI assistance`

**Age-Specific Recommendations:**

**For Age < 18:**
- "Prioritize learning fundamentals without AI"
- "Balance AI use with traditional learning methods"

**For Age ≥ 50:**
- "Focus on activities that maintain cognitive reserve"
- "Regular physical exercise to support brain health"

---

## 3. Data Flow

```
1. User logs AI usage → usage_logs table
2. Calculate daily AI hours from usage_logs
3. Apply formulas to calculate scores
4. Store in cognitive_health table
5. Calculate brain impact based on age + usage
6. Store in brain_impact table
7. Return to frontend for display
```

---

## 4. Example Calculation

### Scenario:
- **User Age:** 25 years
- **AI Usage:** 3.5 hours/day (average over 7 days)
- **Total Hours (7d):** 24.5 hours

### Step 1: Calculate Cognitive Health Scores
```javascript
aiHours = 3.5

brainActivityScore = 100 - (3.5 × 10) = 65
cognitiveLoadScore = 3.5 × 15 = 52.5
memoryUsageScore = 100 - (3.5 × 8) = 72
criticalThinkingScore = 100 - (3.5 × 12) = 58
creativityScore = 100 - (3.5 × 10) = 65
```

### Step 2: Calculate Brain Impact
```javascript
age = 25 (Young Adult)
highThreshold = 4 hours/day
mediumThreshold = 2 hours/day
avgDailyHours = 3.5 hours/day

// 3.5 >= 2 but < 4, so:
impactLevel = 'medium'
```

### Step 3: Generate Risk Factors
- "Moderate AI dependency detected"
- "May affect critical thinking abilities"

### Step 4: Generate Recommendations
- "Limit AI usage to 2 hours per day"
- "Engage in daily brain exercises"
- "Practice tasks manually before using AI assistance"

---

## 5. Notes

### Design Philosophy
- **Linear Decay Model:** Scores decrease linearly with usage (simple, predictable)
- **Age-Specific Thresholds:** Different age groups have different vulnerability levels
- **Preventive Approach:** Recommendations focus on maintaining healthy usage levels

### Limitations
- Current formulas are **simplified linear models**
- Real cognitive impact is more complex and varies by individual
- These formulas provide **indicative guidance**, not medical diagnosis

### Future Enhancements
- Consider non-linear decay models
- Add individual baseline adjustments
- Include usage pattern analysis (continuous vs. intermittent)
- Factor in type of AI usage (creative vs. analytical)

---

## 6. Code Location

**Main Calculation Functions:**
- File: `/server/index.js`
- Cognitive Health: Lines 522-630
- Brain Impact: Lines 672-821

**Database Tables:**
- `cognitive_health` - Stores daily scores
- `brain_impact` - Stores impact analysis
- `usage_logs` - Source data for calculations
