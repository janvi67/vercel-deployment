import { Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import HomePage from "../pages/HomePage";
import SignupPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage";
import SettigsPage from "../pages/SettigsPage";
import ProfilePage from "../pages/ProfilePage";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "../store/useThemeStore";
import {Lobby} from "../components/screens/Lobby";
import { Room } from "../components/screens/Room";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const { theme } = useThemeStore();

  console.log({ onlineUsers });

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />
      

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettigsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
         <Route
          path="/lobby/:userId"
          element={authUser ? <Lobby /> : <Navigate to="/login" />}
        />
         <Route
          path="/room/:id"
          element={authUser ? <Room/> : <Navigate to="/login" />}
        />
         
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
