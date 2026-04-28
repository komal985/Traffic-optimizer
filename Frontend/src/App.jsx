import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Components
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Dashboard from "./Components/Dashboard";
import SmartParking from "./Components/SmartParking";
import NavigateMe from "./Components/NavigateMe";
import IntegratedConnectivity from "./Components/IntegratedConnectivity";
import CarPooling from "./Components/CarPooling";
import TrafficAnalysis from "./Components/checkRoute";
import Teleportation from "./Pages/Teleportation";
import TrafficFlow from "./Pages/TrafficFlow";
import AuthDatabase from "./Pages/AuthDatabase";
import Login from "./Components/Login";
import Register from "./Components/Register";
import NotFound from "./Components/NotFound";

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    document.body.className = theme;
    // Set explicit body styles to match theme
    document.body.style.backgroundColor = theme === 'dark' ? '#121826' : '#f8f9fa';
    document.body.style.color = theme === 'dark' ? '#e9ecef' : '#212529';
  }, [theme]);

  const appStyles = {
    backgroundColor: theme === 'dark' ? '#121826' : '#f8f9fa',
    color: theme === 'dark' ? '#e9ecef' : '#212529',
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  };

  return (
    <Router>
      <div className={`app-container ${theme}`} style={appStyles}>
        
        <Header theme={theme} toggleTheme={toggleTheme} />
        
        {/* This padding accounts for the fixed header height. 
           We removed the spacer from Header.js to avoid double gaps.
        */}
        <div className="content-wrapper" style={{ paddingTop: "80px", flex: "1" }}>
          <Routes>
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/dashboard" element={<Dashboard theme={theme} />} />
            <Route path="/smart-parking" element={<SmartParking theme={theme} />} />
            <Route path="/navigate-me" element={<NavigateMe theme={theme} />} />
            <Route path="/integrated-connectivity" element={<IntegratedConnectivity theme={theme} />} />
            <Route path="/carpooling" element={<CarPooling theme={theme} />} />
            <Route path="/check-route" element={<TrafficAnalysis theme={theme} />} />
            <Route path="/teleportation" element={<Teleportation theme={theme} />} />
            <Route path="/traffic-flow" element={<TrafficFlow theme={theme} />} />
            <Route path="/auth-database" element={<AuthDatabase theme={theme} />} />
            <Route path="/login" element={<Login theme={theme} />} />
            <Route path="/register" element={<Register theme={theme} />} />
            <Route path="*" element={<NotFound theme={theme} />} />
          </Routes>
        </div>
        
        <Footer theme={theme} />
      </div>
    </Router>
  );
}

export default App;