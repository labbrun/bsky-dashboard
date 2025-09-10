@echo off
echo Starting Bsky Dashboard with Google Analytics Token Server...
echo.

echo Starting token server on port 3001...
start "Token Server" cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo Starting React app on port 3000...
start "React App" cmd /k "npm start"

echo.
echo Both servers starting...
echo Token Server: http://localhost:3001
echo React App: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul