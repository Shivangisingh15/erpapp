import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../../styles/colors";
import { typography } from "../../styles/typography";
import { spacing } from "../../styles/spacing";
import Header from "../../components/common/Header";

const AdminSettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);

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

  const settingsGroups = [
    {
      title: "General",
      settings: [
        {
          id: "notifications",
          title: "Push Notifications",
          type: "switch",
          value: notificationsEnabled,
          onChange: setNotificationsEnabled,
        },
        {
          id: "dark-mode",
          title: "Dark Mode",
          type: "switch",
          value: darkModeEnabled,
          onChange: setDarkModeEnabled,
        },
        {
          id: "auto-backup",
          title: "Auto Backup",
          type: "switch",
          value: autoBackupEnabled,
          onChange: setAutoBackupEnabled,
        },
      ],
    },
    {
      title: "Appearance",
      settings: [
        {
          id: "language",
          title: "Language",
          type: "action",
          value: "English",
          icon: "language",
        },
        {
          id: "font-size",
          title: "Font Size",
          type: "action",
          value: "Medium",
          icon: "format-size",
        },
      ],
    },
    {
      title: "System",
      settings: [
        {
          id: "backup",
          title: "Backup Data",
          type: "action",
          icon: "backup",
        },
        {
          id: "restore",
          title: "Restore Data",
          type: "action",
          icon: "settings-backup-restore",
        },
        {
          id: "about",
          title: "About",
          type: "action",
          icon: "info",
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" />
      <ScrollView style={styles.content}>
        {settingsGroups.map((group, index) => (
          <View
            key={group.title}
            style={[styles.settingsGroup, index === 0 ? { marginTop: 0 } : {}]}
          >
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.settingsContainer}>
              {group.settings.map((setting, settingIndex) => (
                <View
                  key={setting.id}
                  style={[
                    styles.settingItem,
                    settingIndex === group.settings.length - 1
                      ? { borderBottomWidth: 0 }
                      : {},
                  ]}
                >
                  <View style={styles.settingLeft}>
                    {setting.icon && (
                      <Icon
                        name={setting.icon}
                        size={22}
                        color={colors.primary}
                        style={styles.settingIcon}
                      />
                    )}
                    <Text style={styles.settingTitle}>{setting.title}</Text>
                  </View>

                  {setting.type === "switch" ? (
                    <Switch
                      value={setting.value}
                      onValueChange={setting.onChange}
                      trackColor={{
                        false: colors.lightGrey,
                        true: colors.primary + "70",
                      }}
                      thumbColor={setting.value ? colors.primary : colors.grey}
                    />
                  ) : (
                    <View style={styles.settingRight}>
                      {setting.value && (
                        <Text style={styles.settingValue}>{setting.value}</Text>
                      )}
                      <Icon
                        name="chevron-right"
                        size={22}
                        color={colors.textLight}
                      />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="exit-to-app" size={20} color={colors.white} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
  settingsGroup: {
    marginTop: spacing.medium,
    marginBottom: spacing.medium,
  },
  groupTitle: {
    ...typography.subtitle,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: spacing.small,
    paddingHorizontal: spacing.small,
  },
  settingsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: spacing.small,
  },
  settingTitle: {
    ...typography.body,
    color: colors.text,
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingValue: {
    ...typography.body,
    color: colors.textLight,
    marginRight: spacing.small,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: colors.error,
    marginVertical: spacing.large,
    paddingVertical: spacing.medium,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    ...typography.button,
    color: colors.white,
    marginLeft: spacing.small,
  },
  versionContainer: {
    alignItems: "center",
    padding: spacing.medium,
  },
  versionText: {
    ...typography.caption,
    color: colors.textLight,
  },
});

export default AdminSettingsScreen;
