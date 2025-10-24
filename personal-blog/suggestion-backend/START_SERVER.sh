#!/bin/bash

# SnowBytes Suggestion Backend Startup Script

echo "╔══════════════════════════════════════════════╗"
echo "║  📮 SnowBytes Suggestion Backend             ║"
echo "║                                              ║"
echo "║  Starting server...                          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "🚀 Starting backend server..."
echo ""
npm start

