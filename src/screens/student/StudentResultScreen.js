// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { SafeAreaView } from "react-native-safe-area-context";

// import { colors } from "../../styles/colors";
// import { typography } from "../../styles/typography";
// import { spacing } from "../../styles/spacing";
// import Header from "../../components/common/Header";

// const StudentResultScreen = () => {
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState("current");
//   const [resultData, setResultData] = useState({
//     current: [
//       {
//         id: 1,
//         subject: "Mathematics",
//         marks: 85,
//         totalMarks: 100,
//         grade: "A",
//         remarks: "Excellent understanding of calculus concepts.",
//       },
//       {
//         id: 2,
//         subject: "Science",
//         marks: 92,
//         totalMarks: 100,
//         grade: "A+",
//         remarks: "Outstanding performance in practical experiments.",
//       },
//       {
//         id: 3,
//         subject: "English",
//         marks: 78,
//         totalMarks: 100,
//         grade: "B+",
//         remarks: "Good comprehension, needs improvement in essay writing.",
//       },
//       {
//         id: 4,
//         subject: "History",
//         marks: 88,
//         totalMarks: 100,
//         grade: "A",
//         remarks: "Excellent understanding of historical events.",
//       },
//       {
//         id: 5,
//         subject: "Computer Science",
//         marks: 95,
//         totalMarks: 100,
//         grade: "A+",
//         remarks: "Exceptional programming skills and problem-solving ability.",
//       },
//     ],
//     previous: [
//       {
//         id: 1,
//         term: "Term 1 - 2024",
//         results: [
//           {
//             id: 1,
//             subject: "Mathematics",
//             marks: 82,
//             totalMarks: 100,
//             grade: "A",
//           },
//           {
//             id: 2,
//             subject: "Science",
//             marks: 88,
//             totalMarks: 100,
//             grade: "A",
//           },
//           {
//             id: 3,
//             subject: "English",
//             marks: 75,
//             totalMarks: 100,
//             grade: "B",
//           },
//         ],
//       },
//       {
//         id: 2,
//         term: "Term 2 - 2024",
//         results: [
//           {
//             id: 1,
//             subject: "Mathematics",
//             marks: 80,
//             totalMarks: 100,
//             grade: "A",
//           },
//           {
//             id: 2,
//             subject: "Science",
//             marks: 90,
//             totalMarks: 100,
//             grade: "A+",
//           },
//           {
//             id: 3,
//             subject: "English",
//             marks: 76,
//             totalMarks: 100,
//             grade: "B+",
//           },
//         ],
//       },
//     ],
//   });

//   useEffect(() => {
//     loadResultData();
//   }, []);

//   const loadResultData = async () => {
//     // In a real app, you'd make an API call here to fetch result data
//     console.log("Loading result data");
//     // Mock data already loaded in state
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadResultData();
//     setRefreshing(false);
//   };

//   const calculateTotalAndAverage = () => {
//     if (resultData.current.length === 0)
//       return { total: 0, average: 0, percentage: 0 };

//     const total = resultData.current.reduce(
//       (sum, subject) => sum + subject.marks,
//       0
//     );
//     const totalPossible = resultData.current.reduce(
//       (sum, subject) => sum + subject.totalMarks,
//       0
//     );
//     const average = total / resultData.current.length;
//     const percentage = (total / totalPossible) * 100;

//     return {
//       total,
//       average: average.toFixed(2),
//       percentage: percentage.toFixed(2),
//     };
//   };

//   const renderCurrentResult = () => {
//     const stats = calculateTotalAndAverage();

//     return (
//       <View>
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Current Term Performance</Text>
//           <View style={styles.summaryRow}>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Total Marks</Text>
//               <Text style={styles.summaryValue}>{stats.total}</Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Average</Text>
//               <Text style={styles.summaryValue}>{stats.average}</Text>
//             </View>
//             <View style={styles.summaryItem}>
//               <Text style={styles.summaryLabel}>Percentage</Text>
//               <Text style={styles.summaryValue}>{stats.percentage}%</Text>
//             </View>
//           </View>
//         </View>

//         <Text style={styles.sectionTitle}>Subject-wise Results</Text>
//         {resultData.current.map((subject) => (
//           <View key={subject.id} style={styles.resultCard}>
//             <View style={styles.resultHeader}>
//               <Text style={styles.subjectName}>{subject.subject}</Text>
//               <View
//                 style={[
//                   styles.gradeBadge,
//                   { backgroundColor: getGradeColor(subject.grade) },
//                 ]}
//               >
//                 <Text style={styles.gradeText}>{subject.grade}</Text>
//               </View>
//             </View>

//             <View style={styles.resultDetails}>
//               <View style={styles.marksContainer}>
//                 <Text style={styles.marksText}>{subject.marks}</Text>
//                 <Text style={styles.totalMarksText}>/{subject.totalMarks}</Text>
//               </View>
//               {subject.remarks && (
//                 <Text style={styles.remarksText}>{subject.remarks}</Text>
//               )}
//             </View>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const renderPreviousResults = () => {
//     return (
//       <View>
//         {resultData.previous.map((term) => (
//           <View key={term.id} style={styles.termCard}>
//             <Text style={styles.termTitle}>{term.term}</Text>

//             {term.results.map((subject) => (
//               <View key={subject.id} style={styles.prevResultItem}>
//                 <Text style={styles.prevSubjectName}>{subject.subject}</Text>
//                 <View style={styles.prevResultRight}>
//                   <Text style={styles.prevMarksText}>
//                     {subject.marks}/{subject.totalMarks}
//                   </Text>
//                   <View
//                     style={[
//                       styles.miniGradeBadge,
//                       { backgroundColor: getGradeColor(subject.grade) },
//                     ]}
//                   >
//                     <Text style={styles.miniGradeText}>{subject.grade}</Text>
//                   </View>
//                 </View>
//               </View>
//             ))}

//             <TouchableOpacity style={styles.viewDetailButton}>
//               <Text style={styles.viewDetailText}>View Complete Result</Text>
//               <Icon name="arrow-forward" size={16} color={colors.primary} />
//             </TouchableOpacity>
//           </View>
//         ))}
//       </View>
//     );
//   };

//   const getGradeColor = (grade) => {
//     switch (grade) {
//       case "A+":
//         return colors.success + "30";
//       case "A":
//         return colors.success + "20";
//       case "B+":
//         return colors.info + "30";
//       case "B":
//         return colors.info + "20";
//       case "C":
//         return colors.warning + "30";
//       case "D":
//         return colors.warning + "20";
//       default:
//         return colors.error + "20";
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="Academic Results" />
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === "current" ? styles.activeTab : {},
//           ]}
//           onPress={() => setActiveTab("current")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "current" ? styles.activeTabText : {},
//             ]}
//           >
//             Current Term
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[
//             styles.tabButton,
//             activeTab === "previous" ? styles.activeTab : {},
//           ]}
//           onPress={() => setActiveTab("previous")}
//         >
//           <Text
//             style={[
//               styles.tabText,
//               activeTab === "previous" ? styles.activeTabText : {},
//             ]}
//           >
//             Previous Terms
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {activeTab === "current"
//           ? renderCurrentResult()
//           : renderPreviousResults()}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   scrollView: {
//     flex: 1,
//     padding: spacing.medium,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   tabButton: {
//     flex: 1,
//     padding: spacing.medium,
//     alignItems: "center",
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: colors.primary,
//   },
//   tabText: {
//     ...typography.button,
//     color: colors.textLight,
//   },
//   activeTabText: {
//     color: colors.primary,
//     fontWeight: "600",
//   },
//   summaryCard: {
//     backgroundColor: colors.white,
//     borderRadius: 8,
//     padding: spacing.medium,
//     marginTop: spacing.small,
//     marginBottom: spacing.medium,
//     elevation: 2,
//     shadowColor: colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   summaryTitle: {
//     ...typography.h3,
//     color: colors.text,
//     marginBottom: spacing.small,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   summaryItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   summaryLabel: {
//     ...typography.caption,
//     color: colors.textLight,
//   },
//   summaryValue: {
//     ...typography.h3,
//     color: colors.text,
//   },
//   sectionTitle: {
//     ...typography.h3,
//     color: colors.text,
//     marginVertical: spacing.small,
//   },
//   resultCard: {
//     backgroundColor: colors.white,
//     borderRadius: 8,
//     padding: spacing.medium,
//     marginBottom: spacing.medium,
//     elevation: 2,
//     shadowColor: colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   resultHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: spacing.small,
//   },
//   subjectName: {
//     ...typography.subtitle,
//     fontWeight: "bold",
//   },
//   gradeBadge: {
//     paddingHorizontal: spacing.small,
//     paddingVertical: spacing.xSmall,
//     borderRadius: 4,
//   },
//   gradeText: {
//     ...typography.caption,
//     fontWeight: "600",
//   },
//   resultDetails: {
//     marginTop: spacing.small,
//   },
//   marksContainer: {
//     flexDirection: "row",
//     alignItems: "baseline",
//   },
//   marksText: {
//     ...typography.h2,
//     fontWeight: "bold",
//     color: colors.text,
//   },
//   totalMarksText: {
//     ...typography.body,
//     color: colors.textLight,
//     marginLeft: 2,
//   },
//   remarksText: {
//     ...typography.body,
//     color: colors.textLight,
//     marginTop: spacing.xSmall,
//     fontStyle: "italic",
//   },
//   termCard: {
//     backgroundColor: colors.white,
//     borderRadius: 8,
//     padding: spacing.medium,
//     marginBottom: spacing.medium,
//     elevation: 2,
//     shadowColor: colors.shadow,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   termTitle: {
//     ...typography.h3,
//     color: colors.text,
//     marginBottom: spacing.medium,
//     fontWeight: "600",
//   },
//   prevResultItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: spacing.small,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.lightGrey,
//   },
//   prevSubjectName: {
//     ...typography.body,
//     fontWeight: "500",
//   },
//   prevResultRight: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   prevMarksText: {
//     ...typography.body,
//     marginRight: spacing.small,
//   },
//   miniGradeBadge: {
//     paddingHorizontal: spacing.xSmall,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   miniGradeText: {
//     ...typography.caption,
//     fontWeight: "600",
//     fontSize: 10,
//   },
//   viewDetailButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: spacing.small,
//     marginTop: spacing.medium,
//   },
//   viewDetailText: {
//     ...typography.button,
//     color: colors.primary,
//     marginRight: spacing.xSmall,
//   },
// });

// export default StudentResultScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "../../components/common/Header";

const { width } = Dimensions.get('window');

// Modern Professional Theme
const theme = {
  colors: {
    primary: '#1e3a8a',
    primaryLight: '#2563EB',
    secondary: '#64748B',
    
    background: '#F8FAFC',
    surface: '#FFFFFF',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    text: '#0F172A',
    textSecondary: '#475569',
    textLight: '#64748B',
    white: '#FFFFFF',
    
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0EA5E9',
    
    green50: '#F0FDF4',
    green100: '#DCFCE7',
    blue50: '#EFF6FF',
    blue100: '#DBEAFE',
    orange50: '#FFF7ED',
    orange100: '#FFEDD5',
    red50: '#FEF2F2',
    red100: '#FEE2E2',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    light: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
  }
};

const StudentResultScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [loading, setLoading] = useState(false);
  
  const [resultData, setResultData] = useState({
    current: {
      term: "Final Term 2024",
      examDate: "March 2024",
      status: "Published",
      totalSubjects: 5,
      subjects: [
        {
          id: 1,
          subject: "Mathematics",
          marks: 85,
          totalMarks: 100,
          grade: "A",
          gpa: 8.5,
          rank: 3,
          remarks: "Excellent understanding of calculus and algebra concepts.",
          teacher: "Dr. Smith",
        },
        {
          id: 2,
          subject: "Physics",
          marks: 92,
          totalMarks: 100,
          grade: "A+",
          gpa: 9.2,
          rank: 1,
          remarks: "Outstanding performance in practical experiments and theory.",
          teacher: "Prof. Johnson",
        },
        {
          id: 3,
          subject: "Chemistry",
          marks: 78,
          totalMarks: 100,
          grade: "B+",
          gpa: 7.8,
          rank: 8,
          remarks: "Good understanding, needs more practice in organic chemistry.",
          teacher: "Dr. Williams",
        },
        {
          id: 4,
          subject: "English",
          marks: 88,
          totalMarks: 100,
          grade: "A",
          gpa: 8.8,
          rank: 2,
          remarks: "Excellent writing skills and literature comprehension.",
          teacher: "Ms. Davis",
        },
        {
          id: 5,
          subject: "Computer Science",
          marks: 95,
          totalMarks: 100,
          grade: "A+",
          gpa: 9.5,
          rank: 1,
          remarks: "Exceptional programming skills and algorithm understanding.",
          teacher: "Mr. Wilson",
        },
      ]
    },
    previous: [
      {
        id: 1,
        term: "Mid Term 2024",
        examDate: "January 2024",
        overallGrade: "A",
        percentage: 84.2,
        rank: 4,
        totalStudents: 45,
        subjects: [
          { subject: "Mathematics", marks: 82, totalMarks: 100, grade: "A" },
          { subject: "Physics", marks: 88, totalMarks: 100, grade: "A" },
          { subject: "Chemistry", marks: 75, totalMarks: 100, grade: "B" },
          { subject: "English", marks: 86, totalMarks: 100, grade: "A" },
          { subject: "Computer Science", marks: 90, totalMarks: 100, grade: "A+" },
        ],
      },
      {
        id: 2,
        term: "Unit Test 2023",
        examDate: "November 2023",
        overallGrade: "A",
        percentage: 81.6,
        rank: 6,
        totalStudents: 45,
        subjects: [
          { subject: "Mathematics", marks: 80, totalMarks: 100, grade: "A" },
          { subject: "Physics", marks: 85, totalMarks: 100, grade: "A" },
          { subject: "Chemistry", marks: 76, totalMarks: 100, grade: "B+" },
          { subject: "English", marks: 84, totalMarks: 100, grade: "A" },
          { subject: "Computer Science", marks: 83, totalMarks: 100, grade: "A" },
        ],
      },
    ],
  });

  useEffect(() => {
    loadResultData();
  }, []);

  const loadResultData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Results loaded successfully");
      setLoading(false);
    }, 1000);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResultData();
    setRefreshing(false);
  };

  const calculateCurrentStats = () => {
    const subjects = resultData.current.subjects;
    if (subjects.length === 0) return { total: 0, average: 0, percentage: 0, overallGrade: 'N/A' };

    const total = subjects.reduce((sum, subject) => sum + subject.marks, 0);
    const totalPossible = subjects.reduce((sum, subject) => sum + subject.totalMarks, 0);
    const percentage = (total / totalPossible) * 100;
    const averageGPA = subjects.reduce((sum, subject) => sum + subject.gpa, 0) / subjects.length;
    
    let overallGrade = 'F';
    if (percentage >= 90) overallGrade = 'A+';
    else if (percentage >= 80) overallGrade = 'A';
    else if (percentage >= 70) overallGrade = 'B+';
    else if (percentage >= 60) overallGrade = 'B';
    else if (percentage >= 50) overallGrade = 'C';

    return {
      total,
      percentage: percentage.toFixed(1),
      averageGPA: averageGPA.toFixed(2),
      overallGrade,
      classRank: 2,
      totalStudents: 45
    };
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+": return theme.colors.success;
      case "A": return theme.colors.info;
      case "B+": return theme.colors.warning;
      case "B": return '#F59E0B';
      case "C": return '#EF4444';
      default: return theme.colors.error;
    }
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: theme.colors.success };
    if (percentage >= 80) return { level: 'Very Good', color: theme.colors.info };
    if (percentage >= 70) return { level: 'Good', color: theme.colors.warning };
    if (percentage >= 60) return { level: 'Average', color: '#F59E0B' };
    return { level: 'Needs Improvement', color: theme.colors.error };
  };

  const renderProgressBar = (percentage) => {
    return (
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { 
              width: `${percentage}%`,
              backgroundColor: getPerformanceLevel(percentage).color 
            }
          ]} 
        />
      </View>
    );
  };

  const renderCurrentResults = () => {
    const stats = calculateCurrentStats();
    const performance = getPerformanceLevel(parseFloat(stats.percentage));

    return (
      <View style={styles.tabContent}>
        {/* No Results Available Message */}
        <View style={styles.noResultsCard}>
          <View style={styles.noResultsIcon}>
            <Icon name="assignment" size={32} color={theme.colors.textLight} />
          </View>
          <Text style={styles.noResultsTitle}>Results Not Available</Text>
          <Text style={styles.noResultsMessage}>
            Your current term results haven't been published yet. Results will be available here once they are processed by the academic office.
          </Text>
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={onRefresh}
          >
            <Icon name="refresh" size={20} color={theme.colors.primary} />
            <Text style={styles.refreshButtonText}>Check Again</Text>
          </TouchableOpacity>
        </View>

        {/* Demo Results Section */}
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Sample Result Format</Text>
          <Text style={styles.demoSubtitle}>Here's how your results will appear once published:</Text>
          
          {/* Overview Card */}
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <View>
                <Text style={styles.termTitle}>{resultData.current.term}</Text>
                <Text style={styles.examDate}>Exam Date: {resultData.current.examDate}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: theme.colors.green50 }]}>
                <Text style={[styles.statusText, { color: theme.colors.success }]}>
                  {resultData.current.status}
                </Text>
              </View>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.percentage}%</Text>
                <Text style={styles.statLabel}>Overall</Text>
                {renderProgressBar(parseFloat(stats.percentage))}
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.overallGrade}</Text>
                <Text style={styles.statLabel}>Grade</Text>
                <View style={[styles.gradeIndicator, { backgroundColor: getGradeColor(stats.overallGrade) }]} />
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.classRank}</Text>
                <Text style={styles.statLabel}>Class Rank</Text>
                <Text style={styles.rankSubtext}>of {stats.totalStudents}</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.averageGPA}</Text>
                <Text style={styles.statLabel}>GPA</Text>
                <Text style={[styles.performanceText, { color: performance.color }]}>
                  {performance.level}
                </Text>
              </View>
            </View>
          </View>

          {/* Subject Cards */}
          <Text style={styles.sectionTitle}>Subject-wise Performance</Text>
          {resultData.current.subjects.map((subject, index) => (
            <View key={subject.id} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectInfo}>
                  <Text style={styles.subjectName}>{subject.subject}</Text>
                  <Text style={styles.teacherName}>by {subject.teacher}</Text>
                </View>
                
                <View style={styles.subjectStats}>
                  <View style={styles.marksContainer}>
                    <Text style={styles.marksText}>{subject.marks}</Text>
                    <Text style={styles.totalMarksText}>/{subject.totalMarks}</Text>
                  </View>
                  <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(subject.grade) }]}>
                    <Text style={styles.gradeText}>{subject.grade}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.subjectDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Icon name="trending-up" size={16} color={theme.colors.textLight} />
                    <Text style={styles.detailText}>GPA: {subject.gpa}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="emoji-events" size={16} color={theme.colors.textLight} />
                    <Text style={styles.detailText}>Rank: {subject.rank}</Text>
                  </View>
                </View>
                
                {renderProgressBar((subject.marks / subject.totalMarks) * 100)}
                
                {subject.remarks && (
                  <View style={styles.remarksContainer}>
                    <Icon name="comment" size={14} color={theme.colors.textLight} />
                    <Text style={styles.remarksText}>{subject.remarks}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPreviousResults = () => {
    return (
      <View style={styles.tabContent}>
        {resultData.previous.length === 0 ? (
          <View style={styles.noResultsCard}>
            <Icon name="history" size={32} color={theme.colors.textLight} />
            <Text style={styles.noResultsTitle}>No Previous Results</Text>
            <Text style={styles.noResultsMessage}>
              Previous term results will appear here once available.
            </Text>
          </View>
        ) : (
          <>
            {resultData.previous.map((term) => (
              <View key={term.id} style={styles.termCard}>
                <View style={styles.termHeader}>
                  <View>
                    <Text style={styles.termTitle}>{term.term}</Text>
                    <Text style={styles.examDate}>{term.examDate}</Text>
                  </View>
                  <View style={styles.termStats}>
                    <Text style={styles.termPercentage}>{term.percentage}%</Text>
                    <Text style={styles.termRank}>Rank {term.rank}/{term.totalStudents}</Text>
                  </View>
                </View>

                <View style={styles.subjectsList}>
                  {term.subjects.map((subject, index) => (
                    <View key={index} style={styles.subjectRow}>
                      <Text style={styles.subjectRowName}>{subject.subject}</Text>
                      <View style={styles.subjectRowRight}>
                        <Text style={styles.subjectRowMarks}>
                          {subject.marks}/{subject.totalMarks}
                        </Text>
                        <View style={[styles.miniGradeBadge, { backgroundColor: getGradeColor(subject.grade) }]}>
                          <Text style={styles.miniGradeText}>{subject.grade}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <TouchableOpacity 
                  style={styles.viewDetailsButton}
                  onPress={() => Alert.alert('Details', `Detailed view for ${term.term}`)}
                >
                  <Text style={styles.viewDetailsText}>View Detailed Report</Text>
                  <Icon name="arrow-forward" size={16} color={theme.colors.primary} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Academic Results" />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Icon 
            name="assignment" 
            size={20} 
            color={activeTab === "current" ? theme.colors.primary : theme.colors.textLight} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === "current" && styles.activeTabText
          ]}>
            Current Term
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "previous" && styles.activeTab]}
          onPress={() => setActiveTab("previous")}
        >
          <Icon 
            name="history" 
            size={20} 
            color={activeTab === "previous" ? theme.colors.primary : theme.colors.textLight} 
          />
          <Text style={[
            styles.tabText, 
            activeTab === "previous" && styles.activeTabText
          ]}>
            Previous Results
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "current" ? renderCurrentResults() : renderPreviousResults()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Tab Navigation
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textLight,
    marginLeft: theme.spacing.sm,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  tabContent: {
    flex: 1,
  },

  // No Results Card
  noResultsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.card,
  },
  noResultsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  noResultsMessage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.blue50,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },

  // Demo Section
  demoSection: {
    opacity: 0.7,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  demoSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },

  // Overview Card
  overviewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  termTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  examDate: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: (width - theme.spacing.lg * 2 - theme.spacing.lg - theme.spacing.md) / 2,
    backgroundColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  rankSubtext: {
    fontSize: 10,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  performanceText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  gradeIndicator: {
    width: 20,
    height: 4,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
  },

  // Progress Bar
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },

  // Section Title
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    marginTop: theme.spacing.sm,
  },

  // Subject Cards
  subjectCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  teacherName: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  subjectStats: {
    alignItems: 'flex-end',
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.xs,
  },
  marksText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
  },
  totalMarksText: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  gradeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  gradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.white,
  },

  subjectDetails: {
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  remarksContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.borderLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.sm,
  },
  remarksText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    flex: 1,
    marginLeft: theme.spacing.sm,
    lineHeight: 16,
    fontStyle: 'italic',
  },

  // Previous Results
  termCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  termStats: {
    alignItems: 'flex-end',
  },
  termPercentage: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  termRank: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },

  subjectsList: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  subjectRowName: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    flex: 1,
  },
  subjectRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  subjectRowMarks: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  miniGradeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniGradeText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.white,
  },

  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue50,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
});

export default StudentResultScreen;