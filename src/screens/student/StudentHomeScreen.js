import React, { useEffect, useState, useRef } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const StudentHomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [debugInfo, setDebugInfo] = useState(""); // For debugging

  // Animations
  const avatarScale = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const cardFadeIn = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log("=== StudentHomeScreen useEffect started ===");
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    console.log("Initializing screen...");
    await loadUserData();
    await loadAnnouncements();
    await loadProfileImage();
    startAnimations();
  };

  const startAnimations = () => {
    console.log("Starting animations...");
    
    // Avatar scale animation
    Animated.spring(avatarScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();

    // Card fade in animation
    Animated.timing(cardFadeIn, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Shimmer animation - SIMPLIFIED
    const shimmerLoop = () => {
      shimmerAnim.setValue(0);
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(shimmerLoop, 500);
      });
    };
    shimmerLoop();

    // Pulse animation for edit button
    const pulseLoop = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(pulseLoop);
    };
    pulseLoop();
  };

  const loadUserData = async () => {
    console.log("=== Loading user data ===");
    try {
      setLoading(true);
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      console.log("Tokens found:", !!tokensString);
      
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        console.log("Access token exists:", !!tokens.accessToken);
        
        const response = await fetch('https://erpbackend-gray.vercel.app/api/general/student', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        console.log("Student API response status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("Student API success:", data);
          setUserData({
            name: `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim(),
            firstName: data.first_name || 'Student',
            rollNo: data.roll_no || 'N/A',
            class: data.adm_class || 'N/A',
            division: data.division || '',
            scholarshipAmt: data.scholarship_amt || 0,
            additionalAmt: data.additional_amount || 0,
            hostel: data.hostel,
            photoUrl: data.photo_url,
          });
        } else {
          console.log("Student API failed, using fallback data");
          setUserData({ 
            name: "Demo Student",
            firstName: "Demo",
            rollNo: "12345",
            class: "10th",
            division: "A",
            scholarshipAmt: 5000,
            additionalAmt: 1000,
          });
        }
      } else {
        console.log("No tokens found, using demo data");
        setUserData({ 
          name: "Demo Student",
          firstName: "Demo",
          rollNo: "12345",
          class: "10th",
          division: "A",
          scholarshipAmt: 5000,
          additionalAmt: 1000,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      setUserData({ 
        name: "Demo Student",
        firstName: "Demo",
        rollNo: "12345",
        class: "10th",
        division: "A",
        scholarshipAmt: 5000,
        additionalAmt: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAnnouncements = async () => {
    console.log("=== Loading announcements ===");
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        console.log("Making announcements API call...");
        
        const response = await fetch('https://erpbackend-gray.vercel.app/api/general/announcements', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
        });
        
        console.log("Announcements API status:", response.status);
        const responseText = await response.text();
        console.log("Announcements API raw response:", responseText);
        
        if (response.ok && responseText) {
          try {
            const data = JSON.parse(responseText);
            console.log("Announcements API parsed data:", data);
            console.log("Data type:", typeof data);
            console.log("Is array:", Array.isArray(data));
            console.log("Data keys:", Object.keys(data || {}));
            
            let announcementList = [];
            
            // Try multiple possible data structures
            if (Array.isArray(data)) {
              announcementList = data;
              console.log("✅ Found array data, length:", data.length);
            } else if (data && typeof data === 'object') {
              // Check all possible nested properties
              const possibleKeys = ['announcements', 'data', 'items', 'results', 'content', 'list'];
              for (const key of possibleKeys) {
                if (data[key] && Array.isArray(data[key])) {
                  announcementList = data[key];
                  console.log(`✅ Found array in data.${key}, length:`, data[key].length);
                  break;
                }
              }
            }
            
            if (announcementList.length === 0) {
              console.log("❌ No announcements found in API response");
              // Set demo announcements
              announcementList = getDemoAnnouncements();
            }
            
            console.log("Final announcements to display:", announcementList);
            setAnnouncements(announcementList);
            setDebugInfo(`API Success: ${announcementList.length} announcements loaded`);
            
          } catch (parseError) {
            console.error("JSON parse error:", parseError);
            setAnnouncements(getDemoAnnouncements());
            setDebugInfo(`Parse Error: ${parseError.message}`);
          }
        } else {
          console.log("❌ API call failed or empty response");
          setAnnouncements(getDemoAnnouncements());
          setDebugInfo(`API Failed: Status ${response.status}`);
        }
      } else {
        console.log("❌ No tokens available");
        setAnnouncements(getDemoAnnouncements());
        setDebugInfo("No auth tokens found");
      }
    } catch (error) {
      console.error("Announcements loading error:", error);
      setAnnouncements(getDemoAnnouncements());
      setDebugInfo(`Error: ${error.message}`);
    }
  };

  const getDemoAnnouncements = () => {
    return [
      {
        id: 1,
        title: "🎓 Welcome to New Academic Year",
        content: "We welcome all students to the new academic year 2024-25. Please check your schedules and be prepared for classes starting next week.",
        date: new Date().toISOString(),
        priority: "high"
      },
      {
        id: 2,
        title: "📚 Library Hours Extended",
        content: "The library will now be open from 8 AM to 10 PM on weekdays to help students with their studies.",
        date: new Date(Date.now() - 86400000).toISOString(),
        priority: "medium"
      },
      {
        id: 3,
        title: "🏆 Sports Day Registration",
        content: "Annual sports day registration is now open. Please contact the sports department for more details.",
        date: new Date(Date.now() - 172800000).toISOString(),
        priority: "low"
      }
    ];
  };

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
        console.log("Profile image loaded from storage");
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  const onRefresh = async () => {
    console.log("=== Refreshing data ===");
    setRefreshing(true);
    await Promise.all([loadUserData(), loadAnnouncements()]);
    setRefreshing(false);
  };

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
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        console.log("Profile image saved from camera");
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
        setProfileImage(imageUri);
        await AsyncStorage.setItem('profileImage', imageUri);
        console.log("Profile image saved from gallery");
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Could not open gallery");
    }
  };

  const removePhoto = async () => {
    setProfileImage(null);
    await AsyncStorage.removeItem('profileImage');
    console.log("Profile image removed");
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
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
      case 'high': return '#F44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return colors.primary;
    }
  };

  const renderAvatar = () => {
    if (profileImage) {
      return (
        <Image
          source={{ uri: profileImage }}
          style={styles.avatarImage}
        />
      );
    } else if (userData?.photoUrl) {
      return (
        <Image
          source={{ uri: userData.photoUrl }}
          style={styles.avatarImage}
        />
      );
    } else {
      return (
        <View style={styles.defaultAvatar}>
          <Icon name="person" size={60} color="#6a11cb" />
        </View>
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Home" />
        <View style={styles.loadingContainer}>
          <Animated.View style={{
            transform: [{
              rotate: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })
            }]
          }}>
            <Icon name="refresh" size={40} color={colors.primary} />
          </Animated.View>
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <Header title="Dashboard" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Debug Info */}
        {debugInfo ? (
          <View style={styles.debugCard}>
            <Text style={styles.debugText}>Debug: {debugInfo}</Text>
            <Text style={styles.debugText}>Announcements: {announcements.length}</Text>
          </View>
        ) : null}

        {/* Enhanced Profile Card with Working Shimmer */}
        {userData && (
          <Animated.View style={[styles.profileCardContainer, { opacity: cardFadeIn }]}>
            <View style={styles.profileCard}>
              <LinearGradient
                colors={["#667eea", "#764ba2", "#f093fb"]}
                style={styles.profileGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {/* Working Shimmer Effect */}
                <Animated.View
                  style={[
                    styles.shimmerContainer,
                    {
                      opacity: shimmerAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 1, 0.3]
                      })
                    }
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.shimmerGradient}
                  />
                </Animated.View>
                
                <Animated.View
                  style={[
                    styles.profileContent,
                    { transform: [{ scale: avatarScale }] },
                  ]}
                >
                  <View style={styles.avatarWrapper}>
                    {renderAvatar()}
                    
                    {/* Edit Profile Button */}
                    <Animated.View
                      style={[
                        styles.editButton,
                        { transform: [{ scale: pulseAnim }] }
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.editButtonTouchable}
                        onPress={handleEditProfile}
                        activeOpacity={0.8}
                      >
                        <Icon name="edit" size={14} color="#fff" />
                      </TouchableOpacity>
                    </Animated.View>
                  </View>
                  
                  <Text style={styles.profileName}>
                    {userData.firstName || userData.name}
                  </Text>
                  <Text style={styles.profileDetails}>
                    Roll No: {userData.rollNo} • Class {userData.class}
                    {userData.division && ` - ${userData.division}`}
                  </Text>
                </Animated.View>
              </LinearGradient>
            </View>
          </Animated.View>
        )}

        {/* Announcements Section - GUARANTEED TO SHOW */}
        <Animated.View style={[styles.card, { opacity: cardFadeIn }]}>
          <View style={styles.cardHeader}>
            <View style={styles.headerIcon}>
              <Icon name="campaign" size={24} color="#fff" />
            </View>
            <Text style={styles.cardTitle}>Announcements</Text>
            <View style={styles.announcementBadge}>
              <Text style={styles.badgeText}>{announcements.length}</Text>
            </View>
          </View>
          
          <View style={styles.announcementsContainer}>
            {announcements.map((announcement, index) => (
              <View key={announcement.id || index} style={styles.announcementItem}>
                <View style={styles.announcementHeader}>
                  <Text style={styles.announcementTitle}>
                    {announcement.title || `Announcement ${index + 1}`}
                  </Text>
                  <Text style={styles.announcementDate}>
                    {announcement.date ? formatDate(announcement.date) : 'No date'}
                  </Text>
                </View>
                <Text style={styles.announcementContent}>
                  {announcement.content || announcement.description || 'No content available'}
                </Text>
                {announcement.priority && (
                  <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(announcement.priority) }]}>
                    <Text style={styles.priorityText}>{announcement.priority.toUpperCase()}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Financial Information */}
        {userData && (userData.scholarshipAmt > 0 || userData.additionalAmt > 0) && (
          <Animated.View style={[styles.card, { opacity: cardFadeIn }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.headerIcon, { backgroundColor: '#48c6ef' }]}>
                <Icon name="account-balance-wallet" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Financial Overview</Text>
            </View>
            <View style={styles.financialGrid}>
              {userData.scholarshipAmt > 0 && (
                <View style={styles.financialCard}>
                  <LinearGradient
                    colors={["#56ab2f", "#a8e6cf"]}
                    style={styles.financialGradient}
                  >
                    <Icon name="school" size={24} color="#fff" />
                    <Text style={styles.financialAmount}>₹{userData.scholarshipAmt?.toLocaleString()}</Text>
                    <Text style={styles.financialLabel}>Scholarship</Text>
                  </LinearGradient>
                </View>
              )}
              {userData.additionalAmt > 0 && (
                <View style={styles.financialCard}>
                  <LinearGradient
                    colors={["#2196F3", "#64b5f6"]}
                    style={styles.financialGradient}
                  >
                    <Icon name="add-circle" size={24} color="#fff" />
                    <Text style={styles.financialAmount}>₹{userData.additionalAmt?.toLocaleString()}</Text>
                    <Text style={styles.financialLabel}>Additional</Text>
                  </LinearGradient>
                </View>
              )}
            </View>
          </Animated.View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    color: colors.textLight,
    fontSize: 16,
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.large,
    paddingTop: spacing.large,
    paddingBottom: spacing.xLarge * 2,
  },
  debugCard: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
  profileCardContainer: {
    marginBottom: spacing.xLarge,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  profileGradient: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
  },
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmerGradient: {
    flex: 1,
    width: '100%',
  },
  profileContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  editButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
  editButtonTouchable: {
    backgroundColor: '#ff6b6b',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff",
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profileDetails: {
    fontSize: 14,
    color: "#e8f4f8",
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ff6b6b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  announcementBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  announcementsContainer: {
    marginTop: 8,
  },
  announcementItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  announcementDate: {
    fontSize: 12,
    color: colors.textLight,
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  announcementContent: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  priorityTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  financialGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  financialCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  financialGradient: {
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  financialAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  financialLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default StudentHomeScreen;