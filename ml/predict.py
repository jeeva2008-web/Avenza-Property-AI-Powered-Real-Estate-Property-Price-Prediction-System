import sys
import os
import json
import numpy as np
import pandas as pd
import joblib

MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")

LOCALITY_BASE_RATES = {
    # Pollachi Localities
    "mahalingapuram": {"house": 4600, "land": 2200, "tier_name": "Prime Residential & Commercial Hub"},
    "kovilpalayam": {"house": 3900, "land": 1750, "tier_name": "Established Suburban Residential Area"},
    "anaimalai": {"house": 3800, "land": 1600, "tier_name": "Scenic Eco & Agricultural Corridor"},
    "kinathukadavu": {"house": 3700, "land": 1550, "tier_name": "Coimbatore-Pollachi High Growth Corridor"},
    "suleeswaranpatti": {"house": 4100, "land": 1900, "tier_name": "Rapidly Developing Residential Belt"},
    "zamin uthukuli": {"house": 3600, "land": 1500, "tier_name": "Heritage & Agricultural Township"},
    "samathur": {"house": 3500, "land": 1400, "tier_name": "Tranquil Residential Zone"},
    "negamam": {"house": 3400, "land": 1350, "tier_name": "Traditional Handloom & Rural Center"},
    "vettaikaranpudur": {"house": 3600, "land": 1450, "tier_name": "Agro-Residential Sector"},
    "aliyar": {"house": 3900, "land": 1700, "tier_name": "High Tourism & Scenic Foothills Zone"},
    "meenakshipuram": {"house": 3500, "land": 1400, "tier_name": "Border Gateway & Agricultural Corridor"},
    "gomangalam": {"house": 3300, "land": 1300, "tier_name": "Peaceful Rural Township"},
    "servakaranpalayam": {"house": 3400, "land": 1350, "tier_name": "Developing Suburban Locality"},
    "venkatesa colony": {"house": 4500, "land": 2100, "tier_name": "High Demand Central Residential Colony"},
    "palakkad road": {"house": 4700, "land": 2300, "tier_name": "High Traffic Commercial & Living Avenue"},
    "udumalpet road": {"house": 4400, "land": 2050, "tier_name": "Key State Highway Connecting Corridor"},
    "achipatti": {"house": 4000, "land": 1800, "tier_name": "Emerging Industrial & Residential Mix"},
    "kottur road": {"house": 4200, "land": 1950, "tier_name": "Popular Southern Residential Link"},
    "jothi nagar": {"house": 4350, "land": 2000, "tier_name": "Well-Planned Urban Housing Colony"},
    "nethaji road": {"house": 4600, "land": 2250, "tier_name": "Central Commercial & High Street Zone"},
    "pollachi town": {"house": 4800, "land": 2400, "tier_name": "Heart of Pollachi Municipality"},

    # Coimbatore City
    "rs puram": {"house": 7500, "land": 4200, "tier_name": "Premium Commercial & Wealthy Enclave"},
    "gandhipuram": {"house": 7200, "land": 4000, "tier_name": "Coimbatore Commercial Core"},
    "peelamedu": {"house": 6800, "land": 3700, "tier_name": "Airport & Education Institutional Hub"},
    "saibaba colony": {"house": 6500, "land": 3500, "tier_name": "Elite Residential Colony"},
    "saravanampatti": {"house": 5400, "land": 2800, "tier_name": "Major IT Special Economic Zone"},
    "vadavalli": {"house": 5200, "land": 2600, "tier_name": "Scenic Western Residential Suburb"},
    "singanallur": {"house": 5000, "land": 2500, "tier_name": "Industrial & Bus Terminus Hub"},
    "ganapathy": {"house": 5100, "land": 2600, "tier_name": "Densely Populated Commercial Suburb"},
    "ramanathapuram": {"house": 5800, "land": 3100, "tier_name": "Prime Trichy Road Arterial Zone"},

    # Chennai
    "anna nagar": {"house": 12500, "land": 8500, "tier_name": "Prime Planned Northern Metropolitan Zone"},
    "t. nagar": {"house": 14000, "land": 9800, "tier_name": "India's Highest Grossing Retail & Commercial District"},
    "adyar": {"house": 13500, "land": 9200, "tier_name": "Prestigious South Chennai Riverfront Enclave"},
    "besant nagar": {"house": 14500, "land": 10200, "tier_name": "Coastal Luxury Residential Area"},
    "velachery": {"house": 8200, "land": 5200, "tier_name": "Vibrant Transit & Commercial Center"},
    "omr (sholinganallur)": {"house": 7500, "land": 4500, "tier_name": "Chennai Cyber Corridor IT Highway"},
    "ecr (thiruvanmiyur)": {"house": 11000, "land": 7500, "tier_name": "Scenic Coastal Road & Luxury Residences"},
    "porur": {"house": 6800, "land": 3900, "tier_name": "Healthcare & West Chennai IT Cluster"},
    "tambaram": {"house": 5800, "land": 3100, "tier_name": "Southern Gateway Major Transit Junction"},
    "kilpauk": {"house": 11500, "land": 7800, "tier_name": "Central Heritage Medical & Residential Zone"},

    # Madurai
    "kk nagar": {"house": 5800, "land": 3100, "tier_name": "Madurai's Premier Residential Colony"},
    "mattuthavani": {"house": 5100, "land": 2500, "tier_name": "Major Integrated Bus Terminal Zone"},

    # Salem
    "fairlands": {"house": 5400, "land": 2800, "tier_name": "Top Residential Colony in Salem"},
    "alagapuram": {"house": 5000, "land": 2500, "tier_name": "High-Demand Suburban Enclave"},

    # Tiruppur
    "avinashi road": {"house": 5300, "land": 2700, "tier_name": "Knitwear Capital Commercial Corridor"},

    # Erode
    "perundurai road": {"house": 5100, "land": 2600, "tier_name": "Educational & Healthcare Arterial Belt"},
    "thindal": {"house": 4900, "land": 2450, "tier_name": "Upscale Hilltop Residential Area"}
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

def format_inr(number: float) -> str:
    n = int(round(number))
    if n >= 10000000:
        cr = n / 10000000
        return f"₹{cr:.2f} Cr"
    elif n >= 100000:
        lakhs = n / 100000
        return f"₹{lakhs:.2f} Lakhs"
    else:
        return f"₹{n:,}"

def get_locality_info(locality_name: str, category: str):
    key = locality_name.strip().lower()
    if key in LOCALITY_BASE_RATES:
        return LOCALITY_BASE_RATES[key][category], LOCALITY_BASE_RATES[key]["tier_name"]
    for k, v in LOCALITY_BASE_RATES.items():
        if k in key or key in k:
            return v[category], v["tier_name"]
    default_rate = 4200.0 if category == "house" else 1900.0
    return default_rate, "Standard Tamil Nadu Municipal Sector"

def clean_numeric(val, default=0.0):
    if val is None:
        return default
    if isinstance(val, (int, float)):
        return float(val)
    s = str(val).strip().lower()
    # Handle display strings e.g. "3 BHK", "3 Baths", "2 Floors", "1 Car", "40 ft"
    import re
    m = re.search(r"[-+]?\d*\.?\d+", s)
    if m:
        try:
            return float(m.group())
        except ValueError:
            return default
    return default

def predict_house(payload):
    model_path = os.path.join(MODELS_DIR, "house_best_model.joblib")
    meta_path = os.path.join(MODELS_DIR, "house_meta.json")

    if not os.path.exists(model_path) or not os.path.exists(meta_path):
        raise FileNotFoundError("House ML model not trained yet. Run train_models.py first.")

    model = joblib.load(model_path)
    with open(meta_path, "r") as f:
        meta = json.load(f)

    locality = payload.get("locality", "Mahalingapuram")
    loc_base_rate, loc_tier_name = get_locality_info(locality, "house")

    prop_type = payload.get("propertyType", "Villa")
    type_mult = HOUSE_TYPE_MULT.get(prop_type, 1.0)

    built_up_area = clean_numeric(payload.get("builtUpArea"), 2000.0)
    land_area = clean_numeric(payload.get("landArea"), built_up_area * 1.2)
    bedrooms = int(clean_numeric(payload.get("bedrooms"), 3))
    bathrooms = int(clean_numeric(payload.get("bathrooms"), 3))
    floors = int(clean_numeric(payload.get("floors"), 2))
    parking = int(clean_numeric(payload.get("parking"), 1))
    property_age = clean_numeric(payload.get("propertyAge"), 1.0)
    road_width = clean_numeric(payload.get("roadWidth"), 30.0)

    # Nearby facilities (km)
    nf = payload.get("nearbyFacilities", {})
    dist_school = clean_numeric(nf.get("school", payload.get("distSchool")), 1.0)
    dist_hospital = clean_numeric(nf.get("hospital", payload.get("distHospital")), 1.5)
    dist_supermarket = clean_numeric(nf.get("supermarket", payload.get("distSupermarket")), 0.8)
    dist_bus_stop = clean_numeric(nf.get("busStop", payload.get("distBusStop")), 0.5)
    dist_rail_metro = clean_numeric(nf.get("railwayStation", nf.get("metro", payload.get("distRailMetro"))), 3.0)
    dist_bank_atm = clean_numeric(nf.get("bankAtm", payload.get("distBankAtm")), 0.5)
    dist_park = clean_numeric(nf.get("park", payload.get("distPark")), 0.8)
    dist_main_road = clean_numeric(nf.get("mainRoad", payload.get("distMainRoad")), 0.3)

    feature_dict = {
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
        "dist_main_road": dist_main_road
    }

    # Ensure feature order matches trained model
    X_input = pd.DataFrame([feature_dict])[meta["feature_names"]]
    predicted_val = float(model.predict(X_input)[0])
    predicted_price = int(round(max(predicted_val, 1500000)))

    price_per_sqft = int(round(predicted_price / built_up_area)) if built_up_area > 0 else 0

    lower_bound = predicted_price * 0.95
    upper_bound = predicted_price * 1.08
    estimated_range = f"{format_inr(lower_bound)} - {format_inr(upper_bound)}"

    # Factors explaining the price
    factors = [
        {
            "factor": f"Location Premium ({locality})",
            "impact": f"₹{int(loc_base_rate):,}/sq.ft baseline",
            "description": f"{loc_tier_name} in {payload.get('district', 'Tamil Nadu')}",
            "type": "positive" if loc_base_rate >= 4000 else "neutral"
        },
        {
            "factor": f"Built-up Living Area ({int(built_up_area):,} sq.ft)",
            "impact": format_inr(built_up_area * loc_base_rate * 0.8),
            "description": f"Primary space valuation across {bedrooms} BHK layout and {floors} floor(s)",
            "type": "positive"
        },
        {
            "factor": f"Property Type ({prop_type})",
            "impact": f"{'+' if type_mult >= 1.0 else '-'}{abs(int((type_mult - 1.0) * 100))}% modifier",
            "description": "Premium tier weighting for architectural category",
            "type": "positive" if type_mult >= 1.0 else "neutral"
        },
        {
            "factor": f"Road Accessibility ({int(road_width)} ft Road)",
            "impact": "+Positive" if road_width >= 30 else "Standard",
            "description": f"Direct vehicular approach via {int(road_width)} ft frontage",
            "type": "positive" if road_width >= 30 else "neutral"
        },
        {
            "factor": "Essential Proximity (School & Hospital)",
            "impact": f"{dist_school} km / {dist_hospital} km",
            "description": "Proximity to key public amenities enhances resident appeal",
            "type": "positive" if (dist_school < 2.0 and dist_hospital < 3.0) else "neutral"
        },
        {
            "factor": "Transit Connectivity (Bus & Rail/Metro)",
            "impact": f"{dist_bus_stop} km to bus / {dist_rail_metro} km to rail",
            "description": "Accessibility to key transportation links across the district",
            "type": "positive" if dist_bus_stop < 1.0 else "neutral"
        }
    ]

    return {
        "success": True,
        "category": "house",
        "estimated_price": predicted_price,
        "price_per_sqft": price_per_sqft,
        "estimated_range": estimated_range,
        "model_used": f"{meta['best_model_name']} (Trained ML Model)",
        "evaluation_metrics": {
            "best_model": meta["best_model_name"],
            "r2_score": next(m["r2"] for m in meta["evaluation_metrics"] if m["isBest"]),
            "mae": next(m["mae"] for m in meta["evaluation_metrics"] if m["isBest"]),
            "rmse": next(m["rmse"] for m in meta["evaluation_metrics"] if m["isBest"]),
            "models_evaluated": meta["evaluation_metrics"]
        },
        "factors": factors
    }

def predict_land(payload):
    model_path = os.path.join(MODELS_DIR, "land_best_model.joblib")
    meta_path = os.path.join(MODELS_DIR, "land_meta.json")

    if not os.path.exists(model_path) or not os.path.exists(meta_path):
        raise FileNotFoundError("Land ML model not trained yet. Run train_models.py first.")

    model = joblib.load(model_path)
    with open(meta_path, "r") as f:
        meta = json.load(f)

    locality = payload.get("locality", "Mahalingapuram")
    loc_base_rate, loc_tier_name = get_locality_info(locality, "land")

    land_type = payload.get("landType", payload.get("propertyType", "Residential"))
    type_mult = LAND_TYPE_MULT.get(land_type, 1.0)

    land_area = clean_numeric(payload.get("landArea"), 2400.0)
    road_width = clean_numeric(payload.get("roadWidth"), 33.0)

    nf = payload.get("nearbyFacilities", {})
    dist_main_road = clean_numeric(payload.get("distMainRoad", nf.get("mainRoad")), 0.5)
    dist_school = clean_numeric(payload.get("distSchool", nf.get("school")), 1.5)
    dist_hospital = clean_numeric(payload.get("distHospital", nf.get("hospital")), 2.0)
    dist_transport = clean_numeric(payload.get("distTransport", nf.get("busStop", nf.get("railwayStation"))), 1.0)

    feature_dict = {
        "locality_base_rate": loc_base_rate,
        "type_multiplier": type_mult,
        "land_area": land_area,
        "road_width": road_width,
        "dist_main_road": dist_main_road,
        "dist_school": dist_school,
        "dist_hospital": dist_hospital,
        "dist_transport": dist_transport
    }

    X_input = pd.DataFrame([feature_dict])[meta["feature_names"]]
    predicted_val = float(model.predict(X_input)[0])
    predicted_price = int(round(max(predicted_val, 500000)))

    price_per_sqft = int(round(predicted_price / land_area)) if land_area > 0 else 0

    lower_bound = predicted_price * 0.94
    upper_bound = predicted_price * 1.08
    estimated_range = f"{format_inr(lower_bound)} - {format_inr(upper_bound)}"

    factors = [
        {
            "factor": f"Locality Land Guideline ({locality})",
            "impact": f"₹{int(loc_base_rate):,}/sq.ft baseline",
            "description": f"{loc_tier_name} land rate benchmark",
            "type": "positive" if loc_base_rate >= 2000 else "neutral"
        },
        {
            "factor": f"Land Footprint ({int(land_area):,} sq.ft)",
            "impact": format_inr(land_area * loc_base_rate),
            "description": f"Total parcel extent calculated for {land_type} zoning",
            "type": "positive"
        },
        {
            "factor": f"Zoning & Land Category ({land_type})",
            "impact": f"{'+' if type_mult >= 1.0 else '-'}{abs(int((type_mult - 1.0) * 100))}% market factor",
            "description": "Commercial vs Residential vs Agricultural usage classification",
            "type": "positive" if type_mult >= 1.0 else "neutral"
        },
        {
            "factor": f"Access Road Width ({int(road_width)} ft)",
            "impact": "+Wide Frontage" if road_width >= 33 else "Standard Access",
            "description": f"Frontage access width directly impacts permissible floor space index (FSI)",
            "type": "positive" if road_width >= 33 else "neutral"
        },
        {
            "factor": "Main Road Distance",
            "impact": f"{dist_main_road} km",
            "description": "Direct connectivity to arterial thoroughfares and commercial transport",
            "type": "positive" if dist_main_road < 1.0 else "neutral"
        }
    ]

    return {
        "success": True,
        "category": "land",
        "estimated_price": predicted_price,
        "price_per_sqft": price_per_sqft,
        "estimated_range": estimated_range,
        "model_used": f"{meta['best_model_name']} (Trained ML Model)",
        "evaluation_metrics": {
            "best_model": meta["best_model_name"],
            "r2_score": next(m["r2"] for m in meta["evaluation_metrics"] if m["isBest"]),
            "mae": next(m["mae"] for m in meta["evaluation_metrics"] if m["isBest"]),
            "rmse": next(m["rmse"] for m in meta["evaluation_metrics"] if m["isBest"]),
            "models_evaluated": meta["evaluation_metrics"]
        },
        "factors": factors
    }

def main():
    if len(sys.argv) > 1:
        raw_input = sys.argv[1]
    else:
        raw_input = sys.stdin.read()

    try:
        payload = json.loads(raw_input)
    except Exception as e:
        print(json.dumps({"success": False, "error": f"Invalid JSON payload: {str(e)}"}))
        sys.exit(1)

    category = payload.get("category", "house").lower()
    try:
        if category == "land":
            result = predict_land(payload)
        else:
            result = predict_house(payload)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
