import { useState, useEffect } from "react";
import { useNavigationContainerRef } from "@react-navigation/native";

export const useCurrentRouteName = () => {
  const [currentRouteName, setCurrentRouteName] = useState(null);
  const navigationRef = useNavigationContainerRef();

  const getCurrentRouteName = (state) => {
    const route = state.routes[state.index];
    if (route.state) {
      return getCurrentRouteName(route.state);
    }
    return route.name;
  };

  useEffect(() => {
    const unsubscribe = navigationRef.addListener("state", (state) => {
      setCurrentRouteName(getCurrentRouteName(state.data.state));
    });

    return unsubscribe;
  }, [navigationRef]);

  return currentRouteName;
};
