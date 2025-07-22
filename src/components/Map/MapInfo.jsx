
function MapInfo({ routeInfo }) {
  return (
    <div className="MapInfo">
      {routeInfo ? (
        <h2>
          Distance: {routeInfo.distanceKm} km&nbsp;|&nbsp;↗︎ {routeInfo.ascendM} m&nbsp;
          ↘︎ {routeInfo.descendM} m&nbsp;|&nbsp;Duration: {routeInfo.durationMin} min
        </h2>
      ) : (
        <h2>Select a route to see details.</h2>
      )}
    </div>
  );
}

export default MapInfo;
