@echo off
echo.
echo ========================================
echo    BingeBase - One-Command Launcher
echo ========================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist ".env" (
    echo.
    echo WARNING: .env file not found!
    echo Copying .env.example to .env
    copy .env.example .env
    echo.
    echo Please edit .env and add your TMDb API key
    echo Get a free key at: https://www.themoviedb.org/settings/api
    echo.
    pause
)

REM Start the server
echo Starting BingeBase...
echo.
npm start
