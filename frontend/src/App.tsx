import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import { ProtectRoutes } from "./utils/protected-routes";
import DashboardLayout from "./components/layouts/Dashboard";
import Home from "./pages/home/Home";
import "./App.css";
import Logout from "./pages/auth/Logout";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route element={<ProtectRoutes />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
