import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PostJob from "./components/PostJob";
import CompanyRegister from "./components/CompanyRegister";

function PrivateRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <PrivateRoute>
              <PostJob />
            </PrivateRoute>
          }
        />
        <Route
          path="/company-register"
          element={
            <PrivateRoute>
              <CompanyRegister />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
