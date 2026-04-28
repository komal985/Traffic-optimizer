import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  TextField,
  Button as MuiButton,
  Typography,
  Box,
  Card,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import Lottie from "lottie-react";
import loadingAnimation from "../assets/animations/loading.json";
import Icon from "../assets/images/marker-icon.png";

// Color Scheme
const themeColors = {
  dark: {
    background: "#0a192f",
    accentGreen: "#64ffda",
    accentRed: "#f07178",
    text: "#fff",
    cardBackground: "rgba(255, 255, 255, 0.1)",
    cardBorder: "rgba(100, 255, 218, 0.5)",
    heading: "#64ffda",
  },
  light: {
    background: "#ffffff",
    accentGreen: "#00bcd4",
    accentRed: "#ff5252",
    text: "#333333",
    cardBackground: "rgba(0, 0, 0, 0.1)",
    cardBorder: "rgba(0, 188, 212, 0.5)",
    heading: "#00bcd4",
  },
};

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Custom Icon for Markers
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [32, 52],
  iconAnchor: [16, 52],
  popupAnchor: [1, -34],
});

// Update Map Bounds
const UpdateMapBounds = ({ startCoords, destinationCoords, fallbackCenter }) => {
  const map = useMap();
  useEffect(() => {
    if (startCoords && destinationCoords) {
      const bounds = L.latLngBounds([startCoords, destinationCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (fallbackCenter) {
      map.setView(fallbackCenter, 13);
    }
  }, [startCoords, destinationCoords, fallbackCenter, map]);
  return null;
};

const TrafficAnalysis = ({ theme }) => {
  const colors = themeColors[theme];
  const [route, setRoute] = useState({
    start: "",
    destination: "",
    loading: false,
    error: null,
    path: null,
    startCoords: null,
    destinationCoords: null,
    distance: null,
    duration: null,
    userLocation: null,
    congestion: "Low",
    vehicleCount: 0,
  });

  const [star, setStar] = useState("");
  const [dest, setDest] = useState("");

  // Retrieve user's current location on mount.
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setRoute((prev) => ({
            ...prev,
            userLocation: [latitude, longitude],
          }));
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  }, []);

  const calculateRoute = async () => {
    if (!dest) {
      setRoute((prev) => ({
        ...prev,
        error: "Please enter a destination",
      }));
      return;
    }

    let startInput = star.trim();
    if (!startInput && route.userLocation) {
      startInput = `${route.userLocation[0]},${route.userLocation[1]}`;
    }
    if (!startInput) {
      setRoute((prev) => ({
        ...prev,
        error: "Please provide start coordinates or enable location services",
      }));
      return;
    }

    setRoute((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}/routing/calculate-route`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            start: startInput,
            destination: dest.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Route calculation failed");
      }

      const result = await response.json();
      setRoute((prev) => ({
        ...prev,
        path: result.path,
        startCoords: result.startCoords,
        destinationCoords: result.destinationCoords,
        distance: result.distance,
        duration: result.duration,
        congestion: result.congestion || "Low",
        loading: false,
        vehicleCount: result.vehicle_count || 0,
        start: star,
        destination: dest,
      }));
    } catch (error) {
      setRoute((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  const startMarkerPosition =
    route.start && route.startCoords ? route.startCoords : route.userLocation;
  const fallbackCenter = startMarkerPosition || [20.5937, 78.9629];

  return (
    <div
      style={{
        backgroundColor: colors.background,
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          color: colors.accentGreen,
          textAlign: "center",
          marginBottom: "1.5rem",
          fontWeight: "bold",
        }}
      >
        Route Planner
      </Typography>

      {/* Search and Controls Section */}
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr auto" },
          gap: 2,
          mb: 4,
          padding: "1rem",
          borderRadius: "16px",
          backgroundColor: colors.cardBackground,
          backdropFilter: "blur(10px)",
          border: `1px solid ${colors.cardBorder}`,
        }}
      >
        {/* Start Input */}
        <TextField
          fullWidth
          label="Start"
          variant="outlined"
          value={star}
          onChange={(e) => setStar(e.target.value)}
          InputProps={{
            endAdornment: (
              <DirectionsIcon
                sx={{
                  color: colors.accentGreen,
                }}
              />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: colors.text,
              "& fieldset": {
                borderColor: colors.cardBorder,
              },
              "&:hover fieldset": {
                borderColor: colors.accentGreen,
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.text,
            },
          }}
        />

        {/* Destination Input */}
        <TextField
          fullWidth
          label="Destination"
          variant="outlined"
          value={dest}
          onChange={(e) => setDest(e.target.value)}
          InputProps={{
            endAdornment: (
              <DirectionsIcon
                sx={{
                  color: colors.accentRed,
                }}
              />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              color: colors.text,
              "& fieldset": {
                borderColor: colors.cardBorder,
              },
              "&:hover fieldset": {
                borderColor: colors.accentRed,
              },
            },
            "& .MuiInputLabel-root": {
              color: colors.text,
            },
          }}
        />

        {/* Calculate Route Button */}
        <MuiButton
          variant="contained"
          onClick={calculateRoute}
          disabled={route.loading}
          sx={{
            backgroundColor: colors.accentGreen,
            color: colors.background,
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: colors.accentGreen,
              opacity: 0.9,
            },
          }}
        >
          {route.loading ? (
            <Lottie
              animationData={loadingAnimation}
              style={{ width: 24, height: 24 }}
            />
          ) : (
            "Calculate Route"
          )}
        </MuiButton>
      </Box>

      {/* Map Section */}
      <Box
        sx={{
          height: "60vh",
          width: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: `0 8px 32px ${colors.cardBorder}50`,
          marginBottom: "2rem",
        }}
      >
        <MapContainer
          center={fallbackCenter}
          zoom={13}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?lang=en"
          />

          <UpdateMapBounds
            startCoords={route.startCoords || route.userLocation}
            destinationCoords={route.destinationCoords}
            fallbackCenter={fallbackCenter}
          />

          {startMarkerPosition && (
            <Marker position={startMarkerPosition} icon={customIcon}>
              <Popup>{route.start ? route.start : "Current Location"}</Popup>
            </Marker>
          )}
          {route.destinationCoords && (
            <Marker position={route.destinationCoords} icon={customIcon}>
              <Popup>{route.destination}</Popup>
            </Marker>
          )}
          {route.path && (
            <Polyline
              positions={route.path}
              pathOptions={{ color: colors.accentGreen, weight: 5 }}
            />
          )}
        </MapContainer>
      </Box>

      {/* Results Section */}
      {route.distance && route.duration && (
        <Card
          sx={{
            maxWidth: 800,
            mx: "auto",
            p: 3,
            borderRadius: "12px",
            backgroundColor: colors.cardBackground,
            backdropFilter: "blur(10px)",
            border: `1px solid ${colors.cardBorder}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen,
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Route Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Typography sx={{ color: colors.text }}>
              <strong style={{color:colors.heading}}>Distance:</strong>{" "}
              {route.distance < 1
                ? `${(route.distance * 1000).toFixed(0)} m`
                : `${route.distance.toFixed(2)} Km`}
            </Typography>
            <Typography sx={{ color: colors.text }}>
              <strong style={{color:colors.heading}}>Duration:</strong>{" "}
              {route.duration < 3600
                ? `${Math.round(route.duration / 60)} Minutes`
                : `${(route.duration / 3600).toFixed(2)} Hours`}
            </Typography>
            <Typography sx={{ color: colors.text }}>
              <strong style={{color:colors.heading}}>Congestion:</strong> {route.congestion}
            </Typography>
            <Typography sx={{ color: colors.text }}>
              <strong style={{color:colors.heading}}>Vehicle Count:</strong> {route.vehicleCount}
            </Typography>
          </Box>
        </Card>
      )}
    </div>
  );
};

export default TrafficAnalysis;