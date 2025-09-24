import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import HomePage from "./pages/Home";
import Feed from "./pages/feed/Feed";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProtectedRoute from "./pages/ProtectedRoute";


// ✅ GuestRoute prevents logged-in users from seeing login/signup
const GuestRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) return <Navigate to="/home" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);

  // ✅ On page reload, load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        {/* Redirect "/" → "/login" */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <GuestRoute>
              <Signup />
            </GuestRoute>
          }
        />

        {/* Home with nested routes */}
        <Route
  path="/home"
  element={
    <ProtectedRoute>
      <HomePage user={user} handleLogout={handleLogout} />
    </ProtectedRoute>
  }
>
  <Route index element={<Feed user={user} />} />
  <Route path="feed" element={<Feed user={user} />} />
  <Route path="profile" element={<ProfilePage user={user} />} />
  <Route path="profile/:username" element={<ProfilePage user={user} />} />
  <Route path="notification" element={<NotificationPage user={user} />} />
</Route>

      </Routes>
    </Router>
  );
}

export default App;
