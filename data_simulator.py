# data_simulator_full_extra.py
import pandas as pd
import numpy as np
import random

# -----------------------------
# 1️⃣ Simulation parameters
num_households = 1000  # Enough for ML

zip_codes = [
    "90001","90002","90003","90210","94016","94022","94105","94536",
    "95014","95129","92037","92677","92335","92101","94568","95814",
    "94538","94087","91356","91730","92646","92336","94539","90277",
    "94087","91364","92618","92507","91761","91335","90278","92612",
    "94080","92121","94025","94596","91770","92130","94544","91711",
    "94086","92653","94040","91387","94551","92630","94085","92024",
    "94582","92037"
]

climate_zones = ["coastal", "inland", "desert", "mountain"]
ac_levels = ["low", "medium", "high"]
time_usage_types = ["morning_peak", "evening_peak", "off_peak", "mixed"]
house_types = ["detached", "condo", "apartment"]

appliances = ["fridge", "washer", "dryer", "dishwasher", "ev_charger", "pool_pump"]

# Utility rates (simplified, realistic values)
utility_rates = {
    "PG&E": {"peak": 0.35, "offpeak": 0.15, "fixed": 15},
    "SCE": {"peak": 0.32, "offpeak": 0.14, "fixed": 12},
    "SDG&E": {"peak": 0.38, "offpeak": 0.16, "fixed": 18}
}

# -----------------------------
# 2️⃣ Helper functions
def simulate_appliance_usage():
    return {app: random.choice([0, 1]) for app in appliances}

def simulate_home_size():
    return random.randint(800, 5000)

def simulate_residents():
    return random.randint(1, 6)

def simulate_ac_level():
    return random.choice(ac_levels)

def simulate_climate():
    return random.choice(climate_zones)

def simulate_time_usage():
    return random.choice(time_usage_types)

def assign_utility(zip_code):
    return random.choice(["PG&E","SCE","SDG&E"])

def simulate_house_type():
    return random.choice(house_types)

# -----------------------------
# 3️⃣ Calculate kWh per appliance
def appliance_kwh(appliance_dict):
    return {
        "fridge_kwh": appliance_dict["fridge"] * 30,
        "washer_kwh": appliance_dict["washer"] * 10,
        "dryer_kwh": appliance_dict["dryer"] * 25,
        "dishwasher_kwh": appliance_dict["dishwasher"] * 15,
        "ev_charger_kwh": appliance_dict["ev_charger"] * random.randint(100,400),
        "pool_pump_kwh": appliance_dict["pool_pump"] * random.randint(50,150)
    }

# -----------------------------
# 4️⃣ HVAC kWh estimation
def hvac_kwh(ac_level, climate, residents):
    base = {"low": 200, "medium": 400, "high": 600}
    climate_factor = {"coastal": 1, "inland": 1.2, "desert": 1.5, "mountain": 0.8}
    return base[ac_level] * climate_factor[climate] * (0.8 + 0.05*residents)

# -----------------------------
# 5️⃣ Peak/off-peak split
def peak_offpeak_split(total_kwh, time_type):
    if time_type in ["morning_peak", "evening_peak"]:
        peak_fraction = 0.7
    elif time_type == "off_peak":
        peak_fraction = 0.2
    else:  # mixed
        peak_fraction = 0.5
    peak_kwh = total_kwh * peak_fraction
    offpeak_kwh = total_kwh * (1-peak_fraction)
    return round(peak_kwh,2), round(offpeak_kwh,2)

# -----------------------------
# 6️⃣ Bill calculation
def calculate_bill(peak_kwh, offpeak_kwh, utility):
    rates = utility_rates[utility]
    return round(peak_kwh*rates["peak"] + offpeak_kwh*rates["offpeak"] + rates["fixed"], 2)

# -----------------------------
# 7️⃣ Simulate dataset
data = []

for _ in range(num_households):
    zip_code = random.choice(zip_codes)
    residents = simulate_residents()
    home_size = simulate_home_size()
    house_type = simulate_house_type()
    ac_level = simulate_ac_level()
    climate = simulate_climate()
    time_type = simulate_time_usage()
    utility = assign_utility(zip_code)
    appliance_usage = simulate_appliance_usage()
    
    # Appliance kWh
    appliance_kwhs = appliance_kwh(appliance_usage)
    
    # HVAC kWh
    hvac = hvac_kwh(ac_level, climate, residents)
    
    # Total kWh
    total_kwh = sum(appliance_kwhs.values()) + hvac
    
    # Peak/off-peak
    peak, offpeak = peak_offpeak_split(total_kwh, time_type)
    
    # Bill
    bill = calculate_bill(peak, offpeak, utility)
    
    # Carbon
    carbon_kg = round(total_kwh * 0.4, 2)  # rough estimate
    
    # Placeholder user goals & recommendations
    target_bill = round(bill * random.uniform(0.7, 0.95), 2)
    predicted_bill = bill  # initial predicted = bill
    recommendation = "Reduce HVAC usage, unplug unused appliances, shift usage to off-peak"
    
    row = {
        "zip_code": zip_code,
        "utility": utility,
        "home_size_sqft": home_size,
        "residents": residents,
        "house_type": house_type,
        "ac_level": ac_level,
        "climate": climate,
        "time_usage_type": time_type,
        "total_kwh": round(total_kwh,2),
        "hvac_kwh": round(hvac,2),
        "peak_kwh": peak,
        "offpeak_kwh": offpeak,
        "bill_usd": bill,
        "carbon_kg": carbon_kg,
        "target_bill_usd": target_bill,
        "predicted_bill_usd": predicted_bill,
        "monthly_energy_saving_recommendation": recommendation
    }
    # Add appliance kWh & usage
    for app in appliances:
        row[app] = appliance_usage[app]
        row[f"{app}_kwh"] = appliance_kwhs[f"{app}_kwh"]
    
    data.append(row)

# -----------------------------
# 8️⃣ Save CSV
df = pd.DataFrame(data)
df.to_csv("simulated_energy_data.csv", index=False)
print("✅ Simulated dataset saved as simulated_energy_data.csv")
