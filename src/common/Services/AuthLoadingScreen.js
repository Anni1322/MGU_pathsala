// src/navigation/AuthLoadingScreen.js
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthLoadingScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");

        if (token && userData) {
          const user = JSON.parse(userData);
          if (user.role === "student") {
            navigation.replace("StudentDashboard", { user });
          } else if (user.role === "Admin") {
            navigation.replace("EmployeeDashboard", { user });
          } else {
            navigation.replace("Student");
          }
        } else {
          navigation.replace("Login");
        }
      } catch (e) {
        console.error("Auth check failed", e);
        navigation.replace("Login");
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#2E7D32" />
    </View>
  );
};

export default AuthLoadingScreen;
