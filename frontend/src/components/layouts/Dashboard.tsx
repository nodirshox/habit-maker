import * as React from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import { Link, Outlet } from "react-router-dom";
import Footer from "./Footer";

function DashboardContent() {
  return (
    <React.Fragment>
      <GlobalStyles
        styles={{ ul: { margin: 0, padding: 0, listStyle: "none" } }}
      />
      <CssBaseline />
      <AppBar
        position="static"
        elevation={0}
        sx={{
          mb: 2,
          boxShadow:
            "rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px",
        }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Link to="/">
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, color: "white" }}
            >
              Habit Maker
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>

      <Container component="main" disableGutters={true} sx={{ pl: 1, pr: 1 }}>
        <Outlet />
      </Container>

      <Footer sx={{ pt: 2 }} />
    </React.Fragment>
  );
}

export default function DashboardLayout() {
  return <DashboardContent />;
}
