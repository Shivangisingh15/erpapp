import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import Student Screens
import StudentHomeScreen from "../screens/student/StudentHomeScreen";
import StudentFeeScreen from "../screens/student/StudentFeeScreen";
import StudentResultScreen from "../screens/student/StudentResultScreen";
import StudentProfileScreen from "../screens/student/StudentProfileScreen";

// Import colors
import { colors } from "../styles/colors";

const Tab = createBottomTabNavigator();

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Fee") {
            iconName = "payments";
          } else if (route.name === "Results") {
            iconName = "assessment";
          } else if (route.name === "Profile") {
            iconName = "account-circle";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={StudentHomeScreen} />
      <Tab.Screen name="Fee" component={StudentFeeScreen} />
      <Tab.Screen name="Results" component={StudentResultScreen} />
      <Tab.Screen name="Profile" component={StudentProfileScreen} />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;
