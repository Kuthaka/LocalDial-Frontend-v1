"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { ReactNode, useEffect } from "react";
import { setLocation, setIsLocating } from "@/store/locationSlice";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      store.dispatch(setLocation(savedLocation));
      store.dispatch(setIsLocating(false));
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await res.json();
              const city = data.address.city || data.address.town || data.address.village || data.address.county || data.display_name.split(',')[0];
              store.dispatch(setLocation(city));
            } catch (err) {
              console.error("Reverse geocoding failed", err);
            } finally {
              store.dispatch(setIsLocating(false));
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            store.dispatch(setIsLocating(false));
          }
        );
      } else {
        store.dispatch(setIsLocating(false));
      }
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
