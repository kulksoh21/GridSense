# GridSense

**Hackathon:** Hack for Humanity 2026  
**Authors:** Khushi Gandhi  and Soham Kulkarni

## Tech Stack
- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Flask + pandas + scikit-learn + joblib

## Project Structure
- `frontend/` - React app
- `src/` - backend prediction engine and data simulation scripts
- `server.py` - Flask API server
- `best_energy_model.pkl` - trained model artifact

**GridSense** is an intelligent energy optimization platform designed to help California households reduce electricity costs while minimizing their carbon footprint. By combining realistic household energy data, machine learning-powered bill predictions, and gamified insights, GridSense empowers users to make informed decisions about energy usage, cost-saving strategies, and sustainable living practices.

The platform supports a wide range of home types, resident counts, and appliance profiles, and provides actionable guidance, carbon footprint equivalents, and gamified rewards such as eco scores, badges, and leaderboard standings.

---

## Key Features

### Minimum Viable Product (MVP)

- User Inputs: Home size, number of residents, ZIP code, appliance usage (HVAC, washer, dryer, dishwasher, EV charger, pool pump).
- Dashboard Outputs: Estimated monthly energy consumption (kWh), predicted utility bill (USD), and carbon footprint (kg CO₂).=
- Actionable Insights: Personalized top recommendations for energy savings.
- Eco Score & Grade: Gamified score (0–100) and letter grade (A–F) reflecting household efficiency.
- Badges: Earn badges based on efficiency, appliance usage, and off-peak optimization.
- Leaderboard Simulation: Compare your eco score against other households.
- Comparison vs Similar Users: See how your energy usage compares to households with similar size and residents in California.
- Carbon Footprint Equivalents: Visualize energy impact in terms of car miles, trees needed, or flights.
- Smart Recommendations: Time-of-use optimization, HVAC adjustment tips, and appliance management.

---

## Dataset

The platform relies on a **simulated dataset** of 1000 households in California, designed to reflect real-world energy consumption patterns:

| Column | Description |
|--------|-------------|
| `zip` | ZIP code of household |
| `utility` | Primary electricity provider (PG&E, SCE, SDG&E) |
| `climate` | Regional climate zone (coastal, central_valley, southern_coastal, desert) |
| `home_size_sqft` | Square footage of the home |
| `residents` | Number of occupants |
| `ac_level` | HVAC usage intensity (low, medium, high) |
| `electric_water_heater` | Boolean indicating electric water heater usage |
| `ev_owner` | Boolean indicating EV ownership |
| `total_kwh` | Monthly energy consumption in kilowatt-hours |
| `bill_usd` | Estimated monthly electricity bill in USD |
| `carbon_kg` | Estimated carbon footprint in kilograms CO₂ |
| `time_usage_type` | Predominant energy use period (mostly_peak, mostly_offpeak, mixed) |

> **Note:** Rates are based on verified California utility data (PG&E, SCE, SDG&E) to ensure realistic financial calculations.
---
### Modeling Approach

- Feature Engineering: Derived features include total_kwh, hvac_intensity, residents_per_sqft, has_ev_or_pool, and appliance counts.
- Machine Learning Model: Trained a regression model (best_energy_model.pkl) using the simulated dataset to predict monthly utility bills based on household characteristics.
- Simulation: Carbon footprint, eco score, badges, leaderboard ranking, and comparison with similar households are derived from calculated energy metrics.

### System Architecture

- Frontend: Web-based UI, inputs user household data, and displays dashboards with predictions, eco metrics, recommendations, and gamification.
- Backend: Python backend with ML model serving, energy calculations, carbon metrics, recommendation engine, and gamification logic.
- Integration: Backend exposes functions that the frontend calls to fetch predictions, eco scores, badges, leaderboard rank, and similar household comparisons.

---

### Impact and Vision

GridSense empowers households to make informed decisions about energy usage by translating raw consumption patterns into meaningful financial and environmental insights. By combining predictive modeling, carbon analytics, and behavioral design, the platform encourages sustainable action through clarity and personalization. While initially built using simulated data, the system is structured for future integration with real-world smart meter data, live pricing APIs, and community benchmarking features.

Built for Hack for Humanity 2026, GridSense demonstrates how machine learning and thoughtful system design can support both cost savings and climate-conscious living at the household level.

---
## Installation & Usage

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

### 1. Clone and enter the project

```bash
git clone https://github.com/kulksoh21/GridSense.git
cd GridSense
```

### 2. Run setup script (recommended)

Windows (PowerShell):

```powershell
.\setup.ps1
```

macOS/Linux:

```bash
chmod +x setup.sh
./setup.sh
```

These scripts create `venv`, install Python dependencies, and install frontend dependencies.

### 3. Run backend server

```bash
python server.py
```

Backend should be available at:

`http://localhost:5000`

### 4. Run frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend should be available at:

`http://localhost:5173`

### 5. Verify app is working

1. Open `http://localhost:5173`.
2. Fill out the form and click **Get My Energy Analysis**.
3. Confirm prediction cards, recommendations, eco score, and similar-home panels appear.

### Manual install (if you skip scripts)

```bash
pip install -r requirements.txt
cd frontend
npm install
```

### Build for production

```bash
cd frontend
npm run build
npm run preview
```

