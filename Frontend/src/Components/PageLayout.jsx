import React from "react";
import { Box, Container, Typography, Button, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PageLayout = ({ title, description, icon, children, theme, backgroundEffect }) => {
  const navigate = useNavigate();

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
  
  // Generate background particles/grid effect
  const renderBackgroundEffect = () => {
    if (!backgroundEffect) return null;
    
    if (backgroundEffect === 'particles') {
      return (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
            opacity: 0.2,
          }}
        >
          {Array.from({ length: 50 }).map((_, i) => (
            <Box
              component={motion.div}
              key={i}
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%', 
                opacity: Math.random() * 0.5 + 0.3 
              }}
              animate={{ 
                x: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%'
                ],
                y: [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%'
                ]
              }}
              transition={{ 
                duration: 20 + Math.random() * 30, 
                repeat: Infinity,
                ease: "linear"
              }}
              sx={{
                position: 'absolute',
                width: Math.random() * 10 + 3,
                height: Math.random() * 10 + 3,
                borderRadius: '50%',
                backgroundColor: currentColors.accentGreen,
              }}
            />
          ))}
        </Box>
      );
    }
    
    if (backgroundEffect === 'grid') {
      return (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(${currentColors.accentGreen}22 1px, transparent 1px),
                        linear-gradient(90deg, ${currentColors.accentGreen}22 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            zIndex: 0,
            opacity: 0.15,
          }}
        />
      );
    }
    
    if (backgroundEffect === 'traffic') {
      return (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <Box
              component={motion.div}
              key={i}
              initial={{ 
                x: -100, 
                y: 100 + (i * 40), 
                opacity: 0.7 
              }}
              animate={{ 
                x: window.innerWidth + 100,
              }}
              transition={{ 
                duration: 8 + Math.random() * 8, 
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
              sx={{
                position: 'absolute',
                width: 30 + Math.random() * 30,
                height: 10,
                borderRadius: '4px',
                backgroundColor: i % 3 === 0 ? currentColors.accentRed : currentColors.accentGreen,
                opacity: 0.3,
              }}
            />
          ))}
        </Box>
      );
    }
    
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: currentColors.background,
        py: 4,
        px: { xs: 2, md: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {renderBackgroundEffect()}
      
      <Container 
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ position: "relative", mb: 4 }}>
          <IconButton
            onClick={() => navigate("/")}
            sx={{
              color: currentColors.accentGreen,
              position: { xs: "relative", md: "absolute" },
              left: { md: -60 },
              top: { md: 10 },
              mb: { xs: 2, md: 0 },
              backgroundColor: theme === 'dark' ? 'rgba(17, 34, 64, 0.5)' : 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(5px)',
              '&:hover': {
                backgroundColor: theme === 'dark' ? 'rgba(17, 34, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)',
              }
            }}
          >
            <ArrowBackIcon fontSize="large" />
          </IconButton>
        </Box>

        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 4,
              flexDirection: { xs: "column", md: "row" },
              backgroundColor: 'rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              p: 3,
              border: `1px solid ${currentColors.accentGreen}33`,
            }}
          >
            <Typography
              variant="h1"
              component={motion.div}
              whileHover={{ 
                scale: 1.1,
                rotate: [0, 5, -5, 0],
                transition: { duration: 0.5 }
              }}
              sx={{
                fontSize: { xs: "3rem", md: "4rem" },
                mr: { md: 3 },
                mb: { xs: 2, md: 0 },
              }}
            >
              {icon}
            </Typography>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: currentColors.accentGreen,
                  fontWeight: "bold",
                  mb: 1,
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "3rem" },
                  textAlign: { xs: "center", md: "left" },
                  textShadow: `0 0 10px ${currentColors.accentGreen}66`,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: currentColors.text,
                  opacity: 0.9,
                  maxWidth: 800,
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  textAlign: { xs: "center", md: "left" },
                }}
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {children}
        </motion.div>
      </Container>
    </Box>
  );
};

export default PageLayout;
