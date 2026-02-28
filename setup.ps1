# ================================

# GridSense Full Setup (Windows)

# ================================

Write-Host "🚀 Starting GridSense setup..."

# ---------- Python check ----------

Write-Host "🔍 Checking Python..."
python --version
if ($LASTEXITCODE -ne 0) {
Write-Host "❌ Python not found. Please install Python 3.11 or 3.12."
exit 1
}

# ---------- Create venv ----------

if (!(Test-Path "venv")) {
Write-Host "📦 Creating virtual environment..."
python -m venv venv
} else {
Write-Host "✅ venv already exists"
}

# ---------- Activate venv ----------

Write-Host "⚡ Activating virtual environment..."
& .\venv\Scripts\Activate.ps1

# ---------- Upgrade build tools ----------

Write-Host "⬆️ Upgrading pip/setuptools/wheel..."
python -m pip install --upgrade pip setuptools wheel

# ---------- Install backend deps ----------

Write-Host "📥 Installing backend requirements..."
pip install -r requirements.txt

# ---------- Node check ----------

Write-Host "🔍 Checking Node..."
node --version
if ($LASTEXITCODE -ne 0) {
Write-Host "❌ Node is not installed."
Write-Host "👉 Install from https://nodejs.org"
exit 1
}

# ---------- Frontend install ----------

if (Test-Path "frontend") {
Write-Host "📥 Installing frontend dependencies..."
Push-Location frontend
npm install
Pop-Location
}

Write-Host ""
Write-Host "✅ Setup complete!"
Write-Host "➡️ Start backend: python server.py"
Write-Host "➡️ Start frontend: cd frontend && npm run dev"
