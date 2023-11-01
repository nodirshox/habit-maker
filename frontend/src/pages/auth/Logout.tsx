import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Logout() {
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const logoutDelay = setTimeout(() => {
      localStorage.removeItem("token");
      setIsLoggingOut(false);
      navigate("/login");
    }, 500);

    return () => clearTimeout(logoutDelay);
  }, [navigate]);

  if (isLoggingOut) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return null;
}
