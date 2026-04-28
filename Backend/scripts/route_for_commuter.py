#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import random
import networkx as nx
from sklearn.ensemble import RandomForestRegressor 
from sklearn.preprocessing import LabelEncoder
import joblib
import sys
import json  # ✅ Added to format output correctly

# def generate_fake_metro_data():
#     stations = [
#         "Kashmere Gate", "Rajiv Chowk", "Central Secretariat", "Hauz Khas", "Saket",
#         "Qutub Minar", "Chhatarpur", "AIIMS", "Dhaula Kuan", "Dwarka Sec 21",
#         "Noida City Centre", "Botanical Garden", "Vaishali", "Anand Vihar",
#         "Laxmi Nagar", "Mayur Vihar", "Yamuna Bank", "New Ashok Nagar", "Mandi House",
#         "Pragati Maidan", "Inderlok", "Netaji Subhash Place", "Punjabi Bagh West"
#     ]
    
#     data = []
#     graph = nx.Graph()
    
#     for i in range(len(stations)):
#         for j in range(i + 1, len(stations)):
#             distance = round(random.uniform(0.5, 25), 1)
#             time = round(distance * random.uniform(1.5, 2.5), 1)
#             cost = round(distance * random.uniform(1.2, 2.5), 1)
#             traffic = round(random.uniform(0, 1), 2)
#             congestion = round(random.uniform(0, 1), 2)
            
#             data.append([stations[i], stations[j], distance, time, cost, traffic, congestion])
#             data.append([stations[j], stations[i], distance, time, cost, traffic, congestion])
            
#             graph.add_edge(stations[i], stations[j], weight=distance)
    
#     df = pd.DataFrame(data, columns=["origin", "destination", "distance_km", "total_time_min", "total_fare", "traffic", "congestion"])
#     df.to_csv("delhi_metro_commute_data.csv", index=False)
    
#     joblib.dump(graph, "metro_graph.pkl")
#     # print("✅ Fake dataset updated: delhi_metro_commute_data.csv")
#     return df 


def train_model():
    df = pd.read_csv("delhi_metro_commute_data.csv")

    label_encoder = LabelEncoder()
    label_encoder.fit(pd.concat([df["origin"], df["destination"]]))
    df["origin"] = label_encoder.transform(df["origin"])
    df["destination"] = label_encoder.transform(df["destination"])

    # Compute weighted cost based on fare, time, and traffic
    df["cost_weighted"] = df["total_fare"] + 0.5 * df["total_time_min"] + 0.3 * df["traffic"]

    X = df[["origin", "destination", "distance_km", "total_time_min", "total_fare", "traffic", "congestion"]]
    y = df["cost_weighted"]  

    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X, y)

    joblib.dump(model, "route_recommender_model.pkl")
    joblib.dump(label_encoder, "label_encoder.pkl")
    # print("✅ Model trained successfully (Regression Mode)!")


def find_shortest_path(origin, destination):
    graph = joblib.load("metro_graph.pkl")
    try:
        path = nx.shortest_path(graph, source=origin, target=destination, weight='weight')
        return path
    except nx.NetworkXNoPath:
        return None


def predict_route(origin, destination):
    df = pd.read_csv("delhi_metro_commute_data.csv")
    label_encoder = joblib.load("label_encoder.pkl")
    model = joblib.load("route_recommender_model.pkl")
    
    # ✅ Ensure stations exist in dataset
    if origin not in df["origin"].values or destination not in df["destination"].values:
        return json.dumps({"error": "Invalid station name provided."})

    path = find_shortest_path(origin, destination)
    if not path:
        return json.dumps({"error": "No available route."})
    
    total_distance = 0
    total_time = 0
    total_fare = 0
    transport_modes = []
    mode_changes = []
    
    previous_mode = None
    for i in range(len(path) - 1):
        segment = df[(df["origin"] == path[i]) & (df["destination"] == path[i + 1])]
        if not segment.empty:
            total_distance += segment["distance_km"].values[0]
            total_time += segment["total_time_min"].values[0]
            total_fare += segment["total_fare"].values[0]
            
            X_test = pd.DataFrame([[
                label_encoder.transform([path[i]])[0], 
                label_encoder.transform([path[i + 1]])[0],
                segment["distance_km"].values[0], 
                segment["total_time_min"].values[0], 
                segment["total_fare"].values[0],
                segment["traffic"].values[0],
                segment["congestion"].values[0]
            ]], columns=["origin", "destination", "distance_km", "total_time_min", "total_fare", "traffic", "congestion"])
            
            predicted_mode_encoded = model.predict(X_test)[0]
            predicted_mode = "Metro" if predicted_mode_encoded < 5 else "Bus" if predicted_mode_encoded < 10 else "E-Rickshaw"
            transport_modes.append(predicted_mode)
            
            if previous_mode and previous_mode != predicted_mode:
                mode_changes.append(f"Change from {previous_mode} to {predicted_mode} at {path[i]}")
            
            previous_mode = predicted_mode
    
    return json.dumps({
        "Route": path,
        "Total Distance": total_distance,
        "Total Time": total_time,
        "Total Fare": total_fare,
        "Transport Modes": transport_modes,
        "Mode Changes": mode_changes
    })


if __name__ == "__main__":
    # df = generate_fake_metro_data()
    train_model()
    
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing origin or destination"}))
        sys.exit(1)

    origin = sys.argv[1]
    destination = sys.argv[2]
    
    result = predict_route(origin, destination)
    print(result)  # ✅ Now prints a JSON string
