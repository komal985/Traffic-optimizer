import React, { useState, useEffect } from "react";
import { 
  Box, Grid, Card, CardContent, Typography, CircularProgress, 
  Button, Slider, FormControl, InputLabel, Select, MenuItem, 
  ToggleButtonGroup, ToggleButton
} from "@mui/material";
import { motion } from "framer-motion";
import PageLayout from "../Components/PageLayout";
import TimelineIcon from "@mui/icons-material/Timeline";
import ViewInArIcon from "@mui/icons-material/ViewInAr";
import MapIcon from "@mui/icons-material/Map";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Mock traffic flow data
const generateTrafficData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(hour => {
    let baseValue = 0;
    
    // Morning rush hour (7-9 AM)
    if (hour >= 7 && hour <= 9) {
      baseValue = 70 + Math.random() * 20;
    } 
    // Evening rush hour (4-7 PM)
    else if (hour >= 16 && hour <= 19) {
      baseValue = 80 + Math.random() * 15;
    }
    // Normal daytime hours
    else if (hour >= 10 && hour <= 15) {
      baseValue = 40 + Math.random() * 20;
    }
    // Late night/early morning
    else {
      baseValue = 10 + Math.random() * 15;
    }
    
    return {
      hour: hour,
      congestion: Math.round(baseValue),
      vehicles: Math.round(baseValue * 20),
      speed: Math.round(Math.max(10, 70 - (baseValue * 0.6))),
    };
  });
};

const TrafficFlow = ({ theme }) => {
  const [trafficData, setTrafficData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 23]);
  const [selectedLocation, setSelectedLocation] = useState('downtown');
  const [viewMode, setViewMode] = useState('chart');
  
  const colors = {
    dark: {
      background: "#0a192f",
      accentGreen: "#64ffda",
      accentRed: "#f07178",
      text: "#ccd6f6",
      cardBackground: "rgba(17, 34, 64, 0.8)",
      chart: {
        low: "#64ffda",
        medium: "#ffb74d",
        high: "#f07178",
      }
    },
    light: {
      background: "#f5f5f7",
      accentGreen: "#00bcd4",
      accentRed: "#ff5252",
      text: "#333333",
      cardBackground: "rgba(255, 255, 255, 0.85)",
      chart: {
        low: "#00bcd4",
        medium: "#ff9800",
        high: "#f44336",
      }
    },
  };

  const currentColors = colors[theme || "dark"];
  
  // Load initial data
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setTrafficData(generateTrafficData());
      setLoading(false);
    }, 1500);
  }, [selectedLocation]);
  
  // Filter data by time range
  const filteredData = trafficData.filter(
    (item) => item.hour >= timeRange[0] && item.hour <= timeRange[1]
  );
  
  // Calculate averages
  const calculateAverages = () => {
    if (filteredData.length === 0) return { congestion: 0, vehicles: 0, speed: 0 };
    
    const sum = filteredData.reduce(
      (acc, item) => ({
        congestion: acc.congestion + item.congestion,
        vehicles: acc.vehicles + item.vehicles,
        speed: acc.speed + item.speed,
      }),
      { congestion: 0, vehicles: 0, speed: 0 }
    );
    
    return {
      congestion: Math.round(sum.congestion / filteredData.length),
      vehicles: Math.round(sum.vehicles / filteredData.length),
      speed: Math.round(sum.speed / filteredData.length),
    };
  };
  
  const averages = calculateAverages();
  
  const handleTimeRangeChange = (event, newValue) => {
    setTimeRange(newValue);
  };
  
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };
  
  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  // Set different locations
  const locations = [
    { value: 'downtown', label: 'Downtown' },
    { value: 'highway101', label: 'Highway 101' },
    { value: 'suburban', label: 'Suburban Area' },
    { value: 'commercial', label: 'Commercial District' },
    { value: 'industrial', label: 'Industrial Zone' },
  ];
  
  return (
    <PageLayout 
      title="Traffic Flow Visualization" 
      description="View real-time 3D models of traffic patterns to optimize your journey planning."
      icon="📊"
      theme={theme}
    >
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Card
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              backgroundColor: currentColors.cardBackground,
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, alignItems: { md: "center" }, mb: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="location-select-label" sx={{ color: currentColors.text }}>Location</InputLabel>
                  <Select
                    labelId="location-select-label"
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    label="Location"
                    sx={{
                      color: currentColors.text,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: currentColors.accentGreen,
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: currentColors.accentGreen,
                      },
                    }}
                  >
                    {locations.map((loc) => (
                      <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <ToggleButtonGroup
                  value={viewMode}
                  exclusive
                  onChange={handleViewModeChange}
                  aria-label="visualization mode"
                >
                  <ToggleButton 
                    value="chart" 
                    aria-label="chart view"
                    sx={{ 
                      color: viewMode === 'chart' ? currentColors.accentGreen : currentColors.text,
                      borderColor: currentColors.accentGreen,
                      "&.Mui-selected": {
                        backgroundColor: `${currentColors.accentGreen}20`,
                        color: currentColors.accentGreen,
                      }
                    }}
                  >
                    <TimelineIcon />
                  </ToggleButton>
                  <ToggleButton 
                    value="map" 
                    aria-label="map view"
                    sx={{ 
                      color: viewMode === 'map' ? currentColors.accentGreen : currentColors.text,
                      borderColor: currentColors.accentGreen,
                      "&.Mui-selected": {
                        backgroundColor: `${currentColors.accentGreen}20`,
                        color: currentColors.accentGreen,
                      }
                    }}
                  >
                    <MapIcon />
                  </ToggleButton>
                  <ToggleButton 
                    value="3d" 
                    aria-label="3D view"
                    sx={{ 
                      color: viewMode === '3d' ? currentColors.accentGreen : currentColors.text,
                      borderColor: currentColors.accentGreen,
                      "&.Mui-selected": {
                        backgroundColor: `${currentColors.accentGreen}20`,
                        color: currentColors.accentGreen,
                      }
                    }}
                  >
                    <ViewInArIcon />
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
              
              <Box sx={{ px: 2, mt: 4 }}>
                <Typography variant="body2" sx={{ color: currentColors.text, mb: 1 }}>
                  Time Range: {timeRange[0]}:00 - {timeRange[1]}:00
                </Typography>
                <Slider
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={23}
                  sx={{
                    color: currentColors.accentGreen,
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px ${currentColors.accentGreen}20`,
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card
            component={motion.div}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            sx={{
              backgroundColor: currentColors.cardBackground,
              backdropFilter: "blur(10px)",
              borderRadius: "16px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              height: "100%",
            }}
          >
            <CardContent sx={{ p: 3, height: "100%" }}>
              <Typography
                variant="h5"
                sx={{
                  color: currentColors.text,
                  fontWeight: "bold",
                  mb: 3,
                }}
              >
                Traffic Flow Visualization
              </Typography>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "300px" }}>
                  <CircularProgress sx={{ color: currentColors.accentGreen }} />
                </Box>
              ) : (
                <Box sx={{ height: "400px", position: "relative" }}>
                  {viewMode === 'chart' && (
                    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <Box sx={{ display: "flex", height: "300px", alignItems: "flex-end", gap: 1 }}>
                        {filteredData.map((item, index) => (
                          <Box
                            key={index}
                            component={motion.div}
                            initial={{ height: 0 }}
                            animate={{ height: `${item.congestion}%` }}
                            transition={{ duration: 0.5, delay: index * 0.03 }}
                            sx={{
                              width: `${90 / filteredData.length}%`,
                              minWidth: "8px",
                              backgroundColor: 
                                item.congestion < 30 ? currentColors.chart.low :
                                item.congestion < 60 ? currentColors.chart.medium :
                                currentColors.chart.high,
                              borderRadius: "4px 4px 0 0",
                              position: "relative",
                              "&:hover": {
                                opacity: 0.8,
                              },
                              "&:hover::after": {
                                content: `"${item.congestion}%"`,
                                position: "absolute",
                                top: "-25px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                backgroundColor: "rgba(0,0,0,0.8)",
                                color: "#fff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                              }
                            }}
                          />
                        ))}
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                        <Typography variant="body2" sx={{ color: currentColors.text }}>
                          {timeRange[0]}:00
                        </Typography>
                        <Typography variant="body2" sx={{ color: currentColors.text }}>
                          {timeRange[1]}:00
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  
                  {viewMode === 'map' && (
                    <Box
                      sx={{
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ color: currentColors.text }}>
                        Interactive map visualization would appear here
                      </Typography>
                    </Box>
                  )}
                  
                  {viewMode === '3d' && (
                    <Box
                      sx={{
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ color: currentColors.text }}>
                        3D traffic model would appear here
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              sx={{
                backgroundColor: currentColors.cardBackground,
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: currentColors.text,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  Traffic Statistics
                </Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {[
                    { 
                      icon: <TrendingUpIcon />, 
                      label: "Average Congestion", 
                      value: `${averages.congestion}%`,
                      color: averages.congestion < 30 ? currentColors.chart.low :
                            averages.congestion < 60 ? currentColors.chart.medium :
                            currentColors.chart.high
                    },
                    { 
                      icon: <MapIcon />, 
                      label: "Average Vehicles", 
                      value: averages.vehicles,
                      color: currentColors.accentGreen
                    },
                    { 
                      icon: <AccessTimeIcon />, 
                      label: "Average Speed", 
                      value: `${averages.speed} km/h`,
                      color: currentColors.accentGreen
                    },
                  ].map((stat, index) => (
                    <Box
                      key={index}
                      sx={{
                        backgroundColor: "rgba(0,0,0,0.2)",
                        borderRadius: "8px",
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: `${stat.color}20`,
                          color: stat.color,
                          borderRadius: "50%",
                          width: 48,
                          height: 48,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mr: 2,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: currentColors.text, opacity: 0.8 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ color: stat.color, fontWeight: "bold" }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: currentColors.accentGreen,
                    color: theme === "dark" ? "#112240" : "#ffffff",
                    fontWeight: "bold",
                    mt: 3,
                    py: 1.5,
                    "&:hover": {
                      backgroundColor: theme === "dark" ? "#8bffed" : "#00a0b2",
                    }
                  }}
                >
                  Export Report
                </Button>
              </CardContent>
            </Card>
            
            <Card
              sx={{
                backgroundColor: currentColors.cardBackground,
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: currentColors.text,
                    fontWeight: "bold",
                    mb: 2,
                  }}
                >
                  Optimal Travel Times
                </Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  {[
                    { timeSlot: "6:00 - 7:00", congestion: "Low", recommendation: "Highly Recommended" },
                    { timeSlot: "10:00 - 11:30", congestion: "Moderate", recommendation: "Recommended" },
                    { timeSlot: "13:30 - 15:00", congestion: "Moderate", recommendation: "Recommended" },
                    { timeSlot: "20:00 - 22:00", congestion: "Low", recommendation: "Highly Recommended" },
                  ].map((time, index) => (
                    <Box
                      key={index}
                      sx={{
                        p: 1.5,
                        borderLeft: `3px solid ${time.congestion === "Low" ? currentColors.chart.low : currentColors.chart.medium}`,
                        backgroundColor: "rgba(0,0,0,0.1)",
                        borderRadius: "0 4px 4px 0",
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ color: currentColors.text, fontWeight: "bold" }}>
                        {time.timeSlot}
                      </Typography>
                      <Typography variant="body2" sx={{ color: currentColors.text, opacity: 0.8 }}>
                        {time.recommendation}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default TrafficFlow;
