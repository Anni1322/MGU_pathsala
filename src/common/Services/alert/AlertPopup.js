import React, { useEffect, useRef } from "react";
import {
  Animated,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";

const { width, height } = Dimensions.get("window");

const TYPE_STYLES = {
  success: { backgroundColor: "#047857" },
  info: { backgroundColor: "#0ea5e9" },
  warn: { backgroundColor: "#f59e0b" },
  error: { backgroundColor: "#dc2626" },
  default: { backgroundColor: "#111827" },
};

export default function AlertPopup({
  title,
  message,
  type = "default",
  duration,
  onHide = () => {},
  onPress,
  buttonText = "Yes",   
  cancelText = "No",   
  onCancel,
}) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    let timer;
    if (duration) {
      timer = setTimeout(() => hide(), duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  function hide() {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onHide());
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
        },
      ]}
    >
      {/* Dark semi-transparent background */}
      <Pressable style={StyleSheet.absoluteFill} onPress={hide}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.5)" }]} />
      </Pressable>

      <Animated.View
        style={[
          styles.card,
          TYPE_STYLES[type] || TYPE_STYLES.default,
          { transform: [{ scale }] },
        ]}
      >
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              if (onCancel) onCancel();
              hide();
            }}
            style={[styles.button, styles.cancelButton]}
          >
            <Text style={styles.buttonText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (onPress) onPress();
              hide();
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  card: {
    width: width * 0.8,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  title: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 15,
    marginBottom: 16,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  cancelButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
});
