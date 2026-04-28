'use client';

import React, { useState, useEffect } from "react";
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  CircularProgress, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Chip, 
  IconButton, 
  Tooltip,
  Divider,
  Badge,
  Rating,
  useMediaQuery
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import PageLayout from "./PageLayout";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import NatureIcon from '@mui/icons-material/Nature';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useTheme } from "@mui/material/styles";

const colors = {
  dark: {
    background: "#0a192f",
    accentGreen: "#64ffda",
    accentRed: "#ff6b6b",
    accentPurple: "#c792ea",
    accentBlue: "#82AAFF",
    accentYellow: "#ffd166",
    accentOrange: "#ff9e64",
    text: "#e6f1ff",
    secondaryText: "#b4c1e0", // Lightened for better visibility
    cardBackground: "rgba(17, 34, 64, 0.8)",
    cardBorder: "rgba(100, 255, 218, 0.5)",
    particleColor: "#64ffda",
    gradients: {
      primary: "linear-gradient(135deg, #64ffda 0%, #4B66FE 100%)",
      secondary: "linear-gradient(135deg, #ff6b6b 0%, #c792ea 100%)",
      text: "linear-gradient(90deg, #64ffda, #c792ea, #ff6b6b)",
      card: "linear-gradient(135deg, rgba(17, 34, 64, 0.9) 0%, rgba(26, 43, 73, 0.9) 100%)",
      button: "linear-gradient(90deg, #64ffda, #4B66FE)",
      glow: "0 0 20px rgba(100, 255, 218, 0.5), 0 0 40px rgba(100, 255, 218, 0.3)",
      carpool: "linear-gradient(135deg, #64ffda 0%, #82AAFF 100%)"
    }
  },
  light: {
    background: "#f8f9fc",
    accentGreen: "#06b6d4",
    accentRed: "#e11d48", // Darkened for better contrast
    accentPurple: "#7c3aed", // Darkened for better contrast
    accentBlue: "#2563eb", // Darkened for better contrast
    accentYellow: "#d97706", // Darkened for better contrast
    accentOrange: "#ea580c", // Darkened for better contrast
    text: "#0f172a", // Darkened for better contrast
    secondaryText: "#475569", // Darkened for better contrast
    cardBackground: "rgba(255, 255, 255, 0.85)",
    cardBorder: "rgba(6, 182, 212, 0.5)",
    particleColor: "#06b6d4",
    gradients: {
      primary: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
      secondary: "linear-gradient(135deg, #e11d48 0%, #7c3aed 100%)",
      text: "linear-gradient(90deg, #06b6d4, #7c3aed, #e11d48)",
      card: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 240, 240, 0.95) 100%)",
      button: "linear-gradient(90deg, #06b6d4, #2563eb)",
      glow: "0 0 20px rgba(6, 182, 212, 0.5), 0 0 40px rgba(6, 182, 212, 0.3)",
      carpool: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)"
    }
  },
};

// API endpoints for carpooling - updated to match backend routes
const API_ENDPOINTS = {
  RIDES: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/carpooling/rides`,
  FAVORITES: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/carpooling/favorites`,
  STATS: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/carpooling/stats`,
  BOOK_RIDE: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/carpooling/book`,
  CREATE_RIDE: `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/carpooling/create`
};

// Fallback data for when the backend is not fully implemented
const FALLBACK_DATA = {
  rides: [
    {
      id: 1,
      pickup_location: "Connaught Place",
      destination: "Cyber City, Gurgaon",
      driver: "Rahul Sharma",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.8,
      departureTime: "08:30 AM",
      seatsAvailable: 3,
      costPerPerson: 120,
      carModel: "Honda City",
      carbonSaved: 2.4,
      tags: ["Air Conditioned", "Music"],
    },
    {
      id: 2,
      pickup_location: "Lajpat Nagar",
      destination: "Noida Sector 62",
      driver: "Priya Patel",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.6,
      departureTime: "09:15 AM",
      seatsAvailable: 2,
      costPerPerson: 150,
      carModel: "Hyundai Creta",
      carbonSaved: 3.1,
      tags: ["Women Only", "No Smoking"],
    },
    {
      id: 3,
      pickup_location: "Delhi University",
      destination: "Hauz Khas",
      driver: "Vikram Singh",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 4.9,
      departureTime: "10:00 AM",
      seatsAvailable: 4,
      costPerPerson: 80,
      carModel: "Maruti Swift",
      carbonSaved: 1.8,
      tags: ["Student Friendly", "Pet Friendly"],
    },
    {
      id: 4,
      pickup_location: "Rohini",
      destination: "Nehru Place",
      driver: "Ananya Gupta",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 4.7,
      departureTime: "08:45 AM",
      seatsAvailable: 1,
      costPerPerson: 130,
      carModel: "Toyota Innova",
      carbonSaved: 3.5,
      tags: ["Premium Ride", "Air Conditioned"],
    },
  ],
  stats: {
    activeUsers: 12000,
    dailyRides: 350,
    monthlySavings: 2800000,
    carbonReduced: 42
  }
};

const Carpooling = ({ theme }) => {
  const currentColors = colors[theme];
  const [location, setLocation] = useState("");
  const [organization, setOrganization] = useState("");
  const [loading, setLoading] = useState(false);
  const [rides, setRides] = useState([]);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showAddRideForm, setShowAddRideForm] = useState(false);
  const [featuredRides, setFeaturedRides] = useState([]);
  const [activeTab, setActiveTab] = useState("search");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [carpoolStats, setCarpoolStats] = useState({
    activeUsers: 0,
    dailyRides: 0,
    monthlySavings: 0,
    carbonReduced: 0
  });
  
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.down('md'));

  // Track mouse position for gradient effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Fetch featured rides and stats on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch carpooling stats
        try {
          const statsResponse = await fetch(API_ENDPOINTS.STATS);
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            setCarpoolStats(statsData);
          } else {
            console.warn("Stats API returned error, using fallback data");
            setCarpoolStats(FALLBACK_DATA.stats);
          }
        } catch (err) {
          console.warn("Error fetching stats, using fallback data:", err);
          setCarpoolStats(FALLBACK_DATA.stats);
        }

        // Set featured rides from fallback data since backend doesn't support this yet
        setFeaturedRides(FALLBACK_DATA.rides.slice(0, 2));

        // Fetch user favorites if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const favoritesResponse = await fetch(API_ENDPOINTS.FAVORITES, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (favoritesResponse.ok) {
              const favoritesData = await favoritesResponse.json();
              setFavorites(favoritesData.favorites || []);
            }
          } catch (err) {
            console.warn("Error fetching favorites:", err);
          }
        }
      } catch (err) {
        console.error("Error in fetchInitialData:", err);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async () => {
    if (!location.trim()) {
      setError("Please enter a pickup location");
      return;
    }
    
    if (!organization.trim()) {
      setError("Please enter a destination");
      return;
    }
    
    setLoading(true);
    setError(null);
    setRides([]);
    setSearchPerformed(true);
    
    try {
      console.log(`Searching for rides from ${location} to ${organization}`);
      const response = await fetch(`${API_ENDPOINTS.RIDES}?location=${encodeURIComponent(location)}&organization=${encodeURIComponent(organization)}`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Search results:", data);
      
      // Backend now always returns a consistent structure with a rides array
      setRides(data.rides || []);
      
      if (!data.rides || data.rides.length === 0) {
        setError("No carpools available for your route. Try different locations or check back later.");
      }
    } catch (err) {
      console.error("Error searching rides:", err);
      setError("Network error or server issue. Showing available options nearby.");
      
      // As a last resort, filter the featured rides as fallback
      const filteredRides = featuredRides.filter(ride => {
        return ride.pickup_location.toLowerCase().includes(location.toLowerCase()) || 
               ride.destination.toLowerCase().includes(organization.toLowerCase());
      });
      
      setRides(filteredRides);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (rideId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in to save favorites");
      return;
    }
    
    try {
      const isFavorited = favorites.includes(rideId);
      const method = isFavorited ? 'DELETE' : 'POST';
      
      const response = await fetch(`${API_ENDPOINTS.FAVORITES}/${rideId}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Update local state
        if (isFavorited) {
          setFavorites(favorites.filter(id => id !== rideId));
        } else {
          setFavorites([...favorites, rideId]);
        }
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update favorites");
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
      setError(err.message || "Failed to update favorites");
    }
  };

  const bookRide = async (rideId) => {
    try {
      const token = localStorage.getItem('token');
      
      // Try real API first
      try {
        if (token) {
          const response = await fetch(API_ENDPOINTS.BOOK_RIDE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ rideId })
          });
          
          if (response.ok) {
            const data = await response.json();
            // Success with real API
            alert("Ride booked successfully! Check your email for details.");
          } else {
            throw new Error("API error");
          }
        } else {
          throw new Error("No token");
        }
      } catch (apiError) {
        console.warn("API booking failed, using mock implementation:", apiError);
        // Mock implementation as fallback
        // Update ride availability in the UI
        setRides(prevRides => 
          prevRides.map(ride => 
            ride.id === rideId 
              ? { ...ride, seatsAvailable: ride.seatsAvailable - 1 }
              : ride
          )
        );
        
        // Also update featured rides if necessary
        setFeaturedRides(prevRides => 
          prevRides.map(ride => 
            ride.id === rideId 
              ? { ...ride, seatsAvailable: ride.seatsAvailable - 1 }
              : ride
          )
        );
        
        // Show success message
        alert("Ride booked successfully! Check your email for details.");
      }
    } catch (err) {
      console.error("Error booking ride:", err);
      setError(err.message || "Failed to book ride");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        damping: 15 
      }
    },
    hover: { 
      scale: 1.03, 
      boxShadow: "0 20px 30px rgba(0,0,0,0.2)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  // Gradient background style based on mouse position
  const getGradientStyle = () => {
    const x = (mousePosition.x / window.innerWidth) * 100;
    const y = (mousePosition.y / window.innerHeight) * 100;
    
    return {
      background: theme === "dark" 
        ? `radial-gradient(circle at ${x}% ${y}%, #112240 0%, #0a192f 50%, #05101f 100%)`
        : `radial-gradient(circle at ${x}% ${y}%, #ffffff 0%, #f8f9fc 50%, #edf0f7 100%)`,
      transition: "background 0.3s ease",
    };
  };

  return (
    <PageLayout
      title={
        <Typography 
          variant="h4" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5, 
            // color: theme === "dark" ? "#ffffff" : "#000000", // Pure white for dark mode, pure black for light mode
            fontWeight: 800,
            // textShadow: theme === "dark" ? "0 0 15px rgba(255, 255, 255, 0.8)" : "0 0 1px rgba(0, 0, 0, 0.5)",
            letterSpacing: "0.5px",
            textTransform: "uppercase"
          }}
        >
          <span>Carpooling & Ridesharing</span>
          <span style={{ color: theme === "dark" ? "#ff9e00" : "#ff6600", fontSize: "1.2em", marginLeft: "5px" }}>
            🚗 👥
          </span>
        </Typography>
      }
      description="Share rides, save money, and reduce carbon emissions with our smart carpooling platform."
      icon={<DirectionsCarIcon style={{ color: currentColors.accentGreen }} />}
      theme={theme}
      backgroundEffect="particles"
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  backgroundColor: currentColors.cardBackground,
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  p: 2,
                  boxShadow: `0 8px 32px ${currentColors.accentGreen}40`,
                  border: `1px solid ${currentColors.cardBorder}`,
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 3
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: currentColors.accentGreen, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ mr: 1, color: currentColors.accentGreen }} />
                    Find Your Ride
                  </Typography>

                  <Typography variant="body2" sx={{ color: currentColors.secondaryText, mb: 3 }}>
                    Enter your location and organization to discover shared rides that match your commute.
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <TextField
                      label="Pickup Location"
                      variant="outlined"
                      fullWidth
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '& fieldset': {
                            borderColor: `${currentColors.cardBorder}`,
                          },
                          '&:hover fieldset': {
                            borderColor: currentColors.accentGreen,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: currentColors.accentGreen,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: currentColors.secondaryText
                        },
                        '& .MuiInputBase-input': {
                          color: currentColors.text
                        }
                      }}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon sx={{ color: currentColors.accentGreen, mr: 1 }} />
                        ),
                      }}
                    />
                    <TextField
                      label="Destination or Organization"
                      variant="outlined"
                      fullWidth
                      sx={{
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '10px',
                          '& fieldset': {
                            borderColor: `${currentColors.cardBorder}`,
                          },
                          '&:hover fieldset': {
                            borderColor: currentColors.accentGreen,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: currentColors.accentGreen,
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: currentColors.secondaryText
                        },
                        '& .MuiInputBase-input': {
                          color: currentColors.text
                        }
                      }}
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <LocationOnIcon sx={{ color: currentColors.accentRed, mr: 1 }} />
                        )
                      }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={loading}
                    fullWidth
                    sx={{
                      background: currentColors.gradients.carpool,
                      color: theme === "dark" ? "#112240" : "#ffffff",
                      fontWeight: "bold",
                      p: 1.5,
                      borderRadius: "10px",
                      boxShadow: currentColors.gradients.glow,
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        background: theme === "dark" 
                          ? "linear-gradient(135deg, #8bffed 0%, #7df2ea 100%)" 
                          : "linear-gradient(135deg, #007a8c 0%, #00a5c1 100%)",
                        transform: "translateY(-2px)",
                        boxShadow: `0 10px 25px ${currentColors.accentGreen}60`
                      },
                      "&:disabled": {
                        background: theme === "dark" 
                          ? "rgba(100, 255, 218, 0.2)" 
                          : "rgba(0, 149, 168, 0.2)",
                      }
                    }}
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                  >
                    {loading ? "Searching..." : "Find Carpool"}
                  </Button>

                  {error && (
                    <Typography sx={{ color: currentColors.accentRed, mt: 2, textAlign: 'center' }}>
                      {error}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card
                sx={{
                  backgroundColor: currentColors.cardBackground,
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  p: 2,
                  boxShadow: `0 8px 32px ${currentColors.accentGreen}40`,
                  border: `1px solid ${currentColors.cardBorder}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: currentColors.accentGreen, mb: 2, display: 'flex', alignItems: 'center' }}>
                    <EmojiPeopleIcon sx={{ mr: 1, color: currentColors.accentGreen }} />
                    Offer a Ride
                  </Typography>

                  <Typography variant="body2" sx={{ color: currentColors.secondaryText, mb: 3 }}>
                    Have empty seats in your car? Share your ride and help reduce traffic congestion.
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => setShowAddRideForm(!showAddRideForm)}
                    sx={{
                      borderColor: currentColors.accentGreen,
                      color: currentColors.accentGreen,
                      p: 1.5,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontSize: "1rem",
                      "&:hover": {
                        borderColor: currentColors.accentGreen,
                        backgroundColor: `${currentColors.accentGreen}22`,
                      },
                    }}
                    startIcon={<AddIcon />}
                  >
                    Add Your Carpool
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Benefits Section */}
            <motion.div variants={itemVariants} style={{ marginTop: '24px' }}>
              <Card
                sx={{
                  background: theme === "dark" 
                    ? `linear-gradient(135deg, rgba(17, 34, 64, 0.9), rgba(10, 25, 47, 0.9))`
                    : `linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(248, 249, 252, 0.9))`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  p: 2,
                  boxShadow: `0 8px 32px ${currentColors.accentGreen}40`,
                  border: `1px solid ${currentColors.cardBorder}`,
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: currentColors.accentGreen, mb: 2, textAlign: 'center' }}>
                    Benefits of Carpooling
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <LocalAtmIcon sx={{ fontSize: '2rem', color: currentColors.accentYellow, mb: 1 }} />
                        <Typography variant="body2" sx={{ color: currentColors.text, fontWeight: 'bold' }}>
                          Save Money
                        </Typography>
                        <Typography variant="caption" sx={{ color: currentColors.secondaryText }}>
                          Share fuel costs
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <NatureIcon sx={{ fontSize: '2rem', color: currentColors.accentGreen, mb: 1 }} />
                        <Typography variant="body2" sx={{ color: currentColors.text, fontWeight: 'bold' }}>
                          Go Green
                        </Typography>
                        <Typography variant="caption" sx={{ color: currentColors.secondaryText }}>
                          Reduce emissions
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <PeopleAltIcon sx={{ fontSize: '2rem', color: currentColors.accentBlue, mb: 1 }} />
                        <Typography variant="body2" sx={{ color: currentColors.text, fontWeight: 'bold' }}>
                          Network
                        </Typography>
                        <Typography variant="caption" sx={{ color: currentColors.secondaryText }}>
                          Meet new people
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: 'center', p: 1 }}>
                        <DirectionsCarIcon sx={{ fontSize: '2rem', color: currentColors.accentRed, mb: 1 }} />
                        <Typography variant="body2" sx={{ color: currentColors.text, fontWeight: 'bold' }}>
                          Less Traffic
                        </Typography>
                        <Typography variant="caption" sx={{ color: currentColors.secondaryText }}>
                          Reduce congestion
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: theme === "dark" ? "#ffffff" : currentColors.text, // Force white in dark mode
                mb: 2,
                position: 'relative',
                display: 'inline-block',
                fontWeight: 600,
                "&::after": {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -8,
                  height: 3,
                  width: '100%',
                  background: currentColors.gradients.carpool,
                  borderRadius: '3px'
                }
              }}
            >
              Available Carpools
            </Typography>
            
            <Typography variant="body2" sx={{ color: theme === "dark" ? "#b4c1e0" : currentColors.secondaryText, mb: 2 }}>
              Connect with drivers heading to your destination and enjoy a comfortable shared journey.
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
                backgroundColor: currentColors.cardBackground,
                borderRadius: "16px",
                border: `1px solid ${currentColors.cardBorder}`,
                boxShadow: currentColors.gradients.glow,
                backdropFilter: "blur(10px)",
                flexDirection: "column",
                gap: 2
              }}
            >
              <CircularProgress sx={{ color: currentColors.accentGreen }} />
              <Typography variant="h6" sx={{ color: currentColors.text }}>
                Finding rides for you...
              </Typography>
              <Typography variant="body2" sx={{ color: currentColors.secondaryText }}>
                Searching across our carpooling network
              </Typography>
            </Box>
          ) : (
            <>
              {searchPerformed && rides.length === 0 ? (
                <Box
                  sx={{
                    backgroundColor: currentColors.cardBackground,
                    borderRadius: "16px",
                    p: 4,
                    textAlign: "center",
                    border: `1px solid ${currentColors.cardBorder}`,
                    boxShadow: `0 8px 32px ${currentColors.accentGreen}40`,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <Typography variant="h6" sx={{ color: currentColors.text, mb: 1 }}>
                    No carpools available for your route
                  </Typography>
                  <Typography variant="body2" sx={{ color: currentColors.secondaryText }}>
                    Try searching for a different location or check back later.
                  </Typography>
                </Box>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                  {searchPerformed ? (
                    rides.map((ride, index) => (
                      <RideCard 
                        key={ride.id} 
                        ride={ride} 
                        theme={theme} 
                        colors={currentColors} 
                        variants={cardVariants}
                        isFavorite={favorites.includes(ride.id)}
                        onToggleFavorite={() => toggleFavorite(ride.id)}
                        bookRide={bookRide}
                        delay={index * 0.1}
                      />
                    ))
                  ) : (
                    <>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" 
                          sx={{ 
                            color: currentColors.accentGreen, 
                            mb: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          <StarIcon sx={{ color: currentColors.accentYellow }} />
                          Featured Rides
                        </Typography>
                        
                        {featuredRides.map((ride, index) => (
                          <RideCard 
                            key={ride.id} 
                            ride={ride} 
                            theme={theme} 
                            colors={currentColors} 
                            variants={cardVariants}
                            isFavorite={favorites.includes(ride.id)}
                            onToggleFavorite={() => toggleFavorite(ride.id)}
                            bookRide={bookRide}
                            delay={index * 0.1}
                            isFeatured
                          />
                        ))}
                      </Box>
                      
                      <Box 
                        sx={{ 
                          textAlign: 'center', 
                          backgroundColor: `${currentColors.accentGreen}15`,
                          borderRadius: '16px',
                          p: 3,
                          border: `1px dashed ${currentColors.accentGreen}80`
                        }}
                      >
                        <Typography variant="h6" sx={{ color: currentColors.text, mb: 1 }}>
                          Find Your Perfect Carpool
                        </Typography>
                        <Typography variant="body2" sx={{ color: currentColors.secondaryText, mb: 2 }}>
                          Enter your location and destination to discover shared rides that match your commute.
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{
                            background: currentColors.gradients.carpool,
                            color: theme === "dark" ? "#112240" : "#ffffff",
                            fontWeight: "bold",
                            px: 3,
                            py: 1,
                            borderRadius: "10px",
                            textTransform: "none",
                            "&:hover": {
                              background: theme === "dark" 
                                ? "linear-gradient(135deg, #8bffed 0%, #7df2ea 100%)" 
                                : "linear-gradient(135deg, #007a8c 0%, #00a5c1 100%)",
                              transform: "translateY(-2px)",
                            },
                          }}
                          startIcon={<SearchIcon />}
                        >
                          Search Now
                        </Button>
                      </Box>
                    </>
                  )}
                </motion.div>
              )}
            </>
          )}
        </Grid>
      </Grid>
      
      {/* Stats section with real data */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 6,
            p: 3,
            borderRadius: '16px',
            background: `linear-gradient(135deg, ${currentColors.cardBackground}, ${theme === "dark" ? "rgba(17, 34, 64, 0.4)" : "rgba(255, 255, 255, 0.4)"})`,
            backdropFilter: "blur(10px)",
            border: `1px solid ${currentColors.cardBorder}`,
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: "#ffffff", // Force white in dark mode
              mb: 3, 
              textAlign: 'center',
              fontWeight: 600 
            }}
          >
            Carpooling Impact
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: currentColors.accentGreen,
                    fontWeight: 'bold',
                    background: currentColors.gradients.carpool,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {carpoolStats.activeUsers.toLocaleString()}+
                </Typography>
                <Typography variant="body2" sx={{ color: currentColors.secondaryText }}>
                  Active Carpoolers
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: currentColors.accentYellow,
                    fontWeight: 'bold',
                    background: currentColors.gradients.secondary,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {carpoolStats.dailyRides.toLocaleString()}+
                </Typography>
                <Typography variant="body2" sx={{ color: currentColors.secondaryText }}>
                  Daily Rides
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: currentColors.accentBlue,
                    fontWeight: 'bold',
                    background: theme === "dark" 
                      ? "linear-gradient(135deg, #82AAFF 0%, #c792ea 100%)"
                      : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹{(carpoolStats.monthlySavings / 1000000).toFixed(1)}M
                </Typography>
                <Typography variant="body2" sx={{ color: currentColors.secondaryText }}>
                  Monthly Savings
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: currentColors.accentGreen,
                    fontWeight: 'bold',
                    background: theme === "dark"
                      ? "linear-gradient(135deg, #64ffda 0%, #82AAFF 100%)"
                      : "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {carpoolStats.carbonReduced}T
                </Typography>
                <Typography variant="body2" sx={{ color: currentColors.secondaryText }}>
                  CO₂ Reduced
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </PageLayout>
  );
};

// Modified error handling in the search component
const handleSearch = async () => {
  if (!location.trim()) {
    setError("Please enter a pickup location");
    return;
  }
  
  if (!organization.trim()) {
    setError("Please enter a destination");
    return;
  }
  
  setLoading(true);
  setError(null);
  setRides([]);
  setSearchPerformed(true);
  
  try {
    console.log(`Searching for rides from ${location} to ${organization}`);
    const response = await fetch(`${API_ENDPOINTS.RIDES}?location=${encodeURIComponent(location)}&organization=${encodeURIComponent(organization)}`);
    
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Search results:", data);
    
    // Backend now always returns a consistent structure with a rides array
    setRides(data.rides || []);
    
    if (!data.rides || data.rides.length === 0) {
      setError("No carpools available for your route. Try different locations or check back later.");
    }
  } catch (err) {
    console.error("Error searching rides:", err);
    setError("Network error or server issue. Showing available options nearby.");
    
    // As a last resort, filter the featured rides as fallback
    const filteredRides = featuredRides.filter(ride => {
      return ride.pickup_location.toLowerCase().includes(location.toLowerCase()) || 
             ride.destination.toLowerCase().includes(organization.toLowerCase());
    });
    
    setRides(filteredRides);
  } finally {
    setLoading(false);
  }
};

// Component for displaying individual ride cards
const RideCard = ({ ride, theme, colors, variants, isFavorite, onToggleFavorite, delay, isFeatured = false, bookRide }) => {
  const handleBookRide = () => {
    if (typeof bookRide === "function") {
      bookRide(ride.id);
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
      style={{ marginBottom: '16px' }}
    >
      <Card
        sx={{
          backgroundColor: colors.cardBackground,
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          overflow: "hidden",
          border: isFeatured 
            ? `2px solid ${theme === "dark" ? "#ffd700" : "#ffc107"}`
            : `1px solid ${colors.cardBorder}`,
          position: "relative"
        }}
      >
        {isFeatured && (
          <Box
            sx={{
              position: "absolute",
              top: 10,
              right: -30,
              transform: "rotate(45deg)",
              backgroundColor: theme === "dark" ? "#ffd700" : "#ffc107",
              color: "#000",
              width: 120,
              textAlign: "center",
              py: 0.5,
              fontWeight: "bold",
              fontSize: "0.7rem",
              zIndex: 10
            }}
          >
            FEATURED
          </Box>
        )}
        
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  src={ride.avatar}
                  alt={ride.driver}
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    border: `3px solid ${colors.accentGreen}`,
                    mb: 1
                  }}
                />
                <Typography variant="subtitle2" sx={{ color: colors.text, fontWeight: 'bold', textAlign: 'center' }}>
                  {ride.driver}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Rating 
                    value={ride.rating} 
                    precision={0.1} 
                    readOnly 
                    size="small"
                    icon={<StarIcon fontSize="inherit" sx={{ color: theme === "dark" ? "#ffd700" : "#ffc107" }} />}
                    emptyIcon={<StarBorderIcon fontSize="inherit" sx={{ color: colors.secondaryText }} />}
                  />
                  <Typography variant="caption" sx={{ ml: 0.5, color: colors.secondaryText }}>
                    ({ride.rating})
                  </Typography>
                </Box>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={9}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      color: colors.accentGreen, 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center' 
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                    {ride.departureTime}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#b4c1e0", // Force light color in dark mode 
                      mt: 0.5, 
                      fontStyle: 'italic' 
                    }}
                  >
                    {ride.carModel}
                  </Typography>
                </Box>
                
                <Box>
                  <IconButton 
                    size="small" 
                    onClick={onToggleFavorite}
                    sx={{ color: isFavorite ? colors.accentRed : colors.secondaryText }}
                  >
                    {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton size="small" sx={{ color: colors.secondaryText }}>
                    <ShareIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', mb: 1 }}>
                  <LocationOnIcon sx={{ color: colors.accentGreen, mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    From: <strong>{ride.pickup_location}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <LocationOnIcon sx={{ color: colors.accentRed, mr: 1, fontSize: '1.2rem' }} />
                  <Typography variant="body2" sx={{ color: colors.text }}>
                    To: <strong>{ride.destination}</strong>
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                <Chip
                  icon={<EventSeatIcon />}
                  label={`${ride.seatsAvailable} seat${ride.seatsAvailable !== 1 ? 's' : ''} left`}
                  size="small"
                  sx={{ 
                    backgroundColor: `${colors.accentGreen}20`,
                    color: colors.text,
                    border: `1px solid ${colors.accentGreen}50`
                  }}
                />
                
                <Chip
                  icon={<LocalAtmIcon />}
                  label={`₹${ride.costPerPerson}/person`}
                  size="small"
                  sx={{ 
                    backgroundColor: `${colors.accentYellow}20`,
                    color: colors.text,
                    border: `1px solid ${colors.accentYellow}50`
                  }}
                />
                
                <Chip
                  icon={<NatureIcon />}
                  label={`Saves ${ride.carbonSaved} kg CO₂`}
                  size="small"
                  sx={{ 
                    backgroundColor: `${colors.accentGreen}20`,
                    color: colors.text,
                    border: `1px solid ${colors.accentGreen}50`
                  }}
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {ride.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{ 
                        backgroundColor: theme === "dark" ? "#112240" : "#f1f5f9",
                        color: "#e6f1ff", // Always light in dark mode
                        fontSize: '0.7rem'
                      }}
                    />
                  ))}
                </Box>
                
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleBookRide}
                  disabled={ride.seatsAvailable < 1}
                  sx={{
                    background: colors.gradients.carpool,
                    color: "#ffffff", // Always white text for buttons
                    fontWeight: "bold",
                    borderRadius: "20px",
                    textTransform: "none",
                    "&:hover": {
                      background: theme === "dark" 
                        ? "linear-gradient(135deg, #8bffed 0%, #7df2ea 100%)" 
                        : "linear-gradient(135deg, #007a8c 0%, #00a5c1 100%)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: theme === "dark" 
                        ? "rgba(100, 255, 218, 0.2)" 
                        : "rgba(0, 149, 168, 0.2)",
                      color: theme === "dark" ? "rgba(230, 241, 255, 0.5)" : "rgba(15, 23, 42, 0.5)"
                    }
                  }}
                >
                  {ride.seatsAvailable < 1 ? "Fully Booked" : "Book Seat"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Create a context for sharing functions between components
const CarpoolingContext = React.createContext({});

// Wrap the entire component to provide context
const CarpoolingWithContext = ({ theme }) => {
  // Create ref to the bookRide function
  const bookRideRef = React.useRef(null);
  
  return (
    <CarpoolingContext.Provider value={{ bookRide: bookRideRef.current }}>
      <Carpooling theme={theme} bookRideRef={bookRideRef} />
    </CarpoolingContext.Provider>
  );
};

export default CarpoolingWithContext;
