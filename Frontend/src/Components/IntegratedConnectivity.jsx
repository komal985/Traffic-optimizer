import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  CircularProgress,
  Grid,
  Chip,
  IconButton,
  Alert,
  Paper,
  Divider
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import DirectionsIcon from '@mui/icons-material/Directions';
import PlaceIcon from '@mui/icons-material/Place';
import SearchIcon from '@mui/icons-material/Search';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import TrainIcon from '@mui/icons-material/Train';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import CircleIcon from '@mui/icons-material/Circle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

import PageLayout from "./PageLayout";
import { tokens } from "../theme";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const IntegratedConnectivity = ({ theme }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const t = tokens[theme];

  // Helper to get Icon based on Mode
  const getModeIcon = (mode) => {
    const m = mode.toLowerCase();
    if (m.includes("metro") || m.includes("train")) return <TrainIcon />;
    if (m.includes("bus")) return <DirectionsBusIcon />;
    if (m.includes("walk")) return <DirectionsWalkIcon />;
    if (m.includes("taxi") || m.includes("cab")) return <LocalTaxiIcon />;
    if (m.includes("driving") || m.includes("car")) return <DirectionsCarIcon />;
    return <DirectionsIcon />;
  };

  const fetchRoutes = async () => {
    if (!origin || !destination) {
      setError("Please enter both origin and destination");
      return;
    }
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/commuter/get-route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Connectivity service returned an invalid response. Please try again.");
      }
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch routes");

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setOrigin(`${pos.coords.latitude},${pos.coords.longitude}`);
          setLoading(false);
        },
        (err) => {
          setError("Location access denied");
          setLoading(false);
        }
      );
    }
  };

  return (
    <PageLayout
      title="Integrated Connectivity"
      description="Seamless multi-modal travel planning across Delhi NCR."
      icon={<DirectionsIcon style={{ color: t.primary }} />}
      theme={theme}
    >
      <Grid container spacing={4}>

        {/* LEFT: Search Panel */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              background: t.bgElevated,
              backdropFilter: t.backdrop,
              border: `1px solid ${t.border}`,
              borderRadius: "24px",
              boxShadow: t.shadowLg,
              overflow: 'visible'
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ color: t.textPrimary, mb: 3, fontWeight: 700 }}>
                Plan Your Journey
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Starting Point"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  InputProps={{
                    startAdornment: <PlaceIcon sx={{ color: t.accentGreen, mr: 1 }} />,
                    endAdornment: (
                      <IconButton onClick={handleUseCurrentLocation} size="small">
                        <MyLocationIcon sx={{ color: t.textSecondary, fontSize: 18 }} />
                      </IconButton>
                    ),
                    style: { color: t.textPrimary, background: t.bgCard, borderRadius: '12px' }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: t.border },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.primary }
                  }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'center', my: -1, zIndex: 1 }}>
                  <IconButton
                    onClick={() => { setOrigin(destination); setDestination(origin); }}
                    sx={{ background: t.bgElevated, border: `1px solid ${t.border}`, color: t.textPrimary }}
                  >
                    <SwapHorizIcon fontSize="small" />
                  </IconButton>
                </Box>

                <TextField
                  fullWidth
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  InputProps={{
                    startAdornment: <PlaceIcon sx={{ color: t.accentRed, mr: 1 }} />,
                    style: { color: t.textPrimary, background: t.bgCard, borderRadius: '12px' }
                  }}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: t.border },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: t.primary }
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  onClick={fetchRoutes}
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    background: t.gradientPrimary,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: `0 4px 14px ${t.primary}40`
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Find Route"}
                </Button>

                {error && (
                  <Alert severity="error" sx={{ mt: 2, borderRadius: '12px' }}>{error}</Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT: Results Panel */}
        <Grid item xs={12} md={8}>
          <AnimatePresence mode="wait">
            {!results && !loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Box sx={{
                  height: '100%',
                  minHeight: 400,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: t.textSecondary,
                  flexDirection: 'column',
                  textAlign: 'center'
                }}>
                  <DirectionsIcon sx={{ fontSize: 60, mb: 2, opacity: 0.2 }} />
                  <Typography variant="h6">Enter locations to see magic routes</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>We combine Metro, Bus, and Walk for you.</Typography>
                </Box>
              </motion.div>
            )}

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Typography variant="h5" sx={{ color: t.textPrimary, mb: 3, fontWeight: 700 }}>
                  Recommended Routes
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {results.recommended.map((route, idx) => (
                    <Card
                      key={idx}
                      sx={{
                        background: t.bgElevated,
                        backdropFilter: t.backdrop,
                        border: `1px solid ${t.border}`,
                        borderRadius: "20px",
                        overflow: 'visible'
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        {/* Header of the Result Card */}
                        <Box sx={{
                          p: 3,
                          borderBottom: `1px solid ${t.border}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                              p: 1.5,
                              borderRadius: '12px',
                              background: `${t.primary}20`,
                              color: t.primary
                            }}>
                              {getModeIcon(route.mode)}
                            </Box>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: t.textPrimary }}>
                                {route.mode}
                              </Typography>
                              <Typography variant="body2" sx={{ color: t.textSecondary }}>
                                Via {route.segments.map(s => s.mode).join(" + ")}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 3, textAlign: 'right' }}>
                            <Box>
                              <Typography variant="caption" sx={{ color: t.textSecondary, display: 'block' }}>Duration</Typography>
                              <Typography variant="h6" sx={{ color: t.textPrimary, fontWeight: 700 }}>
                                {route.totalDuration} min
                              </Typography>
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ color: t.textSecondary, display: 'block' }}>Cost</Typography>
                              <Typography variant="h6" sx={{ color: t.primary, fontWeight: 700 }}>
                                ₹{route.cost}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Timeline Segments */}
                        <Box sx={{ p: 3 }}>
                          {route.segments.map((segment, i) => (
                            <Box key={i} sx={{ display: 'flex', mb: i === route.segments.length - 1 ? 0 : 0 }}>
                              {/* Timeline Line */}
                              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, minWidth: 24 }}>
                                <CircleIcon sx={{ fontSize: 12, color: t.primary }} />
                                {i !== route.segments.length - 1 && (
                                  <Box sx={{
                                    width: 2,
                                    flex: 1,
                                    background: `linear-gradient(to bottom, ${t.primary} 50%, transparent 100%)`,
                                    my: 0.5
                                  }} />
                                )}
                              </Box>

                              {/* Segment Details */}
                              <Box sx={{ pb: 3, flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: t.textPrimary, fontWeight: 600 }}>
                                  {segment.mode}
                                  {segment.line && <Chip size="small" label={segment.line} sx={{ ml: 1, height: 20, fontSize: '0.7rem', background: t.accentYellow, color: '#000' }} />}
                                </Typography>
                                <Typography variant="body2" sx={{ color: t.textSecondary, mt: 0.5 }}>
                                  From <b>{segment.from}</b> to <b>{segment.to}</b>
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                  <Chip
                                    icon={<AccessTimeIcon sx={{ fontSize: '1rem !important' }} />}
                                    label={`${segment.duration} min`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ borderColor: t.border, color: t.textSecondary }}
                                  />
                                  {segment.distance && (
                                    <Chip
                                      label={segment.distance}
                                      size="small"
                                      variant="outlined"
                                      sx={{ borderColor: t.border, color: t.textSecondary }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default IntegratedConnectivity;
