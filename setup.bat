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
echo Setup complete! Your backend is ready to use %MODEL_NAME%.
pause