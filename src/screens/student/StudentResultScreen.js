// src/screens/student/StudentResultsScreen.js
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
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/common/Header";

const { width, height } = Dimensions.get('window');

// Vibrant, Child-Friendly Color Palette
const colors = {
  // Main colors
  primary: '#4f46e5',
  primaryLight: '#6366f1',
  primaryDark: '#3730a3',
  
  // Subject colors
  physics: '#ef4444',      // Red for Physics
  physicsLight: '#f87171',
  physicsSoft: '#fee2e2',
  
  chemistry: '#10b981',    // Green for Chemistry  
  chemistryLight: '#34d399',
  chemistrySoft: '#d1fae5',
  
  mathematics: '#3b82f6',  // Blue for Mathematics
  mathematicsLight: '#60a5fa',
  mathematicsSoft: '#dbeafe',
  
  // Achievement colors
  gold: '#fbbf24',
  goldLight: '#fcd34d',
  goldSoft: '#fef3c7',
  
  silver: '#9ca3af',
  silverLight: '#d1d5db',
  silverSoft: '#f3f4f6',
  
  bronze: '#d97706',
  bronzeLight: '#f59e0b',
  bronzeSoft: '#fef3c7',
  
  // Fun colors
  purple: '#8b5cf6',
  purpleLight: '#a78bfa',
  purpleSoft: '#ede9fe',
  
  pink: '#ec4899',
  pinkLight: '#f472b6',
  pinkSoft: '#fce7f3',
  
  cyan: '#06b6d4',
  cyanLight: '#22d3ee',
  cyanSoft: '#cffafe',
  
  // Neutral colors
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Background
  background: '#f8fafc',
  surface: '#ffffff',
  
  // Text
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  
  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
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

const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/exams';

// Mock data for testing - exact structure from your API
const DEMO_RESULTS = {
  cet: [
    {
      exam_name: "CET Sample exam",
      exam_date: "2025-07-07",
      rank: 7,
      omr_roll_no: 250006,
      student_name: "Varad",
      batch: "2025-2026",
      phy: 95,
      chem: 94,
      math: 96,
      total: 285
    },
    {
      exam_name: "CET Main test",
      exam_date: "2025-07-01",
      rank: 1,
      omr_roll_no: 250006,
      student_name: "Varad",
      batch: "2025-2026",
      phy: 98,
      chem: 97,
      math: 99,
      total: 294
    }
  ],
  neet: [],
  jee_main: [],
  jee_adv: []
};

const StudentResultsScreen = () => {
  const navigation = useNavigation();
  
  // State Management
  const [state, setState] = useState({
    resultsData: null,
    loading: true,
    refreshing: false,
    error: null,
  });
  
  // Enhanced Animation References
  const animations = {
    fadeAnim: useRef(new Animated.Value(0)).current,
    slideAnim: useRef(new Animated.Value(50)).current,
    cardScale: useRef(new Animated.Value(0.9)).current,
    // Celebratory animations
    bounce: useRef(new Animated.Value(1)).current,
    sparkle: useRef(new Animated.Value(0)).current,
    confetti: useRef(new Animated.Value(0)).current,
    // Loading animations
    loadingDot1: useRef(new Animated.Value(0)).current,
    loadingDot2: useRef(new Animated.Value(0)).current,
    loadingDot3: useRef(new Animated.Value(0)).current,
    // Subject progress animations
    physicsProgress: useRef(new Animated.Value(0)).current,
    chemistryProgress: useRef(new Animated.Value(0)).current,
    mathProgress: useRef(new Animated.Value(0)).current,
    // Achievement animations
    achievementPulse: useRef(new Animated.Value(1)).current,
    // Stagger animations
    resultStagger: useRef(new Animated.Value(0)).current,
    // Glow effect (replaced shimmer)
    glow: useRef(new Animated.Value(0)).current,
    // Fixed: Add missing animations
    shimmer: useRef(new Animated.Value(-1)).current,
    medalRotate: useRef(new Animated.Value(0)).current,
  };

  // Update state helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    initializeResults();
    startContinuousAnimations();
  }, []);

  useEffect(() => {
    if (state.resultsData) {
      startCelebrationAnimations();
    }
  }, [state.resultsData]);

  const initializeResults = async () => {
    await loadResultsData();
  };

  const startContinuousAnimations = () => {
    // Loading dots animation
    const createLoadingAnimation = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createLoadingAnimation(animations.loadingDot1, 0).start();
    createLoadingAnimation(animations.loadingDot2, 200).start();
    createLoadingAnimation(animations.loadingDot3, 400).start();

    // Shimmer effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.shimmer, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.shimmer, {
          toValue: -1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Medal rotation
    Animated.loop(
      Animated.timing(animations.medalRotate, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();

    // Achievement pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.achievementPulse, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animations.achievementPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.sparkle, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.sparkle, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.glow, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.glow, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startCelebrationAnimations = () => {
    console.log("🎊 Starting celebration animations...");
    
    // Reset animations to ensure they start from the right values
    animations.fadeAnim.setValue(0);
    animations.slideAnim.setValue(50);
    animations.cardScale.setValue(0.9);
    animations.bounce.setValue(1);
    animations.confetti.setValue(0);
    animations.resultStagger.setValue(0);
    animations.glow.setValue(0);
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(animations.fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(animations.slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(animations.cardScale, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Celebration effects
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(animations.confetti, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.spring(animations.bounce, {
          toValue: 1.2,
          tension: 100,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(animations.bounce, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }).start();
      });
    }, 500);

    // Staggered result animations
    setTimeout(() => {
      Animated.timing(animations.resultStagger, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 800);

    // Animate progress bars if we have results
    const latestResult = getLatestResult();
    if (latestResult) {
      // Reset progress animations
      animations.physicsProgress.setValue(0);
      animations.chemistryProgress.setValue(0);
      animations.mathProgress.setValue(0);
      
      setTimeout(() => {
        Animated.timing(animations.physicsProgress, {
          toValue: latestResult.phy / 100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 1200);

      setTimeout(() => {
        Animated.timing(animations.chemistryProgress, {
          toValue: latestResult.chem / 100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 1400);

      setTimeout(() => {
        Animated.timing(animations.mathProgress, {
          toValue: latestResult.math / 100,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }, 1600);
    }
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

  const loadResultsData = async () => {
    console.log("=== Loading Results Data ===");
    try {
      updateState({ loading: true, error: null });
      
      const headers = await getAuthHeaders();
      if (!headers) {
        console.error("❌ No authentication tokens found");
        throw new Error("No authentication tokens");
      }

      // Extract user ID from token for API call
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      let userId = null;
      
      if (tokensString) {
        try {
          const tokens = JSON.parse(tokensString);
          console.log("🔑 Found tokens in storage");
          if (tokens.accessToken) {
            // Decode JWT to get user info (simple decode, not verification)
            const base64Url = tokens.accessToken.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            const decoded = JSON.parse(jsonPayload);
            userId = decoded.user_id || decoded.id || decoded.sub || decoded.userId;
            console.log("🔍 Decoded JWT payload:", decoded);
            console.log("🔍 Extracted user ID from token:", userId);
          }
        } catch (decodeError) {
          console.log("⚠️ Could not decode token for user ID:", decodeError);
        }
      }

      console.log("✅ Auth headers obtained");
      console.log("🔍 Headers to send:", headers);
      
      // Try different API endpoint variations with better structure
      const baseUrl = 'https://erpbackend-gray.vercel.app/api/exams';
      const endpoints = [
        // Try the exact working endpoint from your example
        { url: `${baseUrl}/getStudentResults`, method: 'GET', description: 'Original endpoint' },
        // Try with user ID in different ways
        { url: `${baseUrl}/getStudentResults/${userId}`, method: 'GET', description: 'With user ID in path' },
        { url: `${baseUrl}/getStudentResults?userId=${userId}`, method: 'GET', description: 'With userId query param' },
        { url: `${baseUrl}/getStudentResults?user_id=${userId}`, method: 'GET', description: 'With user_id query param' },
        // Try POST method in case GET doesn't work
        { url: `${baseUrl}/getStudentResults`, method: 'POST', body: { user_id: userId }, description: 'POST with user_id in body' },
        // Try alternative endpoint names
        { url: `${baseUrl}/student-results`, method: 'GET', description: 'Alternative endpoint name' },
        { url: `${baseUrl}/results`, method: 'GET', description: 'Shorter endpoint name' },
      ];
      
      let response = null;
      let usedEndpoint = '';
      let apiData = null;
      
      for (const endpoint of endpoints) {
        if (!userId && endpoint.url.includes('${userId}')) {
          console.log(`⏭️ Skipping ${endpoint.description} - no user ID available`);
          continue;
        }
        
        console.log(`🔗 Trying ${endpoint.description}: ${endpoint.url}`);
        
        try {
          const fetchOptions = {
            method: endpoint.method,
            headers: {
              ...headers,
              // Ensure we're asking for JSON
              'Accept': 'application/json',
            },
          };
          
          // Add body for POST requests
          if (endpoint.method === 'POST' && endpoint.body) {
            fetchOptions.body = JSON.stringify(endpoint.body);
          }
          
          console.log("📤 Fetch options:", fetchOptions);
          
          response = await fetch(endpoint.url, fetchOptions);
          
          console.log("📡 Response status:", response.status);
          console.log("📡 Response content-type:", response.headers.get('content-type'));
          console.log("📡 Response headers:", Object.fromEntries(response.headers.entries()));
          
          // Check if we got JSON response (not HTML)
          const contentType = response.headers.get('content-type');
          const isJson = contentType && contentType.includes('application/json');
          
          if (response.ok && isJson) {
            usedEndpoint = endpoint.description;
            apiData = await response.json();
            console.log("✅ Success with:", endpoint.description);
            console.log("📊 Response data:", JSON.stringify(apiData, null, 2));
            break;
          } else if (response.ok && !isJson) {
            // Got HTML instead of JSON - endpoint exists but wrong format
            const htmlText = await response.text();
            console.log("⚠️ Got HTML response instead of JSON:", htmlText.substring(0, 200));
            console.log("🔍 This suggests the endpoint exists but returns HTML - might be a frontend route");
          } else if (response.status === 404) {
            // Log 404 but continue trying other endpoints
            const errorText = await response.text();
            console.log(`⚠️ 404 with ${endpoint.description}`);
            console.log("📄 404 Response body:", errorText.substring(0, 200));
          } else {
            // Non-404 error
            const errorText = await response.text();
            console.log(`❌ Error ${response.status} with ${endpoint.description}:`, errorText.substring(0, 200));
          }
        } catch (fetchError) {
          console.log(`❌ Network error with ${endpoint.description}:`, fetchError.message);
        }
      }
      
      // Handle the response
      if (!apiData) {
        console.log("❌ No successful API response from any endpoint");
        
        // If we got responses but they were all HTML, this suggests a routing issue
        if (response && response.headers.get('content-type')?.includes('text/html')) {
          console.log("🔍 All responses were HTML - API endpoint might not exist or need different authentication");
          updateState({ 
            resultsData: null, 
            loading: false,
            error: "API endpoint not found. Please contact support if this issue persists.",
          });
          return;
        }
        
        // Otherwise treat as no results available
        console.log("⚠️ No results available yet for user:", userId);
        updateState({ 
          resultsData: { cet: [], neet: [], jee_main: [], jee_adv: [] }, 
          loading: false 
        });
        return;
      }

      console.log("🔗 Successfully used:", usedEndpoint);
      
      if (apiData && apiData.status === 'success' && apiData.data) {
        console.log("✅ API returned success status");
        console.log("📊 Results data:", apiData.data);
        console.log("📊 CET results count:", apiData.data?.cet?.length || 0);
        console.log("📊 NEET results count:", apiData.data?.neet?.length || 0);
        console.log("📊 JEE Main results count:", apiData.data?.jee_main?.length || 0);
        console.log("📊 JEE Advanced results count:", apiData.data?.jee_adv?.length || 0);
        
        if (apiData.data.cet && apiData.data.cet.length > 0) {
          console.log("📊 Latest CET result:", apiData.data.cet[0]);
        }
        
        updateState({ resultsData: apiData.data, loading: false });
        console.log("🎉 Results data loaded successfully!");
      } else {
        console.log("⚠️ API returned non-success status or no data:", apiData?.status);
        updateState({ 
          resultsData: { cet: [], neet: [], jee_main: [], jee_adv: [] }, 
          loading: false,
          error: "No results found. Your exam results will appear here once they're published."
        });
      }
    } catch (error) {
      console.error("❌ Failed to load results data:", error);
      console.error("❌ Error name:", error.name);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      
      // Enhanced error handling
      if (error.message.includes('Network request failed') || error.message.includes('fetch')) {
        console.log("🌐 Network connectivity issue");
        updateState({ 
          resultsData: null, 
          loading: false,
          error: "Unable to connect to server. Please check your internet connection and try again.",
        });
      } else if (error.message.includes('404')) {
        console.log("🔄 Treating 404 as no results available");
        updateState({ 
          resultsData: { cet: [], neet: [], jee_main: [], jee_adv: [] }, 
          loading: false,
          error: null
        });
      } else if (error.message.includes('No authentication tokens') || error.message.includes('401')) {
        console.log("🔐 Authentication issue");
        updateState({ 
          resultsData: null, 
          loading: false,
          error: "Session expired. Please log in again to view your results.",
        });
      } else if (error.message.includes('500')) {
        console.log("🔧 Server error");
        updateState({ 
          resultsData: null, 
          loading: false,
          error: "Server is temporarily unavailable. Please try again in a few minutes.",
        });
      } else {
        console.log("❓ Unknown error");
        updateState({ 
          resultsData: null, 
          loading: false,
          error: "Something went wrong. Please try again later.",
        });
      }
    }
  };

  const onRefresh = useCallback(async () => {
    updateState({ refreshing: true });
    await loadResultsData();
    updateState({ refreshing: false });
  }, []);

  // Helper Functions
  const getRankColor = (rank) => {
    if (rank === 1) return { color: colors.gold, bg: colors.goldSoft };
    if (rank === 2) return { color: colors.silver, bg: colors.silverSoft };
    if (rank === 3) return { color: colors.bronze, bg: colors.bronzeSoft };
    if (rank <= 10) return { color: colors.purple, bg: colors.purpleSoft };
    return { color: colors.primary, bg: colors.gray100 };
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "emoji-events";
    if (rank === 2) return "military-tech";
    if (rank === 3) return "star";
    if (rank <= 10) return "workspace-premium";
    return "trending-up";
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case 'phy': return { color: colors.physics, light: colors.physicsLight, soft: colors.physicsSoft };
      case 'chem': return { color: colors.chemistry, light: colors.chemistryLight, soft: colors.chemistrySoft };
      case 'math': return { color: colors.mathematics, light: colors.mathematicsLight, soft: colors.mathematicsSoft };
      default: return { color: colors.primary, light: colors.primaryLight, soft: colors.gray100 };
    }
  };

  const getSubjectName = (subject) => {
    switch (subject) {
      case 'phy': return 'Physics';
      case 'chem': return 'Chemistry';
      case 'math': return 'Mathematics';
      default: return subject;
    }
  };

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'phy': return 'science';
      case 'chem': return 'biotech';
      case 'math': return 'calculate';
      default: return 'subject';
    }
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 95) return { message: "Outstanding! 🌟", color: colors.gold };
    if (percentage >= 90) return { message: "Excellent! 🎉", color: colors.success };
    if (percentage >= 85) return { message: "Very Good! 👏", color: colors.primary };
    if (percentage >= 75) return { message: "Good Work! 💪", color: colors.cyan };
    if (percentage >= 60) return { message: "Keep Going! 📚", color: colors.warning };
    return { message: "Need Practice! 📖", color: colors.error };
  };

  const getCongratulationsMessage = (rank) => {
    if (rank === 1) return "🏆 CHAMPION! You're #1! 🏆";
    if (rank === 2) return "🥈 Amazing! Second place! 🥈";
    if (rank === 3) return "🥉 Fantastic! Third place! 🥉";
    if (rank <= 5) return "⭐ Top 5! You're a star! ⭐";
    if (rank <= 10) return "🌟 Top 10! Keep shining! 🌟";
    return "💫 Great effort! Keep improving! 💫";
  };

  // Helper function to get cartoon character based on performance
  const getPerformanceCharacter = (percentage) => {
    if (percentage >= 95) return "🦸‍♂️"; // Superhero for outstanding
    if (percentage >= 90) return "🌟"; // Star for excellent
    if (percentage >= 85) return "🎯"; // Target for very good
    if (percentage >= 75) return "💪"; // Muscle for good work
    if (percentage >= 60) return "📚"; // Books for keep going
    return "🤔"; // Thinking face for need practice
  };

  // Helper function to get subject mascot
  const getSubjectMascot = (subject) => {
    switch (subject) {
      case 'phy': return "🔬"; // Microscope for Physics
      case 'chem': return "⚗️"; // Test tube for Chemistry
      case 'math': return "🧮"; // Abacus for Mathematics
      default: return "📖";
    }
  };

  // Helper function to get rank mascot
  const getRankMascot = (rank) => {
    if (rank === 1) return "👑"; // Crown for 1st place
    if (rank === 2) return "🥈"; // Silver medal
    if (rank === 3) return "🥉"; // Bronze medal
    if (rank <= 10) return "⭐"; // Star for top 10
    return "🎖️"; // Medal for others
  };

  // Helper function to get random cheerful character
  const getCheerfulCharacter = () => {
    const characters = ["🐱", "🐶", "🐨", "🦊", "🐼", "🦁", "🐯", "🐸"];
    return characters[Math.floor(Math.random() * characters.length)];
  };

  // Helper function to get all available results
  const getAllResults = () => {
    if (!state.resultsData) return [];
    
    const allResults = [];
    
    // Add CET results
    if (state.resultsData.cet && state.resultsData.cet.length > 0) {
      state.resultsData.cet.forEach(result => {
        allResults.push({ ...result, examType: 'CET', examTypeColor: colors.primary });
      });
    }
    
    // Add NEET results
    if (state.resultsData.neet && state.resultsData.neet.length > 0) {
      state.resultsData.neet.forEach(result => {
        allResults.push({ ...result, examType: 'NEET', examTypeColor: colors.success });
      });
    }
    
    // Add JEE Main results
    if (state.resultsData.jee_main && state.resultsData.jee_main.length > 0) {
      state.resultsData.jee_main.forEach(result => {
        allResults.push({ ...result, examType: 'JEE Main', examTypeColor: colors.cyan });
      });
    }
    
    // Add JEE Advanced results
    if (state.resultsData.jee_adv && state.resultsData.jee_adv.length > 0) {
      state.resultsData.jee_adv.forEach(result => {
        allResults.push({ ...result, examType: 'JEE Advanced', examTypeColor: colors.purple });
      });
    }
    
    // Sort by date (most recent first)
    return allResults.sort((a, b) => new Date(b.exam_date) - new Date(a.exam_date));
  };

  // Helper function to get latest result from all exams
  const getLatestResult = () => {
    const allResults = getAllResults();
    return allResults.length > 0 ? allResults[0] : null;
  };

  // Helper function to check if any results exist
  const hasAnyResults = () => {
    return getAllResults().length > 0;
  };

  // Component Renderers
  const renderSparkleEffects = () => (
    <View style={styles.sparkleContainer}>
      {[...Array(6)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.sparkle,
            {
              left: (width / 6) * index,
              top: 50 + (index % 2) * 100,
              opacity: animations.sparkle,
              transform: [{
                scale: animations.sparkle.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1.5]
                })
              }, {
                rotate: animations.sparkle.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                })
              }]
            }
          ]}
        >
          <Icon name="auto-awesome" size={12} color={colors.gold} />
        </Animated.View>
      ))}
    </View>
  );

  const renderTrendingLoader = () => {
    const dotStyle = (animValue, color) => ({
      opacity: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1]
      }),
      transform: [{
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.3]
        })
      }],
      backgroundColor: color,
    });

    return (
      <View style={styles.trendingLoader}>
        <Animated.View style={[styles.loadingDot, dotStyle(animations.loadingDot1, colors.physics)]} />
        <Animated.View style={[styles.loadingDot, dotStyle(animations.loadingDot2, colors.chemistry)]} />
        <Animated.View style={[styles.loadingDot, dotStyle(animations.loadingDot3, colors.mathematics)]} />
      </View>
    );
  };

  const renderGlowEffect = (style) => (
    <Animated.View
      style={[
        styles.glowOverlay,
        style,
        {
          opacity: animations.glow.interpolate({
            inputRange: [0, 1],
            outputRange: [0.1, 0.3]
          })
        }
      ]}
    />
  );

  // Fixed: Add the missing renderShimmerEffect function
  const renderShimmerEffect = (style) => (
    <Animated.View
      style={[
        styles.shimmerOverlay,
        style,
        {
          transform: [{
            translateX: animations.shimmer.interpolate({
              inputRange: [-1, 1],
              outputRange: [-width, width]
            })
          }]
        }
      ]}
    />
  );

  const renderLoadingScreen = () => (
    <LinearGradient
      colors={[colors.background, colors.gray50]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header title="Results" />
      <View style={styles.loadingContainer}>
        <Animated.View 
          style={[
            styles.loadingCard,
            {
              transform: [{ scale: animations.cardScale }]
            }
          ]}
        >
          <View style={styles.loadingMascot}>
            <Text style={styles.loadingMascotText}>🤖</Text>
          </View>
          {renderTrendingLoader()}
          <Text style={styles.loadingText}>
            🔍 Loading your amazing results... {getCheerfulCharacter()}
          </Text>
          {renderShimmerEffect(styles.loadingShimmer)}
        </Animated.View>
      </View>
    </LinearGradient>
  );

  const renderErrorMessage = () => {
    if (!state.error) return null;

    return (
      <Animated.View style={[styles.errorContainer, { opacity: animations.fadeAnim }]}>
        <LinearGradient
          colors={[colors.error, colors.error + '20']}
          style={styles.errorCard}
        >
          <View style={styles.errorIcon}>
            <Icon name="sentiment-dissatisfied" size={32} color={colors.white} />
          </View>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={styles.retryGradient}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderOverallStats = () => {
    console.log("🎯 renderOverallStats called");
    console.log("📊 state.resultsData:", state.resultsData);
    
    const latestResult = getLatestResult();
    if (!latestResult) {
      console.log("❌ No results data for overall stats");
      return null;
    }

    console.log("📊 Latest result:", latestResult);
    
    const percentage = (latestResult.total / 300) * 100;
    const performance = getPerformanceMessage(percentage);

    console.log("📊 Percentage:", percentage);
    console.log("📊 Performance:", performance);

    return (
      <Animated.View 
        style={[
          styles.statsContainer,
          {
            opacity: animations.fadeAnim,
            transform: [
              { translateY: animations.slideAnim },
              { scale: animations.bounce }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={[latestResult.examTypeColor || colors.primary, colors.primaryLight]}
          style={styles.statsCard}
        >
          <View style={styles.statsHeader}>
            <Animated.View
              style={{
                transform: [{ scale: animations.achievementPulse }]
              }}
            >
              <View style={styles.headerIconContainer}>
                <Icon name="emoji-events" size={32} color={colors.gold} />
                <Text style={styles.headerMascot}>{getRankMascot(latestResult.rank)}</Text>
              </View>
            </Animated.View>
            <View style={styles.statsTitleContainer}>
              <Text style={styles.statsTitle}>Latest Performance</Text>
              <Text style={styles.examTypeLabel}>{latestResult.examType}</Text>
            </View>
          </View>
          
          <View style={styles.statsContent}>
            {latestResult.rank <= 10 && (
              <View style={styles.congratulationsContainer}>
                <Text style={styles.congratulationsText}>
                  {getCongratulationsMessage(latestResult.rank)}
                </Text>
              </View>
            )}
            
            <View style={styles.totalScoreContainer}>
              <Text style={styles.totalScore}>{latestResult.total}</Text>
              <Text style={styles.totalOutOf}>/ 300</Text>
              <Text style={styles.scoreMascot}>{getPerformanceCharacter(percentage)}</Text>
            </View>
            <Text style={styles.percentage}>{percentage.toFixed(1)}%</Text>
            <View style={styles.performanceContainer}>
              <Text style={[styles.performanceText, { color: performance.color }]}>
                {performance.message}
              </Text>
            </View>
            
            <View style={styles.rankContainer}>
              <View style={styles.rankBadge}>
                <LinearGradient
                  colors={[getRankColor(latestResult.rank).color, getRankColor(latestResult.rank).color + '80']}
                  style={styles.rankBadgeGradient}
                >
                  <Icon name={getRankIcon(latestResult.rank)} size={20} color={colors.white} />
                  <Text style={styles.rankText}>Rank {latestResult.rank}</Text>
                </LinearGradient>
              </View>
            </View>
            
            <View style={styles.examInfoContainer}>
              <Text style={styles.examNameDisplay}>{latestResult.exam_name}</Text>
              <Text style={styles.examDateDisplay}>
                {new Date(latestResult.exam_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
          
          {renderGlowEffect(styles.cardGlow)}
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderSubjectProgress = () => {
    const latestResult = getLatestResult();
    if (!latestResult) {
      return null;
    }

    const subjects = [
      { key: 'phy', score: latestResult.phy, animation: animations.physicsProgress },
      { key: 'chem', score: latestResult.chem, animation: animations.chemistryProgress },
      { key: 'math', score: latestResult.math, animation: animations.mathProgress },
    ];

    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: animations.resultStagger,
            transform: [{ translateY: animations.slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <LinearGradient
            colors={[colors.purple, colors.purpleLight]}
            style={styles.sectionIcon}
          >
            <Icon name="analytics" size={18} color={colors.white} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>Subject Performance</Text>
          <Text style={styles.sectionSubtitle}>({latestResult.examType})</Text>
        </View>
        
        <View style={styles.subjectsContainer}>
          {subjects.map((subject, index) => {
            const subjectData = getSubjectColor(subject.key);
            return (
              <Animated.View
                key={subject.key}
                style={[
                  styles.subjectCard,
                  {
                    opacity: animations.resultStagger,
                    transform: [{
                      translateY: animations.resultStagger.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={[subjectData.soft, colors.white]}
                  style={styles.subjectCardGradient}
                >
                  <View style={styles.subjectHeader}>
                    <LinearGradient
                      colors={[subjectData.color, subjectData.light]}
                      style={styles.subjectIcon}
                    >
                      <Icon name={getSubjectIcon(subject.key)} size={24} color={colors.white} />
                    </LinearGradient>
                    <View style={styles.subjectInfo}>
                      <View style={styles.subjectTitleRow}>
                        <Text style={styles.subjectName}>{getSubjectName(subject.key)}</Text>
                        <Text style={styles.subjectMascot}>{getSubjectMascot(subject.key)}</Text>
                      </View>
                      <Text style={styles.subjectScore}>{subject.score} / 100</Text>
                    </View>
                  </View>
                  
                  <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                      <Animated.View
                        style={[
                          styles.progressBar,
                          {
                            backgroundColor: subjectData.color,
                            width: subject.animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: ['0%', `${subject.score}%`]
                            })
                          }
                        ]}
                      />
                    </View>
                    <Text style={[styles.progressText, { color: subjectData.color }]}>
                      {subject.score}%
                    </Text>
                  </View>
                  
                  {renderGlowEffect(styles.cardGlow)}
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderExamHistory = () => {
    const allResults = getAllResults();
    if (allResults.length === 0) {
      return null;
    }

    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: animations.resultStagger,
            transform: [{ translateY: animations.slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <LinearGradient
            colors={[colors.cyan, colors.cyanLight]}
            style={styles.sectionIcon}
          >
            <Icon name="history" size={18} color={colors.white} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>Exam History</Text>
          <Text style={styles.sectionSubtitle}>({allResults.length} exams)</Text>
        </View>
        
        <View style={styles.historyContainer}>
          {allResults.map((exam, index) => {
            const rankData = getRankColor(exam.rank);
            const percentage = (exam.total / 300) * 100;
            const performance = getPerformanceMessage(percentage);
            
            return (
              <Animated.View
                key={`${exam.examType}-${index}`}
                style={[
                  styles.examCard,
                  {
                    opacity: animations.resultStagger,
                    transform: [{
                      translateX: animations.resultStagger.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0]
                      })
                    }]
                  }
                ]}
              >
                <LinearGradient
                  colors={[colors.white, colors.gray50]}
                  style={styles.examCardGradient}
                >
                  <View style={styles.examHeader}>
                    <View style={styles.examInfo}>
                      <View style={styles.examTitleRow}>
                        <Text style={styles.examName}>{exam.exam_name}</Text>
                        <View style={[styles.examTypeBadge, { backgroundColor: exam.examTypeColor + '20' }]}>
                          <Text style={[styles.examTypeText, { color: exam.examTypeColor }]}>
                            {exam.examType}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.examDate}>
                        {new Date(exam.exam_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Text>
                    </View>
                    <View style={[styles.examRank, { backgroundColor: rankData.bg }]}>
                      <Text style={styles.examRankMascot}>{getRankMascot(exam.rank)}</Text>
                      <Icon name={getRankIcon(exam.rank)} size={16} color={rankData.color} />
                      <Text style={[styles.examRankText, { color: rankData.color }]}>#{exam.rank}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.examScores}>
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>Physics</Text>
                      <Text style={[styles.scoreValue, { color: colors.physics }]}>{exam.phy}</Text>
                    </View>
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>Chemistry</Text>
                      <Text style={[styles.scoreValue, { color: colors.chemistry }]}>{exam.chem}</Text>
                    </View>
                    <View style={styles.scoreItem}>
                      <Text style={styles.scoreLabel}>Mathematics</Text>
                      <Text style={[styles.scoreValue, { color: colors.mathematics }]}>{exam.math}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.examTotal}>
                    <Text style={styles.totalLabel}>Total Score</Text>
                    <Text style={styles.totalValue}>{exam.total} / 300</Text>
                    <Text style={[styles.totalPercentage, { color: performance.color }]}>
                      {percentage.toFixed(1)}%
                    </Text>
                  </View>
                  
                  {renderGlowEffect(styles.cardGlow)}
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: animations.fadeAnim,
          transform: [{ translateY: animations.slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryLight]}
        style={styles.emptyIcon}
      >
        <Icon name="assignment" size={48} color={colors.white} />
        <Text style={styles.emptyIconMascot}>📋</Text>
      </LinearGradient>
      <Text style={styles.emptyTitle}>Results Coming Soon! 🎯</Text>
      <Text style={styles.emptyText}>
        Your exam results haven't been published yet. Once your results are available, they'll appear here with all the exciting details! {getCheerfulCharacter()}
      </Text>
      <Text style={styles.emptySubtext}>
        Keep studying hard! 📚✨ Great things are coming your way! 🌈
      </Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.motivationButton} onPress={onRefresh}>
          <LinearGradient
            colors={[colors.success, colors.chemistry]}
            style={styles.motivationGradient}
          >
            <Icon name="refresh" size={20} color={colors.white} />
            <Text style={styles.motivationText}>Check Again 🔄</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* Development/Demo button - only show in development */}
        {__DEV__ && (
          <>
            <TouchableOpacity 
              style={styles.demoButton} 
              onPress={() => {
                console.log("🎭 Loading demo data...");
                updateState({ resultsData: DEMO_RESULTS, loading: false, error: null });
              }}
            >
              <LinearGradient
                colors={[colors.purple, colors.purpleLight]}
                style={styles.motivationGradient}
              >
                <Icon name="visibility" size={20} color={colors.white} />
                <Text style={styles.motivationText}>View Demo Results 🎭</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.testApiButton} 
              onPress={async () => {
                console.log("🧪 Testing API with different approaches...");
                updateState({ loading: true });
                await loadResultsData();
              }}
            >
              <LinearGradient
                colors={[colors.cyan, colors.cyanLight]}
                style={styles.motivationGradient}
              >
                <Icon name="api" size={20} color={colors.white} />
                <Text style={styles.motivationText}>Test API Call 🧪</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.testDirectButton} 
              onPress={async () => {
                console.log("🎯 Testing direct API call without auth...");
                try {
                  const directUrl = 'https://erpbackend-gray.vercel.app/api/exams/getStudentResults';
                  console.log("📞 Direct call to:", directUrl);
                  
                  const response = await fetch(directUrl, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                    },
                  });
                  
                  console.log("📡 Direct response status:", response.status);
                  console.log("📡 Direct response headers:", Object.fromEntries(response.headers.entries()));
                  console.log("📡 Direct response content-type:", response.headers.get('content-type'));
                  
                  const responseText = await response.text();
                  console.log("📄 Direct response body:", responseText);
                  
                  if (response.headers.get('content-type')?.includes('application/json')) {
                    try {
                      const jsonData = JSON.parse(responseText);
                      console.log("📊 Direct JSON data:", jsonData);
                    } catch (parseError) {
                      console.log("❌ Could not parse as JSON:", parseError.message);
                    }
                  }
                } catch (error) {
                  console.log("❌ Direct API call error:", error.message);
                }
              }}
            >
              <LinearGradient
                colors={[colors.gold, colors.goldLight]}
                style={styles.motivationGradient}
              >
                <Icon name="bug-report" size={20} color={colors.white} />
                <Text style={styles.motivationText}>Test Direct Call 🔧</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Animated.View>
  );

  // Main Render
  if (state.loading) {
    console.log("🔄 Still loading...");
    return renderLoadingScreen();
  }

  console.log("🔍 Checking results data...");
  console.log("📊 Current state.resultsData:", state.resultsData);
  console.log("📊 Current state.error:", state.error);
  
  const hasResults = hasAnyResults();
  const allResults = getAllResults();
  const latestResult = getLatestResult();
    
  console.log("📊 hasResults:", hasResults);
  console.log("📊 All results count:", allResults.length);
  console.log("📊 Latest result:", latestResult);

  return (
    <LinearGradient
      colors={[colors.background, colors.gray50]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header title="Results" />
      
      {renderSparkleEffects()}
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={state.refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary, colors.chemistry, colors.physics]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.white}
          />
        }
      >
        {/* Debug info - hidden from UI but available in console logs */}
        {false && __DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              🔍 Debug Info: {'\n'}
              Loading: {state.loading ? 'Yes' : 'No'}{'\n'}
              Error: {state.error || 'None'}{'\n'}
              Has Results Data: {state.resultsData ? 'Yes' : 'No'}{'\n'}
              CET Count: {state.resultsData?.cet?.length || 0}{'\n'}
              NEET Count: {state.resultsData?.neet?.length || 0}{'\n'}
              JEE Main Count: {state.resultsData?.jee_main?.length || 0}{'\n'}
              JEE Adv Count: {state.resultsData?.jee_adv?.length || 0}{'\n'}
              Total Results: {allResults.length}{'\n'}
              Has Results: {hasResults ? 'Yes' : 'No'}{'\n'}
              {'\n'}
              🔧 API Issue Analysis:{'\n'}
              • Getting HTML instead of JSON{'\n'}
              • Suggests endpoint routing problem{'\n'}
              • Try "Test Direct Call" below{'\n'}
              {'\n'}
              💡 Possible Solutions:{'\n'}
              1. Check if API is deployed correctly{'\n'}
              2. Verify endpoint exists on server{'\n'}
              3. Test without authentication first{'\n'}
              4. Check for CORS issues{'\n'}
              5. Verify user_id 253 exists in DB
            </Text>
          </View>
        )}
        
        {renderErrorMessage()}
        
        {hasResults ? (
          <>
            {/* Celebration banner for top performers */}
            {latestResult?.rank <= 3 && (
              <Animated.View
                style={[
                  styles.celebrationBanner,
                  {
                    opacity: animations.fadeAnim,
                    transform: [{ scale: animations.bounce }]
                  }
                ]}
              >
                <LinearGradient
                  colors={[colors.gold, colors.goldLight]}
                  style={styles.celebrationGradient}
                >
                  <Text style={styles.celebrationText}>
                    🎊 CONGRATULATIONS! 🎊
                  </Text>
                </LinearGradient>
              </Animated.View>
            )}
            
            {renderOverallStats()}
            {renderSubjectProgress()}
            {renderExamHistory()}
          </>
        ) : (
          renderEmptyState()
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.lg,
  },

  scrollView: {
    flex: 1,
    paddingTop: spacing.sm,
  },

  // Sparkle Effects
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    paddingTop: spacing.xxxxl,
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xxxl,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 1,
    borderColor: colors.gray200,
    overflow: 'hidden',
    position: 'relative',
  },
  loadingMascot: {
    marginBottom: spacing.md,
  },
  loadingMascotText: {
    fontSize: 32,
    textAlign: 'center',
  },
  trendingLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Error State
  errorContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorCard: {
    borderRadius: 20,
    padding: spacing.xl,
    alignItems: 'center',
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  retryText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Stats Container
  celebrationBanner: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.gold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  celebrationGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
  },
  celebrationText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 1,
    textAlign: 'center',
  },
  
  statsContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  statsCard: {
    borderRadius: 24,
    padding: spacing.xl,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
    overflow: 'hidden',
    position: 'relative',
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  headerIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMascot: {
    position: 'absolute',
    top: -8,
    right: -8,
    fontSize: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 2,
  },
  statsTitleContainer: {
    marginLeft: spacing.md,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
  },
  examTypeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statsContent: {
    alignItems: 'center',
  },
  congratulationsContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gold,
  },
  congratulationsText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  totalScoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.sm,
  },
  totalScore: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -2,
  },
  totalOutOf: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: spacing.xs,
  },
  scoreMascot: {
    fontSize: 24,
    marginLeft: spacing.sm,
  },
  percentage: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.gold,
    marginBottom: spacing.md,
  },
  performanceContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
  },
  performanceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  rankContainer: {
    marginTop: spacing.md,
  },
  rankBadge: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  rankBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  examInfoContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  examNameDisplay: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    marginBottom: 4,
  },
  examDateDisplay: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  // Sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
    marginLeft: spacing.sm,
  },

  // Subject Progress
  subjectsContainer: {
    gap: spacing.lg,
  },
  subjectCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  subjectCardGradient: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    position: 'relative',
    overflow: 'hidden',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  subjectIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  subjectMascot: {
    fontSize: 16,
    marginLeft: spacing.sm,
  },
  subjectScore: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 45,
  },

  // Exam History
  historyContainer: {
    gap: spacing.lg,
  },
  examCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  examCardGradient: {
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
    position: 'relative',
    overflow: 'hidden',
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  examInfo: {
    flex: 1,
  },
  examTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: spacing.sm,
  },
  examName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  examTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  examTypeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  examDate: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  examRank: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  examRankMascot: {
    fontSize: 14,
  },
  examRankText: {
    fontSize: 14,
    fontWeight: '700',
  },
  examScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  examTotal: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  totalPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xxxl,
    marginTop: spacing.xxxxl,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  emptyIconMascot: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    fontSize: 20,
    backgroundColor: colors.white,
    borderRadius: 15,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xxxl,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '100%',
    gap: spacing.md,
    alignItems: 'center',
  },
  motivationButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  demoButton: {
    borderRadius: 16,
    overflow: 'hidden',
    opacity: 0.9,
  },
  testApiButton: {
    borderRadius: 16,
    overflow: 'hidden',
    opacity: 0.9,
  },
  testDirectButton: {
    borderRadius: 16,
    overflow: 'hidden',
    opacity: 0.9,
  },
  motivationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },

  // Debug Info (development only)
  debugContainer: {
    margin: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  debugText: {
    fontSize: 12,
    color: colors.gray700,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Fixed: Add missing styles for glow and shimmer effects
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.gold,
    borderRadius: 16,
  },
  cardGlow: {
    borderRadius: 24,
  },

  // Shimmer Effects
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.6,
  },
  cardShimmer: {
    left: 0,
    right: 0,
  },
  loadingShimmer: {
    left: 0,
    right: 0,
    borderRadius: 24,
  },

  // Bottom spacing
  bottomSpacing: {
    height: spacing.xxxxl + spacing.xxxl,
  },
});

export default StudentResultsScreen;