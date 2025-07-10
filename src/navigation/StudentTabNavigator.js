// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Icon from "react-native-vector-icons/MaterialIcons";

// // Import Student Screens
// import StudentHomeScreen from "../screens/student/StudentHomeScreen";
// import StudentFeeScreen from "../screens/student/StudentFeeScreen";
// import StudentResultScreen from "../screens/student/StudentResultScreen";
// import StudentProfileScreen from "../screens/student/StudentProfileScreen";

// // Import colors
// import { colors } from "../styles/colors";

// const Tab = createBottomTabNavigator();

// const StudentTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName;

//           if (route.name === "Home") {
//             iconName = "home";
//           } else if (route.name === "Fee") {
//             iconName = "payments";
//           } else if (route.name === "Results") {
//             iconName = "assessment";
//           } else if (route.name === "Profile") {
//             iconName = "account-circle";
//           }

//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: "gray",
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="Home" component={StudentHomeScreen} />
//       <Tab.Screen name="Fee" component={StudentFeeScreen} />
//       <Tab.Screen name="Results" component={StudentResultScreen} />
//       <Tab.Screen name="Profile" component={StudentProfileScreen} />
//     </Tab.Navigator>
//   );
// };

// export default StudentTabNavigator;
////////////////////////////////////////////////////// NEW NAVIGATOR ///////////////////////////////////////////////////////
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Animated, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import Student Screens
import StudentHomeScreen from "../screens/student/StudentHomeScreen";
import StudentFeeScreen from "../screens/student/StudentFeeScreen";
import StudentResultScreen from "../screens/student/StudentResultScreen";
import StudentProfileScreen from "../screens/student/StudentProfileScreen";

// Import colors
import { colors } from "../styles/colors";

const Tab = createBottomTabNavigator();

// Animated Tab Icon Component
const AnimatedTabIcon = ({ focused, iconName, size, label }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;
  const opacityValue = React.useRef(new Animated.Value(0.7)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.2 : 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -5 : 0,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: focused ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
      <Animated.View
        style={{
          transform: [
            { scale: scaleValue },
            { translateY: translateY }
          ],
          opacity: opacityValue,
          alignItems: "center",
        }}
      >
        {/* Icon Background */}
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: focused ? (colors.primary || "#3B82F6") : "transparent",
            justifyContent: "center",
            alignItems: "center",
            shadowColor: focused ? (colors.primary || "#3B82F6") : "transparent",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: focused ? 0.3 : 0,
            shadowRadius: 8,
            elevation: focused ? 8 : 0,
            borderWidth: focused ? 0 : 1.5,
            borderColor: focused ? "transparent" : "rgba(59, 130, 246, 0.2)",
          }}
        >
          <Icon
            name={iconName}
            size={size}
            color={focused ? "#FFFFFF" : (colors.primary || "#3B82F6")}
          />
        </View>
        
        {/* Label */}
        <Text
          style={{
            fontSize: 11,
            fontWeight: focused ? "600" : "500",
            color: focused ? (colors.primary || "#3B82F6") : "#64748B",
            marginTop: 6,
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </Animated.View>
    </View>
  );
};

const StudentTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let iconName;
          let label;

          if (route.name === "Home") {
            iconName = "home";
            label = "Home";
          } else if (route.name === "Fee") {
            iconName = "payments";
            label = "Fees";
          } else if (route.name === "Results") {
            iconName = "assessment";
            label = "Results";
          } else if (route.name === "Profile") {
            iconName = "account-circle";
            label = "Profile";
          }

          return (
            <AnimatedTabIcon
              focused={focused}
              iconName={iconName}
              size={24}
              label={label}
            />
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          height: Platform.OS === 'ios' ? 90 : 75,
          backgroundColor: "#FFFFFFF1",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingHorizontal: 15,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 15,
          elevation: 20,
          borderTopWidth: 1,
          borderTopColor: "rgba(59, 130, 246, 0.1)",
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              borderTopWidth: 3,
              borderTopColor: colors.primary || "#3B82F6",
            }}
          />
        ),
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={StudentHomeScreen}
        options={{
          tabBarLabel: "Home"
        }}
      />
      <Tab.Screen 
        name="Fee" 
        component={StudentFeeScreen}
        options={{
          tabBarLabel: "Fees"
        }}
      />
      <Tab.Screen 
        name="Results" 
        component={StudentResultScreen}
        options={{
          tabBarLabel: "Results"
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={StudentProfileScreen}
        options={{
          tabBarLabel: "Profile"
        }}
      />
    </Tab.Navigator>
  );
};

export default StudentTabNavigator;