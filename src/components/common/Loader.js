import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";

const Loader = ({ message = "Loading", color = "#007AFF", size = "large" }) => {
  const [dots, setDots] = useState("");
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  // Create animated dots effect for the loading message
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.loaderContainer}>
      <Animated.View
        style={[
          styles.loaderCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>

        <Text style={[styles.loaderText, { color }]}>
          {message}
          <Text style={styles.dots}>{dots}</Text>
        </Text>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { backgroundColor: color }]} />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loaderCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    minWidth: 160,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  spinnerContainer: {
    marginBottom: 20,
  },
  loaderText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    minHeight: 20,
  },
  dots: {
    fontSize: 16,
    fontWeight: "bold",
  },
  progressBar: {
    width: "100%",
    height: 3,
    backgroundColor: "#f0f0f0",
    borderRadius: 1.5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    width: "100%",
    borderRadius: 1.5,
    opacity: 0.8,
  },
});

export default Loader;
