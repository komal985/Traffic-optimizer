import React, { useState } from "react";
import { 
  Box, Grid, Card, CardContent, Typography, TextField, Button, 
  CircularProgress, Stepper, Step, StepLabel, Chip, Alert
} from "@mui/material";
import { motion } from "framer-motion";
import PageLayout from "../Components/PageLayout";
import BoltIcon from "@mui/icons-material/Bolt";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import SpeedIcon from "@mui/icons-material/Speed";
import WifiIcon from "@mui/icons-material/Wifi";
import ScienceIcon from "@mui/icons-material/Science";

const Teleportation = ({ theme }) => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [teleportStatus, setTeleportStatus] = useState(null);
  
  const colors = {
    dark: {
      background: "#0a192f",
      accentGreen: "#64ffda",
      accentRed: "#f07178",
      text: "#ccd6f6",
      cardBackground: "rgba(17, 34, 64, 0.8)",
    },
    light: {
      background: "#f5f5f7",
      accentGreen: "#00bcd4",
      accentRed: "#ff5252",
      text: "#333333",
      cardBackground: "rgba(255, 255, 255, 0.85)",
    },
  };

  const currentColors = colors[theme || "dark"];
  
  const teleportSteps = [
    'Input Coordinates',
    'Quantum Entanglement',
    'Matter Conversion',
    'Data Transfer',
    'Matter Reconstruction'
  ];
  
  const initiateSequence = () => {
    if (!origin || !destination) {
      return;
    }
    
    setLoading(true);
    setActiveStep(1);
    
    // Simulate teleportation process
    const timer1 = setTimeout(() => {
      setActiveStep(2);
      const timer2 = setTimeout(() => {
        setActiveStep(3);
        const timer3 = setTimeout(() => {
          setActiveStep(4);
          const timer4 = setTimeout(() => {
            setTeleportStatus("success");
            setLoading(false);
          }, 3000);
          return () => clearTimeout(timer4);
        }, 2000);
        return () => clearTimeout(timer3);
      }, 2000);
      return () => clearTimeout(timer2);
    }, 2000);
    
    return () => clearTimeout(timer1);
  };
  
  const resetSequence = () => {
    setActiveStep(0);
    setTeleportStatus(null);
  };
  
  const locations = [
    {
      name: "Alpha Hub - New York",
      status: "Online",
      capacity: "350 transfers/hour",
      energy: "96%",
    },
    {
      name: "Beta Hub - Tokyo",
      status: "Online",
      capacity: "280 transfers/hour",
      energy: "87%",
    },
    {
      name: "Gamma Hub - London",
      status: "Online",
      capacity: "310 transfers/hour",
      energy: "92%",
    },
    {
      name: "Delta Hub - Sydney",
      status: "Maintenance",
      capacity: "0 transfers/hour",
      energy: "12%",
    },
    {
      name: "Epsilon Hub - Rio de Janeiro",
      status: "Online",
      capacity: "200 transfers/hour",
      energy: "78%",
    },
    {
      name: "Zeta Hub - Cairo",
      status: "Online",
      capacity: "180 transfers/hour",
      energy: "65%",
    },
  ];

  return (
    <PageLayout 
      title="Teleportation Stations" 
      description="Discover the future of transportation with our experimental teleportation hubs."
      icon="⚡"
      theme={theme}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              sx={{
                backgroundColor: currentColors.cardBackground,
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                mb: 4,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: currentColors.text,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  Quantum Teleportation Console
                </Typography>
                
                <TextField
                  label="Origin Hub"
                  select
                  fullWidth
                  SelectProps={{ native: true }}
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  disabled={loading || teleportStatus}
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: currentColors.accentGreen,
                      },
                      "&:hover fieldset": {
                        borderColor: currentColors.accentGreen,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: currentColors.text,
                    },
                    "& .MuiInputBase-input": {
                      color: currentColors.text,
                    },
                  }}
                >
                  <option value="">Select Origin Hub</option>
                  {locations.filter(loc => loc.status === "Online").map((location, index) => (
                    <option key={index} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </TextField>
                
                <TextField
                  label="Destination Hub"
                  select
                  fullWidth
                  SelectProps={{ native: true }}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={loading || teleportStatus}
                  sx={{
                    mb: 4,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: currentColors.accentGreen,
                      },
                      "&:hover fieldset": {
                        borderColor: currentColors.accentGreen,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: currentColors.text,
                    },
                    "& .MuiInputBase-input": {
                      color: currentColors.text,
                    },
                  }}
                >
                  <option value="">Select Destination Hub</option>
                  {locations.filter(loc => loc.status === "Online" && loc.name !== origin).map((location, index) => (
                    <option key={index} value={location.name}>
                      {location.name}
                    </option>
                  ))}
                </TextField>
                
                <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                  {teleportSteps.map((label) => (
                    <Step key={label}>
                      <StepLabel sx={{ 
                        "& .MuiStepLabel-label": { 
                          color: currentColors.text 
                        },
                        "& .Mui-active": { 
                          color: `${currentColors.accentGreen} !important`
                        },
                        "& .Mui-completed": { 
                          color: `${currentColors.accentGreen} !important`
                        }
                      }}>
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
                
                {teleportStatus === "success" ? (
                  <Alert 
                    severity="success" 
                    sx={{ mb: 3, backgroundColor: "rgba(100, 255, 218, 0.2)", color: currentColors.text }}
                  >
                    Teleportation successful! You've been safely transported.
                  </Alert>
                ) : null}
                
                <Box sx={{ display: "flex", gap: 2 }}>
                  {teleportStatus ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={resetSequence}
                      sx={{
                        backgroundColor: currentColors.accentGreen,
                        color: theme === "dark" ? "#112240" : "#ffffff",
                        fontWeight: "bold",
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: theme === "dark" ? "#8bffed" : "#00a0b2",
                        }
                      }}
                    >
                      New Teleportation
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={initiateSequence}
                      disabled={!origin || !destination || loading}
                      sx={{
                        backgroundColor: currentColors.accentGreen,
                        color: theme === "dark" ? "#112240" : "#ffffff",
                        fontWeight: "bold",
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: theme === "dark" ? "#8bffed" : "#00a0b2",
                        },
                        "&.Mui-disabled": {
                          backgroundColor: "rgba(100, 255, 218, 0.3)",
                        }
                      }}
                    >
                      {loading ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CircularProgress size={24} sx={{ color: theme === "dark" ? "#112240" : "#ffffff", mr: 1 }} />
                          Teleporting...
                        </Box>
                      ) : (
                        "Initiate Teleportation"
                      )}
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card
              sx={{
                backgroundColor: currentColors.cardBackground,
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                height: "100%",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: currentColors.text,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  Teleportation Network Status
                </Typography>
                
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {locations.map((location, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        sx={{
                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                          borderRadius: "8px",
                          p: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ color: currentColors.text, fontWeight: "bold" }}>
                            {location.name}
                          </Typography>
                          <Chip
                            label={location.status}
                            size="small"
                            sx={{
                              backgroundColor: location.status === "Online" ? "rgba(100, 255, 218, 0.2)" : "rgba(240, 113, 120, 0.2)",
                              color: location.status === "Online" ? currentColors.accentGreen : currentColors.accentRed,
                              fontWeight: "bold",
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <BoltIcon sx={{ color: currentColors.accentGreen, mr: 0.5, fontSize: "1rem" }} />
                            <Typography variant="body2" sx={{ color: currentColors.text }}>
                              Energy: {location.energy}
                            </Typography>
                          </Box>
                          
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <SpeedIcon sx={{ color: currentColors.accentGreen, mr: 0.5, fontSize: "1rem" }} />
                            <Typography variant="body2" sx={{ color: currentColors.text }}>
                              {location.capacity}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              sx={{
                backgroundColor: currentColors.cardBackground,
                backdropFilter: "blur(10px)",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: currentColors.text,
                    fontWeight: "bold",
                    mb: 3,
                  }}
                >
                  How Quantum Teleportation Works
                </Typography>
                
                <Grid container spacing={3}>
                  {[
                    {
                      icon: <NetworkCheckIcon sx={{ fontSize: "2.5rem" }} />,
                      title: "Quantum Entanglement",
                      description: "Particles are entangled across the network, creating a quantum link between hubs."
                    },
                    {
                      icon: <ScienceIcon sx={{ fontSize: "2.5rem" }} />,
                      title: "Matter Scanning",
                      description: "Molecular structure is scanned and converted to quantum information."
                    },
                    {
                      icon: <WifiIcon sx={{ fontSize: "2.5rem" }} />,
                      title: "Information Transfer",
                      description: "Quantum data is instantly transferred to the destination hub via entanglement."
                    }
                  ].map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          textAlign: "center",
                          p: 2,
                        }}
                      >
                        <Box sx={{ color: currentColors.accentGreen, mb: 2 }}>
                          {item.icon}
                        </Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: currentColors.text,
                            fontWeight: "bold",
                            mb: 1,
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: currentColors.text,
                            opacity: 0.8,
                          }}
                        >
                          {item.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                
                <Typography
                  variant="body2"
                  sx={{
                    color: currentColors.text,
                    mt: 3,
                    p: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    borderRadius: "8px",
                    fontStyle: "italic",
                  }}
                >
                  <strong>Note:</strong> This is a conceptual demonstration of future transportation technology. 
                  Actual quantum teleportation is currently limited to information transfer, not physical matter.
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </PageLayout>
  );
};

export default Teleportation;
