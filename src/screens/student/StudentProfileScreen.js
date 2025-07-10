// // src/screens/student/StudentProfileScreen.js
// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Animated,
//   Dimensions,
//   Image,
//   RefreshControl,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useNavigation } from "@react-navigation/native";
// import { jwtDecode } from "jwt-decode";
// import { LinearGradient } from "expo-linear-gradient";

// import Header from "../../components/common/Header";

// const { width, height } = Dimensions.get('window');

// // Modern Blue Theme to match Header and Home Screen
// const colors = {
//   primary: '#1e40af',
//   primaryLight: '#3b82f6',
//   primaryDark: '#1e3a8a',
//   accent: '#06b6d4',
//   white: '#ffffff',
//   textLight: '#64748b',
//   text: '#0f172a',
//   background: '#f1f5f9',
//   cardBg: '#ffffff',
//   success: '#10b981',
//   warning: '#f59e0b',
//   error: '#ef4444',
//   purple: '#8b5cf6',
//   pink: '#ec4899',
//   orange: '#f97316',
//   emerald: '#059669',
//   rose: '#e11d48',
//   indigo: '#6366f1',
//   teal: '#14b8a6',
// };

// const spacing = {
//   xs: 4,
//   sm: 8,
//   md: 12,
//   lg: 16,
//   xl: 20,
//   xxl: 24,
//   xxxl: 32,
// };

// const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/general';

// const StudentProfileScreen = () => {
//   const navigation = useNavigation();
  
//   // State Management
//   const [state, setState] = useState({
//     userData: null,
//     loading: true,
//     refreshing: false,
//     error: null,
//   });
  
//   // Animation References
//   const animations = {
//     fadeAnim: useRef(new Animated.Value(0)).current,
//     slideAnim: useRef(new Animated.Value(30)).current,
//     floatingElements: useRef(new Animated.Value(0)).current,
//     shimmer: useRef(new Animated.Value(-1)).current,
//     pulse: useRef(new Animated.Value(1)).current,
//     cardStagger: useRef(new Animated.Value(0)).current,
//     menuStagger: useRef(new Animated.Value(0)).current,
//   };

//   // Update state helper
//   const updateState = useCallback((updates) => {
//     setState(prev => ({ ...prev, ...updates }));
//   }, []);

//   useEffect(() => {
//     initializeProfile();
//   }, []);

//   useEffect(() => {
//     if (state.userData) {
//       startAnimations();
//     }
//   }, [state.userData]);

//   const initializeProfile = async () => {
//     await loadUserData();
//   };

//   const startAnimations = () => {
//     // Simple fade in for content without complex animations
//     Animated.parallel([
//       Animated.timing(animations.fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.timing(animations.slideAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Simple stagger animations without complex looping
//     setTimeout(() => {
//       Animated.timing(animations.cardStagger, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }).start();
//     }, 200);

//     setTimeout(() => {
//       Animated.timing(animations.menuStagger, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }).start();
//     }, 400);
//   };

//   // Removed complex animation functions for formal design

//   // API Helper Functions
//   const getAuthHeaders = async () => {
//     try {
//       const tokensString = await AsyncStorage.getItem("ERPTokens");
//       if (!tokensString) return null;
      
//       const tokens = JSON.parse(tokensString);
//       return {
//         'Authorization': `Bearer ${tokens.accessToken}`,
//         'Content-Type': 'application/json',
//       };
//     } catch (error) {
//       console.error("Error getting auth headers:", error);
//       return null;
//     }
//   };

//   const loadUserData = async () => {
//     console.log("=== Loading Profile Data ===");
//     try {
//       updateState({ loading: true, error: null });
      
//       const headers = await getAuthHeaders();
//       if (!headers) {
//         throw new Error("No authentication tokens");
//       }

//       const response = await fetch(`${API_BASE_URL}/student`, {
//         method: 'GET',
//         headers,
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
      
//       // Transform API data to profile format
//       const transformedData = {
//         id: data.id,
//         name: `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim(),
//         firstName: data.first_name || 'Student',
//         lastName: data.last_name || '',
//         middleName: data.middle_name || '',
//         email: `${data.roll_no}@school.edu`,
//         rollNo: data.roll_no,
//         studentId: data.roll_no,
//         class: `Class ${data.adm_class}${data.division ? ` - ${data.division}` : ''}`,
//         admissionClass: data.adm_class,
//         division: data.division,
//         photoUrl: data.photo_url,
//         gender: data.gender,
//         hostel: data.hostel,
        
//         // Additional calculated fields
//         admissionYear: new Date().getFullYear() - (parseInt(data.adm_class) - 1) || "2022",
        
//         // Hostel details
//         bedDetails: data.hostel ? {
//           bedId: data.bed_id,
//           bedNumber: data.bed_number,
//           roomNumber: data.room_number,
//           floorNumber: data.floor_number,
//           hostelName: data.hostel_name,
//           hostelDesc: data.hostel_desc,
//         } : null,
        
//         // Financial info
//         scholarshipAmount: data.scholarship_amt || 0,
//         additionalAmount: data.additial_amount || 0,
//       };

//       updateState({ userData: transformedData, loading: false });
//       console.log("Profile data loaded successfully");
//     } catch (error) {
//       console.error("Failed to load profile data:", error);
//       updateState({ 
//         userData: null, 
//         loading: false,
//         error: "Failed to load profile data. Please try again.",
//       });
//     }
//   };

//   const onRefresh = useCallback(async () => {
//     updateState({ refreshing: true });
//     await loadUserData();
//     updateState({ refreshing: false });
//   }, []);

//   const handleLogout = async () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Logout",
//         style: "destructive",
//         onPress: async () => {
//           try {
//             await AsyncStorage.removeItem("ERPTokens");
//             navigation.reset({
//               index: 0,
//               routes: [{ name: "Login" }],
//             });
//           } catch (error) {
//             console.error("Error during logout:", error);
//           }
//         },
//       },
//     ]);
//   };

//   const handleMenuPress = (screen) => {
//     try {
//       if (navigation.navigate) {
//         navigation.navigate(screen);
//       } else {
//         console.warn(`Navigation to ${screen} not available`);
//         Alert.alert("Coming Soon", `${screen} feature is not yet available.`);
//       }
//     } catch (error) {
//       console.error("Navigation error:", error);
//       Alert.alert("Navigation Error", "Unable to navigate to this screen.");
//     }
//   };

//   const menuItems = [
//     {
//       id: 1,
//       title: "Personal Details",
//       subtitle: "View & edit information",
//       icon: "person",
//       screen: "PersonalDetails",
//       gradient: [colors.primary, colors.primaryLight]
//     },
//     {
//       id: 2,
//       title: "Leave Applications",
//       subtitle: "Apply for leaves",
//       icon: "event-busy",
//       screen: "LeaveApplications", 
//       gradient: [colors.purple, colors.pink]
//     },
//     {
//       id: 3,
//       title: "Resources",
//       subtitle: "Access study materials",
//       icon: "library-books",
//       screen: "Resources",
//       gradient: [colors.accent, colors.teal]
//     },
//     {
//       id: 4,
//       title: "Timetable",
//       subtitle: "View class schedule",
//       icon: "schedule",
//       screen: "Timetable",
//       gradient: [colors.success, colors.emerald]
//     },
//     {
//       id: 5,
//       title: "Change Password",
//       subtitle: "Update security",
//       icon: "lock",
//       screen: "ChangePassword",
//       gradient: [colors.warning, colors.orange]
//     },
//     {
//       id: 6,
//       title: "Support & Help",
//       subtitle: "Get assistance",
//       icon: "help-outline",
//       screen: "Support",
//       gradient: [colors.indigo, colors.purple]
//     },
//   ];

//   // Component Renderers
//   const renderFloatingDecorations = () => (
//     <View style={styles.floatingDecorations}>
//       {/* Floating circles with animation */}
//       <Animated.View 
//         style={[
//           styles.floatingCircle, 
//           styles.circle1,
//           {
//             transform: [{
//               translateY: animations.floatingElements.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [0, -20]
//               })
//             }]
//           }
//         ]}
//       />
//       <Animated.View 
//         style={[
//           styles.floatingCircle, 
//           styles.circle2,
//           {
//             transform: [{
//               translateX: animations.floatingElements.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: [0, 15]
//               })
//             }]
//           }
//         ]}
//       />
//       <Animated.View 
//         style={[
//           styles.floatingCircle, 
//           styles.circle3,
//           {
//             transform: [{
//               rotate: animations.floatingElements.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: ['0deg', '180deg']
//               })
//             }]
//           }
//         ]}
//       />
      
//       {/* Geometric patterns */}
//       <View style={styles.geometricPattern}>
//         <Animated.View 
//           style={[
//             styles.diamond, 
//             styles.diamond1,
//             {
//               transform: [{
//                 rotate: animations.floatingElements.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: ['45deg', '225deg']
//                 })
//               }]
//             }
//           ]}
//         />
//         <Animated.View 
//           style={[
//             styles.diamond, 
//             styles.diamond2,
//             {
//               transform: [{
//                 scale: animations.pulse.interpolate({
//                   inputRange: [1, 1.05],
//                   outputRange: [1, 1.2]
//                 })
//               }]
//             }
//           ]}
//         />
//       </View>

//       {/* Profile-themed decorations */}
//       <Animated.View 
//         style={[
//           styles.profileDecoration, 
//           styles.profile1,
//           {
//             transform: [{
//               rotateY: animations.floatingElements.interpolate({
//                 inputRange: [0, 1],
//                 outputRange: ['0deg', '360deg']
//               })
//             }]
//           }
//         ]}
//       />
//     </View>
//   );

//   const renderAvatar = () => {
//     if (state.userData?.photoUrl) {
//       return (
//         <Image
//           source={{ uri: state.userData.photoUrl }}
//           style={styles.simpleAvatar}
//           onError={() => console.log("Failed to load avatar image")}
//         />
//       );
//     } else if (state.userData?.name) {
//       // Default avatar with initials
//       const initials = state.userData.name
//         ?.split(' ')
//         .map(n => n[0])
//         .join('')
//         .substring(0, 2)
//         .toUpperCase();
      
//       return (
//         <View style={styles.simpleAvatar}>
//           <Text style={styles.simpleAvatarText}>{initials}</Text>
//         </View>
//       );
//     } else {
//       return (
//         <View style={styles.simpleAvatar}>
//           <Icon name="person" size={40} color={colors.primary} />
//         </View>
//       );
//     }
//   };

//   const renderLoadingScreen = () => (
//     <SafeAreaView style={styles.container}>
//       <Header title="Profile" />
//       {renderFloatingDecorations()}
//       <View style={styles.loadingContainer}>
//         <View style={styles.loadingIcon}>
//           <Icon name="person" size={40} color={colors.white} />
//         </View>
//         <Text style={styles.loadingText}>Loading profile...</Text>
//       </View>
//     </SafeAreaView>
//   );

//   const renderErrorMessage = () => {
//     if (!state.error) return null;

//     return (
//       <Animated.View style={[styles.errorContainer, { opacity: animations.fadeAnim }]}>
//         <LinearGradient
//           colors={['#fef2f2', '#fee2e2']}
//           style={styles.errorGradient}
//         >
//           <LinearGradient
//             colors={[colors.error, colors.rose]}
//             style={styles.errorIcon}
//           >
//             <Icon name="error-outline" size={20} color={colors.white} />
//           </LinearGradient>
//           <Text style={styles.errorText}>{state.error}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
//             <LinearGradient
//               colors={[colors.error, colors.rose]}
//               style={styles.retryGradient}
//             >
//               <Text style={styles.retryText}>Retry</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </LinearGradient>
//       </Animated.View>
//     );
//   };

//   const renderNoDataMessage = () => {
//     return (
//       <Animated.View style={[styles.noDataContainer, { opacity: animations.fadeAnim }]}>
//         <LinearGradient
//           colors={[colors.primaryLight, colors.accent]}
//           style={styles.noDataIcon}
//         >
//           <Icon name="person-outline" size={60} color={colors.white} />
//         </LinearGradient>
//         <Text style={styles.noDataTitle}>No Profile Data</Text>
//         <Text style={styles.noDataText}>
//           Unable to load your profile information. Please check your connection and try again.
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
//           <LinearGradient
//             colors={[colors.primary, colors.primaryDark]}
//             style={styles.retryGradient}
//           >
//             <Text style={styles.retryButtonText}>Try Again</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   const renderProfileHeader = () => {
//     if (!state.userData) return null;

//     return (
//       <View style={styles.headerContainer}>
//         <View style={styles.profileCard}>
//           {/* Simple professional card design */}
//           <View style={styles.cardTop}>
//             <View style={styles.instituteBranding}>
//               <View style={styles.instituteIcon}>
//                 <Icon name="school" size={20} color={colors.primary} />
//               </View>
//               <View>
//                 <Text style={styles.instituteText}>Student ID Card</Text>
//                 <Text style={styles.sessionText}>Academic Year 2024-25</Text>
//               </View>
//             </View>
//           </View>
          
//           <View style={styles.profileMain}>
//             <View style={styles.avatarSection}>
//               <View style={styles.simpleAvatarContainer}>
//                 {renderAvatar()}
//               </View>
//               <View style={styles.verificationBadge}>
//                 <Icon name="verified" size={14} color={colors.primary} />
//               </View>
//             </View>
            
//             <View style={styles.infoSection}>
//               <Text style={styles.studentName}>{state.userData?.name || "Student Name"}</Text>
//               <Text style={styles.studentClass}>{state.userData?.class || "Class"}</Text>
              
//               <View style={styles.detailsGrid}>
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Roll Number</Text>
//                   <Text style={styles.detailValue}>{state.userData?.rollNo || "N/A"}</Text>
//                 </View>
                
//                 <View style={styles.detailRow}>
//                   <Text style={styles.detailLabel}>Email</Text>
//                   <Text style={styles.detailValue}>{state.userData?.email || "Email"}</Text>
//                 </View>
                
//                 {state.userData?.hostel && (
//                   <View style={styles.detailRow}>
//                     <Text style={styles.detailLabel}>Accommodation</Text>
//                     <Text style={styles.detailValue}>Hostel Student</Text>
//                   </View>
//                 )}
//               </View>
//             </View>
//           </View>
          
//           <View style={styles.cardBottom}>
//             <View style={styles.securityStrip} />
//           </View>
//         </View>
//       </View>
//     );
//   };

//   const renderInfoSection = (title, icon, iconGradient, children, cardStyle = 'default') => (
//     <Animated.View 
//       style={[
//         styles.section, 
//         { 
//           opacity: animations.cardStagger,
//           transform: [{ translateY: animations.slideAnim }]
//         }
//       ]}
//     >
//       <View style={styles.sectionHeader}>
//         <LinearGradient
//           colors={iconGradient}
//           style={styles.sectionIcon}
//         >
//           <Icon name={icon} size={20} color={colors.white} />
//         </LinearGradient>
//         <Text style={styles.sectionTitle}>{title}</Text>
//       </View>
//       {cardStyle === 'gradient' ? (
//         <LinearGradient
//           colors={iconGradient}
//           style={[styles.infoCard, styles.gradientCard]}
//         >
//           {children}
//         </LinearGradient>
//       ) : cardStyle === 'dark' ? (
//         <LinearGradient
//           colors={[colors.text, colors.primaryDark]}
//           style={[styles.infoCard, styles.darkCard]}
//         >
//           {children}
//         </LinearGradient>
//       ) : (
//         <View style={styles.infoCard}>
//           {children}
//         </View>
//       )}
//     </Animated.View>
//   );

//   const renderInfoRow = (icon, iconColor, iconBg, label, value, isDark = false) => (
//     <View style={styles.infoRow}>
//       <LinearGradient
//         colors={iconBg}
//         style={styles.infoIcon}
//       >
//         <Icon name={icon} size={18} color={colors.white} />
//       </LinearGradient>
//       <View style={styles.infoContent}>
//         <Text style={[styles.infoLabel, isDark && styles.infoLabelDark]}>{label}</Text>
//         <Text style={[styles.infoValue, isDark && styles.infoValueDark]}>{value}</Text>
//       </View>
//     </View>
//   );

//   const renderMenuItems = () => (
//     <Animated.View 
//       style={[
//         styles.section, 
//         { 
//           opacity: animations.menuStagger,
//           transform: [{ translateY: animations.slideAnim }]
//         }
//       ]}
//     >
//       <View style={styles.sectionHeader}>
//         <LinearGradient
//           colors={[colors.indigo, colors.purple]}
//           style={styles.sectionIcon}
//         >
//           <Icon name="apps" size={20} color={colors.white} />
//         </LinearGradient>
//         <Text style={styles.sectionTitle}>Quick Actions</Text>
//       </View>
      
//       <View style={styles.menuGrid}>
//         {menuItems.map((item, index) => {
//           // Add contrast by using different card styles
//           const isAccented = index % 3 === 1; // Every third item gets accent styling
//           const isDark = index % 4 === 3; // Every fourth item gets dark styling
          
//           return (
//             <Animated.View
//               key={item.id}
//               style={[
//                 styles.menuItemContainer,
//                 {
//                   opacity: animations.menuStagger,
//                   transform: [{
//                     translateY: animations.menuStagger.interpolate({
//                       inputRange: [0, 1],
//                       outputRange: [30, 0]
//                     })
//                   }]
//                 }
//               ]}
//             >
//               <TouchableOpacity
//                 style={styles.modernMenuItem}
//                 onPress={() => handleMenuPress(item.screen)}
//                 activeOpacity={0.8}
//               >
//                 {isDark ? (
//                   <LinearGradient
//                     colors={item.gradient}
//                     style={styles.menuItemGradient}
//                   >
//                     <View style={styles.menuIconContainerDark}>
//                       <Icon name={item.icon} size={24} color={colors.white} />
//                     </View>
//                     <View style={styles.menuTextContainer}>
//                       <Text style={[styles.menuTitle, styles.menuTitleDark]}>{item.title}</Text>
//                       <Text style={[styles.menuSubtitle, styles.menuSubtitleDark]}>{item.subtitle}</Text>
//                     </View>
//                     <View style={styles.menuArrowDark}>
//                       <Icon name="chevron-right" size={20} color="rgba(255,255,255,0.8)" />
//                     </View>
//                   </LinearGradient>
//                 ) : isAccented ? (
//                   <LinearGradient
//                     colors={['rgba(59, 130, 246, 0.1)', 'rgba(6, 182, 212, 0.1)']}
//                     style={styles.menuItemGradient}
//                   >
//                     <LinearGradient
//                       colors={item.gradient}
//                       style={styles.menuIconContainer}
//                     >
//                       <Icon name={item.icon} size={24} color={colors.white} />
//                     </LinearGradient>
//                     <View style={styles.menuTextContainer}>
//                       <Text style={[styles.menuTitle, styles.menuTitleAccent]}>{item.title}</Text>
//                       <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
//                     </View>
//                     <View style={[styles.menuArrow, styles.menuArrowAccent]}>
//                       <Icon name="chevron-right" size={20} color={colors.primary} />
//                     </View>
//                   </LinearGradient>
//                 ) : (
//                   <LinearGradient
//                     colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
//                     style={styles.menuItemGradient}
//                   >
//                     <LinearGradient
//                       colors={item.gradient}
//                       style={styles.menuIconContainer}
//                     >
//                       <Icon name={item.icon} size={24} color={colors.white} />
//                     </LinearGradient>
//                     <View style={styles.menuTextContainer}>
//                       <Text style={styles.menuTitle}>{item.title}</Text>
//                       <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
//                     </View>
//                     <View style={styles.menuArrow}>
//                       <Icon name="chevron-right" size={20} color={colors.textLight} />
//                     </View>
//                   </LinearGradient>
//                 )}
//               </TouchableOpacity>
//             </Animated.View>
//           );
//         })}
//       </View>
//     </Animated.View>
//   );

//   const renderLogoutButton = () => (
//     <Animated.View 
//       style={[
//         styles.logoutContainer, 
//         { 
//           opacity: animations.menuStagger,
//           transform: [{ translateY: animations.slideAnim }]
//         }
//       ]}
//     >
//       <TouchableOpacity style={styles.modernLogoutButton} onPress={handleLogout}>
//         <LinearGradient
//           colors={[colors.error, colors.rose]}
//           style={styles.logoutGradient}
//         >
//           <Icon name="exit-to-app" size={20} color={colors.white} />
//           <Text style={styles.logoutText}>Logout</Text>
//           <Icon name="arrow-forward" size={16} color={colors.white} />
//         </LinearGradient>
//       </TouchableOpacity>
//     </Animated.View>
//   );

//   // Main Render
//   if (state.loading) {
//     return renderLoadingScreen();
//   }

//   if (!state.userData && !state.loading) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Header title="Profile" />
//         {renderFloatingDecorations()}
//         <ScrollView 
//           style={styles.scrollView}
//           refreshControl={
//             <RefreshControl 
//               refreshing={state.refreshing} 
//               onRefresh={onRefresh}
//               colors={[colors.primary]}
//               tintColor={colors.primary}
//             />
//           }
//         >
//           {renderErrorMessage()}
//           {renderNoDataMessage()}
//         </ScrollView>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Profile" />
      
//       {/* Floating decorations */}
//       {renderFloatingDecorations()}
      
//       <ScrollView 
//         style={styles.scrollView} 
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl 
//             refreshing={state.refreshing} 
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//             progressBackgroundColor={colors.white}
//           />
//         }
//       >
//         {renderErrorMessage()}
//         {renderProfileHeader()}

//         {/* Personal Information */}
//         {state.userData && renderInfoSection(
//           "Personal Information",
//           "person",
//           [colors.primary, colors.primaryLight],
//           <>
//             {renderInfoRow("badge", colors.error, [colors.error, colors.rose], "Student ID", state.userData.studentId)}
//             {renderInfoRow("school", colors.success, [colors.success, colors.emerald], "Class & Division", state.userData.class)}
//             {state.userData.gender && renderInfoRow("person", colors.primary, [colors.primary, colors.primaryLight], "Gender", 
//               state.userData.gender === 'M' ? 'Male' : state.userData.gender === 'F' ? 'Female' : 'Other')}
//           </>,
//           'default'
//         )}

//         {/* Financial Information */}
//         {state.userData && (state.userData.scholarshipAmount > 0 || state.userData.additionalAmount > 0) && renderInfoSection(
//           "Financial Information",
//           "account-balance-wallet",
//           [colors.warning, colors.orange],
//           <>
//             {state.userData.scholarshipAmount > 0 && renderInfoRow("school", colors.success, [colors.white, 'rgba(255,255,255,0.8)'], "Scholarship Amount", `₹${state.userData.scholarshipAmount.toLocaleString()}`, true)}
//             {state.userData.additionalAmount > 0 && renderInfoRow("add-circle", colors.primary, [colors.white, 'rgba(255,255,255,0.8)'], "Additional Amount", `₹${state.userData.additionalAmount.toLocaleString()}`, true)}
//           </>,
//           'gradient'
//         )}

//         {/* Hostel Information */}
//         {state.userData?.hostel && state.userData?.bedDetails && renderInfoSection(
//           "Hostel Information",
//           "home",
//           [colors.purple, colors.pink],
//           <>
//             {state.userData.bedDetails.hostelName && renderInfoRow("home", colors.success, [colors.white, 'rgba(255,255,255,0.8)'], "Hostel Name", state.userData.bedDetails.hostelName, true)}
//             {renderInfoRow("door-front", colors.primary, [colors.white, 'rgba(255,255,255,0.8)'], "Room & Bed", `Room ${state.userData.bedDetails.roomNumber}, Bed ${state.userData.bedDetails.bedNumber}`, true)}
//             {renderInfoRow("layers", colors.warning, [colors.white, 'rgba(255,255,255,0.8)'], "Floor", `Floor ${state.userData.bedDetails.floorNumber}`, true)}
//           </>,
//           'dark'
//         )}

//         {/* Menu Items */}
//         {renderMenuItems()}

//         {/* Logout Button */}
//         {renderLogoutButton()}

//         {/* Version */}
//         <Animated.View style={[styles.versionContainer, { opacity: animations.menuStagger }]}>
//           <Text style={styles.versionText}>Version 1.0.0</Text>
//         </Animated.View>
        
//         <View style={styles.bottomSpacing} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },

//   // Floating Decorations
//   floatingDecorations: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: 1,
//     pointerEvents: 'none',
//   },
//   floatingCircle: {
//     position: 'absolute',
//     borderRadius: 50,
//   },
//   circle1: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'rgba(59, 130, 246, 0.05)',
//     top: 120,
//     right: -30,
//     borderWidth: 1,
//     borderColor: 'rgba(59, 130, 246, 0.1)',
//   },
//   circle2: {
//     width: 70,
//     height: 70,
//     backgroundColor: 'rgba(6, 182, 212, 0.05)',
//     top: 350,
//     left: -20,
//   },
//   circle3: {
//     width: 50,
//     height: 50,
//     backgroundColor: 'rgba(139, 92, 246, 0.05)',
//     bottom: 200,
//     right: 20,
//   },
//   geometricPattern: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
//   diamond: {
//     position: 'absolute',
//     width: 20,
//     height: 20,
//     backgroundColor: 'rgba(59, 130, 246, 0.1)',
//     transform: [{ rotate: '45deg' }],
//   },
//   diamond1: {
//     top: 250,
//     left: width * 0.15,
//   },
//   diamond2: {
//     bottom: 300,
//     right: width * 0.2,
//     backgroundColor: 'rgba(6, 182, 212, 0.1)',
//   },
//   profileDecoration: {
//     position: 'absolute',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: 'rgba(139, 92, 246, 0.1)',
//     borderWidth: 2,
//     borderColor: 'rgba(139, 92, 246, 0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profile1: {
//     top: 450,
//     left: width * 0.1,
//   },

//   // Loading Screen
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.background,
//     zIndex: 2,
//   },
//   loadingIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.primary,
//     elevation: 8,
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     borderWidth: 4,
//     borderColor: colors.white,
//   },
//   loadingText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textLight,
//     marginTop: 24,
//     letterSpacing: 0.5,
//   },

//   // Error Container
//   errorContainer: {
//     marginHorizontal: spacing.xl,
//     marginBottom: spacing.xl,
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 4,
//     shadowColor: colors.error,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//   },
//   errorGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.xl,
//   },
//   errorIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.md,
//   },
//   errorText: {
//     flex: 1,
//     color: colors.error,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   retryButton: {
//     borderRadius: 8,
//     overflow: 'hidden',
//   },
//   retryGradient: {
//     paddingHorizontal: spacing.md,
//     paddingVertical: spacing.sm,
//   },
//   retryText: {
//     color: colors.white,
//     fontSize: 12,
//     fontWeight: 'bold',
//   },

//   // No Data Message
//   noDataContainer: {
//     alignItems: 'center',
//     padding: spacing.xxxl,
//     marginTop: 60,
//   },
//   noDataIcon: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: spacing.xxl,
//     elevation: 8,
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//   },
//   noDataTitle: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: colors.text,
//     marginBottom: spacing.md,
//     letterSpacing: 0.3,
//   },
//   noDataText: {
//     fontSize: 16,
//     color: colors.textLight,
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: spacing.xxxl,
//   },
//   retryButtonText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '700',
//     letterSpacing: 0.5,
//   },

//   // Scroll View
//   scrollView: {
//     flex: 1,
//     zIndex: 2,
//   },

//   // Profile Header - Clean Professional Card Design
//   headerContainer: {
//     marginBottom: spacing.xxl,
//     marginHorizontal: spacing.xl,
//   },
//   profileCard: {
//     backgroundColor: colors.white,
//     borderRadius: 16,
//     overflow: 'hidden',
//     // Clean 3D shadow
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.12,
//     shadowRadius: 16,
//     // Subtle border
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   cardTop: {
//     backgroundColor: '#f8fafc',
//     padding: spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },
//   instituteBranding: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   instituteIcon: {
//     width: 36,
//     height: 36,
//     backgroundColor: colors.white,
//     borderRadius: 8,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.md,
//     elevation: 2,
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   instituteText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: colors.text,
//     letterSpacing: 0.3,
//   },
//   sessionText: {
//     fontSize: 12,
//     color: colors.textLight,
//     fontWeight: '500',
//   },
//   profileMain: {
//     padding: spacing.xxl,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   avatarSection: {
//     marginRight: spacing.xl,
//     alignItems: 'center',
//   },
//   simpleAvatarContainer: {
//     position: 'relative',
//   },
//   simpleAvatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 12,
//     backgroundColor: '#f1f5f9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     borderWidth: 3,
//     borderColor: colors.white,
//   },
//   simpleAvatarText: {
//     fontSize: 28,
//     fontWeight: '800',
//     color: colors.primary,
//     letterSpacing: 1,
//   },
//   verificationBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -6,
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 4,
//     elevation: 3,
//     shadowColor: colors.primary,
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   infoSection: {
//     flex: 1,
//   },
//   studentName: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: colors.text,
//     marginBottom: 4,
//     letterSpacing: 0.2,
//   },
//   studentClass: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.primary,
//     marginBottom: spacing.lg,
//     letterSpacing: 0.1,
//   },
//   detailsGrid: {
//     gap: spacing.md,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: spacing.sm,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   detailLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: colors.textLight,
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     flex: 1,
//   },
//   detailValue: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: colors.text,
//     textAlign: 'right',
//     flex: 1,
//   },
//   cardBottom: {
//     height: 8,
//     backgroundColor: '#f8fafc',
//     borderTopWidth: 1,
//     borderTopColor: '#e2e8f0',
//   },
//   securityStrip: {
//     height: '100%',
//     backgroundColor: colors.primary,
//     width: '30%',
//     borderTopRightRadius: 4,
//   },

//   // Section Styles
//   section: {
//     marginBottom: spacing.xxl,
//     marginHorizontal: spacing.xl,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: spacing.lg,
//   },
//   sectionIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.md,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '800',
//     color: colors.text,
//     letterSpacing: 0.3,
//   },

//   // Info Card Styles
//   infoCard: {
//     backgroundColor: colors.cardBg,
//     borderRadius: 20,
//     padding: spacing.xl,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//   },
//   gradientCard: {
//     backgroundColor: 'transparent',
//     elevation: 8,
//     shadowColor: colors.warning,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.2,
//     shadowRadius: 16,
//   },
//   darkCard: {
//     backgroundColor: 'transparent',
//     elevation: 8,
//     shadowColor: colors.text,
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: spacing.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },
//   infoIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.lg,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 4,
//   },
//   infoContent: {
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 12,
//     color: colors.textLight,
//     marginBottom: 4,
//     fontWeight: '600',
//   },
//   infoLabelDark: {
//     color: 'rgba(255, 255, 255, 0.8)',
//   },
//   infoValue: {
//     fontSize: 16,
//     color: colors.text,
//     fontWeight: '700',
//   },
//   infoValueDark: {
//     color: colors.white,
//   },

//   // Menu Styles
//   menuGrid: {
//     gap: spacing.md,
//   },
//   menuItemContainer: {
//     borderRadius: 20,
//     overflow: 'hidden',
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//   },
//   modernMenuItem: {
//     borderRadius: 20,
//     overflow: 'hidden',
//   },
//   menuItemGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: spacing.xl,
//   },
//   menuIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.lg,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 6,
//   },
//   menuIconContainerDark: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: spacing.lg,
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//     borderWidth: 1,
//     borderColor: 'rgba(255, 255, 255, 0.3)',
//   },
//   menuTextContainer: {
//     flex: 1,
//   },
//   menuTitle: {
//     fontSize: 16,
//     color: colors.text,
//     fontWeight: '700',
//     marginBottom: 2,
//   },
//   menuTitleAccent: {
//     color: colors.primary,
//   },
//   menuTitleDark: {
//     color: colors.white,
//   },
//   menuSubtitle: {
//     fontSize: 12,
//     color: colors.textLight,
//     fontWeight: '500',
//   },
//   menuSubtitleDark: {
//     color: 'rgba(255, 255, 255, 0.8)',
//   },
//   menuArrow: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: 'rgba(100, 116, 139, 0.1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   menuArrowAccent: {
//     backgroundColor: 'rgba(59, 130, 246, 0.15)',
//   },
//   menuArrowDark: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },

//   // Logout Styles
//   logoutContainer: {
//     marginHorizontal: spacing.xl,
//     marginTop: spacing.lg,
//     marginBottom: spacing.xxl,
//   },
//   modernLogoutButton: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     elevation: 6,
//     shadowColor: colors.error,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//   },
//   logoutGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: spacing.lg,
//     paddingHorizontal: spacing.xl,
//     gap: spacing.sm,
//   },
//   logoutText: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: colors.white,
//     letterSpacing: 0.5,
//   },

//   // Version Styles
//   versionContainer: {
//     alignItems: 'center',
//     paddingBottom: spacing.xl,
//   },
//   versionText: {
//     fontSize: 12,
//     color: colors.textLight,
//     fontWeight: '500',
//   },

//   // Bottom Spacing
//   bottomSpacing: {
//     height: spacing.xxxl,
//   },
// });

// export default StudentProfileScreen;



// src/screens/student/StudentProfileScreen.js
// src/screens/student/StudentProfileScreen.js
// src/screens/student/StudentProfileScreen.js
import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  Dimensions,
  Image,
  RefreshControl,
  StatusBar,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

import Header from "../../components/common/Header";

const { width, height } = Dimensions.get('window');

// Modern Balanced Color Palette
const colors = {
  // Primary brand colors
  primary: '#4f46e5',
  primaryLight: '#6366f1',
  primaryDark: '#3730a3',
  primarySoft: '#e0e7ff',
  
  // Secondary colors
  secondary: '#06b6d4',
  secondaryLight: '#22d3ee',
  secondaryDark: '#0891b2',
  secondarySoft: '#cffafe',
  
  // Accent colors for variety
  accent1: '#10b981',      // Green
  accent1Light: '#34d399',
  accent1Soft: '#d1fae5',
  
  accent2: '#f59e0b',      // Orange
  accent2Light: '#fbbf24',
  accent2Soft: '#fef3c7',
  
  accent3: '#8b5cf6',      // Purple
  accent3Light: '#a78bfa',
  accent3Soft: '#ede9fe',
  
  accent4: '#ef4444',      // Red
  accent4Light: '#f87171',
  accent4Soft: '#fee2e2',
  
  // Neutral colors
  white: '#ffffff',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Background and surfaces
  background: '#f8fafc',
  surface: '#ffffff',
  surfaceElevated: '#ffffff',
  
  // Borders and dividers
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  
  // Text colors
  textPrimary: '#1e293b',
  textSecondary: '#475569',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  
  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  xxxxl: 40,
};

const API_BASE_URL = 'https://erpbackend-gray.vercel.app/api/general';

const StudentProfileScreen = () => {
  const navigation = useNavigation();
  
  // State Management
  const [state, setState] = useState({
    userData: null,
    loading: true,
    refreshing: false,
    error: null,
  });
  
  // Enhanced Animation References
  const animations = {
    fadeAnim: useRef(new Animated.Value(0)).current,
    slideAnim: useRef(new Animated.Value(40)).current,
    cardScale: useRef(new Animated.Value(0.95)).current,
    menuStagger: useRef(new Animated.Value(0)).current,
    shimmer: useRef(new Animated.Value(-1)).current,
    // Trending loading animation
    loadingDot1: useRef(new Animated.Value(0)).current,
    loadingDot2: useRef(new Animated.Value(0)).current,
    loadingDot3: useRef(new Animated.Value(0)).current,
    // Essential interactions
    pulse: useRef(new Animated.Value(1)).current,
    menuItemScale: useRef(new Animated.Value(1)).current,
  };

  // Update state helper
  const updateState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  useEffect(() => {
    initializeProfile();
    startContinuousAnimations();
  }, []);

  useEffect(() => {
    if (state.userData) {
      startAnimations();
    }
  }, [state.userData]);

  const initializeProfile = async () => {
    await loadUserData();
  };

  const startContinuousAnimations = () => {
    // Enhanced loading dots animation with colors
    const createLoadingAnimation = (animValue, delay) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      );
    };

    createLoadingAnimation(animations.loadingDot1, 0).start();
    createLoadingAnimation(animations.loadingDot2, 233).start();
    createLoadingAnimation(animations.loadingDot3, 466).start();

    // Enhanced shimmer animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.shimmer, {
          toValue: 1,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(animations.shimmer, {
          toValue: -1,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for interactive elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(animations.pulse, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(animations.pulse, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startAnimations = () => {
    // Enhanced entrance animations
    Animated.parallel([
      Animated.timing(animations.fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(animations.slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.spring(animations.cardScale, {
        toValue: 1,
        tension: 80,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Staggered menu animations
    setTimeout(() => {
      Animated.timing(animations.menuStagger, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, 400);
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

  const loadUserData = async () => {
    console.log("=== Loading Profile Data ===");
    try {
      updateState({ loading: true, error: null });
      
      const headers = await getAuthHeaders();
      if (!headers) {
        throw new Error("No authentication tokens");
      }

      const response = await fetch(`${API_BASE_URL}/student`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transform API data to profile format
      const transformedData = {
        id: data.id,
        name: `${data.first_name || ''} ${data.middle_name || ''} ${data.last_name || ''}`.trim(),
        firstName: data.first_name || 'Student',
        lastName: data.last_name || '',
        middleName: data.middle_name || '',
        email: `${data.roll_no}@school.edu`,
        rollNo: data.roll_no,
        studentId: data.roll_no,
        class: `Class ${data.adm_class}${data.division ? ` - ${data.division}` : ''}`,
        admissionClass: data.adm_class,
        division: data.division,
        photoUrl: data.photo_url,
        gender: data.gender,
        hostel: data.hostel,
        
        // Additional calculated fields
        admissionYear: new Date().getFullYear() - (parseInt(data.adm_class) - 1) || "2022",
        
        // Hostel details (will be null when hostel: false)
        bedDetails: data.hostel ? {
          bedId: data.bed_id,
          bedNumber: data.bed_number,
          roomNumber: data.room_number,
          floorNumber: data.floor_number,
          hostelName: data.hostel_name,
          hostelDesc: data.hostel_desc,
        } : null,
        
        // Financial info
        scholarshipAmount: data.scholarship_amt || 0,
        additionalAmount: data.additial_amount || 0,
      };

      updateState({ userData: transformedData, loading: false });
      console.log("Profile data loaded successfully");
    } catch (error) {
      console.error("Failed to load profile data:", error);
      updateState({ 
        userData: null, 
        loading: false,
        error: "Failed to load profile data. Please try again.",
      });
    }
  };

  const onRefresh = useCallback(async () => {
    updateState({ refreshing: true });
    await loadUserData();
    updateState({ refreshing: false });
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("ERPTokens");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error during logout:", error);
          }
        },
      },
    ]);
  };

  const handleMenuPress = (screen) => {
    // Subtle press animation
    Animated.sequence([
      Animated.timing(animations.menuItemScale, {
        toValue: 0.96,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animations.menuItemScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      if (navigation.navigate) {
        navigation.navigate(screen);
      } else {
        console.warn(`Navigation to ${screen} not available`);
        Alert.alert("Coming Soon", `${screen} feature is not yet available.`);
      }
    } catch (error) {
      console.error("Navigation error:", error);
      Alert.alert("Navigation Error", "Unable to navigate to this screen.");
    }
  };

  const menuItems = [
    {
      id: 1,
      title: "Personal Details",
      subtitle: "View & edit information",
      icon: "person",
      screen: "PersonalDetails",
      color: colors.primary,
      bgColor: colors.primarySoft,
    },
    {
      id: 2,
      title: "Leave Applications",
      subtitle: "Apply for leaves",
      icon: "event-busy",
      screen: "LeaveApplications",
      color: colors.accent2,
      bgColor: colors.accent2Soft,
    },
    {
      id: 3,
      title: "Academic Resources",
      subtitle: "Study materials & notes",
      icon: "library-books",
      screen: "Resources",
      color: colors.secondary,
      bgColor: colors.secondarySoft,
    },
    {
      id: 4,
      title: "Class Schedule",
      subtitle: "View timetable",
      icon: "schedule",
      screen: "Timetable",
      color: colors.accent1,
      bgColor: colors.accent1Soft,
    },
    {
      id: 5,
      title: "Security Settings",
      subtitle: "Change password",
      icon: "security",
      screen: "ChangePassword",
      color: colors.accent3,
      bgColor: colors.accent3Soft,
    },
    {
      id: 6,
      title: "Support Center",
      subtitle: "Get help & assistance",
      icon: "help-center",
      screen: "Support",
      color: colors.info,
      bgColor: colors.secondarySoft,
    },
  ];

  // Component Renderers
  const renderEnhancedLoader = () => {
    const dotStyle = (animValue, color) => ({
      opacity: animValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0.4, 1]
      }),
      transform: [{
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.7, 1.3]
        })
      }],
      backgroundColor: color,
    });

    return (
      <View style={styles.enhancedLoader}>
        <Animated.View style={[styles.loadingDot, dotStyle(animations.loadingDot1, colors.primary)]} />
        <Animated.View style={[styles.loadingDot, dotStyle(animations.loadingDot2, colors.secondary)]} />
        <Animated.View style={[styles.loadingDot, dotStyle(animations.loadingDot3, colors.accent1)]} />
      </View>
    );
  };

  const renderShimmerEffect = (style) => (
    <Animated.View
      style={[
        styles.shimmerOverlay,
        style,
        {
          transform: [{
            translateX: animations.shimmer.interpolate({
              inputRange: [-1, 1],
              outputRange: [-width, width],
            })
          }]
        }
      ]}
    />
  );

  const renderAvatar = () => {
    if (state.userData?.photoUrl) {
      return (
        <Animated.View 
          style={[
            styles.avatarContainer,
            {
              transform: [{ scale: animations.pulse }]
            }
          ]}
        >
          <View style={styles.avatarGlow}>
            <Image
              source={{ uri: state.userData.photoUrl }}
              style={styles.avatar}
              onError={() => console.log("Failed to load avatar image")}
            />
          </View>
          {renderShimmerEffect(styles.avatarShimmer)}
        </Animated.View>
      );
    } else if (state.userData?.name) {
      const initials = state.userData.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
      
      return (
        <Animated.View 
          style={[
            styles.avatarContainer,
            {
              transform: [{ scale: animations.pulse }]
            }
          ]}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.avatarGlow}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
          </LinearGradient>
          {renderShimmerEffect(styles.avatarShimmer)}
        </Animated.View>
      );
    } else {
      return (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Icon name="person" size={50} color={colors.textMuted} />
          </View>
        </View>
      );
    }
  };

  const renderLoadingScreen = () => (
    <LinearGradient
      colors={[colors.background, colors.gray50]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header title="Profile" />
      <View style={styles.loadingContainer}>
        <Animated.View 
          style={[
            styles.loadingCard,
            {
              transform: [{ scale: animations.cardScale }]
            }
          ]}
        >
          {renderEnhancedLoader()}
          <Text style={styles.loadingText}>Loading your profile...</Text>
          {renderShimmerEffect(styles.loadingShimmer)}
        </Animated.View>
      </View>
    </LinearGradient>
  );

  const renderErrorMessage = () => {
    if (!state.error) return null;

    return (
      <Animated.View style={[styles.errorContainer, { opacity: animations.fadeAnim }]}>
        <LinearGradient
          colors={[colors.accent4Soft, colors.white]}
          style={styles.errorCard}
        >
          <View style={styles.errorIcon}>
            <Icon name="error-outline" size={24} color={colors.error} />
          </View>
          <Text style={styles.errorText}>{state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
            <LinearGradient
              colors={[colors.error, colors.accent4Light]}
              style={styles.retryGradient}
            >
              <Text style={styles.retryText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  const renderIDCard = () => {
    if (!state.userData) return null;

    return (
      <Animated.View 
        style={[
          styles.idCardContainer,
          {
            opacity: animations.fadeAnim,
            transform: [
              { translateY: animations.slideAnim },
              { scale: animations.cardScale }
            ]
          }
        ]}
      >
        <View style={styles.idCard}>
          {/* Card hole for realism */}
          <View style={styles.cardHole}>
            <LinearGradient
              colors={[colors.primary, colors.primaryLight]}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          
          {/* Enhanced card header */}
          <LinearGradient
            colors={[colors.primarySoft, colors.white]}
            style={styles.cardHeader}
          >
            <Animated.View 
              style={[
                styles.instituteLogo,
                {
                  transform: [{ scale: animations.pulse }]
                }
              ]}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.logoGradient}
              >
                <Icon name="school" size={24} color={colors.white} />
              </LinearGradient>
            </Animated.View>
            <View style={styles.instituteInfo}>
              <Text style={styles.instituteName}>STUDENT ID CARD</Text>
              <Text style={styles.sessionText}>Academic Year 2024-25</Text>
            </View>
            <Animated.View 
              style={[
                styles.verificationBadge,
                {
                  transform: [{ scale: animations.pulse }]
                }
              ]}
            >
              <LinearGradient
                colors={[colors.success, colors.accent1Light]}
                style={styles.badgeGradient}
              >
                <Icon name="verified" size={14} color={colors.white} />
              </LinearGradient>
            </Animated.View>
          </LinearGradient>

          {/* Card body */}
          <View style={styles.cardBody}>
            <View style={styles.avatarSection}>
              {renderAvatar()}
            </View>
            
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {state.userData?.name || "Student Name"}
              </Text>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.idBadge}
              >
                <Text style={styles.studentId}>
                  ID: {state.userData?.rollNo || "N/A"}
                </Text>
              </LinearGradient>
              <Text style={styles.studentClass}>
                {state.userData?.class || "Class"}
              </Text>
            </View>
          </View>

          {/* Card details */}
          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{state.userData?.email || "N/A"}</Text>
            </View>
            {state.userData?.gender && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender</Text>
                <Text style={styles.detailValue}>
                  {state.userData.gender === 'M' ? 'Male' : 
                   state.userData.gender === 'F' ? 'Female' : 'Other'}
                </Text>
              </View>
            )}
            {!state.userData?.hostel && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <Text style={styles.detailValue}>Day Scholar</Text>
              </View>
            )}
          </View>

          {/* Enhanced card footer */}
          <LinearGradient
            colors={[colors.gray50, colors.primarySoft]}
            style={styles.cardFooter}
          >
            <Animated.View 
              style={[
                styles.securityChip,
                {
                  transform: [{ scale: animations.pulse }]
                }
              ]}
            >
              <LinearGradient
                colors={[colors.secondary, colors.secondaryLight]}
                style={styles.chipGradient}
              />
            </Animated.View>
            <Text style={styles.validityText}>Valid Till: Academic Year End</Text>
          </LinearGradient>

          {/* Enhanced shimmer effect */}
          {renderShimmerEffect(styles.cardShimmer)}
        </View>
      </Animated.View>
    );
  };

  const renderFinancialInfo = () => {
    if (!state.userData || (state.userData.scholarshipAmount === 0 && state.userData.additionalAmount === 0)) {
      return null;
    }

    return (
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: animations.menuStagger,
            transform: [{ translateY: animations.slideAnim }]
          }
        ]}
      >
        <View style={styles.sectionHeader}>
          <LinearGradient
            colors={[colors.accent2, colors.accent2Light]}
            style={styles.sectionIcon}
          >
            <Icon name="account-balance-wallet" size={18} color={colors.white} />
          </LinearGradient>
          <Text style={styles.sectionTitle}>Financial Information</Text>
        </View>
        <View style={styles.infoCard}>
          {state.userData.scholarshipAmount > 0 && (
            <View style={styles.infoRow}>
              <LinearGradient
                colors={[colors.accent1, colors.accent1Light]}
                style={styles.infoIcon}
              >
                <Icon name="school" size={20} color={colors.white} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Scholarship Amount</Text>
                <Text style={styles.infoValue}>₹{state.userData.scholarshipAmount.toLocaleString()}</Text>
              </View>
            </View>
          )}
          {state.userData.additionalAmount > 0 && (
            <View style={styles.infoRow}>
              <LinearGradient
                colors={[colors.primary, colors.primaryLight]}
                style={styles.infoIcon}
              >
                <Icon name="add-circle" size={20} color={colors.white} />
              </LinearGradient>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Additional Amount</Text>
                <Text style={styles.infoValue}>₹{state.userData.additionalAmount.toLocaleString()}</Text>
              </View>
            </View>
          )}
          {renderShimmerEffect(styles.cardShimmer)}
        </View>
      </Animated.View>
    );
  };

  const renderMenuGrid = () => (
    <Animated.View 
      style={[
        styles.section,
        {
          opacity: animations.menuStagger,
          transform: [{ translateY: animations.slideAnim }]
        }
      ]}
    >
      <View style={styles.sectionHeader}>
        <LinearGradient
          colors={[colors.accent3, colors.accent3Light]}
          style={styles.sectionIcon}
        >
          <Icon name="apps" size={18} color={colors.white} />
        </LinearGradient>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <Animated.View
            key={item.id}
            style={[
              styles.menuButtonContainer,
              {
                opacity: animations.menuStagger,
                transform: [{
                  translateY: animations.menuStagger.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }, {
                  scale: animations.menuItemScale
                }]
              }
            ]}
          >
            <TouchableOpacity
              onPress={() => handleMenuPress(item.screen)}
              activeOpacity={0.8}
              style={[styles.menuButton, { backgroundColor: item.bgColor }]}
            >
              <LinearGradient
                colors={[item.color, `${item.color}CC`]}
                style={styles.menuButtonIcon}
              >
                <Icon name={item.icon} size={20} color={colors.white} />
              </LinearGradient>
              <View style={styles.menuButtonText}>
                <Text style={styles.menuButtonTitle}>{item.title}</Text>
                <Text style={styles.menuButtonSubtitle}>{item.subtitle}</Text>
              </View>
              <View 
                style={[
                  styles.menuButtonArrow,
                  { backgroundColor: item.bgColor }
                ]}
              >
                <Icon name="chevron-right" size={16} color={item.color} />
              </View>
              {renderShimmerEffect(styles.buttonShimmer)}
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );

  const renderLogoutButton = () => (
    <Animated.View 
      style={[
        styles.logoutContainer,
        {
          opacity: animations.menuStagger,
          transform: [{ translateY: animations.slideAnim }, { scale: animations.menuItemScale }]
        }
      ]}
    >
      <TouchableOpacity onPress={handleLogout} activeOpacity={0.8}>
        <LinearGradient
          colors={[colors.accent4Soft, colors.white]}
          style={styles.logoutButton}
        >
          <LinearGradient
            colors={[colors.error, colors.accent4Light]}
            style={styles.logoutButtonIcon}
          >
            <Icon name="logout" size={20} color={colors.white} />
          </LinearGradient>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
          <View style={styles.logoutButtonArrow}>
            <Icon name="chevron-right" size={16} color={colors.error} />
          </View>
          {renderShimmerEffect(styles.buttonShimmer)}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  // Main Render
  if (state.loading) {
    return renderLoadingScreen();
  }

  return (
    <LinearGradient
      colors={[colors.background, colors.gray50]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <Header title="Profile" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={state.refreshing} 
            onRefresh={onRefresh}
            colors={[colors.primary, colors.secondary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.white}
          />
        }
      >
        {renderErrorMessage()}
        {renderIDCard()}
        {renderFinancialInfo()}
        {renderMenuGrid()}
        {renderLogoutButton()}
        
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: spacing.lg, // Added top padding for header breathing room
  },

  scrollView: {
    flex: 1,
    paddingTop: spacing.sm, // Additional top padding for scroll content
  },

  // Enhanced Loading Screen with proper spacing
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxxl,
    paddingTop: spacing.xxxxl, // Added top padding for header space
  },
  loadingCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xxxl,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
    borderWidth: 1,
    borderColor: colors.primarySoft,
    overflow: 'hidden',
    position: 'relative',
  },
  enhancedLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Enhanced Error Handling
  errorContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  errorCard: {
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent4Soft,
  },
  errorIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent4Soft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  retryGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  retryText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Enhanced ID Card
  idCardContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  idCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
    borderWidth: 1,
    borderColor: colors.primarySoft,
    position: 'relative',
  },

  // Enhanced card hole
  cardHole: {
    position: 'absolute',
    top: 18,
    right: 18,
    width: 14,
    height: 14,
    borderRadius: 7,
    zIndex: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.white,
  },

  // Enhanced card sections
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  instituteLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instituteInfo: {
    flex: 1,
    marginLeft: spacing.lg,
  },
  instituteName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  sessionText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  verificationBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  badgeGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Enhanced card body
  cardBody: {
    flexDirection: 'row',
    padding: spacing.xxxl,
    alignItems: 'center',
  },
  avatarSection: {
    marginRight: spacing.xxl,
  },
  avatarContainer: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
  },
  avatarGlow: {
    width: 110,
    height: 110,
    borderRadius: 20,
    padding: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: 2,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  idBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  studentId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.5,
  },
  studentClass: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },

  // Card details and footer
  cardDetails: {
    paddingHorizontal: spacing.xxxl,
    paddingBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  securityChip: {
    width: 40,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
  },
  chipGradient: {
    flex: 1,
  },
  validityText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },

  // Enhanced sections
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Enhanced info card
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
    overflow: 'hidden',
    position: 'relative',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // Enhanced menu grid
  menuGrid: {
    gap: spacing.md,
  },
  menuButtonContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuButton: {
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
    position: 'relative',
    overflow: 'hidden',
    minHeight: 70,
  },
  menuButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  menuButtonText: {
    flex: 1,
  },
  menuButtonTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  menuButtonSubtitle: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  menuButtonArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },

  // Enhanced logout with additional bottom padding
  logoutContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.xxxxl, // Increased bottom margin
    paddingBottom: spacing.xxxl, // Added extra padding below sign out button
  },
  logoutButton: {
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.error,
    ...Platform.select({
      ios: {
        shadowColor: colors.error,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
    position: 'relative',
    overflow: 'hidden',
    minHeight: 56,
  },
  logoutButtonIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    flex: 1,
    textAlign: 'center',
  },
  logoutButtonArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent4Soft,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
    borderWidth: 1,
    borderColor: colors.error,
  },

  // Enhanced shimmer effects
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.8,
  },
  cardShimmer: {
    left: 0,
    right: 0,
  },
  buttonShimmer: {
    left: 0,
    right: 0,
    borderRadius: 16,
  },
  avatarShimmer: {
    left: 0,
    right: 0,
    borderRadius: 20,
  },
  loadingShimmer: {
    left: 0,
    right: 0,
    borderRadius: 24,
  },

  // Enhanced bottom spacing
  bottomSpacing: {
    height: spacing.xxxxl + spacing.xxxl, // Increased bottom spacing
  },
});

export default StudentProfileScreen;