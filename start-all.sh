#!/bin/bash

echo "🚀 Starting Bluesky Analytics Dashboard with Google Analytics Token Server..."
echo

# Start token server in background
echo "📡 Starting token server on port 3001..."
cd server && npm start &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Go back to root directory
cd ..

# Start React app
echo "⚛️  Starting React app on port 3000..."
npm start &
REACT_PID=$!

echo
echo "✅ Both servers started!"
echo "Token Server: http://localhost:3001"
echo "React App: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all servers..."

# Function to cleanup on exit
cleanup() {
    echo
    echo "🛑 Stopping servers..."
    kill $SERVER_PID 2>/dev/null
    kill $REACT_PID 2>/dev/null
    echo "👋 Goodbye!"
    exit 0
}

# Trap cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait