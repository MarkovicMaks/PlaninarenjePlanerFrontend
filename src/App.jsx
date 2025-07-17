import Filterbar from "./components/Filters/Filterbar";
import InicialMap from "./components/Map/InicialMap";
import Navbar from "./components/Navbar";
function App() {
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

export default App;
