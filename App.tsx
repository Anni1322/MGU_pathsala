import React, { useEffect } from "react";
import { ThemeProvider } from "./src/common/Theme/ThemeContext";
import AppNavigation from "./src/common/Navigation/AppNavigation";
import AlertProvider from "./src/common/Services/alert/AlertProvider";
import requestAndroidPermission from "./src/common/Services/requestStoragePermission";

export default function App() {
  useEffect(() => {
    (async () => {
      const hasPermission = await requestAndroidPermission();
      if (!hasPermission) {
        console.log("⚠️ Some permissions denied");
      }
    })();
  }, []);

  return (
    <ThemeProvider>
      <AlertProvider>
        <AppNavigation />
      </AlertProvider>
    </ThemeProvider>
  );
}
