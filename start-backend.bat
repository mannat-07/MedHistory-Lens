@echo off
cd /d "%~dp0"
echo [1/3] Starting PostgreSQL Docker container...
cd backend
docker-compose up -d

echo.
echo [2/3] Installing Backend Dependencies...
pip install -r requirements.txt

echo.
echo [3/3] Starting Backend Server on http://localhost:8000...
python -m uvicorn main:app --reload --port 8000
