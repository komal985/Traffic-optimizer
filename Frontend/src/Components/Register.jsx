import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    IconButton,
    InputAdornment,
    Link as MuiLink,
    Snackbar
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PageLayout from "./PageLayout";

const Register = ({ theme }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const colors = {
        dark: {
            cardBg: "#112240",
            text: "#ccd6f6",
            inputBg: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(100, 255, 218, 0.2)",
            primary: "#64ffda",
        },
        light: {
            cardBg: "#ffffff",
            text: "#333333",
            inputBg: "#f5f5f7",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            primary: "#00bcd4",
        }
    };

    const currentColors = colors[theme] || colors.dark;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
            const response = await fetch(`${baseUrl}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('userInfo', JSON.stringify(data));

            // Redirect to home/dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout
            title="Create Account"
            description="Join TrafficOptimizer to predict traffic and save time."
            icon="📝"
            theme={theme}
        >
            <Container maxWidth="xs">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card
                        sx={{
                            backgroundColor: currentColors.cardBg,
                            color: currentColors.text,
                            border: currentColors.border,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                            borderRadius: 4,
                            p: 2
                        }}
                    >
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: currentColors.primary }}>
                                Register
                            </Typography>

                            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    sx={{
                                        mb: 3,
                                        input: { color: currentColors.text },
                                        label: { color: currentColors.text },
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: currentColors.inputBg,
                                            "& fieldset": { borderColor: currentColors.primary + "44" },
                                            "&:hover fieldset": { borderColor: currentColors.primary },
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    sx={{
                                        mb: 3,
                                        input: { color: currentColors.text },
                                        label: { color: currentColors.text },
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: currentColors.inputBg,
                                            "& fieldset": { borderColor: currentColors.primary + "44" },
                                            "&:hover fieldset": { borderColor: currentColors.primary },
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                    sx={{ color: currentColors.text }}
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        mb: 3,
                                        input: { color: currentColors.text },
                                        label: { color: currentColors.text },
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: currentColors.inputBg,
                                            "& fieldset": { borderColor: currentColors.primary + "44" },
                                            "&:hover fieldset": { borderColor: currentColors.primary },
                                        }
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    sx={{
                                        mb: 4,
                                        input: { color: currentColors.text },
                                        label: { color: currentColors.text },
                                        "& .MuiOutlinedInput-root": {
                                            backgroundColor: currentColors.inputBg,
                                            "& fieldset": { borderColor: currentColors.primary + "44" },
                                            "&:hover fieldset": { borderColor: currentColors.primary },
                                        }
                                    }}
                                />

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={<PersonAddIcon />}
                                    sx={{
                                        py: 1.5,
                                        backgroundColor: currentColors.primary,
                                        color: theme === 'dark' ? '#0a192f' : '#fff',
                                        fontWeight: 'bold',
                                        "&:hover": {
                                            backgroundColor: currentColors.primary,
                                            filter: "brightness(1.1)",
                                        }
                                    }}
                                >
                                    {loading ? "Creating Account..." : "Register"}
                                </Button>
                            </form>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" sx={{ color: currentColors.text, opacity: 0.8 }}>
                                    Already have an account?{' '}
                                    <MuiLink component={Link} to="/login" sx={{ color: currentColors.primary, fontWeight: 'bold', textDecoration: 'none' }}>
                                        Login here
                                    </MuiLink>
                                </Typography>
                            </Box>

                        </CardContent>
                    </Card>
                </motion.div>
            </Container>
        </PageLayout>
    );
};

export default Register;
