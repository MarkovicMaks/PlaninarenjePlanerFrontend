// useGeolocation.js
import { useEffect, useState } from "react";

export default function GeoLocate() {
  const [pos, setPos]   = useState(null);     
  const [error, setErr] = useState(null);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setErr("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      (e) => setErr(e.message),
      { enableHighAccuracy: true, timeout: 10_000 }
    );
  }, []);

  return { pos, error };
}
