import sys
import json
import requests
from collections import defaultdict

# Function to calculate the number of vehicles in a grid cell
def count_vehicles(gps_data, grid_cell):
    vehicle_count = set()
    for vehicle_id, coordinates in gps_data.items():
        for lat, lon, timestamp in coordinates:
            if is_in_grid_cell(lat, lon, grid_cell):
                vehicle_count.add(vehicle_id)
    return len(vehicle_count)

# Function to check if a point is in a grid cell
def is_in_grid_cell(lat, lon, grid_cell):
    min_lat, max_lat, min_lon, max_lon = grid_cell
    return min_lat <= lat <= max_lat and min_lon <= lon <= max_lon

# Function to calculate congestion level
def calculate_congestion(vehicle_count, average_speed, road_capacity):
    density = vehicle_count / road_capacity

    if density < 0.3:
        return "Low"
    elif density < 0.6:
        return "Moderate"
    elif density < 0.9:
        return "High"
    else:
        return "Severe"

# Function to calculate route and congestion
def calculate_route(start_lat, start_lon, end_lat, end_lon):
    OSRM_URL = "http://router.project-osrm.org/route/v1/driving"
    response = requests.get(
        f"{OSRM_URL}/{start_lon},{start_lat};{end_lon},{end_lat}",
        params={"overview": "full", "geometries": "geojson"}
    )
    response.raise_for_status()
    data = response.json()
    route = data["routes"][0]
    geometry = route["geometry"]["coordinates"]
    path = [[coord[1], coord[0]] for coord in geometry]  # Convert to [lat, lon]

    # Example GPS data (replace with real data)
    gps_data = {
        "vehicle1": [(12.9716, 77.5946, "2023-10-01T10:00:00"), (12.9720, 77.5950, "2023-10-01T10:05:00")],
        "vehicle2": [(12.9716, 77.5946, "2023-10-01T10:00:00"), (12.9730, 77.5960, "2023-10-01T10:05:00")],
    }

    # Define a grid cell along the route
    grid_cell = (12.9710, 12.9730, 77.5940, 77.5960)

    # Calculate number of vehicles and congestion level
    vehicle_count = count_vehicles(gps_data, grid_cell)
    road_capacity = 100  # Example road capacity
    average_speed = 0 # km/h
    if route["distance"]!=0 :
        average_speed=(route["distance"]/1000)/(route["duration"])
    congestion_level = calculate_congestion(vehicle_count, average_speed, road_capacity)

    return {
        "path": path,
        "startCoords": [start_lat, start_lon],
        "destinationCoords": [end_lat, end_lon],
        "distance": round(route["distance"] / 1000, 2),  # in km
        "duration": round(route["duration"] / 60, 2),    # in minutes
        "congestion": congestion_level,
        "vehicle_count": vehicle_count,
    }

if __name__ == "__main__":
    try:
        start_lat = float(sys.argv[1])
        start_lon = float(sys.argv[2])
        end_lat = float(sys.argv[3])
        end_lon = float(sys.argv[4])
        route = calculate_route(start_lat, start_lon, end_lat, end_lon)
        print(json.dumps(route))  # Output a single JSON object
    except Exception as e:
        print(json.dumps({"error": str(e)}))  # Output error as JSON
        sys.exit(1)