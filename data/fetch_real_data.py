import requests
import json
import pandas as pd
from datetime import datetime
import os

class DataPipeline:
    def __init__(self, api_keys):
        self.api_keys = api_keys
        self.data_dir = "data/"

    def fetch_weather_data(self, lat, lon):
        """Fetch real weather for IoT augmentation."""
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={self.api_keys['openweather']}"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return {
                "temperature": data["main"]["temp"] - 273.15,  # Celsius
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"]["speed"]
            }
        return None

    def fetch_satellite_water(self, lat, lon):
        """Fetch NASA satellite water data."""
        # Placeholder for NASA Earthdata API
        url = f"https://api.nasa.gov/planetary/earth/imagery?lon={lon}&lat={lat}&date=2023-01-01&api_key={self.api_keys['nasa']}"
        response = requests.get(url)
        if response.status_code == 200:
            return {"water_index": 0.7}  # Simulated
        return None

    def augment_regions_data(self):
        """Augment planetary_regions.json with real data."""
        with open(os.path.join(self.data_dir, "planetary_regions.json"), "r") as f:
            regions = json.load(f)["regions"]

        for region in regions:
            lat, lon = region["coordinates"]
            weather = self.fetch_weather_data(lat, lon)
            satellite = self.fetch_satellite_water(lat, lon)
            if weather:
                region["real_weather"] = weather
            if satellite:
                region["real_water"] = satellite
            region["last_updated"] = datetime.utcnow().isoformat()

        with open(os.path.join(self.data_dir, "planetary_regions_augmented.json"), "w") as f:
            json.dump({"regions": regions}, f, indent=2)
        print("Data augmented and saved.")

# Example
pipeline = DataPipeline({"openweather": "your_key", "nasa": "your_key"})
pipeline.augment_regions_data()
