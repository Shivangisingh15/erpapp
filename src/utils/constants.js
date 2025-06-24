// App Information
export const APP_INFO = {
  name: 'Chaitanya Academy ERP',
  version: '1.0.0',
  description: 'Complete School Management Solution',
};

// School Information
export const SCHOOL_INFO = {
  name: 'CHAITANYA ACADEMY',
  shortName: 'CA',
  tagline: 'Excellence in Education',
  address: '',
  phone: '',
  email: '',
  website: '',
};

// API Configuration (for future use)
export const API_CONFIG = {
  baseURL: 'https://api.chaitanyaacademy.com', // Replace with actual API URL
  timeout: 10000,
  version: 'v1',
};

// Screen Names
export const SCREENS = {
  SPLASH: 'Splash',
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  DASHBOARD: 'Dashboard',
  STUDENT_LIST: 'StudentList',
  TEACHER_LIST: 'TeacherList',
  FEE_MANAGEMENT: 'FeeManagement',
  REPORTS: 'Reports',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
};

// App Settings
export const APP_SETTINGS = {
  splashDuration: 3000, // 3 seconds
  animationDuration: 300,
  defaultTimeout: 5000,
};

// Validation Rules
export const VALIDATION = {
  minPasswordLength: 6,
  maxPasswordLength: 20,
  phoneNumberLength: 10,
  maxNameLength: 50,
};

// Date Formats
export const DATE_FORMATS = {
  display: 'DD/MM/YYYY',
  api: 'YYYY-MM-DD',
  time: 'HH:mm',
  dateTime: 'DD/MM/YYYY HH:mm',
};

// File Types
export const FILE_TYPES = {
  images: ['jpg', 'jpeg', 'png', 'gif'],
  documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
  maxImageSize: 5 * 1024 * 1024, // 5MB
  maxDocumentSize: 10 * 1024 * 1024, // 10MB
};

// Academic Information
export const ACADEMIC = {
  classes: [
    'Nursery', 'LKG', 'UKG',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
    'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
    'Class 11', 'Class 12'
  ],
  sections: ['A', 'B', 'C', 'D', 'E'],
  subjects: [
    'Mathematics', 'Science', 'English', 'Hindi', 'Social Studies',
    'Computer Science', 'Physical Education', 'Art', 'Music'
  ],
  examTypes: ['Unit Test', 'Mid Term', 'Final Exam', 'Assignment', 'Project'],
  feeTypes: ['Tuition Fee', 'Transport Fee', 'Library Fee', 'Lab Fee', 'Activity Fee'],
  academicYear: '2024-25',
};

// Status Types
export const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
  UNPAID: 'unpaid',
  OVERDUE: 'overdue',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  ANNOUNCEMENT: 'announcement',
  REMINDER: 'reminder',
};

// Storage Keys (for AsyncStorage)
export const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  APP_SETTINGS: '@app_settings',
  OFFLINE_DATA: '@offline_data',
  LAST_SYNC: '@last_sync',
};

// Network Status
export const NETWORK_STATUS = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  SLOW: 'slow',
};

// Default Values
export const DEFAULTS = {
  profileImage: 'https://via.placeholder.com/150x150?text=Profile',
  itemsPerPage: 10,
  maxRetries: 3,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
};