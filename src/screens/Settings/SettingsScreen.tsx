import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Spacing, BorderRadius, Typography } from '../../constants';

/** Icon name type for Feather icons used in settings rows */
type FeatherIconName = keyof typeof Feather.glyphMap;

/** Represents a single settings row configuration */
interface SettingsRow {
  icon: FeatherIconName;
  label: string;
  rightType: 'chevron' | 'switch' | 'text';
  rightText?: string;
  value?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
}

/** Represents a group/section of settings rows */
interface SettingsSection {
  title: string;
  rows: SettingsRow[];
}

const SettingsScreen: React.FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Mock toggle states (not persisted)
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  /** Get user initials for avatar placeholder */
  const getInitials = (): string => {
    if (!user) return '?';
    const first = user.firstName?.charAt(0) || '';
    const last = user.lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
  };

  /** Handle sign out with confirmation */
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => logout(),
        },
      ],
    );
  };

  /** Handle row press actions */
  const handleRowPress = (label: string) => {
    Alert.alert(label, 'This feature will be available soon.');
  };

  /** Handle sign out row */
  const handleSignOutPress = () => {
    handleSignOut();
  };

  /** Build all settings sections */
  const sections: SettingsSection[] = [
    {
      title: 'Security',
      rows: [
        {
          icon: 'lock',
          label: 'Change PIN',
          rightType: 'chevron',
          onPress: () => handleRowPress('Change PIN'),
        },
        {
          icon: 'key',
          label: 'Biometric Authentication',
          rightType: 'switch',
          value: biometricEnabled,
          onToggle: setBiometricEnabled,
        },
        {
          icon: 'shield',
          label: 'Two-Factor Authentication',
          rightType: 'switch',
          value: twoFactorEnabled,
          onToggle: setTwoFactorEnabled,
        },
      ],
    },
    {
      title: 'Notifications',
      rows: [
        {
          icon: 'bell',
          label: 'Push Notifications',
          rightType: 'switch',
          value: pushNotifications,
          onToggle: setPushNotifications,
        },
        {
          icon: 'mail',
          label: 'Email Alerts',
          rightType: 'switch',
          value: emailAlerts,
          onToggle: setEmailAlerts,
        },
        {
          icon: 'message-square',
          label: 'SMS Alerts',
          rightType: 'switch',
          value: smsAlerts,
          onToggle: setSmsAlerts,
        },
      ],
    },
    {
      title: 'Appearance',
      rows: [
        {
          icon: isDark ? 'moon' : 'sun',
          label: 'Dark Mode',
          rightType: 'switch',
          value: isDark,
          onToggle: () => toggleTheme(),
        },
      ],
    },
    {
      title: 'About',
      rows: [
        {
          icon: 'info',
          label: 'App Version',
          rightType: 'text',
          rightText: '1.0.0',
        },
        {
          icon: 'help-circle',
          label: 'Help & Support',
          rightType: 'chevron',
          onPress: () => handleRowPress('Help & Support'),
        },
        {
          icon: 'file-text',
          label: 'Terms of Service',
          rightType: 'chevron',
          onPress: () => handleRowPress('Terms of Service'),
        },
        {
          icon: 'shield',
          label: 'Privacy Policy',
          rightType: 'chevron',
          onPress: () => handleRowPress('Privacy Policy'),
        },
      ],
    },
  ];

  /**
   * Renders a single settings row with the appropriate right element.
   */
  const renderRow = (row: SettingsRow, index: number, totalRows: number) => {
    const isLast = index === totalRows - 1;

    return (
      <TouchableOpacity
        key={row.label}
        style={[
          styles.row,
          {
            borderBottomColor: isLast ? 'transparent' : colors.border,
            borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
          },
        ]}
        onPress={row.onPress || (row.rightType === 'switch' ? undefined : undefined)}
        activeOpacity={row.onPress ? 0.6 : 1}
        disabled={row.rightType === 'switch'}
      >
        <View style={styles.rowLeft}>
          <View style={[styles.rowIconContainer, { backgroundColor: (row.isDestructive ? colors.error : colors.primary) + '12' }]}>
            <Feather
              name={row.icon}
              size={18}
              color={row.isDestructive ? colors.error : colors.primary}
            />
          </View>
          <Text
            style={[
              styles.rowLabel,
              { color: row.isDestructive ? colors.error : colors.text },
            ]}
          >
            {row.label}
          </Text>
        </View>

        <View style={styles.rowRight}>
          {row.rightType === 'switch' && row.onToggle && (
            <Switch
              value={row.value}
              onValueChange={row.onToggle}
              trackColor={{
                false: colors.inputBackground,
                true: colors.primary + '60',
              }}
              thumbColor={row.value ? colors.primary : colors.textLight}
              ios_backgroundColor={colors.inputBackground}
            />
          )}
          {row.rightType === 'chevron' && (
            <Feather name="chevron-right" size={18} color={colors.textLight} />
          )}
          {row.rightType === 'text' && row.rightText && (
            <Text style={[styles.rowText, { color: colors.textSecondary }]}>
              {row.rightText}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Renders a settings section with title and rows.
   */
  const renderSection = (section: SettingsSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {section.title.toUpperCase()}
      </Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
        {section.rows.map((row, index) => renderRow(row, index, section.rows.length))}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>{getInitials()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              {user?.email}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.editProfileButton, { backgroundColor: colors.primary + '12' }]}
            activeOpacity={0.7}
            onPress={() => handleRowPress('Edit Profile')}
          >
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Sections */}
        {sections.map(renderSection)}

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[styles.signOutButton, { backgroundColor: colors.error + '10', borderColor: colors.error + '20' }]}
          onPress={handleSignOutPress}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={20} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  // Profile Section
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: Spacing.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
  },
  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  profileName: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
  },
  editProfileButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  editProfileText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semibold,
  },
  // Section Styles
  section: {
    marginBottom: Spacing.base,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.base + Spacing.xs,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    marginHorizontal: Spacing.base,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  // Row Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md + 2,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rowIconContainer: {
    width: 34,
    height: 34,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  rowLabel: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.medium,
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowText: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
  },
  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  signOutText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});

export default SettingsScreen;
