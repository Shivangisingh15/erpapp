import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  SafeAreaView,
  Easing,
  Alert,
  Image,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from "react-native-vector-icons/MaterialIcons";
import { __DEV__ } from 'react-native';

const { width, height } = Dimensions.get('window');

// Cosmic Digital Biophilia Design System - Light Mode
const cosmicTheme = {
  colors: {
    // Light Cosmic Backgrounds
    cosmicLight: '#FAFBFF',
    cosmicMid: '#F1F5FF',
    cosmicDeep: '#E8EFFF',
    
    // Enhanced Accent Colors for Light Mode
    auroraViolet: '#6366F1',
    auroraVioletLight: '#8B5CF6',
    auroraVioletDark: '#4F46E5',
    plasmaMint: '#10B981',
    plasmaMintLight: '#34D399',
    plasmaMintDark: '#059669',
    
    // Light Mode Glassmorphism
    glassWhite: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.9)',
    glassHover: 'rgba(255, 255, 255, 0.8)',
    glassShadow: 'rgba(99, 102, 241, 0.1)',
    
    // Text Colors for Light Mode
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textOnColor: '#FFFFFF',
    
    // Supporting Colors
    starlight: '#FFFFFF',
    nebula: '#CBD5E1',
    cosmicGlow: '#F1F5F9',
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },
  
  typography: {
    cosmic1: { fontSize: 32, fontWeight: '800', lineHeight: 40 },
    cosmic2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
    cosmic3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
    cosmic4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
    cosmic5: { fontSize: 18, fontWeight: '500', lineHeight: 24 },
    cosmic6: { fontSize: 16, fontWeight: '500', lineHeight: 22 },
    body: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
  },
  
  shadows: {
    soft: {
      shadowColor: 'rgba(99, 102, 241, 0.15)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 4,
    },
    medium: {
      shadowColor: 'rgba(99, 102, 241, 0.2)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 24,
      elevation: 8,
    },
  },
  
  animations: {
    spring: {
      tension: 150,
      friction: 15,
    },
    staggerDelay: 100,
  },
};

// Simple Icon Component
const CosmicIcon = ({ name, size = 20, color = cosmicTheme.colors.textPrimary }) => (
  <Icon name={name} size={size} color={color} />
);

// Debug Panel Component
const DebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const runFullDiagnostic = async () => {
    let report = '🔍 FULL DIAGNOSTIC REPORT\n';
    report += '================================\n\n';
    
    try {
      // Check AsyncStorage
      report += '📱 ASYNCSTORAGE CHECK:\n';
      const allKeys = await AsyncStorage.getAllKeys();
      report += `Keys found: ${allKeys.length}\n`;
      report += `Keys: ${allKeys.join(', ')}\n\n`;
      
      // Check for ERP tokens
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        report += '🔑 ERP TOKENS FOUND:\n';
        report += `Token keys: ${Object.keys(tokens).join(', ')}\n`;
        report += `Has accessToken: ${!!tokens.accessToken}\n`;
        report += `Has refreshToken: ${!!tokens.refreshToken}\n`;
        
        // Check if using demo tokens
        const isDemo = tokens.accessToken === 'demo-token-for-testing';
        report += `Is Demo Token: ${isDemo ? 'YES (This is the problem!)' : 'NO'}\n`;
        
        if (isDemo) {
          report += '⚠️ DEMO TOKENS DETECTED!\n';
          report += 'Demo tokens will not work for student data.\n';
          report += 'You need real authentication tokens from login.\n\n';
        } else {
          report += `Access Token: ${tokens.accessToken.substring(0, 20)}...\n\n`;
        }
      } else {
        report += '❌ NO ERP TOKENS FOUND\n\n';
      }
      
      // Test API endpoints
      report += '🌐 API ENDPOINT TESTS:\n';
      const API_BASE = 'https://erpbackend-gray.vercel.app/api/general';
      
      // Test announcements (this should work)
      try {
        const announcementsResponse = await fetch(`${API_BASE}/announcements`);
        report += `Announcements: ${announcementsResponse.status} - ${announcementsResponse.ok ? 'SUCCESS ✅' : 'FAILED ❌'}\n`;
        
        if (announcementsResponse.ok) {
          const data = await announcementsResponse.json();
          report += `Announcements count: ${Array.isArray(data) ? data.length : 'Not array'}\n`;
        }
      } catch (err) {
        report += `Announcements: ERROR - ${err.message}\n`;
      }
      
      // Test student endpoints systematically
      report += '\n📚 COMPREHENSIVE STUDENT ENDPOINT TEST:\n';
      
      if (tokensString) {
        const tokens = JSON.parse(tokensString);
        const isDemo = tokens.accessToken === 'demo-token-for-testing';
        
        if (isDemo) {
          report += '❌ Skipping student test - demo tokens detected\n';
          report += 'Demo tokens will return 404 for student data\n';
          report += 'SOLUTION: Login with real student credentials\n';
        } else {
          report += '🎉 REAL AUTHENTICATION DETECTED!\n';
          
          const authHeaders = {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          };
          
          // Test all possible student endpoints
          const studentEndpoints = [
            { name: 'GET /student/118', method: 'GET', url: `${API_BASE}/student/118` },
            { name: 'GET /student?id=118', method: 'GET', url: `${API_BASE}/student?id=118` },
            { name: 'GET /student', method: 'GET', url: `${API_BASE}/student` },
            { name: 'POST /student', method: 'POST', url: `${API_BASE}/student`, body: { id: 118 } },
            { name: 'GET /students/118', method: 'GET', url: `${API_BASE}/students/118` },
            { name: 'GET /user', method: 'GET', url: `${API_BASE}/user` },
            { name: 'GET /profile', method: 'GET', url: `${API_BASE}/profile` },
            { name: 'GET /me', method: 'GET', url: `${API_BASE}/me` },
          ];
          
          let workingEndpoint = null;
          
          for (const endpoint of studentEndpoints) {
            try {
              const options = {
                method: endpoint.method,
                headers: authHeaders,
              };
              
              if (endpoint.body) {
                options.body = JSON.stringify(endpoint.body);
              }
              
              const response = await fetch(endpoint.url, options);
              const status = response.status;
              const success = response.ok;
              
              report += `${endpoint.name}: ${status} - ${success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
              
              if (success) {
                const data = await response.json();
                // Check if this looks like student data
                if (data && (data.student_id || data.roll_no || data.first_name || data.id === 118)) {
                  workingEndpoint = endpoint.name;
                  report += `  🎯 WORKING ENDPOINT FOUND: ${endpoint.name}\n`;
                  report += `  👨‍🎓 Student: ${data.first_name || 'N/A'} ${data.last_name || ''}\n`;
                  report += `  🎓 Class: ${data.adm_class || 'N/A'}${data.division || ''}\n`;
                  report += `  📋 Roll: ${data.roll_no || 'N/A'}\n`;
                  break; // Found working endpoint, stop testing
                } else {
                  report += `  ⚠️ Response doesn't look like student data\n`;
                }
              } else {
                const errorText = await response.text();
                const shortError = errorText.substring(0, 50).replace(/\n/g, ' ');
                report += `  Error: ${shortError}...\n`;
              }
            } catch (err) {
              report += `${endpoint.name}: NETWORK ERROR - ${err.message}\n`;
            }
          }
          
          if (workingEndpoint) {
            report += `\n🎉 SOLUTION FOUND!\n`;
            report += `✅ Use: ${workingEndpoint}\n`;
            report += `✅ Your authentication is working!\n`;
          } else {
            report += `\n❌ NO WORKING ENDPOINT FOUND\n`;
            report += `Possible causes:\n`;
            report += `1. API structure changed\n`;
            report += `2. Student ID 118 not accessible\n`;
            report += `3. Token expired\n`;
            report += `4. Permission issues\n`;
          }
        }
      } else {
        report += '❌ No tokens available for student test\n';
      }
      
      // Provide solutions
      report += '\n💡 SOLUTIONS:\n';
      if (!tokensString) {
        report += '1. Login to your student account first\n';
        report += '2. Make sure login saves tokens to AsyncStorage\n';
      } else {
        const tokens = JSON.parse(tokensString);
        const isDemo = tokens.accessToken === 'demo-token-for-testing';
        
        if (isDemo) {
          report += '1. ❌ Remove demo tokens\n';
          report += '2. ✅ Login with real student credentials\n';
          report += '3. ✅ Ensure login screen saves real tokens\n';
        } else {
          report += '1. Check if login session expired\n';
          report += '2. Try logging out and logging back in\n';
          report += '3. Verify student ID (118) is correct\n';
          report += '4. Contact administration if issue persists\n';
        }
      }
      
      report += '\n✅ DIAGNOSTIC COMPLETE\n';
      
    } catch (error) {
      report += `\n❌ DIAGNOSTIC ERROR: ${error.message}\n`;
    }
    
    setDebugInfo(report);
    console.log(report);
    Alert.alert('Diagnostic Complete', 'Check console for full report');
  };

  return (
    <View style={styles.debugPanel}>
      <TouchableOpacity
        style={styles.debugToggle}
        onPress={() => setIsVisible(!isVisible)}
      >
        <Text style={styles.debugToggleText}>🔧 Debug</Text>
      </TouchableOpacity>
      
      {isVisible && (
        <View style={styles.debugContent}>
          <View style={styles.debugHeader}>
            <Text style={styles.debugTitle}>Debug Panel</Text>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Text style={styles.debugClose}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.debugScroll}>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={runFullDiagnostic}
            >
              <Text style={styles.debugButtonText}>🔍 Run Full Diagnostic</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.debugButton}
              onPress={async () => {
                try {
                  const tokensString = await AsyncStorage.getItem("ERPTokens");
                  if (!tokensString) {
                    Alert.alert('No Tokens', 'No authentication tokens found');
                    return;
                  }
                  
                  const tokens = JSON.parse(tokensString);
                  const authHeaders = {
                    'Authorization': `Bearer ${tokens.accessToken}`,
                    'Content-Type': 'application/json',
                  };
                  
                  // Test the most likely working endpoints
                  const quickTests = [
                    { name: 'GET /student/118', method: 'GET', url: 'https://erpbackend-gray.vercel.app/api/general/student/118' },
                    { name: 'GET /student', method: 'GET', url: 'https://erpbackend-gray.vercel.app/api/general/student' },
                    { name: 'GET /me', method: 'GET', url: 'https://erpbackend-gray.vercel.app/api/general/me' },
                  ];
                  
                  let results = '';
                  for (const test of quickTests) {
                    try {
                      const response = await fetch(test.url, {
                        method: test.method,
                        headers: authHeaders,
                      });
                      results += `${test.name}: ${response.status} ${response.ok ? '✅' : '❌'}\n`;
                      if (response.ok) {
                        const data = await response.json();
                        if (data.first_name) {
                          results += `  Found: ${data.first_name} ${data.last_name}\n`;
                        }
                      }
                    } catch (err) {
                      results += `${test.name}: ERROR\n`;
                    }
                  }
                  
                  Alert.alert('Quick Endpoint Test', results);
                } catch (error) {
                  Alert.alert('Test Error', error.message);
                }
              }}
            >
              <Text style={styles.debugButtonText}>🚀 Quick Endpoint Test</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.debugButton}
              onPress={async () => {
                const allKeys = await AsyncStorage.getAllKeys();
                const items = [];
                for (const key of allKeys) {
                  const value = await AsyncStorage.getItem(key);
                  items.push(`${key}: ${value}`);
                }
                Alert.alert('AsyncStorage', items.join('\n\n'));
              }}
            >
              <Text style={styles.debugButtonText}>💾 Check AsyncStorage</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.debugButton}
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem("ERPTokens");
                  Alert.alert('Success', 'All tokens cleared! You can now login with real credentials.');
                } catch (error) {
                  Alert.alert('Error', 'Failed to clear tokens: ' + error.message);
                }
              }}
            >
              <Text style={styles.debugButtonText}>🗑️ Clear All Tokens</Text>
            </TouchableOpacity>
            
            {debugInfo ? (
              <View style={styles.debugReport}>
                <Text style={styles.debugReportTitle}>Latest Diagnostic:</Text>
                <Text style={styles.debugReportText}>{debugInfo}</Text>
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const SchoolDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [studentData, setStudentData] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(''); // Track if API or dummy data

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef([...Array(10)].map(() => new Animated.Value(50))).current;
  const floatingAnims = useRef([...Array(6)].map(() => new Animated.Value(0))).current;
  const pulseAnims = useRef([...Array(4)].map(() => new Animated.Value(1))).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef([...Array(6)].map(() => new Animated.Value(1))).current;

  // API endpoints
  const API_BASE = 'https://erpbackend-gray.vercel.app/api/general';

  useEffect(() => {
    fetchData();
    
    // Start floating animations immediately
    startFloatingAnimations();
    startPulseAnimations();
    startRotationAnimation();

    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const createDemoTokens = async () => {
    console.log('🔧 Creating demo tokens for testing...');
    const demoTokens = {
      accessToken: 'demo-token-for-testing',
      refreshToken: 'demo-refresh-token'
    };
    
    try {
      await AsyncStorage.setItem("ERPTokens", JSON.stringify(demoTokens));
      console.log('✅ Demo tokens created successfully');
      Alert.alert(
        'Demo Tokens Created', 
        '⚠️ WARNING: These are demo tokens that will NOT work for student data. They are only for testing the announcements feature.\n\nTo access your student dashboard, you need to login with your real student credentials through the proper login screen.',
        [
          { text: 'I Understand', style: 'default' },
          { text: 'Try Demo Anyway', onPress: fetchData }
        ]
      );
    } catch (error) {
      console.error('❌ Failed to create demo tokens:', error);
    }
  };

  const testApiConnectivity = async () => {
    console.log('🔧 Enhanced API connectivity test...');
    
    try {
      // Test 1: Basic connectivity to announcements
      console.log('Test 1: Basic announcements endpoint...');
      const announcementsTest = await fetch(`${API_BASE}/announcements`);
      console.log(`Announcements status: ${announcementsTest.status}`);
      
      if (announcementsTest.ok) {
        const data = await announcementsTest.json();
        console.log('✅ Announcements working:', data);
      }

      // Test 2: Try different student endpoints
      const testEndpoints = [
        { url: `${API_BASE}/student`, method: 'POST', body: { id: 118 } },
        { url: `${API_BASE}/student/118`, method: 'GET' },
        { url: `${API_BASE}/students/118`, method: 'GET' },
        { url: `${API_BASE}/student?id=118`, method: 'GET' },
      ];

      for (const test of testEndpoints) {
        try {
          console.log(`Testing: ${test.method} ${test.url}`);
          
          const options = {
            method: test.method,
            headers: { 'Content-Type': 'application/json' },
          };
          
          if (test.body) {
            options.body = JSON.stringify(test.body);
          }
          
          const response = await fetch(test.url, options);
          console.log(`Status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Working endpoint found!', data);
            Alert.alert('Success!', `Working endpoint: ${test.method} ${test.url}`);
            return;
          } else {
            const errorText = await response.text();
            console.log(`Error: ${errorText}`);
          }
        } catch (err) {
          console.log(`Error testing ${test.url}:`, err.message);
        }
      }
      
      Alert.alert('API Test Complete', 'Check console for detailed results. No working student endpoint found.');
      
    } catch (error) {
      console.log('❌ Connectivity test failed:', error);
      Alert.alert('Test Failed', 'Cannot reach the API servers.');
    }
  };

  const getAuthHeaders = async () => {
    try {
      const tokensString = await AsyncStorage.getItem("ERPTokens");
      console.log('🔍 Checking for stored tokens...');
      
      if (!tokensString) {
        console.log('⚠️ No auth tokens found in AsyncStorage');
        // Check what's actually in AsyncStorage
        const allKeys = await AsyncStorage.getAllKeys();
        console.log('📋 Available AsyncStorage keys:', allKeys);
        return null;
      }
      
      const tokens = JSON.parse(tokensString);
      console.log('📋 Stored tokens structure:', Object.keys(tokens));
      
      if (!tokens.accessToken) {
        console.log('⚠️ No access token found in stored tokens');
        console.log('📋 Available token fields:', Object.keys(tokens));
        return null;
      }
      
      console.log('✅ Auth tokens found and formatted');
      return {
        'Authorization': `Bearer ${tokens.accessToken}`,
        'Content-Type': 'application/json',
      };
    } catch (error) {
      console.error("❌ Error processing auth headers:", error);
      return null;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🚀 Starting data fetch process...');
      
      // First, test announcements endpoint (this works)
      console.log('📢 Testing announcements endpoint...');
      let announcementsResult = [];
      let announcementsDataSource = '';
      
      try {
        const announcementsResponse = await fetch(`${API_BASE}/announcements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log(`📡 Announcements response status: ${announcementsResponse.status}`);
        
        if (announcementsResponse.ok) {
          const announcementsData = await announcementsResponse.json();
          announcementsResult = Array.isArray(announcementsData) ? announcementsData : [];
          announcementsDataSource = 'API (public)';
          console.log('✅ Announcements fetched successfully:', announcementsResult);
        } else {
          console.log(`⚠️ Announcements failed with status: ${announcementsResponse.status}`);
        }
      } catch (announcementError) {
        console.log('❌ Announcements fetch error:', announcementError.message);
      }

      // Now try to fetch student data with multiple approaches
      console.log('👤 Attempting to fetch student data...');
      let studentResult = null;
      let studentDataSource = '';

      // Get auth headers
      const authHeaders = await getAuthHeaders();
      console.log('🔐 Auth headers available:', !!authHeaders);
      
      if (authHeaders) {
        // Check if we have real tokens or demo tokens
        const tokensString = await AsyncStorage.getItem("ERPTokens");
        const tokens = JSON.parse(tokensString || '{}');
        const isDemo = tokens.accessToken === 'demo-token-for-testing';
        
        if (isDemo) {
          console.log('⚠️ Demo tokens detected - these won\'t work for student data');
          throw new Error('Demo tokens detected. Student data requires real authentication tokens from a proper login. Please login with your actual student credentials to access your dashboard data.');
        }
        
        console.log('🔑 Real auth tokens found, testing multiple endpoints...');
        
        // Try multiple endpoint combinations
        const endpointTests = [
          // Method 1: GET with student ID in URL path
          {
            name: 'GET /student/118',
            method: 'GET',
            url: `${API_BASE}/student/118`,
            headers: authHeaders
          },
          // Method 2: GET with student ID as query parameter
          {
            name: 'GET /student?id=118',
            method: 'GET', 
            url: `${API_BASE}/student?id=118`,
            headers: authHeaders
          },
          // Method 3: GET without ID (might return current user)
          {
            name: 'GET /student',
            method: 'GET',
            url: `${API_BASE}/student`,
            headers: authHeaders
          },
          // Method 4: POST with ID in body (original approach)
          {
            name: 'POST /student',
            method: 'POST',
            url: `${API_BASE}/student`,
            headers: authHeaders,
            body: JSON.stringify({ id: 118 })
          },
          // Method 5: Try different student endpoints
          {
            name: 'GET /students/118',
            method: 'GET',
            url: `${API_BASE}/students/118`,
            headers: authHeaders
          },
          // Method 6: Try user endpoint instead
          {
            name: 'GET /user',
            method: 'GET',
            url: `${API_BASE}/user`,
            headers: authHeaders
          },
          // Method 7: Try profile endpoint
          {
            name: 'GET /profile',
            method: 'GET',
            url: `${API_BASE}/profile`,
            headers: authHeaders
          },
          // Method 8: Try me endpoint (common for current user)
          {
            name: 'GET /me',
            method: 'GET',
            url: `${API_BASE}/me`,
            headers: authHeaders
          }
        ];
        
        for (const test of endpointTests) {
          try {
            console.log(`🧪 Testing: ${test.name}`);
            
            const requestOptions = {
              method: test.method,
              headers: test.headers
            };
            
            if (test.body) {
              requestOptions.body = test.body;
            }
            
            const response = await fetch(test.url, requestOptions);
            console.log(`📡 ${test.name} response status: ${response.status}`);
            
            if (response.ok) {
              const data = await response.json();
              console.log(`✅ SUCCESS with ${test.name}:`, data);
              
              // Check if this looks like student data
              if (data && (data.student_id || data.roll_no || data.first_name || data.id === 118)) {
                studentResult = data;
                studentDataSource = `API (${test.name})`;
                console.log(`🎉 Found student data using ${test.name}!`);
                break; // Stop testing once we find working endpoint
              } else {
                console.log(`⚠️ ${test.name} returned data but doesn't look like student info`);
              }
            } else {
              const errorText = await response.text();
              console.log(`❌ ${test.name} failed: ${response.status} - ${errorText.substring(0, 100)}...`);
              
              // Log specific error types
              if (response.status === 401) {
                console.log(`🔐 ${test.name}: Authentication failed`);
              } else if (response.status === 403) {
                console.log(`🚫 ${test.name}: Access denied`);
              } else if (response.status === 404) {
                console.log(`❓ ${test.name}: Endpoint not found`);
              }
            }
          } catch (testError) {
            console.log(`❌ ${test.name} error:`, testError.message);
          }
        }
        
        // If no endpoint worked, provide detailed error
        if (!studentResult) {
          console.log('❌ All student endpoints failed');
          throw new Error('Could not fetch student data from any known endpoint. This could mean:\n\n1. The API structure has changed\n2. Your authentication tokens expired\n3. The student ID (118) is not accessible with your current permissions\n4. The server is experiencing issues\n\nPlease try logging out and logging back in, or contact administration.');
        }
        
      } else {
        console.log('🔓 No authentication tokens found');
        throw new Error('No authentication tokens found. Please login to your student account first to access the dashboard.');
      }

      // Success! Set the data
      setStudentData(studentResult);
      setAnnouncements(announcementsResult);
      setDataSource(`Student: ${studentDataSource}, Announcements: ${announcementsDataSource}`);
      
      console.log(`🎉 SUCCESS! Real authentication working!`);
      console.log(`📊 Data Source: ${studentDataSource} | ${announcementsDataSource}`);
      console.log(`👨‍🎓 Student: ${studentResult?.first_name} ${studentResult?.last_name}`);
      console.log(`🎓 Class: ${studentResult?.adm_class}${studentResult?.division}`);
      console.log(`📋 Roll: ${studentResult?.roll_no}`);
      
      // Start animations after successful data fetch
      setTimeout(() => {
        setLoading(false);
        startEntranceAnimations();
      }, 1000);

    } catch (error) {
      console.error('❌ Final error:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const startEntranceAnimations = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const staggeredAnimations = slideAnims.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 0,
        delay: index * cosmicTheme.animations.staggerDelay,
        ...cosmicTheme.animations.spring,
        useNativeDriver: true,
      })
    );

    Animated.parallel(staggeredAnimations).start();
  };

  const startFloatingAnimations = () => {
    floatingAnims.forEach((anim, index) => {
      const floatLoop = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + (index * 500),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000 + (index * 500),
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]).start(floatLoop);
      };
      floatLoop();
    });
  };

  const startPulseAnimations = () => {
    pulseAnims.forEach((anim, index) => {
      const pulseLoop = () => {
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.1,
            duration: 2000 + (index * 300),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 2000 + (index * 300),
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start(pulseLoop);
      };
      pulseLoop();
    });
  };

  const startRotationAnimation = () => {
    const rotateLoop = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(rotateLoop);
    };
    rotateLoop();
  };

  const handleCardPress = useCallback((cardId, animIndex) => {
    Animated.sequence([
      Animated.spring(scaleAnims[animIndex], {
        toValue: 0.95,
        ...cosmicTheme.animations.spring,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[animIndex], {
        toValue: 1,
        ...cosmicTheme.animations.spring,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getLatestAnnouncement = () => {
    if (!announcements || announcements.length === 0) return null;
    
    return announcements.reduce((latest, current) => {
      const latestDate = new Date(latest.created_at);
      const currentDate = new Date(current.created_at);
      return currentDate > latestDate ? current : latest;
    });
  };

  const formatAnnouncementDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getAcademicStats = () => {
    if (!studentData) return null;
    
    const feeStatus = studentData.additial_amount > 0 ? 'Pending' : 'Paid';
    const totalFee = 200000; // Estimate based on scholarship amount
    const scholarshipPercent = Math.round((studentData.scholarship_amt / totalFee) * 100);
    const hostelStatus = studentData.hostel ? 'Yes' : 'No';
    
    return [
      {
        id: '1',
        title: 'Class & Division',
        value: `${studentData.adm_class}${studentData.division}`,
        emoji: '🎓',
        trend: 'Current',
        color: cosmicTheme.colors.auroraViolet,
        bgColor: cosmicTheme.colors.auroraViolet + '10',
        description: 'Academic Year',
      },
     
      {
        id: '2',
        title: 'Scholarship',
        value: `₹${(studentData.scholarship_amt / 1000).toFixed(0)}k`,
        emoji: '🌟',
        trend: `${scholarshipPercent}%`,
        color: cosmicTheme.colors.auroraVioletLight,
        bgColor: cosmicTheme.colors.auroraVioletLight + '10',
        description: 'Financial Aid',
      },
      {
        id: '3',
        title: 'Fee Status',
        value: feeStatus,
        emoji: feeStatus === 'Paid' ? '✅' : '⏳',
        trend: studentData.additial_amount > 0 ? `₹${studentData.additial_amount.toLocaleString()}` : 'Clear',
        color: feeStatus === 'Paid' ? cosmicTheme.colors.success : cosmicTheme.colors.warning,
        bgColor: (feeStatus === 'Paid' ? cosmicTheme.colors.success : cosmicTheme.colors.warning) + '10',
        description: 'Payment Status',
      },
      {
        id: '4',
        title: 'Hostel',
        value: hostelStatus,
        emoji: hostelStatus === 'Yes' ? '🏠' : '🚫',
        trend: hostelStatus === 'Yes' ? 'Resident' : 'Day Scholar',
        color: hostelStatus === 'Yes' ? cosmicTheme.colors.info : cosmicTheme.colors.textSecondary,
        bgColor: (hostelStatus === 'Yes' ? cosmicTheme.colors.info : cosmicTheme.colors.textSecondary) + '10',
        description: 'Accommodation',
      },
    
    ];
  };

  const quickActions = [
    { id: '1', title: 'Assignments', emoji: '📚', count: 'View pending', color: cosmicTheme.colors.auroraViolet },
    { id: '2', title: 'Attendance', emoji: '📅', count: 'Check status', color: cosmicTheme.colors.success },
    { id: '3', title: 'Fee Payment', emoji: '💰', count: `₹${studentData?.additial_amount?.toLocaleString() || '0'} due`, color: studentData?.additial_amount > 0 ? cosmicTheme.colors.warning : cosmicTheme.colors.success },
    { id: '4', title: 'Results', emoji: '📊', count: 'View grades', color: cosmicTheme.colors.plasmaMint },
    { id: '5', title: 'Library', emoji: '📖', count: 'Browse books', color: cosmicTheme.colors.auroraVioletLight },
    { id: '6', title: 'Timetable', emoji: '📋', count: 'Class schedule', color: cosmicTheme.colors.info },
  ];

  const renderLoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={[cosmicTheme.colors.cosmicLight, cosmicTheme.colors.cosmicMid, cosmicTheme.colors.cosmicDeep]}
        style={StyleSheet.absoluteFill}
      />
      
      {[...Array(12)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.cosmicParticle,
            {
              left: Math.random() * width,
              top: Math.random() * height,
              backgroundColor: index % 2 === 0 ? cosmicTheme.colors.auroraViolet + '60' : cosmicTheme.colors.plasmaMint + '60',
              transform: [
                {
                  translateY: floatingAnims[index % 6]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                  }) || 0,
                },
                {
                  scale: pulseAnims[index % 4]?.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.5, 1],
                  }) || 1,
                },
              ],
              opacity: 0.8,
            },
          ]}
        />
      ))}

      <View style={styles.loadingContent}>
        <Animated.View
          style={[
            styles.cosmicLoader,
            {
              transform: [
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={[cosmicTheme.colors.auroraViolet, cosmicTheme.colors.plasmaMint, cosmicTheme.colors.auroraVioletLight]}
            style={styles.loaderRing}
          />
          <View style={styles.loaderCenter}>
            <Text style={styles.loaderEmoji}>🎓</Text>
          </View>
        </Animated.View>
        
        <Text style={styles.loadingTitle}>🏫 Loading Your School Portal</Text>
        <Text style={styles.loadingSubtitle}>Fetching your academic data...</Text>
        
        <View style={styles.loadingDots}>
          {[...Array(3)].map((_, index) => (
            <Animated.View
              key={index}
              style={[
                styles.loadingDot,
                {
                  backgroundColor: index % 2 === 0 ? cosmicTheme.colors.auroraViolet : cosmicTheme.colors.plasmaMint,
                  transform: [
                    {
                      scale: pulseAnims[index]?.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [0.8, 1.2],
                      }) || 1,
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderErrorScreen = () => (
    <View style={styles.errorContainer}>
      <LinearGradient
        colors={[cosmicTheme.colors.cosmicLight, cosmicTheme.colors.cosmicMid]}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.errorContent}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorEmoji}>
            {error.includes('Authentication') ? '🔐' : '📡'}
          </Text>
        </View>
        
        <Text style={styles.errorTitle}>
          {error.includes('Authentication') ? 'Login Required' : 'Connection Issue'}
        </Text>
        <Text style={styles.errorMessage}>
          {error.includes('Demo tokens detected') 
            ? '⚠️ You are using demo tokens which only work for announcements. To access your student dashboard with grades, attendance, and personal information, you need to login with your real student credentials through the proper login screen.'
            : error.includes('Authentication failed')
            ? 'Your login session has expired. Please login again with your student credentials to continue.'
            : error.includes('No authentication tokens')
            ? 'Please login to your student account first. The dashboard requires authentication to display your personal academic information.'
            : error.includes('Student record not found')
            ? 'Your student record could not be found. Please verify your student ID with the administration office, or try logging out and logging back in.'
            : error.includes('Access denied')
            ? 'You do not have permission to access this student data. Please contact the administration office to verify your account permissions.'
            : 'Unable to connect to the school servers or fetch your student data. Please try again later or contact the administration office.'
          }
        </Text>
        
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchData}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[cosmicTheme.colors.auroraViolet, cosmicTheme.colors.auroraVioletLight]}
            style={styles.retryGradient}
          >
            <CosmicIcon name="refresh" size={18} color={cosmicTheme.colors.textOnColor} />
            <Text style={styles.retryText}>Try Again</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {error.includes('Authentication') && (
          <TouchableOpacity 
            style={styles.demoButton}
            onPress={createDemoTokens}
            activeOpacity={0.8}
          >
            <Text style={styles.demoText}>Create Demo Tokens (Testing)</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.testButton}
          onPress={testApiConnectivity}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[cosmicTheme.colors.info, cosmicTheme.colors.info + '80']}
            style={styles.testGradient}
          >
            <CosmicIcon name="network-check" size={16} color={cosmicTheme.colors.textOnColor} />
            <Text style={styles.testText}>Test API Connection</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.debugButton}
          onPress={() => {
            Alert.alert(
              'Debug Information', 
              `API Base: ${API_BASE}\nStudent Endpoint: ${API_BASE}/student\nAnnouncements: ${API_BASE}/announcements\n\nError: ${error}\n\nThis information can help administration troubleshoot the issue.`
            );
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.debugButtonText}>View Debug Info</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Alert.alert(
            'Need Help?', 
            error.includes('Demo tokens detected')
              ? 'To access your student dashboard:\n\n1. Find and open the login screen in your app\n2. Login with your real student credentials (not demo)\n3. Return to this dashboard\n\nDemo tokens only work for announcements, not personal student data.'
              : error.includes('Authentication') || error.includes('No authentication')
              ? 'Please use the login screen to sign in with your student credentials. Make sure to use your actual student login details, not demo or test credentials.'
              : error.includes('student ID') || error.includes('not found')
              ? 'Please visit the administration office with your student ID to verify your account is properly set up in the system.'
              : 'Please visit the administration office or call the school helpline for technical support.'
          )}
          activeOpacity={0.8}
        >
          <Text style={styles.contactText}>
            {error.includes('Demo tokens detected') ? 'How to Login Properly' 
             : error.includes('Authentication') || error.includes('No authentication') ? 'Go to Login Screen' 
             : 'Contact Administration'}
          </Text>
        </TouchableOpacity>
        
        {/* Debug info for development */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>Debug: {error}</Text>
        </View>
      </View>
    </View>
  );

  const renderStudentHeader = () => {
    if (!studentData) return null;
    
    const fullName = `${studentData.first_name.trim()} ${studentData.middle_name} ${studentData.last_name}`;
    
    return (
      <Animated.View
        style={[
          styles.studentHeader,
          cosmicTheme.shadows.soft,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnims[0] }],
          },
        ]}
      >
        <LinearGradient
          colors={[cosmicTheme.colors.glassWhite, cosmicTheme.colors.starlight]}
          style={styles.headerGlass}
        />
        
        <View style={styles.headerContent}>
          <View style={styles.studentInfo}>
            <Text style={styles.greeting}>
              {getGreeting()}, {studentData.first_name.trim()}! 👋
            </Text>
            <Text style={styles.subtitle}>Welcome back to your academic portal</Text>
            <Text style={styles.studentFullName}>{fullName}</Text>
            <Text style={styles.studentDetails}>
              Class {studentData.adm_class}{studentData.division} • Roll: {studentData.roll_no}
            </Text>
          </View>
          
          <View style={styles.profileSection}>
            <Image
              source={{ uri: studentData.photo_url }}
              style={styles.profileImage}
              onError={(error) => console.log('Photo load error:', error.nativeEvent.error)}
            />
            <View style={styles.onlineIndicator} />
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderAcademicCard = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => handleCardPress(item.id, index)}
    >
      <Animated.View
        style={[
          styles.academicCard,
          cosmicTheme.shadows.soft,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnims[index + 1] || 0 },
              { scale: scaleAnims[index] || 1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[cosmicTheme.colors.glassWhite, cosmicTheme.colors.starlight]}
          style={styles.cardGlass}
        />
        
        <LinearGradient
          colors={[item.color, item.color + '60']}
          style={styles.cardGradientBorder}
        />

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={[styles.emojiContainer, { backgroundColor: item.bgColor }]}>
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
            </View>
            <LinearGradient
              colors={[item.color + '15', item.color + '20']}
              style={styles.trendBadge}
            >
              <Text style={[styles.trendText, { color: item.color }]}>
                {item.trend}
              </Text>
            </LinearGradient>
          </View>
          
          <Text style={[styles.cardValue, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        <Animated.View
          style={[
            styles.ambientEffect,
            {
              backgroundColor: item.color + '10',
              transform: [
                {
                  translateY: floatingAnims[index % 6]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -10],
                  }) || 0,
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );

  const renderAnnouncementCard = () => {
    const latestAnnouncement = getLatestAnnouncement();
    
    if (!latestAnnouncement) {
      return (
        <Animated.View
          style={[
            styles.announcementCard,
            cosmicTheme.shadows.soft,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnims[5] }],
            },
          ]}
        >
          <LinearGradient
            colors={[cosmicTheme.colors.glassWhite, cosmicTheme.colors.starlight]}
            style={styles.announcementGlass}
          />
          
          <View style={styles.noAnnouncementContent}>
            <Text style={styles.noAnnouncementEmoji}>📢</Text>
            <Text style={styles.noAnnouncementTitle}>No Recent Announcements</Text>
            <Text style={styles.noAnnouncementSubtitle}>Check back later for updates</Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Alert.alert(latestAnnouncement.subject, latestAnnouncement.body)}
      >
        <Animated.View
          style={[
            styles.announcementCard,
            cosmicTheme.shadows.soft,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnims[5] }],
            },
          ]}
        >
          <LinearGradient
            colors={[cosmicTheme.colors.glassWhite, cosmicTheme.colors.starlight]}
            style={styles.announcementGlass}
          />
          
          <LinearGradient
            colors={[cosmicTheme.colors.warning, cosmicTheme.colors.warning + '60']}
            style={styles.announcementBorder}
          />

          <View style={styles.announcementContent}>
            <View style={styles.announcementHeader}>
              <View style={styles.announcementIconContainer}>
                <Text style={styles.announcementEmoji}>📢</Text>
              </View>
              <View style={styles.announcementMeta}>
                <View style={styles.announcementBadge}>
                  <Text style={styles.audienceText}>Latest Announcement</Text>
                </View>
                <Text style={styles.announcementTime}>
                  {formatAnnouncementDate(latestAnnouncement.created_at)}
                </Text>
              </View>
            </View>
            
            <Text style={styles.announcementSubject} numberOfLines={2}>
              {latestAnnouncement.subject}
            </Text>
            <Text style={styles.announcementBody} numberOfLines={3}>
              {latestAnnouncement.body}
            </Text>
            
            <Text style={styles.readMoreText}>Tap to read more →</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderQuickAction = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        handleCardPress(item.id, index + 2);
        Alert.alert(item.title, `Opening ${item.title.toLowerCase()} section...`);
      }}
    >
      <Animated.View
        style={[
          styles.actionCard,
          cosmicTheme.shadows.soft,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnims[index + 6] || 0 },
              { scale: scaleAnims[index + 2] || 1 },
            ],
          },
        ]}
      >
        <LinearGradient
          colors={[cosmicTheme.colors.glassWhite, cosmicTheme.colors.starlight]}
          style={styles.actionGlass}
        />

        <LinearGradient
          colors={[item.color + '20', item.color + '10']}
          style={styles.actionIcon}
        >
          <Text style={styles.actionEmoji}>{item.emoji}</Text>
        </LinearGradient>
        
        <Text style={styles.actionTitle}>{item.title}</Text>
        <Text style={[styles.actionCount, { color: item.color }]}>
          {item.count}
        </Text>

        <Animated.View
          style={[
            styles.actionGlow,
            {
              backgroundColor: item.color + '08',
              transform: [
                {
                  scale: pulseAnims[index % 4]?.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [1, 1.2],
                  }) || 1,
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );

  if (loading) {
    return renderLoadingScreen();
  }

  if (error) {
    return renderErrorScreen();
  }

  const academicStats = getAcademicStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={cosmicTheme.colors.cosmicLight} />
      
      <LinearGradient
        colors={[cosmicTheme.colors.cosmicLight, cosmicTheme.colors.cosmicMid, cosmicTheme.colors.cosmicDeep]}
        style={StyleSheet.absoluteFill}
      />

      {/* Floating background elements */}
      {[...Array(8)].map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.floatingElement,
            {
              left: (index % 4) * (width / 4) + Math.random() * 50,
              top: Math.random() * height,
              backgroundColor: index % 2 === 0 ? cosmicTheme.colors.auroraViolet + '15' : cosmicTheme.colors.plasmaMint + '15',
              transform: [
                {
                  translateY: floatingAnims[index % 6]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }) || 0,
                },
                {
                  rotate: rotateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
          ]}
        />
      ))}

      {/* Debug Panel - Only in development */}
      {__DEV__ && <DebugPanel />}

      <Animated.ScrollView
        style={[styles.scrollView, { opacity: fadeAnim }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Header */}
        {renderStudentHeader()}

        {/* Academic Overview */}
        <View style={styles.section}>
          <Animated.Text
            style={[
              styles.sectionTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnims[1] }],
              },
            ]}
          >
            🎓 Academic Overview
          </Animated.Text>
          
          <View style={styles.cardsGrid}>
            {academicStats && academicStats.map((stat, index) => (
              <View key={stat.id} style={styles.cardWrapper}>
                {renderAcademicCard({ item: stat, index })}
              </View>
            ))}
          </View>
        </View>

        {/* Latest Announcement */}
        <View style={styles.section}>
          <Animated.Text
            style={[
              styles.sectionTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnims[2] }],
              },
            ]}
          >
            📢 Latest Announcement
          </Animated.Text>
          
          {renderAnnouncementCard()}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Animated.Text
            style={[
              styles.sectionTitle,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnims[3] }],
              },
            ]}
          >
            ⚡ Quick Actions
          </Animated.Text>
          
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <View key={action.id} style={styles.actionWrapper}>
                {renderQuickAction({ item: action, index })}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
        
        {/* Data Source Indicator - Development only */}
        {__DEV__ && dataSource && (
          <View style={styles.dataSourceIndicator}>
            <Text style={styles.dataSourceText}>
              ✅ Real Authentication: {dataSource}
            </Text>
          </View>
        )}
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cosmicTheme.colors.cosmicLight,
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cosmicParticle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  loadingContent: {
    alignItems: 'center',
    zIndex: 10,
  },
  cosmicLoader: {
    width: 100,
    height: 100,
    marginBottom: cosmicTheme.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loaderRing: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'transparent',
    position: 'absolute',
  },
  loaderCenter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: cosmicTheme.colors.starlight,
    justifyContent: 'center',
    alignItems: 'center',
    ...cosmicTheme.shadows.soft,
  },
  loaderEmoji: {
    fontSize: 24,
  },
  loadingTitle: {
    ...cosmicTheme.typography.cosmic4,
    color: cosmicTheme.colors.textPrimary,
    marginBottom: cosmicTheme.spacing.sm,
    textAlign: 'center',
  },
  loadingSubtitle: {
    ...cosmicTheme.typography.body,
    color: cosmicTheme.colors.textSecondary,
    marginBottom: cosmicTheme.spacing.xl,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: cosmicTheme.spacing.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Error Styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: cosmicTheme.spacing.xl,
  },
  errorContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: cosmicTheme.colors.starlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: cosmicTheme.spacing.xl,
    ...cosmicTheme.shadows.medium,
  },
  errorEmoji: {
    fontSize: 32,
  },
  errorTitle: {
    ...cosmicTheme.typography.cosmic3,
    color: cosmicTheme.colors.textPrimary,
    marginBottom: cosmicTheme.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    ...cosmicTheme.typography.body,
    color: cosmicTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: cosmicTheme.spacing.xl,
  },
  retryButton: {
    borderRadius: cosmicTheme.borderRadius.xl,
    overflow: 'hidden',
    marginBottom: cosmicTheme.spacing.lg,
    ...cosmicTheme.shadows.soft,
  },
  retryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: cosmicTheme.spacing.lg,
    paddingHorizontal: cosmicTheme.spacing.xl,
    gap: cosmicTheme.spacing.sm,
  },
  retryText: {
    ...cosmicTheme.typography.cosmic6,
    color: cosmicTheme.colors.textOnColor,
  },
  contactButton: {
    paddingVertical: cosmicTheme.spacing.md,
  },
  contactText: {
    ...cosmicTheme.typography.body,
    color: cosmicTheme.colors.textSecondary,
    textDecorationLine: 'underline',
  },
  demoButton: {
    paddingVertical: cosmicTheme.spacing.md,
    paddingHorizontal: cosmicTheme.spacing.lg,
    backgroundColor: cosmicTheme.colors.cosmicGlow,
    borderRadius: cosmicTheme.borderRadius.md,
    marginBottom: cosmicTheme.spacing.md,
  },
  demoText: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  debugButton: {
    paddingVertical: cosmicTheme.spacing.sm,
    paddingHorizontal: cosmicTheme.spacing.md,
    backgroundColor: cosmicTheme.colors.info + '15',
    borderRadius: cosmicTheme.borderRadius.sm,
    marginBottom: cosmicTheme.spacing.md,
    borderWidth: 1,
    borderColor: cosmicTheme.colors.info + '30',
  },
  debugButtonText: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.info,
    textAlign: 'center',
    fontWeight: '500',
  },
  testButton: {
    borderRadius: cosmicTheme.borderRadius.md,
    overflow: 'hidden',
    marginBottom: cosmicTheme.spacing.md,
    ...cosmicTheme.shadows.soft,
  },
  testGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: cosmicTheme.spacing.md,
    paddingHorizontal: cosmicTheme.spacing.lg,
    gap: cosmicTheme.spacing.xs,
  },
  testText: {
    ...cosmicTheme.typography.body,
    color: cosmicTheme.colors.textOnColor,
    fontWeight: '500',
  },
  debugInfo: {
    marginTop: cosmicTheme.spacing.xl,
    paddingHorizontal: cosmicTheme.spacing.md,
    paddingVertical: cosmicTheme.spacing.sm,
    backgroundColor: cosmicTheme.colors.cosmicGlow,
    borderRadius: cosmicTheme.borderRadius.sm,
    maxWidth: 280,
  },
  debugText: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.textTertiary,
    textAlign: 'center',
    fontFamily: 'monospace',
  },

  // Debug Panel Styles
  debugPanel: {
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1000,
  },
  debugToggle: {
    backgroundColor: cosmicTheme.colors.auroraViolet,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  debugToggleText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  debugContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 10,
    width: 280,
    maxHeight: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  debugHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  debugClose: {
    fontSize: 18,
    color: '#666',
  },
  debugScroll: {
    maxHeight: 300,
  },
  debugButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    marginHorizontal: 15,
    marginVertical: 5,
    borderRadius: 8,
  },
  debugButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  debugReport: {
    margin: 15,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  debugReportTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  debugReportText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#666',
    lineHeight: 16,
  },

  // Background Elements
  floatingElement: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.6,
  },

  // Main Layout
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: cosmicTheme.spacing.md,
    paddingTop: cosmicTheme.spacing.lg,
    paddingBottom: cosmicTheme.spacing.xxxl,
  },

  // Student Header
  studentHeader: {
    borderRadius: cosmicTheme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: cosmicTheme.spacing.xl,
    backgroundColor: cosmicTheme.colors.starlight,
  },
  headerGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: cosmicTheme.borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: cosmicTheme.spacing.xl,
    zIndex: 2,
  },
  studentInfo: {
    flex: 1,
  },
  greeting: {
    ...cosmicTheme.typography.cosmic4,
    color: cosmicTheme.colors.textPrimary,
    marginBottom: cosmicTheme.spacing.xs,
  },
  subtitle: {
    ...cosmicTheme.typography.body,
    color: cosmicTheme.colors.textSecondary,
    marginBottom: cosmicTheme.spacing.xs,
  },
  studentFullName: {
    ...cosmicTheme.typography.cosmic6,
    color: cosmicTheme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  studentDetails: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.textTertiary,
    fontWeight: '500',
  },
  profileSection: {
    position: 'relative',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: cosmicTheme.colors.starlight,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: cosmicTheme.colors.success,
    borderWidth: 2,
    borderColor: cosmicTheme.colors.starlight,
  },

  // Sections
  section: {
    marginBottom: cosmicTheme.spacing.xl,
  },
  sectionTitle: {
    ...cosmicTheme.typography.cosmic4,
    color: cosmicTheme.colors.textPrimary,
    marginBottom: cosmicTheme.spacing.lg,
  },

  // Academic Cards
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: cosmicTheme.spacing.sm,
  },
  cardWrapper: {
    width: (width - cosmicTheme.spacing.md * 2 - cosmicTheme.spacing.sm) / 2,
    marginBottom: cosmicTheme.spacing.md,
  },
  academicCard: {
    borderRadius: cosmicTheme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 160,
    backgroundColor: cosmicTheme.colors.starlight,
  },
  cardGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: cosmicTheme.borderRadius.xl,
  },
  cardGradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: cosmicTheme.borderRadius.xl,
    borderTopRightRadius: cosmicTheme.borderRadius.xl,
  },
  cardContent: {
    padding: cosmicTheme.spacing.lg,
    zIndex: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: cosmicTheme.spacing.md,
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 20,
  },
  trendBadge: {
    paddingHorizontal: cosmicTheme.spacing.md,
    paddingVertical: cosmicTheme.spacing.xs,
    borderRadius: cosmicTheme.borderRadius.md,
  },
  trendText: {
    ...cosmicTheme.typography.caption,
    fontWeight: '600',
  },
  cardValue: {
    ...cosmicTheme.typography.cosmic3,
    marginBottom: 4,
    fontWeight: '700',
  },
  cardTitle: {
    ...cosmicTheme.typography.cosmic6,
    color: cosmicTheme.colors.textPrimary,
    marginBottom: 4,
  },
  cardDescription: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.textSecondary,
  },
  ambientEffect: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 30,
    height: 30,
    borderRadius: 15,
    opacity: 0.5,
  },

  // Announcement Card
  announcementCard: {
    borderRadius: cosmicTheme.borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: cosmicTheme.colors.starlight,
    marginBottom: cosmicTheme.spacing.lg,
  },
  announcementGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: cosmicTheme.borderRadius.xl,
  },
  announcementBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: cosmicTheme.borderRadius.xl,
    borderTopRightRadius: cosmicTheme.borderRadius.xl,
  },
  announcementContent: {
    padding: cosmicTheme.spacing.xl,
    zIndex: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: cosmicTheme.spacing.lg,
  },
  announcementIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: cosmicTheme.colors.warning + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: cosmicTheme.spacing.md,
  },
  announcementEmoji: {
    fontSize: 20,
  },
  announcementMeta: {
    flex: 1,
  },
  announcementBadge: {
    backgroundColor: cosmicTheme.colors.warning + '15',
    paddingHorizontal: cosmicTheme.spacing.md,
    paddingVertical: cosmicTheme.spacing.xs,
    borderRadius: cosmicTheme.borderRadius.md,
    alignSelf: 'flex-start',
    marginBottom: cosmicTheme.spacing.xs,
  },
  audienceText: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.warning,
    fontWeight: '600',
  },
  announcementTime: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.textTertiary,
  },
  announcementSubject: {
    ...cosmicTheme.typography.cosmic5,
    color: cosmicTheme.colors.textPrimary,
    marginBottom: cosmicTheme.spacing.sm,
    fontWeight: '600',
  },
  announcementBody: {
    ...cosmicTheme.typography.body,
    color: cosmicTheme.colors.textSecondary,
    lineHeight: 22,
    marginBottom: cosmicTheme.spacing.md,
  },
  readMoreText: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.auroraViolet,
    fontWeight: '500',
  },

  // No Announcement
  noAnnouncementContent: {
    padding: cosmicTheme.spacing.xl,
    alignItems: 'center',
    zIndex: 2,
  },
  noAnnouncementEmoji: {
    fontSize: 32,
    marginBottom: cosmicTheme.spacing.md,
    opacity: 0.6,
  },
  noAnnouncementTitle: {
    ...cosmicTheme.typography.cosmic6,
    color: cosmicTheme.colors.textSecondary,
    marginBottom: cosmicTheme.spacing.xs,
  },
  noAnnouncementSubtitle: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.textTertiary,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: cosmicTheme.spacing.sm,
  },
  actionWrapper: {
    width: (width - cosmicTheme.spacing.md * 2 - cosmicTheme.spacing.sm) / 2,
    marginBottom: cosmicTheme.spacing.sm,
  },
  actionCard: {
    borderRadius: cosmicTheme.borderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 120,
    backgroundColor: cosmicTheme.colors.starlight,
  },
  actionGlass: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: cosmicTheme.borderRadius.lg,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    margin: cosmicTheme.spacing.lg,
    marginBottom: cosmicTheme.spacing.md,
  },
  actionEmoji: {
    fontSize: 22,
  },
  actionTitle: {
    ...cosmicTheme.typography.cosmic6,
    color: cosmicTheme.colors.textPrimary,
    marginHorizontal: cosmicTheme.spacing.lg,
    marginBottom: 9,
  },
  actionCount: {
    ...cosmicTheme.typography.body,
    marginHorizontal: cosmicTheme.spacing.lg,
    fontWeight: '600',
  },
  actionGlow: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.6,
  },

  bottomSpacer: {
    height: cosmicTheme.spacing.xxl,
  },

  // Data Source Indicator
  dataSourceIndicator: {
    backgroundColor: cosmicTheme.colors.success + '15',
    paddingHorizontal: cosmicTheme.spacing.md,
    paddingVertical: cosmicTheme.spacing.sm,
    borderRadius: cosmicTheme.borderRadius.md,
    marginHorizontal: cosmicTheme.spacing.md,
    marginBottom: cosmicTheme.spacing.xl,
    borderWidth: 1,
    borderColor: cosmicTheme.colors.success + '30',
  },
  dataSourceText: {
    ...cosmicTheme.typography.caption,
    color: cosmicTheme.colors.success,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SchoolDashboard;