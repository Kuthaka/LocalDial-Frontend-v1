"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { ReactNode, useEffect } from "react";
import { setLocation } from "@/store/locationSlice";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      store.dispatch(setLocation(savedLocation));
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
