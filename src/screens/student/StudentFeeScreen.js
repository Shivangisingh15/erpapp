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
      shadowColor: theme?.colors?.shadow || 'rgba(15, 23, 42, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 4,
    },
    soft: {
      shadowColor: theme?.colors?.shadow || 'rgba(15, 23, 42, 0.08)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: theme?.colors?.shadowLarge || 'rgba(15, 23, 42, 0.15)',
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

  // Animation References
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const loadFeeData = async () => {
    try {
      updateState({ loading: true, error: null });
      
      // Demo data with enhanced structure
      const demoData = {
        studentDetails: {
          roll_no: "BMT_250006",
          student_name: "Varad Sharma",
          total_fee: 349000,
          scholarship_amount: 180000,
          additional_amount: 20000,
          final_fee: 149000,
          academic_year: "2025-26",
          course: "B.Tech Computer Science",
          semester: "2nd Semester"
        },
        installments: [
          {
            id: 627,
            status: "Paid",
            installment_number: 1,
            installment_name: "Security Deposit",
            discount_amount: null,
            amount: 10000,
            due_date: "2025-04-01T00:00:00.000Z",
            final_fee: 10000,
            order_id: "CA_250006_1_522025",
            payment_date: "2025-03-28T00:00:00.000Z",
            description: "One-time refundable security deposit"
          },
          {
            id: 628,
            status: "Paid",
            installment_number: 2,
            installment_name: "1st Semester Fee",
            discount_amount: 15000,
            amount: 105000,
            due_date: "2025-06-01T00:00:00.000Z",
            final_fee: 90000,
            order_id: "CA_250006_2_522025",
            payment_date: "2025-05-25T00:00:00.000Z",
            description: "Tuition and academic fees for semester 1"
          },
          {
            id: 629,
            status: "Pending",
            installment_number: 3,
            installment_name: "2nd Semester Fee",
            discount_amount: null,
            amount: 24500,
            due_date: "2025-08-10T00:00:00.000Z",
            final_fee: 24500,
            order_id: null,
            description: "Tuition and academic fees for semester 2"
          },
          {
            id: 630,
            status: "Locked",
            installment_number: 4,
            installment_name: "Examination Fee",
            discount_amount: 2000,
            amount: 12000,
            due_date: "2025-10-15T00:00:00.000Z",
            final_fee: 10000,
            order_id: null,
            description: "Annual examination and certification fees"
          }
        ]
      };
      
      updateState({
        studentDetails: demoData.studentDetails,
        installments: demoData.installments,
        loading: false
      });
      
    } catch (error) {
      console.error("Error loading fee data:", error);
      updateState({ 
        loading: false,
        error: "Failed to load fee data. Please try again."
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
    
    if (currentIndex === 0) {
      return installment.status === 'Pending';
    }
    
    const previousInstallment = state.installments[currentIndex - 1];
    return previousInstallment.status === 'Paid' && installment.status === 'Pending';
  };

  const getInstallmentStatusInfo = (installment) => {
    const isPaid = installment.status === 'Paid';
    const isPending = installment.status === 'Pending';
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
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.floatingHeader, { opacity: headerOpacity }]}>
        <View style={styles.floatingHeaderContent}>
          <Text style={styles.floatingHeaderTitle}>Fee Management</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-none" size={20} color={theme.colors.neutral600} />
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
            {installment.discount_amount && (
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
                      -{formatCurrency(installment.discount_amount)}
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
                  {formatCurrency(installment.final_fee)}
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
                    Paid on {formatDate(installment.payment_date)}
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
                  <Text style={styles.scholarshipText}>Covered by Scholarship</Text>
                </LinearGradient>
              </View>
            )}

            {!canPay && installment.status !== 'Paid' && installment.installment_number > 1 && (
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

  const renderLoadingScreen = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primaryLight]}
            style={styles.loadingIcon}
          >
            <Icon name="account-balance-wallet" size={32} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.loadingText, theme.typography.bodyLarge]}>
            Loading fee details...
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );

  // Main Render
  if (state.loading) {
    return renderLoadingScreen();
  }

  return (
    <SafeAreaView style={styles.container}>
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
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {renderMainHeader()}
        {renderQuickStats()}
        {renderStudentCard()}
        
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
        
        <View style={styles.bottomPadding} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // Floating Header
  floatingHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral200,
  },
  floatingHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  floatingHeaderTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.neutral800,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Loading Screen
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    gap: theme.spacing.xl,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  loadingText: {
    color: theme.colors.neutral600,
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
  },

  // Main Header
  mainHeader: {
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.colors.neutral900,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: theme.colors.neutral600,
    textAlign: 'center',
    maxWidth: width * 0.8,
  },

  // Quick Stats
  quickStatsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xxxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  paidStatCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  pendingStatCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  progressStatCard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  statIconContainer: {
    marginBottom: theme.spacing.lg,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  statValue: {
    color: theme.colors.neutral900,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  statLabel: {
    color: theme.colors.neutral600,
    textAlign: 'center',
  },
  statAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.success,
  },

  // Student Card
  studentCard: {
    marginBottom: theme.spacing.xxxl,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  studentCardGradient: {
    padding: theme.spacing.xxl,
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
    borderRadius: theme.borderRadius.full,
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
    gap: theme.spacing.xl,
    position: 'relative',
    zIndex: 1,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentAvatarContainer: {
    position: 'relative',
    marginRight: theme.spacing.xl,
  },
  studentAvatar: {
    width: 70,
    height: 70,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.soft,
  },
  avatarRing: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: theme.borderRadius.full,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarText: {
    ...theme.typography.headlineMedium,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  courseText: {
    ...theme.typography.bodyLarge,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.spacing.sm,
    fontWeight: '500',
  },
  yearBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    alignSelf: 'flex-start',
  },
  yearText: {
    ...theme.typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Progress
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    backdropFilter: 'blur(10px)',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressLabel: {
    ...theme.typography.titleMedium,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  progressBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
  },
  progressPercent: {
    ...theme.typography.titleMedium,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  progressTrack: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.sm,
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
    borderRadius: theme.borderRadius.sm,
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
    marginHorizontal: theme.spacing.lg,
  },
  amountLabel: {
    ...theme.typography.labelMedium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: theme.spacing.xs,
  },
  amountValue: {
    ...theme.typography.titleLarge,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Installments Section
  installmentsSection: {
    marginBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.neutral900,
  },
  installmentCounter: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    minWidth: 32,
    alignItems: 'center',
  },
  counterText: {
    ...theme.typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Installment Cards
  installmentsList: {
    gap: theme.spacing.xl,
  },
  installmentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xxl,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  cardContainer: {
    padding: theme.spacing.xxl,
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
    marginBottom: theme.spacing.xl,
  },
  installmentMeta: {
    flexDirection: 'row',
    flex: 1,
    marginRight: theme.spacing.lg,
  },
  installmentBadge: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    position: 'relative',
    ...theme.shadows.soft,
  },
  badgeNumber: {
    ...theme.typography.headlineMedium,
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
    borderRadius: theme.borderRadius.lg,
  },
  installmentInfo: {
    flex: 1,
  },
  installmentTitle: {
    color: theme.colors.neutral900,
    marginBottom: theme.spacing.sm,
    fontWeight: '700',
  },
  installmentDesc: {
    color: theme.colors.neutral600,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  dueDate: {
    color: theme.colors.neutral500,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    gap: theme.spacing.sm,
    ...theme.shadows.soft,
  },
  statusLabel: {
    ...theme.typography.labelSmall,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Amount Section
  amountSection: {
    marginBottom: theme.spacing.xl,
  },
  discountContainer: {
    marginBottom: theme.spacing.lg,
  },
  discountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral50,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  originalAmount: {
    ...theme.typography.bodyLarge,
    color: theme.colors.neutral500,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  discountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing.xs,
    ...theme.shadows.soft,
  },
  discountText: {
    ...theme.typography.labelMedium,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  finalAmountContainer: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
  },
  finalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    color: theme.colors.neutral600,
    fontWeight: '600',
  },
  finalAmount: {
    fontWeight: '900',
  },

  // Action Section
  actionSection: {
    gap: theme.spacing.lg,
  },
  paidSection: {
    gap: theme.spacing.lg,
  },
  receiptButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.soft,
  },
  receiptButtonBg: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  receiptText: {
    ...theme.typography.titleMedium,
    color: theme.colors.success,
    fontWeight: '700',
  },
  paidDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  paidDate: {
    ...theme.typography.labelLarge,
    color: theme.colors.neutral500,
  },
  payButton: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  lockedButton: {
    opacity: 0.7,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.md,
    position: 'relative',
  },
  payButtonText: {
    ...theme.typography.titleMedium,
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
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  scholarshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.success,
  },
  scholarshipText: {
    ...theme.typography.titleMedium,
    color: theme.colors.success,
    fontWeight: '700',
  },
  lockMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.neutral100,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  lockHint: {
    ...theme.typography.labelLarge,
    color: theme.colors.neutral500,
    fontStyle: 'italic',
  },

  // Bottom Padding
  bottomPadding: {
    height: theme.spacing.xxxxxl,
  },
});

export default ModernFeeScreen;