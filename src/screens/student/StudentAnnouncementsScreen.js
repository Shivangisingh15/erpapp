import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../../components/common/Header';


const { width } = Dimensions.get('window');

const colors = {
  primary: '#1e40af',
  primaryLight: '#3b82f6',
  primaryDark: '#1e3a8a',
  accent: '#06b6d4',
  white: '#ffffff',
  textLight: '#64748b',
  text: '#0f172a',
  background: '#f8fafc',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
  shadow: '#000000',
  cardBackground: '#ffffff',
  recentBg: '#fef2f2',
  recentBorder: '#fecaca',
  everyoneBg: '#f0fdf4',
  everyoneBorder: '#bbf7d0',
  studentBg: '#eff6ff',
  studentBorder: '#bfdbfe',
};

const spacing = {
  large: 24,
  medium: 16,
  small: 12,
  xSmall: 8,
};

const StudentAnnouncementsScreen = ({ navigation }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const fetchAnnouncements = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const data = await AnnouncementsService.getFormattedAnnouncementsForUser('student');
      setAnnouncements(data);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
      
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Failed to load announcements. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onRefresh = () => {
    fetchAnnouncements(true);
  };

  const getFilteredAnnouncements = () => {
    switch(filter) {
      case 'recent':
        return announcements.filter(a => a.isRecent);
      case 'everyone':
        return announcements.filter(a => a.audience?.toLowerCase() === 'everyone');
      case 'students':
        return announcements.filter(a => a.audience?.toLowerCase() === 'students');
      default:
        return announcements;
    }
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  const stats = {
    total: announcements.length,
    recent: announcements.filter(a => a.isRecent).length,
    everyone: announcements.filter(a => a.audience?.toLowerCase() === 'everyone').length,
    students: announcements.filter(a => a.audience?.toLowerCase() === 'students').length,
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
            All ({stats.total})
          </Text>
        </TouchableOpacity>
        
        {stats.recent > 0 && (
          <TouchableOpacity
            style={[styles.filterButton, filter === 'recent' && styles.filterButtonActive, styles.recentFilter]}
            onPress={() => setFilter('recent')}
          >
            <Icon name="fiber-new" size={16} color={filter === 'recent' ? colors.white : colors.error} />
            <Text style={[styles.filterText, filter === 'recent' && styles.filterTextActive, styles.recentFilterText]}>
              New ({stats.recent})
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'everyone' && styles.filterButtonActive, styles.everyoneFilter]}
          onPress={() => setFilter('everyone')}
        >
          <Icon name="public" size={16} color={filter === 'everyone' ? colors.white : colors.success} />
          <Text style={[styles.filterText, filter === 'everyone' && styles.filterTextActive]}>
            Everyone ({stats.everyone})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterButton, filter === 'students' && styles.filterButtonActive, styles.studentsFilter]}
          onPress={() => setFilter('students')}
        >
          <Icon name="school" size={16} color={filter === 'students' ? colors.white : colors.primaryLight} />
          <Text style={[styles.filterText, filter === 'students' && styles.filterTextActive]}>
            Students ({stats.students})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => {
    const getEmptyMessage = () => {
      switch(filter) {
        case 'recent': return 'No new announcements';
        case 'everyone': return 'No general announcements';
        case 'students': return 'No student-specific announcements';
        default: return 'No announcements';
      }
    };

    return (
      <Animated.View 
        style={[
          styles.emptyContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[colors.primaryLight, colors.accent]}
          style={styles.emptyIconContainer}
        >
          <Icon name="notifications-none" size={60} color={colors.white} />
        </LinearGradient>
        <Text style={styles.emptyTitle}>{getEmptyMessage()}</Text>
        <Text style={styles.emptySubtitle}>
          {filter === 'all' 
            ? 'No announcements have been made for students in the last 6 months.'
            : 'Try changing the filter to see more announcements.'
          }
        </Text>
      </Animated.View>
    );
  };

  const renderAnnouncementCard = (announcement, index) => {
    const audienceLower = announcement.audience?.toLowerCase();
    const isEveryone = audienceLower === 'everyone';
    const isStudents = audienceLower === 'students';
    
    const getCardStyle = () => {
      if (announcement.isRecent) {
        return [styles.card, styles.recentCard];
      }
      if (isEveryone) {
        return [styles.card, styles.everyoneCard];
      }
      if (isStudents) {
        return [styles.card, styles.studentsCard];
      }
      return styles.card;
    };

    return (
      <Animated.View
        key={announcement.id}
        style={[
          ...getCardStyle(),
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            {announcement.isRecent && (
              <View style={styles.recentIndicator}>
                <View style={styles.recentDot} />
                <Text style={styles.recentText}>NEW</Text>
              </View>
            )}
            
            <View style={[styles.audienceBadge, { backgroundColor: announcement.audienceColor }]}>
              <Icon 
                name={isEveryone ? "public" : "school"} 
                size={12} 
                color={colors.white} 
              />
              <Text style={styles.audienceBadgeText}>
                {announcement.audience}
              </Text>
            </View>
          </View>
          
          <View style={styles.dateContainer}>
            <Icon name="schedule" size={14} color={colors.textLight} />
            <Text style={styles.dateText}>{announcement.formattedDate}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle}>{announcement.subject}</Text>
        <Text style={styles.cardBody} numberOfLines={4}>{announcement.body}</Text>

        {announcement.body.length > 150 && (
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>Read more</Text>
            <Icon name="expand-more" size={16} color={colors.primary} />
          </TouchableOpacity>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.timestampText}>
            {announcement.formattedDateTime}
          </Text>
          
          {announcement.priorityLevel <= 2 && (
            <View style={styles.priorityIndicator}>
              <Icon name="priority-high" size={12} color={colors.warning} />
              <Text style={styles.priorityText}>Important</Text>
            </View>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading student announcements...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="error-outline" size={60} color={colors.error} />
          <Text style={styles.errorTitle}>Failed to Load</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchAnnouncements()}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.retryButtonGradient}
            >
              <Icon name="refresh" size={20} color={colors.white} />
              <Text style={styles.retryButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredAnnouncements.length === 0) {
      return renderEmptyState();
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredAnnouncements.map((announcement, index) => 
          renderAnnouncementCard(announcement, index)
        )}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      <Header
        title="Student Announcements"
        showBackButton={true}
        showNotifications={false}
        subtitle={`${stats.total} announcements • ${stats.recent} new`}
      />
      
      {!loading && !error && renderFilterButtons()}
      
      <View style={styles.content}>
        {renderContent()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    backgroundColor: colors.white,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    marginRight: spacing.small,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  recentFilter: {
    borderColor: colors.error,
  },
  everyoneFilter: {
    borderColor: colors.success,
  },
  studentsFilter: {
    borderColor: colors.primaryLight,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textLight,
    marginLeft: spacing.xSmall,
  },
  filterTextActive: {
    color: colors.white,
  },
  recentFilterText: {
    color: colors.error,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.large,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.error,
    marginTop: spacing.medium,
    marginBottom: spacing.small,
  },
  errorText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.large,
  },
  retryButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  retryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.medium,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.small,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.large,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.large,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.small,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: spacing.large,
    marginBottom: spacing.large,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.05)',
  },
  recentCard: {
    backgroundColor: colors.recentBg,
    borderColor: colors.recentBorder,
    borderWidth: 2,
  },
  everyoneCard: {
    backgroundColor: colors.everyoneBg,
    borderColor: colors.everyoneBorder,
    borderLeftWidth: 4,
  },
  studentsCard: {
    backgroundColor: colors.studentBg,
    borderColor: colors.studentBorder,
    borderLeftWidth: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.medium,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    flex: 1,
  },
  recentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.small,
    marginBottom: spacing.xSmall,
  },
  recentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.error,
    marginRight: spacing.xSmall,
  },
  recentText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.error,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  audienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.small,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: spacing.xSmall,
  },
  audienceBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.medium,
    lineHeight: 24,
  },
  cardBody: {
    fontSize: 15,
    color: colors.textLight,
    lineHeight: 22,
    marginBottom: spacing.medium,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: spacing.medium,
  },
  readMoreText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginRight: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.medium,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  timestampText: {
    fontSize: 11,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 11,
    color: colors.warning,
    fontWeight: '500',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: spacing.large,
  },
});

export default StudentAnnouncementsScreen;
