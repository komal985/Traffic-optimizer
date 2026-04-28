import React, { useEffect, useRef, useState, useMemo } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  FaMapMarkedAlt, FaCarSide, FaStopwatch, FaLeaf, FaRegLightbulb,
  FaRocket, FaChartLine, FaTachometerAlt, FaSearch
} from "react-icons/fa";

// Import your theme constants
import { themeColors } from "../utils/themeConstants";

// --- Static Data & Config ---
const FEATURES = [
  {
    title: "Real-Time Traffic",
    desc: "Navigate congestion with live updates and AI-driven predictions.",
    icon: <FaMapMarkedAlt />
  },
  {
    title: "Smart Routing",
    desc: "AI algorithms analyze history and urban patterns for the optimal path.",
    icon: <FaCarSide />
  },
  {
    title: "Time Optimization",
    desc: "Precise ETAs and traffic light predictions to save you time.",
    icon: <FaStopwatch />
  },
  {
    title: "Eco-Friendly",
    desc: "Reduce carbon footprint with fuel-efficient route suggestions.",
    icon: <FaLeaf />
  },
];

const FUN_FACTS = [
  { text: "Urban drivers spend ~54 hours/year in congestion.", icon: <FaStopwatch /> },
  { text: "Smart systems can reduce travel time by 25%.", icon: <FaChartLine /> },
  { text: "Eco-routes reduce carbon footprint by up to 30%.", icon: <FaLeaf /> },
  { text: "AI predicts congestion 30 mins before it happens.", icon: <FaTachometerAlt /> }
];

// --- Leaflet Fix ---
// Fixes default marker icon not showing in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Sub-Components ---

const LocationMarker = ({ searchLocation }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    // Initial Geolocation
    if (!searchLocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          map.flyTo([latitude, longitude], 13);
        },
        () => {
          // Default: Hyderabad
          const defaultPos = [17.385044, 78.486671]; 
          setPosition(defaultPos);
          map.setView(defaultPos, 13);
        }
      );
    }
  }, [map, searchLocation]);

  useEffect(() => {
    // Search Logic
    if (searchLocation) {
      const fetchLocation = async () => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`);
          const data = await res.json();
          if (data.length > 0) {
            const { lat, lon } = data[0];
            const newPos = [parseFloat(lat), parseFloat(lon)];
            setPosition(newPos);
            map.flyTo(newPos, 13);
          }
        } catch (e) {
          console.error("Geocoding error:", e);
        }
      };
      fetchLocation();
    }
  }, [searchLocation, map]);

  return position ? <Marker position={position}><Popup>Selected Location</Popup></Marker> : null;
};

const FeatureCard = ({ title, desc, icon, index, colors }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10, boxShadow: colors.glowEffect }}
      style={{
        backgroundColor: colors.cardBackground,
        border: `1px solid ${colors.cardBorder}`,
        borderRadius: "16px",
        padding: "2rem",
        height: "100%",
        backdropFilter: "blur(10px)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div style={{
        color: colors.accentGreen,
        background: `${colors.accentGreen}15`,
        width: 60, height: 60, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.8rem", marginBottom: "1.5rem"
      }}>
        {icon}
      </div>
      <h5 style={{ color: colors.text, fontWeight: "600", marginBottom: "1rem" }}>{title}</h5>
      <p style={{ color: colors.secondaryText, fontSize: "0.95rem" }}>{desc}</p>
    </motion.div>
  );
};

const StatCounter = ({ value, label, icon, colors }) => {
  // Simplified counter logic
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const end = parseInt(value.replace(/,/g, ""), 10);
      let start = 0;
      const duration = 2000;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = end / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} style={{ textAlign: "center", padding: "1.5rem", border: `1px solid ${colors.cardBorder}`, borderRadius: "12px", background: colors.cardBackground }}>
      <div style={{ fontSize: "2rem", color: colors.accentBlue, marginBottom: "0.5rem" }}>{icon}</div>
      <h3 style={{ color: colors.text, fontWeight: "800", fontSize: "2.5rem" }}>{count.toLocaleString()}</h3>
      <p style={{ color: colors.secondaryText }}>{label}</p>
    </div>
  );
};

// --- Main Component ---

function Home({ theme }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationTrigger, setLocationTrigger] = useState(null);
  const [factIndex, setFactIndex] = useState(0);
  const navigate = useNavigate();
  
  const colors = useMemo(() => themeColors[theme], [theme]);

  // Rotate facts
  useEffect(() => {
    const timer = setInterval(() => setFactIndex((p) => (p + 1) % FUN_FACTS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) setLocationTrigger(searchQuery);
  };

  return (
    <div style={{ backgroundColor: colors.background, minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 1. Hero Section */}
      <section style={{ position: "relative", padding: "6rem 0 4rem", minHeight: "90vh", display: "flex", alignItems: "center" }}>
        {/* Abstract Background Animation */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
               style={{ position: "absolute", top: "-50%", right: "-20%", width: "80vw", height: "80vw", borderRadius: "40%", background: `radial-gradient(${colors.accentGreen}10, transparent 70%)` }} 
             />
        </div>

        <Container style={{ position: "relative", zIndex: 10 }}>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <h1 className="display-3 fw-bold mb-4" style={{ color: colors.text }}>
                  Reimagine <br />
                  <span style={{ 
                    background: `linear-gradient(135deg, ${colors.accentGreen}, ${colors.accentBlue})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}>
                    Urban Mobility
                  </span>
                </h1>
                
                <p className="lead mb-5" style={{ color: colors.secondaryText, lineHeight: 1.6 }}>
                  Leverage real-time data and AI-powered insights to navigate traffic intelligently. 
                  Experience a smarter, faster, and more sustainable way to travel.
                </p>

                {/* Search Bar */}
                <div style={{ position: "relative", maxWidth: "500px", marginBottom: "3rem" }}>
                  <input
                    type="text"
                    placeholder="Enter destination..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%", padding: "1.2rem 3.5rem 1.2rem 1.5rem", borderRadius: "50px",
                      border: `2px solid ${colors.cardBorder}`, background: colors.cardBackground,
                      color: colors.text, outline: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
                    }}
                  />
                  <button 
                    onClick={handleSearch}
                    style={{
                      position: "absolute", right: "8px", top: "8px", bottom: "8px",
                      background: colors.accentGreen, border: "none", borderRadius: "50%",
                      width: "45px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                    }}
                  >
                    <FaSearch />
                  </button>
                </div>

                <div className="d-flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/dashboard")}
                    style={{
                      padding: "0.8rem 2rem", borderRadius: "50px", border: "none",
                      background: `linear-gradient(90deg, ${colors.accentGreen}, ${colors.accentBlue})`,
                      color: "#fff", fontWeight: "bold", boxShadow: colors.glowEffect
                    }}
                  >
                    Get Started <FaRocket style={{ marginLeft: 8 }}/>
                  </motion.button>
                </div>
              </motion.div>
            </Col>

            {/* Map Preview */}
            <Col lg={6}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.8 }}
                style={{ 
                  height: "500px", borderRadius: "24px", overflow: "hidden", 
                  border: `4px solid ${colors.cardBackground}`, boxShadow: colors.glowEffect 
                }}
              >
                <MapContainer center={[17.385044, 78.486671]} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker searchLocation={locationTrigger} />
                </MapContainer>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. Features Section */}
      <section style={{ padding: "5rem 0" }}>
        <Container>
          <div className="text-center mb-5">
            <h2 style={{ color: colors.text, fontSize: "2.5rem", fontWeight: "700" }}>
              Powerful Features
            </h2>
            <div style={{ height: 4, width: 60, background: colors.accentGreen, margin: "1rem auto" }} />
          </div>
          <Row className="g-4">
            {FEATURES.map((feat, i) => (
              <Col md={6} lg={3} key={i}>
                <FeatureCard {...feat} index={i} colors={colors} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* 3. Stats Section */}
      <section style={{ padding: "5rem 0", background: `${colors.accentBlue}05` }}>
        <Container>
           <Row className="g-4 mb-5">
              <Col md={3}><StatCounter value="25,000" label="Active Users" icon={<FaMapMarkedAlt />} colors={colors} /></Col>
              <Col md={3}><StatCounter value="650" label="Daily Trips" icon={<FaCarSide />} colors={colors} /></Col>
              <Col md={3}><StatCounter value="4,500" label="Hours Saved" icon={<FaStopwatch />} colors={colors} /></Col>
              <Col md={3}><StatCounter value="35" label="Tons CO₂ Saved" icon={<FaLeaf />} colors={colors} /></Col>
           </Row>
           
           {/* Fun Fact Carousel */}
           <div className="mx-auto text-center" style={{ maxWidth: "600px" }}>
             <AnimatePresence mode="wait">
               <motion.div
                 key={factIndex}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 style={{ 
                   padding: "1.5rem", background: colors.cardBackground, 
                   borderRadius: "16px", border: `1px solid ${colors.cardBorder}` 
                 }}
               >
                 <div style={{ color: colors.accentGreen, fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                   {FUN_FACTS[factIndex].icon}
                 </div>
                 <p style={{ color: colors.secondaryText, margin: 0, fontSize: "1.1rem" }}>
                   {FUN_FACTS[factIndex].text}
                 </p>
               </motion.div>
             </AnimatePresence>
           </div>
        </Container>
      </section>

      {/* 4. CTA Section */}
      <section style={{ padding: "6rem 0", textAlign: "center" }}>
        <Container>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            style={{ 
              background: `linear-gradient(135deg, ${colors.cardBackground}, ${colors.background})`,
              padding: "4rem", borderRadius: "30px", border: `1px solid ${colors.cardBorder}`,
              position: "relative", overflow: "hidden"
            }}
          >
             <h2 style={{ color: colors.text, fontWeight: "bold", marginBottom: "1.5rem" }}>
               Ready to Transform Your Commute?
             </h2>
             <Button 
               size="lg" 
               onClick={() => navigate("/dashboard")}
               style={{ 
                 background: colors.accentGreen, border: "none", padding: "1rem 2.5rem",
                 borderRadius: "50px", fontWeight: "bold", fontSize: "1.2rem"
               }}
             >
               Get Started Now
             </Button>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

export default Home;