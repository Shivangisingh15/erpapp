// src/screens/student/StudentProfileScreen.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get('window');

// Trending Color Palette (Inspired by 2025 Dribbble Trends: Soft Gradients, Minimalism, Vibrant Accents)
const colors = {
  primary: '#4f46e5',      // Vibrant indigo for accents
  primaryLight: '#818cf8',
  primarySoft: '#eef2ff',
  secondary: '#06b6d4',    // Cyan for secondary elements
  secondaryLight: '#22d3ee',
  secondarySoft: '#cffafe',
  accent: '#f59e0b',       // Amber for highlights
  accentSoft: '#fef3c7',
  success: '#10b981',
  error: '#ef4444',
  neutral: '#6b7280',
  neutralLight: '#9ca3af',
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  backgroundStart: '#f8fafc',  // Soft gray-white
  backgroundEnd: '#e0e7ff',    // Subtle indigo tint
  surface: '#ffffff',
  border: '#e0e7ff',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/general';

const StudentProfileScreen = () => {
  const navigation = useNavigation();
  
  const [state, setState] = useState({
    userData: null,
    loading: true,
    refreshing: false,
    error: null,
  });
  
  // Smooth Entrance Animations (Trending: Subtle Springs for Modern Feel)
  const animations = {
    fadeAnim: useRef(new Animated.Value(0)).current,
    slideAnim: useRef(new Animated.Value(50)).current,
    scaleAnim: useRef(new Animated.Value(0.95)).current,
  };

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    initializeProfile();
  }, []);

  useEffect(() => {
    if (state.userData) {
      startAnimations();
    }
  }, [state.userData]);

  const initializeProfile = async () => {
    await loadUserData();
  };

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(animations.fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(animations.slideAnim, {
        toValue: 0,
        tension: 70,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.spring(animations.scaleAnim, {
        toValue: 1,
        tension: 90,
        friction: 11,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getAuthHeaders = async () => {
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      if (!tokensString) return null;
      
      const tokens = JSON.parse(tokensString);
      return {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error("Error getting auth headers:", error);
      return null;
    }
  };

  const loadUserData = async () => {
    try {
      updateState({ loading: true, error: null });
      
      const headers = await getAuthHeaders();
      if (!headers) {
        throw new Error("No authentication tokens");
      }

      const response = await fetch(`${API_BASE_URL}/student`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const transformedData = {
        id: data.id,
        name: `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim(),
        firstName: data.first_name || 'Student',
        lastName: data.last_name || '',
        middleName: data.middle_name || '',
        email: `${data.roll_no}@school.edu`,
        rollNo: data.roll_no,
        studentId: data.roll_no,
        class: `Class ${data.adm_class}${data.division ? ` - ${data.division}` : ''}`,
        admissionClass: data.adm_class,
        division: data.division,
        photoUrl: data.photo_url,
        gender: data.gender,
        hostel: data.hostel,
        admissionYear: new Date().getFullYear() - (parseInt(data.adm_class) - 1) || "2022",
        bedDetails: data.hostel ? {
          bedId: data.bed_id,
          bedNumber: data.bed_number,
          roomNumber: data.room_number,
          floorNumber: data.floor_number,
          hostelName: data.hostel_name,
          hostelDesc: data.hostel_desc,
        } : null,
        scholarshipAmount: data.scholarship_amt || 0,
        additionalAmount: data.additial_amount || 0,
      };

      updateState({ userData: transformedData, loading: false });
    } catch (error) {
      console.error("Failed to load profile data:", error);
      updateState({ 
        userData: null, 
        loading: false,
        error: "Failed to load profile data. Please try again.",
      });
    }
  };

  const onRefresh = useCallback(async () => {
    updateState({ refreshing: true });
    await loadUserData();
    updateState({ refreshing: false });
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
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

  const handleMenuPress = (screen) => {
    try {
      navigation.navigate(screen);
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Unable to navigate to this screen.");
    }
  };

  const menuItems = [
    { id: 1, title: "Personal Details", subtitle: "View & edit info", icon: "person", screen: "PersonalDetails", color: colors.primary, gradient: [colors.primary, colors.primaryLight] },
    { id: 2, title: "Leave Applications", subtitle: "Manage leaves", icon: "event-note", screen: "LeaveApplications", color: colors.secondary, gradient: [colors.secondary, colors.secondaryLight] },
    { id: 3, title: "Resources", subtitle: "Study materials", icon: "library-books", screen: "Resources", color: colors.accent, gradient: [colors.accent, colors.accentLight] },
    { id: 4, title: "Timetable", subtitle: "Class schedule", icon: "schedule", screen: "Timetable", color: colors.success, gradient: [colors.success, '#34d399'] },
    { id: 5, title: "Change Password", subtitle: "Update security", icon: "lock", screen: "ChangePassword", color: colors.neutral, gradient: [colors.neutral, colors.neutralLight] },
    { id: 6, title: "Support & Help", subtitle: "Get assistance", icon: "help-outline", screen: "Support", color: colors.primary, gradient: [colors.primary, colors.primaryLight] },
  ];

  const renderAvatar = () => {
    if (state.userData?.photoUrl) {
      return (
        <Image
          source={{ uri: state.userData.photoUrl }}
          style={styles.avatar}
          onError={() => console.log("Failed to load avatar")}
        />
      );
    } else if (state.userData?.name) {
      const initials = state.userData.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      return (
        <LinearGradient colors={[colors.primary, colors.primaryLight]} style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
      );
    } else {
      return (
        <View style={styles.avatar}>
          <Icon name="person" size={60} color={colors.surface} />
        </View>
      );
    }
  };

  const renderLoadingScreen = () => (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[colors.backgroundStart, colors.backgroundEnd]} style={StyleSheet.absoluteFill} />
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    </SafeAreaView>
  );

  const renderErrorMessage = () => {
    if (!state.error) return null;
    return (
      <Animated.View style={[styles.errorContainer, { opacity: animations.fadeAnim }]}>
        <Text style={styles.errorText}>{state.error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderProfileHero = () => {
    if (!state.userData) return null;
    return (
      <Animated.View 
        style={[
          styles.profileHero,
          {
            opacity: animations.fadeAnim,
            transform: [{ translateY: animations.slideAnim }, { scale: animations.scaleAnim }]
          }
        ]}
      >
        <View style={styles.avatarContainer}>
          {renderAvatar()}
        </View>
        <Text style={styles.studentName}>{state.userData.name}</Text>
        <Text style={styles.studentClass}>{state.userData.class}</Text>
        <Text style={styles.studentEmail}>{state.userData.email}</Text>
      </Animated.View>
    );
  };

  const renderSection = (title, icon, gradient, content) => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: animations.fadeAnim,
          transform: [{ translateY: animations.slideAnim }]
        }
      ]}
    >
      <LinearGradient colors={gradient} style={styles.sectionHeader} start={{x: 0, y: 0}} end={{x: 1, y: 0}}>
        <Icon name={icon} size={20} color={colors.surface} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </LinearGradient>
      <View style={styles.sectionContent}>
        {content}
      </View>
    </Animated.View>
  );

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderPersonalInfo = () => {
    if (!state.userData) return null;
    return renderSection(
      "Personal Info",
      "person-outline",
      [colors.primarySoft, colors.surface],
      <>
        {renderInfoRow("Student ID", state.userData.studentId)}
        {renderInfoRow("Roll Number", state.userData.rollNo)}
        {renderInfoRow("Gender", state.userData.gender === 'M' ? 'Male' : state.userData.gender === 'F' ? 'Female' : 'Other')}
        {renderInfoRow("Admission Year", state.userData.admissionYear)}
      </>
    );
  };

  const renderHostelInfo = () => {
    if (!state.userData?.hostel || !state.userData.bedDetails) return null;
    return renderSection(
      "Hostel Details",
      "home-work",
      [colors.secondarySoft, colors.surface],
      <>
        {renderInfoRow("Hostel Name", state.userData.bedDetails.hostelName)}
        {renderInfoRow("Room Number", state.userData.bedDetails.roomNumber)}
        {renderInfoRow("Bed Number", state.userData.bedDetails.bedNumber)}
        {renderInfoRow("Floor Number", state.userData.bedDetails.floorNumber)}
      </>
    );
  };

  const renderMenuGrid = () => (
    <Animated.View 
      style={[
        styles.menuGridContainer,
        {
          opacity: animations.fadeAnim,
          transform: [{ translateY: animations.slideAnim }]
        }
      ]}
    >
      <Text style={styles.menuTitle}>Quick Actions</Text>
      <View style={styles.menuGrid}>
        {menuItems.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuCard}
            onPress={() => handleMenuPress(item.screen)}
          >
            <LinearGradient colors={item.gradient} style={styles.menuIconContainer}>
              <Icon name={item.icon} size={28} color={colors.surface} />
            </LinearGradient>
            <Text style={styles.menuCardTitle}>{item.title}</Text>
            <Text style={styles.menuCardSubtitle}>{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderLogoutButton = () => (
    <Animated.View 
      style={[
        styles.logoutContainer,
        {
          opacity: animations.fadeAnim,
          transform: [{ translateY: animations.slideAnim }]
        }
      ]}
    >
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LinearGradient colors={[colors.error, colors.error]} start={{x: 0, y: 0}} end={{x: 1, y: 0}} style={styles.logoutGradient}>
          <Icon name="logout" size={20} color={colors.surface} />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (state.loading) return renderLoadingScreen();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundStart} />
      <LinearGradient colors={[colors.backgroundStart, colors.backgroundEnd]} style={StyleSheet.absoluteFill} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
      >
        {renderErrorMessage()}
        {renderProfileHero()}
        {renderPersonalInfo()}
        {renderHostelInfo()}
        {renderMenuGrid()}
        {renderLogoutButton()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xxxxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMuted,
  },
  errorContainer: {
    padding: spacing.lg,
    backgroundColor: colors.error + '20',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: 16,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.error,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  retryText: {
    color: colors.surface,
    fontWeight: '600',
  },
  profileHero: {
    alignItems: 'center',
    paddingTop: spacing.xxxxl,
    paddingBottom: spacing.xxl,
    marginHorizontal: spacing.lg,
  },
  avatarContainer: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderRadius: 80,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.surface,
  },
  studentName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  studentClass: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  studentEmail: {
    fontSize: 14,
    color: colors.textMuted,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: colors.neutral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.surface,
    marginLeft: spacing.md,
  },
  sectionContent: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  menuGridContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxl,
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.neutral,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  menuCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  menuCardSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  logoutContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  logoutButton: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
    marginLeft: spacing.sm,
  },
});

export default StudentProfileScreen;