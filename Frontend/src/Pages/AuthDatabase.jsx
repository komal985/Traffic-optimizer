import React, { useEffect, useMemo, useState } from "react";
import { Box, Container, Typography, Card, CardContent, Grid, Chip, Button } from "@mui/material";

const AuthDatabase = ({ theme }) => {
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const colors = useMemo(
    () => ({
      dark: {
        bg: "#0a192f",
        card: "#112240",
        text: "#e6f1ff",
        sub: "#a8b2d1",
        border: "rgba(100, 255, 218, 0.25)",
        accent: "#64ffda",
      },
      light: {
        bg: "#f8f9fc",
        card: "#ffffff",
        text: "#1e293b",
        sub: "#64748b",
        border: "rgba(2, 132, 199, 0.2)",
        accent: "#0284c7",
      },
    }),
    []
  );

  const c = colors[theme] || colors.dark;

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/auth/database`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load database");
      setUsers(data.users || []);
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.message || "Failed to load auth database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: c.bg, py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
          <Typography variant="h4" sx={{ color: c.text, fontWeight: 800 }}>
            Auth Database
          </Typography>
          <Button variant="contained" onClick={fetchData} sx={{ background: c.accent, color: theme === "dark" ? "#0a192f" : "#fff", fontWeight: 700 }}>
            Refresh
          </Button>
        </Box>

        {error && (
          <Card sx={{ mb: 3, background: c.card, border: `1px solid ${c.border}` }}>
            <CardContent>
              <Typography sx={{ color: "#ef4444", fontWeight: 600 }}>{error}</Typography>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ background: c.card, border: `1px solid ${c.border}`, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: c.text, fontWeight: 700, mb: 2 }}>
                  Registered Users ({users.length})
                </Typography>
                {loading ? (
                  <Typography sx={{ color: c.sub }}>Loading...</Typography>
                ) : users.length === 0 ? (
                  <Typography sx={{ color: c.sub }}>No users found.</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 420, overflowY: "auto", pr: 1 }}>
                    {users.map((u) => (
                      <Box key={u._id} sx={{ border: `1px solid ${c.border}`, borderRadius: 2, p: 1.5 }}>
                        <Typography sx={{ color: c.text, fontWeight: 600 }}>{u.name}</Typography>
                        <Typography sx={{ color: c.sub, fontSize: "0.9rem" }}>{u.email}</Typography>
                        <Typography sx={{ color: c.sub, fontSize: "0.8rem" }}>
                          Joined: {u.createdAt ? new Date(u.createdAt).toLocaleString() : "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ background: c.card, border: `1px solid ${c.border}`, height: "100%" }}>
              <CardContent>
                <Typography variant="h6" sx={{ color: c.text, fontWeight: 700, mb: 2 }}>
                  Sign In / Login Activity ({activities.length})
                </Typography>
                {loading ? (
                  <Typography sx={{ color: c.sub }}>Loading...</Typography>
                ) : activities.length === 0 ? (
                  <Typography sx={{ color: c.sub }}>No activity yet.</Typography>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, maxHeight: 420, overflowY: "auto", pr: 1 }}>
                    {activities.map((a) => (
                      <Box key={a._id} sx={{ border: `1px solid ${c.border}`, borderRadius: 2, p: 1.5 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8 }}>
                          <Typography sx={{ color: c.text, fontWeight: 600 }}>{a.email}</Typography>
                          <Chip
                            size="small"
                            label={`${a.action} - ${a.status}`}
                            color={a.status === "success" ? "success" : "error"}
                            variant="outlined"
                          />
                        </Box>
                        <Typography sx={{ color: c.sub, fontSize: "0.8rem" }}>
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : "N/A"}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AuthDatabase;
