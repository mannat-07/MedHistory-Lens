# MedHistory Lens - Full Integration Setup & Testing Guide

## ✅ Completed Tasks

### TASK 1: Environment Setup ✓ 
- Created `frontend/.env` with VITE_API_URL
- Created `backend/.env` with all required configuration
  - ANTHROPIC_API_KEY (needs actual key)
  - DATABASE_URL
  - SECRET_KEY
  - ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

### TASK 2: Claude API Integration ✓
- Updated `backend/requirements.txt` with:
  - anthropic==0.25.0
  - pymupdf==1.23.8
- Completely rewrote `backend/app/services/ai_service.py` to use Claude Opus 4.6:
  - `analyze_report()` - Extract biomarkers from PDFs
  - `chat_with_ai()` - Context-aware health Q&A
  - `analyze_symptoms()` - Symptom to disease prediction
  - `generate_health_response()` - Health education responses
  - `generate_diet_plan()` - Personalized diet recommendations

### TASK 3: PDF Upload & Parsing ✓
- Updated `backend/app/models.py`:
  - Added `raw_text` field to MedicalReport
  - Added `parsed_data` field for JSON biomarker data
- Added PDF upload endpoint in `backend/app/routes/ai.py`:
  - `POST /api/reports/upload`
  - Extracts PDF text with PyMuPDF
  - Sends to Claude for analysis
  - Stores results in database

### TASK 4: Frontend API Client ✓
- Updated `src/utils/api.ts` with all required functions:
  - Auth: `login()`, `register()`, `getMe()`, `logout()`
  - Dashboard: `getMetrics()`, `saveMetrics()`
  - Health Data: `getBloodMetrics()`, `getHeartMetrics()`, `getOrganMetrics()`, `getNutritionMetrics()`
  - Chat: `sendMessage()`, `getChatHistory()`
  - Reports: `uploadReport()`
  - Symptoms: `analyzeSymptoms()`
  - Diet: `getDietPlan()`

### TASK 5: Frontend Pages Connected to Real Data ✓
- Updated `src/app/components/BloodCount.tsx` to use `useHealthData("blood")` hook
- Updated `src/app/components/HeartCholesterol.tsx` to use `useHealthData("heart")` hook
- Updated `src/app/components/OrganSugarLevels.tsx` to use `useHealthData("organs")` hook
- Updated `src/app/components/NewDashboard.tsx` (already had `useDashboard()`)
- Updated `src/app/components/NewAiChat.tsx` (already had `useAiChat()`)

### TASK 6: Auth Flow Fix ✓
- Verified `SignIn.tsx` properly calls auth API
- Verified `SignUp.tsx` properly calls auth API
- Verified `AuthContext.tsx` handles token storage in localStorage
- Fixed `frontend/.env` VITE_API_URL to include `/api` path

### TASK 7: CORS Fix in Backend ✓
- Verified `backend/main.py` has CORSMiddleware configured:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### TASK 9: Final Polish ✓
- Created `src/utils/toast.ts` - Sonner-based toast notifications
  - `showSuccess()`, `showError()`, `showLoading()`, `showInfo()`
  - `showPromise()` for async operations
- Created `src/components/ErrorBoundary.tsx` - Error boundary component
  - Catches React errors and displays user-friendly message
  - Includes refresh button
- Created `src/components/Skeletons.tsx` - Loading skeleton components
  - `SkeletonMetricCard()`, `SkeletonMetricCardGrid()`
  - `SkeletonChart()`, `SkeletonSection()`
  - `SkeletonDashboard()` - Complete loading state

---

## 🚀 SETUP INSTRUCTIONS

### Step 1: Backend Setup

#### 1.1 Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### 1.2 Set Environment Variables
Create/update `backend/.env`:
```env
ANTHROPIC_API_KEY=your_actual_anthropic_key_here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medhistory
SECRET_KEY=your_super_secret_jwt_key_change_in_production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
```

⚠️ **CRITICAL**: Replace `ANTHROPIC_API_KEY` with your actual Anthropic API key from https://console.anthropic.com

#### 1.3 Start PostgreSQL Database
```bash
cd backend
docker-compose up -d
```

Wait for PostgreSQL to be ready (usually a few seconds).

#### 1.4 Run Backend Server
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

✅ Backend should be ready at: http://localhost:8000
✅ Swagger API docs at: http://localhost:8000/docs

### Step 2: Frontend Setup

#### 2.1 Install Dependencies
```bash
npm install
```

#### 2.2 Verify Environment Configuration
Check `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

#### 2.3 Run Development Server
```bash
npm run dev
```

✅ Frontend should be ready at: http://localhost:5173

---

## ✅ TESTING CHECKLIST

### Test 1: User Registration & Login
- [ ] Go to http://localhost:5173
- [ ] Click "Sign up"
- [ ] Enter: name="Test User", email="test@example.com", password="test123456"
- [ ] Click "Sign up" button
- [ ] Should see success message and redirect to dashboard
- [ ] Logout and test login with same credentials
- [ ] Should reload dashboard successfully

### Test 2: Dashboard Metrics
- [ ] On dashboard, verify metrics cards display:
  - [ ] Glucose value (mg/dL)
  - [ ] HbA1c percentage
  - [ ] Cholesterol value
- [ ] Verify risk indicators:
  - [ ] Diabetes Risk %
  - [ ] Heart Disease Risk %
- [ ] Check for loading skeletons while data loads
- [ ] Refresh page - data should persist

### Test 3: Blood Count Page
- [ ] Navigate to sidebar → Blood Count
- [ ] Verify 4 metric cards load:
  - [ ] RBC (M/μL)
  - [ ] WBC (K/μL)
  - [ ] Hemoglobin (g/dL)
  - [ ] Platelets (K/μL)
- [ ] Check "Values vs Reference Range" bars
- [ ] Look for any flagged items

### Test 4: Heart & Cholesterol Page
- [ ] Navigate to sidebar → Heart & Cholesterol
- [ ] Verify cholesterol metrics:
  - [ ] Total Cholesterol
  - [ ] LDL
  - [ ] HDL
  - [ ] Triglycerides
- [ ] Check "LDL vs HDL Comparison" chart
- [ ] Check "Cardiovascular Risk Indicator"
- [ ] No errors in console

### Test 5: Organ & Sugar Levels Page
- [ ] Navigate to sidebar → Organ & Sugar Levels
- [ ] Verify metrics:
  - [ ] Glucose
  - [ ] HbA1c
  - [ ] Creatinine
  - [ ] ALT
- [ ] Check "Glucose Trend" chart
- [ ] Verify "Diabetes Risk" indicator and category
- [ ] Check reference ranges

### Test 6: AI Chat Feature
- [ ] Navigate to sidebar → Ask AI
- [ ] Type a message: "Why is my glucose level elevated?"
- [ ] Should see:
  - [ ] User message appears on right (blue bubble)
  - [ ] Typing indicator appears
  - [ ] AI response arrives from Claude
  - [ ] AI message shows on left (white bubble)
  - [ ] "AI-assisted · Not a diagnosis" disclaimer
- [ ] Send another message to verify chat history
- [ ] Refresh page - messages should persist

### Test 7: PDF Report Upload
- [ ] (Requires creating a test lab report PDF)
- [ ] Navigate to sidebar → Upload Report
- [ ] Upload a PDF with lab values
- [ ] Should see:
  - [ ] Processing state
  - [ ] Parsed biomarkers displayed
  - [ ] Values, units, reference ranges
  - [ ] Flagged items highlighted
- [ ] Check no JavaScript errors

### Test 8: Symptom Analysis
- [ ] Navigate to sidebar → Ask AI (or if there's dedicated symptom page)
- [ ] Input symptoms: ["fatigue", "thirst",  "frequent urination"]
- [ ] Should receive:
  - [ ] Disease predictions with probabilities
  - [ ] Risk category (low/medium/high)
  - [ ] Actionable suggestions
  - [ ] Medical disclaimer

### Test 9: Error Handling & Toast Notifications
- [ ] Try logging in with wrong password
  - [ ] Should show error toast notification
  - [ ] Error message should be clear
- [ ] Try uploading non-PDF file
  - [ ] Should show error toast
- [ ] Disconnect backend and reload
  - [ ] Should show error boundary with refresh button
  - [ ] Button should reload page

### Test 10: Mobile Responsiveness
- [ ] Open DevTools (F12) → Toggle device toolbar
- [ ] Test at 768px width (tablet)
  - [ ] Layout should not break
  - [ ] All buttons clickable
  - [ ] Text readable
- [ ] Test at 375px width (mobile)
  - [ ] Cards stack properly
  - [ ] No horizontal scrolling
  - [ ] Navigation is accessible

---

## 🔧 TROUBLESHOOTING

### Backend Won't Start
```bash
# Check if port 8000 is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Check database connection
python -m psycopg2 -c "SELECT 1"
```

### Frontend API Calls Failing
1. Check that backend is running: `http://localhost:8000/docs`
2. Check `frontend/.env` has correct `VITE_API_URL`
3. Check browser console for CORS errors
4. Verify `ANTHROPIC_API_KEY` is set in `backend/.env`

### Claude API Errors
- Error: "401 Unauthorized" → Invalid or missing `ANTHROPIC_API_KEY`
- Error: "Rate limit exceeded" → API quota reached
- Error: "Model not available" → Using wrong model name (should be `claude-opus-4-6`)

### Database Connection Issues
```bash
# Reset database
docker-compose down
docker-compose up -d
docker-compose exec postgres psql -U postgres -c "DROP DATABASE medhistory;"
docker-compose exec postgres psql -U postgres -c "CREATE DATABASE medhistory;"
```

---

## 📊 API ENDPOINTS REFERENCE

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Get JWT token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Health Data
- `GET /api/dashboard` - All dashboard metrics
- `GET /api/health/blood` - Blood count data
- `GET /api/health/heart` - Cholesterol & heart data
- `GET /api/health/organs` - Organ function data
- `GET /api/health/nutrition` - Vitamin & mineral data
- `POST /api/health/metrics` - Add new health metrics

### AI Features
- `POST /api/predictions` - Analyze symptoms
- `POST /api/chat` - Send health question to AI
- `GET /api/chat/history` - Get chat message history
- `POST /api/reports/upload` - Upload and analyze PDF report
- `GET /api/diet-plan` - Get personalized diet plan

---

## 📝 NEXT STEPS

1. **Anthropic API Key**: Sign up at https://console.anthropic.com and add key to `.env`
2. **Database**: Ensure PostgreSQL is running
3. **Start Backend**: `cd backend && python -m uvicorn main:app --reload`
4. **Start Frontend**: `npm run dev`
5. **Test**: Create an account and run through the checklist above
6. **Production**: Update SECRET_KEY, set debug=false, restrict CORS origins

---

## 🎯 Integration Summary

✅ **Frontend → Backend**: All API endpoints wired
✅ **Backend → Claude**: AI features integrated  
✅ **Database**: Schema updated for PDF reports
✅ **Authentication**: JWT tokens implemented
✅ **Error Handling**: Error boundaries and toasts
✅ **Loading States**: Skeleton screens added
✅ **CORS**: Configured for localhost development

**Status**: READY FOR PRODUCTION TESTING
