#!/bin/bash

# SIMRS Quick Start Script for MacOS/Linux

echo ""
echo "==================================="
echo "  SIMRS - Hospital Management System"
echo "  Quick Start Script"
echo "==================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

echo "[✓] Node.js found"
node --version

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null; then
    echo "WARNING: MongoDB CLI not found"
    echo "Start MongoDB manually if needed"
    echo ""
fi

# Setup Backend
echo ""
echo "[1/4] Setting up Backend..."
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/simrs
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
EOF
    echo "[✓] .env file created"
else
    echo "[✓] .env file exists"
fi

cd ..

# Setup Frontend
echo ""
echo "[2/4] Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Dependencies already installed"
fi

cd ..

# Start Backend
echo ""
echo "[3/4] Starting Backend Server (port 5000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo ""
echo "[4/4] Starting Frontend Server (port 3000)..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "==================================="
echo "   ✓ SIMRS is starting!"
echo "==================================="
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Login credentials:"
echo "- Username: admin | Password: admin"
echo "- Username: doctor | Password: doctor"
echo "- Username: medical_coder | Password: coder"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Wait for processes
wait $BACKEND_PID $FRONTEND_PID
