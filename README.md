# GridSense – Home Energy Usage Optimizer

**Hackathon:** Hack for Humanity 2026  
**Author:** Khushi Gandhi  and Soham Kulkarni

---

## Project Overview

**GridSense** is an intelligent energy optimization platform designed to help households reduce electricity costs while minimizing their carbon footprint. By combining realistic household energy data with personalized recommendations, GridSense empowers users to make informed decisions about energy usage, cost-saving strategies, and sustainable living practices.

---

## Key Features

### Minimum Viable Product (MVP)
- **User Inputs:** Home size, number of residents, ZIP code, appliance usage (HVAC, water heater, washer, dryer, stove, dishwasher, pool pump, EV ownership).  
- **Dashboard Outputs:** Estimated monthly energy consumption (kWh), utility bill ($), and carbon footprint (kg CO₂).  
- **Actionable Insights:** Top 3 energy-saving recommendations tailored to the household.

### Stretch / “Super Extra” Features
- **Goal Setting:** Users can specify a target monthly utility bill; GridSense generates a customized plan to achieve it.  
- **Time-of-Use Optimization:** Recommendations for shifting high-energy activities (laundry, EV charging) to off-peak periods.  
- **Carbon Reduction Guidance:** Personalized suggestions for reducing environmental impact beyond cost savings.

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

## Installation & Usage

1. Clone the repository:

```bash
git clone https://github.com/kulksoh21/GridSense.git
cd gridsense
