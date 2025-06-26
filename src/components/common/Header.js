import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";

const Header = ({ title, showBack = false, rightComponent = null }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>{title}</Text>
      </View>

      {rightComponent ? (
        <View style={styles.rightContainer}>{rightComponent}</View>
      ) : (
        <TouchableOpacity style={styles.notificationButton}>
          <Icon name="notifications" size={24} color={colors.text} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: spacing.small,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    fontWeight: "600",
  },
  rightContainer: {},
  notificationButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default Header;
