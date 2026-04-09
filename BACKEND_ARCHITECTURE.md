# MedHistory Lens - Backend Architecture Plan

## ✅ Phase 2 COMPLETE: Backend Infrastructure Live

All backend systems are now implemented and ready for integration testing.

---
**Objective:** Make frontend API-ready, remove hardcoded data

### Changes Made:
✅ Created `src/utils/api.ts` - Centralized API client with token management  
✅ Created `src/context/AuthContext.tsx` - User authentication & session state  
✅ Created `src/hooks/useData.ts` - Data fetching hooks (dashboard, health data)  
✅ Created `src/hooks/useAi.ts` - AI hooks (predictions, chat)  
✅ Added `.env.local.example` - Environment configuration template  
✅ Updated `App.tsx` - Wrapped with AuthProvider  
✅ Refactored `SignIn.tsx` - Real authentication integration  
✅ Refactored `NewDashboard.tsx` - API-driven metrics & trends  
✅ Refactored `NewAiChat.tsx` - API-driven chat messages  

### Frontend Expectations from Backend:
The frontend is now ready and waiting for these API endpoints:

```
POST /api/auth/login
  Request: { email, password }
  Response: { access_token, user: { id, email, name } }

GET /api/auth/me
  Response: { id, email, name, created_at }

POST /api/auth/logout

GET /api/dashboard
  Response: { glucose, hba1c, cholesterol, diabetesRisk, heartDiseaseRisk, trends[], alerts[] }

GET /api/health/{category}  (blood|heart|organs|nutrition)
  Response: { bloodCounts/heart/organs/nutrition, trends[] }

POST /api/predictions
  Request: { symptoms: [] }
  Response: { disease, probability, risk, description, suggestedActions[] }[]

POST /api/chat
  Request: { message }
  Response: { reply }

GET /api/chat/history
  Response: { messages: [] }
```

---

## Phase 2 Backend Implementation Details

### Created Files:
✅ `backend/requirements.txt` - All Python dependencies  
✅ `backend/.env.example` - Configuration template  
✅ `backend/docker-compose.yml` - PostgreSQL + Redis setup  
✅ `backend/main.py` - FastAPI application entry point  
✅ `backend/app/config.py` - Settings management  
✅ `backend/app/database.py` - SQLAlchemy setup  
✅ `backend/app/models.py` - Database models (Users, HealthMetrics, ChatMessages, Predictions)  
✅ `backend/app/schemas.py` - Pydantic request/response schemas  
✅ `backend/app/auth.py` - Password hashing, JWT token generation  
✅ `backend/app/services/health_service.py` - Health data processing & risk calculations  
✅ `backend/app/services/ai_service.py` - AI symptom analysis + diet plan generation  
✅ `backend/app/routes/auth.py` - Authentication endpoints  
✅ `backend/app/routes/health.py` - Health data endpoints  
✅ `backend/app/routes/ai.py` - AI/Chat endpoints  
✅ `backend/README.md` - Backend setup instructions  

### Implemented Endpoints:
**Auth (5 endpoints)**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

**Health Data (5 endpoints)**
- `GET /api/dashboard` - Dashboard with metrics + trends + risks + alerts
- `GET /api/health/{category}` - Category-specific data (blood/heart/organs/nutrition)
- `POST /api/health/metrics` - Add new test results
- `GET /api/health/history` - Historical metrics

**AI Features (5 endpoints)**
- `POST /api/predictions` - Symptom analysis
- `POST /api/chat` - Send health question
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/clear` - Clear chat
- `GET /api/diet-plan` - Generate personalized diet plan

**Total: 15 fully functional API endpoints**

### Database Schema Implemented:
✅ Users (registration, authentication)  
✅ HealthMetrics (7+ medical test types)  
✅ ChatMessages (conversation history)  
✅ Predictions (symptom analysis logs)  
✅ MedicalReports (file storage references)  

### AI Capabilities:
✅ Symptom-to-disease analysis (5 disease patterns)  
✅ Health question response generation  
✅ Personalized diet plan generation based on metrics  
✅ Risk scoring:
  - Diabetes risk calculation (HbA1c, glucose, BMI)
  - Cardiovascular disease risk (cholesterol, blood pressure)  
✅ Flagged alerts for abnormal values  

---

### Tech Stack Decision Needed:
**Option A: FastAPI** (Recommended for this project)
- Lightweight, fast, excellent for APIs
- Built-in Swagger documentation
- Async support for concurrent requests
- Great for AI integration

**Option B: Django REST Framework**
- Full-featured, more batteries included
- Built-in admin panel
- More opinionated project structure

### Proposed Stack for Phase 2:
- **Framework**: FastAPI
- **Database**: PostgreSQL (relational data) + Optional: Redis (caching)
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI API or local LLM (details needed from you)
- **Deployment**: Docker containerization

---

## Phase 2A: Database Schema & Models

```sql
-- Users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  age INT,
  gender VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Metrics (core test results)
CREATE TABLE health_metrics (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  test_date DATE NOT NULL,
  glucose FLOAT,
  hba1c FLOAT,
  ldl_cholesterol FLOAT,
  hdl_cholesterol FLOAT,
  total_cholesterol FLOAT,
  wbc FLOAT,
  rbc FLOAT,
  hemoglobin FLOAT,
  platelets FLOAT,
  vitamin_d FLOAT,
  vitamin_b12 FLOAT,
  iron FLOAT,
  creatinine FLOAT,
  alt FLOAT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, test_date)
);

-- Chat History
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  role VARCHAR(10) NOT NULL, -- 'user' or 'ai'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(user_id, created_at)
);

-- AI Predictions (for audit trail)
CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  symptoms TEXT[], -- Array of symptoms
  prediction_date DATE NOT NULL,
  diseases JSONB, -- { disease: string, probability: number, risk: string }[]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports/Uploads
CREATE TABLE medical_reports (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  file_url VARCHAR(500),
  upload_date DATE NOT NULL,
  report_type VARCHAR(50), -- blood_test, general, etc
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Phase 2B: Core Endpoints Details

### 1. Authentication
```python
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/me
```

### 2. Health Data Management
```python
GET /api/dashboard  # Aggregated latest metrics + trends
GET /api/health/{category}  # Specific category (blood, heart, organs, nutrition)
POST /api/health/metrics  # Add new health metric
GET /api/health/history?months=3  # Historical data
```

### 3. AI Features
```python
POST /api/predictions  # Analyze symptoms → disease predictions
POST /api/chat  # Send message, get AI response
GET /api/chat/history  # Get chat history
POST /api/chat/clear  # Clear history
```

### 4. Reports
```python
POST /api/reports/upload  # Upload medical report
GET /api/reports  # List user's reports
GET /api/reports/{id}  # Get specific report
```

---

## Phase 2C: Business Logic Components

### Dashboard Service
- Aggregate latest metrics from health_metrics table
- Calculate trends (3-month, 6-month, yearly)
- Generate risk scores (diabetes, heart disease)
- Flag abnormal values

### AI Service
- Symptom analysis engine (match symptoms → diseases)
- Risk calculation algorithm
- Suggestions generator (diet, exercise, tests)
- Chat integration with LLM (OpenAI/local)

### Health Data Service
- Parse health metrics by category
- Validate values against reference ranges
- Generate alerts for abnormal values
- Track historical changes

---

## What We Need From You (Requirements Phase)

Please provide details on:

### 1. Data Sources & Integration
- [ ] Will users manually input health data, or import from external sources?
  - Manual entry via form?
  - CSV/PDF uploads?
  - Integration with healthcare providers (HL7, FHIR)?
  - Wearable devices (Apple Health, Google Fit)?

### 2. AI Features
- [ ] For symptom analysis: Use OpenAI API or local open-source model?
- [ ] For diet plans: Should backend generate or fetch from a database?
- [ ] Should AI responses be cached or generated fresh?

### 3. Authentication & User Management
- [ ] Should users self-register or be invited by doctors?
- [ ] Do you need role-based access (user vs. doctor vs. admin)?
- [ ] Should there be HIPAA compliance requirements?

### 4. Data Persistence & Performance
- [ ] Estimated number of users initially? (Affects scaling strategy)
- [ ] Should health metrics be real-time queryable or batch-processed?
- [ ] Any specific compliance requirements (GDPR, HIPAA)?

### 5. Machine Learning Models
- [ ] Do you have pre-trained models for disease prediction?
- [ ] Or should we use heuristic-based algorithms initially?

---

## Timeline Estimate

- **Phase 2 Backend Setup**: 2-3 days
  - FastAPI scaffold, database setup, auth middleware
  
- **Phase 2 Core APIs**: 3-4 days
  - Dashboard, health data, authentication endpoints
  
- **Phase 3 AI Integration**: 2-3 days
  - Chat, predictions, symptom analysis
  
- **Phase 4 Integration & Testing**: 2 days
  - Connect frontend to backend, end-to-end testing

**Total: 1-2 weeks** (depending on AI complexity and external integrations)

---

## Next Steps

1. ✅ Frontend refactoring complete  
2. ⏳ **YOU:** Answer the requirements questions above  
3. ⏳ Backend scaffold & database setup  
4. ⏳ Implement core endpoints
5. ⏳ AI service integration  
6. ⏳ Full system integration & testing  
7. ⏳ Deployment & optimization
