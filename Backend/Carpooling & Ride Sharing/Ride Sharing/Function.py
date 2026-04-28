from geopy.geocoders import Nominatim

def get_coordinates(location_name):
    geolocator = Nominatim(user_agent="geoapi")
    location = geolocator.geocode(location_name)
    
    if location:
        return location.latitude, location.longitude
    else:
        return None, None

# Example usage
lat, long = get_coordinates("Delhi")
print(f"Coordinates: {lat}, {long}")
