# GridSense Frontend

A modern React frontend for the GridSense energy usage analysis application.

## Features

- **Energy Analysis Form**: Input home details including size, residents, appliances, and climate
- **Real-time Predictions**: Get instant estimates for monthly energy bills and carbon footprint
- **Interactive Dashboard**: View comprehensive energy metrics and visualizations
- **Smart Recommendations**: Receive personalized, goal-oriented energy-saving tips
- **Progress Tracking**: Monitor progress toward your monthly spend goal with visual indicators
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── EnergyForm.tsx          # Input form for home data
│   │   └── Dashboard.tsx           # Energy metrics and recommendations display
│   ├── services/
│   │   └── api.ts                  # API communication and data processing
│   ├── App.tsx                     # Main application component
│   ├── main.tsx                    # Application entry point
│   └── index.css                   # Global styles
├── index.html                      # HTML template
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm run dev
```
The app will start at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Backend Requirements

The frontend expects the backend server to be running on `http://localhost:5000` with the following endpoint:

- **POST /predict** - Accepts user input and returns energy predictions

Expected request body:
```json
{
  "home_size_sqft": 2000,
  "residents": 3,
  "ac_level": "medium",
  "climate": "coastal",
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

Expected response:
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

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Icons** - Icon library

## Styling

The application uses Tailwind CSS with custom color extensions:
- `energy-blue`: Primary color (#1e40af)
- `energy-green`: Success/ecological color (#16a34a)
- `energy-orange`: Warning/energy color (#ea580c)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
