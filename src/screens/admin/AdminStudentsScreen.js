import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const AdminStudentsScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterClass, setFilterClass] = useState("All");
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Ananya Patel",
      studentId: "STU2025001",
      class: "Class X - A",
      attendance: "92%",
      lastFee: "Paid",
      marks: "85%",
    },
    {
      id: 2,
      name: "Rahul Singh",
      studentId: "STU2025002",
      class: "Class X - A",
      attendance: "88%",
      lastFee: "Pending",
      marks: "78%",
    },
    {
      id: 3,
      name: "Priya Sharma",
      studentId: "STU2025003",
      class: "Class X - B",
      attendance: "96%",
      lastFee: "Paid",
      marks: "92%",
    },
    {
      id: 4,
      name: "Ajay Kumar",
      studentId: "STU2025004",
      class: "Class X - B",
      attendance: "75%",
      lastFee: "Pending",
      marks: "68%",
    },
    {
      id: 5,
      name: "Neha Gupta",
      studentId: "STU2025005",
      class: "Class IX - A",
      attendance: "91%",
      lastFee: "Paid",
      marks: "88%",
    },
    {
      id: 6,
      name: "Vikram Malhotra",
      studentId: "STU2025006",
      class: "Class IX - A",
      attendance: "82%",
      lastFee: "Paid",
      marks: "76%",
    },
    {
      id: 7,
      name: "Kavita Joshi",
      studentId: "STU2025007",
      class: "Class IX - B",
      attendance: "94%",
      lastFee: "Paid",
      marks: "89%",
    },
  ]);

  const classOptions = [
    "All",
    "Class X - A",
    "Class X - B",
    "Class IX - A",
    "Class IX - B",
  ];

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    // In a real app, you'd make an API call here to fetch students data
    console.log("Loading students data");
    // Mock data already loaded in state
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
    setRefreshing(false);
  };

  const handleViewStudent = (student) => {
    // Navigation to student details screen in a real app
    Alert.alert("Student Details", `You selected ${student.name}`, [
      { text: "OK" },
    ]);
  };

  // Filter students based on search and class
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === "All" || student.class === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Students Management" />
      <View style={styles.filtersContainer}>
        <View style={styles.searchContainer}>
          <Icon name="search" size={24} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or ID"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Icon name="clear" size={20} color={colors.textLight} />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.classFilters}
        >
          {classOptions.map((classOption) => (
            <TouchableOpacity
              key={classOption}
              style={[
                styles.classFilterButton,
                filterClass === classOption ? styles.activeClassFilter : {},
              ]}
              onPress={() => setFilterClass(classOption)}
            >
              <Text
                style={[
                  styles.classFilterText,
                  filterClass === classOption
                    ? styles.activeClassFilterText
                    : {},
                ]}
              >
                {classOption}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{students.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {students.filter((s) => s.lastFee === "Pending").length}
          </Text>
          <Text style={styles.statLabel}>Fee Pending</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {
              students.filter(
                (s) => parseInt(s.attendance.replace("%", "")) < 80
              ).length
            }
          </Text>
          <Text style={styles.statLabel}>Low Attendance</Text>
        </View>
      </View>

      <ScrollView
        style={styles.studentsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredStudents.length > 0 ? (
          filteredStudents.map((student) => (
            <TouchableOpacity
              key={student.id}
              style={styles.studentCard}
              onPress={() => handleViewStudent(student)}
            >
              <View style={styles.studentHeader}>
                <View style={styles.nameContainer}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentId}>{student.studentId}</Text>
                  </View>
                </View>
                <Text style={styles.studentClass}>{student.class}</Text>
              </View>

              <View style={styles.studentStats}>
                <View style={styles.studentStat}>
                  <Text style={styles.statTitle}>Attendance</Text>
                  <Text
                    style={[
                      styles.statResult,
                      parseInt(student.attendance.replace("%", "")) < 80
                        ? styles.statWarning
                        : styles.statGood,
                    ]}
                  >
                    {student.attendance}
                  </Text>
                </View>

                <View style={styles.studentStat}>
                  <Text style={styles.statTitle}>Last Fee</Text>
                  <Text
                    style={[
                      styles.statResult,
                      student.lastFee === "Pending"
                        ? styles.statWarning
                        : styles.statGood,
                    ]}
                  >
                    {student.lastFee}
                  </Text>
                </View>

                <View style={styles.studentStat}>
                  <Text style={styles.statTitle}>Marks</Text>
                  <Text
                    style={[
                      styles.statResult,
                      parseInt(student.marks.replace("%", "")) < 70
                        ? styles.statWarning
                        : styles.statGood,
                    ]}
                  >
                    {student.marks}
                  </Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="edit" size={16} color={colors.primary} />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="assessment" size={16} color={colors.info} />
                  <Text style={styles.actionText}>Results</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton}>
                  <Icon name="payment" size={16} color={colors.success} />
                  <Text style={styles.actionText}>Fee</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResultsContainer}>
            <Icon name="search-off" size={48} color={colors.textLight} />
            <Text style={styles.noResultsText}>No students found</Text>
            <Text style={styles.noResultsSubtext}>
              Try adjusting your filters
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.floatingButton}>
          <Icon name="person-add" size={24} color={colors.white} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filtersContainer: {
    padding: spacing.medium,
    backgroundColor: colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.lightBackground,
    borderRadius: 8,
    padding: spacing.small,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    marginLeft: spacing.small,
  },
  classFilters: {
    marginTop: spacing.medium,
  },
  classFilterButton: {
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    marginRight: spacing.small,
    borderRadius: 20,
    backgroundColor: colors.lightBackground,
  },
  activeClassFilter: {
    backgroundColor: colors.primary,
  },
  classFilterText: {
    ...typography.button,
    color: colors.textLight,
  },
  activeClassFilterText: {
    color: colors.white,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    padding: spacing.medium,
    marginBottom: spacing.small,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    ...typography.h3,
    fontWeight: "bold",
    color: colors.text,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textLight,
  },
  studentsList: {
    flex: 1,
    padding: spacing.medium,
  },
  studentCard: {
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
  studentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.small,
  },
  avatarText: {
    color: colors.white,
    fontWeight: "bold",
  },
  studentName: {
    ...typography.subtitle,
    fontWeight: "bold",
  },
  studentId: {
    ...typography.caption,
    color: colors.textLight,
  },
  studentClass: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  studentStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.medium,
    paddingVertical: spacing.small,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightGrey,
  },
  studentStat: {
    alignItems: "center",
    flex: 1,
  },
  statTitle: {
    ...typography.caption,
    color: colors.textLight,
    marginBottom: spacing.xSmall,
  },
  statResult: {
    ...typography.body,
    fontWeight: "600",
  },
  statGood: {
    color: colors.success,
  },
  statWarning: {
    color: colors.warning,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.small,
  },
  actionText: {
    ...typography.button,
    color: colors.text,
    marginLeft: spacing.xSmall,
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.large * 2,
  },
  noResultsText: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.medium,
  },
  noResultsSubtext: {
    ...typography.body,
    color: colors.textLight,
    marginTop: spacing.small,
  },
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default AdminStudentsScreen;
