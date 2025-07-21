// src/App.jsx
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
// import other pages as you create them, e.g.:
// import About from "./pages/About";

export default function App() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />

      {/* Example of another route */}
      <Route path="/Login" element={<LoginPage />} />

      {/* Optionally a “catch-all” 404: */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}
