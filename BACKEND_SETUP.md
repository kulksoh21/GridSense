# Backend Server Setup for GridSense

## Overview
This Flask server connects the React frontend with your Python ML model.

## Installation

1. Install required Python packages:
```bash
pip install flask flask-cors
```

2. Ensure your Python environment has all ML dependencies:
```bash
pip install pandas numpy scikit-learn joblib
```

## Running the Server

From the `GridSense` directory:
```bash
python server.py
```

The server will start on `http://localhost:5000`

## API Endpoint

### POST /predict
Predicts energy bill and usage for a household.

**Request Body:**
```json
{
  "home_size_sqft": 2000,
  "residents": 3,
  "climate": "coastal",
  "ac_level": "medium",
  "time_usage_type": "mixed",
  "fridge": 1,
  "washer": 1,
  "dryer": 0,
  "dishwasher": 1,
  "ev_charger": 0,
  "pool_pump": 0,
  "monthly_spend_goal": 100
}
```

**Response:**
```json
{
  "predicted_bill_usd": 125.50,
  "total_kwh": 800,
  "hvac_kwh": 400,
  "peak_kwh": 560,
  "offpeak_kwh": 240,
  "carbon_kg": 320,
  "monthly_energy_saving_recommendation": "..."
}
```

## Troubleshooting

- **Port 5000 already in use**: Change the port in `server.py` or kill the existing process
- **Module not found errors**: Ensure you're running from the correct directory
- **Model file not found**: Ensure `best_energy_model.pkl` exists in the GridSense directory
