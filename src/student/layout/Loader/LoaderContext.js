import React, { createContext, useState, useContext } from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("Loading...");

  const showLoader = (msg = "Loading...") => {
    setMessage(msg);
    setLoading(true);
  };

  const hideLoader = () => setLoading(false);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      {loading && (
        <View style={styles.loaderContainer}>
          <View style={styles.loaderBox}>
            <ActivityIndicator size="large" color="#2e7d32" />
            <Text style={styles.loaderText}>{message}</Text>
          </View>
        </View>
      )}
    </LoaderContext.Provider>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5000,
  },
  loaderBox: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "bold",
  },
});
