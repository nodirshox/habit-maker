import { Outlet, Navigate } from "react-router-dom";
import React from "react";

export const ProtectRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};
