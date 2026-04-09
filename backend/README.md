# MedHistory Lens - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Setup Database
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Wait for PostgreSQL to be ready (~10 seconds)
# Tables will be auto-created on first run
```

### 3. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your configuration (optional for local development)
```

### 4. Run the Server
```bash
# From backend directory
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using the direct command:
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### 5. API Documentation
Once the server is running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## Project Structure

```
backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── docker-compose.yml      # PostgreSQL + Redis setup
├── .env.example           # Environment variables template
└── app/
    ├── __init__.py
    ├── config.py          # Settings & configuration
    ├── database.py        # SQLAlchemy setup
    ├── auth.py            # Authentication utilities
    ├── models.py          # SQLAlchemy models
    ├── schemas.py         # Pydantic schemas
    ├── routes/
    │   ├── auth.py        # Authentication endpoints
    │   ├── health.py      # Health data endpoints
    │   └── ai.py          # AI/Chat endpoints
    └── services/
        ├── health_service.py  # Health data logic
        └── ai_service.py      # AI/ML logic
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register       - Register new user
POST   /api/auth/login          - Login user
GET    /api/auth/me             - Get current user (requires token)
POST   /api/auth/logout         - Logout
```

### Health Data
```
GET    /api/dashboard           - Get dashboard with metrics & trends
GET    /api/health/{category}   - Get category-specific data (blood/heart/organs/nutrition)
POST   /api/health/metrics      - Create new health metric
GET    /api/health/history      - Get historical metrics
```

### AI Features
```
POST   /api/predictions         - Analyze symptoms
POST   /api/chat                - Send chat message
GET    /api/chat/history        - Get chat history
POST   /api/chat/clear          - Clear chat messages
GET    /api/diet-plan           - Get personalized diet plan
```

---

## Authentication

The API uses JWT tokens for authentication. Include in headers:
```
Authorization: Bearer YOUR_JWT_TOKEN
X-User-ID: USER_ID_NUMBER
```

For local development, you can use the X-User-ID header directly.

---

## Sample Requests

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Add Health Metric
```bash
curl -X POST http://localhost:8000/api/health/metrics \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "test_date": "2024-01-15",
    "glucose": 110,
    "hba1c": 6.8,
    "ldl_cholesterol": 155,
    "hdl_cholesterol": 40,
    "total_cholesterol": 220,
    "wbc": 7.5,
    "rbc": 4.9,
    "hemoglobin": 14.2,
    "vitamin_d": 18
  }'
```

### Get Dashboard
```bash
curl -X GET http://localhost:8000/api/dashboard \
  -H "X-User-ID: 1"
```

### Send Chat Message
```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "message": "Why is my HbA1c elevated?"
  }'
```

### Analyze Symptoms
```bash
curl -X POST http://localhost:8000/api/predictions \
  -H "Content-Type: application/json" \
  -H "X-User-ID: 1" \
  -d '{
    "symptoms": ["fatigue", "frequent urination", "thirst"]
  }'
```

---

## Development

### Run with Hot Reload
```bash
uvicorn main:app --reload
```

### Run Tests
```bash
pytest
```

### Database Migrations
The database schema is automatically created on first run. To reset:
```sql
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS predictions;
DROP TABLE IF EXISTS medical_reports;
DROP TABLE IF EXISTS health_metrics;
DROP TABLE IF EXISTS users;
```

---

## Deployment

### Production Setup
1. Use PostgreSQL managed service (AWS RDS, Azure Database, etc.)
2. Set secure `SECRET_KEY` in .env
3. Set `DEBUG=false`
4. Use environment-specific variables
5. Deploy to cloud (Heroku, AWS, Azure, etc.)

### Docker Build (Optional)
```bash
docker build -t medhistory-api .
docker run -p 8000:8000 medhistory-api
```

---

## Troubleshooting

**Database Connection Error:**
- Ensure PostgreSQL container is running: `docker ps`
- Check DATABASE_URL in .env matches docker-compose credentials

**Port Already In Use:**
```bash
# Free up port 8000
lsof -ti:8000 | xargs kill -9
```

**Import Errors:**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

---

## API Response Format

All responses follow this format:

**Success (2xx):**
```json
{
  "data": { ... },
  "message": "Success"
}
```

**Error (4xx/5xx):**
```json
{
  "detail": "Error message"
}
```

---

## Next Steps
1. Connect frontend to these API endpoints
2. Add payment/subscription features if needed
3. Implement file upload for PDFs/CSVs
4. Deploy to cloud platform
5. Add monitoring & logging
