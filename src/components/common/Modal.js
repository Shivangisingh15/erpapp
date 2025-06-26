import React, { useEffect, useRef } from "react";
import {
  Modal as RNModal,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width, height } = Dimensions.get("window");

const Modal = ({
  isVisible = false,
  onClose,
  children,
  showCloseButton = true,
  closeOnBackdrop = true,
  animationType = "slide",
  transparent = true,
  style = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (isVisible) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Exit animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleBackdropPress = () => {
    if (closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={isVisible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <StatusBar
        backgroundColor="rgba(0, 0, 0, 0.5)"
        barStyle="light-content"
      />

      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              style,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Close Button */}
                {showCloseButton && onClose && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="close" size={24} color="#666" />
                  </TouchableOpacity>
                )}

                {/* Modal Content */}
                <View style={styles.contentWrapper}>{children}</View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  modalContent: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    width: 40,
    height: 40,
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
  contentWrapper: {
    padding: 20,
    paddingTop: 20,
  },
});

export default Modal;
