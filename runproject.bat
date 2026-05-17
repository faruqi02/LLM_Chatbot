@echo off
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate && uvicorn main:app --reload"

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd ui && npm run dev"

echo Waiting for servers to start...
timeout /t 5 /nobreak > nul

echo Opening browser...
start http://localhost:8501

echo Done!
