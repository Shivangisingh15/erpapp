import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const AdminFeesScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Fees Management" />
      <ScrollView style={styles.content}>
        <View style={styles.centerContainer}>
          <Text style={styles.placeholder}>Fees Management Screen</Text>
          <Text style={styles.subText}>
            This screen will contain fee management functionality
          </Text>
        </View>
      </ScrollView>
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
    padding: spacing.medium,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  placeholder: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.small,
  },
  subText: {
    ...typography.body,
    color: colors.textLight,
    textAlign: "center",
  },
});

export default AdminFeesScreen;
