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
  Vibration,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/Feather';

const { width, height } = Dimensions.get('window');

const StudentDashboard = () => {
  console.log('🚀 StudentDashboard component initialized');
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studentData, setStudentData] = useState(null);
  const [examResults, setExamResults] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    grade: 'Loading...',
    gpa: 'Loading...',
    percentage: 'Loading...'
  });

  console.log('📊 Current state:', {
    isDarkMode,
    isLoading,
    hasStudentData: !!studentData,
    hasExamResults: !!examResults,
    performanceMetrics
  });

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.9))[0];

  // Fetch student data - Using fallback data due to authentication requirements
  const fetchStudentData = async () => {
    try {
      console.log('🔄 === STARTING STUDENT DATA FETCH ===');
      console.log('📅 Timestamp:', new Date().toISOString());
      
      // Since the API requires authentication (401), using provided sample data
      const studentInfo = {
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
        bed_id: null,
        bed_number: null,
        room_number: null,
        floor_number: null,
        hostel_name: null,
        hostel_desc: null,
        gender: null
      };
      
      console.log('✅ Student data structure loaded:', {
        id: studentInfo.id,
        name: `${studentInfo.first_name} ${studentInfo.middle_name} ${studentInfo.last_name}`,
        roll_no: studentInfo.roll_no,
        class: `${studentInfo.adm_class} ${studentInfo.division}`,
        photo_url: studentInfo.photo_url,
        scholarship_amt: studentInfo.scholarship_amt,
        additial_amount: studentInfo.additial_amount,
        hostel: studentInfo.hostel
      });
      
      console.log('💾 Setting student data to state...');
      setStudentData(studentInfo);
      console.log('✅ Student data successfully set to state');
      
    } catch (error) {
      console.error('❌ Error loading student data:', error);
      console.log('📋 Error details:', error.message);
    }
  };

  // Fetch exam results - Using sample data with correct API structure
  const fetchExamResults = async () => {
    try {
      console.log('🔄 === STARTING EXAM RESULTS FETCH ===');
      console.log('📅 Timestamp:', new Date().toISOString());
      
      // Using the provided sample data structure until API authentication is resolved
      const examData = {
        status: "success",
        data: {
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
        }
      };
      
      console.log('✅ Exam data structure loaded:', {
        status: examData.status,
        cet_exams: examData.data.cet.length,
        neet_exams: examData.data.neet.length,
        jee_main_exams: examData.data.jee_main.length,
        jee_adv_exams: examData.data.jee_adv.length
      });
      
      console.log('📊 CET Exam Details:');
      examData.data.cet.forEach((exam, index) => {
        console.log(`  Exam ${index + 1}:`, {
          name: exam.exam_name,
          date: exam.exam_date,
          rank: exam.rank,
          physics: exam.phy,
          chemistry: exam.chem,
          mathematics: exam.math,
          total: exam.total,
          percentage: ((exam.total / 300) * 100).toFixed(1) + '%'
        });
      });
      
      console.log('💾 Setting exam results to state...');
      setExamResults(examData);
      console.log('✅ Exam results successfully set to state');
      
      console.log('🧮 Starting performance metrics calculation...');
      calculatePerformanceMetrics(examData);
      
    } catch (error) {
      console.error('❌ Error loading exam results:', error);
      console.log('📋 Error details:', error.message);
    }
  };

  // Calculate performance metrics from exam results
  const calculatePerformanceMetrics = (results) => {
    console.log('🧮 === STARTING PERFORMANCE CALCULATION ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('📊 Input results:', results);
    
    if (!results || !results.data) {
      console.log('❌ No results or results.data found');
      console.log('🏷️ Setting metrics to N/A');
      setPerformanceMetrics({
        grade: 'N/A',
        gpa: 'N/A',
        percentage: 'N/A'
      });
      return;
    }

    console.log('✅ Results data structure valid');
    console.log('🔍 Examining exam categories...');

    // Collect all exams from different categories
    const allExams = [];
    const examCategories = ['cet', 'neet', 'jee_main', 'jee_adv'];
    
    examCategories.forEach(category => {
      console.log(`📋 Checking category: ${category}`);
      if (results.data[category] && Array.isArray(results.data[category])) {
        console.log(`  ✅ Found ${results.data[category].length} exams in ${category}`);
        allExams.push(...results.data[category]);
      } else {
        console.log(`  ❌ No valid exams in ${category}`);
      }
    });

    console.log(`📊 Total exams collected: ${allExams.length}`);
    console.log('📝 All exams details:', allExams);

    if (allExams.length === 0) {
      console.log('❌ No exams found in any category');
      console.log('🏷️ Setting metrics to N/A');
      setPerformanceMetrics({
        grade: 'N/A',
        gpa: 'N/A',
        percentage: 'N/A'
      });
      return;
    }

    console.log('🧮 Calculating percentages for each exam...');
    
    // Calculate percentage for each exam (total out of 300: phy+chem+math = 100+100+100)
    const examPercentages = allExams.map((exam, index) => {
      const maxScore = 300; // Assuming each subject is out of 100
      const percentage = (exam.total / maxScore) * 100;
      console.log(`  Exam ${index + 1} (${exam.exam_name}):`, {
        physics: exam.phy,
        chemistry: exam.chem,
        mathematics: exam.math,
        total: exam.total,
        maxScore: maxScore,
        percentage: percentage.toFixed(2) + '%'
      });
      return percentage;
    });
    
    console.log('📊 All exam percentages:', examPercentages.map(p => p.toFixed(1) + '%'));
    
    // Calculate average percentage from all exams
    const totalPercentage = examPercentages.reduce((sum, percentage) => sum + percentage, 0);
    const avgPercentage = totalPercentage / examPercentages.length;
    
    console.log('🧮 Average calculation:', {
      totalPercentage: totalPercentage.toFixed(2),
      numberOfExams: examPercentages.length,
      averagePercentage: avgPercentage.toFixed(2) + '%'
    });
    
    // Convert percentage to GPA (assuming 4.0 scale)
    const gpa = (avgPercentage / 100) * 4.0;
    console.log('📐 GPA calculation:', {
      percentage: avgPercentage.toFixed(2),
      gpaFormula: `(${avgPercentage.toFixed(2)} / 100) * 4.0`,
      gpa: gpa.toFixed(2)
    });
    
    // Determine grade based on percentage
    console.log('🏆 Determining grade based on percentage...');
    let grade;
    if (avgPercentage >= 90) {
      grade = 'A+';
      console.log('  ✅ Grade: A+ (≥90%)');
    } else if (avgPercentage >= 85) {
      grade = 'A';
      console.log('  ✅ Grade: A (85-89%)');
    } else if (avgPercentage >= 80) {
      grade = 'A-';
      console.log('  ✅ Grade: A- (80-84%)');
    } else if (avgPercentage >= 75) {
      grade = 'B+';
      console.log('  ✅ Grade: B+ (75-79%)');
    } else if (avgPercentage >= 70) {
      grade = 'B';
      console.log('  ✅ Grade: B (70-74%)');
    } else if (avgPercentage >= 65) {
      grade = 'B-';
      console.log('  ✅ Grade: B- (65-69%)');
    } else if (avgPercentage >= 60) {
      grade = 'C+';
      console.log('  ✅ Grade: C+ (60-64%)');
    } else if (avgPercentage >= 55) {
      grade = 'C';
      console.log('  ✅ Grade: C (55-59%)');
    } else if (avgPercentage >= 50) {
      grade = 'C-';
      console.log('  ✅ Grade: C- (50-54%)');
    } else {
      grade = 'D';
      console.log('  ✅ Grade: D (<50%)');
    }

    const finalMetrics = {
      grade: grade,
      gpa: gpa.toFixed(1),
      percentage: `${avgPercentage.toFixed(1)}%`
    };

    console.log('📈 FINAL PERFORMANCE METRICS:', {
      totalExams: allExams.length,
      examPercentages: examPercentages.map(p => p.toFixed(1) + '%'),
      averagePercentage: avgPercentage.toFixed(1) + '%',
      gpa: gpa.toFixed(1),
      grade: grade,
      finalMetrics
    });

    console.log('💾 Setting performance metrics to state...');
    setPerformanceMetrics(finalMetrics);
    console.log('✅ Performance metrics successfully set to state');
    console.log('🧮 === PERFORMANCE CALCULATION COMPLETE ===');
  };

  // Initialize data loading
  useEffect(() => {
    console.log('🔄 === COMPONENT INITIALIZATION ===');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('⚡ useEffect triggered for data loading');
    
    const loadData = async () => {
      console.log('🔄 Starting data loading process...');
      console.log('📊 Setting loading state to true');
      setIsLoading(true);
      
      console.log('📞 Starting parallel API calls...');
      const startTime = Date.now();
      
      try {
        await Promise.all([
          fetchStudentData(),
          fetchExamResults()
        ]);
        
        const loadTime = Date.now() - startTime;
        console.log(`✅ All data loaded successfully in ${loadTime}ms`);
        
      } catch (error) {
        console.error('❌ Error during data loading:', error);
      }
      
      // Animate in after data is loaded
      console.log('⏱️ Starting loading delay timer (1000ms)...');
      setTimeout(() => {
        console.log('🎬 Loading delay complete, starting animations...');
        console.log('📊 Setting loading state to false');
        setIsLoading(false);
        
        console.log('🎭 Starting fade and scale animations...');
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          console.log('✅ All animations completed successfully');
          console.log('🔄 === COMPONENT INITIALIZATION COMPLETE ===');
        });
      }, 1000);
    };

    loadData();
  }, []);

  // Update time every minute
  useEffect(() => {
    console.log('⏰ Setting up time update interval...');
    const timer = setInterval(() => {
      const newTime = new Date();
      console.log('🕐 Time updated:', newTime.toLocaleTimeString());
      setCurrentTime(newTime);
    }, 60000);
    
    console.log('✅ Time update interval configured (60000ms)');
    
    return () => {
      console.log('🛑 Cleaning up time update interval');
      clearInterval(timer);
    };
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    let greeting;
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 17) greeting = "Good Afternoon";
    else greeting = "Good Evening";
    
    console.log('🌅 Greeting calculated:', {
      currentHour: hour,
      greeting: greeting,
      time: currentTime.toLocaleTimeString()
    });
    
    return greeting;
  };

  const formatDate = (date) => {
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log('📅 Date formatted:', {
      input: date,
      output: formatted
    });
    
    return formatted;
  };

  const handlePress = () => {
    console.log('👆 Button press detected');
    console.log('📱 Platform:', Platform.OS);
    
    if (Platform.OS === 'ios') {
      console.log('📳 iOS vibration (10ms)');
      Vibration.vibrate(10);
    } else {
      console.log('📳 Android vibration (50ms)');
      Vibration.vibrate(50);
    }
  };

  // Get student name
  const getStudentName = () => {
    if (!studentData) {
      console.log('👤 Student name: Loading... (no data)');
      return "Loading...";
    }
    
    const fullName = `${studentData.first_name} ${studentData.middle_name} ${studentData.last_name}`.trim();
    console.log('👤 Student name constructed:', {
      firstName: studentData.first_name,
      middleName: studentData.middle_name,
      lastName: studentData.last_name,
      fullName: fullName
    });
    
    return fullName;
  };

  // Get fee status
  const getFeeStatus = () => {
    if (!studentData) {
      console.log('💰 Fee status: Loading... (no data)');
      return "Loading...";
    }
    
    const pendingAmount = studentData.additial_amount || 0;
    const status = pendingAmount > 0 ? `₹${pendingAmount} pending` : "Paid";
    
    console.log('💰 Fee status calculated:', {
      scholarshipAmount: studentData.scholarship_amt,
      additionalAmount: studentData.additial_amount,
      pendingAmount: pendingAmount,
      status: status
    });
    
    return status;
  };

  // Dashboard items with real data
  const dashboardItems = [
    {
      icon: "🎒",
      title: "My Classes",
      description: "Today's schedule",
      value: "5 classes",
      color: ['#3B82F6', '#1E40AF']
    },
    {
      icon: "🧾",
      title: "Fees",
      description: "Payment status",
      value: getFeeStatus(),
      color: ['#6366F1', '#4F46E5']
    },
    {
      icon: "📈",
      title: "Results",
      description: "Latest grades",
      value: `Grade: ${performanceMetrics.grade}`,
      color: ['#EC4899', '#DB2777']
    },
    {
      icon: "📥",
      title: "Downloads",
      description: "Study materials",
      value: "12 files",
      color: ['#F59E0B', '#D97706']
    },
    {
      icon: "📋",
      title: "Leave Application",
      description: "Apply for leave",
      value: "Apply now",
      color: ['#EF4444', '#DC2626']
    },
    {
      icon: "📢",
      title: "Announcements",
      description: "Latest updates",
      value: "3 new",
      color: ['#8B5CF6', '#7C3AED']
    }
  ];

  console.log('🎯 Dashboard items generated:', {
    totalItems: dashboardItems.length,
    items: dashboardItems.map(item => ({
      title: item.title,
      value: item.value,
      color: item.color[0]
    }))
  });

  const SkeletonCard = () => (
    <View style={[
      styles.skeletonCard, 
      { 
        backgroundColor: isDarkMode ? '#374151' : '#E5E7EB',
        width: (width - 88) / 2,
        height: 150
      }
    ]}>
      <View style={[styles.skeletonCircle, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
      <View style={styles.skeletonContent}>
        <View style={[styles.skeletonLine, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
        <View style={[styles.skeletonLineSmall, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
      </View>
    </View>
  );

  const DashboardCard = ({ item, index }) => {
    console.log(`🎴 Rendering dashboard card ${index}:`, {
      title: item.title,
      value: item.value,
      icon: item.icon,
      colors: item.color
    });
    
    const cardWidth = (width - 88) / 2;
    const cardHeight = 150;
    
    console.log(`📏 Card ${index} dimensions:`, {
      screenWidth: width,
      calculatedWidth: cardWidth,
      height: cardHeight
    });
    
    return (
      <TouchableOpacity
        style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}
        onPress={() => {
          console.log(`👆 Dashboard card pressed: ${item.title}`);
          handlePress();
        }}
        activeOpacity={0.8}
      >
        <BlurView
          intensity={80}
          style={[
            styles.card,
            {
              backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.6)',
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)',
              flex: 1,
            }
          ]}
        >
          <LinearGradient
            colors={isDarkMode ? [...item.color, 'transparent'] : [...item.color.map(c => c + '20'), 'transparent']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          {!isDarkMode && (
            <LinearGradient
              colors={['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)', 'transparent']}
              style={styles.cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          )}
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{item.icon}</Text>
              <Icon 
                name="chevron-right" 
                size={20} 
                color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
              />
            </View>
            <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
              {item.title}
            </Text>
            <Text style={[styles.cardDescription, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
              {item.description}
            </Text>
            <Text style={[styles.cardValue, { color: isDarkMode ? '#60A5FA' : '#2563EB' }]}>
              {item.value}
            </Text>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    console.log('🏗️ === RENDERING DASHBOARD GRID ===');
    console.log('📊 Total dashboard items:', dashboardItems.length);
    
    const itemsPerRow = 2;
    const rows = [];
    
    console.log(`📐 Grid configuration: ${itemsPerRow} items per row`);
    
    for (let i = 0; i < dashboardItems.length; i += itemsPerRow) {
      const rowItems = dashboardItems.slice(i, i + itemsPerRow);
      console.log(`🏗️ Creating row ${Math.floor(i / itemsPerRow) + 1} with ${rowItems.length} items:`, 
        rowItems.map(item => item.title));
      
      rows.push(
        <View key={i} style={styles.gridRow}>
          {rowItems.map((item, index) => (
            <DashboardCard key={i + index} item={item} index={i + index} />
          ))}
        </View>
      );
    }
    
    console.log(`✅ Grid rendered with ${rows.length} rows`);
    return rows;
  };

  return (
    <View style={styles.container}>
      {console.log('🎨 === RENDERING MAIN COMPONENT ===', {
        isDarkMode,
        isLoading,
        hasStudentData: !!studentData,
        hasExamResults: !!examResults,
        performanceMetrics,
        screenDimensions: { width, height },
        currentTime: currentTime.toLocaleString()
      })}
      
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      
      <LinearGradient
        colors={isDarkMode 
          ? ['#0C0A1E', '#1A0B3D', '#2D1B69', '#4338CA', '#7C3AED', '#BE185D', '#DC2626'] 
          : ['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9', '#0284C7']
        }
        style={styles.background}
      >
        {/* Header with Theme Toggle and Notifications */}
        <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 60 : 40 }]}>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                {
                  backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                }
              ]}
              onPress={() => {
                handlePress();
                setIsDarkMode(!isDarkMode);
              }}
            >
              <Icon 
                name={isDarkMode ? "sun" : "moon"} 
                size={20} 
                color={isDarkMode ? '#FFFFFF' : '#111827'} 
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.headerButton,
                {
                  backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(255, 255, 255, 0.4)',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
                }
              ]}
              onPress={handlePress}
            >
              <Icon 
                name="bell" 
                size={20} 
                color={isDarkMode ? '#FFFFFF' : '#111827'} 
              />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Dashboard Card with Centered Profile */}
        <Animated.View
          style={[
            styles.mainCard,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          <BlurView
            intensity={80}
            style={[
              styles.mainCardContent,
              {
                backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.6)' : 'rgba(255, 255, 255, 0.7)',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.4)',
              }
            ]}
          >
            {!isDarkMode && (
              <LinearGradient
                colors={['rgba(59, 130, 246, 0.02)', 'rgba(139, 92, 246, 0.02)', 'rgba(236, 72, 153, 0.02)', 'transparent']}
                style={styles.mainCardGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
            )}

            {/* Centered Profile Section */}
            <View style={styles.centeredProfileSection}>
              <View style={styles.profileImageContainer}>
                {isLoading || !studentData ? (
                  <View style={[styles.profileImageSkeleton, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB' }]} />
                ) : (
                  <Image 
                    source={{ uri: studentData.photo_url || 'https://via.placeholder.com/120/3B82F6/FFFFFF?text=Student' }} 
                    style={styles.profileImage} 
                  />
                )}
                <View style={styles.onlineIndicator} />
              </View>
              
              {isLoading || !studentData ? (
                <View style={styles.greetingSkeleton}>
                  <View style={[styles.skeletonLine, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB', width: 200, alignSelf: 'center' }]} />
                  <View style={[styles.skeletonLineSmall, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB', width: 150, alignSelf: 'center' }]} />
                  <View style={styles.classRollSkeleton}>
                    <View style={[styles.skeletonClassRoll, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
                    <View style={[styles.skeletonClassRoll, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
                  </View>
                  <View style={styles.gradeInfoSkeleton}>
                    <View style={[styles.skeletonGradeCard, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
                    <View style={[styles.skeletonGradeCard, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
                    <View style={[styles.skeletonGradeCard, { backgroundColor: isDarkMode ? '#4B5563' : '#D1D5DB' }]} />
                  </View>
                </View>
              ) : (
                <View style={styles.greetingTextContainer}>
                  <Text style={[styles.greeting, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
                    {getGreeting()}, {getStudentName()}!
                  </Text>
                  <Text style={[styles.date, { color: isDarkMode ? '#D1D5DB' : '#6B7280' }]}>
                    {formatDate(currentTime)}
                  </Text>
                  
                  {/* Class and Roll Number Section */}
                  <View style={styles.classRollContainer}>
                    <BlurView
                      intensity={60}
                      style={[
                        styles.classRollCard,
                        {
                          backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.3)' : 'rgba(251, 146, 60, 0.2)',
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(251, 146, 60, 0.3)',
                        }
                      ]}
                    >
                      <Text style={[styles.classRollLabel, { color: isDarkMode ? '#FED7AA' : '#9A3412' }]}>
                        Class
                      </Text>
                      <Text style={[styles.classRollValue, { color: isDarkMode ? '#FFFFFF' : '#C2410C' }]}>
                        {studentData.adm_class} {studentData.division}
                      </Text>
                    </BlurView>
                    
                    <BlurView
                      intensity={60}
                      style={[
                        styles.classRollCard,
                        {
                          backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)',
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(34, 197, 94, 0.3)',
                        }
                      ]}
                    >
                      <Text style={[styles.classRollLabel, { color: isDarkMode ? '#BBF7D0' : '#14532D' }]}>
                        Roll No.
                      </Text>
                      <Text style={[styles.classRollValue, { color: isDarkMode ? '#FFFFFF' : '#15803D' }]}>
                        {studentData.roll_no}
                      </Text>
                    </BlurView>
                  </View>
                  
                  {/* Grade Info Cards */}
                  <View style={styles.gradeInfoContainer}>
                    <BlurView
                      intensity={60}
                      style={[
                        styles.gradeCard,
                        {
                          backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)',
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(59, 130, 246, 0.3)',
                        }
                      ]}
                    >
                      <Text style={[styles.gradeCardLabel, { color: isDarkMode ? '#DBEAFE' : '#1E40AF' }]}>
                        Current Grade
                      </Text>
                      <Text style={[styles.gradeCardValue, { color: isDarkMode ? '#FFFFFF' : '#1E3A8A' }]}>
                        {performanceMetrics.grade}
                      </Text>
                    </BlurView>
                    
                    <BlurView
                      intensity={60}
                      style={[
                        styles.gradeCard,
                        {
                          backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)',
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(139, 92, 246, 0.3)',
                        }
                      ]}
                    >
                      <Text style={[styles.gradeCardLabel, { color: isDarkMode ? '#DDD6FE' : '#6B21A8' }]}>
                        GPA
                      </Text>
                      <Text style={[styles.gradeCardValue, { color: isDarkMode ? '#FFFFFF' : '#581C87' }]}>
                        {performanceMetrics.gpa}
                      </Text>
                    </BlurView>
                    
                    <BlurView
                      intensity={60}
                      style={[
                        styles.gradeCard,
                        {
                          backgroundColor: isDarkMode ? 'rgba(236, 72, 153, 0.3)' : 'rgba(236, 72, 153, 0.2)',
                          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(236, 72, 153, 0.3)',
                        }
                      ]}
                    >
                      <Text style={[styles.gradeCardLabel, { color: isDarkMode ? '#FBCFE8' : '#9D174D' }]}>
                        Percentage
                      </Text>
                      <Text style={[styles.gradeCardValue, { color: isDarkMode ? '#FFFFFF' : '#BE185D' }]}>
                        {performanceMetrics.percentage}
                      </Text>
                    </BlurView>
                  </View>
                </View>
              )}
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              bounces={true}
            >
              <Text style={[styles.dashboardTitle, { color: isDarkMode ? '#FFFFFF' : '#111827' }]}>
                Dashboard
              </Text>
              
              {isLoading ? (
                <View style={styles.gridContainer}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))}
                </View>
              ) : (
                <View style={styles.gridContainer}>
                  {renderGrid()}
                </View>
              )}

              {/* Bottom spacing */}
              <View style={{ height: 100 }} />
            </ScrollView>
          </BlurView>
        </Animated.View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#3B82F6', '#8B5CF6', '#EC4899']}
            style={styles.fabGradient}
          >
            <Icon name="plus" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'flex-end',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  mainCard: {
    flex: 1,
    marginHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  mainCardContent: {
    flex: 1,
    borderWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  mainCardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  centeredProfileSection: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 32,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 18,
  },
  profileImage: {
    width: 120, // ✨ INCREASED from 100 to 120
    height: 120, // ✨ INCREASED from 100 to 120
    borderRadius: 60, // ✨ UPDATED radius to half of new size
    borderWidth: 4, // ✨ INCREASED border width for more prominent blue outline
    borderColor: '#3B82F6', // ✨ BLUE OUTLINE COLOR - Changed from white to blue
  },
  profileImageSkeleton: {
    width: 120, // ✨ UPDATED skeleton size to match new image size
    height: 120, // ✨ UPDATED skeleton size to match new image size
    borderRadius: 60, // ✨ UPDATED skeleton radius
    backgroundColor: '#E5E7EB',
    borderWidth: 4, // ✨ ADDED border to skeleton for consistency
    borderColor: '#D1D5DB', // ✨ SKELETON border color
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4, // ✨ ADJUSTED position for larger profile image
    right: 4, // ✨ ADJUSTED position for larger profile image
    width: 32, // ✨ INCREASED from 28 to 32 for better proportion
    height: 32, // ✨ INCREASED from 28 to 32 for better proportion
    borderRadius: 16, // ✨ UPDATED radius to half of new size
    backgroundColor: '#10B981',
    borderWidth: 4, // ✨ INCREASED border width
    borderColor: '#FFFFFF',
  },
  greetingTextContainer: {
    alignItems: 'center',
  },
  greetingSkeleton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  classRollSkeleton: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  skeletonClassRoll: {
    width: 100,
    height: 50,
    borderRadius: 12,
  },
  gradeInfoSkeleton: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  skeletonGradeCard: {
    width: 70,
    height: 60,
    borderRadius: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    fontFamily: 'Inter',
    textAlign: 'center',
    marginBottom: 18,
  },
  classRollContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  classRollCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    flex: 1,
  },
  classRollLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  classRollValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  gradeInfoContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  gradeCard: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    flex: 1,
  },
  gradeCardLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  gradeCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 8,
    marginHorizontal: 24,
    fontFamily: 'Inter',
  },
  gridContainer: {
    paddingHorizontal: 24,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15,
  },
  cardContent: {
    padding: 18,
    position: 'relative',
    zIndex: 1,
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    fontFamily: 'Inter',
  },
  cardDescription: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'Inter',
  },
  cardValue: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Inter',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonCard: {
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  skeletonContent: {
    alignItems: 'center',
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    marginBottom: 6,
    width: 60,
  },
  skeletonLineSmall: {
    height: 10,
    borderRadius: 5,
    width: 40,
  },
});

export default StudentDashboard;