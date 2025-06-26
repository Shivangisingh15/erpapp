import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const StudentResultScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("current");
  const [resultData, setResultData] = useState({
    current: [
      {
        id: 1,
        subject: "Mathematics",
        marks: 85,
        totalMarks: 100,
        grade: "A",
        remarks: "Excellent understanding of calculus concepts.",
      },
      {
        id: 2,
        subject: "Science",
        marks: 92,
        totalMarks: 100,
        grade: "A+",
        remarks: "Outstanding performance in practical experiments.",
      },
      {
        id: 3,
        subject: "English",
        marks: 78,
        totalMarks: 100,
        grade: "B+",
        remarks: "Good comprehension, needs improvement in essay writing.",
      },
      {
        id: 4,
        subject: "History",
        marks: 88,
        totalMarks: 100,
        grade: "A",
        remarks: "Excellent understanding of historical events.",
      },
      {
        id: 5,
        subject: "Computer Science",
        marks: 95,
        totalMarks: 100,
        grade: "A+",
        remarks: "Exceptional programming skills and problem-solving ability.",
      },
    ],
    previous: [
      {
        id: 1,
        term: "Term 1 - 2024",
        results: [
          {
            id: 1,
            subject: "Mathematics",
            marks: 82,
            totalMarks: 100,
            grade: "A",
          },
          {
            id: 2,
            subject: "Science",
            marks: 88,
            totalMarks: 100,
            grade: "A",
          },
          {
            id: 3,
            subject: "English",
            marks: 75,
            totalMarks: 100,
            grade: "B",
          },
        ],
      },
      {
        id: 2,
        term: "Term 2 - 2024",
        results: [
          {
            id: 1,
            subject: "Mathematics",
            marks: 80,
            totalMarks: 100,
            grade: "A",
          },
          {
            id: 2,
            subject: "Science",
            marks: 90,
            totalMarks: 100,
            grade: "A+",
          },
          {
            id: 3,
            subject: "English",
            marks: 76,
            totalMarks: 100,
            grade: "B+",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    loadResultData();
  }, []);

  const loadResultData = async () => {
    // In a real app, you'd make an API call here to fetch result data
    console.log("Loading result data");
    // Mock data already loaded in state
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadResultData();
    setRefreshing(false);
  };

  const calculateTotalAndAverage = () => {
    if (resultData.current.length === 0)
      return { total: 0, average: 0, percentage: 0 };

    const total = resultData.current.reduce(
      (sum, subject) => sum + subject.marks,
      0
    );
    const totalPossible = resultData.current.reduce(
      (sum, subject) => sum + subject.totalMarks,
      0
    );
    const average = total / resultData.current.length;
    const percentage = (total / totalPossible) * 100;

    return {
      total,
      average: average.toFixed(2),
      percentage: percentage.toFixed(2),
    };
  };

  const renderCurrentResult = () => {
    const stats = calculateTotalAndAverage();

    return (
      <View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Current Term Performance</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Marks</Text>
              <Text style={styles.summaryValue}>{stats.total}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Average</Text>
              <Text style={styles.summaryValue}>{stats.average}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Percentage</Text>
              <Text style={styles.summaryValue}>{stats.percentage}%</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Subject-wise Results</Text>
        {resultData.current.map((subject) => (
          <View key={subject.id} style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Text style={styles.subjectName}>{subject.subject}</Text>
              <View
                style={[
                  styles.gradeBadge,
                  { backgroundColor: getGradeColor(subject.grade) },
                ]}
              >
                <Text style={styles.gradeText}>{subject.grade}</Text>
              </View>
            </View>

            <View style={styles.resultDetails}>
              <View style={styles.marksContainer}>
                <Text style={styles.marksText}>{subject.marks}</Text>
                <Text style={styles.totalMarksText}>/{subject.totalMarks}</Text>
              </View>
              {subject.remarks && (
                <Text style={styles.remarksText}>{subject.remarks}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderPreviousResults = () => {
    return (
      <View>
        {resultData.previous.map((term) => (
          <View key={term.id} style={styles.termCard}>
            <Text style={styles.termTitle}>{term.term}</Text>

            {term.results.map((subject) => (
              <View key={subject.id} style={styles.prevResultItem}>
                <Text style={styles.prevSubjectName}>{subject.subject}</Text>
                <View style={styles.prevResultRight}>
                  <Text style={styles.prevMarksText}>
                    {subject.marks}/{subject.totalMarks}
                  </Text>
                  <View
                    style={[
                      styles.miniGradeBadge,
                      { backgroundColor: getGradeColor(subject.grade) },
                    ]}
                  >
                    <Text style={styles.miniGradeText}>{subject.grade}</Text>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity style={styles.viewDetailButton}>
              <Text style={styles.viewDetailText}>View Complete Result</Text>
              <Icon name="arrow-forward" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A+":
        return colors.success + "30";
      case "A":
        return colors.success + "20";
      case "B+":
        return colors.info + "30";
      case "B":
        return colors.info + "20";
      case "C":
        return colors.warning + "30";
      case "D":
        return colors.warning + "20";
      default:
        return colors.error + "20";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Academic Results" />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "current" ? styles.activeTab : {},
          ]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" ? styles.activeTabText : {},
            ]}
          >
            Current Term
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "previous" ? styles.activeTab : {},
          ]}
          onPress={() => setActiveTab("previous")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "previous" ? styles.activeTabText : {},
            ]}
          >
            Previous Terms
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {activeTab === "current"
          ? renderCurrentResult()
          : renderPreviousResults()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
    padding: spacing.medium,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    padding: spacing.medium,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.button,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    marginTop: spacing.small,
    marginBottom: spacing.medium,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.small,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  summaryValue: {
    ...typography.h3,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.small,
  },
  resultCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.small,
  },
  subjectName: {
    ...typography.subtitle,
    fontWeight: "bold",
  },
  gradeBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xSmall,
    borderRadius: 4,
  },
  gradeText: {
    ...typography.caption,
    fontWeight: "600",
  },
  resultDetails: {
    marginTop: spacing.small,
  },
  marksContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  marksText: {
    ...typography.h2,
    fontWeight: "bold",
    color: colors.text,
  },
  totalMarksText: {
    ...typography.body,
    color: colors.textLight,
    marginLeft: 2,
  },
  remarksText: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.xSmall,
    fontStyle: "italic",
  },
  termCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.medium,
    marginBottom: spacing.medium,
    elevation: 2,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  termTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.medium,
    fontWeight: "600",
  },
  prevResultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.small,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  prevSubjectName: {
    ...typography.body,
    fontWeight: "500",
  },
  prevResultRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  prevMarksText: {
    ...typography.body,
    marginRight: spacing.small,
  },
  miniGradeBadge: {
    paddingHorizontal: spacing.xSmall,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniGradeText: {
    ...typography.caption,
    fontWeight: "600",
    fontSize: 10,
  },
  viewDetailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    marginTop: spacing.medium,
  },
  viewDetailText: {
    ...typography.button,
    color: colors.primary,
    marginRight: spacing.xSmall,
  },
});

export default StudentResultScreen;
