@echo off
set MODEL_NAME=llama3.2:3b

echo [1/2] Checking if Ollama is installed...
ollama --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Ollama is not installed. Please install it from https://ollama.com
    pause
    exit /b 1
)

echo [2/2] Checking for local model: %MODEL_NAME%...
:: This command searches the local list for your specific model
ollama list | findstr /C:"%MODEL_NAME%" >nul 2>&1

if %errorlevel% equ 0 (
    echo Success: %MODEL_NAME% is already installed. Skipping download.
) else (
    echo Model %MODEL_NAME% not found. Pulling now...
    ollama pull %MODEL_NAME%
)

echo.
echo [3/4] Setting up Backend virtual environment...
cd backend
if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)
echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..

echo.
echo [4/4] Setting up Frontend dependencies...
cd ui
echo Installing npm packages...
call npm install
cd ..

echo.
echo Setup complete! Your application is fully configured and ready to run.
pause