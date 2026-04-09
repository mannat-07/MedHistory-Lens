# MedHistory Lens - Complete Setup & Run Guide

## ✅ Project Status

### Phase 1: Frontend ✓ COMPLETED
- API infrastructure ready
- Auth context setup
- All components refactored for API integration
- Hardcoded data removed

### Phase 2: Backend ✓ COMPLETE - READY TO RUN
- FastAPI application scaffold
- Database models (SQLAlchemy)
- All API endpoints implemented
- AI service with symptom analysis
- Health metrics calculations
- Chat history management
- Authentication layer

---

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+ with npm/pnpm
- Docker & Docker Compose (for PostgreSQL)

### Step 1: Start PostgreSQL Database
```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL on port 5432 (database)
- Redis on port 6379 (optional caching)

### Step 2: Install & Run Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

Backend will be available at: `http://localhost:8000`

Visit `http://localhost:8000/docs` for interactive API docs.

### Step 3: Install & Run Frontend
```bash
cd src  # or root directory depending on structure
npm install
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## 📝 Configuration

### Backend Environment
Create `.env` in `backend/` folder (copy from `.env.example`):
```
DATABASE_URL=postgresql://medhistory:password@localhost:5432/medhistory_db
SECRET_KEY=your-secret-key-here
API_HOST=0.0.0.0
API_PORT=8000
```

### Frontend Environment
Create `.env.local` in project root:
```
VITE_API_URL=http://localhost:8000/api
```

---

## 🔌 Integration Points

The frontend expects these headers for each API call:

```javascript
// Example fetch with authentication
headers: {
  "Content-Type": "application/json",
  "X-User-ID": "1",  // User ID from login
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

## 📚 API Endpoints Summary

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Dashboard
- `GET /api/dashboard` - Get metrics, trends, risks, alerts

### Health Data
- `GET /api/health/blood|heart|organs|nutrition` - Get category data
- `POST /api/health/metrics` - Add new test results

### AI Features
- `POST /api/predictions` - Symptom analysis
- `POST /api/chat` - Send health question
- `GET /api/chat/history` - Get chat messages
- `GET /api/diet-plan` - Generate diet plan

---

## 🧪 Testing the API

### 1. Create a Test User
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

Response will include `access_token` and `user.id`.

### 2. Add Sample Health Data
```bash
curl -X POST http://localhost:8000/api/health/metrics \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "test_date": "2024-01-15",
    "glucose": 110,
    "hba1c": 6.8,
    "total_cholesterol": 220,
    "ldl_cholesterol": 155,
    "hdl_cholesterol": 40,
    "wbc": 7.5,
    "rbc": 4.9,
    "hemoglobin": 14.2,
    "platelets": 250,
    "vitamin_d": 18,
    "vitamin_b12": 450,
    "iron": 85
  }'
```

### 3. Get Dashboard Data
```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "X-User-ID: 1"
```

Expected response:
```json
{
  "glucose": 110,
  "hba1c": "6.8%",
  "cholesterol": 220,
  "diabetesRisk": 45,
  "heartDiseaseRisk": 55,
  "trends": [...],
  "alerts": [...]
}
```

### 4. Login from Frontend

1. Go to `http://localhost:5173/signin`
2. Enter: `test@example.com` / `password123`
3. Should redirect to dashboard with data

---

## 🤖 AI Features

### Symptom Analysis
```bash
curl -X POST http://localhost:8000/api/predictions \
  -H "X-User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": ["fatigue", "thirst", "frequent urination"]
  }'
```

### Chat with AI
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "X-User-ID: 1" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Why is my HbA1c elevated?"
  }'
```

### Get Diet Plan
```bash
curl -X GET http://localhost:8000/api/diet-plan \
  -H "X-User-ID: 1"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is already in use
lsof -ti:8000 | xargs kill -9

# Reinstall dependencies
cd backend
pip install -r requirements.txt --force-reinstall
```

### Database connection failed
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View logs
docker logs medhistory_postgres

# Restart containers
docker-compose restart
```

### Frontend can't reach backend
1. Check backend is running: `curl http://localhost:8000/`
2. Check VITE_API_URL in `.env.local`
3. Browser console may show CORS errors - see below

### CORS Errors
The backend already has CORS enabled for `localhost` URLs. If you get CORS errors:
1. Check that X-User-ID header is being sent
2. Modify `main.py` `allow_origins` if testing on different port

### Module import errors
```bash
# Update Python path
export PYTHONPATH="${PYTHONPATH}:/path/to/backend"
```

---

## 📊 Database Schema

### Users Table
- `id`: User ID
- `email`: Email address (unique)
- `password_hash`: Hashed password
- `name`: User full name
- `created_at`: Registration timestamp

### Health Metrics Table
- `id`: Metric ID
- `user_id`: FK to Users
- `test_date`: Date of test
- `glucose`, `hba1c`, cholesterol levels, etc.
- Created automatically on first run

### Chat Messages Table
- `id`: Message ID
- `user_id`: FK to Users
- `role`: "user" or "ai"
- `content`: Message text
- `created_at`: Timestamp

### Predictions Table
- `id`: Prediction ID
- `user_id`: FK to Users
- `symptoms`: Array of symptoms analyzed
- `diseases`: JSON array of predictions
- `prediction_date`: Date of analysis

---

## 🚢 Deployment

### Backend Deployment (Heroku example)
```bash
cd backend
heroku login
heroku create medhistory-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

### Frontend Deployment (Vercel example)
```bash
cd src
npm install -g vercel
vercel
```

Set `VITE_API_URL` in Vercel environment variables to your deployed backend URL.

---

## 📝 Next Steps

### Short Term (This Week)
- [ ] Test all API endpoints
- [ ] Fix any frontend/backend integration issues
- [ ] Add file upload for CSV/PDF reports
- [ ] Polish UI/UX

### Medium Term (Next 2 Weeks)
- [ ] Add user profile management
- [ ] Implement better AI responses
- [ ] Add data export (PDF reports)
- [ ] Performance optimization

### Long Term
- [ ] Mobile app
- [ ] Doctor/Provider portal
- [ ] Real medical device integration
- [ ] Analytics & insights dashboard
- [ ] Prescription management

---

## 📞 Support

For issues or questions:
1. Check `backend/README.md` for backend-specific setup
2. Check `BACKEND_ARCHITECTURE.md` for design details
3. Check API docs at `http://localhost:8000/docs`
4. Check browser console for frontend errors

---

## 🎯 Key Files to Know

**Frontend:**
- `src/app/App.tsx` - Main app component
- `src/context/AuthContext.tsx` - Authentication state
- `src/utils/api.ts` - API client
- `src/hooks/useData.ts` - Health data hooks
- `.env.local` - Frontend config

**Backend:**
- `backend/main.py` - FastAPI entry point
- `backend/app/models.py` - Database models
- `backend/app/routes/` - API endpoints
- `backend/app/services/` - Business logic
- `backend/.env` - Backend config

---

**System is now ready for Phase 3: Integration & Testing!** 🎉
