# -*- coding: utf-8 -*-
"""
Hospital and medical facility locator module.
Supports query-by-city or coordinates. Reads the US database if available,
with default local hospital mappings for Gujarat (Ahmedabad/Anand) locations.
"""
import os
import pandas as pd
import numpy as np

SUJIT_LOCATOR_DIR = r"C:\Users\capermint\Desktop\Sujit\Nearby-Hospital-locator"
CITIES_FILE = os.path.join(SUJIT_LOCATOR_DIR, "uscities.csv")
HOSPITALS_FILE = os.path.join(SUJIT_LOCATOR_DIR, "us_hospital_locations.csv")

# Local Gujarat/India fallback hospitals (matching the startup's physical locations)
GUJARAT_CITIES = {
    "ahmedabad": {"city": "Ahmedabad", "lat": 23.0225, "lng": 72.5714, "state": "Gujarat"},
    "anand": {"city": "Anand", "lat": 22.5645, "lng": 72.9289, "state": "Gujarat"},
}

GUJARAT_HOSPITALS = [
    {"Name": "Apollo Hospitals", "Address": "Plot No. 1A, Gandhinagar - Ahmedabad Rd, GIDC Bhat", "City": "Ahmedabad", "State": "Gujarat", "ZIP": "382428", "Phone": "+91 79 6670 1800", "Latitude": 23.0965, "Longitude": 72.6362, "Type": "General"},
    {"Name": "Zydus Hospital", "Address": "Zydus Hospitals Road, SG Highway, Thaltej", "City": "Ahmedabad", "State": "Gujarat", "ZIP": "380054", "Phone": "+91 79 6619 0201", "Latitude": 23.0487, "Longitude": 72.5186, "Type": "General"},
    {"Name": "SAL Hospital", "Address": "SAL Hospital Cross Roads, Drive In Rd", "City": "Ahmedabad", "State": "Gujarat", "ZIP": "380054", "Phone": "+91 79 6611 5600", "Latitude": 23.0475, "Longitude": 72.5277, "Type": "General"},
    {"Name": "KD Hospital", "Address": "Vaishnodevi Circle, SG Highway", "City": "Ahmedabad", "State": "Gujarat", "ZIP": "382421", "Phone": "+91 79 6659 0000", "Latitude": 23.1162, "Longitude": 72.5398, "Type": "General"},
    {"Name": "Sardar Patel Hospital", "Address": "Anand - Vidyanagar Road", "City": "Anand", "State": "Gujarat", "ZIP": "388001", "Phone": "+91 2692 245 400", "Latitude": 22.5562, "Longitude": 72.9515, "Type": "General"},
    {"Name": "Anand Civil Hospital", "Address": "Near Town Hall", "City": "Anand", "State": "Gujarat", "ZIP": "388001", "Phone": "+91 2692 250 502", "Latitude": 22.5645, "Longitude": 72.9358, "Type": "General"}
]

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Computes haversine distance in miles.
    """
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat/2.0)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon/2.0)**2
    c = 2.0 * np.arcsin(np.sqrt(a))
    r = 3958.8  # Earth radius in miles
    return c * r

def gmaps_route_url(lat1, lon1, lat2, lon2):
    return f"https://www.google.com/maps/dir/?api=1&origin={lat1},{lon1}&destination={lat2},{lon2}&travelmode=driving"

def locate_nearby_hospitals(city_query: str, radius_miles: float = 10.0) -> dict:
    """
    Locate hospitals nearby a given city name.
    """
    city_clean = city_query.strip().lower()
    
    # Try local Gujarat cities first
    if city_clean in GUJARAT_CITIES:
        ref = GUJARAT_CITIES[city_clean]
        nearby = []
        for h in GUJARAT_HOSPITALS:
            d = haversine_distance(ref["lat"], ref["lng"], h["Latitude"], h["Longitude"])
            if d <= radius_miles:
                h_copy = h.copy()
                h_copy["Distance_miles"] = float(d)
                h_copy["Route_URL"] = gmaps_route_url(ref["lat"], ref["lng"], h["Latitude"], h["Longitude"])
                h_copy["Google_Maps_URL"] = f"https://www.google.com/maps/search/?api=1&query={h['Latitude']},{h['Longitude']}"
                nearby.append(h_copy)
        
        # Sort by distance
        nearby.sort(key=lambda x: x["Distance_miles"])
        return {
            "success": True,
            "searched_location": ref,
            "hospitals": nearby,
            "radius_miles": radius_miles,
            "database": "Gujarat_Local_DB"
        }

    # Attempt to load and query US databases
    if os.path.exists(CITIES_FILE) and os.path.exists(HOSPITALS_FILE):
        try:
            cities_df = pd.read_csv(CITIES_FILE)
            hospitals_df = pd.read_csv(HOSPITALS_FILE)
            
            matches = cities_df[cities_df['city'].str.lower() == city_clean]
            if matches.empty:
                return {"success": False, "error": f"City '{city_query}' not found in US or Gujarat DB"}
            
            city_row = matches.iloc[0]
            c_lat, c_lng = float(city_row['lat']), float(city_row['lng'])
            
            # Simple manual filter by distance (to avoid mandatory sklearn BallTree imports if it's slow)
            nearby = []
            for _, row in hospitals_df.iterrows():
                h_lat = float(row['LATITUDE'])
                h_lng = float(row['LONGITUDE'])
                # Quick bounding box filter for speed before Haversine
                lat_deg_dist = radius_miles / 69.0
                if abs(h_lat - c_lat) <= lat_deg_dist:
                    d = haversine_distance(c_lat, c_lng, h_lat, h_lng)
                    if d <= radius_miles:
                        nearby.append({
                            'Name': row['NAME'],
                            'Address': row.get('ADDRESS', ''),
                            'City': row.get('CITY', ''),
                            'State': row.get('STATE', ''),
                            'ZIP': row.get('ZIP', ''),
                            'Type': row.get('TYPE', ''),
                            'Status': row.get('STATUS', ''),
                            'Phone': row.get('TELEPHONE', ''),
                            'Latitude': h_lat,
                            'Longitude': h_lng,
                            'Distance_miles': float(d),
                            'Route_URL': gmaps_route_url(c_lat, c_lng, h_lat, h_lng),
                            'Google_Maps_URL': f"https://www.google.com/maps/search/?api=1&query={h_lat},{h_lng}"
                        })
            
            nearby.sort(key=lambda x: x["Distance_miles"])
            return {
                "success": True,
                "searched_location": {
                    "city": city_row['city'],
                    "state": city_row.get('state_name', ''),
                    "lat": c_lat,
                    "lng": c_lng
                },
                "hospitals": nearby[:30], # Limit to top 30
                "radius_miles": radius_miles,
                "database": "US_Hospitals_DB"
            }
            
        except Exception as e:
            return {"success": False, "error": f"Error querying databases: {str(e)}"}
            
    return {"success": False, "error": f"City '{city_query}' not recognized and database files are missing"}
