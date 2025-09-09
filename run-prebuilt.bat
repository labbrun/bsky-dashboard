@echo off
REM Bulletproof deployment script for Windows - Uses pre-built image
setlocal EnableDelayedExpansion

echo 🚀 Deploying Bluesky Analytics Dashboard (Pre-built)
echo ==================================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Get user input if not provided via environment
if not defined BLUESKY_HANDLE (
    set /p BLUESKY_HANDLE=Enter your Bluesky handle (e.g., alice.bsky.social): 
)

if not defined AUTH_PASSWORD (
    set /p AUTH_PASSWORD=Enter a secure dashboard password: 
)

if not defined APP_NAME (
    set APP_NAME=My Bluesky Analytics
)

echo.
echo 🔧 Configuration:
echo    Handle: %BLUESKY_HANDLE%
echo    App Name: %APP_NAME%
echo    Port: 3000
echo.

REM Stop existing container if running
echo 🛑 Stopping existing container...
docker stop bluesky-analytics >nul 2>&1
docker rm bluesky-analytics >nul 2>&1

REM Run the pre-built container
echo 🚀 Starting Bluesky Analytics Dashboard...
docker run -d --name bluesky-analytics -p 3000:3000 -e REACT_APP_BLUESKY_HANDLE=%BLUESKY_HANDLE% -e REACT_APP_AUTH_PASSWORD=%AUTH_PASSWORD% -e REACT_APP_NAME="%APP_NAME%" -e REACT_APP_MODE=local -e REACT_APP_DEBUG=false --restart unless-stopped node:18-alpine sh -c "apk add --no-cache git curl && cd /tmp && git clone https://github.com/yourusername/bluesky-analytics-dashboard.git . && npm install --production --ignore-scripts --no-optional && npm run build && npx serve -s build -l 3000"

REM Wait for container to start
echo ⏳ Waiting for application to start...
timeout /t 10 >nul

REM Check if it's running
docker ps | findstr bluesky-analytics >nul
if %errorlevel% equ 0 (
    echo ✅ Success! Your dashboard is running at:
    echo    👉 http://localhost:3000
    echo.
    echo 📋 Login with:
    echo    Password: %AUTH_PASSWORD%
    echo.
    echo 🛠️  Useful commands:
    echo    View logs: docker logs bluesky-analytics
    echo    Stop app:  docker stop bluesky-analytics
    echo    Restart:   docker restart bluesky-analytics
    echo.
    pause
) else (
    echo ❌ Failed to start. Check logs:
    docker logs bluesky-analytics
    pause
    exit /b 1
)

endlocal