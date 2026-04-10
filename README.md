# MedHistory-Lens

## Problem Statement
Patients often receive health reports in different formats across clinics and labs, making it difficult to:

- Track biomarker changes over time
- Understand current health risk at a glance
- Get practical next-step guidance from report data

Most users end up with disconnected PDFs and no unified trend view.

## Solution Overview
MedHistory-Lens is a full-stack health analytics platform that converts uploaded medical report data into a single longitudinal dashboard.

- Upload and process report-derived biomarker data
- Aggregate historical metrics into meaningful trends
- Show live dashboard cards from real report history (not hardcoded values)
- Provide risk indicators and AI-assisted summary insights
- Offer category-wise views for blood, heart, organs, and nutrition

### Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS
- Backend: FastAPI, SQLAlchemy, Pydantic
- Database: PostgreSQL

## Setup Instructions

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd MedHistory-Lens
```

### 2. Frontend Setup
```bash
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### 3. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: http://localhost:8000

### 4. API Base URL (Frontend)
Create or update `.env` in project root:

```env
VITE_API_URL=http://localhost:8000/api
```

### 5. Build Check (Optional)
```bash
npx tsc --noEmit
npm run build
```

## Demo Link
- Live Demo: https://med-history-lens.vercel.app/
