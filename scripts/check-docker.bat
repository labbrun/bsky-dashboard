@echo off
REM Docker Compose V2 compatibility check for Windows
setlocal EnableDelayedExpansion

echo 🐳 Checking Docker Compose compatibility...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

REM Get Docker version
for /f "tokens=3" %%a in ('docker --version') do set DOCKER_VERSION=%%a
set DOCKER_VERSION=%DOCKER_VERSION:,=%
echo ✅ Docker version: %DOCKER_VERSION%

REM Check if Docker Compose V2 is available
docker compose version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%a in ('docker compose version --short 2^>nul') do set COMPOSE_VERSION=%%a
    if "!COMPOSE_VERSION!"=="" (
        for /f "tokens=4" %%a in ('docker compose version') do set COMPOSE_VERSION=%%a
    )
    echo ✅ Docker Compose V2 version: !COMPOSE_VERSION!
    echo ✅ Ready to deploy with Docker Compose V2!
    echo.
    echo 🚀 Run deployment with:
    echo    docker compose up -d
    echo.
    pause
    exit /b 0
)

REM Check for legacy Docker Compose
docker-compose --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=3" %%a in ('docker-compose --version') do set COMPOSE_VERSION=%%a
    set COMPOSE_VERSION=%COMPOSE_VERSION:,=%
    echo ⚠️  Found legacy docker-compose version: !COMPOSE_VERSION!
    echo.
    echo 📋 You have options:
    echo 1. Use legacy commands: docker-compose up -d
    echo 2. Upgrade to Docker Compose V2 ^(recommended^)
    echo.
    echo 🔧 To upgrade Docker Compose:
    echo    - Update Docker Desktop to latest version
    echo    - Or install Docker Compose V2 plugin
    echo.
    pause
    exit /b 0
)

echo ❌ Docker Compose not found.
echo Please install Docker Desktop which includes Docker Compose V2
echo Download from: https://www.docker.com/products/docker-desktop/
pause
exit /b 1

endlocal