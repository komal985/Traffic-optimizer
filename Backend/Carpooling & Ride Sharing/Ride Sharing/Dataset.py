import pandas as pd
import random
from faker import Faker

fake = Faker()

# Generate random coordinates (Delhi region as an example)
def random_coordinates():
    return round(random.uniform(28.50, 28.80), 6), round(random.uniform(77.00, 77.30), 6)

# Create a dataset
num_rides = 1000
data = {
    "user_id": [fake.uuid4() for _ in range(num_rides)],
    "pickup_lat": [random_coordinates()[0] for _ in range(num_rides)],
    "pickup_long": [random_coordinates()[1] for _ in range(num_rides)],
    "dropoff_lat": [random_coordinates()[0] for _ in range(num_rides)],
    "dropoff_long": [random_coordinates()[1] for _ in range(num_rides)],
    "request_time": [fake.date_time_this_month() for _ in range(num_rides)],
    "available_seats": [random.randint(1, 4) for _ in range(num_rides)],
    "ride_status": [random.choice(["Completed", "Ongoing", "Cancelled"]) for _ in range(num_rides)],
    "carpooling_preference": [random.choice(["Yes", "No"]) for _ in range(num_rides)]
}

df = pd.DataFrame(data)

# Save dataset to CSV
df.to_csv("ridesharing_data.csv", index=False)

print(df.head())
