#!/usr/bin/env bash

set -e

echo "🚀 Starting GridSense setup..."

# ---------- Python check ----------

echo "🔍 Checking Python..."
if ! command -v python3 &> /dev/null; then
echo "❌ Python3 not found. Install Python 3.11 or 3.12."
exit 1
fi

# ---------- Create venv ----------

if [ ! -d "venv" ]; then
echo "📦 Creating virtual environment..."
python3 -m venv venv
else
echo "✅ venv already exists"
fi

# ---------- Activate venv ----------

echo "⚡ Activating virtual environment..."
source venv/bin/activate

# ---------- Upgrade build tools ----------

echo "⬆️ Upgrading pip/setuptools/wheel..."
python -m pip install --upgrade pip setuptools wheel

# ---------- Install backend deps ----------

echo "📥 Installing backend requirements..."
pip install -r requirements.txt

# ---------- Node check ----------

echo "🔍 Checking Node..."
if ! command -v node &> /dev/null; then
echo "❌ Node not installed."
echo "👉 Install from https://nodejs.org or brew install node"
exit 1
fi

# ---------- Frontend install ----------

if [ -d "frontend" ]; then
echo "📥 Installing frontend dependencies..."
cd frontend
npm install
cd ..
fi

echo ""
echo "✅ Setup complete!"
echo "➡️ Start backend: python server.py"
echo "➡️ Start frontend: cd frontend && npm run dev"
