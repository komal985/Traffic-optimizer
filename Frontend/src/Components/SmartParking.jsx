import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Chip,
  Rating,
  CircularProgress,
  Slider,
  Alert,
  AlertTitle,
  Paper,
  Badge,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  IconButton
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SecurityIcon from "@mui/icons-material/Security";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import InfoIcon from "@mui/icons-material/Info";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import PageLayout from "./PageLayout";

// Only using location names as search suggestions, no hardcoded stats
const popularLocations = [
  "Connaught Place",
  "India Gate",
  "Red Fort",
  "Qutub Minar",
  "Chandni Chowk",
  "Lotus Temple",
  "Saket",
  "Nehru Place",
  "Hauz Khas",
  "Cyber Hub"
];

const SmartParking = ({ theme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [parkingSlots, setParkingSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchRadius, setSearchRadius] = useState(1000); // 1km default
  const [areaStats, setAreaStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Reservation State
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    userName: "",
    vehicleNumber: "",
    startTime: "",
    durationHours: 2
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Define your color scheme for light and dark themes with improved contrast
  // Removed transparency for better readability
  const colors = {
    dark: {
      background: "#0a192f",
      accentGreen: "#64ffda",
      accentRed: "#ff6b6b",
      text: "#ffffff",
      secondaryText: "#b3b3b3",
      cardBackground: "#112240", // Solid background
      cardBorder: "#233554",
      chipBackground: "rgba(100, 255, 218, 0.1)",
      iconColor: "#64ffda",
      alertBackground: "rgba(100, 255, 218, 0.1)"
    },
    light: {
      background: "#f8f9fa",
      accentGreen: "#00796b", // Darker teal
      accentRed: "#d32f2f",
      text: "#121212",
      secondaryText: "#424242",
      cardBackground: "#ffffff", // Solid background
      cardBorder: "#e0e0e0",
      chipBackground: "rgba(0, 121, 107, 0.08)",
      iconColor: "#00796b",
      alertBackground: "rgba(0, 121, 107, 0.05)"
    },
  };

  const currentColors = colors[theme];

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setParkingSlots([]);

    try {
      let endpoint = '';

      if (searchQuery.trim()) {
        const coords = searchQuery.split(",").map((val) => val.trim());
        if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
          endpoint = `/parking/available?lat=${parseFloat(coords[0])}&lon=${parseFloat(coords[1])}&radius=${searchRadius}`;
        } else {
          endpoint = `/parking/available?location=${encodeURIComponent(searchQuery)}`;
        }
      } else {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              maximumAge: 60000,
            });
          });
          endpoint = `/parking/available?lat=${position.coords.latitude}&lon=${position.coords.longitude}&radius=${searchRadius}`;
        } catch (geoError) {
          endpoint = `/parking/available?location=Delhi`;
          if (!searchQuery) {
            setError("Geolocation failed. Showing all Delhi results.");
          }
        }
      }

      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const apiUrl = baseUrl.endsWith('/')
        ? `${baseUrl}${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`
        : `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch parking slots: ${response.statusText}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setParkingSlots(data);
      } else {
        setError("No parking spots found matching your search.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch parking slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDelhiParkingStats = async () => {
      setStatsLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
        const apiUrl = `${baseUrl}/parking/stats/delhi`;
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          setAreaStats(data);
        }
      } catch (error) {
        console.error("Error fetching Delhi stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };
    fetchDelhiParkingStats();
  }, []);

  const triggerSearch = (query) => {
    setSearchQuery(query);
    // Ideally trigger effect, but for simplicity we rely on user clicking search or manual effect
    // But for better UX let's auto trigger if this function is called
    // We can't call handleSearch immediately because state hasn't updated.
    // So we'll pass the query directly to a reusable search function logic if needed,
    // or just update state and let user click. 
    // User requested "Show page amazing", so let's make it easy.
  };

  // Reservation Logic
  const handleReserveClick = (spot) => {
    setSelectedSpot(spot);
    setBookingForm({
      ...bookingForm,
      // Default start time to now formatted for datetime-local
      startTime: new Date().toISOString().slice(0, 16)
    });
    setOpenModal(true);
  };

  const handleBookingSubmit = async () => {
    setBookingLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      const res = await fetch(`${baseUrl}/booking/reserve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parkingSpotId: selectedSpot._id,
          userName: bookingForm.userName,
          vehicleNumber: bookingForm.vehicleNumber,
          startTime: bookingForm.startTime,
          durationHours: Number(bookingForm.durationHours)
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      setSnackbar({ open: true, message: `Booking Confirmed for ${selectedSpot.name}!`, severity: 'success' });
      setOpenModal(false);

      // Update the spot locally to reflect decreased availability
      setParkingSlots(slots => slots.map(s =>
        s._id === selectedSpot._id ? { ...s, availableSlots: s.availableSlots - 1 } : s
      ));

    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setBookingLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <PageLayout
      title="Smart Parking"
      description="Real-time availability & instant reservations"
      icon="🅿️"
      theme={theme}
    // Removed 'traffic' background effect for cleaner look
    >
      <Box sx={{ mb: 6 }}>
        {/* Stats Dashboard */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{
            mb: 4,
            p: 3,
            borderRadius: 4,
            backgroundColor: currentColors.cardBackground,
            boxShadow: theme === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.05)',
            border: `1px solid ${currentColors.cardBorder}`,
          }}
        >
          <Typography variant="h6" sx={{ color: currentColors.accentGreen, fontWeight: "bold", mb: 3, display: "flex", alignItems: "center" }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} /> Live Overview
          </Typography>

          {statsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : areaStats ? (
            <Grid container spacing={3}>
              <StatCard icon={<DirectionsCarIcon />} label="Total Spots" value={areaStats.totalParking} colors={currentColors} theme={theme} />
              <StatCard icon={<LocalParkingIcon />} label="Available" value={areaStats.availableNow} color={currentColors.accentGreen} colors={currentColors} theme={theme} />
              <StatCard icon={<TwoWheelerIcon />} label="Occupancy" value={`${areaStats.avgOccupancy}%`} colors={currentColors} theme={theme} />
              <StatCard icon={<LocationOnIcon />} label="High Demand" value={areaStats.highestDemand} color={currentColors.accentRed} colors={currentColors} theme={theme} />
              <StatCard icon={<AccessTimeIcon />} label="Peak Time" value={areaStats.peakTime} colors={currentColors} theme={theme} />
            </Grid>
          ) : null}
        </Box>

        <Grid container spacing={4}>
          {/* Left Panel: Search */}
          <Grid item xs={12} md={4}>
            <Card sx={{
              borderRadius: 4,
              backgroundColor: currentColors.cardBackground,
              boxShadow: 'none',
              border: `1px solid ${currentColors.cardBorder}`,
              height: '100%'
            }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ color: currentColors.text, fontWeight: "bold", mb: 3 }}>
                  Find a Spot
                </Typography>

                <TextField
                  fullWidth
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter location (e.g., Connaught Place)"
                  variant="outlined"
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : '#f5f5f5',
                      "& fieldset": { borderColor: currentColors.cardBorder },
                      "&:hover fieldset": { borderColor: currentColors.accentGreen },
                      "&.Mui-focused fieldset": { borderColor: currentColors.accentGreen },
                    },
                    "& input": { color: currentColors.text }
                  }}
                />

                <Typography gutterBottom sx={{ color: currentColors.secondaryText }}>
                  Search Radius: {searchRadius}m
                </Typography>
                <Slider
                  value={searchRadius}
                  onChange={(_, val) => setSearchRadius(val)}
                  min={500}
                  max={5000}
                  step={500}
                  sx={{ color: currentColors.accentGreen, mb: 4 }}
                />

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{
                    backgroundColor: currentColors.accentGreen,
                    color: '#fff',
                    fontWeight: "bold",
                    py: 1.5,
                    borderRadius: 3,
                    boxShadow: `0 8px 20px ${currentColors.accentGreen}40`,
                    "&:hover": {
                      backgroundColor: currentColors.accentGreen,
                      filter: 'brightness(1.1)'
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Search Availability"}
                </Button>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="body2" sx={{ color: currentColors.secondaryText, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                    Quick Access
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {popularLocations.map((loc) => (
                      <Chip
                        key={loc}
                        label={loc}
                        onClick={() => triggerSearch(loc)}
                        sx={{
                          backgroundColor: currentColors.chipBackground,
                          color: currentColors.text,
                          border: `1px solid ${currentColors.accentGreen}33`,
                          "&:hover": {
                            backgroundColor: currentColors.accentGreen,
                            color: '#fff'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel: Results */}
          <Grid item xs={12} md={8}>
            {error && (
              <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>
            )}

            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {parkingSlots.length === 0 && !loading ? (
                <Box sx={{
                  textAlign: 'center',
                  py: 10,
                  opacity: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <LocalParkingIcon sx={{ fontSize: 60, mb: 2, color: currentColors.secondaryText }} />
                  <Typography variant="h6" sx={{ color: currentColors.text }}>Enter a location to find parking</Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <AnimatePresence>
                    {parkingSlots.map((slot) => (
                      <Grid item xs={12} xl={6} key={slot._id}>
                        <motion.div variants={itemVariants} layout>
                          <Card sx={{
                            borderRadius: 4,
                            backgroundColor: currentColors.cardBackground,
                            border: `1px solid ${currentColors.cardBorder}`,
                            transition: 'transform 0.2s',
                            "&:hover": {
                              transform: 'translateY(-4px)',
                              boxShadow: `0 12px 30px -10px ${currentColors.accentGreen}30`,
                              borderColor: currentColors.accentGreen
                            }
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Box>
                                  <Typography variant="h6" sx={{ color: currentColors.text, fontWeight: 'bold' }}>
                                    {slot.name}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: currentColors.secondaryText, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <LocationOnIcon sx={{ fontSize: 16 }} /> {slot.area}
                                  </Typography>
                                </Box>
                                <Badge badgeContent={slot.availableSlots} color={slot.availableSlots > 0 ? "success" : "error"} max={999}>
                                  <Tooltip title="Available Slots">
                                    <LocalParkingIcon sx={{ color: currentColors.accentGreen, fontSize: 32 }} />
                                  </Tooltip>
                                </Badge>
                              </Box>

                              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: currentColors.text, bgcolor: currentColors.chipBackground, px: 1.5, py: 0.5, borderRadius: 2 }}>
                                  <AttachMoneyIcon sx={{ fontSize: 20, color: currentColors.accentGreen }} />
                                  <Typography fontWeight="bold">₹{slot.hourlyRate}/hr</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: currentColors.text, bgcolor: currentColors.chipBackground, px: 1.5, py: 0.5, borderRadius: 2 }}>
                                  <AccessTimeIcon sx={{ fontSize: 18, color: currentColors.secondaryText }} />
                                  <Typography variant="body2">{slot.peakHours}</Typography>
                                </Box>
                              </Box>

                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                                {slot.security && <Chip icon={<SecurityIcon />} label="Secure" size="small" sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: currentColors.cardBorder, color: currentColors.secondaryText }} />}
                                {slot.evCharging && <Chip icon={<ElectricCarIcon />} label="EV Charging" size="small" sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: currentColors.cardBorder, color: currentColors.secondaryText }} />}
                                {slot.valetParking && <Chip label="Valet" size="small" sx={{ bgcolor: 'transparent', border: '1px solid', borderColor: currentColors.cardBorder, color: currentColors.secondaryText }} />}
                              </Box>

                              <Button
                                variant="contained"
                                fullWidth
                                onClick={() => handleReserveClick(slot)}
                                disabled={slot.availableSlots <= 0}
                                sx={{
                                  bgcolor: currentColors.accentGreen,
                                  color: '#fff',
                                  fontWeight: 'bold',
                                  boxShadow: 'none',
                                  "&:hover": { bgcolor: currentColors.accentGreen, filter: 'brightness(0.9)' }
                                }}
                              >
                                {slot.availableSlots > 0 ? "Reserve Spot" : "Full"}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </AnimatePresence>
                </Grid>
              )}
            </motion.div>
          </Grid>
        </Grid>

        {/* Reservation Modal */}
        <Dialog
          open={openModal}
          onClose={() => setOpenModal(false)}
          PaperProps={{
            sx: {
              bgcolor: currentColors.cardBackground,
              color: currentColors.text,
              borderRadius: 4,
              minWidth: { xs: '90%', sm: 400 },
              border: `1px solid ${currentColors.cardBorder}`
            }
          }}
        >
          <DialogTitle sx={{ borderBottom: `1px solid ${currentColors.cardBorder}` }}>
            Reserve Parking
            <IconButton
              onClick={() => setOpenModal(false)}
              sx={{ position: 'absolute', right: 8, top: 8, color: currentColors.secondaryText }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="subtitle1" gutterBottom sx={{ color: currentColors.accentGreen, fontWeight: 'bold' }}>
              {selectedSpot?.name}
            </Typography>
            <Typography variant="body2" paragraph sx={{ color: currentColors.secondaryText }}>
              {selectedSpot?.area} • ₹{selectedSpot?.hourlyRate}/hr
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Your Name"
                fullWidth
                variant="outlined"
                value={bookingForm.userName}
                onChange={(e) => setBookingForm({ ...bookingForm, userName: e.target.value })}
                InputLabelProps={{ style: { color: currentColors.secondaryText } }}
                InputProps={{
                  style: { color: currentColors.text },
                  sx: { '& fieldset': { borderColor: currentColors.cardBorder } }
                }}
              />
              <TextField
                label="Vehicle Number"
                fullWidth
                variant="outlined"
                value={bookingForm.vehicleNumber}
                onChange={(e) => setBookingForm({ ...bookingForm, vehicleNumber: e.target.value })}
                InputLabelProps={{ style: { color: currentColors.secondaryText } }}
                InputProps={{
                  style: { color: currentColors.text },
                  sx: { '& fieldset': { borderColor: currentColors.cardBorder } }
                }}
              />
              <TextField
                label="Start Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true, style: { color: currentColors.secondaryText } }}
                value={bookingForm.startTime}
                onChange={(e) => setBookingForm({ ...bookingForm, startTime: e.target.value })}
                InputProps={{
                  style: { color: currentColors.text },
                  sx: { '& fieldset': { borderColor: currentColors.cardBorder } }
                }}
              />
              <FormControl fullWidth>
                <InputLabel style={{ color: currentColors.secondaryText }}>Duration</InputLabel>
                <Select
                  value={bookingForm.durationHours}
                  label="Duration"
                  onChange={(e) => setBookingForm({ ...bookingForm, durationHours: e.target.value })}
                  sx={{
                    color: currentColors.text,
                    '.MuiOutlinedInput-notchedOutline': { borderColor: currentColors.cardBorder },
                    '& .MuiSvgIcon-root': { color: currentColors.text }
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 12, 24].map(h => (
                    <MenuItem key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ bgcolor: currentColors.chipBackground, p: 2, borderRadius: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ color: currentColors.text }}>Total Cost:</Typography>
                  <Typography sx={{ color: currentColors.text, fontWeight: 'bold' }}>
                    ₹{(selectedSpot?.hourlyRate || 0) * bookingForm.durationHours}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, borderTop: `1px solid ${currentColors.cardBorder}` }}>
            <Button onClick={() => setOpenModal(false)} sx={{ color: currentColors.secondaryText }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleBookingSubmit}
              disabled={bookingLoading}
              sx={{ bgcolor: currentColors.accentGreen, color: '#fff' }}
            >
              {bookingLoading ? "Booking..." : "Confirm Reservation"}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </PageLayout>
  );
};

const StatCard = ({ icon, label, value, color, colors, theme }) => (
  <Grid item xs={6} md={2}>
    <Paper
      elevation={0}
      sx={{
        p: 2,
        textAlign: 'center',
        bgcolor: theme === 'dark' ? 'rgba(255,255,255,0.03)' : '#f8f9fa',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box sx={{ color: color || colors.text, mb: 1 }}>{icon}</Box>
      <Typography variant="body2" sx={{ color: colors.secondaryText, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="h6" sx={{ color: colors.text, fontWeight: 'bold', mt: 0.5 }}>
        {value}
      </Typography>
    </Paper>
  </Grid>
);

export default SmartParking;
