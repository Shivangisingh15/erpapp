import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Button from "./common/Button";

const { width } = Dimensions.get("window");

const ResponseModal = ({
  type = "Success",
  onClick,
  msg = "",
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  const isSuccess = type === "Success";
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(bounceAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto close functionality
    if (autoClose && onClick) {
      const timer = setTimeout(() => {
        onClick();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, []);

  const getIconConfig = () => {
    if (isSuccess) {
      return {
        name: "check-circle",
        color: "#28a745",
        backgroundColor: "rgba(40, 167, 69, 0.1)",
      };
    } else {
      return {
        name: "error",
        color: "#dc3545",
        backgroundColor: "rgba(220, 53, 69, 0.1)",
      };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: bounceAnim }],
        },
      ]}
    >
      <View style={styles.content}>
        {/* Icon Container */}
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: iconConfig.backgroundColor },
            {
              transform: [
                {
                  scale: bounceAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.2, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Icon name={iconConfig.name} size={48} color={iconConfig.color} />
        </Animated.View>

        {/* Title */}
        <Text style={[styles.title, { color: iconConfig.color }]}>
          {isSuccess ? "Success!" : "Error!"}
        </Text>

        {/* Message */}
        <Text style={styles.message}>{msg}</Text>

        {/* Action Button */}
        <View style={styles.buttonContainer}>
          <Button
            text="OK"
            onPress={onClick}
            type={isSuccess ? "success" : "red"}
            size="medium"
            fullWidth
          />
        </View>

        {/* Auto close indicator */}
        {autoClose && (
          <View style={styles.autoCloseContainer}>
            <Text style={styles.autoCloseText}>
              Auto closing in {Math.ceil(autoCloseDelay / 1000)}s
            </Text>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: iconConfig.color },
                  {
                    width: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: width * 0.8,
    maxWidth: width * 0.9,
  },
  content: {
    alignItems: "center",
    padding: 30,
    paddingBottom: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 15,
  },
  autoCloseContainer: {
    alignItems: "center",
    width: "100%",
  },
  autoCloseText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
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
    borderRadius: 1.5,
  },
});

export default ResponseModal;
