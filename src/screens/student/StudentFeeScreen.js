import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');
const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/general';

// Modern Dribbble-inspired Design System
const theme = {
  colors: {
    // Primary Palette - Modern Purple/Blue
    primary: '#667EEA',
    primaryDark: '#5A67D8',
    primaryLight: '#7C3AED',
    
    // Background System
    background: '#FAFBFF',
    backgroundSecondary: '#F7F9FC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    
    // Semantic Colors
    success: '#10D876',
    successBg: '#ECFDF5',
    warning: '#FBBF24',
    warningBg: '#FFFBEB',
    error: '#F87171',
    errorBg: '#FEF2F2',
    info: '#60A5FA',
    infoBg: '#EFF6FF',
    
    // Neutral Palette
    neutral50: '#F8FAFC',
    neutral100: '#F1F5F9',
    neutral200: '#E2E8F0',
    neutral300: '#CBD5E1',
    neutral400: '#94A3B8',
    neutral500: '#64748B',
    neutral600: '#475569',
    neutral700: '#334155',
    neutral800: '#1E293B',
    neutral900: '#0F172A',
    
    // Special Effects
    glass: 'rgba(255, 255, 255, 0.25)',
    glassBorder: 'rgba(255, 255, 255, 0.18)',
    shadow: 'rgba(15, 23, 42, 0.08)',
    shadowLarge: 'rgba(15, 23, 42, 0.15)',
    
    // Status Specific
    paid: '#10D876',
    pending: '#FBBF24',
    overdue: '#F87171',
    locked: '#94A3B8',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40,
    xxxxxl: 48,
  },
  
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    full: 999,
  },
  
  typography: {
    displayLarge: { fontSize: 32, fontWeight: '800', lineHeight: 40 },
    displayMedium: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
    headlineLarge: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
    headlineMedium: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    titleLarge: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
    titleMedium: { fontSize: 16, fontWeight: '600', lineHeight: 22 },
    bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
    bodyMedium: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    labelLarge: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
    labelMedium: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
    labelSmall: { fontSize: 11, fontWeight: '500', lineHeight: 14 },
  },
  
  shadows: {
    glass: {
      shadowColor: 'rgba(15, 23, 42, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: 'rgba(15, 23, 42, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: 'rgba(15, 23, 42, 0.15)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
    },
  },
};

const ModernFeeScreen = () => {
  // State Management
  const [state, setState] = useState({
    loading: true,
    refreshing: false,
    studentDetails: null,
    installments: [],
    error: null,
    paymentInProgress: null,
  });

  // Animation References - all at top level
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  // Loading screen animations - all at top level
  const loadingPulseAnim = useRef(new Animated.Value(1)).current;
  const loadingRotateAnim = useRef(new Animated.Value(0)).current;
  const loadingFloatAnim = useRef(new Animated.Value(0)).current;
  const loadingShimmerAnim = useRef(new Animated.Value(0)).current;
  const loadingDotsAnim = useRef(new Animated.Value(0)).current;
  const loadingProgressAnim = useRef(new Animated.Value(0)).current;

  const [routes] = useState([
    { key: 'cet', title: 'CET', icon: 'school-outline', color: '#6366F1' },
    { key: 'neet', title: 'NEET', icon: 'medical-outline', color: '#10B981' },
    { key: 'jee_main', title: 'JEE Main', icon: 'calculator-outline', color: '#F59E0B' },
    { key: 'jee_adv', title: 'JEE Adv', icon: 'rocket-outline', color: '#EF4444' },
  ]);

  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    loadFeeData();
  }, []);

  useEffect(() => {
    if (!state.loading) {
      startAnimations();
    }
  }, [state.loading]);

  useEffect(() => {
    if (state.loading) {
      startLoadingAnimations();
    }
  }, [state.loading]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Delayed progress animation
    setTimeout(() => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    }, 400);
  };

  const startLoadingAnimations = () => {
    // Main pulse animation
    const pulseLoop = () => {
      Animated.sequence([
        Animated.timing(loadingPulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(pulseLoop);
    };

    // Rotation animation for outer ring
    const rotateLoop = () => {
      loadingRotateAnim.setValue(0);
      Animated.timing(loadingRotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(rotateLoop);
    };

    // Floating animation
    const floatLoop = () => {
      Animated.sequence([
        Animated.timing(loadingFloatAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(loadingFloatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(floatLoop);
    };

    // Shimmer effect
    const shimmerLoop = () => {
      loadingShimmerAnim.setValue(0);
      Animated.timing(loadingShimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(shimmerLoop, 500);
      });
    };

    // Floating dots animation
    const dotsLoop = () => {
      Animated.sequence([
        Animated.timing(loadingDotsAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(loadingDotsAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(dotsLoop);
    };

    // Progress bar animation (width animation needs useNativeDriver: false)
    const progressLoop = () => {
      loadingProgressAnim.setValue(0);
      Animated.timing(loadingProgressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false, // Width animation requires this
      }).start(() => {
        setTimeout(progressLoop, 500);
      });
    };

    pulseLoop();
    rotateLoop();
    floatLoop();
    shimmerLoop();
    dotsLoop();
    progressLoop();
  };

  // Helper function to get auth headers
  const getAuthHeaders = async () => {
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      if (!tokensString) {
        console.log("No tokens found in AsyncStorage");
        return null;
      }
      
      const tokens = JSON.parse(tokensString);
      if (!tokens.accessToken) {
        console.log("No access token found in stored tokens");
        return null;
      }

      return {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error("Error getting auth headers:", error);
      return null;
    }
  };

  const loadFeeData = async () => {
    try {
      updateState({ loading: true, error: null });
      
      const headers = await getAuthHeaders();
      if (!headers) {
        console.log('No auth headers, showing demo data');
        // For demo purposes, show sample data when auth is not available
        const demoData = {
          studentDetails: {
            roll_no: "BMT_250006",
            total_fee: 349000,
            scholarship_amount: 180000,
            additional_amount: 20000,
            final_fee: 149000
          },
          installments: [
            {
              id: 627,
              status: "Paid",
              installment_number: 1,
              installment_name: "11th security deposit",
              discount_amount: null,
              amount: 10000,
              due_date: "2025-04-01T00:00:00.000Z",
              final_fee: 10000,
              order_id: "CA_250006_1_522025"
            },
            {
              id: 628,
              status: "Paid",
              installment_number: 2,
              installment_name: "Class 11th 1st Installment",
              discount_name: "Scholarship",
              discount_amount: 15000,
              amount: 105000,
              due_date: "2025-04-01T00:00:00.000Z",
              final_fee: 90000,
              order_id: "CA_250006_2_522025"
            },
            {
              id: 629,
              status: "UnPaid",
              installment_number: 3,
              installment_name: "11th College Fees",
              discount_amount: null,
              amount: 24500,
              due_date: "2025-06-10T00:00:00.000Z",
              final_fee: 24500,
              order_id: null
            }
          ]
        };
        
        const transformedData = {
          studentDetails: {
            ...demoData.studentDetails,
            student_name: demoData.studentDetails.roll_no || "Student",
            course: "Academic Program",
            academic_year: "2025-26",
            semester: "Current Semester"
          },
          installments: demoData.installments.map(installment => ({
            ...installment,
            status: installment.status === 'UnPaid' ? 'Pending' : installment.status,
            description: installment.installment_name,
            payment_date: installment.paid_at,
            discount_amount: installment.discount_amount || null,
          }))
        };
        
        updateState({
          studentDetails: transformedData.studentDetails,
          installments: transformedData.installments,
          loading: false
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/studentfee`, {
        method: 'GET',
        headers,
      });

      console.log("Student Fee API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Student Fee API data:", data);
      
      if (data.studentDetails && data.installments) {
        // Transform the data to match our component expectations
        const transformedData = {
          studentDetails: {
            ...data.studentDetails,
            student_name: data.studentDetails.roll_no || "Student", // Fallback name
            course: "Academic Program", // Default course info
            academic_year: data.installments[0]?.session?.replace('-', '-') || "2025-26",
            semester: "Current Semester"
          },
          installments: data.installments.map(installment => ({
            ...installment,
            // Map status from API format to our expected format
            status: installment.status === 'UnPaid' ? 'Pending' : installment.status,
            // Add description if missing
            description: installment.installment_name,
            // Map payment date
            payment_date: installment.paid_at,
            // Ensure discount_amount is properly handled
            discount_amount: installment.discount_amount || null,
          }))
        };
        
        updateState({
          studentDetails: transformedData.studentDetails,
          installments: transformedData.installments,
          loading: false
        });
      } else {
        throw new Error('Invalid response format from API');
      }
      
    } catch (error) {
      console.error("Error loading fee data:", error);
      updateState({ 
        loading: false,
        error: error.message || "Failed to load fee data. Please try again."
      });
    }
  };

  const onRefresh = useCallback(async () => {
    updateState({ refreshing: true });
    await loadFeeData();
    updateState({ refreshing: false });
  }, []);

  // Utility Functions
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { 
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString('en-IN') || '0'}`;
  };

  // Payment Logic
  const canPayInstallment = (installment) => {
    const currentIndex = state.installments.findIndex(inst => inst.id === installment.id);
    
    // Check if installment is already paid
    if (installment.status === 'Paid') {
      return false;
    }
    
    // Check if installment has zero final fee (covered by scholarship)
    if (installment.final_fee === 0) {
      return false;
    }
    
    // First installment can always be paid if unpaid
    if (currentIndex === 0) {
      return installment.status === 'Pending' || installment.status === 'UnPaid';
    }
    
    // Check if previous installment is paid
    const previousInstallment = state.installments[currentIndex - 1];
    const isPreviousPaid = previousInstallment.status === 'Paid';
    const isCurrentUnpaid = installment.status === 'Pending' || installment.status === 'UnPaid';
    
    return isPreviousPaid && isCurrentUnpaid;
  };

  const getInstallmentStatusInfo = (installment) => {
    const isPaid = installment.status === 'Paid';
    const isPending = installment.status === 'Pending' || installment.status === 'UnPaid';
    const isLocked = installment.status === 'Locked' || !canPayInstallment(installment);
    const isOverdue = isPending && new Date(installment.due_date) < new Date();

    if (isPaid) {
      return {
        color: theme.colors.paid,
        bgColor: theme.colors.successBg,
        icon: 'check-circle',
        label: 'PAID',
        gradient: [theme.colors.success, '#059669'],
      };
    } else if (isOverdue) {
      return {
        color: theme.colors.overdue,
        bgColor: theme.colors.errorBg,
        icon: 'warning',
        label: 'OVERDUE',
        gradient: [theme.colors.error, '#DC2626'],
      };
    } else if (isLocked) {
      return {
        color: theme.colors.locked,
        bgColor: theme.colors.neutral100,
        icon: 'lock',
        label: 'LOCKED',
        gradient: [theme.colors.locked, theme.colors.neutral500],
      };
    } else {
      return {
        color: theme.colors.pending,
        bgColor: theme.colors.warningBg,
        icon: 'schedule',
        label: 'PENDING',
        gradient: [theme.colors.warning, '#D97706'],
      };
    }
  };

  const handlePayNow = (installment) => {
    if (!canPayInstallment(installment)) {
      const prevInstallmentNumber = installment.installment_number - 1;
      Alert.alert(
        "Payment Locked",
        `Complete payment for installment ${prevInstallmentNumber} before proceeding.`,
        [{ text: "OK" }]
      );
      return;
    }

    Alert.alert(
      "Confirm Payment",
      `Pay ${formatCurrency(installment.final_fee)} for ${installment.installment_name}?\n\nDue: ${formatDate(installment.due_date)}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pay Now", onPress: () => processPayment(installment) }
      ]
    );
  };

  const processPayment = (installment) => {
    updateState({ paymentInProgress: installment.id });
    
    setTimeout(() => {
      Alert.alert("Payment Gateway", "Redirecting to payment gateway...");
      updateState({ paymentInProgress: null });
    }, 2000);
  };

  const handleDownloadReceipt = (installment) => {
    Alert.alert("Download Receipt", `Receipt for ${installment.installment_name} will be downloaded.`);
  };

  // Component Renderers
  const renderFloatingHeader = () => {
    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 120, 150],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });

    const headerTranslateY = scrollY.interpolate({
      inputRange: [0, 120, 150],
      outputRange: [-60, -60, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[
        styles.floatingHeader, 
        { 
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslateY }]
        }
      ]}>
        <View style={styles.floatingHeaderContent}>
          <Text style={styles.floatingHeaderTitle}>Fee Management</Text>
          <TouchableOpacity style={styles.notificationButton} activeOpacity={0.7}>
            <Icon name="more-vert" size={20} color={theme.colors.neutral600} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const renderMainHeader = () => (
    <View style={styles.mainHeader}>
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, theme.typography.displayLarge]}>
          Fee Management
        </Text>
        <Text style={[styles.headerSubtitle, theme.typography.bodyLarge]}>
          Track your academic payments and installments
        </Text>
      </View>
    </View>
  );

  const renderQuickStats = () => {
    if (!state.studentDetails) return null;

    const { final_fee } = state.studentDetails;
    const paidAmount = state.installments
      .filter(inst => inst.status === 'Paid')
      .reduce((sum, inst) => sum + (inst.final_fee || 0), 0);
    const pendingAmount = final_fee - paidAmount;
    const progressPercentage = (paidAmount / final_fee) * 100;

    return (
      <View style={styles.quickStatsContainer}>
        <View style={[styles.statCard, styles.paidStatCard]}>
          <View style={styles.statIconContainer}>
            <LinearGradient
              colors={[theme.colors.success, '#059669']}
              style={styles.statIcon}
            >
              <Icon name="check-circle" size={18} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={[styles.statValue, theme.typography.headlineMedium]}>
            {formatCurrency(paidAmount)}
          </Text>
          <Text style={[styles.statLabel, theme.typography.labelMedium]}>
            Amount Paid
          </Text>
          <View style={styles.statAccent} />
        </View>

        <View style={[styles.statCard, styles.pendingStatCard]}>
          <View style={styles.statIconContainer}>
            <LinearGradient
              colors={[theme.colors.warning, '#D97706']}
              style={styles.statIcon}
            >
              <Icon name="schedule" size={18} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={[styles.statValue, theme.typography.headlineMedium]}>
            {formatCurrency(pendingAmount)}
          </Text>
          <Text style={[styles.statLabel, theme.typography.labelMedium]}>
            Remaining
          </Text>
          <View style={[styles.statAccent, { backgroundColor: theme.colors.warning }]} />
        </View>

        <View style={[styles.statCard, styles.progressStatCard]}>
          <View style={styles.statIconContainer}>
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryLight]}
              style={styles.statIcon}
            >
              <Icon name="trending-up" size={18} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={[styles.statValue, theme.typography.headlineMedium]}>
            {Math.round(progressPercentage)}%
          </Text>
          <Text style={[styles.statLabel, theme.typography.labelMedium]}>
            Progress
          </Text>
          <View style={[styles.statAccent, { backgroundColor: theme.colors.primary }]} />
        </View>
      </View>
    );
  };

  const renderStudentCard = () => {
    if (!state.studentDetails) return null;

    const { student_name, course, academic_year, final_fee } = state.studentDetails;
    const paidAmount = state.installments
      .filter(inst => inst.status === 'Paid')
      .reduce((sum, inst) => sum + (inst.final_fee || 0), 0);
    const progressPercentage = (paidAmount / final_fee) * 100;

    return (
      <Animated.View style={[
        styles.studentCard,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryLight, theme.colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.studentCardGradient}
        >
          {/* Floating Elements */}
          <View style={styles.floatingElements}>
            <View style={[styles.floatingDot, styles.dot1]} />
            <View style={[styles.floatingDot, styles.dot2]} />
            <View style={[styles.floatingDot, styles.dot3]} />
          </View>

          <View style={styles.studentCardContent}>
            <View style={styles.studentInfo}>
              <View style={styles.studentAvatarContainer}>
                <LinearGradient
                  colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.1)']}
                  style={styles.studentAvatar}
                >
                  <Text style={styles.avatarText}>
                    {student_name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </LinearGradient>
                <View style={styles.avatarRing} />
              </View>
              <View style={styles.studentDetails}>
                <Text style={[styles.studentName, theme.typography.headlineLarge]}>
                  {student_name}
                </Text>
                <Text style={styles.courseText}>{course}</Text>
                <View style={styles.yearBadge}>
                  <Text style={styles.yearText}>AY {academic_year}</Text>
                </View>
              </View>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Payment Progress</Text>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressPercent}>{Math.round(progressPercentage)}%</Text>
                </View>
              </View>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${progressPercentage}%`]
                      })
                    }
                  ]}
                />
                <View style={styles.progressGlow} />
              </View>
              <View style={styles.amountInfo}>
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Paid</Text>
                  <Text style={styles.amountValue}>{formatCurrency(paidAmount)}</Text>
                </View>
                <View style={styles.amountDivider} />
                <View style={styles.amountItem}>
                  <Text style={styles.amountLabel}>Total</Text>
                  <Text style={styles.amountValue}>{formatCurrency(final_fee)}</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderInstallmentCard = (installment, index) => {
    const statusInfo = getInstallmentStatusInfo(installment);
    const canPay = canPayInstallment(installment);
    const isProcessing = state.paymentInProgress === installment.id;

    return (
      <Animated.View
        key={installment.id}
        style={[
          styles.installmentCard,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [30 * (index + 1), 0]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.cardContainer}
          activeOpacity={0.98}
          disabled={installment.status === 'Paid'}
        >
          {/* Status Border */}
          <LinearGradient
            colors={[statusInfo.color, statusInfo.color + '80']}
            style={styles.statusBorder}
          />

          <View style={styles.cardHeader}>
            <View style={styles.installmentMeta}>
              <LinearGradient
                colors={statusInfo.gradient}
                style={styles.installmentBadge}
              >
                <Text style={styles.badgeNumber}>{installment.installment_number}</Text>
                <View style={styles.badgeGlow} />
              </LinearGradient>
              <View style={styles.installmentInfo}>
                <Text style={[styles.installmentTitle, theme.typography.titleLarge]}>
                  {installment.installment_name}
                </Text>
                <Text style={[styles.installmentDesc, theme.typography.bodyMedium]}>
                  {installment.description}
                </Text>
                <View style={styles.dateContainer}>
                  <Icon name="schedule" size={14} color={theme.colors.neutral500} />
                  <Text style={[styles.dueDate, theme.typography.labelMedium]}>
                    Due: {formatDate(installment.due_date)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.statusChip, { backgroundColor: statusInfo.bgColor }]}>
              <Icon name={statusInfo.icon} size={14} color={statusInfo.color} />
              <Text style={[styles.statusLabel, { color: statusInfo.color }]}>
                {statusInfo.label}
              </Text>
            </View>
          </View>

          <View style={styles.amountSection}>
            {installment.discount_amount && installment.discount_amount > 0 && (
              <View style={styles.discountContainer}>
                <View style={styles.discountRow}>
                  <Text style={styles.originalAmount}>
                    ₹{installment.amount.toLocaleString('en-IN')}
                  </Text>
                  <LinearGradient
                    colors={[theme.colors.success, '#059669']}
                    style={styles.discountBadge}
                  >
                    <Icon name="local-offer" size={12} color="#FFFFFF" />
                    <Text style={styles.discountText}>
                      {installment.discount_name || 'Discount'}: -{formatCurrency(installment.discount_amount)}
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            )}
            
            <View style={styles.finalAmountContainer}>
              <View style={styles.finalAmountRow}>
                <Text style={[styles.amountLabel, theme.typography.bodyLarge]}>
                  {installment.status === 'Paid' ? 'Amount Paid' : 'Amount Due'}
                </Text>
                <Text style={[styles.finalAmount, theme.typography.displayMedium, { color: statusInfo.color }]}>
                  {installment.final_fee === 0 ? 'Free' : formatCurrency(installment.final_fee)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionSection}>
            {installment.status === 'Paid' ? (
              <View style={styles.paidSection}>
                <TouchableOpacity 
                  style={styles.receiptButton}
                  onPress={() => handleDownloadReceipt(installment)}
                >
                  <LinearGradient
                    colors={[theme.colors.successBg, theme.colors.successBg]}
                    style={styles.receiptButtonBg}
                  >
                    <Icon name="receipt" size={18} color={theme.colors.success} />
                    <Text style={styles.receiptText}>Download Receipt</Text>
                  </LinearGradient>
                </TouchableOpacity>
                <View style={styles.paidDateContainer}>
                  <Icon name="check-circle" size={14} color={theme.colors.success} />
                  <Text style={styles.paidDate}>
                    {installment.paid_at ? `Paid on ${formatDate(installment.paid_at)}` : 'Payment completed'}
                  </Text>
                </View>
              </View>
            ) : installment.final_fee > 0 ? (
              <TouchableOpacity
                style={[
                  styles.payButton,
                  !canPay && styles.lockedButton
                ]}
                onPress={() => handlePayNow(installment)}
                disabled={!canPay || isProcessing}
              >
                <LinearGradient
                  colors={!canPay ? [theme.colors.neutral300, theme.colors.neutral400] : statusInfo.gradient}
                  style={styles.payButtonGradient}
                >
                  <Icon 
                    name={isProcessing ? "sync" : !canPay ? "lock" : "payment"} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                  <Text style={styles.payButtonText}>
                    {isProcessing ? 'Processing...' : !canPay ? 'Locked' : 'Pay Now'}
                  </Text>
                  {canPay && !isProcessing && <View style={styles.buttonGlow} />}
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.scholarshipContainer}>
                <LinearGradient
                  colors={[theme.colors.successBg, theme.colors.successBg]}
                  style={styles.scholarshipBadge}
                >
                  <Icon name="school" size={18} color={theme.colors.success} />
                  <Text style={styles.scholarshipText}>
                    {installment.discount_name ? `Covered by ${installment.discount_name}` : 'Covered by Scholarship'}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {!canPay && installment.status !== 'Paid' && installment.final_fee > 0 && installment.installment_number > 1 && (
              <View style={styles.lockMessageContainer}>
                <Icon name="info" size={14} color={theme.colors.neutral500} />
                <Text style={styles.lockHint}>
                  Complete previous payment to unlock
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderInstallmentsSection = () => (
    <View style={styles.installmentsSection}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, theme.typography.headlineLarge]}>
          Fee Installments
        </Text>
        <View style={styles.installmentCounter}>
          <Text style={styles.counterText}>{state.installments.length}</Text>
        </View>
      </View>

      <View style={styles.installmentsList}>
        {state.installments.map((installment, index) => 
          renderInstallmentCard(installment, index)
        )}
      </View>
    </View>
  );

  const renderLoadingScreen = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFF" />
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          
          {/* Fixed Modern Loader */}
          <View style={styles.modernLoader}>
            
            {/* Outer rotating ring */}
            <Animated.View style={[
              styles.outerRing,
              {
                transform: [{
                  rotate: loadingRotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })
                }]
              }
            ]}>
              <View style={styles.ringBorder} />
            </Animated.View>

            {/* Middle pulsing circle */}
            <Animated.View style={[
              styles.middleCircle,
              {
                transform: [{ scale: loadingPulseAnim }]
              }
            ]}>
              <View style={styles.middleBackground} />
            </Animated.View>

            {/* Main wallet icon */}
            <Animated.View style={[
              styles.walletIconContainer,
              {
                transform: [
                  { scale: loadingPulseAnim.interpolate({
                    inputRange: [1, 1.2],
                    outputRange: [1, 0.9]
                  })}
                ]
              }
            ]}>
              <View style={styles.walletIconBg}>
                <Icon name="account-balance-wallet" size={20} color="#667EEA" />
              </View>
              
              {/* Shimmer effect overlay */}
              <Animated.View style={[
                styles.shimmerOverlay,
                {
                  transform: [{
                    translateX: loadingShimmerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-30, 30]
                    })
                  }]
                }
              ]} />
            </Animated.View>

            {/* Fixed Floating currency symbols */}
            <Animated.View style={[
              styles.floatingElement,
              styles.currency1,
              {
                opacity: loadingFloatAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.7, 1, 0.7]
                })
              }
            ]}>
              <Text style={styles.currencySymbol}>₹</Text>
            </Animated.View>

            <Animated.View style={[
              styles.floatingElement,
              styles.currency2,
              {
                opacity: loadingFloatAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.5, 0.9, 0.5]
                })
              }
            ]}>
              <Icon name="payments" size={12} color="#10D876" />
            </Animated.View>

            <Animated.View style={[
              styles.floatingElement,
              styles.currency3,
              {
                opacity: loadingFloatAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.6, 1, 0.6]
                })
              }
            ]}>
              <Icon name="credit-card" size={10} color="#FBBF24" />
            </Animated.View>
          </View>

          {/* Loading text */}
          <View style={styles.loadingTextContainer}>
            <Text style={[styles.loadingText, theme.typography.titleLarge]}>
              Loading Fee Details
            </Text>
            <Animated.View style={[
              styles.loadingDots,
              {
                opacity: loadingShimmerAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [0.3, 1, 0.3]
                })
              }
            ]}>
              <Text style={styles.dotsText}>...</Text>
            </Animated.View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarContainer}>
            <Animated.View style={[
              styles.progressBar,
              {
                width: loadingProgressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]} />
          </View>
        </View>
      </View>
    </View>
  );

  const renderErrorScreen = () => (
    <SafeAreaView style={styles.fullScreenContainer}>
      <View style={styles.errorContainer}>
        <View style={styles.errorContent}>
          <View style={styles.errorIcon}>
            <Icon name="error-outline" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.errorTitle, theme.typography.headlineMedium]}>
            Unable to Load Fee Details
          </Text>
          <Text style={[styles.errorText, theme.typography.bodyLarge]}>
            {state.error}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={loadFeeData}
          >
            <View style={styles.retryButtonGradient}>
              <Icon name="refresh" size={18} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );

  // Main Render
  if (state.loading) {
    return renderLoadingScreen();
  }

  if (state.error) {
    return renderErrorScreen();
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {renderFloatingHeader()}
      
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={state.refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
        contentInsetAdjustmentBehavior="automatic"
        automaticallyAdjustContentInsets={true}
        contentInset={{ bottom: 80 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        bounces={true}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
      >
        {renderMainHeader()}
        {renderQuickStats()}
        {renderStudentCard()}
        {renderInstallmentsSection()}
        
        {/* Extra bottom spacing for floating navigation bar */}
        <View style={styles.navigationBarSpacing} />
        
        {/* Additional safety padding */}
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFF',
    position: 'relative',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },

  // Floating Header
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(248, 250, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingTop: 12,
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 56,
  },
  floatingHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: '#1E293B',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading Screen - Fixed centering
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFBFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    minHeight: height,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
    maxWidth: 300,
  },

  // Modern Loader - Fixed size and positioning
  modernLoader: {
    width: Math.min(100, width * 0.25),
    height: Math.min(100, width * 0.25),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
    marginVertical: 20,
  },
  outerRing: {
    position: 'absolute',
    width: '85%',
    height: '85%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: 'transparent',
    borderTopColor: '#667EEA',
    borderRightColor: '#7C3AED',
    borderBottomColor: '#667EEA',
    borderLeftColor: '#7C3AED',
  },
  middleCircle: {
    position: 'absolute',
    width: '65%',
    height: '65%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#7C3AED',
    opacity: 0.15,
  },
  walletIconContainer: {
    width: '45%',
    height: '45%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(15, 23, 42, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
    zIndex: 2,
  },
  walletIconBg: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: '-50%',
    width: '50%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    transform: [{ skewX: '-20deg' }],
  },

  // Fixed Floating Elements
  floatingElement: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  currency1: {
    top: '10%',
    left: '15%',
  },
  currency2: {
    bottom: '15%',
    right: '10%',
  },
  currency3: {
    top: '20%',
    right: '20%',
  },
  currencySymbol: {
    fontSize: 14,
    fontWeight: '800',
    color: '#667EEA',
  },

  // Loading Text
  loadingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
  },
  loadingText: {
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
  },
  loadingDots: {
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotsText: {
    fontSize: 16,
    color: '#667EEA',
    fontWeight: '700',
  },

  // Progress Bar
  progressBarContainer: {
    width: '80%',
    maxWidth: 200,
    height: 3,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667EEA',
    borderRadius: 2,
  },

  // Error Screen
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FAFBFF',
  },
  errorContent: {
    alignItems: 'center',
    gap: 32,
    maxWidth: 320,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F87171',
    shadowColor: 'rgba(15, 23, 42, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  errorTitle: {
    color: '#0F172A',
    textAlign: 'center',
  },
  errorText: {
    color: '#475569',
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    backgroundColor: '#667EEA',
    borderRadius: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Scroll View
  scrollView: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  // Main Header
  mainHeader: {
    paddingTop: 24,
    paddingBottom: 32,
    marginTop: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#475569',
    textAlign: 'center',
    maxWidth: width * 0.8,
  },

  // Quick Stats
  quickStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: 'rgba(15, 23, 42, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  paidStatCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#10D876',
  },
  pendingStatCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FBBF24',
  },
  progressStatCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#667EEA',
  },
  statIconContainer: {
    marginBottom: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  statLabel: {
    color: '#475569',
    textAlign: 'center',
  },
  statAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#10D876',
  },

  // Student Card
  studentCard: {
    marginBottom: 32,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: 'rgba(15, 23, 42, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  studentCardGradient: {
    padding: 24,
    position: 'relative',
  },
  floatingElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingDot: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 999,
  },
  dot1: {
    width: 120,
    height: 120,
    top: -60,
    right: -30,
  },
  dot2: {
    width: 80,
    height: 80,
    bottom: -40,
    left: -20,
  },
  dot3: {
    width: 40,
    height: 40,
    top: '30%',
    right: '20%',
  },
  studentCardContent: {
    gap: 20,
    position: 'relative',
    zIndex: 1,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  studentAvatar: {
    width: 70,
    height: 70,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  courseText: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    fontWeight: '500',
  },
  yearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Progress
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  progressBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
    borderRadius: 8,
  },
  amountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountItem: {
    flex: 1,
    alignItems: 'center',
  },
  amountDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  amountLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Installments Section
  installmentsSection: {
    marginBottom: 32,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionTitle: {
    color: '#0F172A',
    fontWeight: '800',
  },
  installmentCounter: {
    backgroundColor: '#667EEA',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 40,
    alignItems: 'center',
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  counterText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '800',
  },

  // Installment Cards
  installmentsList: {
    gap: 20,
  },
  installmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: 'rgba(15, 23, 42, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  cardContainer: {
    padding: 24,
    position: 'relative',
  },
  statusBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  installmentMeta: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 16,
  },
  installmentBadge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeNumber: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    color: '#FFFFFF',
    fontWeight: '900',
    position: 'relative',
    zIndex: 1,
  },
  badgeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  installmentInfo: {
    flex: 1,
  },
  installmentTitle: {
    color: '#0F172A',
    marginBottom: 8,
    fontWeight: '700',
  },
  installmentDesc: {
    color: '#475569',
    marginBottom: 12,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDate: {
    color: '#64748B',
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Amount Section
  amountSection: {
    marginBottom: 20,
  },
  discountContainer: {
    marginBottom: 16,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
  },
  originalAmount: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    color: '#64748B',
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  finalAmountContainer: {
    backgroundColor: '#F7F9FC',
    borderRadius: 20,
    padding: 20,
  },
  finalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    color: '#475569',
    fontWeight: '600',
  },
  finalAmount: {
    fontWeight: '900',
  },

  // Action Section
  actionSection: {
    gap: 16,
  },
  paidSection: {
    gap: 16,
  },
  receiptButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(15, 23, 42, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  receiptButtonBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 2,
    borderColor: '#10D876',
  },
  receiptText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#10D876',
    fontWeight: '700',
  },
  paidDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  paidDate: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#64748B',
  },
  payButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(15, 23, 42, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 8,
  },
  lockedButton: {
    opacity: 0.7,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
    position: 'relative',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  scholarshipContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  scholarshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 12,
    borderWidth: 2,
    borderColor: '#10D876',
  },
  scholarshipText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: '#10D876',
    fontWeight: '700',
  },
  lockMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 16,
  },
  lockHint: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#64748B',
    fontStyle: 'italic',
  },

  // Bottom Padding
  bottomPadding: {
    height: 100,
    backgroundColor: 'transparent',
  },

  // Navigation Bar Spacing
  navigationBarSpacing: {
    height: 80,
    backgroundColor: 'transparent',
  },
});

export default ModernFeeScreen;