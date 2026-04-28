import React, { useState, useEffect, useCallback } from "react";
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
  Button,
  Typography,
  Box,
  IconButton,
  Chip,
  Card,
  CardContent,
  Tooltip,
  Fade,
  CircularProgress,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import NavigatorIcon from "../assets/images/navigator-icon.svg";
import PageLayout from "./PageLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme as useMuiTheme, useMediaQuery } from "@mui/material";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Theme colors
const themeColors = {
  dark: {
    background: "#0a192f",
    surface: "rgba(255, 255, 255, 0.05)",
    surfaceHover: "rgba(255, 255, 255, 0.1)",
    accent: "#64ffda",
    accentSecondary: "#f07178",
    text: "#ffffff",
    textSecondary: "rgba(255, 255, 255, 0.7)",
    border: "rgba(100, 255, 218, 0.3)",
    gradient: "linear-gradient(135deg, #64ffda 0%, #00bcd4 100%)",
  },
  light: {
    background: "#ffffff",
    surface: "rgba(0, 0, 0, 0.03)",
    surfaceHover: "rgba(0, 0, 0, 0.08)",
    accent: "#00bcd4",
    accentSecondary: "#ff5252",
    text: "#1a1a2e",
    textSecondary: "rgba(0, 0, 0, 0.6)",
    border: "rgba(0, 188, 212, 0.3)",
    gradient: "linear-gradient(135deg, #00bcd4 0%, #0095a8 100%)",
  },
};

// Custom marker icons
const createIcon = (emoji, bgColor) => L.divIcon({
  className: "custom-marker",
  html: `<div style="
    background: ${bgColor};
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    border: 2px solid white;
  ">${emoji}</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Map controller component
const MapController = ({ startCoords, destinationCoords, followUser, currentLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (startCoords && destinationCoords) {
      const bounds = L.latLngBounds([startCoords, destinationCoords]);
      map.fitBounds(bounds, { padding: [60, 60] });
    } else if (startCoords) {
      map.setView(startCoords, 15);
    }
  }, [map, startCoords, destinationCoords]);

  useEffect(() => {
    if (followUser && currentLocation) {
      map.setView(currentLocation, map.getZoom());
    }
  }, [map, followUser, currentLocation]);

  return null;
};

const NavigateMe = ({ theme }) => {
  const [destination, setDestination] = useState("");
  const [mode, setMode] = useState("driving");
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationCoords, setDestinationCoords] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [followUser, setFollowUser] = useState(true);
  const [steps, setSteps] = useState([]);
  const [arrivalTime, setArrivalTime] = useState(null);

  // MongoDB-backed state
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("📍");

  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const colors = themeColors[theme];

  const modeMapping = { driving: "car", walking: "foot", cycling: "bike" };
  const locationIcons = ["🏠", "💼", "🏋️", "🛒", "🎓", "☕", "🏥", "📍"];

  // Fetch recent searches and saved locations on mount
  useEffect(() => {
    fetchRecentSearches();
    fetchSavedLocations();
  }, []);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation([position.coords.latitude, position.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  const fetchRecentSearches = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/navigation/recent?limit=5`);
      const data = await res.json();
      setRecentSearches(data.searches || []);
    } catch (err) {
      console.error("Failed to fetch recent searches:", err);
    }
  };

  const fetchSavedLocations = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/navigation/saved`);
      const data = await res.json();
      setSavedLocations(data.locations || []);
    } catch (err) {
      console.error("Failed to fetch saved locations:", err);
    }
  };

  const saveSearch = async (dest, coords, dist, dur) => {
    try {
      await fetch(`${BACKEND_URL}/navigation/recent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: dest,
          destinationCoords: coords,
          origin: "Current Location",
          originCoords: currentLocation,
          mode,
          distance: dist,
          duration: dur,
        }),
      });
      fetchRecentSearches();
    } catch (err) {
      console.error("Failed to save search:", err);
    }
  };

  const saveLocation = async () => {
    if (!newLocationName.trim() || !destination || !destinationCoords) return;
    try {
      await fetch(`${BACKEND_URL}/navigation/saved`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newLocationName,
          address: destination,
          coords: destinationCoords,
          icon: selectedIcon,
          color: colors.accent,
        }),
      });
      setSaveDialogOpen(false);
      setNewLocationName("");
      fetchSavedLocations();
    } catch (err) {
      console.error("Failed to save location:", err);
    }
  };

  const deleteLocation = async (id) => {
    try {
      await fetch(`${BACKEND_URL}/navigation/saved/${id}`, { method: "DELETE" });
      fetchSavedLocations();
    } catch (err) {
      console.error("Failed to delete location:", err);
    }
  };

  const geocodeAddress = async (address) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    return null;
  };

  const calculateRoute = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }
    if (!currentLocation) {
      setError("Waiting for GPS location...");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const endCoords = await geocodeAddress(destination);
      if (!endCoords) {
        setError("Could not find that location");
        setLoading(false);
        return;
      }

      setDestinationCoords(endCoords);
      const osrmMode = modeMapping[mode];

      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${osrmMode}/${currentLocation[1]},${currentLocation[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson&steps=true`
      );
      const data = await response.json();

      if (data.routes?.length > 0) {
        const routeData = data.routes[0];
        setRoute(routeData.geometry.coordinates);
        setDistance(routeData.distance);
        setDuration(routeData.duration);
        setSteps(routeData.legs?.[0]?.steps || []);

        const arrival = new Date(Date.now() + routeData.duration * 1000);
        setArrivalTime(arrival);

        // Save to history
        saveSearch(destination, endCoords, routeData.distance, routeData.duration);
      } else {
        setError("No route found");
      }
    } catch (err) {
      console.error("Route error:", err);
      setError("Failed to calculate route");
    } finally {
      setLoading(false);
    }
  };

  const navigateToLocation = (loc) => {
    setDestination(loc.address);
    setDestinationCoords(loc.coords);
    setShowRecent(false);
  };

  const navigateToRecent = (search) => {
    setDestination(search.destination);
    setDestinationCoords(search.destinationCoords);
    setShowRecent(false);
  };

  const formatDistance = (d) => d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`;
  const formatDuration = (t) => {
    if (t >= 3600) return `${Math.floor(t / 3600)}h ${Math.floor((t % 3600) / 60)}m`;
    if (t >= 60) return `${Math.floor(t / 60)} min`;
    return `${Math.round(t)} sec`;
  };

  return (
    <PageLayout
      title={<Typography variant="h4" sx={{ fontWeight: 700 }}>Navigate Me 🧭</Typography>}
      description="Smart navigation with route history"
      theme={theme}
    >
      {/* Main Search Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            maxWidth: 800,
            mx: "auto",
            mb: 3,
            background: colors.surface,
            backdropFilter: "blur(20px)",
            border: `1px solid ${colors.border}`,
            borderRadius: 4,
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Destination Input */}
            <Box sx={{ position: "relative", mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => setShowRecent(true)}
                onBlur={() => setTimeout(() => setShowRecent(false), 200)}
                onKeyPress={(e) => e.key === "Enter" && calculateRoute()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: colors.accent }} />
                    </InputAdornment>
                  ),
                  endAdornment: destination && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setDestination("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    background: colors.surface,
                    color: colors.text,
                    "& fieldset": { borderColor: colors.border },
                    "&:hover fieldset": { borderColor: colors.accent },
                    "&.Mui-focused fieldset": { borderColor: colors.accent },
                  },
                  "& .MuiInputBase-input::placeholder": { color: colors.textSecondary },
                }}
              />

              {/* Recent Searches Dropdown */}
              <AnimatePresence>
                {showRecent && recentSearches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      marginTop: 8,
                    }}
                  >
                    <Card sx={{ background: colors.surface, backdropFilter: "blur(20px)", border: `1px solid ${colors.border}` }}>
                      <Box sx={{ p: 1.5 }}>
                        <Typography variant="caption" sx={{ color: colors.textSecondary, display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                          <HistoryIcon fontSize="small" /> Recent
                        </Typography>
                        {recentSearches.map((search) => (
                          <Box
                            key={search.id}
                            onClick={() => navigateToRecent(search)}
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              cursor: "pointer",
                              "&:hover": { background: colors.surfaceHover },
                            }}
                          >
                            <Typography sx={{ color: colors.text, fontSize: "0.9rem" }}>
                              {search.destination}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Mode Selector & Navigate Button */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", gap: 1, flex: 1 }}>
                {[
                  { id: "driving", icon: <DirectionsCarIcon />, label: "Drive" },
                  { id: "walking", icon: <DirectionsWalkIcon />, label: "Walk" },
                  { id: "cycling", icon: <DirectionsBikeIcon />, label: "Bike" },
                ].map((m) => (
                  <Tooltip key={m.id} title={m.label}>
                    <Button
                      variant={mode === m.id ? "contained" : "outlined"}
                      onClick={() => setMode(m.id)}
                      sx={{
                        minWidth: 48,
                        height: 48,
                        borderRadius: 2,
                        background: mode === m.id ? colors.gradient : "transparent",
                        borderColor: colors.border,
                        color: mode === m.id ? "#000" : colors.text,
                        "&:hover": {
                          background: mode === m.id ? colors.gradient : colors.surfaceHover,
                          borderColor: colors.accent,
                        },
                      }}
                    >
                      {m.icon}
                    </Button>
                  </Tooltip>
                ))}
              </Box>

              <Button
                variant="contained"
                onClick={calculateRoute}
                disabled={loading || !destination}
                sx={{
                  height: 48,
                  px: 4,
                  borderRadius: 3,
                  background: colors.gradient,
                  color: "#000",
                  fontWeight: 600,
                  "&:hover": { transform: "translateY(-2px)", boxShadow: `0 8px 24px ${colors.accent}40` },
                  "&:disabled": { background: colors.surface, color: colors.textSecondary },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "#000" }} /> : (
                  <>
                    <DirectionsIcon sx={{ mr: 1 }} /> Navigate
                  </>
                )}
              </Button>
            </Box>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Typography sx={{ color: colors.accentSecondary, mt: 2, textAlign: "center" }}>
                  ⚠️ {error}
                </Typography>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ maxWidth: 800, mx: "auto", mb: 3 }}>
            <Typography variant="subtitle2" sx={{ color: colors.textSecondary, mb: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
              <BookmarkIcon fontSize="small" /> Saved Places
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              {savedLocations.map((loc) => (
                <Chip
                  key={loc.id}
                  label={loc.name}
                  icon={<span style={{ fontSize: "1.1rem" }}>{loc.icon}</span>}
                  onClick={() => navigateToLocation(loc)}
                  onDelete={() => deleteLocation(loc.id)}
                  sx={{
                    background: colors.surface,
                    color: colors.text,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 2,
                    py: 2.5,
                    "& .MuiChip-deleteIcon": { color: colors.textSecondary },
                    "&:hover": { background: colors.surfaceHover, borderColor: colors.accent },
                  }}
                />
              ))}
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box
          sx={{
            height: isMobile ? "50vh" : "55vh",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: `0 12px 40px ${colors.border}`,
            position: "relative",
            maxWidth: 1200,
            mx: "auto",
          }}
        >
          {/* Map Controls */}
          <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1000, display: "flex", flexDirection: "column", gap: 1 }}>
            <Tooltip title={followUser ? "Following" : "Follow me"} placement="left">
              <IconButton
                onClick={() => setFollowUser(!followUser)}
                sx={{
                  background: followUser ? colors.accent : colors.surface,
                  color: followUser ? "#000" : colors.text,
                  backdropFilter: "blur(10px)",
                  "&:hover": { background: followUser ? colors.accent : colors.surfaceHover },
                }}
              >
                {followUser ? <GpsFixedIcon /> : <MyLocationIcon />}
              </IconButton>
            </Tooltip>
            {destinationCoords && (
              <Tooltip title="Save this location" placement="left">
                <IconButton
                  onClick={() => setSaveDialogOpen(true)}
                  sx={{ background: colors.surface, color: colors.text, backdropFilter: "blur(10px)" }}
                >
                  <BookmarkBorderIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <MapContainer
            center={currentLocation || [20.5937, 78.9629]}
            zoom={currentLocation ? 15 : 5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url={theme === "dark"
                ? "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              }
            />
            <MapController
              startCoords={currentLocation}
              destinationCoords={destinationCoords}
              followUser={followUser}
              currentLocation={currentLocation}
            />

            {currentLocation && (
              <Marker position={currentLocation} icon={createIcon("📍", colors.accent)}>
                <Popup>Your Location</Popup>
              </Marker>
            )}

            {destinationCoords && (
              <Marker position={destinationCoords} icon={createIcon("🏁", colors.accentSecondary)}>
                <Popup><b>{destination}</b></Popup>
              </Marker>
            )}

            {route && (
              <Polyline
                positions={route.map((c) => [c[1], c[0]])}
                pathOptions={{
                  color: theme === "dark" ? "#64ffda" : "#0095a8",
                  weight: 5,
                  opacity: 0.9,
                }}
              />
            )}
          </MapContainer>
        </Box>
      </motion.div>

      {/* Route Info Card */}
      {distance && duration && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card
            sx={{
              maxWidth: 800,
              mx: "auto",
              mt: 3,
              background: colors.surface,
              backdropFilter: "blur(20px)",
              border: `1px solid ${colors.border}`,
              borderRadius: 4,
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 3 }}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ color: colors.accent, fontWeight: 700 }}>
                    {formatDistance(distance)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>Distance</Typography>
                </Box>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ color: colors.accentSecondary, fontWeight: 700 }}>
                    {formatDuration(duration)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: colors.textSecondary }}>Duration</Typography>
                </Box>
                {arrivalTime && (
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" sx={{ color: colors.text, fontWeight: 700 }}>
                      {arrivalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </Typography>
                    <Typography variant="body2" sx={{ color: colors.textSecondary }}>Arrival</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Turn-by-Turn Steps */}
      {steps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card
            sx={{
              maxWidth: 800,
              mx: "auto",
              mt: 3,
              background: colors.surface,
              backdropFilter: "blur(20px)",
              border: `1px solid ${colors.border}`,
              borderRadius: 4,
              maxHeight: 300,
              overflow: "auto",
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: colors.text, mb: 2 }}>
                📝 Directions
              </Typography>
              {steps.map((step, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    gap: 2,
                    py: 1.5,
                    borderBottom: idx < steps.length - 1 ? `1px solid ${colors.border}` : "none",
                  }}
                >
                  <Box sx={{ color: colors.accent, fontSize: "1.2rem", minWidth: 28 }}>
                    {step.maneuver?.type?.includes("left") ? "↰" :
                      step.maneuver?.type?.includes("right") ? "↱" :
                        step.maneuver?.type === "arrive" ? "🏁" : "→"}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: colors.text, fontSize: "0.95rem" }}>
                      {step.maneuver?.instruction || "Continue"}
                    </Typography>
                    <Typography sx={{ color: colors.textSecondary, fontSize: "0.8rem" }}>
                      {formatDistance(step.distance)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Save Location Dialog */}
      <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)} PaperProps={{
        sx: { background: colors.surface, backdropFilter: "blur(20px)", borderRadius: 3 }
      }}>
        <DialogTitle sx={{ color: colors.text }}>Save Location</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            placeholder="Location name (e.g., Home, Work)"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            sx={{ mt: 1, mb: 2, "& .MuiOutlinedInput-root": { color: colors.text } }}
          />
          <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 1 }}>Pick an icon:</Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {locationIcons.map((icon) => (
              <IconButton
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                sx={{
                  fontSize: "1.5rem",
                  border: selectedIcon === icon ? `2px solid ${colors.accent}` : "none",
                  borderRadius: 2,
                }}
              >
                {icon}
              </IconButton>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialogOpen(false)} sx={{ color: colors.textSecondary }}>Cancel</Button>
          <Button onClick={saveLocation} variant="contained" sx={{ background: colors.gradient, color: "#000" }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default NavigateMe;