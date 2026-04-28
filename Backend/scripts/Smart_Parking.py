#!/usr/bin/env python3
import sys
import random
import json
import os

DATA_FILE = 'delhi_parking_data_3.json'

# def generate_fake_parking_data(num_locations=200):
#     base_lat, base_lon = 28.6139, 77.2090
#     parking_locations = []

#     area_names = [
#         "Connaught Place", "Karol Bagh", "Saket", "Lajpat Nagar", "Dwarka", "Rohini", "Pitampura",
#         "Janakpuri", "Rajouri Garden", "Vasant Kunj", "Greater Kailash", "Hauz Khas", "Khan Market",
#         "Chandni Chowk", "Nehru Place", "Sarojini Nagar", "AIIMS", "Indira Gandhi International Airport",
#         "CP", "Green Park", "Malviya Nagar", "South Extension", "Mayur Vihar", "Okhla", "Jangpura"
#     ]

#     parking_names = [
#         "Metro Parking", "Mall Parking", "Market Parking", "Community Center Parking", "Public Parking Lot",
#         "Shopping Complex Parking", "Basement Parking", "Open Ground Parking", "Multi-level Parking",
#         "Underground Parking", "Private Parking", "Corporate Parking", "Event Venue Parking"
#     ]

#     for area in area_names:
#         for _ in range(num_locations // len(area_names)):
#             lat_offset = random.uniform(-0.1, 0.1)
#             lon_offset = random.uniform(-0.1, 0.1)
#             parking_locations.append({
#                 "name": f"{random.choice(parking_names)} - {area}",
#                 "area": area,
#                 "lat": base_lat + lat_offset,
#                 "lon": base_lon + lon_offset,
#                 "total_slots": random.randint(20, 200),
#                 "hourly_rate": random.randint(10, 100),
#                 "security": random.choice([True, False]),
#                 "valet_parking": random.choice([True, False]),
#                 "ev_charging": random.choice([True, False])
#             })
#     return parking_locations

def save_parking_data():
    if not os.path.exists(DATA_FILE):
        parking_data = DATA_FILE
        with open(DATA_FILE, 'w') as f:
            json.dump(parking_data, f)

def load_parking_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def get_available_slots(parking):
    return random.randint(0, parking['total_slots'])

def find_parking_by_area(user_area):
    parking_locations = load_parking_data()
    matching_parking = []

    for parking in parking_locations:
        if parking['area'].lower() == user_area.lower():
            available_slots = get_available_slots(parking)
            matching_parking.append({
                "name": parking['name'],
                "area": parking['area'],
                "available_slots": available_slots,
                "total_slots": parking['total_slots'],
                "hourly_rate": parking['hourly_rate'],
                "security": parking['security'],
                "valet_parking": parking['valet_parking'],
                "ev_charging": parking['ev_charging']
            })
    
    return matching_parking

if __name__ == "__main__":
    save_parking_data()

    if len(sys.argv) < 2:
        print(json.dumps({"error": "Location is required"}))
        sys.exit(1)

    location_name = sys.argv[1]
    matching_parking = find_parking_by_area(location_name)

    if matching_parking:
        print(json.dumps(matching_parking))
    else:
        print(json.dumps({"error": f"No parking locations found in {location_name}"}))
