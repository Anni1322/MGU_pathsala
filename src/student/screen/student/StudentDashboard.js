// StudentDashboard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function StudentDashboard({ route }) {
  const { user } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎓 Student Dashboard</Text>
      <Text style={styles.text}>Welcome, {user.name}</Text>
      <Text style={styles.text}>Role: {user.role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 18 }
});
