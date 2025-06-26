import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const StudentProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        const decoded = jwtDecode(tokens.accessToken);

        // In a real app, you'd probably make an API call to get the full profile
        setUserData({
          id: decoded.user_id,
          name: decoded.name,
          email: decoded.email,
          role_id: decoded.role_id,
          studentId: "STU2025001",
          class: "Class X - A",
          admissionYear: "2022",
          dob: "2005-04-15",
          parentName: "Rahul Sharma",
          parentContact: "+91 9876543210",
          address: "123, Sector 15, New Delhi - 110001",
          bloodGroup: "B+",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("ERPTokens");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      id: 1,
      title: "Personal Details",
      icon: "person",
      screen: "PersonalDetails",
    },
    {
      id: 2,
      title: "Leave Applications",
      icon: "event-busy",
      screen: "LeaveApplications",
    },
    {
      id: 3,
      title: "Resources",
      icon: "library-books",
      screen: "Resources",
    },
    {
      id: 4,
      title: "Timetable",
      icon: "schedule",
      screen: "Timetable",
    },
    {
      id: 5,
      title: "Change Password",
      icon: "lock",
      screen: "ChangePassword",
    },
    {
      id: 6,
      title: "Support & Help",
      icon: "help-outline",
      screen: "Support",
    },
  ];

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Profile" />
        <View style={styles.loadingContainer}>
          <Text>Loading profile data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </Text>
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userClass}>{userData.class}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Student ID</Text>
            <Text style={styles.infoValue}>{userData.studentId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admission Year</Text>
            <Text style={styles.infoValue}>{userData.admissionYear}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{userData.dob}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Blood Group</Text>
            <Text style={styles.infoValue}>{userData.bloodGroup}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Parent/Guardian Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{userData.parentName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>{userData.parentContact}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData.address}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Icon name={item.icon} size={24} color={colors.primary} />
              <Text style={styles.menuText}>{item.title}</Text>
              <Icon name="chevron-right" size={24} color={colors.textLight} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="exit-to-app" size={20} color={colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    padding: spacing.large,
    backgroundColor: colors.white,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  avatarText: {
    color: colors.white,
    fontSize: 36,
    fontWeight: "bold",
  },
  userName: {
    ...typography.h2,
    color: colors.text,
  },
  userClass: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
    marginTop: spacing.xSmall,
  },
  userEmail: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xSmall,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
  },
  infoCard: {
    backgroundColor: colors.white,
    padding: spacing.medium,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  infoLabel: {
    ...typography.body,
    color: colors.textLight,
    flex: 1,
  },
  infoValue: {
    ...typography.body,
    color: colors.text,
    fontWeight: "500",
    flex: 2,
    textAlign: "right",
  },
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: spacing.medium,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  menuText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    marginLeft: spacing.medium,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: colors.error,
    marginHorizontal: spacing.medium,
    marginTop: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    ...typography.button,
    color: colors.white,
    marginLeft: spacing.small,
  },
  versionContainer: {
    alignItems: "center",
    padding: spacing.large,
  },
  versionText: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default StudentProfileScreen;
