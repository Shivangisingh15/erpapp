import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  ActivityIndicator, 
  Dimensions, 
  TouchableOpacity,
  Animated,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Progress from 'react-native-progress';
import { TabView, TabBar } from 'react-native-tab-view';

const screenWidth = Dimensions.get('window').width;

// Separate ResultCard component to properly use hooks
const ResultCard = ({ item, index: cardIndex }) => {
  const [cardAnim] = useState(new Animated.Value(0));
  
  useEffect(() => {
    Animated.timing(cardAnim, {
      toValue: 1,
      duration: 600,
      delay: cardIndex * 200,
      useNativeDriver: true,
    }).start();
  }, [cardIndex]);

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return '#FFD700';
    if (rank <= 10) return '#C0C0C0';
    if (rank <= 100) return '#CD7F32';
    return '#6B7280';
  };

  const getScoreColor = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return '#10B981';
    if (percentage >= 80) return '#F59E0B';
    if (percentage >= 70) return '#F97316';
    return '#EF4444';
  };

  return (
    <Animated.View
      style={[
        styles.resultCard,
        {
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        },
      ]}
    >
      <TouchableOpacity activeOpacity={0.95} style={styles.cardContainer}>
        {/* Header with rank badge */}
        <View style={styles.cardHeader}>
          <View style={styles.examInfo}>
            <Text style={styles.examName}>{item.exam_name}</Text>
            <Text style={styles.examDate}>
              {new Date(item.exam_date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>
          <View style={[styles.rankBadge, { backgroundColor: getRankBadgeColor(item.rank) }]}>
            <MaterialIcons name="emoji-events" size={16} color="#FFFFFF" />
            <Text style={styles.rankText}>#{item.rank}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <MaterialIcons name="confirmation-number" size={16} color="#6B7280" />
            <Text style={styles.statLabel}>Roll No</Text>
            <Text style={styles.statValue}>{item.omr_roll_no}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="school" size={16} color="#6B7280" />
            <Text style={styles.statLabel}>Batch</Text>
            <Text style={styles.statValue}>{item.batch}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="grade" size={16} color="#6B7280" />
            <Text style={styles.statLabel}>Total</Text>
            <Text style={styles.statValue}>{item.total}/300</Text>
          </View>
        </View>

        {/* Enhanced scores section */}
        <View style={styles.scoresContainer}>
          <Text style={styles.scoresTitle}>Subject-wise Performance</Text>
          
          {/* Physics */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreInfo}>
              <View style={[styles.subjectIcon, { backgroundColor: '#EF4444' }]}>
                <MaterialIcons name="flash-on" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.scoreLabel}>Physics</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor(item.phy, 100) }]}>
                {item.phy}/100
              </Text>
              <Progress.Bar
                progress={item.phy / 100}
                width={70}
                height={6}
                color={getScoreColor(item.phy, 100)}
                unfilledColor="#E5E7EB"
                borderWidth={0}
                borderRadius={3}
              />
            </View>
          </View>

          {/* Chemistry */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreInfo}>
              <View style={[styles.subjectIcon, { backgroundColor: '#3B82F6' }]}>
                <MaterialIcons name="science" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.scoreLabel}>Chemistry</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor(item.chem, 100) }]}>
                {item.chem}/100
              </Text>
              <Progress.Bar
                progress={item.chem / 100}
                width={70}
                height={6}
                color={getScoreColor(item.chem, 100)}
                unfilledColor="#E5E7EB"
                borderWidth={0}
                borderRadius={3}
              />
            </View>
          </View>

          {/* Mathematics */}
          <View style={styles.scoreRow}>
            <View style={styles.scoreInfo}>
              <View style={[styles.subjectIcon, { backgroundColor: '#10B981' }]}>
                <MaterialIcons name="functions" size={14} color="#FFFFFF" />
              </View>
              <Text style={styles.scoreLabel}>Mathematics</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={[styles.scoreValue, { color: getScoreColor(item.math, 100) }]}>
                {item.math}/100
              </Text>
              <Progress.Bar
                progress={item.math / 100}
                width={70}
                height={6}
                color={getScoreColor(item.math, 100)}
                unfilledColor="#E5E7EB"
                borderWidth={0}
                borderRadius={3}
              />
            </View>
          </View>

          {/* Total Score */}
          <View style={[styles.scoreRow, styles.totalScoreRow]}>
            <View style={styles.scoreInfo}>
              <View style={[styles.subjectIcon, { backgroundColor: '#8B5CF6' }]}>
                <MaterialIcons name="summarize" size={14} color="#FFFFFF" />
              </View>
              <Text style={[styles.scoreLabel, styles.totalLabel]}>Total Score</Text>
            </View>
            <View style={styles.progressContainer}>
              <Text style={[styles.scoreValue, styles.totalValue]}>
                {item.total}/300
              </Text>
              <Progress.Bar
                progress={item.total / 300}
                width={70}
                height={8}
                color="#8B5CF6"
                unfilledColor="#E5E7EB"
                borderWidth={0}
                borderRadius={4}
              />
            </View>
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>View Detailed Analysis</Text>
          <MaterialIcons name="arrow-forward" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ResultPage = ({ userId = '253' }) => {
  const [results, setResults] = useState({ cet: [], neet: [], jee_main: [], jee_adv: [] });
  const [studentName, setStudentName] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  
  const [routes] = useState([
    { key: 'cet', title: 'CET', icon: 'school-outline', color: '#6366F1' },
    { key: 'neet', title: 'NEET', icon: 'medical-outline', color: '#10B981' },
    { key: 'jee_main', title: 'JEE Main', icon: 'calculator-outline', color: '#F59E0B' },
    { key: 'jee_adv', title: 'JEE Adv', icon: 'rocket-outline', color: '#EF4444' },
  ]);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://erpbackend-gray.vercel.app/api/exams/getStudentResults', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        setResults(result.data);
        // Get student name from the first available exam result
        const firstResult = result.data.cet[0] || result.data.neet[0] || result.data.jee_main[0] || result.data.jee_adv[0];
        setStudentName(firstResult?.student_name || '');
      } else {
        throw new Error('Invalid response format');
      }
      
    } catch (error) {
      console.error('Error loading results:', error);
      setError(error.message);
      // Show error state but keep empty results
      setResults({ cet: [], neet: [], jee_main: [], jee_adv: [] });
      setStudentName('');
    } finally {
      setLoading(false);
      startAnimations();
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const renderResultCard = ({ item, index: cardIndex }) => (
    <ResultCard item={item} index={cardIndex} />
  );

  const renderEmptyState = (route) => (
    <Animated.View 
      style={[
        styles.emptyContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.emptyIconContainer, { backgroundColor: route.color + '20' }]}>
        <Ionicons 
          name={error ? "alert-circle-outline" : route.icon} 
          size={48} 
          color={error ? "#EF4444" : route.color} 
        />
      </View>
      <Text style={styles.emptyTitle}>
        {error ? "Unable to Load Results" : `No ${route.title} Results Yet`}
      </Text>
      <Text style={styles.emptyText}>
        {error 
          ? `Error: ${error}. Please check your connection and try again.`
          : `Your ${route.title} exam results will appear here once available.`
        }
      </Text>
      <TouchableOpacity 
        style={[styles.refreshButton, { backgroundColor: error ? "#EF4444" : route.color }]}
        onPress={error ? loadData : onRefresh}
      >
        <MaterialIcons name={error ? "refresh" : "refresh"} size={16} color="#FFFFFF" />
        <Text style={styles.refreshButtonText}>
          {error ? "Retry" : "Check for Updates"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderScene = ({ route }) => {
    const data = results[route.key];
    if (data.length === 0) {
      return renderEmptyState(route);
    }
    return (
      <FlatList
        data={data}
        renderItem={renderResultCard}
        keyExtractor={(item) => `${item.omr_roll_no}-${item.exam_name}`}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[route.color]}
            tintColor={route.color}
          />
        }
      />
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingTitle}>Loading Your Results</Text>
          <Text style={styles.loadingSubtitle}>Fetching data for User ID {userId}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.headerTitle}>Exam Results</Text>
              {studentName ? (
                <Text style={styles.headerSubtitle}>Welcome back, {studentName}!</Text>
              ) : null}
            </View>
            <View style={styles.profileIcon}>
              <MaterialIcons name="account-circle" size={40} color="#6366F1" />
            </View>
          </View>
        </View>
      </Animated.View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: screenWidth }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={[styles.tabIndicator, { backgroundColor: routes[index].color }]}
            style={styles.tabBar}
            labelStyle={styles.tabLabel}
            activeColor={routes[index].color}
            inactiveColor="#9CA3AF"
            renderIcon={({ route, color }) => (
              <Ionicons name={route.icon} size={18} color={color} />
            )}
            renderLabel={({ route, color }) => (
              <Text style={[styles.tabLabel, { color }]}>{route.title}</Text>
            )}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    marginBottom: 8,
  },
  headerGradient: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#E0E7FF',
  },
  profileIcon: {
    opacity: 0.9,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 8,
  },
  tabIndicator: {
    height: 3,
    borderRadius: 2,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'none',
    marginTop: 4,
  },
  resultCard: {
    marginBottom: 16,
    marginHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  scoresContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scoresTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  subjectIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 45,
    textAlign: 'right',
  },
  totalScoreRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    color: '#8B5CF6',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    marginTop: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingBottom: 24,
    paddingTop: 8,
  },
});

export default ResultPage;