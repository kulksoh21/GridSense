🎨 GridSense Frontend Architecture

## Project Structure

```
frontend/
├── public/                          # Static assets
├── src/
│   ├── components/                  # Reusable React components
│   │   ├── EnergyForm.tsx          # User input form
│   │   │   └── Features:
│   │   │       - Home size input (500-10,000 sqft)
│   │   │       - Residents selector (1-6)
│   │   │       - Climate type dropdown
│   │   │       - AC/heating usage level
│   │   │       - Peak usage pattern
│   │   │       - Appliance checkboxes
│   │   │       - Optional spending goal
│   │   │
│   │   └── Dashboard.tsx            # Results display
│   │       └── Features:
│   │           - Key metrics cards (Bill, kWh, Carbon, Peak)
│   │           - Goal progress bar with tracker
│   │           - Top 3 recommendations with savings amounts
│   │           - HVAC usage breakdown
│   │           - Peak vs off-peak comparison
│   │
│   ├── services/                    # API and utilities
│   │   └── api.ts
│   │       ├── API client (axios)
│   │       ├── Types (UserInput, EnergyPrediction)
│   │       ├── predictEnergyBill() - Call backend
│   │       ├── getRecommendations() - Generate tips
│   │       └── calculateGoalProgress() - Track goal
│   │
│   ├── App.tsx                      # Main app component
│   │   ├── State management
│   │   ├── Error handling
│   │   ├── Loading states
│   │   └── Layout structure
│   │
│   ├── main.tsx                     # React DOM entry
│   └── index.css                    # Global styles + Tailwind
│
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.ts                   # Vite configuration
├── tailwind.config.js               # Tailwind customization
├── tsconfig.json                    # TypeScript config
└── README.md                        # Documentation

## Component Hierarchy

App
├── Header
│   └── Logo + Title
├── Main Content
│   ├── EnergyForm (Left Column)
│   │   ├── Form inputs
│   │   ├── Appliance checkboxes
│   │   └── Submit button
│   └── Dashboard (Right Column)
│       ├── Summary header
│       ├── Metrics cards
│       ├── Goal progress (optional)
│       ├── Recommendations
│       └── Usage breakdown charts
└── Footer
    ├── About
    ├── Features
    └── Links

## Data Flow

User fills form
    ↓
Form validation
    ↓
API call to /predict
    ↓
Backend processes prediction
    ↓
Frontend receives response
    ↓
Generate recommendations
    ↓
Calculate goal progress
    ↓
Display Dashboard

## Styling System

### Color Palette
- energy-blue: #1e40af (Primary)
- energy-green: #16a34a (Success/Eco)
- energy-orange: #ea580c (Warning/Energy)
- Gray scale: 50-900

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Key Classes
- Container: max-w-7xl mx-auto px-4
- Cards: bg-white rounded-lg shadow-md p-6
- Buttons: bg-energy-blue hover:bg-blue-700
- Forms: px-4 py-2 border rounded-lg focus:ring-2

## Key Features Breakdown

### 1. Energy Prediction
- Uses backend ML model
- Calculates monthly bill
- Estimates kWh consumption
- Computes carbon footprint

### 2. Smart Recommendations
- 3 personalized actions
- Estimated savings for each
- Goal-oriented messaging
- HVAC, peak hour, and appliance focused

### 3. Goal Tracking
- User sets monthly target
- Progress bar visualization
- Shows difference from goal
- Success message when goal reached

### 4. Responsive Design
- Mobile-first approach
- Grid layouts that stack
- Touch-friendly inputs
- Optimized performance

## Performance Optimizations

- Code splitting via Vite
- Lazy loading components
- Memoization where needed
- Tailwind CSS purging
- Minified production build

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
