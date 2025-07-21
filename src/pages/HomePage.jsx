// src/pages/Home.jsx
import Filterbar from "../components/Filters/Filterbar";
import InicialMap from "../components/Map/InicialMap";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="HomeLayout">
      <Filterbar />
      <div>
        <Navbar />
        <InicialMap />
      </div>
    </div>
  );
}
