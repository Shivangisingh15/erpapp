import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Animated, Platform, Dimensions } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Import Student Screens
import StudentHomeScreen from "../screens/student/StudentHomeScreen";
import StudentFeeScreen from "../screens/student/StudentFeeScreen";
import StudentResultScreen from "../screens/student/StudentResultScreen";
import StudentProfileScreen from "../screens/student/StudentProfileScreen";

// Import colors
import { colors } from "../styles/colors";

const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get('window');

// iPhone-style Floating Tab Component
const FloatingTab = ({ focused, iconName, label, index }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const iconScale = React.useRef(new Animated.Value(1)).current;
  const labelOpacity = React.useRef(new Animated.Value(focused ? 1 : 0.7)).current;
  const backgroundOpacity = React.useRef(new Animated.Value(focused ? 1 : 0)).current;
  const jumpValue = React.useRef(new Animated.Value(0)).current;

  const triggerJumpAnimation = () => {
    jumpValue.setValue(0);
    Animated.sequence([
      Animated.timing(jumpValue, {
        toValue: -8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(jumpValue, {
        toValue: -2,
        tension: 300,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    if (focused) {
      // Trigger jump animation
      triggerJumpAnimation();
      
      // Other animations for focused state
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1.1,
          tension: 400,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1.2,
          tension: 300,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Return to normal state
      Animated.parallel([
        Animated.spring(scaleValue, {
          toValue: 1,
          tension: 400,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(jumpValue, {
          toValue: 0,
          tension: 350,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 300,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 0.7,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <View style={{
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      position: 'relative',
    }}>
      {/* Active Background Circle */}
      <Animated.View
        style={{
          position: 'absolute',
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          opacity: backgroundOpacity,
          transform: [{ scale: scaleValue }],
        }}
      />
      
      <Animated.View
        style={{
          transform: [
            { scale: scaleValue },
            { translateY: jumpValue }
          ],
          alignItems: "center",
          zIndex: 1,
        }}
      >
        {/* Icon with Micro-interaction */}
        <Animated.View
          style={{
            transform: [{ scale: iconScale }],
            marginBottom: 2,
          }}
        >
          <Icon
            name={iconName}
            size={22}
            color={focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)"}
          />
        </Animated.View>
        
        {/* Animated Label */}
        <Animated.Text
          style={{
            fontSize: 9,
            fontWeight: focused ? "700" : "500",
            color: focused ? "#FFFFFF" : "rgba(255, 255, 255, 0.6)",
            opacity: labelOpacity,
            letterSpacing: 0.2,
          }}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </View>
  );
};

// Floating Container Background
const FloatingBackground = ({ insets }) => {
  const backgroundScale = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.spring(backgroundScale, {
      toValue: 1,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale: backgroundScale }],
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        borderRadius: 28,
        ...Platform.select({
          ios: {
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
          },
          android: {
            elevation: 15,
          },
        }),
        // Glassmorphism effect
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Subtle gradient overlay for depth */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
        }}
      />
    </Animated.View>
  );
};

const StudentTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const [activeTabIndex, setActiveTabIndex] = React.useState(0);

  const tabConfig = [
    { name: "Home", iconName: "home", label: "Home" },
    { name: "Fee", iconName: "payments", label: "Fees" },
    { name: "Results", iconName: "assessment", label: "Results" },
    { name: "Profile", iconName: "account-circle", label: "Profile" },
  ];

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          const tabIndex = tabConfig.findIndex(tab => tab.name === route.name);
          const config = tabConfig[tabIndex];
          
          React.useEffect(() => {
            if (focused) {
              setActiveTabIndex(tabIndex);
            }
          }, [focused, tabIndex]);

          return (
            <FloatingTab
              focused={focused}
              iconName={config.iconName}
              label={config.label}
              index={tabIndex}
            />
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === 'ios' ? insets.bottom + 20 : 20,
          left: 20,
          right: 20,
          height: 65,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          paddingTop: 8,
          paddingBottom: 8,
          paddingHorizontal: 12,
          borderRadius: 28,
          marginHorizontal: 0,
        },
        tabBarBackground: () => (
          <FloatingBackground insets={insets} />
        ),
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 20,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={StudentHomeScreen}
        options={{
          tabBarAccessibilityLabel: "Home",
        }}
      />
      <Tab.Screen 
        name="Fee" 
        component={StudentFeeScreen}
        options={{
          tabBarAccessibilityLabel: "Fees",
        }}
      />
      <Tab.Screen 
        name="Results" 
        component={StudentResultScreen}
        options={{
          tabBarAccessibilityLabel: "Results",
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={StudentProfileScreen}
        options={{
          tabBarAccessibilityLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;