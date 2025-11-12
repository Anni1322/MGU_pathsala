import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotifications, setIsNotifications] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Settings</Text>

      {/* Dark Mode Option */}
      <View style={styles.option}>
        <Text style={styles.optionText}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={(val) => setIsDarkMode(val)}
          thumbColor={isDarkMode ? "#006d33" : "#ccc"}
        />
      </View>

      {/* Notifications Option */}
      <View style={styles.option}>
        <Text style={styles.optionText}>Notifications</Text>
        <Switch
          value={isNotifications}
          onValueChange={(val) => setIsNotifications(val)}
          thumbColor={isNotifications ? "#006d33" : "#ccc"}
        />
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={() => alert("Logged out!")}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#3a2d75",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  logoutBtn: {
    marginTop: 30,
    backgroundColor: "#f14d55",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
