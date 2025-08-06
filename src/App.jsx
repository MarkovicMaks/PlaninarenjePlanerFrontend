// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";


export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />

      {/* Example of another route */}
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Signup" element={<SignupPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/trails" element={<TrailListPage />} />
      {/* Optionally a “catch-all” 404: */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
