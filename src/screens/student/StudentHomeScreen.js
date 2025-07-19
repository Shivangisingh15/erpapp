// StudentDashboard.js - Enhanced with Subtle Colors & Light Effects
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

// Enhanced Premium Color System with Light Effects
const colors = {
  // Primary Blues
  primary: '#1E40AF',
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  primarySoft: '#EFF6FF',
  primaryGlow: 'rgba(59, 130, 246, 0.15)',
  
  // Secondary Purples
  secondary: '#7C3AED',
  secondaryLight: '#A855F7',
  secondaryDark: '#5B21B6',
  secondarySoft: '#F3F4F6',
  secondaryGlow: 'rgba(168, 85, 247, 0.15)',
  
  // Accent Colors
  success: '#10B981',
  successSoft: '#ECFDF5',
  successGlow: 'rgba(16, 185, 129, 0.15)',
  
  warning: '#F59E0B',
  warningSoft: '#FFFBEB',
  warningGlow: 'rgba(245, 158, 11, 0.15)',
  
  error: '#EF4444',
  errorSoft: '#FEF2F2',
  errorGlow: 'rgba(239, 68, 68, 0.15)',
  
  info: '#06B6D4',
  infoSoft: '#F0F9FF',
  infoGlow: 'rgba(6, 182, 212, 0.15)',
  
  // Special Colors
  pink: '#EC4899',
  pinkSoft: '#FDF2F8',
  pinkGlow: 'rgba(236, 72, 153, 0.15)',
  
  orange: '#F97316',
  orangeSoft: '#FFF7ED',
  orangeGlow: 'rgba(249, 115, 22, 0.15)',
  
  emerald: '#059669',
  emeraldSoft: '#ECFDF5',
  emeraldGlow: 'rgba(5, 150, 105, 0.15)',
  
  indigo: '#4F46E5',
  indigoSoft: '#EEF2FF',
  indigoGlow: 'rgba(79, 70, 229, 0.15)',
  
  // Neutral Palette
  background: '#FAFBFF',
  backgroundGradient: ['#FAFBFF', '#F8FAFC', '#F1F5F9'],
  surface: '#FFFFFF',
  surfaceElevated: 'rgba(255, 255, 255, 0.95)',
  surfaceTinted: '#F8FAFC',
  
  // Text Colors
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  
  // Borders & Effects
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderTinted: '#E0E7FF',
  
  // Glass Effects
  glass: 'rgba(255, 255, 255, 0.85)',
  glassBlur: 'rgba(255, 255, 255, 0.95)',
  glassTinted: 'rgba(248, 250, 252, 0.85)',
  
  // Shadow Colors
  shadowBlue: 'rgba(59, 130, 246, 0.25)',
  shadowPurple: 'rgba(168, 85, 247, 0.25)',
  shadowPink: 'rgba(236, 72, 153, 0.25)',
  shadowGreen: 'rgba(16, 185, 129, 0.25)',
  shadowDefault: 'rgba(15, 23, 42, 0.1)',
};

// Enhanced Icon Component with Color Support
const SimpleIcon = ({ name, size = 20, color = colors.textPrimary, glow = false }) => {
  const iconMap = {
    'bell': '🔔',
    'megaphone': '📢',
    'clock': '⏰',
    'map-pin': '📍',
    'credit-card': '💳',
    'download-cloud': '📥',
    'file-text': '📄',
    'chevron-right': '›',
    'calendar': '📅',
    'trending-up': '📈',
    'users': '👥',
    'user': '👤',
    'star': '⭐',
    'bookmark': '🔖',
    'sparkles': '✨',
    'heart': '💖',
    'lightning': '⚡',
  };
  
  return (
    <View style={glow ? { 
      shadowColor: color, 
      shadowOffset: { width: 0, height: 0 }, 
      shadowOpacity: 0.3, 
      shadowRadius: 8 
    } : {}}>
      <Text style={{ fontSize: size, color }}>
        {iconMap[name] || '•'}
      </Text>
    </View>
  );
};

const StudentDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studentData, setStudentData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    grade: 'A+',
    percentage: '95.0%',
  });

  // Enhanced Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const scaleAnim = useState(new Animated.Value(0.95))[0];
  const glowAnim = useState(new Animated.Value(0))[0];

  // Enhanced upcoming classes with colors
  const upcomingClasses = [
    { 
      id: '1', 
      subject: 'Advanced Mathematics', 
      time: '10:00 AM', 
      duration: '90 min', 
      teacher: 'Dr. Sarah Smith', 
      room: 'Room 101',
      type: 'Lecture',
      color: colors.primary,
      bgColor: colors.primarySoft,
      shadowColor: colors.shadowBlue,
    },
    { 
      id: '2', 
      subject: 'Quantum Physics', 
      time: '11:30 AM', 
      duration: '75 min', 
      teacher: 'Prof. Michael Chen', 
      room: 'Lab 2A',
      type: 'Lab',
      color: colors.secondary,
      bgColor: colors.secondarySoft,
      shadowColor: colors.shadowPurple,
    },
    { 
      id: '3', 
      subject: 'Organic Chemistry', 
      time: '2:00 PM', 
      duration: '60 min', 
      teacher: 'Dr. Emily Parker', 
      room: 'Lab 1B',
      type: 'Practical',
      color: colors.emerald,
      bgColor: colors.emeraldSoft,
      shadowColor: colors.shadowGreen,
    },
  ];

  const quickActions = [
    { 
      id: '1', 
      icon: 'credit-card', 
      title: 'Fee Status', 
      subtitle: 'Payment & Records', 
      value: 'Check Status',
      status: 'warning',
      color: colors.warning,
      bgColor: colors.warningSoft,
      glowColor: colors.warningGlow,
      onPress: () => Alert.alert('Fee Status', 'Opening Fee Status...')
    },
    { 
      id: '2', 
      icon: 'trending-up', 
      title: 'Academic Report', 
      subtitle: 'Latest Performance', 
      value: 'View Report',
      status: 'success',
      color: colors.success,
      bgColor: colors.successSoft,
      glowColor: colors.successGlow,
      onPress: () => Alert.alert('Academic Report', 'Opening Academic Report...')
    },
    { 
      id: '3', 
      icon: 'download-cloud', 
      title: 'Study Materials', 
      subtitle: 'Resources & Notes', 
      value: '24 new files',
      status: 'info',
      color: colors.info,
      bgColor: colors.infoSoft,
      glowColor: colors.infoGlow,
      onPress: () => Alert.alert('Study Materials', 'Opening Study Materials...')
    },
    { 
      id: '4', 
      icon: 'file-text', 
      title: 'Leave Request', 
      subtitle: 'Submit Application', 
      value: 'Apply now',
      status: 'neutral',
      color: colors.indigo,
      bgColor: colors.indigoSoft,
      glowColor: colors.indigoGlow,
      onPress: () => Alert.alert('Leave Request', 'Opening Leave Request...')
    },
  ];

  // API calls (same as before)
  const fetchStudentData = async () => {
    try {
      const response = await fetch('https://erpbackend-gray.vercel.app/api/general/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: 118 })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStudentData(data);
      console.log('Student data loaded successfully:', data);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setStudentData({
        id: 118,
        roll_no: "BMT_250006",
        first_name: "Varad",
        middle_name: "Harshad",
        last_name: "Kadam",
        division: "A",
        photo_url: "https://erpresources.s3.ap-south-1.amazonaws.com/form-photoes/1734234597827_IMG20241215091741.jpg",
        adm_class: "11",
        scholarship_amt: 180000,
        additial_amount: 20000,
        hostel: false,
      });
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('https://erpbackend-gray.vercel.app/api/general/announcements');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
      
      const filteredAnnouncements = data.filter(announcement => {
        const createdAt = new Date(announcement.created_at);
        const isRecent = createdAt >= twentyFourHoursAgo;
        const isRelevant = announcement.audience === 'Everyone' || announcement.audience === 'Student';
        return isRecent && isRelevant;
      });
      
      setAnnouncements(filteredAnnouncements);
      console.log('Announcements loaded:', filteredAnnouncements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([
        {
          id: 2,
          subject: "ERP app launch",
          body: "Hey Everyone, we are glad to announce that we are launching the ERP app in a few days.",
          audience: "Everyone",
          created_at: new Date().toISOString()
        }
      ]);
    }
  };

  const loadData = async () => {
    await Promise.all([fetchStudentData(), fetchAnnouncements()]);
    setIsLoading(false);
    
    // Enhanced entrance animation with glow effect
    Animated.parallel([
      Animated.timing(fadeAnim, { 
        toValue: 1, 
        duration: 1000, 
        useNativeDriver: true 
      }),
      Animated.spring(slideAnim, { 
        toValue: 0, 
        tension: 50, 
        friction: 8, 
        useNativeDriver: true 
      }),
      Animated.spring(scaleAnim, { 
        toValue: 1, 
        tension: 60, 
        friction: 6, 
        useNativeDriver: true 
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ),
    ]).start();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchStudentData(), fetchAnnouncements()]);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon"; 
    return "Good Evening";
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStudentName = () => {
    if (!studentData) return "Loading...";
    return `${studentData.first_name} ${studentData.last_name}`;
  };

  const getFeeStatus = () => {
    if (!studentData) return "Loading...";
    return studentData.additial_amount > 0 ? `₹${studentData.additial_amount} pending` : "Paid";
  };

  const formatAnnouncementTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours === 1) return '1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return date.toLocaleDateString();
  };

  const renderHeroSection = () => (
    <Animated.View style={[
      styles.heroSection, 
      { 
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
      }
    ]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary, colors.pink]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroGradient}
      >
        <Animated.View style={[
          styles.glowOverlay,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3]
            })
          }
        ]} />
        
        <TouchableOpacity 
          style={styles.heroContent}
          onPress={() => Alert.alert('Profile', 'Opening Profile...')}
          activeOpacity={0.9}
        >
          <View style={styles.heroText}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.studentName}>{getStudentName()}</Text>
            <Text style={styles.date}>{formatDate(currentTime)}</Text>
            
            {studentData && (
              <View style={styles.classInfo}>
                <SimpleIcon name="sparkles" size={14} color={colors.warning} />
                <Text style={styles.classText}>Class {studentData.adm_class} • Division {studentData.division}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.avatarContainer}>
            <View style={styles.avatarGlow} />
            <Image
              source={{ 
                uri: studentData?.photo_url || 'https://via.placeholder.com/80' 
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );

  const renderPerformanceCard = () => (
    <TouchableOpacity 
      style={styles.performanceSection}
      onPress={() => Alert.alert('Academic Report', 'Opening detailed performance...')}
      activeOpacity={0.8}
    >
      <Text style={styles.sectionTitle}>Academic Performance</Text>
      
      <LinearGradient
        colors={[colors.glass, colors.glassTinted, colors.surface]}
        style={styles.performanceCard}
      >
        <View style={styles.performanceGrid}>
          <View style={styles.performanceItem}>
            <LinearGradient
              colors={[colors.successSoft, colors.success + '20']}
              style={styles.performanceIcon}
            >
              <SimpleIcon name="star" size={24} color={colors.success} glow />
            </LinearGradient>
            <Text style={styles.performanceLabel}>Current Grade</Text>
            <Text style={[styles.performanceValue, { color: colors.success }]}>{performanceMetrics.grade}</Text>
          </View>
          
          <View style={styles.performanceItem}>
            <LinearGradient
              colors={[colors.primarySoft, colors.primary + '20']}
              style={styles.performanceIcon}
            >
              <SimpleIcon name="trending-up" size={24} color={colors.primary} glow />
            </LinearGradient>
            <Text style={styles.performanceLabel}>Percentage</Text>
            <Text style={[styles.performanceValue, { color: colors.primary }]}>{performanceMetrics.percentage}</Text>
          </View>
        </View>
        
        <View style={styles.performanceDecorations}>
          <View style={[styles.decorationCircle, { backgroundColor: colors.primaryGlow }]} />
          <View style={[styles.decorationCircle, styles.decorationCircle2, { backgroundColor: colors.successGlow }]} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderAnnouncementCard = ({ item }) => {
    const isEveryone = item.audience === 'Everyone';
    const accentColor = isEveryone ? colors.warning : colors.info;
    const bgColor = isEveryone ? colors.warningSoft : colors.infoSoft;
    const shadowColor = isEveryone ? colors.warningGlow : colors.infoGlow;
    
    return (
      <TouchableOpacity 
        style={[styles.announcementCard, { 
          shadowColor: accentColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 6
        }]} 
        activeOpacity={0.8}
        onPress={() => Alert.alert(item.subject, item.body)}
      >
        <LinearGradient
          colors={[colors.glassBlur, bgColor, colors.surface]}
          style={StyleSheet.absoluteFill}
        />
        
        <View style={styles.announcementHeader}>
          <LinearGradient
            colors={[bgColor, accentColor + '20']}
            style={styles.announcementIconContainer}
          >
            <SimpleIcon 
              name={isEveryone ? 'megaphone' : 'bell'} 
              size={18} 
              color={accentColor}
              glow
            />
          </LinearGradient>
          <View style={styles.announcementMeta}>
            <View style={styles.audienceAndTime}>
              <LinearGradient
                colors={[accentColor + '15', accentColor + '25']}
                style={styles.audienceBadge}
              >
                <Text style={[styles.audienceText, { color: accentColor }]}>
                  {item.audience}
                </Text>
              </LinearGradient>
              <Text style={styles.timeText}>{formatAnnouncementTime(item.created_at)}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.announcementSubject}>{item.subject}</Text>
        <Text style={styles.announcementBody} numberOfLines={2}>
          {item.body}
        </Text>
        
        <View style={[styles.announcementAccent, { backgroundColor: accentColor }]} />
      </TouchableOpacity>
    );
  };

  const renderAnnouncements = () => (
    <View style={styles.announcementsSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <SimpleIcon name="bell" size={24} color={colors.warning} glow />
          <Text style={styles.sectionTitle}>Latest Announcements</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Announcements', 'Opening all announcements...')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      
      {announcements.length > 0 ? (
        <FlatList
          data={announcements}
          renderItem={renderAnnouncementCard}
          keyExtractor={item => item.id.toString()}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.announcementSeparator} />}
        />
      ) : (
        <LinearGradient
          colors={[colors.glassBlur, colors.surfaceTinted]}
          style={styles.noAnnouncementsContainer}
        >
          <SimpleIcon name="bell" size={48} color={colors.textMuted} />
          <Text style={styles.noAnnouncementsText}>No recent announcements</Text>
          <Text style={styles.noAnnouncementsSubtext}>Check back later for updates</Text>
        </LinearGradient>
      )}
    </View>
  );

  const renderClassCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.classCard, {
        shadowColor: item.shadowColor,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8
      }]} 
      activeOpacity={0.8}
      onPress={() => Alert.alert('Class Details', `Opening ${item.subject} details...`)}
    >
      <LinearGradient
        colors={[colors.glassBlur, item.bgColor, colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.classHeader}>
        <LinearGradient
          colors={[item.color, item.color + '80']}
          style={styles.classTypeIndicator}
        />
        <View style={styles.classInfo}>
          <Text style={styles.classSubject}>{item.subject}</Text>
          <Text style={styles.classTeacher}>{item.teacher}</Text>
        </View>
        <LinearGradient
          colors={[item.bgColor, item.color + '20']}
          style={styles.classTypeContainer}
        >
          <Text style={[styles.classType, { color: item.color }]}>{item.type}</Text>
        </LinearGradient>
      </View>
      
      <View style={styles.classDetails}>
        <View style={styles.classDetailRow}>
          <SimpleIcon name="clock" size={14} color={item.color} />
          <Text style={styles.classDetailText}>{item.time} • {item.duration}</Text>
        </View>
        <View style={styles.classDetailRow}>
          <SimpleIcon name="map-pin" size={14} color={item.color} />
          <Text style={styles.classDetailText}>{item.room}</Text>
        </View>
      </View>
      
      <View style={[styles.classAccent, { backgroundColor: item.color }]} />
    </TouchableOpacity>
  );

  const renderQuickActionCard = ({ item }) => (
    <TouchableOpacity 
      style={[styles.actionCard, {
        shadowColor: item.color,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6
      }]} 
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <LinearGradient
        colors={[colors.glassBlur, item.bgColor, colors.surface]}
        style={StyleSheet.absoluteFill}
      />
      
      <LinearGradient
        colors={[item.bgColor, item.glowColor]}
        style={styles.actionIcon}
      >
        <SimpleIcon name={item.icon} size={24} color={item.color} glow />
      </LinearGradient>
      
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={styles.actionSubtitle}>{item.subtitle}</Text>
        <Text style={[
          styles.actionValue, 
          { color: item.status === 'warning' ? colors.warning : item.color }
        ]}>
          {item.title === 'Fee Status' ? getFeeStatus() : item.value}
        </Text>
      </View>
      
      {item.status === 'warning' && studentData?.additial_amount > 0 && (
        <LinearGradient
          colors={[colors.warning, colors.orange]}
          style={styles.urgentBadge}
        >
          <Text style={styles.urgentText}>!</Text>
        </LinearGradient>
      )}
      
      <View style={[styles.actionAccent, { backgroundColor: item.color }]} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient
          colors={colors.backgroundGradient}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
          <SimpleIcon name="sparkles" size={32} color={colors.secondary} />
          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <LinearGradient
        colors={colors.backgroundGradient}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Floating background elements */}
      <View style={styles.backgroundDecorations}>
        <View style={[styles.floatingCircle, styles.circle1]} />
        <View style={[styles.floatingCircle, styles.circle2]} />
        <View style={[styles.floatingCircle, styles.circle3]} />
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary, colors.secondary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderHeroSection()}
        {renderPerformanceCard()}
        {renderAnnouncements()}
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <SimpleIcon name="calendar" size={24} color={colors.primary} glow />
              <Text style={styles.sectionTitle}>Today's Schedule</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Schedule', 'Opening full schedule...')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={upcomingClasses}
            renderItem={renderClassCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionTitleContainer}>
            <SimpleIcon name="lightning" size={24} color={colors.indigo} glow />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <View key={action.id} style={styles.actionCardWrapper}>
                {renderQuickActionCard({ item: action })}
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  
  loadingContent: {
    alignItems: 'center',
    gap: 16,
  },
  
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  backgroundDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  
  floatingCircle: {
    position: 'absolute',
    borderRadius: 9999,
    opacity: 0.6,
  },
  
  circle1: {
    width: 120,
    height: 120,
    backgroundColor: colors.primaryGlow,
    top: 100,
    right: -60,
  },
  
  circle2: {
    width: 80,
    height: 80,
    backgroundColor: colors.secondaryGlow,
    top: 300,
    left: -40,
  },
  
  circle3: {
    width: 60,
    height: 60,
    backgroundColor: colors.successGlow,
    bottom: 200,
    right: 20,
  },
  
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 40,
  },
  
  heroSection: {
    marginHorizontal: 24,
    marginBottom: 40,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: colors.shadowPurple,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
  },
  
  heroGradient: {
    padding: 32,
    minHeight: 160,
    position: 'relative',
  },
  
  glowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  
  heroText: {
    flex: 1,
  },
  
  greeting: {
    fontSize: 18,
    color: colors.textInverse,
    opacity: 0.9,
    fontWeight: '500',
  },
  
  studentName: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textInverse,
    marginTop: 6,
    marginBottom: 10,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  
  date: {
    fontSize: 16,
    color: colors.textInverse,
    opacity: 0.8,
    fontWeight: '500',
  },
  
  classInfo: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  
  classText: {
    fontSize: 14,
    color: colors.textInverse,
    fontWeight: '600',
  },
  
  avatarContainer: {
    position: 'relative',
  },
  
  avatarGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    top: -4,
    left: -4,
  },
  
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.textInverse,
    zIndex: 2,
  },
  
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.textInverse,
    zIndex: 3,
  },
  
  section: {
    marginBottom: 40,
  },
  
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 24,
    marginBottom: 20,
  },
  
  seeAllText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  
  performanceSection: {
    marginBottom: 40,
  },
  
  performanceCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: colors.borderLight,
    elevation: 6,
    shadowColor: colors.shadowDefault,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 2,
  },
  
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  performanceIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  performanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'center',
  },
  
  performanceValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  
  performanceDecorations: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  decorationCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -50,
    right: -30,
  },
  
  decorationCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    bottom: -30,
    left: -20,
    top: 'auto',
  },
  
  // Announcements styles with enhanced colors
  announcementsSection: {
    marginBottom: 40,
    marginHorizontal: 24,
  },
  
  announcementCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  
  announcementIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  announcementMeta: {
    flex: 1,
  },
  
  audienceAndTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  audienceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  audienceText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  timeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  
  announcementSubject: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  
  announcementBody: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  announcementAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  
  announcementSeparator: {
    height: 16,
  },
  
  noAnnouncementsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  
  noAnnouncementsText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 12,
  },
  
  noAnnouncementsSubtext: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
  },
  
  horizontalList: {
    paddingHorizontal: 24,
  },
  
  classCard: {
    width: width * 0.85,
    marginRight: 20,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  
  classHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  classTypeIndicator: {
    width: 5,
    height: 48,
    borderRadius: 3,
    marginRight: 16,
  },
  
  classInfo: {
    flex: 1,
  },
  
  classSubject: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  
  classTeacher: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  classTypeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  
  classType: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  classDetails: {
    gap: 12,
  },
  
  classDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  classDetailText: {
    marginLeft: 12,
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  classAccent: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  
  actionCardWrapper: {
    width: (width - 68) / 2,
    marginBottom: 20,
  },
  
  actionCard: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  actionContent: {
    flex: 1,
  },
  
  actionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 10,
  },
  
  actionValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  
  urgentBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  urgentText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textInverse,
  },
  
  actionAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  
  bottomSpacer: {
    height: 60,
  },
});

export default StudentDashboard;