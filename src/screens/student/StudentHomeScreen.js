import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/common/Header";

const { width, height } = Dimensions.get('window');

// Enhanced Modern Theme
const colors = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  primaryDark: '#1e3a8a',
  accent: '#06b6d4',
  white: '#ffffff',
  textLight: '#64748b',
  text: '#0f172a',
  background: '#f8fafc',
  cardBg: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  purple: '#8b5cf6',
  pink: '#ec4899',
  orange: '#f97316',
  emerald: '#059669',
  rose: '#e11d48',
  indigo: '#6366f1',
  teal: '#14b8a6',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/general';

const StudentHomeScreen = () => {
  // State Management
  const [state, setState] = useState({
    userData: null,
    loading: true,
    refreshing: false,
    announcements: [],
    profileImage: null,
    error: null,
  });

  // Animation References
  const animations = {
    fadeAnim: useRef(new Animated.Value(0)).current,
    slideAnim: useRef(new Animated.Value(50)).current,
    shimmer: useRef(new Animated.Value(0)).current,
    pulse: useRef(new Animated.Value(1)).current,
    cardStagger: useRef(new Animated.Value(0)).current,
    floatingElements: useRef(new Animated.Value(0)).current,
    quickActionsAnim: useRef(new Animated.Value(0)).current,
  };

  // Update state helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    if (state.userData) {
      startAnimations();
    }
  }, [state.userData]);

  const initializeScreen = async () => {
    await Promise.all([
      loadUserData(),
      loadAnnouncements(),
      loadProfileImage()
    ]);
  };

  const startAnimations = () => {
    console.log("Starting enhanced home screen animations...");
    
    // Main content animations
    Animated.parallel([
      Animated.timing(animations.fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(animations.slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 100,
      }),
    ]).start();

    // Continuous shimmer animation
    const continuousShimmer = () => {
      animations.shimmer.setValue(0);
      Animated.timing(animations.shimmer, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(continuousShimmer, 300);
      });
    };
    continuousShimmer();

    // Staggered card animations
    setTimeout(() => {
      Animated.timing(animations.cardStagger, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Quick actions animation
    setTimeout(() => {
      Animated.timing(animations.quickActionsAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 600);

    // Floating elements animation
    const floatingLoop = () => {
      Animated.sequence([
        Animated.timing(animations.floatingElements, {
          toValue: 1,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.floatingElements, {
          toValue: 0,
          duration: 6000,
          useNativeDriver: true,
        }),
      ]).start(floatingLoop);
    };
    floatingLoop();

    // Pulse animation for interactive elements
    const pulseLoop = () => {
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.03,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(pulseLoop);
    };
    pulseLoop();
    
    console.log("All enhanced animations started successfully");
  };

  // API Helper Functions
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
        updateState({ userData: getDemoUserData(), loading: false });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student`, {
        method: 'GET',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        updateState({
          userData: {
            name: `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim(),
            firstName: data.first_name || 'Student',
            rollNo: data.roll_no || 'N/A',
            class: data.adm_class || 'N/A',
            division: data.division || '',
            scholarshipAmt: data.scholarship_amt || 0,
            additionalAmt: data.additional_amount || 0,
            hostel: data.hostel,
            photoUrl: data.photo_url,
          },
          loading: false
        });
      } else {
        updateState({ userData: getDemoUserData(), loading: false });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      updateState({ userData: getDemoUserData(), loading: false });
    }
  };

  const getDemoUserData = () => ({
    name: "Demo Student",
    firstName: "Demo",
    rollNo: "12345",
    class: "10th",
    division: "A",
    scholarshipAmt: 5000,
    additionalAmt: 1000,
  });

  const loadAnnouncements = async () => {
    try {
      const headers = await getAuthHeaders();
      if (!headers) {
        updateState({ announcements: getDemoAnnouncements() });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'GET',
        headers,
      });
      
      console.log("Announcements API response status:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Announcements API data:", data);
        
        let announcementList = [];
        
        if (Array.isArray(data)) {
          // Transform API data to match our component structure
          announcementList = data.map((item, index) => ({
            id: item.id || index + 1,
            title: item.subject || `Announcement ${index + 1}`,
            content: item.body || 'No content available',
            date: item.created_at || new Date().toISOString(),
            priority: item.audience === 'Everyone' ? 'high' : 'medium',
            audience: item.audience || 'Students'
          }));
          
          console.log("Transformed announcements:", announcementList);
        } else if (data && typeof data === 'object') {
          const possibleKeys = ['announcements', 'data', 'items', 'results', 'content', 'list'];
          for (const key of possibleKeys) {
            if (data[key] && Array.isArray(data[key])) {
              announcementList = data[key].map((item, index) => ({
                id: item.id || index + 1,
                title: item.subject || `Announcement ${index + 1}`,
                content: item.body || 'No content available',
                date: item.created_at || new Date().toISOString(),
                priority: item.audience === 'Everyone' ? 'high' : 'medium',
                audience: item.audience || 'Students'
              }));
              break;
            }
          }
        }
        
        updateState({ 
          announcements: announcementList.length > 0 ? announcementList : getDemoAnnouncements() 
        });
      } else {
        console.log("Announcements API failed, using demo data");
        updateState({ announcements: getDemoAnnouncements() });
      }
    } catch (error) {
      console.error("Announcements loading error:", error);
      updateState({ announcements: getDemoAnnouncements() });
    }
  };

  const getDemoAnnouncements = () => [
    {
      id: 1,
      title: "🎓 ERP System Launch",
      content: "Hello Everyone, the management is glad to announce that we are soon launching an ERP system for our institute. It will streamline all the processes, reduce paper work and all information will be available at our fingertips.",
      date: new Date().toISOString(),
      priority: "high",
      audience: "Everyone"
    },
    {
      id: 2,
      title: "📚 Library Hours Extended",
      content: "The library will now be open from 8 AM to 10 PM on weekdays to help students with their studies.",
      date: new Date(Date.now() - 86400000).toISOString(),
      priority: "medium",
      audience: "Students"
    },
    {
      id: 3,
      title: "🏆 Sports Day Registration",
      content: "Annual sports day registration is now open. Please contact the sports department for more details.",
      date: new Date(Date.now() - 172800000).toISOString(),
      priority: "low",
      audience: "Students"
    }
  ];

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        updateState({ profileImage: savedImage });
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    updateState({ refreshing: true });
    await Promise.all([loadUserData(), loadAnnouncements()]);
    updateState({ refreshing: false });
  }, []);

  const handleEditProfile = () => {
    Alert.alert(
      "Edit Profile Picture",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Remove Photo", onPress: removePhoto, style: "destructive" },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        updateState({ profileImage: imageUri });
        await AsyncStorage.setItem('profileImage', imageUri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Could not open camera");
    }
  };

  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        updateState({ profileImage: imageUri });
        await AsyncStorage.setItem('profileImage', imageUri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Could not open gallery");
    }
  };

  const removePhoto = async () => {
    updateState({ profileImage: null });
    await AsyncStorage.removeItem('profileImage');
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return colors.error;
      case 'medium': return colors.warning;
      case 'low': return colors.success;
      default: return colors.primary;
    }
  };

  // Component Renderers
  const renderFloatingDecorations = () => (
    <View style={styles.floatingDecorations}>
      {/* Enhanced floating elements */}
      <Animated.View 
        style={[
          styles.floatingCircle, 
          styles.circle1,
          {
            transform: [{
              translateY: animations.floatingElements.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -20]
              })
            }, {
              rotate: animations.floatingElements.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }
        ]}
      />
      <Animated.View 
        style={[
          styles.floatingCircle, 
          styles.circle2,
          {
            transform: [{
              translateX: animations.floatingElements.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 15]
              })
            }, {
              scale: animations.floatingElements.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.2, 1]
              })
            }]
          }
        ]}
      />
      <Animated.View 
        style={[
          styles.floatingCircle, 
          styles.circle3,
          {
            transform: [{
              rotate: animations.floatingElements.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-180deg']
              })
            }]
          }
        ]}
      />
      
      {/* Geometric patterns */}
      <View style={styles.geometricPattern}>
        <Animated.View 
          style={[
            styles.diamond, 
            styles.diamond1,
            {
              transform: [{
                rotate: animations.floatingElements.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['45deg', '225deg']
                })
              }]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.diamond, 
            styles.diamond2,
            {
              transform: [{
                scale: animations.pulse.interpolate({
                  inputRange: [1, 1.03],
                  outputRange: [1, 1.3]
                })
              }]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.diamond, 
            styles.diamond3,
            {
              opacity: animations.floatingElements.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [0.3, 0.8, 0.3]
              })
            }
          ]}
        />
      </View>
    </View>
  );

  const renderAvatar = () => {
    if (state.profileImage) {
      return (
        <Image
          source={{ uri: state.profileImage }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    } else if (state.userData?.photoUrl) {
      return (
        <Image
          source={{ uri: state.userData.photoUrl }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    } else {
      return (
        <View style={styles.defaultAvatar}>
          <Icon name="person" size={55} color={colors.primary} />
        </View>
      );
    }
  };

  const renderLoadingScreen = () => (
    <SafeAreaView style={styles.container}>
      <Header title="Dashboard" />
      {renderFloatingDecorations()}
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          style={styles.loadingIcon}
        >
          <Animated.View style={{
            transform: [{
              rotate: animations.shimmer.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }}>
            <Icon name="dashboard" size={40} color={colors.white} />
          </Animated.View>
        </LinearGradient>
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    </SafeAreaView>
  );

  const renderEnhancedProfileCard = () => {
    if (!state.userData) return null;

    return (
      <Animated.View style={[styles.profileContainer, { 
        opacity: animations.fadeAnim,
        transform: [{ translateY: animations.slideAnim }]
      }]}>
        <View style={styles.profileCard3D}>
          <LinearGradient
            colors={['#1e3a8a', '#1e40af', '#3b82f6', '#06b6d4']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Enhanced Continuous Shimmer */}
            <Animated.View
              style={[
                styles.shimmerEffect,
                {
                  transform: [{
                    translateX: animations.shimmer.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width * 0.8, width * 1.2]
                    })
                  }]
                }
              ]}
            />
            
            <Animated.View
              style={[
                styles.shimmerEffect2,
                {
                  transform: [{
                    translateX: animations.shimmer.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width * 1.2, width * 0.8]
                    })
                  }]
                }
              ]}
            />

            {/* Glowing background effects */}
            <Animated.View
              style={[
                styles.glowEffect1,
                {
                  opacity: animations.pulse.interpolate({
                    inputRange: [1, 1.03],
                    outputRange: [0.4, 0.8]
                  })
                }
              ]}
            />
            
            <Animated.View
              style={[
                styles.glowEffect2,
                {
                  opacity: animations.pulse.interpolate({
                    inputRange: [1, 1.03],
                    outputRange: [0.2, 0.6]
                  })
                }
              ]}
            />

            <View style={styles.profileContent}>
              {/* Institute Badge */}
              <View style={styles.instituteBadge}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                  style={styles.badgeIcon}
                >
                  <Icon name="school" size={16} color={colors.white} />
                </LinearGradient>
                <Text style={styles.badgeText}>Student Portal</Text>
              </View>

              {/* Avatar Section */}
              <View style={styles.avatarSection}>
                <Animated.View
                  style={[
                    styles.avatarContainer,
                    { transform: [{ scale: animations.fadeAnim }] }
                  ]}
                >
                  <View style={styles.avatarGlow}>
                    {renderAvatar()}
                  </View>
                  
                  {/* Enhanced Edit Button */}
                  <Animated.View
                    style={[
                      styles.editButton,
                      { transform: [{ scale: animations.pulse }] }
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.editButtonTouchable}
                      onPress={handleEditProfile}
                      activeOpacity={0.8}
                    >
                      <Icon name="edit" size={14} color={colors.white} />
                    </TouchableOpacity>
                  </Animated.View>
                </Animated.View>
                
                {/* Verification Badge */}
                <View style={styles.verificationBadge}>
                  <Icon name="verified" size={12} color={colors.primary} />
                </View>
              </View>

              {/* Profile Info */}
              <View style={styles.profileInfo}>
                <Text style={styles.welcomeMessage}>Welcome back,</Text>
                <Text style={styles.studentName}>
                  {state.userData.firstName || state.userData.name}
                </Text>
                <Text style={styles.rollNumber}>
                  Roll No: {state.userData.rollNo}
                </Text>
                <Text style={styles.classInfo}>
                  {state.userData.class}{state.userData.division && ` - ${state.userData.division}`}
                </Text>
              </View>

              {/* Quick Status */}
              <View style={styles.statusBar}>
                <View style={styles.statusItem}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Active</Text>
                </View>
                <View style={styles.statusDivider} />
                <View style={styles.statusItem}>
                  <Icon name="notifications" size={14} color={colors.white} />
                  <Text style={styles.statusText}>{state.announcements.length} Updates</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Animated.View>
    );
  };

  const renderQuickActions = () => (
    <Animated.View style={[styles.quickActionsContainer, { 
      opacity: animations.quickActionsAnim,
      transform: [{ translateY: animations.slideAnim }]
    }]}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsGrid}>
        {[
          { icon: 'assignment', title: 'Assignments', color: colors.purple },
          { icon: 'schedule', title: 'Timetable', color: colors.success },
          { icon: 'grade', title: 'Grades', color: colors.warning },
          { icon: 'library-books', title: 'Library', color: colors.teal },
        ].map((action, index) => (
          <Animated.View
            key={action.title}
            style={[
              styles.actionCard,
              {
                transform: [{
                  scale: animations.quickActionsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }]
              }
            ]}
          >
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[action.color, `${action.color}CC`]}
                style={styles.actionIcon}
              >
                <Icon name={action.icon} size={24} color={colors.white} />
              </LinearGradient>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderEnhancedAnnouncements = () => (
    <Animated.View 
      style={[
        styles.announcementsSection, 
        { 
          opacity: animations.cardStagger,
          transform: [{ translateY: animations.slideAnim }]
        }
      ]}
    >
      <View style={styles.sectionHeaderWithAction}>
        <View style={styles.sectionHeaderLeft}>
          <LinearGradient
            colors={[colors.orange, colors.rose]}
            style={styles.sectionIcon}
          >
            <Icon name="campaign" size={18} color={colors.white} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>Latest News</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>See All</Text>
          <Icon name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.announcementsContainer}>
        {state.announcements.slice(0, 3).map((announcement, index) => {
          const isHighPriority = announcement.priority === 'high';
          
          return (
            <Animated.View
              key={announcement.id || index}
              style={[
                styles.announcementCard,
                {
                  transform: [{
                    translateX: animations.cardStagger.interpolate({
                      inputRange: [0, 1],
                      outputRange: [index % 2 === 0 ? -100 : 100, 0]
                    })
                  }]
                }
              ]}
            >
              <TouchableOpacity 
                style={[
                  styles.announcementContent,
                  isHighPriority && styles.highPriorityCard
                ]}
                activeOpacity={0.9}
              >
                {isHighPriority ? (
                  <LinearGradient
                    colors={[colors.error, colors.rose]}
                    style={styles.announcementGradient}
                  >
                    <View style={styles.announcementHeader}>
                      <View style={styles.priorityBadge}>
                        <Icon name="priority-high" size={12} color={colors.white} />
                        <Text style={styles.priorityBadgeText}>URGENT</Text>
                      </View>
                    </View>
                    <Text style={[styles.announcementTitle, styles.whiteText]} numberOfLines={2}>
                      {announcement.title}
                    </Text>
                    <Text style={[styles.announcementText, styles.whiteText]} numberOfLines={2}>
                      {announcement.content}
                    </Text>
                    <Text style={[styles.announcementDate, styles.whiteTextMuted]}>
                      {formatDate(announcement.date)}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.normalAnnouncementContent}>
                    <View style={[styles.priorityStripe, { backgroundColor: getPriorityColor(announcement.priority) }]} />
                    <View style={styles.announcementMain}>
                      <View style={styles.announcementHeader}>
                        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(announcement.priority) }]} />
                      </View>
                      <Text style={styles.announcementTitle} numberOfLines={2}>
                        {announcement.title}
                      </Text>
                      <Text style={styles.announcementText} numberOfLines={2}>
                        {announcement.content}
                      </Text>
                      <View style={styles.announcementFooter}>
                        <Text style={styles.announcementDate}>
                          {formatDate(announcement.date)}
                        </Text>
                        <View style={[styles.priorityChip, { backgroundColor: getPriorityColor(announcement.priority) }]}>
                          <Text style={styles.priorityChipText}>
                            {announcement.priority?.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );

  const renderFinancialOverview = () => {
    if (!state.userData || (state.userData.scholarshipAmt <= 0 && state.userData.additionalAmt <= 0)) {
      return null;
    }

    return (
      <Animated.View 
        style={[
          styles.financialSection, 
          { 
            opacity: animations.cardStagger,
            transform: [{ translateY: animations.slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeaderLeft}>
          <LinearGradient
            colors={[colors.success, colors.emerald]}
            style={styles.sectionIcon}
          >
            <Icon name="account-balance-wallet" size={18} color={colors.white} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
        </View>

        <View style={styles.financialCards}>
          {state.userData.scholarshipAmt > 0 && (
            <View style={styles.financialCard}>
              <LinearGradient
                colors={[colors.success, colors.emerald]}
                style={styles.financialGradient}
              >
                <View style={styles.financialHeader}>
                  <Icon name="school" size={20} color={colors.white} />
                  <View style={styles.financialStatus}>
                    <Text style={styles.financialStatusText}>ACTIVE</Text>
                  </View>
                </View>
                <Text style={styles.financialAmount}>
                  ₹{state.userData.scholarshipAmt.toLocaleString()}
                </Text>
                <Text style={styles.financialLabel}>Scholarship Amount</Text>
              </LinearGradient>
            </View>
          )}
          
          {state.userData.additionalAmt > 0 && (
            <View style={styles.financialCard}>
              <LinearGradient
                colors={[colors.primaryLight, colors.accent]}
                style={styles.financialGradient}
              >
                <View style={styles.financialHeader}>
                  <Icon name="add-circle" size={20} color={colors.white} />
                  <View style={[styles.financialStatus, styles.pendingStatus]}>
                    <Text style={styles.financialStatusText}>PENDING</Text>
                  </View>
                </View>
                <Text style={styles.financialAmount}>
                  ₹{state.userData.additionalAmt.toLocaleString()}
                </Text>
                <Text style={styles.financialLabel}>Additional Amount</Text>
              </LinearGradient>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  // Main Render
  if (state.loading) {
    return renderLoadingScreen();
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <Header title="Dashboard" />
      
      {/* Enhanced Floating Decorations */}
      {renderFloatingDecorations()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={state.refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.white}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Enhanced Profile Card */}
        {renderEnhancedProfileCard()}

        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Enhanced Announcements */}
        {renderEnhancedAnnouncements()}

        {/* Financial Overview */}
        {renderFinancialOverview()}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  // Enhanced Floating Decorations
  floatingDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  floatingCircle: {
    position: 'absolute',
    borderRadius: 50,
  },
  circle1: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(30, 64, 175, 0.06)',
    top: 120,
    right: -30,
    borderWidth: 2,
    borderColor: 'rgba(30, 64, 175, 0.1)',
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(6, 182, 212, 0.06)',
    top: 350,
    left: -25,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.1)',
  },
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.06)',
    bottom: 200,
    right: 20,
  },
  geometricPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  diamond: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'rgba(30, 64, 175, 0.08)',
    transform: [{ rotate: '45deg' }],
  },
  diamond1: {
    top: 280,
    left: width * 0.1,
  },
  diamond2: {
    bottom: 250,
    right: width * 0.15,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  diamond3: {
    top: 450,
    left: width * 0.8,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    width: 20,
    height: 20,
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    zIndex: 2,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: 20,
    letterSpacing: 0.5,
  },

  // Scroll View
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },

  // Enhanced Profile Card (Smaller Size)
  profileContainer: {
    marginBottom: spacing.xxl,
  },
  profileCard3D: {
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    transform: [
      { perspective: 1000 },
      { rotateX: '1deg' },
      { rotateY: '-0.5deg' }
    ],
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 280, // Reduced from 350 to 280
  },
  
  // Enhanced Continuous Shimmer Effects
  shimmerEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ skewX: '-25deg' }],
    zIndex: 5,
  },
  shimmerEffect2: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '20deg' }],
    zIndex: 4,
  },
  glowEffect1: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 3,
  },
  glowEffect2: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 3,
  },

  profileContent: {
    padding: spacing.xxl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
    zIndex: 10,
    alignItems: 'center',
  },
  instituteBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  badgeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  avatarSection: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    padding: 4,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarGlow: {
    borderRadius: 51,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: colors.white,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  avatarImage: {
    width: 100, // Reduced from 130 to 100
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.white,
    resizeMode: 'cover',
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
  },
  editButton: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  editButtonTouchable: {
    backgroundColor: colors.rose,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: colors.white,
  },
  verificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 3,
    elevation: 4,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  welcomeMessage: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  studentName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.white,
    marginBottom: 6,
    letterSpacing: 0.3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  rollNumber: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  classInfo: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textAlign: 'center',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 11,
    color: colors.white,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: spacing.md,
  },

  // Quick Actions
  quickActionsContainer: {
    marginBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: spacing.lg,
    letterSpacing: 0.2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  actionCard: {
    width: (width - spacing.xl * 2 - spacing.md) / 2,
  },
  actionButton: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },

  // Enhanced Announcements
  announcementsSection: {
    marginBottom: spacing.xxl,
  },
  sectionHeaderWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray50,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 4,
  },
  announcementsContainer: {
    gap: spacing.md,
  },
  announcementCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  announcementContent: {
    backgroundColor: colors.white,
  },
  highPriorityCard: {
    elevation: 6,
    shadowColor: colors.error,
    shadowOpacity: 0.2,
  },
  announcementGradient: {
    padding: spacing.lg,
  },
  normalAnnouncementContent: {
    position: 'relative',
  },
  priorityStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  announcementMain: {
    padding: spacing.lg,
    paddingLeft: spacing.xl,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  priorityBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.white,
    marginLeft: 2,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },
  whiteText: {
    color: colors.white,
  },
  announcementText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 18,
    marginBottom: spacing.sm,
  },
  whiteTextMuted: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  announcementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  announcementDate: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '500',
  },
  priorityChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityChipText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.white,
  },

  // Financial Section
  financialSection: {
    marginBottom: spacing.xxl,
  },
  financialCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  financialCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  financialGradient: {
    padding: spacing.lg,
    minHeight: 120,
  },
  financialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  financialStatus: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  pendingStatus: {
    backgroundColor: 'rgba(255, 193, 7, 0.3)',
  },
  financialStatusText: {
    fontSize: 8,
    fontWeight: '800',
    color: colors.white,
  },
  financialAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.white,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  financialLabel: {
    fontSize: 11,
    color: colors.white,
    opacity: 0.9,
    fontWeight: '600',
  },

  // Bottom Spacing
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default StudentHomeScreen;