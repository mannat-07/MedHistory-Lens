# 📋 MedHistory Lens - Quick Reference Card

## 🚀 QUICK START (Copy-Paste Ready)

### Terminal 1: Start Database
```bash
cd backend
docker-compose up -d
```

### Terminal 2: Start Backend
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

### Terminal 3: Start Frontend
```bash
npm install
npm run dev
```

**Result**: 
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Swagger Docs: http://localhost:8000/docs

---

## 🔑 Default Login (After Signup)
```
Email: test@example.com
Password: test123
```

---

## 📍 Key URLs

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend App | http://localhost:5173 | React application |
| Backend API | http://localhost:8000 | FastAPI server |
| API Docs | http://localhost:8000/docs | Interactive API testing |
| API Redoc | http://localhost:8000/redoc | Alternative API docs |
| Database | localhost:5432 | PostgreSQL |

---

## 🔌 API Endpoints Summary

### Auth
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login with email/password
GET    /api/auth/me                Get current user
POST   /api/auth/logout            Logout
```

### Dashboard
```
GET    /api/dashboard              Get metrics + trends + risks + alerts
```

### Health Data by Category
```
GET    /api/health/blood           Get blood counts
GET    /api/health/heart           Get cholesterol data
GET    /api/health/organs          Get organ function metrics
GET    /api/health/nutrition       Get vitamin levels
POST   /api/health/metrics         Add new test results
GET    /api/health/history         Get historical data
```

### AI Features
```
POST   /api/predictions            Analyze symptoms
POST   /api/chat                   Send health question
GET    /api/chat/history           Get chat messages
GET    /api/diet-plan              Get personalized diet
```

---

## 📤 Required Headers for API Calls

```javascript
// For authenticated requests:
{
  "Content-Type": "application/json",
  "X-User-ID": "1",  // Get from login response
  "Authorization": "Bearer YOUR_JWT_TOKEN"  // Optional, recommended for production
}
```

---

## 💻 Example API Call

### Sign Up
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "myemail@example.com",
    "password": "mypassword",
    "name": "My Name"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "myemail@example.com",
    "password": "mypassword"
  }'
```

### Add Health Data
```bash
curl -X POST http://localhost:8000/api/health/metrics \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "test_date": "2024-01-15",
    "glucose": 110,
    "hba1c": 6.8,
    "total_cholesterol": 220,
    "wbc": 7.5
  }'
```

### Get Dashboard
```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "X-User-ID: 1"
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Port 5173 in use | Kill: `lsof -ti:5173 \| xargs kill -9` |
| Port 8000 in use | Kill: `lsof -ti:8000 \| xargs kill -9` |
| Database not running | Run: `docker-compose up -d` |
| Python modules missing | Run: `pip install -r requirements.txt` |
| CORS errors | Check API URL in `.env.local` |
| Frontend won't load | Clear browser cache, hard refresh (Ctrl+Shift+R) |

---

## 📁 Key Files to Edit

### Frontend Configuration
- `.env.local` - Set `VITE_API_URL=http://localhost:8000/api`

### Backend Configuration
- `backend/.env` - Set database URL, secret key, port

### Database Setup
- `backend/docker-compose.yml` - PostgreSQL credentials (default: medhistory/password)

---

## 🧪 Test Workflow

1. **Signup** → Enter email/password → Should redirect to dashboard
2. **Dashboard** → Should show "Loading..." then metrics
3. **Add Data** → Use API to add health metrics
4. **Dashboard** → Should show updated data
5. **Chat** → Ask a health question, get AI response
6. **Symptoms** → Select symptoms, get disease predictions
7. **Logout** → Should redirect to signin

---

## 📊 Data Sample for Testing

```json
{
  "test_date": "2024-01-15",
  "glucose": 110,
  "hba1c": 6.8,
  "ldl_cholesterol": 155,
  "hdl_cholesterol": 40,
  "total_cholesterol": 220,
  "wbc": 7.5,
  "rbc": 4.9,
  "hemoglobin": 14.2,
  "platelets": 250,
  "vitamin_d": 18,
  "vitamin_b12": 450,
  "iron": 85,
  "creatinine": 0.9,
  "alt": 35
}
```

---

## 🎯 Risk Thresholds

### Diabetes Risk
- 0-30%: Low
- 31-70%: Medium  
- 71-100%: High

### Heart Disease Risk
- 0-30%: Low
- 31-70%: Medium
- 71-100%: High

---

## 📞 Debug Commands

### Check if services are running
```bash
# Frontend
curl http://localhost:5173

# Backend
curl http://localhost:8000

# Database
psql postgresql://medhistory:password@localhost:5432/medhistory_db
```

### View logs
```bash
# Backend logs (terminal where it's running)
# Frontend logs (browser DevTools → Console)
# Database logs
docker logs medhistory_postgres
```

### View database data
```bash
# Connect to DB
psql postgresql://medhistory:password@localhost:5432/medhistory_db

# List tables
\dt

# View users
SELECT * FROM users;

# View health metrics
SELECT * FROM health_metrics;

# View chat messages
SELECT * FROM chat_messages;
```

---

## 🚀 Deployment Checklist

- [ ] Change `SECRET_KEY` in production
- [ ] Set `DEBUG=false` in `.env`
- [ ] Use PostgreSQL managed service
- [ ] Set up HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set up monitoring & logging
- [ ] Run security scan
- [ ] Load test the API
- [ ] Backup database regularly
- [ ] Set up CI/CD pipeline

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP_GUIDE.md` | Complete setup & run instructions |
| `BACKEND_ARCHITECTURE.md` | Detailed architecture & design |
| `PHASE2_COMPLETION.md` | What's been built & how to test |
| `backend/README.md` | Backend-specific docs |
| `http://localhost:8000/docs` | Interactive API documentation |

---

## 🎓 Architecture Overview

```
User Browser (React)
        ↓
  Frontend API Client (axios)
        ↓
    FastAPI Backend
        ↓
    PostgreSQL Database
```

### Authentication Flow
```
Login → JWT Token → Store in localStorage → Include in headers → Backend validates
```

### Data Flow
```
User Input → API Call → Backend Processing → Database Query → Response → UI Update
```

---

## ✅ Capabilities Implemented

- ✅ User registration & authentication
- ✅ Health metrics storage & retrieval
- ✅ Risk scoring (diabetes, heart disease)
- ✅ Trend analysis
- ✅ Alert flagging
- ✅ AI-powered symptom analysis
- ✅ Chat with health questions
- ✅ Personalized diet plans
- ✅ Chat history
- ✅ Data persistence

---

## 🎯 What's NOT Implemented Yet

- File uploads (CSV/PDF)
- Export to PDF reports
- Doctor/Provider accounts
- Video consultation integration
- Real medical device integration
- Payment/subscription system
- Mobile app
- Advanced analytics

---

## 💡 Pro Tips

1. **Use Swagger UI** (`/docs`) to test endpoints before building UI
2. **Check DevTools Network tab** to debug API calls
3. **Use Sample Data** above to populate test scenarios
4. **Read Error Messages** - they're helpful!
5. **Check Logs** - both backend and browser console
6. **Keep Terminals Open** - easier to see errors
7. **Use PostMan** for complex API testing
8. **Version Control** - commit frequently!

---

## 🆘 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Visit `http://localhost:8000/docs` for API testing
3. Check browser console for frontend errors
4. Check backend terminal for server errors
5. Read error messages - they're usually very helpful!

---

**You're all set!** 🎉 Happy coding! 🚀
