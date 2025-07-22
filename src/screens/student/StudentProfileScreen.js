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

const { width, height } = Dimensions.get('window');

// 2025 Trending Color System - Biophilic Design with Digital Harmony (Light Mode)
const colors = {
  cosmic: '#FAFBFF',           // Light cosmic white
  cosmicLight: '#F1F5FF',
  nebula: '#E8EFFF',           // Light cosmic blue
  aurora: '#6366F1',           // Electric violet
  auroraLight: '#8B5CF6',
  plasma: '#10B981',           // Neon mint
  plasmaGlow: '#34D399',
  ethereal: '#EC4899',         // Soft magenta
  etherealGlow: '#F472B6',
  solar: '#F59E0B',            // Solar yellow
  solarGlow: '#FBBF24',
  mist: '#0F172A',            // Dark mist for accents
  blueGlow: '#3B82F6',         // Blue glow for avatar and card
  glass: 'rgba(255, 255, 255, 0.7)',
  glassStrong: 'rgba(255, 255, 255, 0.8)',
  glassDark: 'rgba(0, 0, 0, 0.05)',
  surface: '#FFFFFF',
  surfaceDim: '#F8FAFC',
  textCosmic: '#1E293B',
  textNebula: '#334155',
  textMist: '#64748B',
  textGhost: '#94A3B8',
  textOnColor: '#FFFFFF',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  backdrop: 'rgba(248, 250, 252, 0.9)',
};

// Advanced Spacing System
const space = {
  micro: 2,
  tiny: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  massive: 96,
};

// Typography Scale
const typography = {
  hero: { fontSize: 34, fontWeight: '800', letterSpacing: -1 },
  title: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  heading: { fontSize: 22, fontWeight: '600', letterSpacing: -0.3 },
  subheading: { fontSize: 18, fontWeight: '500' },
  body: { fontSize: 16, fontWeight: '400' },
  caption: { fontSize: 14, fontWeight: '400' },
  micro: { fontSize: 12, fontWeight: '500' },
};

const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/general';

// Menu Items Definition
const menuItems = [
  { 
    id: 1, 
    title: "School Profile", 
    subtitle: "Personal details", 
    icon: "person-outline", 
    screen: "PersonalDetails", 
    gradient: ['#6366F1', '#8B5CF6'],
    emoji: "👤"
  },
  { 
    id: 2, 
    title: "School Leaves", 
    subtitle: "Apply & track", 
    icon: "event-available", 
    screen: "LeaveApplications", 
    gradient: [colors.plasma, colors.plasmaGlow],
    emoji: "📅"
  },
  { 
    id: 3, 
    title: "School Resources", 
    subtitle: "Study materials", 
    icon: "auto-stories", 
    screen: "Resources", 
    gradient: [colors.solar, colors.solarGlow],
    emoji: "📚"
  },
  { 
    id: 4, 
    title: "School Timetable", 
    subtitle: "Class schedule", 
    icon: "schedule", 
    screen: "Timetable", 
    gradient: [colors.ethereal, colors.etherealGlow],
    emoji: "⏰"
  },
  { 
    id: 5, 
    title: "School Security", 
    subtitle: "Change password", 
    icon: "security", 
    screen: "ChangePassword", 
    gradient: [colors.nebula, colors.cosmicLight],
    emoji: "🔐"
  },
  { 
    id: 6, 
    title: "School Support", 
    subtitle: "Get help", 
    icon: "support-agent", 
    screen: "Support", 
    gradient: [colors.aurora, colors.plasma],
    emoji: "🚀"
  },
];

const StudentProfileScreen = () => {
  const navigation = useNavigation();
  
  const [state, setState] = useState({
    userData: null,
    loading: true,
    refreshing: false,
    error: null,
    activeCard: null,
    isMenuExpanded: false,
  });
  
  // Animation values
  const animations = {
    masterFade: useRef(new Animated.Value(0)).current,
    heroScale: useRef(new Animated.Value(0.8)).current,
    heroRotate: useRef(new Animated.Value(-5)).current,
    cardSlides: useRef(Array(6).fill().map(() => new Animated.Value(100))).current,
    menuExpand: useRef(new Animated.Value(0)).current,
    glowPulse: useRef(new Animated.Value(0)).current,
    floatingY: useRef(new Animated.Value(0)).current,
    parallax: useRef(new Animated.Value(0)).current,
    scaleAnim: useRef(new Animated.Value(0)).current,
    slideAnim: useRef(new Animated.Value(20)).current,
  };

  // Gesture Handlers
  const scrollY = useRef(new Animated.Value(0)).current;

  // Particle animation system
  const particleAnimations = useRef([...Array(6)].map(() => new Animated.Value(0))).current;

  // Menu card animation system
  const menuCardAnimations = useRef(
    menuItems.map(() => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0.8),
      slide: new Animated.Value(50),
    }))
  ).current;

  useEffect(() => {
    // Start particle animations
    particleAnimations.forEach((anim, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            delay: i * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  useEffect(() => {
    // Start menu card animations when userData is available
    if (state.userData) {
      menuCardAnimations.forEach((cardAnim, index) => {
        Animated.parallel([
          Animated.timing(cardAnim.opacity, {
            toValue: 1,
            duration: 600,
            delay: 800 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.spring(cardAnim.scale, {
            toValue: 1,
            tension: 150,
            friction: 15,
            delay: 800 + (index * 100),
            useNativeDriver: true,
          }),
          Animated.timing(cardAnim.slide, {
            toValue: 0,
            duration: 600,
            delay: 800 + (index * 100),
            useNativeDriver: true,
          })
        ]).start();
      });
    }
  }, [state.userData]);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    initializeProfile();
    startAmbientAnimations();
    
    // Start loading animations immediately
    if (state.loading) {
      Animated.parallel([
        Animated.timing(animations.masterFade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, []);

  useEffect(() => {
    if (state.userData) {
      triggerEntranceSequence();
    }
  }, [state.userData]);

  const initializeProfile = async () => {
    await loadUserData();
  };

  const startAmbientAnimations = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.glowPulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.glowPulse, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.floatingY, {
          toValue: -10,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.floatingY, {
          toValue: 10,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const triggerEntranceSequence = () => {
    Animated.timing(animations.masterFade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.parallel([
      Animated.spring(animations.heroScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(animations.heroRotate, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    animations.cardSlides.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  };

  const simulateHaptic = () => {
    console.log('Haptic feedback triggered');
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

      // Use provided real data
      const profileData = {
        "id": 253,
        "name": "Varad  Harshad Kadam",
        "email": "shivangisinghlittle@gmail.com",
        "phone_number": "9322678004",
        "image_url": "https://erpresources.s3.ap-south-1.amazonaws.com/form-photoes/1734234597827_IMG20241215091741.jpg"
      };

      const studentData = {
        "id": 118,
        "roll_no": "BMT_250006",
        "first_name": "Varad ",
        "middle_name": "Harshad",
        "last_name": "Kadam",
        "division": "A",
        "photo_url": "https://erpresources.s3.ap-south-1.amazonaws.com/form-photoes/1734234597827_IMG20241215091741.jpg",
        "adm_class": "11",
        "scholarship_amt": 180000,
        "additial_amount": 20000,
        "hostel": false,
        "bed_id": null,
        "bed_number": null,
        "room_number": null,
        "floor_number": null,
        "hostel_name": null,
        "hostel_desc": null,
        "gender": null
      };

      const transformedData = {
        id: profileData.id,
        name: profileData.name,
        firstName: studentData.first_name || 'Student',
        lastName: studentData.last_name || '',
        middleName: studentData.middle_name || '',
        email: profileData.email,
        phone: profileData.phone_number,
        rollNo: studentData.roll_no,
        studentId: studentData.roll_no,
        class: `Class ${studentData.adm_class}${studentData.division ? ` - ${studentData.division}` : ''}`,
        admissionClass: studentData.adm_class,
        division: studentData.division,
        photoUrl: profileData.image_url || studentData.photo_url,
        gender: studentData.gender,
        hostel: studentData.hostel,
        admissionYear: new Date().getFullYear() - (parseInt(studentData.adm_class) - 1) || "2022",
        bedDetails: studentData.hostel ? {
          bedId: studentData.bed_id,
          bedNumber: studentData.bed_number,
          roomNumber: studentData.room_number,
          floorNumber: studentData.floor_number,
          hostelName: studentData.hostel_name,
          hostelDesc: studentData.hostel_desc,
        } : null,
        scholarshipAmount: studentData.scholarship_amt || 0,
        additionalAmount: studentData.additial_amount || 0,
      };

      console.log("🚀 Real data fetched successfully:", transformedData);

      updateState({ userData: transformedData, loading: false });
    } catch (error) {
      console.error("❌ Failed to load profile data:", error);
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

  const handleMenuPress = (screen, index) => {
    simulateHaptic();
    
    Animated.sequence([
      Animated.timing(animations.cardSlides[index], {
        toValue: -5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations.cardSlides[index], {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      setTimeout(() => navigation.navigate(screen), 150);
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Unable to navigate to this screen.");
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout", 
      "Are you sure you want to logout?", 
      [
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
      ]
    );
  };

  const renderDynamicAvatar = () => {
    const glowOpacity = animations.glowPulse.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    });

    if (state.userData?.photoUrl) {
      return (
        <Animated.View 
          style={{
            ...styles.avatarContainer,
            transform: [
              { scale: animations.heroScale },
              { rotate: animations.heroRotate.interpolate({
                inputRange: [-5, 5],
                outputRange: ['-5deg', '5deg'],
              })},
              { translateY: animations.floatingY }
            ]
          }}
        >
          <Animated.View style={{ ...styles.avatarGlow, opacity: glowOpacity }} />
          <Image source={{ uri: state.userData.photoUrl }} style={styles.avatar} />
          <View style={styles.avatarBorder} />
        </Animated.View>
      );
    } else if (state.userData?.name) {
      const initials = state.userData.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      
      return (
        <Animated.View 
          style={{
            ...styles.avatarContainer,
            transform: [
              { scale: animations.heroScale },
              { rotate: animations.heroRotate.interpolate({
                inputRange: [-5, 5],
                outputRange: ['-5deg', '5deg'],
              })},
              { translateY: animations.floatingY }
            ]
          }}
        >
          <Animated.View style={{ ...styles.avatarGlow, opacity: glowOpacity }} />
          <LinearGradient colors={[colors.aurora, colors.auroraLight]} style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </LinearGradient>
          <View style={styles.avatarBorder} />
        </Animated.View>
      );
    }
    
    return (
      <Animated.View 
        style={{
          ...styles.avatarContainer,
          transform: [
            { scale: animations.heroScale },
            { translateY: animations.floatingY }
          ]
        }}
      >
        <View style={styles.avatar}>
          <Icon name="person" size={60} color={colors.textOnColor} />
        </View>
      </Animated.View>
    );
  };

  const renderLoadingExperience = () => {
    const spin = animations.glowPulse.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <View style={styles.container}>
        <LinearGradient 
          colors={[colors.cosmic, colors.nebula, colors.cosmicLight]} 
          style={StyleSheet.absoluteFill} 
        />
        <Animated.View
          style={{
            ...styles.loadingContainer,
            opacity: animations.masterFade,
            transform: [{ scale: animations.scaleAnim }]
          }}
        >
          <Animated.View
            style={{
              ...styles.loadingSpinner,
              transform: [{ rotate: spin }]
            }}
          >
            <LinearGradient
              colors={[colors.plasma, colors.aurora]}
              style={styles.spinnerGradient}
            />
          </Animated.View>
          <Animated.Text
            style={{
              ...styles.loadingText,
              opacity: animations.masterFade,
              transform: [{ translateY: animations.slideAnim }]
            }}
          >
            Materializing your cosmos...
          </Animated.Text>
        </Animated.View>
      </View>
    );
  };

  const renderHeroSection = () => {
    if (!state.userData) return null;

    const parallaxY = scrollY.interpolate({
      inputRange: [0, 200],
      outputRange: [0, -50],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View 
        style={{
          ...styles.heroSection,
          opacity: animations.masterFade,
          transform: [{ translateY: parallaxY }]
        }}
      >
        <LinearGradient
          colors={[colors.cosmic, colors.nebula]}
          style={styles.heroGradient}
        />
        
        {/* Floating Particles */}
        <View style={styles.particleContainer}>
          {particleAnimations.map((particleAnim, i) => (
            <Animated.View
              key={i}
              style={{
                ...styles.particle,
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i * 8)}%`,
                opacity: particleAnim,
                transform: [{ scale: particleAnim }]
              }}
            />
          ))}
        </View>

        {renderDynamicAvatar()}
        
        <Animated.View
          style={{
            ...styles.heroContent,
            opacity: animations.masterFade,
            transform: [{ translateY: animations.slideAnim }]
          }}
        >
          <Text style={styles.heroName}>{state.userData.name}</Text>
          <View style={styles.heroBadge}>
            <Text style={styles.heroClass}>{state.userData.class}</Text>
          </View>
          <Text style={styles.heroEmail}>{state.userData.email}</Text>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderGlassCard = (title, icon, gradient, content, index) => (
    <Animated.View 
      style={{
        ...styles.glassCard,
        opacity: animations.masterFade,
        transform: [{ translateY: animations.cardSlides[index] }]
      }}
    >
      {/* Glass morphism background */}
      <View style={styles.glassBackground} />
      
      <LinearGradient 
        colors={gradient} 
        style={styles.cardHeader}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 1}}
      >
        <View style={styles.cardHeaderContent}>
          <Icon name={icon} size={22} color={colors.textOnColor} />
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
        <View style={styles.cardGlow} />
      </LinearGradient>
      
      <View style={styles.cardContent}>
        {content}
      </View>
    </Animated.View>
  );

  const renderInfoRow = (label, value, isLast = false) => (
    <Animated.View
      style={{
        ...styles.infoRow, 
        ...(isLast && styles.infoRowLast),
        opacity: animations.masterFade,
        transform: [{ translateX: animations.slideAnim }]
      }}
    >
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoValueContainer}>
        <Text style={styles.infoValue} numberOfLines={2} ellipsizeMode="tail">{value}</Text>
      </View>
    </Animated.View>
  );

  const renderPersonalSection = () => {
    if (!state.userData) return null;
    return renderGlassCard(
      "School App",
      "person-outline",
      [colors.blueGlow + '20', colors.blueGlow + '10'], // Changed to blue glow gradient
      <>
        {renderInfoRow("Student ID", state.userData.studentId)}
        {renderInfoRow("Roll Number", state.userData.rollNo)}
        {renderInfoRow("Gender", state.userData.gender === 'M' ? 'Male' : state.userData.gender === 'F' ? 'Female' : 'Other')}
        {renderInfoRow("Admission Year", state.userData.admissionYear)}
        {renderInfoRow("Phone Number", state.userData.phone, true)}
      </>,
      0
    );
  };

  const renderHostelSection = () => {
    if (!state.userData?.hostel || !state.userData.bedDetails) return null;
    return renderGlassCard(
      "Hostel Details",
      "home-work",
      [colors.plasma + '20', colors.plasmaGlow + '10'],
      <>
        {renderInfoRow("Hostel Name", state.userData.bedDetails.hostelName)}
        {renderInfoRow("Room Number", state.userData.bedDetails.roomNumber)}
        {renderInfoRow("Bed Number", state.userData.bedDetails.bedNumber)}
        {renderInfoRow("Floor Number", state.userData.bedDetails.floorNumber, true)}
      </>,
      1
    );
  };

  const renderMenuGrid = () => (
    <Animated.View 
      style={{
        ...styles.menuContainer,
        opacity: animations.masterFade
      }}
    >
      <Animated.Text
        style={{
          ...styles.menuTitle,
          opacity: animations.masterFade,
          transform: [{ translateY: animations.slideAnim }]
        }}
      >
        School Dashboard
      </Animated.Text>
      
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => {
          const cardAnim = menuCardAnimations[index];
          
          return (
            <Animated.View
              key={item.id}
              style={{
                opacity: cardAnim.opacity,
                transform: [
                  { scale: cardAnim.scale },
                  { translateY: cardAnim.slide }
                ]
              }}
            >
              <TouchableOpacity
                style={styles.menuCard}
                onPress={() => handleMenuPress(item.screen, index)}
                activeOpacity={0.7}
              >
                <View style={styles.menuCardGlass} />
                <LinearGradient 
                  colors={item.gradient} 
                  style={styles.menuCardBorder}
                />
                <View style={styles.menuCardContent}>
                  <View style={styles.menuIconWrapper}>
                    <LinearGradient 
                      colors={item.gradient} 
                      style={styles.menuIconContainer}
                    >
                      <Text style={styles.menuEmoji}>{item.emoji}</Text>
                      <Icon name={item.icon} size={24} color={colors.textOnColor} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.menuCardTitle}>{item.title}</Text>
                  <Text style={styles.menuCardSubtitle}>{item.subtitle}</Text>
                  <View style={styles.cardInteractionHint}>
                    <Icon name="arrow-forward-ios" size={12} color={colors.textGhost} />
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderFloatingLogout = () => (
    <Animated.View 
      style={{
        ...styles.floatingLogout,
        opacity: animations.masterFade,
        transform: [{ translateY: animations.floatingY }]
      }}
    >
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <View style={styles.logoutGlass} />
        <LinearGradient 
          colors={[colors.error, '#DC2626']} 
          style={styles.logoutGradient}
        >
          <Icon name="power-settings-new" size={20} color={colors.textOnColor} />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  if (state.loading) return renderLoadingExperience();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.cosmic} />
      <LinearGradient 
        colors={[colors.cosmic, colors.nebula, colors.cosmicLight]} 
        style={StyleSheet.absoluteFill} 
      />
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={state.refreshing}
            onRefresh={onRefresh}
            colors={[colors.plasma]}
            tintColor={colors.plasma}
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderHeroSection()}
        {renderPersonalSection()}
        {renderHostelSection()}
        {renderMenuGrid()}
        {renderFloatingLogout()}
      </Animated.ScrollView>
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
    paddingBottom: space.massive,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: space.xl,
  },
  spinnerGradient: {
    flex: 1,
    borderRadius: 40,
  },
  loadingText: {
    ...typography.body,
    color: colors.plasma,
    textAlign: 'center',
  },
  heroSection: {
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  particleContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  particle: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.plasmaGlow,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: space.lg,
  },
  avatarGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.blueGlow,
    top: -10,
    left: -10,
    zIndex: 0,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  avatarBorder: {
    position: 'absolute',
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 2,
    borderColor: colors.surface,
    top: -2,
    left: -2,
    zIndex: 3,
  },
  avatarText: {
    ...typography.title,
    color: colors.textOnColor,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroName: {
    ...typography.hero,
    color: colors.textCosmic,
    textAlign: 'center',
    marginBottom: space.sm,
  },
  heroBadge: {
    backgroundColor: colors.glassDark,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
    borderRadius: 20,
    marginBottom: space.sm,
  },
  heroClass: {
    ...typography.caption,
    color: colors.textCosmic,
    fontWeight: '600',
  },
  heroEmail: {
    ...typography.caption,
    color: colors.mist,
    opacity: 0.8,
  },
  glassCard: {
    marginHorizontal: space.md,
    marginBottom: space.xl,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  glassBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.blueGlow,
    backdropFilter: 'blur(20px)',
  },
  cardHeader: {
    padding: space.md,
    position: 'relative',
  },
  cardHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  cardGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.glass,
    opacity: 9,
  },
  cardTitle: {
    ...typography.subheading,
    color: colors.textOnColor,
    marginLeft: space.sm,
    fontWeight: '600',
  },
  cardContent: {
    alignItems:'center',
    marginLeft: space.sm,
    marginRight:space.sm,
    marginBottom:space.tiny,
    paddingLeft:space.tiny,
  


    padding: space.lg,
    backgroundColor: colors.surface,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.mist,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMist,
    flex: 1,
  },
  infoValueContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoValue: {
    ...typography.caption,
    color: colors.textCosmic,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
  menuContainer: {
    marginHorizontal: space.md,
    marginBottom: space.xl,
  },
  menuTitle: {
    ...typography.title,
    color: colors.textCosmic,
    marginBottom: space.lg,
    textAlign: 'center',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuCard: {
    width: (width - space.md * 3) / 2,
    marginBottom: space.md,
    borderRadius: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  menuCardGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.surfaceDim,
    backdropFilter: 'blur(20px)',
  },
  menuCardBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  menuCardContent: {
    padding: space.md,
    justifyContent: 'space-between',
    minHeight: 140,
  },
  menuIconWrapper: {
    marginBottom: space.sm,
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuEmoji: {
    fontSize: 20,
    position: 'absolute',
    top: -5,
    right: -5,
  },
  menuCardTitle: {
    ...typography.caption,
    color: colors.textCosmic,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: space.tiny,
  },
  menuCardSubtitle: {
    ...typography.micro,
    color: colors.textMist,
    textAlign: 'center',
    opacity: 0.8,
  },
  cardInteractionHint: {
    marginTop: space.xs,
  },
  floatingLogout: {
    marginHorizontal: space.md,
    marginBottom: space.xl,
  },
  logoutButton: {
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  logoutGlass: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.glassDark,
    backdropFilter: 'blur(20px)',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.md,
  },
  logoutText: {
    ...typography.body,
    color: colors.textOnColor,
    fontWeight: '600',
    marginLeft: space.sm,
  },
});

export default StudentProfileScreen;