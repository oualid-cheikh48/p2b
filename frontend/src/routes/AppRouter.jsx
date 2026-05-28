import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/dashboard/Profile";
import Home from "../pages/Home";
import Properties from "../pages/Properties";
import PropertyDetails from "../pages/PropertyDetails";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
