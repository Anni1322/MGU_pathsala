import React, { useEffect, useRef } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";

export default function CustomSpinner({
  size = 50,
  color = "#ffffff",
  thickness = 4,
  type = "border", // "border", "dots", "bars"
  text = "", // New prop for text
}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const pulseAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (type === "border") {
      const startRotation = () => {
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          })
        ).start();
      };
      startRotation();
    } else if (type === "dots") {
      const pulseSequence = (anim, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      pulseSequence(pulseAnim1, 0);
      pulseSequence(pulseAnim2, 200);
      pulseSequence(pulseAnim3, 400);
    } else if (type === "bars") {
      const barSequence = (anim, delay) => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1,
              duration: 400,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      barSequence(pulseAnim1, 0);
      barSequence(pulseAnim2, 150);
      barSequence(pulseAnim3, 300);
    }
  }, [rotateAnim, pulseAnim1, pulseAnim2, pulseAnim3, type]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const scale1 = pulseAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const scale2 = pulseAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });
  const scale3 = pulseAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  if (type === "border") {
    return (
      <View style={[styles.container, { width: size, height: size }]}>
        <Animated.View
          style={[
            styles.spinner,
            {
              width: size,
              height: size,
              borderWidth: thickness,
              borderColor: color,
              borderTopColor: "transparent",
              transform: [{ rotate }],
            },
          ]}
        />
        {text && (
          <Text style={[styles.text, { color: color }]}>{text}</Text>
        )}
      </View>
    );
  } else if (type === "dots") {
    return (
      <View style={styles.dotsContainer}>
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: color, transform: [{ scale: scale1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: color, transform: [{ scale: scale2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            { backgroundColor: color, transform: [{ scale: scale3 }] },
          ]}
        />
        {text && (
          <Text style={[styles.text, { color: color, marginTop: 10 }]}>
            {text}
          </Text>
        )}
      </View>
    );
  } else if (type === "bars") {
    return (
      <View style={styles.barsContainer}>
        <Animated.View
          style={[
            styles.bar,
            { backgroundColor: color, transform: [{ scaleY: scale1 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { backgroundColor: color, transform: [{ scaleY: scale2 }] },
          ]}
        />
        <Animated.View
          style={[
            styles.bar,
            { backgroundColor: color, transform: [{ scaleY: scale3 }] },
          ]}
        />
        {text && (
          <Text style={[styles.text, { color: color, marginTop: 10 }]}>
            {text}
          </Text>
        )}
      </View>
    );
  }

  return null; // Fallback if type is invalid
}

const styles = StyleSheet.create({
  // This is the main container style for centering the spinner and text
  container: {
    justifyContent: "center", // Centers spinner vertically within the container
    alignItems: "center",     // Centers spinner horizontally within the container
    position: "relative",     // For positioning text on top of the spinner
  },
  spinner: {
    borderRadius: 50, // Half of size for circle
    borderStyle: "solid",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    width: 6,
    height: 20,
    marginHorizontal: 2,
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 15, // Add space between the spinner and the text
  },
});
