import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import Admin Screens
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";
import AdminStudentsScreen from "../screens/admin/AdminStudentsScreen";
import AdminFeesScreen from "../screens/admin/AdminFeesScreen";
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen";

// Import colors
import { colors } from "../styles/colors";

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Students") {
            iconName = "people";
          } else if (route.name === "Fees") {
            iconName = "account-balance-wallet";
          } else if (route.name === "Settings") {
            iconName = "settings";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Students" component={AdminStudentsScreen} />
      <Tab.Screen name="Fees" component={AdminFeesScreen} />
      <Tab.Screen name="Settings" component={AdminSettingsScreen} />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
