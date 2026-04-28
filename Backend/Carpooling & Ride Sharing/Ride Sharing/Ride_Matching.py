from geopy.distance import geodesic
import pandas as pd
import Function

# Load the dataset
df = pd.read_csv("ridesharing_data.csv")

# Function to find ride matches based on location name
def find_matching_rides(location_name, max_distance_km=2):
    user_lat, user_long = Function.get_coordinates(location_name)
    
    if user_lat is None or user_long is None:
        return {"error": "Invalid location name"}

    matching_rides = []
    
    for index, row in df.iterrows():
        pickup_location = (row["pickup_lat"], row["pickup_long"])
        user_location = (user_lat, user_long)
        
        distance = geodesic(user_location, pickup_location).km
        
        if distance <= max_distance_km and row["carpooling_preference"] == "Yes":
            matching_rides.append(row.to_dict())

    return matching_rides

# Example usage: Finding rides near Connaught Place, Delhi
matches = find_matching_rides("Connaught Place, Delhi")

print(f"Matching Rides Found: {len(matches)}")
for match in matches[:5]:  # Display first 5 matches
    print(match)
