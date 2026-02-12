import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Songs from "./pages/Songs.jsx";
import SongDetails from "./pages/SongDetails.jsx";
import { isLoggedIn } from "./auth/auth.js";

function PrivateRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/songs"
        element={
          <PrivateRoute>
            <Songs />
          </PrivateRoute>
        }
      />

      <Route
        path="/songs/:id"
        element={
          <PrivateRoute>
            <SongDetails />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
