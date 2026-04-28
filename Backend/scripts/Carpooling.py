import sys
import json
import pandas as pd
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

# Load dataset
df = pd.read_csv("ridesharing_carpooling_data.csv")

# Create geolocator ONCE (important)
geolocator = Nominatim(user_agent="carpooling_service", timeout=10)

# Cache to avoid repeated API calls
location_cache = {}


def get_coordinates(location_name):
    """
    Convert a location name into (latitude, longitude)
    Uses caching to avoid repeated API calls.
    """
    if location_name in location_cache:
        return location_cache[location_name]

    try:
        location = geolocator.geocode(location_name)
        if location:
            coords = (location.latitude, location.longitude)
        else:
            coords = (None, None)
    except Exception:
        coords = (None, None)

    location_cache[location_name] = coords
    return coords


def find_carpooling_rides(location_name, organization_name, max_distance_km=5):
    """
    Find nearby carpooling rides for the same organization.
    """
    user_lat, user_long = get_coordinates(location_name)

    if user_lat is None or user_long is None:
        return {"error": "Invalid location name"}

    matching_rides = []

    for _, row in df.iterrows():

        # Case-insensitive organization match
        if str(row["organization"]).lower() != organization_name.lower():
            continue

        # Only carpool-enabled rides
        if str(row["carpooling_preference"]).lower() != "yes":
            continue

        ride_lat, ride_long = get_coordinates(row["pickup_location"])

        if ride_lat is not None and ride_long is not None:
            distance = geodesic(
                (user_lat, user_long),
                (ride_lat, ride_long)
            ).km

            if distance <= max_distance_km:
                matching_rides.append(row.to_dict())

    return matching_rides


# ----------- Node.js / CLI Entry Point -----------
if __name__ == "__main__":

    if len(sys.argv) < 3:
        print(json.dumps({
            "error": "Usage: python3 carpooling.py <location> <organization>"
        }))
        sys.exit(1)

    location = sys.argv[1]
    organization = sys.argv[2]

    result = find_carpooling_rides(location, organization)

    # Safe JSON output for Node.js
    print(json.dumps(result, default=str))
