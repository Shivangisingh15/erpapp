import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const StudentFeeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [feeData, setFeeData] = useState([
    {
      id: 1,
      term: "Term 1 - 2025",
      totalAmount: 25000,
      dueDate: "2025-07-15",
      status: "paid",
      paidDate: "2025-06-10",
      receiptNumber: "R-2025-001",
    },
    {
      id: 2,
      term: "Term 2 - 2025",
      totalAmount: 25000,
      dueDate: "2025-11-15",
      status: "pending",
      paidDate: null,
      receiptNumber: null,
    },
  ]);

  useEffect(() => {
    loadFeeData();
  }, []);

  const loadFeeData = async () => {
    // In a real app, you'd make an API call here to fetch fee data
    console.log("Loading fee data");
    // Mock data already loaded in state
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeeData();
    setRefreshing(false);
  };

  const renderFeeItem = (fee) => {
    const isPaid = fee.status === "paid";

    return (
      <View key={fee.id} style={styles.feeCard}>
        <View style={styles.feeHeader}>
          <Text style={styles.feeTerm}>{fee.term}</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: isPaid
                  ? colors.success + "20"
                  : colors.warning + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: isPaid ? colors.success : colors.warning },
              ]}
            >
              {isPaid ? "Paid" : "Pending"}
            </Text>
          </View>
        </View>

        <View style={styles.feeDetails}>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Total Amount:</Text>
            <Text style={styles.feeValue}>
              ₹{fee.totalAmount.toLocaleString()}
            </Text>
          </View>

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Due Date:</Text>
            <Text style={styles.feeValue}>{fee.dueDate}</Text>
          </View>

          {isPaid && (
            <>
              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Paid Date:</Text>
                <Text style={styles.feeValue}>{fee.paidDate}</Text>
              </View>

              <View style={styles.feeRow}>
                <Text style={styles.feeLabel}>Receipt Number:</Text>
                <Text style={styles.feeValue}>{fee.receiptNumber}</Text>
              </View>
            </>
          )}
        </View>

        {!isPaid && (
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay Now</Text>
          </TouchableOpacity>
        )}

        {isPaid && (
          <TouchableOpacity style={styles.receiptButton}>
            <Icon name="receipt" size={16} color={colors.primary} />
            <Text style={styles.receiptButtonText}>Download Receipt</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Fee Details" />
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Fee Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>₹50,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Paid</Text>
              <Text style={styles.summaryValue}>₹25,000</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Pending</Text>
              <Text style={styles.summaryValue}>₹25,000</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Fee History</Text>
        {feeData.map((fee) => renderFeeItem(fee))}
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
  summaryCard: {
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
    marginVertical: spacing.medium,
  },
  feeCard: {
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
  feeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.small,
  },
  feeTerm: {
    ...typography.subtitle,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.xSmall / 2,
    borderRadius: 4,
  },
  statusText: {
    ...typography.caption,
    fontWeight: "600",
  },
  feeDetails: {
    marginBottom: spacing.small,
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: spacing.xSmall,
  },
  feeLabel: {
    ...typography.body,
    color: colors.textLight,
  },
  feeValue: {
    ...typography.body,
    fontWeight: "500",
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: 4,
    padding: spacing.small,
    alignItems: "center",
    marginTop: spacing.small,
  },
  payButtonText: {
    ...typography.button,
    color: colors.white,
  },
  receiptButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    marginTop: spacing.small,
  },
  receiptButtonText: {
    ...typography.button,
    color: colors.primary,
    marginLeft: spacing.xSmall,
  },
});

export default StudentFeeScreen;
