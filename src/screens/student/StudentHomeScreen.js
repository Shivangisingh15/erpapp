import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const StudentHomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Final Exams Schedule",
      date: "2025-07-15",
      content:
        "Final exams will begin on July 15th. Please check your email for the detailed schedule.",
    },
    {
      id: 2,
      title: "Annual Day Celebration",
      date: "2025-08-05",
      content:
        "The annual day celebration will be held on August 5th. All students are required to participate.",
    },
  ]);

  useEffect(() => {
    loadUserData();
    // Here you would fetch announcements, attendance, and other dashboard data
  }, []);

  const loadUserData = async () => {
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        // In a real app, you'd decode the token or make an API call
        // to get fresh user data
        setUserData({ name: "Student Name" });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Reload data
    await loadUserData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Home" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userData && (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>
              Welcome back, {userData.name}!
            </Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="access-time" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Upcoming Classes</Text>
          </View>
          <View style={styles.classItem}>
            <Text style={styles.className}>Mathematics</Text>
            <Text style={styles.classTime}>09:00 AM - 10:30 AM</Text>
          </View>
          <View style={styles.classItem}>
            <Text style={styles.className}>Science</Text>
            <Text style={styles.classTime}>11:00 AM - 12:30 PM</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="event-note" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Announcements</Text>
          </View>
          {announcements.map((announcement) => (
            <View key={announcement.id} style={styles.announcementItem}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementDate}>{announcement.date}</Text>
              <Text style={styles.announcementContent}>
                {announcement.content}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Icon name="assessment" size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>Attendance Summary</Text>
          </View>
          <View style={styles.attendanceSummary}>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendancePercent}>92%</Text>
              <Text style={styles.attendanceLabel}>Present</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendancePercent}>8%</Text>
              <Text style={styles.attendanceLabel}>Absent</Text>
            </View>
          </View>
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
    padding: spacing.medium,
  },
  welcomeSection: {
    marginBottom: spacing.medium,
  },
  welcomeText: {
    ...typography.h2,
    color: colors.text,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.small,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginLeft: spacing.small,
  },
  classItem: {
    marginVertical: spacing.xSmall,
    padding: spacing.small,
    backgroundColor: colors.lightBackground,
    borderRadius: 4,
  },
  className: {
    ...typography.body,
    fontWeight: "bold",
  },
  classTime: {
    ...typography.caption,
    color: colors.textLight,
  },
  announcementItem: {
    marginVertical: spacing.xSmall,
    padding: spacing.small,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    backgroundColor: colors.lightBackground,
    borderRadius: 4,
  },
  announcementTitle: {
    ...typography.subtitle,
    fontWeight: "bold",
  },
  announcementDate: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.xSmall,
  },
  announcementContent: {
    ...typography.body,
  },
  attendanceSummary: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: spacing.small,
  },
  attendanceItem: {
    alignItems: "center",
  },
  attendancePercent: {
    ...typography.h2,
    fontWeight: "bold",
    color: colors.primary,
  },
  attendanceLabel: {
    ...typography.caption,
  },
});

export default StudentHomeScreen;
