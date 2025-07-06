import React, { useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  StatusBar 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

// Modern Theme
const colors = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  white: '#ffffff',
  text: '#0f172a',
  error: '#ef4444',
  gray50: '#f9fafb',
  gray200: '#e5e7eb',
};

const Header = ({ 
  title = "Dashboard", 
  showBack = false, 
  rightComponent = null,
  showNotifications = true,
  onNotificationPress,
  notificationCount = 3,
  backgroundColor = colors.primary,
  textColor = colors.white
}) => {
  const navigation = useNavigation();
  
  // Simple animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      console.log('Notifications pressed');
    }
  };

  return (
    <View style={styles.headerWrapper}>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      
      {/* Always render a solid background first */}
      <View style={[styles.solidBackground, { backgroundColor }]}>
        
        {/* Try to render gradient on top */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.gradientOverlay}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        
        {/* Header content */}
        <Animated.View style={[styles.headerContent, { opacity: fadeAnim }]}>
          
          {/* Left Section */}
          <View style={styles.leftSection}>
            {showBack && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <View style={styles.buttonContainer}>
                  <Icon name="arrow-back" size={24} color={textColor} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section */}
          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
              {title}
            </Text>
          </View>

          {/* Right Section */}
          <View style={styles.rightSection}>
            {rightComponent ? (
              rightComponent
            ) : showNotifications ? (
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={handleNotificationPress}
                activeOpacity={0.7}
              >
                <View style={styles.buttonContainer}>
                  <Icon name="notifications" size={24} color={textColor} />
                  
                  {/* Notification Badge */}
                  {notificationCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 99 ? '99+' : notificationCount.toString()}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    position: 'relative',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1000,
  },
  
  solidBackground: {
    position: 'relative',
    minHeight: 60,
  },
  
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    minHeight: 60,
    position: 'relative',
    zIndex: 10,
  },
  
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  
  centerSection: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  
  backButton: {
    padding: 4,
  },
  
  notificationButton: {
    padding: 4,
  },
  
  buttonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.white,
    elevation: 4,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});

// Simple preset components
export const DashboardHeader = ({ title = "Dashboard", onNotificationPress, notificationCount = 3 }) => (
  <Header
    title={title}
    showNotifications={true}
    onNotificationPress={onNotificationPress}
    notificationCount={notificationCount}
  />
);

export const PageHeader = ({ title, showBack = true }) => (
  <Header
    title={title}
    showBack={showBack}
    showNotifications={true}
    notificationCount={3}
  />
);

export const SimpleHeader = ({ title, showBack = false }) => (
  <Header
    title={title}
    showBack={showBack}
    showNotifications={false}
  />
);

export default Header;