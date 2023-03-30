import React, { useState, useEffect } from "react";
import { Text } from "react-native-paper";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { ThemeProvider } from "styled-components/native";
import { Provider as PaperProvider } from "react-native-paper";
import { theme } from "./src/infrastructure/theme";

import { Navigation } from "./src/infrastructure/navigation/index";

export default function App() {
  return (
    <>
      <PaperProvider>
        <ThemeProvider theme={theme}>
          <Navigation />
        </ThemeProvider>
        <ExpoStatusBar style="auto" />
      </PaperProvider>
    </>
  );
}
