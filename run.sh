#!/bin/bash

set -euo pipefail

# Handle cleanup
cleanup() {
    echo "Shutting down backend (PID $BACKEND_PID)..."
    kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# Setup backend
echo "Setting up backend..."
pushd backend > /dev/null

# Create venv if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    echo "Installing dependencies..."
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r requirements.txt
else
    echo "Virtual environment already exists."
fi

# Start backend using virtualenv python directly
echo "Starting backend server..."
./venv/bin/python main.py &
BACKEND_PID=$!

popd > /dev/null

# Setup frontend
echo "Setting up frontend..."
pushd frontend > /dev/null

if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install Node.js." >&2
    exit 1
fi

echo "Starting frontend server..."
npm run dev

popd > /dev/null