import React, { useState, useEffect, useMemo } from "react";
import { Box, Card, CardContent, Typography, Container, Button, Grid } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

// --- Configuration & Data ---

const THEME_COLORS = {
  dark: {
    bg: "#0a192f",
    textPrimary: "#e6f1ff",
    textSecondary: "#a8b2d1",
    cardBg: "rgba(17, 34, 64, 0.8)",
    particle: "#64ffda",
    gradients: {
      primary: "linear-gradient(135deg, #64ffda 0%, #4B66FE 100%)",
      glow: "0 0 20px rgba(100, 255, 218, 0.5)",
      text: "linear-gradient(90deg, #64ffda, #c792ea, #ff6b6b)",
    }
  },
  light: {
    bg: "#f8f9fc",
    textPrimary: "#1e293b",
    textSecondary: "#64748b",
    cardBg: "rgba(255, 255, 255, 0.85)",
    particle: "#06b6d4",
    gradients: {
      primary: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      glow: "0 0 20px rgba(6, 182, 212, 0.5)",
      text: "linear-gradient(90deg, #06b6d4, #8b5cf6, #f43f5e)",
    }
  },
};

const MENU_ITEMS = [
  {
    title: "Smart Parking",
    desc: "Find and reserve spots in real-time.",
    route: "/smart-parking",
    icon: "🚗",
    img: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Navigation",
    desc: "Turn-by-turn live traffic updates.",
    route: "/navigate-me",
    icon: "🗺️",
    img: "https://images.unsplash.com/photo-1581362072978-14998d01fdaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Connectivity",
    desc: "Connect various transport modes.",
    route: "/integrated-connectivity",
    icon: "🚌",
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Carpooling",
    desc: "Share rides to save costs & carbon.",
    route: "/carpooling",
    icon: "🚘",
    img: "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    title: "Teleportation",
    desc: "Experimental transport hubs.",
    route: "/teleportation",
    icon: "⚡",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    specialGradient: "linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%)"
  },
  {
    title: "Traffic Flow",
    desc: "3D Traffic pattern visualization.",
    route: "/traffic-flow",
    icon: "📊",
    img: "https://images.unsplash.com/photo-1488229297570-58520851e868?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    specialGradient: "linear-gradient(135deg, #3A7BD5 0%, #00d2ff 100%)"
  },
  {
    title: "Auth Database",
    desc: "View sign in and login records.",
    route: "/auth-database",
    icon: "🗄️",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    specialGradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
  },
];

// --- Sub-Components ---

const FeatureCard = ({ item, themeColors, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      style={{ height: '100%', cursor: 'pointer' }}
    >
      <Card
        sx={{
          height: { xs: 280, sm: 320 },
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${isHovered ? themeColors.particle : 'transparent'}`,
          boxShadow: isHovered ? themeColors.gradients.glow : "0 8px 20px rgba(0,0,0,0.2)",
          transition: "all 0.3s ease",
        }}
      >
        {/* Background Image & Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${item.img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::after": {
              content: '""',
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))",
            }
          }}
        />

        <CardContent sx={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", zIndex: 2, p: 3 }}>
          <motion.div
            animate={{ 
              scale: isHovered ? 1.2 : 1, 
              rotate: isHovered ? [0, -10, 10, 0] : 0 
            }}
          >
            <Typography variant="h2" sx={{ fontSize: "3.5rem", mb: 2 }}>{item.icon}</Typography>
          </motion.div>

          <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mb: 1 }}>
            {item.title}
          </Typography>

          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: "auto" }}>
            {item.desc}
          </Typography>

          <motion.div animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{
                borderRadius: "30px",
                background: item.specialGradient || themeColors.gradients.primary,
                fontWeight: "bold",
                mt: 2
              }}
            >
              Access Module
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- Main Component ---

const Dashboard = ({ theme }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const t = THEME_COLORS[theme];

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const particlesOptions = useMemo(() => ({
    fullScreen: { enable: false },
    particles: {
      color: { value: t.particle },
      links: { color: t.particle, enable: true, opacity: 0.3 },
      move: { enable: true, speed: 1.5 },
      number: { value: 60, density: { enable: true, area: 800 } },
      opacity: { value: 0.5 },
      size: { value: { min: 1, max: 3 } },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "grab" } },
      modes: { grab: { distance: 140, links: { opacity: 1 } } }
    }
  }), [t]);

  return (
    <>
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 9999, background: t.bg,
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${t.particle}`, borderTopColor: "transparent" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Box sx={{ 
        minHeight: "100vh", 
        background: t.bg, 
        position: "relative", 
        overflow: "hidden" 
      }}>
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} style={{ position: "absolute", inset: 0 }} />

        {/* Ambient Background Glows (CSS Animation instead of JS mouse tracking) */}
        <Box sx={{
          position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw",
          background: t.gradients.primary, filter: "blur(100px)", opacity: 0.15, borderRadius: "50%",
          animation: "float 10s ease-in-out infinite alternate"
        }}/>

        <Container maxWidth="xl" sx={{ position: "relative", py: { xs: 4, md: 8 } }}>
          
          {/* Header Section */}
          <motion.div initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
            <Typography variant="h2" align="center" sx={{
              fontWeight: 900,
              background: t.gradients.text,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: '2.5rem', md: '4rem' },
              mb: 1
            }}>
              Traffic Optimizer
            </Typography>
            <Typography variant="h6" align="center" sx={{ color: t.textSecondary, mb: 6, maxWidth: 600, mx: "auto" }}>
              Revolutionizing transportation with AI-powered navigation and smart city integration.
            </Typography>
          </motion.div>

          {/* Cards Grid */}
          <Grid container spacing={3}>
            {MENU_ITEMS.map((item, index) => (
              <Grid item xs={12} sm={6} lg={4} key={index}>
                <FeatureCard 
                  item={item} 
                  themeColors={t} 
                  onClick={() => navigate(item.route)} 
                />
              </Grid>
            ))}
          </Grid>
          
        </Container>

        <style>{`
          @keyframes float {
            0% { transform: translate(0, 0); }
            100% { transform: translate(30px, 50px); }
          }
        `}</style>
      </Box>
    </>
  );
};

export default Dashboard;