import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { Spacing, Typography } from '../constants';

interface EmptyStateProps {
  icon?: keyof typeof Feather.glyphMap;
  message: string;
  subMessage?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'inbox',
  message,
  subMessage,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.inputBackground }]}>
        <Feather name={icon} size={40} color={colors.textLight} />
      </View>
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {subMessage && (
        <Text style={[styles.subMessage, { color: colors.textSecondary }]}>
          {subMessage}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['3xl'],
    paddingVertical: Spacing['4xl'],
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  message: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subMessage: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.regular,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default EmptyState;
