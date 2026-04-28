import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CircularProgress, Box } from "@mui/material";
import { motion } from "framer-motion";

const themeColors = {
  dark: {
    background: "#112240",
    accentGreen: "#64ffda",
    accentRed: "#f07178",
    text: "#ccd6f6",
    cardBackground: "rgba(255, 255, 255, 0.1)",
    cardBorder: "rgba(100, 255, 218, 0.5)",
  },
  light: {
    background: "#ffffff",
    accentGreen: "#00bcd4",
    accentRed: "#ff5252",
    text: "#333333",
    cardBackground: "rgba(0, 0, 0, 0.1)",
    cardBorder: "rgba(0, 188, 212, 0.5)",
  },
};

const AiPredictions = ({ theme = "dark" }) => {
  const colors = themeColors[theme];
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(import.meta.env.VITE_BACKEND_URL + "/ai/predictions")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch predictions");
        }
        return response.json();
      })
      .then((data) => {
        setPredictions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching predictions:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: colors.background,
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <Typography variant="h4" sx={{ color: colors.accentGreen, fontWeight: "bold", mb: 3 }}>
          AI Traffic Predictions 🚦
        </Typography>
      </motion.div>

      {loading && <CircularProgress sx={{ color: colors.accentGreen }} />}

      {error && (
        <Typography sx={{ color: colors.accentRed, fontSize: "1.2rem", mt: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1.5rem" }}>
          {predictions.length > 0 ? (
            predictions.map((prediction, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: index * 0.2 }}>
                <Card
                  sx={{
                    width: 280,
                    background: colors.cardBackground,
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    textAlign: "center",
                    padding: "1rem",
                    border: `2px solid ${prediction.congestion > 70 ? colors.accentRed : colors.accentGreen}50`,
                    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: colors.text, fontWeight: "bold" }}>
                      {prediction.location}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: prediction.congestion > 70 ? colors.accentRed : colors.accentGreen,
                        fontWeight: "bold",
                        mt: 1,
                      }}
                    >
                      Congestion: {prediction.congestion}%
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <Typography sx={{ color: colors.text, fontSize: "1.2rem", mt: 2 }}>
              No predictions available.
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AiPredictions;
