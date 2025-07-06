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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/common/Header";

const { width, height } = Dimensions.get('window');

// Modern Theme to match dashboard
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

const StudentFeeScreen = () => {
  // State Management
  const [state, setState] = useState({
    loading: true,
    refreshing: false,
    studentDetails: null,
    installments: [],
    error: null,
  });

  // Animation References
  const animations = {
    fadeAnim: useRef(new Animated.Value(0)).current,
    slideAnim: useRef(new Animated.Value(50)).current,
    shimmer: useRef(new Animated.Value(0)).current,
    cardStagger: useRef(new Animated.Value(0)).current,
    floatingElements: useRef(new Animated.Value(0)).current,
    summaryPulse: useRef(new Animated.Value(1)).current,
  };

  // Update state helper
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
    console.log("Starting fee screen animations...");
    
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

    // Staggered card animations
    setTimeout(() => {
      Animated.timing(animations.cardStagger, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    // Continuous shimmer animation
    const continuousShimmer = () => {
      animations.shimmer.setValue(0);
      Animated.timing(animations.shimmer, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(continuousShimmer, 500);
      });
    };
    continuousShimmer();

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

    // Summary pulse animation
    const summaryPulseLoop = () => {
      Animated.sequence([
        Animated.timing(animations.summaryPulse, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.summaryPulse, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]).start(summaryPulseLoop);
    };
    summaryPulseLoop();
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

  const loadFeeData = async () => {
    try {
      updateState({ loading: true, error: null });
      
      const headers = await getAuthHeaders();
      if (!headers) {
        updateState({ 
          studentDetails: getDemoStudentDetails(),
          installments: getDemoInstallments(),
          loading: false 
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/studentfee`, {
        method: 'GET',
        headers,
      });

      console.log("Student Fee API response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Student Fee API data:", data);
        
        updateState({
          studentDetails: data.studentDetails || getDemoStudentDetails(),
          installments: data.installments || getDemoInstallments(),
          loading: false
        });
      } else {
        console.log("Student Fee API failed, using demo data");
        updateState({ 
          studentDetails: getDemoStudentDetails(),
          installments: getDemoInstallments(),
          loading: false 
        });
      }
    } catch (error) {
      console.error("Error loading fee data:", error);
      updateState({ 
        studentDetails: getDemoStudentDetails(),
        installments: getDemoInstallments(),
        loading: false,
        error: "Failed to load fee data. Please try again."
      });
    }
  };

  const getDemoStudentDetails = () => ({
    roll_no: "BMT_250006",
    total_fee: 349000,
    scholarship_amount: 180000,
    additial_amount: 20000,
    final_fee: 149000
  });

  const getDemoInstallments = () => [
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
  ];

  const onRefresh = useCallback(async () => {
    updateState({ refreshing: true });
    await loadFeeData();
    updateState({ refreshing: false });
  }, []);

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

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString() || '0'}`;
  };

  const getStatusColor = (status) => {
    return status === 'Paid' ? colors.success : colors.warning;
  };

  const handlePayNow = (installment) => {
    Alert.alert(
      "Payment",
      `Proceed to pay ${formatCurrency(installment.final_fee)} for ${installment.installment_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Pay Now", onPress: () => processPayment(installment) }
      ]
    );
  };

  const processPayment = (installment) => {
    // Implement payment processing logic here
    console.log("Processing payment for installment:", installment.id);
    Alert.alert("Payment", "Payment gateway integration would be implemented here.");
  };

  const handleDownloadReceipt = (installment) => {
    console.log("Downloading receipt for installment:", installment.id);
    Alert.alert("Receipt", "Receipt download would be implemented here.");
  };

  // Component Renderers
  const renderFloatingDecorations = () => (
    <View style={styles.floatingDecorations}>
      <Animated.View 
        style={[
          styles.floatingCircle, 
          styles.circle1,
          {
            transform: [{
              translateY: animations.floatingElements.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -25]
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
                outputRange: [0, 20]
              })
            }, {
              scale: animations.floatingElements.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.3, 1]
              })
            }]
          }
        ]}
      />
      <Animated.View 
        style={[
          styles.diamond, 
          styles.diamond1,
          {
            transform: [{
              rotate: animations.floatingElements.interpolate({
                inputRange: [0, 1],
                outputRange: ['45deg', '405deg']
              })
            }]
          }
        ]}
      />
    </View>
  );

  const renderLoadingScreen = () => (
    <SafeAreaView style={styles.container}>
      <Header title="Fee Details" />
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
            <Icon name="account-balance-wallet" size={40} color={colors.white} />
          </Animated.View>
        </LinearGradient>
        <Text style={styles.loadingText}>Loading fee details...</Text>
      </View>
    </SafeAreaView>
  );

  const renderSummaryCard = () => {
    if (!state.studentDetails) return null;

    const { total_fee, scholarship_amount, additial_amount, final_fee } = state.studentDetails;
    const paidAmount = state.installments
      .filter(inst => inst.status === 'Paid')
      .reduce((sum, inst) => sum + (inst.final_fee || 0), 0);

    const pendingAmount = final_fee - paidAmount;

    return (
      <Animated.View style={[styles.summaryContainer, { 
        opacity: animations.fadeAnim,
        transform: [
          { translateY: animations.slideAnim },
          { scale: animations.summaryPulse }
        ]
      }]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight, colors.accent]}
          style={styles.summaryGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Enhanced Shimmer Effect */}
          <Animated.View
            style={[
              styles.summaryShimmer,
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

          <View style={styles.summaryContent}>
            {/* Header */}
            <View style={styles.summaryHeader}>
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                style={styles.summaryIcon}
              >
                <Icon name="account-balance-wallet" size={24} color={colors.white} />
              </LinearGradient>
              <View style={styles.summaryHeaderText}>
                <Text style={styles.summaryTitle}>Fee Summary</Text>
                <Text style={styles.summarySubtitle}>Academic Year 2025-26</Text>
              </View>
            </View>

            {/* Main Stats */}
            <View style={styles.summaryStats}>
              <View style={styles.mainStat}>
                <Text style={styles.mainStatLabel}>Total Payable</Text>
                <Text style={styles.mainStatValue}>{formatCurrency(final_fee)}</Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatCurrency(total_fee)}</Text>
                  <Text style={styles.statLabel}>Total Fee</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatCurrency(scholarship_amount)}</Text>
                  <Text style={styles.statLabel}>Scholarship</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatCurrency(paidAmount)}</Text>
                  <Text style={styles.statLabel}>Paid</Text>
                </View>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(paidAmount / final_fee) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round((paidAmount / final_fee) * 100)}% Completed
              </Text>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderInstallmentCard = (installment, index) => {
    const isPaid = installment.status === 'Paid';
    const isOverdue = !isPaid && new Date(installment.due_date) < new Date();
    
    return (
      <Animated.View
        key={installment.id}
        style={[
          styles.installmentCard,
          {
            opacity: animations.cardStagger,
            transform: [{
              translateY: animations.cardStagger.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })
            }]
          }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.installmentContent,
            isPaid && styles.paidCard,
            isOverdue && styles.overdueCard
          ]}
          activeOpacity={0.9}
        >
          {isPaid ? (
            <LinearGradient
              colors={[colors.success, colors.emerald]}
              style={styles.installmentGradient}
            >
              <View style={styles.installmentHeader}>
                <View style={styles.installmentNumber}>
                  <Text style={styles.installmentNumberText}>{installment.installment_number}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Icon name="check-circle" size={16} color={colors.white} />
                  <Text style={styles.statusText}>PAID</Text>
                </View>
              </View>
              <Text style={[styles.installmentName, styles.whiteText]}>{installment.installment_name}</Text>
              <View style={styles.amountRow}>
                <Text style={[styles.amountLabel, styles.whiteText]}>Amount Paid</Text>
                <Text style={[styles.amountValue, styles.whiteText]}>{formatCurrency(installment.final_fee)}</Text>
              </View>
              <Text style={[styles.dueDate, styles.whiteTextMuted]}>
                Paid on {formatDate(installment.due_date)}
              </Text>
            </LinearGradient>
          ) : (
            <View style={styles.unpaidContent}>
              <View style={[styles.priorityStripe, { backgroundColor: isOverdue ? colors.error : colors.warning }]} />
              <View style={styles.installmentMain}>
                <View style={styles.installmentHeader}>
                  <View style={styles.installmentNumber}>
                    <Text style={styles.installmentNumberText}>{installment.installment_number}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: isOverdue ? colors.error + '20' : colors.warning + '20' }]}>
                    <Icon name={isOverdue ? "warning" : "schedule"} size={16} color={isOverdue ? colors.error : colors.warning} />
                    <Text style={[styles.statusText, { color: isOverdue ? colors.error : colors.warning }]}>
                      {isOverdue ? 'OVERDUE' : 'PENDING'}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.installmentName}>{installment.installment_name}</Text>
                
                <View style={styles.feeBreakdown}>
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Original Amount</Text>
                    <Text style={styles.originalAmount}>{formatCurrency(installment.amount)}</Text>
                  </View>
                  {installment.discount_amount && (
                    <View style={styles.amountRow}>
                      <Text style={styles.discountLabel}>Discount Applied</Text>
                      <Text style={styles.discountValue}>-{formatCurrency(installment.discount_amount)}</Text>
                    </View>
                  )}
                  <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Final Amount</Text>
                    <Text style={styles.amountValue}>{formatCurrency(installment.final_fee)}</Text>
                  </View>
                </View>
                
                <Text style={[styles.dueDate, isOverdue && styles.overdueDateText]}>
                  Due Date: {formatDate(installment.due_date)}
                </Text>
              </View>
            </View>
          )}

          {/* Action Button */}
          <View style={styles.actionContainer}>
            {isPaid ? (
              <TouchableOpacity 
                style={styles.receiptButton}
                onPress={() => handleDownloadReceipt(installment)}
              >
                <Icon name="receipt" size={18} color={colors.success} />
                <Text style={styles.receiptButtonText}>Download Receipt</Text>
              </TouchableOpacity>
            ) : installment.final_fee > 0 ? (
              <TouchableOpacity 
                style={[styles.payButton, isOverdue && styles.urgentPayButton]}
                onPress={() => handlePayNow(installment)}
              >
                <LinearGradient
                  colors={isOverdue ? [colors.error, colors.rose] : [colors.primary, colors.primaryLight]}
                  style={styles.payButtonGradient}
                >
                  <Icon name="payment" size={18} color={colors.white} />
                  <Text style={styles.payButtonText}>
                    {isOverdue ? 'Pay Overdue' : 'Pay Now'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ) : (
              <View style={styles.noPaymentRequired}>
                <Icon name="card-giftcard" size={18} color={colors.success} />
                <Text style={styles.noPaymentText}>Covered by Scholarship</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Main Render
  if (state.loading) {
    return renderLoadingScreen();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Fee Details" />
      
      {/* Floating Decorations */}
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
        {/* Enhanced Summary Card */}
        {renderSummaryCard()}

        {/* Installments Section */}
        <Animated.View style={[styles.installmentsSection, { opacity: animations.fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <LinearGradient
              colors={[colors.indigo, colors.purple]}
              style={styles.sectionIcon}
            >
              <Icon name="receipt-long" size={18} color={colors.white} />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Fee Installments</Text>
            <View style={styles.installmentCount}>
              <Text style={styles.countText}>{state.installments.length}</Text>
            </View>
          </View>

          <View style={styles.installmentsContainer}>
            {state.installments.map((installment, index) => 
              renderInstallmentCard(installment, index)
            )}
          </View>
        </Animated.View>

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

  // Floating Decorations
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
    backgroundColor: 'rgba(30, 64, 175, 0.05)',
    top: 120,
    right: -30,
    borderWidth: 2,
    borderColor: 'rgba(30, 64, 175, 0.1)',
  },
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    bottom: 200,
    left: -20,
  },
  diamond: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    transform: [{ rotate: '45deg' }],
  },
  diamond1: {
    top: 300,
    right: width * 0.1,
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

  // Enhanced Summary Card
  summaryContainer: {
    marginBottom: spacing.xxl,
  },
  summaryGradient: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    position: 'relative',
  },
  summaryShimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ skewX: '-25deg' }],
    zIndex: 1,
  },
  summaryContent: {
    padding: spacing.xxl,
    zIndex: 2,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  summaryHeaderText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
  },
  summarySubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  summaryStats: {
    marginBottom: spacing.xl,
  },
  mainStat: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  mainStatLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  mainStatValue: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '700',
  },

  // Section Styles
  installmentsSection: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
    flex: 1,
  },
  installmentCount: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.white,
  },

  // Installment Cards
  installmentsContainer: {
    gap: spacing.lg,
  },
  installmentCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  installmentContent: {
    backgroundColor: colors.white,
  },
  paidCard: {
    elevation: 8,
    shadowColor: colors.success,
    shadowOpacity: 0.2,
  },
  overdueCard: {
    elevation: 8,
    shadowColor: colors.error,
    shadowOpacity: 0.2,
  },
  installmentGradient: {
    padding: spacing.xl,
  },
  unpaidContent: {
    position: 'relative',
  },
  priorityStripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  installmentMain: {
    padding: spacing.xl,
    paddingLeft: spacing.xxl,
  },
  installmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  installmentNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  installmentNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success + '20',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.success,
    marginLeft: 4,
  },
  installmentName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  whiteText: {
    color: colors.white,
  },
  feeBreakdown: {
    backgroundColor: colors.gray50,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  amountLabel: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '600',
  },
  originalAmount: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
  },
  discountLabel: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 13,
    color: colors.success,
    fontWeight: '700',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  whiteTextMuted: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dueDate: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  overdueDateText: {
    color: colors.error,
    fontWeight: '700',
  },

  // Action Buttons
  actionContainer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    padding: spacing.lg,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  urgentPayButton: {
    elevation: 6,
    shadowColor: colors.error,
  },
  payButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  payButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginLeft: 8,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 2,
    borderColor: colors.success,
    borderRadius: 12,
    backgroundColor: colors.success + '10',
  },
  receiptButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.success,
    marginLeft: 8,
  },
  noPaymentRequired: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.success + '10',
    borderRadius: 12,
  },
  noPaymentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 8,
  },

  // Bottom Spacing
  bottomSpacing: {
    height: spacing.xxxl,
  },
});

export default StudentFeeScreen;