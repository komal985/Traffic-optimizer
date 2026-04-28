import json
import sys
from collections import defaultdict

def generate_heatmap(data):
    grid = defaultdict(int)
    for entry in data:
        lat = int(float(entry['latitude']) / 0.01)  # 1km grid
        lon = int(float(entry['longitude']) / 0.01)
        grid[(lat, lon)] += 1  # Count vehicles in grid cell

    heatmap = []
    for (lat, lon), count in grid.items():
        heatmap.append({
            "lat": lat * 0.01,
            "lon": lon * 0.01,
            "density": count
        })
    return heatmap

if __name__ == "__main__":
    input_file = sys.argv[1]
    with open(input_file, 'r') as f:
        data = json.load(f)
    heatmap = generate_heatmap(data)
    print(json.dumps(heatmap))