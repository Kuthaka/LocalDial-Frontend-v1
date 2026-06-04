import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocationState] = useState("");

  useEffect(() => {
    const loc = localStorage.getItem("userLocation");
    if (loc) setLocationState(loc);

    const handleLocationChange = () => {
      const updatedLoc = localStorage.getItem("userLocation");
      if (updatedLoc) setLocationState(updatedLoc);
    };

    window.addEventListener("location-changed", handleLocationChange);
    return () => window.removeEventListener("location-changed", handleLocationChange);
  }, []);

  const setLocation = (loc: string) => {
    localStorage.setItem("userLocation", loc);
    window.dispatchEvent(new Event("location-changed"));
    setLocationState(loc);
  };

  return [location, setLocation] as const;
}
