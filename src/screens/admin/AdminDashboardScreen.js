import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { jwtDecode } from "jwt-decode";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const AdminDashboardScreen = () => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 245,
    totalStaff: 32,
    attendanceToday: 92,
    pendingFees: 15,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      type: "fee",
      user: "Raj Kumar",
      action: "Fee Payment",
      date: "2025-06-24",
      amount: "₹25,000",
    },
    {
      id: 2,
      type: "leave",
      user: "Priya Sharma",
      action: "Leave Application",
      date: "2025-06-24",
      status: "Pending",
    },
    {
      id: 3,
      type: "result",
      user: "Admin",
      action: "Results Published",
      date: "2025-06-23",
      class: "Class X",
    },
    {
      id: 4,
      type: "attendance",
      user: "Admin",
      action: "Attendance Marked",
      date: "2025-06-23",
      attendanceRate: "95%",
    },
  ]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        const decoded = jwtDecode(tokens.accessToken);

        setUserData({
          id: decoded.user_id,
          name: decoded.name,
          email: decoded.email,
          role_id: decoded.role_id,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Reload data in a real app
    await loadUserData();
    setRefreshing(false);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "fee":
        return (
          <Icon
            name="account-balance-wallet"
            size={24}
            color={colors.primary}
          />
        );
      case "leave":
        return <Icon name="event-busy" size={24} color={colors.warning} />;
      case "result":
        return <Icon name="assessment" size={24} color={colors.success} />;
      case "attendance":
        return <Icon name="people" size={24} color={colors.info} />;
      default:
        return <Icon name="notifications" size={24} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Admin Dashboard" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {userData && (
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeText}>Welcome, {userData.name}</Text>
            <Text style={styles.dateText}>{new Date().toDateString()}</Text>
          </View>
        )}

        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <View style={styles.statsIconContainer}>
              <Icon name="people" size={30} color={colors.primary} />
            </View>
            <Text style={styles.statsNumber}>{stats.totalStudents}</Text>
            <Text style={styles.statsLabel}>Students</Text>
          </View>

          <View
            style={[
              styles.statsCard,
              { backgroundColor: colors.success + "15" },
            ]}
          >
            <View style={styles.statsIconContainer}>
              <Icon name="person" size={30} color={colors.success} />
            </View>
            <Text style={styles.statsNumber}>{stats.totalStaff}</Text>
            <Text style={styles.statsLabel}>Staff</Text>
          </View>

          <View
            style={[styles.statsCard, { backgroundColor: colors.info + "15" }]}
          >
            <View style={styles.statsIconContainer}>
              <Icon name="how-to-reg" size={30} color={colors.info} />
            </View>
            <Text style={styles.statsNumber}>{stats.attendanceToday}%</Text>
            <Text style={styles.statsLabel}>Attendance</Text>
          </View>

          <View
            style={[
              styles.statsCard,
              { backgroundColor: colors.warning + "15" },
            ]}
          >
            <View style={styles.statsIconContainer}>
              <Icon name="warning" size={30} color={colors.warning} />
            </View>
            <Text style={styles.statsNumber}>{stats.pendingFees}</Text>
            <Text style={styles.statsLabel}>Pending Fees</Text>
          </View>
        </View>

        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="person-add" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Add Student</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="receipt" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Record Fee</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="edit" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Mark Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Icon name="send" size={24} color={colors.white} />
              <Text style={styles.actionButtonText}>Send Notice</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentActivitiesContainer}>
          <Text style={styles.sectionTitle}>Recent Activities</Text>

          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                {getActivityIcon(activity.type)}
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.action}</Text>
                <Text style={styles.activityMeta}>
                  {activity.user} • {activity.date}
                </Text>
                {activity.amount && (
                  <Text style={styles.activityDetail}>
                    Amount: {activity.amount}
                  </Text>
                )}
                {activity.status && (
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          activity.status === "Pending"
                            ? colors.warning + "20"
                            : colors.success + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            activity.status === "Pending"
                              ? colors.warning
                              : colors.success,
                        },
                      ]}
                    >
                      {activity.status}
                    </Text>
                  </View>
                )}
                {activity.class && (
                  <Text style={styles.activityDetail}>
                    Class: {activity.class}
                  </Text>
                )}
                {activity.attendanceRate && (
                  <Text style={styles.activityDetail}>
                    Attendance Rate: {activity.attendanceRate}
                  </Text>
                )}
              </View>
              <Icon name="chevron-right" size={24} color={colors.textLight} />
            </View>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Activities</Text>
            <Icon name="arrow-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
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
  dateText: {
    ...typography.body,
    color: colors.textLight,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.medium,
  },
  statsCard: {
    width: "48%",
    padding: spacing.medium,
    marginBottom: spacing.medium,
    borderRadius: 8,
    alignItems: "center",
  },
  statsIconContainer: {
    marginBottom: spacing.small,
  },
  statsNumber: {
    ...typography.h1,
    fontWeight: "bold",
    color: colors.text,
  },
  statsLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  quickActionsContainer: {
    marginBottom: spacing.medium,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.medium,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  actionButton: {
    width: "48%",
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  actionButtonText: {
    ...typography.button,
    color: colors.white,
    marginTop: spacing.small,
  },
  recentActivitiesContainer: {
    marginBottom: spacing.large,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
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
  activityIconContainer: {
    marginRight: spacing.medium,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    ...typography.subtitle,
    color: colors.text,
    fontWeight: "600",
  },
  activityMeta: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.xSmall,
  },
  activityDetail: {
    ...typography.body,
    color: colors.text,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xSmall / 2,
    borderRadius: 4,
    marginTop: spacing.xSmall,
  },
  statusText: {
    ...typography.caption,
    fontWeight: "600",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.medium,
  },
  viewAllText: {
    ...typography.button,
    color: colors.primary,
    marginRight: spacing.xSmall,
  },
});

export default AdminDashboardScreen;
