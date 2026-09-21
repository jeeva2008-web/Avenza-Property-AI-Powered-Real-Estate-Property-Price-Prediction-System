import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error
import joblib

MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

# Locality base rates per sqft for Tamil Nadu (aligned with Tamil Nadu real estate registrations and market rates)
LOCALITY_BASE_RATES = {
    # Pollachi Localities
    "mahalingapuram": {"house": 4600, "land": 2200, "tier": 1.25},
    "kovilpalayam": {"house": 3900, "land": 1750, "tier": 1.05},
    "anaimalai": {"house": 3800, "land": 1600, "tier": 1.02},
    "kinathukadavu": {"house": 3700, "land": 1550, "tier": 1.0},
    "suleeswaranpatti": {"house": 4100, "land": 1900, "tier": 1.1},
    "zamin uthukuli": {"house": 3600, "land": 1500, "tier": 0.98},
    "samathur": {"house": 3500, "land": 1400, "tier": 0.95},
    "negamam": {"house": 3400, "land": 1350, "tier": 0.92},
    "vettaikaranpudur": {"house": 3600, "land": 1450, "tier": 0.97},
    "aliyar": {"house": 3900, "land": 1700, "tier": 1.05},
    "meenakshipuram": {"house": 3500, "land": 1400, "tier": 0.95},
    "gomangalam": {"house": 3300, "land": 1300, "tier": 0.90},
    "servakaranpalayam": {"house": 3400, "land": 1350, "tier": 0.92},
    "venkatesa colony": {"house": 4500, "land": 2100, "tier": 1.20},
    "palakkad road": {"house": 4700, "land": 2300, "tier": 1.28},
    "udumalpet road": {"house": 4400, "land": 2050, "tier": 1.18},
    "achipatti": {"house": 4000, "land": 1800, "tier": 1.08},
    "kottur road": {"house": 4200, "land": 1950, "tier": 1.12},
    "jothi nagar": {"house": 4350, "land": 2000, "tier": 1.15},
    "nethaji road": {"house": 4600, "land": 2250, "tier": 1.25},
    "pollachi town": {"house": 4800, "land": 2400, "tier": 1.30},

    # Coimbatore City
    "rs puram": {"house": 7500, "land": 4200, "tier": 1.95},
    "gandhipuram": {"house": 7200, "land": 4000, "tier": 1.88},
    "peelamedu": {"house": 6800, "land": 3700, "tier": 1.78},
    "saibaba colony": {"house": 6500, "land": 3500, "tier": 1.70},
    "saravanampatti": {"house": 5400, "land": 2800, "tier": 1.42},
    "vadavalli": {"house": 5200, "land": 2600, "tier": 1.38},
    "singanallur": {"house": 5000, "land": 2500, "tier": 1.32},
    "ganapathy": {"house": 5100, "land": 2600, "tier": 1.35},
    "ramanathapuram": {"house": 5800, "land": 3100, "tier": 1.52},

    # Chennai
    "anna nagar": {"house": 12500, "land": 8500, "tier": 3.20},
    "t. nagar": {"house": 14000, "land": 9800, "tier": 3.60},
    "adyar": {"house": 13500, "land": 9200, "tier": 3.50},
    "besant nagar": {"house": 14500, "land": 10200, "tier": 3.75},
    "velachery": {"house": 8200, "land": 5200, "tier": 2.15},
    "omr (sholinganallur)": {"house": 7500, "land": 4500, "tier": 1.95},
    "ecr (thiruvanmiyur)": {"house": 11000, "land": 7500, "tier": 2.85},
    "porur": {"house": 6800, "land": 3900, "tier": 1.78},
    "tambaram": {"house": 5800, "land": 3100, "tier": 1.52},
    "kilpauk": {"house": 11500, "land": 7800, "tier": 2.95},

    # Madurai
    "kk nagar": {"house": 5800, "land": 3100, "tier": 1.52},
    "mattuthavani": {"house": 5100, "land": 2500, "tier": 1.35},

    # Salem
    "fairlands": {"house": 5400, "land": 2800, "tier": 1.42},
    "alagapuram": {"house": 5000, "land": 2500, "tier": 1.32},

    # Tiruppur
    "avinashi road": {"house": 5300, "land": 2700, "tier": 1.40},

    # Erode
    "perundurai road": {"house": 5100, "land": 2600, "tier": 1.35},
    "thindal": {"house": 4900, "land": 2450, "tier": 1.30}
}

HOUSE_TYPE_MULT = {
    "Independent House": 1.0,
    "Villa": 1.25,
    "Apartment": 0.95,
    "Flat": 0.90,
    "Duplex": 1.15,
    "Row House": 1.05
}

LAND_TYPE_MULT = {
    "Residential": 1.0,
    "Commercial": 1.55,
    "Agricultural": 0.55
}

def get_locality_rate(locality_name: str, property_category: str) -> float:
    key = locality_name.strip().lower()
    if key in LOCALITY_BASE_RATES:
        return float(LOCALITY_BASE_RATES[key][property_category])
    # Substring search
    for k, v in LOCALITY_BASE_RATES.items():
        if k in key or key in k:
            return float(v[property_category])
    # Fallback to standard Tamil Nadu town average
    return 4200.0 if property_category == "house" else 1900.0

def generate_house_dataset(n_samples=2500, seed=42):
    np.random.seed(seed)
    localities = list(LOCALITY_BASE_RATES.keys())
    house_types = list(HOUSE_TYPE_MULT.keys())

    data = []
    for _ in range(n_samples):
        loc = np.random.choice(localities)
        loc_base_rate = LOCALITY_BASE_RATES[loc]["house"]
        htype = np.random.choice(house_types)
        type_mult = HOUSE_TYPE_MULT[htype]

        # Features
        built_up_area = float(np.random.randint(700, 4800))
        land_area = float(max(built_up_area * np.random.uniform(0.7, 1.8), 800))
        bedrooms = int(max(1, min(6, round(built_up_area / 650) + np.random.choice([-1, 0, 1]))))
        bathrooms = int(max(1, min(bedrooms + 1, bedrooms + np.random.choice([0, 1]))))
        floors = int(np.random.choice([1, 2, 3], p=[0.45, 0.45, 0.1]))
        parking = int(np.random.choice([1, 2, 3], p=[0.6, 0.35, 0.05]))
        property_age = float(np.random.randint(0, 20))
        road_width = float(np.random.choice([20, 25, 30, 33, 40, 50, 60], p=[0.1, 0.15, 0.3, 0.2, 0.15, 0.07, 0.03]))

        # Nearby facility distances (km)
        dist_school = float(np.round(np.random.uniform(0.2, 5.0), 2))
        dist_hospital = float(np.round(np.random.uniform(0.3, 7.0), 2))
        dist_supermarket = float(np.round(np.random.uniform(0.1, 4.0), 2))
        dist_bus_stop = float(np.round(np.random.uniform(0.1, 3.0), 2))
        dist_rail_metro = float(np.round(np.random.uniform(0.5, 15.0), 2))
        dist_bank_atm = float(np.round(np.random.uniform(0.1, 3.5), 2))
        dist_park = float(np.round(np.random.uniform(0.2, 4.0), 2))
        dist_main_road = float(np.round(np.random.uniform(0.05, 3.0), 2))

        # Valuation math based on real estate economics:
        # Base value = built_up_area * loc_base_rate * type_mult
        age_depreciation = max(0.75, 1.0 - (property_age * 0.015))
        road_premium = 1.0 + (road_width - 30) * 0.004

        # Facility proximity premium (closer facilities within 1-2km add positive value)
        facility_score = (
            max(0, 2.0 - dist_school) * 0.015 +
            max(0, 2.5 - dist_hospital) * 0.02 +
            max(0, 1.5 - dist_supermarket) * 0.01 +
            max(0, 1.0 - dist_bus_stop) * 0.015 +
            max(0, 5.0 - dist_rail_metro) * 0.008 +
            max(0, 1.0 - dist_bank_atm) * 0.008 +
            max(0, 1.5 - dist_park) * 0.01 +
            max(0, 1.0 - dist_main_road) * 0.02
        )
        facility_multiplier = 1.0 + facility_score

        # Land area component adds supplementary equity
        land_equity = (land_area - built_up_area * 0.6) * (LOCALITY_BASE_RATES[loc]["land"] * 0.5)
        land_equity = max(0, land_equity)

        # Baseline predicted price with slight realistic Gaussian market variance (±3%)
        clean_price = (built_up_area * loc_base_rate * type_mult * age_depreciation * road_premium * facility_multiplier) + land_equity
        noise = np.random.normal(0, 0.03 * clean_price)
        price = round(clean_price + noise, -3) # Rounded to thousands

        data.append({
            "locality_base_rate": loc_base_rate,
            "type_multiplier": type_mult,
            "built_up_area": built_up_area,
            "land_area": land_area,
            "bedrooms": bedrooms,
            "bathrooms": bathrooms,
            "floors": floors,
            "parking": parking,
            "property_age": property_age,
            "road_width": road_width,
            "dist_school": dist_school,
            "dist_hospital": dist_hospital,
            "dist_supermarket": dist_supermarket,
            "dist_bus_stop": dist_bus_stop,
            "dist_rail_metro": dist_rail_metro,
            "dist_bank_atm": dist_bank_atm,
            "dist_park": dist_park,
            "dist_main_road": dist_main_road,
            "price": price
        })

    return pd.DataFrame(data)

def generate_land_dataset(n_samples=2500, seed=42):
    np.random.seed(seed)
    localities = list(LOCALITY_BASE_RATES.keys())
    land_types = list(LAND_TYPE_MULT.keys())

    data = []
    for _ in range(n_samples):
        loc = np.random.choice(localities)
        loc_base_rate = LOCALITY_BASE_RATES[loc]["land"]
        ltype = np.random.choice(land_types)
        type_mult = LAND_TYPE_MULT[ltype]

        # Features
        if ltype == "Agricultural":
            land_area = float(np.random.choice([10890, 21780, 43560, 87120])) # 0.25 to 2 acres
            road_width = float(np.random.choice([15, 20, 25, 30], p=[0.3, 0.4, 0.2, 0.1]))
        elif ltype == "Commercial":
            land_area = float(np.random.randint(2000, 15000))
            road_width = float(np.random.choice([40, 50, 60, 80, 100], p=[0.25, 0.3, 0.25, 0.1, 0.1]))
        else: # Residential
            land_area = float(np.random.randint(1200, 6000))
            road_width = float(np.random.choice([25, 30, 33, 40, 50], p=[0.2, 0.4, 0.25, 0.1, 0.05]))

        dist_main_road = float(np.round(np.random.uniform(0.02, 5.0), 2))
        dist_school = float(np.round(np.random.uniform(0.3, 6.0), 2))
        dist_hospital = float(np.round(np.random.uniform(0.5, 8.0), 2))
        dist_transport = float(np.round(np.random.uniform(0.2, 8.0), 2))

        # Commercial and Residential land value scales with road frontage width & proximity to main road
        road_factor = 1.0 + (road_width - 30) * 0.005
        main_road_factor = max(0.85, 1.15 - (dist_main_road * 0.06))
        facility_boost = 1.0 + (max(0, 2.0 - dist_school) * 0.01 + max(0, 2.0 - dist_hospital) * 0.015 + max(0, 2.0 - dist_transport) * 0.015)

        clean_price = land_area * loc_base_rate * type_mult * road_factor * main_road_factor * facility_boost
        noise = np.random.normal(0, 0.03 * clean_price)
        price = round(clean_price + noise, -3)

        data.append({
            "locality_base_rate": loc_base_rate,
            "type_multiplier": type_mult,
            "land_area": land_area,
            "road_width": road_width,
            "dist_main_road": dist_main_road,
            "dist_school": dist_school,
            "dist_hospital": dist_hospital,
            "dist_transport": dist_transport,
            "price": price
        })

    return pd.DataFrame(data)

def train_and_evaluate_pipeline(df: pd.DataFrame, target_col: str, model_type_name: str):
    print(f"\n================ Training Pipeline for {model_type_name} ================")
    X = df.drop(columns=[target_col])
    y = df[target_col]

    feature_names = list(X.columns)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    candidates = {
        "Linear Regression": LinearRegression(),
        "Random Forest Regressor": RandomForestRegressor(n_estimators=120, max_depth=12, random_state=42),
        "Gradient Boosting Regressor": GradientBoostingRegressor(n_estimators=150, learning_rate=0.08, max_depth=5, random_state=42)
    }

    results = []
    best_model_name = None
    best_r2 = -float("inf")
    trained_models = {}

    for name, model in candidates.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)

        r2 = float(r2_score(y_test, preds))
        mae = float(mean_absolute_error(y_test, preds))
        rmse = float(np.sqrt(mean_squared_error(y_test, preds)))

        print(f"Model: {name}")
        print(f"  R² Score: {r2:.4f}")
        print(f"  MAE: ₹{mae:,.2f}")
        print(f"  RMSE: ₹{rmse:,.2f}")

        trained_models[name] = model
        results.append({
            "modelName": name,
            "r2": round(r2, 4),
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "isBest": False
        })

        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name

    # Mark the best model
    for r in results:
        if r["modelName"] == best_model_name:
            r["isBest"] = True

    best_model = trained_models[best_model_name]
    print(f"\nBest Selected Model for {model_type_name}: {best_model_name} (R² = {best_r2:.4f})")

    # Save artifacts
    model_path = os.path.join(MODELS_DIR, f"{model_type_name.lower()}_best_model.joblib")
    meta_path = os.path.join(MODELS_DIR, f"{model_type_name.lower()}_meta.json")

    joblib.dump(best_model, model_path)

    metadata = {
        "model_type": model_type_name,
        "best_model_name": best_model_name,
        "feature_names": feature_names,
        "evaluation_metrics": results
    }

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"Artifacts successfully saved to {model_path} and {meta_path}")
    return metadata

def main():
    print("Starting ML Model Training for Avenza Property...")
    house_df = generate_house_dataset(2500)
    train_and_evaluate_pipeline(house_df, "price", "house")

    land_df = generate_land_dataset(2500)
    train_and_evaluate_pipeline(land_df, "price", "land")
    print("\nAll ML models successfully trained, evaluated, and saved.")

if __name__ == "__main__":
    main()
