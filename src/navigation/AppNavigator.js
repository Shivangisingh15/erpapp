import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Import Screens
import SplashScreen from "../screens/SplashScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import LoginScreen from "../screens/LoginScreen";

// Import Tab Navigators
import StudentTabNavigator from "./StudentTabNavigator";
import AdminTabNavigator from "./AdminTabNavigator";

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animationEnabled: false,
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            animationEnabled: true,
            cardStyleInterpolator: ({ current }) => ({
              cardStyle: {
                opacity: current.progress,
              },
            }),
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationEnabled: true,
          }}
        />

        {/* Role-based Navigation Stacks */}
        <Stack.Screen
          name="Student"
          component={StudentTabNavigator}
          options={{
            animationEnabled: true,
          }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminTabNavigator}
          options={{
            animationEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
