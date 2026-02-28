import pandas as pd
import joblib

model = joblib.load("best_energy_model.pkl")



def hvac_kwh(ac_level, climate, residents):
    base = {"low": 200, "medium": 400, "high": 600}
    climate_factor = {
        "coastal": 1,
        "inland": 1.2,
        "desert": 1.5,
        "mountain": 0.8
    }

    return (
        base.get(ac_level, 400)
        * climate_factor.get(climate, 1)
        * (0.8 + 0.05 * residents)
    )

def appliance_kwh(appliance_dict):
    return {
        "fridge_kwh": appliance_dict.get("fridge", 0) * 30,
        "washer_kwh": appliance_dict.get("washer", 0) * 10,
        "dryer_kwh": appliance_dict.get("dryer", 0) * 25,
        "dishwasher_kwh": appliance_dict.get("dishwasher", 0) * 15,
        "ev_charger_kwh": appliance_dict.get("ev_charger", 0) * 300,
        "pool_pump_kwh": appliance_dict.get("pool_pump", 0) * 100,
    }

def peak_offpeak_split(total_kwh, time_type):
    if time_type in ["morning_peak", "evening_peak"]:
        peak_fraction = 0.7
    elif time_type == "off_peak":
        peak_fraction = 0.2
    else:
        peak_fraction = 0.5

    peak_kwh = total_kwh * peak_fraction
    offpeak_kwh = total_kwh * (1 - peak_fraction)

    return round(peak_kwh, 2), round(offpeak_kwh, 2)


utility_rates = {
    "PG&E": {"peak": 0.35, "offpeak": 0.15, "fixed": 15},
    "SCE": {"peak": 0.32, "offpeak": 0.14, "fixed": 12},
    "SDG&E": {"peak": 0.38, "offpeak": 0.16, "fixed": 18},
}


def calculate_bill(peak_kwh, offpeak_kwh, utility):
    rates = utility_rates.get(utility, utility_rates["PG&E"])

    return round(
        peak_kwh * rates["peak"]
        + offpeak_kwh * rates["offpeak"]
        + rates["fixed"],
        2,
    )


def carbon_equivalents(carbon_kg_month):
    car_miles = carbon_kg_month * 48
    trees_needed = carbon_kg_month / 21
    flights_equiv = carbon_kg_month / 250

    return (
        round(car_miles),
        round(trees_needed, 2),
        round(flights_equiv, 2),
    )

def generate_recommendations(features, peak_kwh, offpeak_kwh):
    recs = []

    if features["hvac_kwh"] > 350:
        recs.append({
            "tip": "Increase AC setpoint by 2°F",
            "priority": "HIGH",
            "estimated_savings_usd": 18,
            "estimated_savings_kwh": 60
        })

    if features["appliances"].get("ev_charger", 0):
        recs.append({
            "tip": "Charge EV during off-peak hours",
            "priority": "MEDIUM",
            "estimated_savings_usd": 12,
            "estimated_savings_kwh": 40
        })

    if peak_kwh > offpeak_kwh:
        recs.append({
            "tip": "Shift usage to off-peak hours",
            "priority": "MEDIUM",
            "estimated_savings_usd": 6,
            "estimated_savings_kwh": 20
        })

    if sum(features["appliances"].values()) > 3:
        recs.append({
            "tip": "Unplug unused standby electronics",
            "priority": "LOW",
            "estimated_savings_usd": 3,
            "estimated_savings_kwh": 8
        })

    return recs


def predict_energy_bill(user_input):

    defaults = {
        "ac_level": "medium",
        "climate": "coastal",
        "time_usage_type": "mixed",
        "fridge": 0,
        "washer": 0,
        "dryer": 0,
        "dishwasher": 0,
        "ev_charger": 0,
        "pool_pump": 0,
    }

    for key, val in defaults.items():
        user_input.setdefault(key, val)


    appliances_dict = {
        app: user_input[app]
        for app in [
            "fridge",
            "washer",
            "dryer",
            "dishwasher",
            "ev_charger",
            "pool_pump",
        ]
    }

    appliance_kwhs = appliance_kwh(appliances_dict)
    hvac = hvac_kwh(
        user_input["ac_level"],
        user_input["climate"],
        user_input["residents"],
    )

    total_kwh = sum(appliance_kwhs.values()) + hvac
    peak_kwh, offpeak_kwh = peak_offpeak_split(
        total_kwh, user_input["time_usage_type"]
    )

    carbon_kg = round(total_kwh * 0.4, 2)

    # Model features
    df = pd.DataFrame([{
        "ac_level": user_input["ac_level"],
        "climate": user_input["climate"],
        "time_usage_type": user_input["time_usage_type"],
        "home_size_sqft": user_input["home_size_sqft"],
        "residents": user_input["residents"],
        "total_kwh": total_kwh,
        "carbon_kg": carbon_kg,
        "appliance_count": sum(appliances_dict.values()),
        "residents_per_sqft":
            user_input["residents"] / user_input["home_size_sqft"],
        "hvac_intensity":
            user_input["home_size_sqft"] * user_input["residents"],
        "has_ev_or_pool":
            int(appliances_dict["ev_charger"] or appliances_dict["pool_pump"]),
    }])

    predicted_bill = round(model.predict(df)[0], 2)

    car_miles, trees, flights = carbon_equivalents(carbon_kg)

    recommendations = generate_recommendations(
        features={"hvac_kwh": hvac, "appliances": appliances_dict},
        peak_kwh=peak_kwh,
        offpeak_kwh=offpeak_kwh,
    )

    eco_score = max(0, 100 - int((total_kwh / 1000) * 10))

    return {
        "predicted_bill_usd": predicted_bill,
        "total_kwh": round(total_kwh, 2),
        "peak_kwh": peak_kwh,
        "offpeak_kwh": offpeak_kwh,
        "carbon_kg_month": carbon_kg,
        "carbon_kg_year": round(carbon_kg * 12, 2),
        "carbon_equiv_car_miles": car_miles,
        "carbon_equiv_trees_needed": trees,
        "carbon_equiv_flights": flights,
        "eco_score": eco_score,
        "recommendations": recommendations,
    }