// 📄 FILE: src/services/AnnouncementsService.js
class AnnouncementsService {
  static BASE_URL = 'https://erpbackend-gray.vercel.app/api/general/announcements';

  /**
   * Check if an announcement is within the last 24-48 hours
   */
  static isRecentAnnouncement(createdAt) {
    const now = new Date();
    const announcementDate = new Date(createdAt);
    const hoursDiff = (now - announcementDate) / (1000 * 60 * 60);
    return hoursDiff <= 48; // Within 48 hours
  }

  /**
   * Check if an announcement is within the last 6 months
   */
  static isWithinSixMonths(createdAt) {
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 6);
    const announcementDate = new Date(createdAt);
    return announcementDate >= sixMonthsAgo;
  }

  /**
   * Filter announcements by audience type
   */
  static filterByAudience(announcements, userType) {
    return announcements.filter(announcement => {
      const audience = announcement.audience?.toLowerCase();
      
      switch(userType.toLowerCase()) {
        case 'student':
          // Students see "Everyone" and "Students" announcements
          return audience === 'everyone' || audience === 'students';
          
        case 'admin':
          // Admins see "Everyone" and "Admin" announcements  
          return audience === 'everyone' || audience === 'admin';
          
        case 'teacher':
          // Teachers see "Everyone" and "Teacher" announcements
          return audience === 'everyone' || audience === 'teacher' || audience === 'teachers';
          
        default:
          // Default: show only "Everyone" announcements
          return audience === 'everyone';
      }
    });
  }

  /**
   * Fetch all announcements from API
   */
  static async fetchAllAnnouncements() {
    try {
      const response = await fetch(this.BASE_URL, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch announcements: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching announcements:', error);
      throw new Error('Unable to load announcements. Please check your internet connection.');
    }
  }

  /**
   * Get announcements for specific user type from last 6 months
   */
  static async getAnnouncementsForUser(userType) {
    try {
      const allAnnouncements = await this.fetchAllAnnouncements();
      
      // Filter by audience type
      const userAnnouncements = this.filterByAudience(allAnnouncements, userType);
      
      // Filter by time (last 6 months)
      const recentAnnouncements = userAnnouncements.filter(announcement => 
        this.isWithinSixMonths(announcement.created_at)
      );

      // Sort by date (newest first)
      return recentAnnouncements.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );
    } catch (error) {
      console.error('Error getting user announcements:', error);
      throw error;
    }
  }

  /**
   * Check if there are recent announcements for specific user type
   */
  static async hasRecentAnnouncementsForUser(userType) {
    try {
      const userAnnouncements = await this.getAnnouncementsForUser(userType);
      return userAnnouncements.some(announcement => 
        this.isRecentAnnouncement(announcement.created_at)
      );
    } catch (error) {
      console.error('Error checking recent announcements:', error);
      return false;
    }
  }

  /**
   * Get count of recent announcements for specific user type
   */
  static async getRecentAnnouncementsCount(userType) {
    try {
      const userAnnouncements = await this.getAnnouncementsForUser(userType);
      return userAnnouncements.filter(announcement => 
        this.isRecentAnnouncement(announcement.created_at)
      ).length;
    } catch (error) {
      console.error('Error getting recent announcements count:', error);
      return 0;
    }
  }

  /**
   * Format date for display
   */
  static formatRelativeDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
    });
  }

  /**
   * Format full date and time
   */
  static formatFullDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Get announcements with enhanced data for display
   */
  static async getFormattedAnnouncementsForUser(userType) {
    try {
      const announcements = await this.getAnnouncementsForUser(userType);
      
      return announcements.map(announcement => ({
        ...announcement,
        formattedDate: this.formatRelativeDate(announcement.created_at),
        formattedDateTime: this.formatFullDateTime(announcement.created_at),
        isRecent: this.isRecentAnnouncement(announcement.created_at),
        audienceColor: this.getAudienceColor(announcement.audience),
        priorityLevel: this.getPriorityLevel(announcement.audience, announcement.created_at),
      }));
    } catch (error) {
      console.error('Error getting formatted announcements:', error);
      throw error;
    }
  }

  /**
   * Get color for audience badge
   */
  static getAudienceColor(audience) {
    const audienceLower = audience?.toLowerCase();
    switch(audienceLower) {
      case 'everyone': return '#10b981'; // Green
      case 'students': return '#3b82f6'; // Blue  
      case 'admin': return '#f59e0b'; // Orange
      case 'teacher':
      case 'teachers': return '#8b5cf6'; // Purple
      default: return '#64748b'; // Gray
    }
  }

  /**
   * Get priority level for sorting/display
   */
  static getPriorityLevel(audience, createdAt) {
    const isRecent = this.isRecentAnnouncement(createdAt);
    const audienceLower = audience?.toLowerCase();
    
    if (isRecent && audienceLower === 'everyone') return 1; // Highest
    if (isRecent) return 2;
    if (audienceLower === 'everyone') return 3;
    return 4; // Lowest
  }
}

export default AnnouncementsService;