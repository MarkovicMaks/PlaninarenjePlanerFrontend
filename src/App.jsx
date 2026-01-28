// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import TrailListPage from "./pages/TrailListPage.jsx";
import MyTrailsPage from "./pages/MyTrailsPage.jsx";



export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />

      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/trails" element={<TrailListPage />} />
      <Route path="/my-trails" element={<MyTrailsPage />} />
      {/* Optionally a “catch-all” 404: */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
