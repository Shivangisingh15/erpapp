import React from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import PropTypes from "prop-types";

const { width } = Dimensions.get("window");

const Button = ({
  text,
  onPress,
  type = "primary",
  size = "medium",
  disabled = false,
  icon,
  iconPosition = "right",
  fullWidth = false,
  loading = false,
  style = {},
  textStyle = {},
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];

    if (fullWidth) {
      baseStyle.push(styles.buttonFullWidth);
    }

    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    } else {
      baseStyle.push(styles[`button_${type}`]);
    }

    baseStyle.push(style);
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.buttonText, styles[`buttonText_${size}`]];

    if (disabled || loading) {
      baseTextStyle.push(styles.buttonTextDisabled);
    } else {
      baseTextStyle.push(styles[`buttonText_${type}`]);
    }

    baseTextStyle.push(textStyle);
    return baseTextStyle;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="small"
            color={type === "primary" ? "#fff" : "#007AFF"}
          />
          <Text style={[getTextStyle(), styles.loadingText]}>Loading...</Text>
        </View>
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === "left" && (
          <View style={styles.iconLeft}>{icon}</View>
        )}

        <Text style={getTextStyle()}>{text}</Text>

        {icon && iconPosition === "right" && (
          <View style={styles.iconRight}>{icon}</View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Button Types
  button_primary: {
    backgroundColor: "#007AFF",
  },
  button_secondary: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  button_red: {
    backgroundColor: "#dc3545",
  },
  button_success: {
    backgroundColor: "#28a745",
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  button_ghost: {
    backgroundColor: "transparent",
  },
  button_link: {
    backgroundColor: "transparent",
    shadowOpacity: 0,
    elevation: 0,
  },
  button_argreen: {
    backgroundColor: "#28a745",
  },
  button_arred: {
    backgroundColor: "#dc3545",
  },

  // Button Sizes
  button_small: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  button_medium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  button_large: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 56,
  },

  // Button States
  buttonFullWidth: {
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#e9ecef",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text Styles
  buttonText: {
    fontWeight: "600",
    textAlign: "center",
  },

  // Text Types
  buttonText_primary: {
    color: "#fff",
  },
  buttonText_secondary: {
    color: "#333",
  },
  buttonText_red: {
    color: "#fff",
  },
  buttonText_success: {
    color: "#fff",
  },
  buttonText_outline: {
    color: "#007AFF",
  },
  buttonText_ghost: {
    color: "#007AFF",
  },
  buttonText_link: {
    color: "#007AFF",
  },
  buttonText_argreen: {
    color: "#fff",
  },
  buttonText_arred: {
    color: "#fff",
  },

  // Text Sizes
  buttonText_small: {
    fontSize: 14,
  },
  buttonText_medium: {
    fontSize: 16,
  },
  buttonText_large: {
    fontSize: 18,
  },

  // Text States
  buttonTextDisabled: {
    color: "#6c757d",
  },

  // Layout
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginLeft: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func,
  type: PropTypes.oneOf([
    "primary",
    "secondary",
    "red",
    "success",
    "outline",
    "ghost",
    "link",
    "argreen",
    "arred",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(["left", "right"]),
  fullWidth: PropTypes.bool,
  loading: PropTypes.bool,
  style: PropTypes.object,
  textStyle: PropTypes.object,
};

export default Button;
