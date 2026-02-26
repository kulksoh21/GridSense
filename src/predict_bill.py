# predict_bill.py
import pandas as pd
import numpy as np
import joblib
import random

# -----------------------------
# 1️⃣ Load trained model
# -----------------------------
model = joblib.load("best_energy_model.pkl")
print("✅ Model loaded successfully.")

# -----------------------------
# 2️⃣ Helper functions
# -----------------------------

# HVAC kWh estimation
def hvac_kwh(ac_level, climate, residents):
    base = {"low": 200, "medium": 400, "high": 600}
    climate_factor = {"coastal": 1, "inland": 1.2, "desert": 1.5, "mountain": 0.8}
    return base[ac_level] * climate_factor[climate] * (0.8 + 0.05 * residents)

# Appliance kWh
def appliance_kwh(appliance_dict):
    return {
        "fridge_kwh": appliance_dict.get("fridge", 0) * 30,
        "washer_kwh": appliance_dict.get("washer", 0) * 10,
        "dryer_kwh": appliance_dict.get("dryer", 0) * 25,
        "dishwasher_kwh": appliance_dict.get("dishwasher", 0) * 15,
        "ev_charger_kwh": appliance_dict.get("ev_charger", 0) * random.randint(100, 400),
        "pool_pump_kwh": appliance_dict.get("pool_pump", 0) * random.randint(50, 150),
    }

# Peak/off-peak split
def peak_offpeak_split(total_kwh, time_type):
    if time_type in ["morning_peak", "evening_peak"]:
        peak_fraction = 0.7
    elif time_type == "off_peak":
        peak_fraction = 0.2
    else:  # mixed
        peak_fraction = 0.5
    peak_kwh = total_kwh * peak_fraction
    offpeak_kwh = total_kwh * (1 - peak_fraction)
    return round(peak_kwh, 2), round(offpeak_kwh, 2)

# Bill calculation
utility_rates = {
    "PG&E": {"peak": 0.35, "offpeak": 0.15, "fixed": 15},
    "SCE": {"peak": 0.32, "offpeak": 0.14, "fixed": 12},
    "SDG&E": {"peak": 0.38, "offpeak": 0.16, "fixed": 18},
}

def calculate_bill(peak_kwh, offpeak_kwh, utility):
    rates = utility_rates[utility]
    return round(peak_kwh * rates["peak"] + offpeak_kwh * rates["offpeak"] + rates["fixed"], 2)

# -----------------------------
# 3️⃣ Prediction function
# -----------------------------
def predict_energy_bill(user_input):
    """
    user_input: dict with keys:
        home_size_sqft, residents, ac_level, climate, time_usage_type, 
        fridge, washer, dryer, dishwasher, ev_charger, pool_pump
    """
    # Set defaults for missing keys
    defaults = {
        "ac_level": "medium",
        "climate": "coastal",
        "time_usage_type": "mixed",
        "fridge": 0, "washer": 0, "dryer": 0,
        "dishwasher": 0, "ev_charger": 0, "pool_pump": 0
    }
    for key, val in defaults.items():
        if key not in user_input:
            user_input[key] = val

    # -----------------------------
    # Compute derived features
    # -----------------------------
    appliances_dict = {app: user_input[app] for app in ["fridge", "washer", "dryer", "dishwasher", "ev_charger", "pool_pump"]}
    appliance_kwhs = appliance_kwh(appliances_dict)
    hvac = hvac_kwh(user_input["ac_level"], user_input["climate"], user_input["residents"])
    total_kwh = sum(appliance_kwhs.values()) + hvac
    peak_kwh, offpeak_kwh = peak_offpeak_split(total_kwh, user_input["time_usage_type"])
    carbon_kg = round(total_kwh * 0.4, 2)
    appliance_count = sum(appliances_dict.values())
    residents_per_sqft = user_input["residents"] / user_input["home_size_sqft"]
    hvac_intensity = user_input["home_size_sqft"] * user_input["residents"]
    has_ev_or_pool = int(user_input.get("ev_charger", 0) or user_input.get("pool_pump", 0))

    # -----------------------------
    # Build dataframe for model
    # -----------------------------
    df = pd.DataFrame([{
        "ac_level": user_input["ac_level"],
        "climate": user_input["climate"],
        "time_usage_type": user_input["time_usage_type"],
        "home_size_sqft": user_input["home_size_sqft"],
        "residents": user_input["residents"],
        "total_kwh": total_kwh,
        "carbon_kg": carbon_kg,
        "appliance_count": appliance_count,
        "residents_per_sqft": residents_per_sqft,
        "hvac_intensity": hvac_intensity,
        "has_ev_or_pool": has_ev_or_pool
    }])

    # -----------------------------
    # Predict bill
    # -----------------------------
    pred_bill = model.predict(df)[0]

    # -----------------------------
    # Return full info
    # -----------------------------
    return {
        "predicted_bill_usd": round(pred_bill, 2),
        "total_kwh": round(total_kwh, 2),
        "hvac_kwh": round(hvac, 2),
        "peak_kwh": peak_kwh,
        "offpeak_kwh": offpeak_kwh,
        "carbon_kg": carbon_kg,
        "monthly_energy_saving_recommendation": "Reduce HVAC usage, unplug unused appliances, shift usage to off-peak"
    }

# -----------------------------
# 4️⃣ Example usage
# -----------------------------
if __name__ == "__main__":
    user_input = {
        "zip_code": "94022",
        "utility": "PG&E",
        "home_size_sqft": 2000,
        "residents": 3,
        "house_type": "detached",
        "ac_level": "medium",
        "climate": "inland",
        "time_usage_type": "mixed",
        "fridge": 1, "washer": 1, "dryer": 0,
        "dishwasher": 1, "ev_charger": 0, "pool_pump": 0
    }

    bill_info = predict_energy_bill(user_input)
    print("\n📊 Predicted Energy Bill & Info")
    for k, v in bill_info.items():
        print(f"{k}: {v}")